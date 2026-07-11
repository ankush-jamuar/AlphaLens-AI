import type { GraphState } from "@/langgraph";
import type { MarketAnalysis } from "@/types";

/**
 * Market Assessment Node
 * Deterministically evaluates competitive positioning, strengths, weaknesses, and key competitors.
 * Pure TypeScript (no Gemini/LLMs).
 */
export async function marketNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[Market] Starting deterministic Market assessment node...");

  const profile = state.companyProfile;
  const financials = state.financialData;
  const news = state.news ?? [];

  const name = profile?.name || state.companyName;
  const industry = profile?.industry || "Unavailable";
  const headquarters = profile?.headquarters || "Unavailable";
  const marketCap = profile?.marketCap || "Unavailable";

  // Derive Strengths
  const strengths: string[] = [];
  if (marketCap !== "Unavailable") {
    strengths.push(`Significant market capitalization of ${marketCap}, providing strong capital access and operational scale.`);
  }
  if (financials?.netIncome && financials.netIncome !== "Unavailable" && !financials.netIncome.startsWith("-")) {
    strengths.push(`Demonstrated profitability with a net income of ${financials.netIncome}.`);
  }
  if (financials?.cashFlow && financials.cashFlow !== "Unavailable" && !financials.cashFlow.startsWith("-")) {
    strengths.push(`Solid free cash flow generation capacity (${financials.cashFlow}) to support capital expenditures.`);
  }
  if (industry !== "Unavailable") {
    strengths.push(`Established market footprint and distribution networks within the ${industry} sector.`);
  }
  if (strengths.length < 3) {
    strengths.push(`Robust corporate structure and governance based in ${headquarters}.`);
  }

  // Derive Weaknesses
  const weaknesses: string[] = [];
  if (financials?.debt && financials.debt !== "Unavailable" && financials.debt !== "$0.00B") {
    weaknesses.push(`Outstanding debt obligations of ${financials.debt}, requiring continuous cash interest payments.`);
  }
  if (financials?.peRatio && financials.peRatio !== "Unavailable") {
    const pe = parseFloat(financials.peRatio);
    if (!isNaN(pe) && pe > 30) {
      weaknesses.push(`Elevated premium valuation (P/E of ${financials.peRatio}) that leaves the stock price vulnerable to growth misses.`);
    }
  }
  const negativeNews = news.filter(n => n.impact === "Negative");
  if (negativeNews.length > 0) {
    weaknesses.push(`Exposure to recent adverse news developments, including: "${negativeNews[0].title}".`);
  }
  weaknesses.push(`Susceptibility to global macroeconomic cycles, inflation, and currency exchange fluctuations.`);
  if (weaknesses.length < 3) {
    weaknesses.push(`Intense price competition and tech-disruption risks in the core ${industry} space.`);
  }

  // Derive Competitors based on industry and company name keywords
  let competitors: string[] = [];
  const lowerName = name.toLowerCase();
  const lowerIndustry = industry.toLowerCase();

  if (lowerName.includes("nvidia") || lowerName.includes("nvda")) {
    competitors = ["Advanced Micro Devices (AMD)", "Intel Corporation", "Taiwan Semiconductor (TSMC)"];
  } else if (lowerName.includes("microsoft") || lowerName.includes("msft")) {
    competitors = ["Alphabet Inc.", "Amazon Web Services (AWS)", "Apple Inc.", "Meta Platforms"];
  } else if (lowerName.includes("alphabet") || lowerName.includes("google") || lowerName.includes("goog")) {
    competitors = ["Microsoft Corporation", "Meta Platforms", "Apple Inc.", "Amazon.com"];
  } else if (lowerName.includes("apple") || lowerName.includes("aapl")) {
    competitors = ["Samsung Electronics", "Alphabet Inc.", "Microsoft Corporation"];
  } else if (lowerName.includes("meta")) {
    competitors = ["Alphabet Inc.", "TikTok (ByteDance)", "Snap Inc.", "Pinterest Inc."];
  } else if (lowerName.includes("tesla") || lowerName.includes("tsla")) {
    competitors = ["BYD Company", "Toyota Motor Corporation", "Ford Motor Company", "General Motors"];
  } else if (lowerName.includes("amazon") || lowerName.includes("amzn")) {
    competitors = ["Walmart Inc.", "Alibaba Group", "Shopify Inc.", "Microsoft Corporation"];
  } else if (lowerName.includes("reliance")) {
    competitors = ["Adani Group", "Tata Group", "Indian Oil Corporation"];
  } else if (lowerName.includes("infosys")) {
    competitors = ["Tata Consultancy Services (TCS)", "Accenture plc", "Wipro Limited", "Cognizant"];
  } else if (lowerName.includes("tata consultancy") || lowerName.includes("tcs")) {
    competitors = ["Infosys Limited", "Accenture plc", "Wipro Limited", "Cognizant"];
  } else {
    // General industry fallbacks
    if (lowerIndustry.includes("tech") || lowerIndustry.includes("software")) {
      competitors = ["Microsoft Corporation", "Alphabet Inc.", "Amazon.com"];
    } else if (lowerIndustry.includes("consult") || lowerIndustry.includes("service")) {
      competitors = ["Accenture plc", "Cognizant", "Infosys Limited"];
    } else if (lowerIndustry.includes("financial") || lowerIndustry.includes("bank")) {
      competitors = ["JPMorgan Chase & Co.", "Bank of America", "Goldman Sachs"];
    } else {
      competitors = [`Major ${industry} Peer`, `Leading ${industry} Competitor`, `Global ${industry} Player`];
    }
  }

  const marketAnalysis: MarketAnalysis = {
    strengths,
    weaknesses,
    competitors,
  };

  const duration = Date.now() - startTime;
  console.log(`[PerformanceMetrics] Market Node took ${duration}ms`);
  return {
    marketAnalysis,
  };
}
