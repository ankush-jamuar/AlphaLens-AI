import type { EvidenceSummary } from "@/types";

/**
 * Investment Reasoning Prompt Template
 * Synthesizes all gathered evidence and determines the final recommendation.
 */
export function reasoningPrompt(companyName: string, evidence: EvidenceSummary): string {
  return `You are a senior investment committee member. Evaluate the aggregated evidence for: "${companyName}".
Evidence Summary:
${JSON.stringify(evidence, null, 2)}

Provide an explainable investment recommendation. Include:
1. Decision: "Invest", "Watch", or "Pass"
2. Score: 0-100 (overall investment score)
3. Confidence: 0-100% (confidence in this assessment)
4. Thesis: Comprehensive investment thesis.
5. Key positives: Bulleted list of key positive points.
6. Key negatives/risks: Bulleted list of key risk factors.

Return a JSON object matching this schema:
{
  "decision": "Invest" | "Watch" | "Pass",
  "score": 85,
  "confidence": 90,
  "thesis": "Detailed investment thesis explanation...",
  "positives": ["Positive 1", "Positive 2"],
  "negatives": ["Negative 1", "Negative 2"]
}`;
}
