import type { CompanyProfile } from "@/types";
import { fetchAlphaVantage, type AlphaVantageOverview } from "./financial.service";
import { geminiService } from "./gemini.service";
import { companyPrompt } from "@/prompts/company";
import { z } from "zod";

interface CacheEntry {
  data: CompanyProfile;
  timestamp: number;
}

const companyCache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Company Research Service Wrapper
 * Fetches basic company metadata and details from Alpha Vantage.
 * Uses Gemini as fallback only if Alpha Vantage fails.
 */
export interface CompanyService {
  getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile>;
}

export class CompanyServiceImpl implements CompanyService {
  async getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile> {
    const key = companyName.trim().toLowerCase();
    
    // Check cached profile
    const entry = companyCache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      console.log("[Company] Cache hit.");
      return entry.data;
    }

    const symbol = ticker || companyName;
    try {
      const overviewResult = await fetchAlphaVantage({
        function: "OVERVIEW",
        symbol: symbol,
      });
      const data = overviewResult as AlphaVantageOverview;

      if (!data.Name && !data.Symbol && !data.Description) {
        throw new Error("Invalid response from Alpha Vantage Overview API.");
      }

      const result: CompanyProfile = {
        name: data.Name || companyName,
        ticker: data.Symbol || ticker,
        industry: data.Industry || "Unknown",
        headquarters: data.Country ? `${data.City || ""}, ${data.Country}` : "Unknown",
        description: data.Description || "Overview description not available.",
        marketCap: data.MarketCapitalization ? `$${(Number(data.MarketCapitalization) / 1e9).toFixed(2)}B` : "Not Available",
      };

      companyCache.set(key, { data: result, timestamp: Date.now() });
      return result;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      if (errMessage.includes("RATE_LIMIT")) {
        console.warn("[Company] Alpha Vantage rate limit reached. Using Gemini fallback.");
      } else {
        console.warn(`[Company] Alpha Vantage fetch failed (${errMessage}). Using Gemini fallback.`);
      }

      try {
        const schema = z.object({
          name: z.string(),
          ticker: z.string().optional(),
          industry: z.string(),
          headquarters: z.string(),
          description: z.string(),
          marketCap: z.string().optional(),
        });
        
        const prompt = companyPrompt(companyName);
        const geminiResult = await geminiService.generateStructured<CompanyProfile>(prompt, schema);
        
        const result: CompanyProfile = {
          name: geminiResult.name || companyName,
          ticker: geminiResult.ticker || ticker,
          industry: geminiResult.industry || "Not Available",
          headquarters: geminiResult.headquarters || "Not Available",
          description: geminiResult.description || "Not Available",
          marketCap: geminiResult.marketCap || "Not Available",
        };

        companyCache.set(key, { data: result, timestamp: Date.now() });
        return result;
      } catch (geminiError) {
        console.error("[Company] Gemini fallback failed:", geminiError);
        return {
          name: companyName,
          ticker: ticker,
          industry: "Not Available",
          headquarters: "Not Available",
          description: "Company overview data is currently unavailable.",
          marketCap: "Not Available",
        };
      }
    }
  }
}

export const companyService = new CompanyServiceImpl();
