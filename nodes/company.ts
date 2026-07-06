import type { GraphState } from "@/langgraph";
import { companyService } from "@/services/company.service";

/**
 * Company Research Node
 * Retrieves official profile details for the company.
 */
export async function companyNode(state: GraphState): Promise<Partial<GraphState>> {
  try {
    const companyProfile = await companyService.getCompanyProfile(state.companyName, state.ticker);
    return {
      companyProfile,
    };
  } catch (error) {
    console.error("Company node failed to execute:", error);
    return {
      errors: [`Company Research Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
