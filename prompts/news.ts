/**
 * News Analysis Prompt Template
 * Summarizes recent news developments and impact.
 */
export function newsPrompt(companyName: string): string {
  return `You are a news analyst. Gather and summarize recent news and major events for: "${companyName}".
Analyze the impact of these developments (Positive, Neutral, or Negative).
Return a JSON array of news items:
[
  {
    "title": "News headline",
    "summary": "Brief summary of the news story and context.",
    "impact": "Positive" | "Neutral" | "Negative"
  }
]`;
}
