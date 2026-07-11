import type { GraphState } from "@/langgraph";
import { newsService } from "@/services/news.service";

/**
 * News Analysis Node
 * Retrieves and processes news developments.
 */
export async function newsNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting News node...");
  try {
    const news = await newsService.getRecentNews(state.companyName);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] News Node took ${duration}ms`);
    return {
      news,
    };
  } catch (error) {
    console.error("News node execution failed:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] News Node took ${duration}ms (failed)`);
    return {
      news: [
        {
          title: "No recent news available.",
          summary: "Recent news updates are currently unavailable.",
          impact: "Neutral",
          url: "https://finance.yahoo.com",
          publishedDate: new Date().toISOString(),
        }
      ],
      errors: [`News Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
