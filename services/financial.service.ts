import type { FinancialData } from "@/types";
import { geminiService } from "./gemini.service";
import { financialPrompt } from "@/prompts/financial";
import { z } from "zod";

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
  const symbol = (params.symbol || "").trim().toLowerCase();
  const func = params.function || "";
  const cacheKey = `${func}:${symbol}`;

  // Check cache
  if (symbol && func) {
    const entry = alphaVantageCache.get(cacheKey);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      console.log(`[Financial] Using cached response for ${func}.`);
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
      console.log(`[Financial] Alpha Vantage request for ${func}.`);
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
 * Fetches company financial statements from Alpha Vantage with structured Gemini fallbacks.
 */
export interface FinancialService {
  getFinancialData(companyName: string, ticker?: string): Promise<FinancialData>;
}

export class FinancialServiceImpl implements FinancialService {
  async getFinancialData(companyName: string, ticker?: string): Promise<FinancialData> {
    const key = companyName.trim().toLowerCase();
    
    // Check cached FinancialData
    const cachedEntry = financialDataCache.get(key);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_TTL) {
      console.log("[Financial] Cache hit.");
      return cachedEntry.data;
    }

    const symbol = ticker || companyName;
    try {
      // Fetch overview data (contains basic metrics)
      const overviewResult = await fetchAlphaVantage({ function: "OVERVIEW", symbol });
      const overview = overviewResult as AlphaVantageOverview;
      
      let revenue = overview.RevenueTTM ? `$${(Number(overview.RevenueTTM) / 1e9).toFixed(2)}B` : undefined;
      const eps = overview.EPS || undefined;
      const peRatio = overview.PERatio || undefined;
      let netIncome = undefined;
      let debt = undefined;
      let cashFlow = undefined;

      // Try fetching Income Statement
      try {
        const incomeStatementResult = await fetchAlphaVantage({ function: "INCOME_STATEMENT", symbol });
        const incomeStatement = incomeStatementResult as AlphaVantageStatements;
        const annualReports = incomeStatement.annualReports || [];
        if (annualReports.length > 0) {
          const latestReport = annualReports[0];
          revenue = revenue || (latestReport.totalRevenue ? `$${(Number(latestReport.totalRevenue) / 1e9).toFixed(2)}B` : undefined);
          netIncome = latestReport.netIncome ? `$${(Number(latestReport.netIncome) / 1e9).toFixed(2)}B` : undefined;
        }
      } catch (e) {
        console.warn("Alpha Vantage INCOME_STATEMENT failed:", e);
      }

      // Try fetching Balance Sheet
      try {
        const balanceSheetResult = await fetchAlphaVantage({ function: "BALANCE_SHEET", symbol });
        const balanceSheet = balanceSheetResult as AlphaVantageStatements;
        const annualReports = balanceSheet.annualReports || [];
        if (annualReports.length > 0) {
          const latestReport = annualReports[0];
          const totalDebt = Number(latestReport.shortLongTermDebtTotal || 0) + Number(latestReport.longTermDebt || 0);
          debt = totalDebt > 0 ? `$${(totalDebt / 1e9).toFixed(2)}B` : undefined;
        }
      } catch (e) {
        console.warn("Alpha Vantage BALANCE_SHEET failed:", e);
      }

      // Try fetching Cash Flow Statement
      try {
        const cashFlowStatementResult = await fetchAlphaVantage({ function: "CASH_FLOW", symbol });
        const cashFlowStatement = cashFlowStatementResult as AlphaVantageStatements;
        const annualReports = cashFlowStatement.annualReports || [];
        if (annualReports.length > 0) {
          const latestReport = annualReports[0];
          cashFlow = latestReport.operatingCashflow ? `$${(Number(latestReport.operatingCashflow) / 1e9).toFixed(2)}B` : undefined;
        }
      } catch (e) {
        console.warn("Alpha Vantage CASH_FLOW failed:", e);
      }

      // If key fields are missing, raise exception to trigger Gemini fallback
      if (!revenue && !eps && !peRatio) {
        throw new Error("Essential financial data missing from Alpha Vantage overview response.");
      }

      // If line-item financial statements failed, fall back to Gemini to fill only the missing fields
      if (!revenue || !netIncome || !eps || !peRatio || !debt || !cashFlow) {
        console.log("[Financial] Missing line-item financial data. Using Gemini fallback for missing fields.");
        const geminiResult = await this.getGeminiFinancialsFallback(companyName, symbol, revenue, eps, peRatio);
        const result: FinancialData = {
          revenue: revenue || geminiResult.revenue || "Not Available",
          netIncome: netIncome || geminiResult.netIncome || "Not Available",
          eps: eps || geminiResult.eps || "Not Available",
          peRatio: peRatio || geminiResult.peRatio || "Not Available",
          debt: debt || geminiResult.debt || "Not Available",
          cashFlow: cashFlow || geminiResult.cashFlow || "Not Available",
        };
        financialDataCache.set(key, { data: result, timestamp: Date.now() });
        return result;
      }

      const result: FinancialData = {
        revenue,
        netIncome,
        eps,
        peRatio,
        debt,
        cashFlow,
      };

      financialDataCache.set(key, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      if (errMessage.includes("RATE_LIMIT")) {
        console.warn("[Financial] Alpha Vantage rate limit reached. Using Gemini fallback.");
      } else {
        console.warn(`[Financial] Alpha Vantage fetch failed (${errMessage}). Using Gemini fallback.`);
      }

      try {
        const result = await this.getGeminiFinancialsFallback(companyName, symbol);
        financialDataCache.set(key, { data: result, timestamp: Date.now() });
        return result;
      } catch (geminiError) {
        console.error("[Financial] Gemini fallback failed:", geminiError);
        return {
          revenue: "Not Available",
          netIncome: "Not Available",
          eps: "Not Available",
          peRatio: "Not Available",
          debt: "Not Available",
          cashFlow: "Not Available",
        };
      }
    }
  }

  private async getGeminiFinancialsFallback(
    companyName: string,
    symbol: string,
    revenue?: string,
    eps?: string,
    peRatio?: string
  ): Promise<FinancialData> {
    console.log("[Financial] Using Gemini fallback.");
    const schema = z.object({
      revenue: z.string().optional(),
      netIncome: z.string().optional(),
      eps: z.string().optional(),
      peRatio: z.string().optional(),
      debt: z.string().optional(),
      cashFlow: z.string().optional(),
    });

    const basePrompt = financialPrompt(companyName);
    const contextPrompt = `Research and provide key financial metrics for public company "${companyName}" (symbol: ${symbol}).
${revenue ? `Known Revenue: ${revenue}` : ""}
${eps ? `Known EPS: ${eps}` : ""}
${peRatio ? `Known P/E Ratio: ${peRatio}` : ""}
Fill in all missing fields (revenue, netIncome, eps, peRatio, debt, cashFlow) based on their latest annual financial reports.
Format all numbers clearly (e.g. $120.5B, $4.50, 28.5).`;

    const prompt = `${basePrompt}\n\nContext and constraints:\n${contextPrompt}`;
    return await geminiService.generateStructured<FinancialData>(prompt, schema);
  }
}

export const financialService = new FinancialServiceImpl();
