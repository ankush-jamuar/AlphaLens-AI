import type { GraphState } from "@/langgraph";
import { planningPrompt } from "@/prompts/planning";
import { geminiService } from "@/services/gemini.service";
import { z } from "zod";

/**
 * Planning Node
 * Validates the input company name, normalizes it, and extracts the ticker symbol.
 */
export async function planningNode(state: GraphState): Promise<Partial<GraphState>> {
  const companyName = state.companyName?.trim();
  
  if (!companyName || companyName.length < 2) {
    return {
      errors: ["INVALID_COMPANY_NAME: Company name must be at least 2 characters long."],
    };
  }

  try {
    const schema = z.object({
      companyName: z.string(),
      ticker: z.string().optional(),
    });
    
    const promptText = planningPrompt(companyName);
    const result = await geminiService.generateStructuredOutput<{ companyName: string; ticker?: string }>(promptText, schema);
    
    return {
      companyName: result.companyName || companyName,
      ticker: result.ticker || undefined,
      errors: [],
    };
  } catch (error) {
    console.error("Planning node Gemini resolution failed, falling back to input name:", error);
    return {
      companyName,
      errors: [],
    };
  }
}
