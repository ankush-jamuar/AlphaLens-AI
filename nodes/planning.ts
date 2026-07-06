import type { GraphState } from "@/langgraph";
import { planningPrompt } from "@/prompts/planning";
import { geminiService } from "@/services/gemini.service";
import { fetchAlphaVantage } from "@/services/financial.service";
import { z } from "zod";

interface SymbolSearchMatch {
  "1. symbol"?: string;
  "2. name"?: string;
  "3. type"?: string;
  "4. region"?: string;
  "9. matchScore"?: string;
}

function rankSymbolMatches(matches: SymbolSearchMatch[], inputQuery: string): SymbolSearchMatch | null {
  if (!matches || matches.length === 0) return null;
  
  const normalizedQuery = inputQuery.trim().toLowerCase();
  
  // Exclude REIT, ETF, Fund, ADR, CDR, Preferred Shares unless explicitly requested
  const excludes = ["reit", "etf", "fund", "adr", "cdr", "preferred", "depository receipt", "depositary receipt"];
  const includesUnwanted = excludes.some((term) => normalizedQuery.includes(term));
  
  let filtered = matches;
  if (!includesUnwanted) {
    filtered = matches.filter((match) => {
      const name = (match["2. name"] || "").toLowerCase();
      const symbol = (match["1. symbol"] || "").toLowerCase();
      const type = (match["3. type"] || "").toLowerCase();
      
      const isUnwantedType = excludes.some((term) => 
        type.includes(term) || name.includes(term) || symbol.includes(term)
      );
      return !isUnwantedType;
    });
    
    if (filtered.length === 0) {
      filtered = matches;
    }
  }
  
  const scored = filtered.map((match) => {
    const symbol = (match["1. symbol"] || "").toLowerCase();
    const name = (match["2. name"] || "").toLowerCase();
    const region = (match["4. region"] || "").toLowerCase();
    const matchScore = parseFloat(match["9. matchScore"] || "0");
    
    let score = matchScore * 100;
    
    // Boost exact ticker matches
    if (symbol === normalizedQuery) {
      score += 1000;
    }
    
    // Boost exact name matches
    if (name === normalizedQuery) {
      score += 800;
    } else if (name.includes(normalizedQuery)) {
      score += 300;
    }
    
    // Prefer major US exchanges
    if (region.includes("united states") || region.includes("us") || region.includes("nasdaq") || region.includes("nyse")) {
      score += 200;
    }
    
    return { match, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0].match;
}

/**
 * Planning Node
 * Validates the input company name, normalizes it using Gemini, and maps it to the best matching public company ticker.
 */
export async function planningNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[Planning] Planning node started.");
  const companyName = state.companyName?.trim();
  
  if (!companyName || companyName.length < 2) {
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Planning Node took ${duration}ms`);
    return {
      errors: ["INVALID_COMPANY_NAME: Company name must be at least 2 characters long."],
    };
  }

  // 1. Use Gemini to normalize the input name and identify ticker candidates
  let resolvedName = companyName;
  let resolvedTicker: string | undefined = undefined;

  try {
    const schema = z.object({
      companyName: z.string(),
      ticker: z.string().optional(),
    });
    
    const promptText = planningPrompt(companyName);
    const result = await geminiService.generateStructured<{ companyName: string; ticker?: string }>(promptText, schema);
    
    resolvedName = result.companyName || companyName;
    resolvedTicker = result.ticker || undefined;
  } catch (error) {
    console.warn("[Planning] Gemini normalization failed, falling back to input name:", error);
  }

  // 2. Perform Alpha Vantage Symbol Search to ensure correct public company ticker selection
  try {
    const searchKeywords = resolvedTicker || resolvedName;
    const searchResult = await fetchAlphaVantage({
      function: "SYMBOL_SEARCH",
      keywords: searchKeywords,
    });
    
    const bestMatches = (searchResult.bestMatches || []) as SymbolSearchMatch[];
    const bestMatch = rankSymbolMatches(bestMatches, searchKeywords);
    
    if (bestMatch) {
      const ticker = bestMatch["1. symbol"];
      const officialName = bestMatch["2. name"] || resolvedName;
      
      console.log(`[Planning] Company normalized. Resolved: ${officialName} (${ticker})`);
      const duration = Date.now() - startTime;
      console.log(`[PerformanceMetrics] Planning Node took ${duration}ms`);
      return {
        companyName: officialName,
        ticker: ticker || undefined,
        errors: [],
      };
    }
  } catch (error) {
    console.warn(`[Planning] Symbol search resolution failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  const capitalizedFallback = resolvedName
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  console.log(`[Planning] Company normalized. Using fallback name: ${capitalizedFallback} (${resolvedTicker}).`);
  const duration = Date.now() - startTime;
  console.log(`[PerformanceMetrics] Planning Node took ${duration}ms`);
  return {
    companyName: capitalizedFallback,
    ticker: resolvedTicker,
    errors: [],
  };
}
