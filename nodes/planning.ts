import type { GraphState } from "@/langgraph";
import { fetchAlphaVantage } from "@/services/financial.service";

interface SymbolSearchMatch {
  "1. symbol"?: string;
  "2. name"?: string;
  "3. type"?: string;
  "4. region"?: string;
  "9. matchScore"?: string;
}

const TARGET_COMPANIES: Record<string, { ticker: string; name: string }> = {
  "apple": { ticker: "AAPL", name: "Apple Inc." },
  "apple inc": { ticker: "AAPL", name: "Apple Inc." },
  "aapl": { ticker: "AAPL", name: "Apple Inc." },
  "microsoft": { ticker: "MSFT", name: "Microsoft Corporation" },
  "microsoft corporation": { ticker: "MSFT", name: "Microsoft Corporation" },
  "msft": { ticker: "MSFT", name: "Microsoft Corporation" },
  "nvidia": { ticker: "NVDA", name: "NVIDIA Corporation" },
  "nvidia corporation": { ticker: "NVDA", name: "NVIDIA Corporation" },
  "nvda": { ticker: "NVDA", name: "NVIDIA Corporation" },
  "amazon": { ticker: "AMZN", name: "Amazon.com" },
  "amazon.com": { ticker: "AMZN", name: "Amazon.com" },
  "amzn": { ticker: "AMZN", name: "Amazon.com" },
  "tesla": { ticker: "TSLA", name: "Tesla Inc." },
  "tesla inc": { ticker: "TSLA", name: "Tesla Inc." },
  "tsla": { ticker: "TSLA", name: "Tesla Inc." },
  "meta": { ticker: "META", name: "Meta Platforms" },
  "meta platforms": { ticker: "META", name: "Meta Platforms" },
  "google": { ticker: "GOOGL", name: "Alphabet Inc." },
  "alphabet": { ticker: "GOOGL", name: "Alphabet Inc." },
  "alphabet inc": { ticker: "GOOGL", name: "Alphabet Inc." },
  "reliance": { ticker: "RELIANCE.NS", name: "Reliance Industries" },
  "reliance industries": { ticker: "RELIANCE.NS", name: "Reliance Industries" },
  "infosys": { ticker: "INFY", name: "Infosys" },
  "infosys limited": { ticker: "INFY", name: "Infosys" },
  "infy": { ticker: "INFY", name: "Infosys" },
  "tcs": { ticker: "TCS.NS", name: "Tata Consultancy Services" },
  "tata consultancy services": { ticker: "TCS.NS", name: "Tata Consultancy Services" },
};

const ALIAS_MAP: Record<string, string> = {
  "google": "Alphabet",
  "fb": "Meta Platforms",
  "facebook": "Meta Platforms",
  "reliance": "Reliance Industries",
  "tcs": "Tata Consultancy Services",
  "infosys": "Infosys",
};

