import type { FinancialData } from "@/types";
import { geminiService } from "./gemini.service";
import { z } from "zod";

/**
 * Shared helper to make a query to Alpha Vantage.
 */
export async function fetchAlphaVantage(params: Record<string, string>): Promise<any> {
  const apiKey = process.env.FINANCIAL_API_KEY;
  if (!apiKey) {
    throw new Error("FINANCIAL_API_KEY environment variable is not configured.");
  }
  const query = new URLSearchParams({ ...params, apikey: apiKey }).toString();
  const url = `https://www.alphavantage.co/query?${query}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Alpha Vantage API request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  if (data.Note || data.Information || data["Error Message"]) {
    const errorDetails = data.Note || data.Information || data["Error Message"];
    throw new Error(`Alpha Vantage API Error: ${errorDetails}`);
  }
  return data;
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
    const symbol = ticker || companyName;
    try {
      // Fetch overview data (contains basic metrics)
      const overview = await fetchAlphaVantage({ function: "OVERVIEW", symbol });
      
      let revenue = overview.RevenueTTM ? `$${(Number(overview.RevenueTTM) / 1e9).toFixed(2)}B` : undefined;
      let eps = overview.EPS || undefined;
      let peRatio = overview.PERatio || undefined;
      let netIncome = undefined;
      let debt = undefined;
      let cashFlow = undefined;

      // Try fetching Income Statement
      try {
        const incomeStatement = await fetchAlphaVantage({ function: "INCOME_STATEMENT", symbol });
        const annualReports = incomeStatement.annualReports || [];
        if (annualReports.length > 0) {
          const latestReport = annualReports[0];
          revenue = revenue || `$${(Number(latestReport.totalRevenue) / 1e9).toFixed(2)}B`;
          netIncome = `$${(Number(latestReport.netIncome) / 1e9).toFixed(2)}B`;
        }
      } catch (e) {
        console.warn("Alpha Vantage INCOME_STATEMENT failed:", e);
      }

      // Try fetching Balance Sheet
      try {
        const balanceSheet = await fetchAlphaVantage({ function: "BALANCE_SHEET", symbol });
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
        const cashFlowStatement = await fetchAlphaVantage({ function: "CASH_FLOW", symbol });
        const annualReports = cashFlowStatement.annualReports || [];
        if (annualReports.length > 0) {
          const latestReport = annualReports[0];
          cashFlow = `$${(Number(latestReport.operatingCashflow) / 1e9).toFixed(2)}B`;
        }
      } catch (e) {
        console.warn("Alpha Vantage CASH_FLOW failed:", e);
      }

      // If key fields are missing, raise exception to trigger Gemini fallback
      if (!revenue && !eps && !peRatio) {
        throw new Error("Essential financial data missing from Alpha Vantage overview response.");
      }

      return {
        revenue: revenue || "Not Available",
        netIncome: netIncome || "Not Available",
        eps: eps || "Not Available",
        peRatio: peRatio || "Not Available",
        debt: debt || "Not Available",
        cashFlow: cashFlow || "Not Available",
      };
    } catch (error) {
      console.warn(`Alpha Vantage financial lookup failed for ${companyName}, falling back to Gemini:`, error);
      
      try {
        const schema = z.object({
          revenue: z.string().optional(),
          netIncome: z.string().optional(),
          eps: z.string().optional(),
          peRatio: z.string().optional(),
          debt: z.string().optional(),
          cashFlow: z.string().optional(),
        });
        
        const prompt = `Research and provide key financial metrics for the public company "${companyName}" (symbol: ${symbol || "N/A"}).
Include estimated metrics: revenue, net income, EPS, P/E ratio, total debt, and operating cash flow for the latest fiscal year.
Return a structured JSON object matching this schema:
{
  "revenue": "e.g. $120.5B",
  "netIncome": "e.g. $25.3B",
  "eps": "e.g. $4.50",
  "peRatio": "e.g. 28.5",
  "debt": "e.g. $15.2B",
  "cashFlow": "e.g. $30.1B"
}`;

        const geminiResult = await geminiService.generateStructuredOutput<FinancialData>(prompt, schema);
        return {
          revenue: geminiResult.revenue || "Not Available",
          netIncome: geminiResult.netIncome || "Not Available",
          eps: geminiResult.eps || "Not Available",
          peRatio: geminiResult.peRatio || "Not Available",
          debt: geminiResult.debt || "Not Available",
          cashFlow: geminiResult.cashFlow || "Not Available",
        };
      } catch (geminiError) {
        console.error("Gemini fallback financial lookup failed:", geminiError);
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
}

export const financialService = new FinancialServiceImpl();
