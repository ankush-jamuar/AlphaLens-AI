import type { GraphState } from "@/langgraph";
import { financialService } from "@/services/financial.service";

/**
 * Financial Analysis Node
 * Retrieves financial metrics for the company using the resolved ticker.
 */
export async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting Financial node...");
  try {
    const financialData = await financialService.getFinancialData(state.companyName, state.ticker);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Financial Node took ${duration}ms`);
    return {
      financialData,
    };
  } catch (error) {
    console.error("Financial node execution failed:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Financial Node took ${duration}ms (failed)`);
    return {
      financialData: {
        revenue: "Unavailable",
        netIncome: "Unavailable",
        eps: "Unavailable",
        peRatio: "Unavailable",
        debt: "Unavailable",
        cashFlow: "Unavailable",
      },
      errors: [`Financial Analysis Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
