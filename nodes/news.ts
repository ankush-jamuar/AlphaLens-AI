import type { GraphState } from "@/langgraph";
import { newsService } from "@/services/news.service";

/**
 * News Analysis Node
 * Retrieves and processes news developments.
 */
export async function newsNode(state: GraphState): Promise<Partial<GraphState>> {
  try {
    const news = await newsService.getRecentNews(state.companyName);
    return {
      news,
    };
  } catch (error) {
    console.error("News node execution failed:", error);
    return {
      errors: [`News Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
