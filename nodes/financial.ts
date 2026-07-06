import type { GraphState } from "@/langgraph";
import { financialService } from "@/services/financial.service";

/**
 * Financial Analysis Node
 * Retrieves financial metrics for the company.
 */
export async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  try {
    const financialData = await financialService.getFinancialData(state.companyName, state.ticker);
    return {
      financialData,
    };
  } catch (error) {
    console.error("Financial node execution failed:", error);
    return {
      errors: [`Financial Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
