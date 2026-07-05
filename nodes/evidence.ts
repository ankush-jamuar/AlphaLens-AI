import type { GraphState } from "@/langgraph";

/**
 * Evidence Aggregation Node
 * Combines information from preceding nodes into a unified EvidenceSummary object.
 */
export async function evidenceNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Deduplicate, organize, and synthesize facts into EvidenceSummary
  const keyFacts = [
    `Company Profile resolved for ${state.companyProfile?.name || state.companyName}`,
    `Industry: ${state.companyProfile?.industry || "Unknown"}`,
    `Headquarters: ${state.companyProfile?.headquarters || "Unknown"}`,
  ];

  const financialHighlights = [
    `Revenue: ${state.financialData?.revenue || "Not available"}`,
    `Net Income: ${state.financialData?.netIncome || "Not available"}`,
    `P/E Ratio: ${state.financialData?.peRatio || "Not available"}`,
  ];

  const newsHighlights = (state.news ?? []).map(
    (item) => `${item.title} (Impact: ${item.impact})`
  );

  const marketInsights = [
    `Strengths: ${(state.marketAnalysis?.strengths ?? []).join(", ")}`,
    `Weaknesses: ${(state.marketAnalysis?.weaknesses ?? []).join(", ")}`,
    `Competitors: ${(state.marketAnalysis?.competitors ?? []).join(", ")}`,
  ];

  const riskFactors = [
    "Macroeconomic headwind risks (Placeholder)",
    "Increased market competition risks (Placeholder)",
  ];

  const growthCatalysts = [
    "Expansion into new business verticals (Placeholder)",
    "R&D technological leadership (Placeholder)",
  ];

  return {
    evidence: {
      keyFacts,
      financialHighlights,
      newsHighlights,
      marketInsights,
      riskFactors,
      growthCatalysts,
    },
  };
}
