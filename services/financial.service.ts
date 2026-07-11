import type { FinancialData } from "@/types";

export interface AlphaVantageOverview {
  RevenueTTM?: string;
  EPS?: string;
  PERatio?: string;
  Name?: string;
  Symbol?: string;
  Industry?: string;
  Country?: string;
  City?: string;
  Description?: string;
  MarketCapitalization?: string;
}

interface AlphaVantageReport {
  totalRevenue?: string;
  netIncome?: string;
  shortLongTermDebtTotal?: string;
  longTermDebt?: string;
  operatingCashflow?: string;
}

interface AlphaVantageStatements {
  annualReports?: AlphaVantageReport[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Low-level Alpha Vantage API cache and in-progress request maps
const alphaVantageCache = new Map<string, CacheEntry<Record<string, unknown>>>();
const alphaVantageInProgress = new Map<string, Promise<Record<string, unknown>>>();

// High-level FinancialData service cache map
const financialDataCache = new Map<string, CacheEntry<FinancialData>>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number,
  serviceName: string
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const errStr = error instanceof Error ? error.message : String(error);
      const isTransient = 
        !errStr.includes("429") && 
        !errStr.includes("RATE_LIMIT") && 
        !errStr.includes("401") && 
        !errStr.includes("403") && 
        !errStr.toLowerCase().includes("api key") &&
        !errStr.toLowerCase().includes("unauthorized") &&
        !errStr.toLowerCase().includes("quota") &&
        !errStr.toLowerCase().includes("limit");

      if (attempt > retries || !isTransient) {
        throw error;
      }
      const waitTime = delayMs;
      console.warn(`[${serviceName}] Transient failure (attempt ${attempt}). Retrying in ${waitTime}ms... Error: ${errStr}`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Shared helper to make a query to Alpha Vantage.
 * Performs timeout protection (15s), in-memory caching, in-progress promise sharing, and 1 retry.
 */
export async function fetchAlphaVantage(params: Record<string, string>): Promise<Record<string, unknown>> {
  const symbol = (params.symbol || "").trim().toUpperCase();
  const func = params.function || "";
  const cacheKey = `${func}:${symbol}`;

  // Check cache
  if (symbol && func) {
    const entry = alphaVantageCache.get(cacheKey);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      console.log(`[Financial] Using cached raw response for ${func}:${symbol}`);
      return entry.data;
    }
  }

  // Check in-progress requests to prevent duplicate concurrent calls
  if (symbol && func) {
    const active = alphaVantageInProgress.get(cacheKey);
    if (active) {
      return active;
    }
  }

  const requestFn = async () => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.FINANCIAL_API_KEY;
    if (!apiKey) {
      throw new Error("ALPHA_VANTAGE_API_KEY environment variable is not configured.");
    }
    const query = new URLSearchParams({ ...params, apikey: apiKey }).toString();
    const url = `https://www.alphavantage.co/query?${query}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      console.log(`[Financial] Alpha Vantage request for ${func}:${symbol}`);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;

      if (data.Note || data.Information || data["Error Message"]) {
        const details = (data.Note || data.Information || data["Error Message"]) as string;
        if (details.toLowerCase().includes("rate limit") || details.toLowerCase().includes("call frequency")) {
          throw new Error("RATE_LIMIT");
        }
        throw new Error(details);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const promise = retry(requestFn, 1, 1000, "FinancialService")
    .then((data) => {
      if (symbol && func) {
        alphaVantageCache.set(cacheKey, { data, timestamp: Date.now() });
        alphaVantageInProgress.delete(cacheKey);
      }
      return data;
    })
    .catch((error) => {
      if (symbol && func) {
        alphaVantageInProgress.delete(cacheKey);
      }
      throw error;
    });

  if (symbol && func) {
    alphaVantageInProgress.set(cacheKey, promise);
  }

  return promise;
}

/**
 * Financial Data Service Wrapper
 * Fetches company financial statements from Alpha Vantage using the resolved ticker.
 * Graceful degradation without Gemini.
 */
export interface FinancialService {
  getFinancialData(companyName: string, ticker?: string): Promise<FinancialData>;
}

export class FinancialServiceImpl implements FinancialService {
  async getFinancialData(companyName: string, ticker?: string): Promise<FinancialData> {
    const symbol = (ticker || "").trim().toUpperCase();
    const cacheKey = symbol || companyName.trim().toLowerCase();

    // Check cached FinancialData
    if (cacheKey) {
      const cachedEntry = financialDataCache.get(cacheKey);
      if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
        console.log(`[Financial] Cache hit for key: ${cacheKey}`);
        return cachedEntry.data;
      }
    }

    if (!symbol) {
      console.warn("[Financial] No resolved ticker available. Returning default financial details.");
      return this.getFallbackFinancials();
    }

    // Default values representing graceful degradation
    let revenue: string = "Unavailable";
    let netIncome: string = "Unavailable";
    let eps: string = "Unavailable";
    let peRatio: string = "Unavailable";
    let debt: string = "Unavailable";
    let cashFlow: string = "Unavailable";

    // 1. Fetch Overview (for EPS, PE, and fallback Revenue)
    try {
      console.log(`[Financial] Fetching OVERVIEW for ${symbol}`);
      const overviewResult = await fetchAlphaVantage({ function: "OVERVIEW", symbol });
      const overview = overviewResult as AlphaVantageOverview;
      
      if (overview.EPS) eps = overview.EPS;
      if (overview.PERatio) peRatio = overview.PERatio;
      if (overview.RevenueTTM) {
        revenue = `$${(Number(overview.RevenueTTM) / 1e9).toFixed(2)}B`;
      }
    } catch (e) {
      console.warn(`[Financial] OVERVIEW query failed for ${symbol}:`, e);
    }

    // 2. Fetch Income Statement (for actual Revenue and Net Income)
    try {
      console.log(`[Financial] Fetching INCOME_STATEMENT for ${symbol}`);
      const incomeStatementResult = await fetchAlphaVantage({ function: "INCOME_STATEMENT", symbol });
      const incomeStatement = incomeStatementResult as AlphaVantageStatements;
      const annualReports = incomeStatement.annualReports || [];
      if (annualReports.length > 0) {
        const latestReport = annualReports[0];
        if (latestReport.totalRevenue) {
          revenue = `$${(Number(latestReport.totalRevenue) / 1e9).toFixed(2)}B`;
        }
        if (latestReport.netIncome) {
          netIncome = `$${(Number(latestReport.netIncome) / 1e9).toFixed(2)}B`;
        }
      }
    } catch (e) {
      console.warn(`[Financial] INCOME_STATEMENT failed for ${symbol}:`, e);
    }

    // 3. Fetch Balance Sheet (for Debt)
    try {
      console.log(`[Financial] Fetching BALANCE_SHEET for ${symbol}`);
      const balanceSheetResult = await fetchAlphaVantage({ function: "BALANCE_SHEET", symbol });
      const balanceSheet = balanceSheetResult as AlphaVantageStatements;
      const annualReports = balanceSheet.annualReports || [];
      if (annualReports.length > 0) {
        const latestReport = annualReports[0];
        const shortDebt = Number(latestReport.shortLongTermDebtTotal || 0);
        const longDebt = Number(latestReport.longTermDebt || 0);
        const totalDebt = shortDebt + longDebt;
        if (totalDebt > 0) {
          debt = `$${(totalDebt / 1e9).toFixed(2)}B`;
        } else if (latestReport.longTermDebt) {
          debt = `$${(longDebt / 1e9).toFixed(2)}B`;
        }
      }
    } catch (e) {
      console.warn(`[Financial] BALANCE_SHEET failed for ${symbol}:`, e);
    }

    // 4. Fetch Cash Flow Statement (for Operating Cash Flow)
    try {
      console.log(`[Financial] Fetching CASH_FLOW for ${symbol}`);
      const cashFlowStatementResult = await fetchAlphaVantage({ function: "CASH_FLOW", symbol });
      const cashFlowStatement = cashFlowStatementResult as AlphaVantageStatements;
      const annualReports = cashFlowStatement.annualReports || [];
      if (annualReports.length > 0) {
        const latestReport = annualReports[0];
        if (latestReport.operatingCashflow) {
          cashFlow = `$${(Number(latestReport.operatingCashflow) / 1e9).toFixed(2)}B`;
        }
      }
    } catch (e) {
      console.warn(`[Financial] CASH_FLOW failed for ${symbol}:`, e);
    }

    const result: FinancialData = {
      revenue,
      netIncome,
      eps,
      peRatio,
      debt,
      cashFlow,
    };

    // Cache the result if any fields are valid (i.e. not all are "Unavailable")
    const hasValidData = Object.values(result).some((v) => v !== "Unavailable");
    if (hasValidData && cacheKey) {
      financialDataCache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;
  }

  private getFallbackFinancials(): FinancialData {
    return {
      revenue: "Unavailable",
      netIncome: "Unavailable",
      eps: "Unavailable",
      peRatio: "Unavailable",
      debt: "Unavailable",
      cashFlow: "Unavailable",
    };
  }
}

export const financialService = new FinancialServiceImpl();
