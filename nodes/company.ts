import type { GraphState } from "@/langgraph";
import { companyService } from "@/services/company.service";

/**
 * Company Research Node
 * Retrieves official profile details for the company.
 */
export async function companyNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[LangGraph] Starting Company node...");
  try {
    const companyProfile = await companyService.getCompanyProfile(state.companyName, state.ticker);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Company Node took ${duration}ms`);
    console.log("[LangGraph] Company node complete.");
    return {
      companyProfile,
    };
  } catch (error) {
    console.error("Company node failed to execute:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Company Node took ${duration}ms (failed)`);
    return {
      errors: [`Company Research Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
