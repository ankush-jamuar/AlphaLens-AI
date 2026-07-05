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
    description: "Researching the business and industry",
  },
  {
    id: "financial",
    label: "Collecting financial data",
    description: "Analyzing revenue, profitability, and balance sheet",
  },
  {
    id: "news",
    label: "Reading latest news",
    description: "Reviewing recent developments and announcements",
  },
  {
    id: "market",
    label: "Evaluating market position",
    description: "Assessing competitive landscape and market share",
  },
  {
    id: "risks",
    label: "Assessing investment risks",
    description: "Identifying key business and financial risks",
  },
  {
    id: "thesis",
    label: "Building investment thesis",
    description: "Synthesizing evidence and generating recommendation",
  },
  {
    id: "report",
    label: "Preparing report",
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
