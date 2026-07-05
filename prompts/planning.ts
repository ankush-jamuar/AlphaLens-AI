/**
 * Planning Prompt Template
 * Validates and normalizes the company name.
 */
export function planningPrompt(companyName: string): string {
  return `You are an investment analyst planning research for a company.
Validate and normalize the following company name input: "${companyName}".
Identify its official name and potential ticker if possible.
Return the result in structured JSON format:
{
  "companyName": "Normalized Company Name",
  "ticker": "TICKER" (optional)
}`;
}
