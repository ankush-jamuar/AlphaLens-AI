import type { GraphState } from "@/langgraph";
import type { EvidenceSummary } from "@/types";

/**
 * Evidence Aggregation Node
 * Programmatically combines data from preceding nodes into an EvidenceSummary object.
 * Does not call Gemini/LLM.
 */
export async function evidenceNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting Evidence aggregation node...");
  
  const profile = state.companyProfile;
  const financials = state.financialData;
  const news = state.news ?? [];
  const market = state.marketAnalysis;

  const keyFacts: string[] = [];
  if (profile) {
    keyFacts.push(`Company Name: ${profile.name}`);
    if (profile.ticker) keyFacts.push(`Ticker: ${profile.ticker}`);
    keyFacts.push(`Industry: ${profile.industry}`);
    keyFacts.push(`Headquarters: ${profile.headquarters}`);
    keyFacts.push(`Description: ${profile.description}`);
    if (profile.marketCap) keyFacts.push(`Market Cap: ${profile.marketCap}`);
  } else {
    keyFacts.push(`Company Name: ${state.companyName}`);
  }

  const financialHighlights: string[] = [];
  if (financials) {
    financialHighlights.push(`Revenue: ${financials.revenue || "Unavailable"}`);
    financialHighlights.push(`Net Income: ${financials.netIncome || "Unavailable"}`);
    financialHighlights.push(`EPS: ${financials.eps || "Unavailable"}`);
    financialHighlights.push(`P/E Ratio: ${financials.peRatio || "Unavailable"}`);
    financialHighlights.push(`Debt: ${financials.debt || "Unavailable"}`);
    financialHighlights.push(`Cash Flow: ${financials.cashFlow || "Unavailable"}`);
  }

  // Preserve news developments in the highlights
  const newsHighlights = news.map(
    (item) => `Title: ${item.title} | Date: ${item.publishedDate || "N/A"} | URL: ${item.url || "N/A"} | Sentiment: ${item.impact} — ${item.summary}`
  );

  const marketInsights: string[] = [];
  if (market) {
    if (market.strengths?.length) marketInsights.push(`Strengths: ${market.strengths.join(" | ")}`);
    if (market.weaknesses?.length) marketInsights.push(`Weaknesses: ${market.weaknesses.join(" | ")}`);
    if (market.competitors?.length) marketInsights.push(`Competitors: ${market.competitors.join(", ")}`);
  }

  // Derive initial risk factors and growth catalysts programmatically
  const riskFactors: string[] = [];
  const growthCatalysts: string[] = [];

  if (market) {
    market.weaknesses?.forEach((w) => riskFactors.push(w));
    market.strengths?.forEach((s) => growthCatalysts.push(s));
  }

  if (financials?.debt && financials.debt !== "Unavailable" && financials.debt !== "$0.00B") {
    riskFactors.push(`Leverage profile: Outstanding debt level is ${financials.debt}`);
  }

  news.forEach((item) => {
    if (item.impact === "Negative") {
      riskFactors.push(`Adverse News: ${item.title}`);
    } else if (item.impact === "Positive") {
      growthCatalysts.push(`Favorable News: ${item.title}`);
    }
  });

  if (riskFactors.length === 0) {
    riskFactors.push("No significant risk factors identified during research.");
  }
  if (growthCatalysts.length === 0) {
    growthCatalysts.push("No significant growth catalysts identified during research.");
  }

  const evidence: EvidenceSummary = {
    keyFacts,
    financialHighlights,
    newsHighlights,
    marketInsights,
    riskFactors,
    growthCatalysts,
  };

  const duration = Date.now() - startTime;
  console.log(`[PerformanceMetrics] Evidence Node took ${duration}ms`);
  return {
    evidence,
  };
}
