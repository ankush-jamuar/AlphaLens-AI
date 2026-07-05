import type { GraphState } from "@/langgraph";
import { companyPrompt } from "@/prompts/company";
import { companyService } from "@/services/company.service";

/**
 * Company Research Node
 * Researches and summarizes company details.
 */
export async function companyNode(state: GraphState): Promise<Partial<GraphState>> {
  // TODO [Milestone 2.2]: Call companyService to fetch profile data, and use geminiService with companyPrompt
  const companyProfile = await companyService.getCompanyProfile(state.companyName);
  
  return {
    companyProfile,
  };
}
