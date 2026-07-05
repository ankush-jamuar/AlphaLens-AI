import type { GraphState } from "@/langgraph";
import { planningPrompt } from "@/prompts/planning";
import { geminiService } from "@/services/gemini.service";

/**
 * Planning Node
 * Validates and normalizes the company name input.
 */
export async function planningNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Call geminiService with planningPrompt to validate and normalize company name
  const companyName = state.companyName || "NVIDIA";
  
  return {
    companyName: companyName.trim(),
    errors: [],
  };
}
