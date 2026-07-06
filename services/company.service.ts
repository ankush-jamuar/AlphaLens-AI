import type { CompanyProfile } from "@/types";
import { fetchAlphaVantage } from "./financial.service";
import { geminiService } from "./gemini.service";
import { z } from "zod";

/**
 * Company Research Service Wrapper
 * Fetches basic company metadata and details from Alpha Vantage.
 */
export interface CompanyService {
  getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile>;
}

export class CompanyServiceImpl implements CompanyService {
  async getCompanyProfile(companyName: string, ticker?: string): Promise<CompanyProfile> {
    const symbol = ticker || companyName;
    try {
      const data = await fetchAlphaVantage({
        function: "OVERVIEW",
        symbol: symbol,
      });

      return {
        name: data.Name || companyName,
        ticker: data.Symbol || ticker,
        industry: data.Industry || "Unknown",
        headquarters: data.Country ? `${data.City || ""}, ${data.Country}` : "Unknown",
        description: data.Description || "Overview description not available.",
        marketCap: data.MarketCapitalization ? `$${(Number(data.MarketCapitalization) / 1e9).toFixed(2)}B` : "Not Available",
      };
    } catch (error) {
      console.warn(`Alpha Vantage OVERVIEW fetch failed for ${companyName}, falling back to Gemini:`, error);
      
      try {
        const schema = z.object({
          name: z.string(),
          ticker: z.string().optional(),
          industry: z.string(),
          headquarters: z.string(),
          description: z.string(),
          marketCap: z.string().optional(),
        });
        
        const prompt = `Research and provide a company profile summary for the public company "${companyName}" (symbol: ${symbol || "N/A"}).
Return a structured JSON object matching this schema:
{
  "name": "Official Company Name",
  "ticker": "TICKER",
  "industry": "Industry Sector",
  "headquarters": "City, State/Country",
  "description": "Short description of the company business model.",
  "marketCap": "Market cap (e.g. $1.5T)"
}`;

        const geminiResult = await geminiService.generateStructuredOutput<CompanyProfile>(prompt, schema);
        return {
          name: geminiResult.name || companyName,
          ticker: geminiResult.ticker || ticker,
          industry: geminiResult.industry || "Not Available",
          headquarters: geminiResult.headquarters || "Not Available",
          description: geminiResult.description || "Not Available",
          marketCap: geminiResult.marketCap || "Not Available",
        };
      } catch (geminiError) {
        console.error("Gemini company profile fallback generation failed:", geminiError);
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
