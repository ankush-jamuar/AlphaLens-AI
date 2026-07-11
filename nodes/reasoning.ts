import type { GraphState } from "@/langgraph";
import { reasoningPrompt } from "@/prompts/reasoning";
import { geminiService } from "@/services/gemini.service";
import { z } from "zod";

/**
 * Investment Reasoning Node
 * Synthesizes aggregated evidence and produces the final investment recommendation.
 * Performs exactly ONE Gemini structured call.
 */
export async function reasoningNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = Date.now();
  console.log("[Reasoning] Gemini reasoning started.");
  const evidence = state.evidence;
  if (!evidence) {
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms (failed: no evidence)`);
    return {
      errors: ["Reasoning Node failed: No evidence summary available in state."],
    };
  }

  try {
    const schema = z.object({
      decision: z.enum(["Invest", "Watch", "Pass"]),
      score: z.number().min(0).max(100),
      confidence: z.number().min(0).max(100),
      thesis: z.string(),
      positives: z.array(z.string()),
      negatives: z.array(z.string()),
      risks: z.array(z.string()),
      opportunities: z.array(z.string()),
    });

    const promptText = reasoningPrompt(state.companyName, evidence);
    const result = await geminiService.generateStructured<z.infer<typeof schema>>(promptText, schema);

    const updatedEvidence = {
      ...evidence,
      riskFactors: result.risks.length > 0 ? result.risks : evidence.riskFactors,
      growthCatalysts: result.opportunities.length > 0 ? result.opportunities : evidence.growthCatalysts,
    };

    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms`);
    console.log("[Reasoning] Gemini reasoning completed successfully.");

    return {
      recommendation: {
        decision: result.decision,
        score: result.score,
        confidence: result.confidence,
        thesis: result.thesis,
        positives: result.positives,
        negatives: result.negatives,
      },
      evidence: updatedEvidence,
    };
  } catch (error) {
    console.error("[Reasoning] Gemini structured call failed:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms (failed)`);

    // Graceful degradation: return a default Watch recommendation with error noted
    return {
      recommendation: {
        decision: "Watch",
        score: 50,
        confidence: 20,
        thesis: "AI investment reasoning is currently unavailable due to an LLM service error. Recommendation defaults to Watch.",
        positives: ["Unavailable"],
        negatives: ["LLM service unavailable"],
      },
      errors: [`Investment Reasoning Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
