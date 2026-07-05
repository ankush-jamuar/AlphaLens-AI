import type { GraphState } from "@/types";

/**
 * Report Formatter Prompt Template
 * Normalizes graph state into final frontend-ready structured InvestmentReport.
 */
export function formatterPrompt(state: GraphState): string {
  return `Format the completed investment research for "${state.companyName}" into a structured frontend-ready JSON report.
State details:
${JSON.stringify(state, null, 2)}

Return a JSON object matching the InvestmentReport interface:
{
  "company": { ... },
  "financials": { ... },
  "market": { ... },
  "news": [ ... ],
  "risks": [ ... ],
  "opportunities": [ ... ],
  "recommendation": { ... },
  "sources": [ ... ]
}`;
}
