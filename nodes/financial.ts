import type { GraphState } from "@/langgraph";
import { financialService } from "@/services/financial.service";

/**
 * Financial Analysis Node
 * Retrieves financial metrics for the company.
 */
export async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting Financial node...");
  try {
    const financialData = await financialService.getFinancialData(state.companyName, state.ticker);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Financial Node took ${duration}ms`);
    console.log("[LangGraph] Financial node complete.");
    return {
      financialData,
    };
  } catch (error) {
    console.error("Financial node execution failed:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Financial Node took ${duration}ms (failed)`);
    return {
      errors: [`Financial Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
