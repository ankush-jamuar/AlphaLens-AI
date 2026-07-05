import type { GraphState } from "@/langgraph";
import { newsPrompt } from "@/prompts/news";
import { newsService } from "@/services/news.service";

/**
 * News Analysis Node
 * Understands recent developments and their market impact.
 */
export async function newsNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Call newsService to get headlines and use geminiService with newsPrompt
  const news = await newsService.getRecentNews(state.companyName);
  
  return {
    news,
  };
}
