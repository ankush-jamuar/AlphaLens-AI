/**
 * AlphaLens AI — Shared Constants
 *
 * Centralizes configuration values and static data used across the application.
 * No business logic here — only constants.
 */

import type { PipelineStep } from "@/types";

// ---------------------------------------------------------------------------
// Suggested Companies (Search section)
// ---------------------------------------------------------------------------

export const SUGGESTED_COMPANIES = [
  "Apple",
  "Microsoft",
  "NVIDIA",
  "Amazon",
  "Reliance Industries",
  "Tata Consultancy Services",
] as const;

// ---------------------------------------------------------------------------
// Analysis Pipeline Steps (ProgressTimeline)
// Maps directly to LangGraph nodes in Milestone 2.
// ---------------------------------------------------------------------------

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "understanding",
    label: "Understanding company",
    description: "Validating and normalizing company input",
  },
  {
    id: "company",
    label: "Researching company",
    description: "Gathering company overview and core details",
  },
  {
    id: "financial",
    label: "Reading financial information",
    description: "Analyzing financial metrics and health",
  },
  {
    id: "news",
    label: "Collecting news",
    description: "Reviewing recent developments and news impact",
  },
  {
    id: "market",
    label: "Evaluating market position",
    description: "Assessing competitive position and outlook",
  },
  {
    id: "thesis",
    label: "Building investment thesis",
    description: "Evaluating factors and generating recommendation",
  },
  {
    id: "report",
    label: "Finalizing report",
    description: "Formatting structured investment report",
  },
];

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

/** Maximum number of reports stored in localStorage (SYSTEM_ARCHITECTURE.md) */
export const MAX_HISTORY_SIZE = 20;

/** localStorage key for history persistence */
export const HISTORY_STORAGE_KEY = "alphalens_history";

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export const API_ROUTES = {
  analyze: "/api/analyze",
} as const;

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

export const SIDEBAR_WIDTH = 280;

export const APP_NAME = "AlphaLens AI";

export const GITHUB_URL = "https://github.com/ankush-jamuar/AlphaLens-AI";

// ---------------------------------------------------------------------------
// Recommendation Thresholds (PROJECT_BLUEPRINT.md)
// ---------------------------------------------------------------------------

export const SCORE_THRESHOLDS = {
  invest: 80,
  watch: 60,
} as const;

export type RecommendationDecision = "Invest" | "Watch" | "Pass";

export function getRecommendationFromScore(score: number): RecommendationDecision {
  if (score >= SCORE_THRESHOLDS.invest) return "Invest";
  if (score >= SCORE_THRESHOLDS.watch) return "Watch";
  return "Pass";
}
