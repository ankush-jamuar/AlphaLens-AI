import type { GraphState } from "@/langgraph";
import { marketPrompt } from "@/prompts/market";
import { geminiService } from "@/services/gemini.service";
import { z } from "zod";

/**
 * Market Analysis Node
 * Evaluates competitive positioning, strengths, weaknesses, and key competitors.
 */
export async function marketNode(state: GraphState): Promise<Partial<GraphState>> {
  try {
    const schema = z.object({
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      competitors: z.array(z.string()),
    });
    
    const promptText = marketPrompt(state.companyName);
    const marketAnalysis = await geminiService.generateStructuredOutput<z.infer<typeof schema>>(promptText, schema);
    
    return {
      marketAnalysis,
    };
  } catch (error) {
    console.error("Market node execution failed:", error);
    return {
      errors: [`Market Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
