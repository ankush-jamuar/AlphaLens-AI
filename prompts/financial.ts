/**
 * Financial Analysis Prompt Template
 * Evaluates financial metrics.
 */
export function financialPrompt(companyName: string): string {
  return `You are a financial analyst. Evaluate the financial strength of: "${companyName}".
Extract key financial metrics: revenue, net income, EPS, P/E ratio, debt, cash flow.
Return a JSON object matching this schema:
{
  "revenue": "e.g., $100B",
  "netIncome": "e.g., $20B",
  "eps": "e.g., $4.50",
  "peRatio": "e.g., 25.4",
  "debt": "e.g., $15B",
  "cashFlow": "e.g., $25B"
}`;
}
