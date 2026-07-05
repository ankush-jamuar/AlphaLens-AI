/**
 * Market Analysis Prompt Template
 * Analyzes competitive positioning and market trends.
 */
export function marketPrompt(companyName: string): string {
  return `You are a market analyst. Evaluate the market position of: "${companyName}".
Identify key strengths, weaknesses, and primary competitors in their industry.
Return a JSON object matching this schema:
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "competitors": ["Competitor 1", "Competitor 2"]
}`;
}
