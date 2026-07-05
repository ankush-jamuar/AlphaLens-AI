/**
 * Company Profile Prompt Template
 * Researches and summarizes company details.
 */
export function companyPrompt(companyName: string): string {
  return `You are a research analyst. Gather information on the public company: "${companyName}".
Analyze its industry, headquarters, business model, core products, and major competitors.
Return a JSON object matching this schema:
{
  "name": "${companyName}",
  "ticker": "TICKER",
  "industry": "Industry",
  "headquarters": "City, Country",
  "description": "Short description of core business and model.",
  "marketCap": "Market cap estimation"
}`;
}
