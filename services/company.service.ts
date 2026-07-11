import type { CompanyProfile } from "@/types";
import { fetchAlphaVantage, type AlphaVantageOverview } from "./financial.service";

interface CacheEntry {
  data: CompanyProfile;
  timestamp: number;
}

const companyCache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Company Research Service Wrapper
 * Fetches basic company metadata and details from Alpha Vantage OVERVIEW using resolved ticker.
 * Graceful degradation if API fails; no Gemini fallbacks.
 */
export interface CompanyService {
  getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile>;
}

export class CompanyServiceImpl implements CompanyService {
  async getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile> {
    const symbol = (ticker || "").trim().toUpperCase();
    const cacheKey = symbol || companyName.trim().toLowerCase();

    // Check cached profile
    if (cacheKey) {
      const entry = companyCache.get(cacheKey);
      if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        console.log(`[Company] Cache hit for key: ${cacheKey}`);
        return entry.data;
      }
    }

    if (!symbol) {
      console.warn("[Company] No ticker resolved. Returning default company profile.");
      return this.getFallbackProfile(companyName, ticker);
    }

    try {
      console.log(`[Company] Querying Alpha Vantage OVERVIEW for symbol: ${symbol}`);
      const overviewResult = await fetchAlphaVantage({
        function: "OVERVIEW",
        symbol: symbol,
      });
      
      const data = overviewResult as AlphaVantageOverview;

      if (!data || (!data.Name && !data.Symbol && !data.Description)) {
        throw new Error("Invalid/empty response from Alpha Vantage Overview API.");
      }

      const result: CompanyProfile = {
        name: data.Name || companyName,
        ticker: data.Symbol || symbol,
        industry: data.Industry || "Unavailable",
        headquarters: data.Country ? `${data.City || ""}, ${data.Country}`.replace(/^,\s*/, "") : "Unavailable",
        description: data.Description || "Business overview details are currently unavailable.",
        marketCap: data.MarketCapitalization ? `$${(Number(data.MarketCapitalization) / 1e9).toFixed(2)}B` : "Unavailable",
      };

      // Only cache valid responses
      if (result.industry !== "Unavailable" || result.description !== "Business overview details are currently unavailable.") {
        companyCache.set(cacheKey, { data: result, timestamp: Date.now() });
      }

      return result;
    } catch (error) {
      console.warn(`[Company] Alpha Vantage overview fetch failed for ${symbol}:`, error);
      return this.getFallbackProfile(companyName, symbol);
    }
  }

  private getFallbackProfile(companyName: string, ticker?: string): CompanyProfile {
    return {
      name: companyName,
      ticker: ticker,
      industry: "Unavailable",
      headquarters: "Unavailable",
      description: "Business overview details are currently unavailable.",
      marketCap: "Unavailable",
    };
  }
}

export const companyService = new CompanyServiceImpl();
