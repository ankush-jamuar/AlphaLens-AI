import type { GraphState } from "@/types";

/**
 * Report Formatter Prompt Template
 * (Retained for reference/compilation but no longer active; formatter is programmatic).
 */
export function formatterPrompt(state: GraphState): string {
  return `Equity research instruction set for formatting the investment report of: ${state.companyName}.`;
}
