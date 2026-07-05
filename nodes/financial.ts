import type { GraphState } from "@/langgraph";
import { financialPrompt } from "@/prompts/financial";
import { financialService } from "@/services/financial.service";

/**
 * Financial Analysis Node
 * Evaluates financial strength and extracts key metrics.
 */
export async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Call financialService to get financials and use geminiService with financialPrompt
  const financialData = await financialService.getFinancialData(state.companyName);
  
  return {
    financialData,
  };
}
