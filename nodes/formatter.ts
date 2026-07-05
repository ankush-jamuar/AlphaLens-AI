import type { GraphState } from "@/langgraph";
import type { InvestmentReport } from "@/types";

/**
 * Report Formatter Node
 * Formats the accumulated GraphState into a structured, frontend-ready InvestmentReport.
 */
export async function formatterNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Invoke geminiService or build programmatically using state fields
  const report: InvestmentReport = {
    id: `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
    company: state.companyProfile ?? {
      name: state.companyName,
      industry: "Unknown (Placeholder)",
      headquarters: "Unknown (Placeholder)",
      description: "Description not loaded. (Placeholder)",
    },
    financials: state.financialData ?? {},
    market: state.marketAnalysis ?? {
      strengths: [],
      weaknesses: [],
      competitors: [],
    },
    news: state.news ?? [],
    risks: state.evidence?.riskFactors ?? ["Risk factor placeholder"],
    opportunities: state.evidence?.growthCatalysts ?? ["Opportunity factor placeholder"],
    recommendation: state.recommendation ?? {
      decision: "Watch",
      score: 50,
      confidence: 50,
      thesis: "Recommendation not completed. (Placeholder)",
      positives: [],
      negatives: [],
    },
    sources: [
      {
        title: "Financial API (Placeholder)",
        url: "https://example.com/financials",
      },
      {
        title: "News API (Placeholder)",
        url: "https://example.com/news",
      },
    ],
  };

  return {
    report,
  };
}
