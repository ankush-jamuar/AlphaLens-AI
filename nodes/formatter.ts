import type { GraphState } from "@/langgraph";
import type { InvestmentReport, Source } from "@/types";

/**
 * Report Formatter Node
 * Pure TypeScript node that compiles the GraphState values into the final frontend-ready InvestmentReport.
 * No Gemini/LLM calls.
 */
export async function formatterNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting Report formatter node...");
  
  const profile = state.companyProfile;
  const financials = state.financialData;
  const market = state.marketAnalysis;
  const news = state.news ?? [];
  const evidence = state.evidence;
  const recommendation = state.recommendation;

  // Build the list of sources based on fetched news URLs
  const sources: Source[] = [];
  news.forEach((item) => {
    if (item.url && item.url !== "https://finance.yahoo.com" && item.url !== "https://gnews.io") {
      sources.push({
        title: item.title,
        url: item.url,
      });
    }
  });

  // Always include standard source documentation citations as fallback
  if (sources.length === 0) {
    if (profile?.ticker) {
      sources.push({
        title: `${profile.name} (${profile.ticker}) Financial Statements — Alpha Vantage`,
        url: `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${profile.ticker}`,
      });
    }
    sources.push({
      title: "Market General News Intelligence Search — GNews API",
      url: "https://gnews.io",
    });
  }

  const report: InvestmentReport = {
    id: `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    company: profile ?? {
      name: state.companyName,
      industry: "Unavailable",
      headquarters: "Unavailable",
      description: "Company overview details are currently unavailable.",
    },
    financials: financials ?? {
      revenue: "Unavailable",
      netIncome: "Unavailable",
      eps: "Unavailable",
      peRatio: "Unavailable",
      debt: "Unavailable",
      cashFlow: "Unavailable",
    },
    market: market ?? {
      strengths: [],
      weaknesses: [],
      competitors: [],
    },
    news: news,
    risks: evidence?.riskFactors ?? ["No specific risk factors recorded."],
    opportunities: evidence?.growthCatalysts ?? ["No specific growth opportunities recorded."],
    recommendation: recommendation ?? {
      decision: "Watch",
      score: 50,
      confidence: 50,
      thesis: "Full recommendation thesis details could not be resolved.",
      positives: [],
      negatives: [],
    },
    sources: sources.slice(0, 5), // Keep only top 5 sources
  };

  const duration = Date.now() - startTime;
  console.log(`[PerformanceMetrics] Formatter Node took ${duration}ms`);
  console.log("[LangGraph] Report formatter complete.");

  return {
    report,
  };
}
