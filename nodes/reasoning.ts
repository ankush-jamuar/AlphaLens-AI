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
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms (failed)`);
    return {
      errors: ["Reasoning Node failed: No evidence summary available in state."],
    };
  }

  try {
    const schema = z.object({
      decision: z.enum(["Invest", "Watch", "Pass"]),
      score: z.number().min(0).max(100),
      confidence: z.number().min(0).max(100),
      evidenceQuality: z.enum(["High", "Medium", "Low"]),
      financialConfidence: z.number().min(0).max(100),
      marketConfidence: z.number().min(0).max(100),
      newsConfidence: z.number().min(0).max(100),
      thesis: z.string(),
      positives: z.array(z.string()),
      negatives: z.array(z.string()),
      growthOpportunities: z.array(z.string()),
      risks: z.array(z.string()),
    });

    const promptText = reasoningPrompt(state.companyName, evidence);
    const result = await geminiService.generateStructured<z.infer<typeof schema>>(promptText, schema);

    // Update riskFactors and growthCatalysts dynamically with Gemini's reasoning outputs
    const updatedEvidence = {
      ...evidence,
      riskFactors: result.risks.length > 0 ? result.risks : evidence.riskFactors,
      growthCatalysts: result.growthOpportunities.length > 0 ? result.growthOpportunities : evidence.growthCatalysts,
    };

    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms`);
    console.log("[Reasoning] Gemini reasoning completed.");

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
    console.error("Reasoning node execution failed:", error);
    const duration = Date.now() - startTime;
    console.log(`[PerformanceMetrics] Reasoning Node took ${duration}ms (failed)`);
    return {
      errors: [`Investment Reasoning Node failed: ${error instanceof Error ? error.message : "Unknown error"}`],
    };
  }
}
