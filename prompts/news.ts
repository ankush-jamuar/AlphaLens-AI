/**
 * News Analysis Prompt Templates
 */

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

/**
 * Generates realistic recent news developments as a fallback if GNews API fails.
 */
export function newsPrompt(companyName: string): string {
  return `Generate 3 realistic recent news developments for the public company "${companyName}".
For each development, write a title, a brief summary, classify the impact as "Positive", "Neutral", or "Negative", and provide a placeholder URL.
Return a structured JSON object matching this schema:
{
  "newsItems": [
    {
      "title": "Headline of news development",
      "summary": "Brief financial summary of the development",
      "impact": "Positive" | "Neutral" | "Negative",
      "url": "https://example.com/news",
      "publishedDate": "YYYY-MM-DD"
    }
  ]
}`;
}

/**
 * Classifies the market impact of GNews articles for a company.
 */
export function newsClassificationPrompt(companyName: string, articles: GNewsArticle[]): string {
  return `You are a financial analyst. Classify the market impact of the following news articles on the company "${companyName}".
Articles list:
${JSON.stringify(articles.map((a: GNewsArticle) => ({ title: a.title, description: a.description, url: a.url, publishedAt: a.publishedAt })), null, 2)}

For each article, summarize the news and classify its market sentiment impact as "Positive", "Neutral", or "Negative".
Keep the exact original URL and publishedDate (publishedAt) in your response.
Return a structured JSON object matching this schema:
{
  "newsItems": [
    {
      "title": "Article title",
      "summary": "Brief 1-2 sentence financial summary",
      "impact": "Positive" | "Neutral" | "Negative",
      "url": "Original URL",
      "publishedDate": "Original publishedAt date"
    }
  ]
}`;
}