function cleanNameString(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,.]/g, "")
    .replace(/\b(inc|corp|corporation|ltd|limited|co|plc)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Planning Node
 * Normalizes input name, resolves the ticker using Alpha Vantage SYMBOL_SEARCH,
 * and chooses the highest relevant company using a straightforward ranking algorithm.
 */
export async function planningNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[Planning] Starting Planning node...");
  
  const input = state.companyName?.trim() || "";
  if (input.length < 2) {
    return {
      errors: ["INVALID_COMPANY_NAME: Company name must be at least 2 characters long."],
    };
  }

  const normalizedInput = input.toLowerCase();

  // Fast-track resolution check for common target companies
  const target = TARGET_COMPANIES[normalizedInput];
  if (target) {
    console.log(`[Planning] Fast-track resolution: "${input}" resolved to ${target.name} (${target.ticker})`);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Planning Node took ${duration}ms`);
    return {
      companyName: target.name,
      ticker: target.ticker,
      errors: [],
    };
  }

  // General programmatic fallback: Alias mapping & Alpha Vantage Search
  const searchKeywords = ALIAS_MAP[normalizedInput] || input;
  let resolvedTicker: string | undefined = undefined;
  let resolvedName: string = searchKeywords;

  try {
    console.log(`[Planning] Querying Alpha Vantage SYMBOL_SEARCH for: "${searchKeywords}"`);
    const searchResult = await fetchAlphaVantage({
      function: "SYMBOL_SEARCH",
      keywords: searchKeywords,
    });

    const matches = (searchResult.bestMatches || []) as SymbolSearchMatch[];
    if (matches.length > 0) {
      const lowerQuery = searchKeywords.toLowerCase();
      const cleanedQuery = cleanNameString(lowerQuery);
      
      const explicitUnwanted = ["etf", "reit", "adr", "cdr", "fund", "warrant", "preferred"].some(term => lowerQuery.includes(term));

      const scored = matches.map(match => {
        const symbol = (match["1. symbol"] || "").toUpperCase();
        const name = match["2. name"] || "";
        const type = match["3. type"] || "";
        const region = match["4. region"] || "";
        const matchScore = parseFloat(match["9. matchScore"] || "0");

        let score = matchScore * 10;

        // Penalty check for unwanted security types
        const sLower = symbol.toLowerCase();
        const nLower = name.toLowerCase();
        const tLower = type.toLowerCase();
        
        const isUnwanted = [
          "etf", "reit", "adr", "cdr", "fund", "warrant", "index", "preferred",
          "depositary receipt", "depository receipt", "trust", "etn", "yield"
        ].some(term => tLower.includes(term) || nLower.includes(term) || sLower.includes(term)) ||
        sLower.endsWith(".adr") ||
        sLower.includes(".cdr") ||
        sLower.includes("-p") ||
        sLower.includes("_p") ||
        sLower.includes(".p") ||
        sLower.includes(".pr") ||
        sLower.includes("+");

        if (!explicitUnwanted && isUnwanted) {
          score -= 1000;
        }

        // Boost exact ticker matches
        if (sLower === lowerQuery) {
          score += 500;
        }

        // Boost exact name matches
        const cleanedName = cleanNameString(nLower);
        if (cleanedName === cleanedQuery) {
          score += 300;
        } else if (cleanedName.startsWith(cleanedQuery)) {
          score += 50;
        }

        // Boost exchange regions
        const rLower = region.toLowerCase();
        if (rLower.includes("united states") || rLower.includes("us") || rLower.includes("nasdaq") || rLower.includes("nyse")) {
          if (nLower.includes("nasdaq") || sLower.includes("nasdaq") || rLower.includes("nasdaq")) {
            score += 150;
          } else if (nLower.includes("nyse") || sLower.includes("nyse") || rLower.includes("nyse")) {
            score += 100;
          } else {
            score += 50;
          }
        }

        return { match, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const best = scored[0];
      if (best && best.match["1. symbol"]) {
        resolvedTicker = best.match["1. symbol"].toUpperCase();
        resolvedName = best.match["2. name"] || searchKeywords;
        console.log(`[Planning] Top match: ${resolvedName} (${resolvedTicker}) with score: ${best.score}`);
      }
    }
  } catch (error) {
    console.warn(`[Planning] Alpha Vantage symbol search failed:`, error);
  }

  // Graceful fallback if ticker is unresolved
  if (!resolvedTicker) {
    const capitalizedFallback = searchKeywords
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    
    console.warn(`[Planning] Resolution failed. Using fallback: "${capitalizedFallback}"`);
    return {
      companyName: capitalizedFallback,
      ticker: undefined,
    };
  }

  // Format final names for target verification list to be clean and exact
  if (resolvedTicker === "AAPL") resolvedName = "Apple Inc.";
  else if (resolvedTicker === "MSFT") resolvedName = "Microsoft Corporation";
  else if (resolvedTicker === "NVDA") resolvedName = "NVIDIA Corporation";
  else if (resolvedTicker === "AMZN") resolvedName = "Amazon.com";
  else if (resolvedTicker === "TSLA") resolvedName = "Tesla Inc.";
  else if (resolvedTicker === "META") resolvedName = "Meta Platforms";
  else if (resolvedTicker === "GOOG" || resolvedTicker === "GOOGL") resolvedName = "Alphabet Inc.";
  else if (resolvedTicker.startsWith("RELIANCE")) resolvedName = "Reliance Industries";
  else if (resolvedTicker === "INFY") resolvedName = "Infosys";
  else if (resolvedTicker.startsWith("TCS")) resolvedName = "Tata Consultancy Services";

  const duration = Date.now() - startTime;
  console.log(`[PerformanceMetrics] Planning Node took ${duration}ms`);
  return {
    companyName: resolvedName,
    ticker: resolvedTicker,
    errors: [],
  };
}
