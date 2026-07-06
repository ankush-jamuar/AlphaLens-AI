import type { EvidenceSummary } from "@/types";

/**
 * Investment Reasoning Prompt Template
 * Synthesizes all gathered evidence and determines the final recommendation.
 */
export function reasoningPrompt(companyName: string, evidence: EvidenceSummary): string {
  return `You are a senior investment committee member. Evaluate the aggregated evidence for: "${companyName}".
Evidence Summary:
${JSON.stringify(evidence, null, 2)}

Provide an explainable investment recommendation and evaluation.
Return a structured JSON object matching this schema:
{
  "decision": "Invest" | "Watch" | "Pass",
  "score": 0-100 (overall investment score),
  "confidence": 0-100 (overall confidence score),
  "evidenceQuality": "High" | "Medium" | "Low",
  "financialConfidence": 0-100 (confidence in financial statements),
  "marketConfidence": 0-100 (confidence in market analysis),
  "newsConfidence": 0-100 (confidence in recent news),
  "thesis": "Detailed investment thesis explanation...",
  "positives": ["Positive factor 1", "Positive factor 2"],
  "negatives": ["Negative/Risk factor 1", "Negative/Risk factor 2"],
  "growthOpportunities": ["Key growth opportunity 1", "Key growth opportunity 2"],
  "risks": ["Key risk factor 1", "Key risk factor 2"]
}`;
}
