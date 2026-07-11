/**
 * News Analysis Prompt Templates
 * (Retained for reference/compilation but no longer active; sentiment parsing is programmatic).
 */
export function newsPrompt(companyName: string): string {
  return `Equity research instruction set for scanning market developments of: ${companyName}.`;
}

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export function newsClassificationPrompt(companyName: string, articles: GNewsArticle[]): string {
  return `Equity research sentiment classification instructions for: ${companyName} on ${articles.length} news items.`;
}
