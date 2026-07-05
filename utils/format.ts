/**
 * AlphaLens AI — Utility Functions
 *
 * Pure formatting and helper functions.
 * No React, no business logic, no API calls.
 */

import type { RecommendationDecision } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Date Formatting
// ---------------------------------------------------------------------------

/**
 * Formats an ISO date string into a human-readable relative time.
 * e.g. "2 hours ago", "Yesterday", "July 3, 2025"
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string into a full readable timestamp.
 * e.g. "July 5, 2025 at 6:30 PM"
 */
export function formatFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// Score Formatting
// ---------------------------------------------------------------------------

/**
 * Returns a color class for an investment score badge.
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

/**
 * Returns Tailwind color classes for recommendation decisions.
 */
export function getRecommendationColors(decision: RecommendationDecision): {
  text: string;
  bg: string;
  border: string;
  badge: string;
} {
  switch (decision) {
    case "Invest":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/30",
        badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
      };
    case "Watch":
      return {
        text: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/30",
        badge: "bg-amber-400/15 text-amber-400 border-amber-400/30",
      };
    case "Pass":
      return {
        text: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-400/30",
        badge: "bg-red-400/15 text-red-400 border-red-400/30",
      };
  }
}

/**
 * Returns Tailwind color classes for news impact badges.
 */
export function getImpactColors(impact: "Positive" | "Neutral" | "Negative"): string {
  switch (impact) {
    case "Positive":
      return "bg-emerald-400/15 text-emerald-400 border-emerald-400/30";
    case "Negative":
      return "bg-red-400/15 text-red-400 border-red-400/30";
    case "Neutral":
      return "bg-slate-400/15 text-slate-400 border-slate-400/30";
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validates a company name against the rules in API_SPECIFICATION.md.
 * Returns null if valid, or an error message string.
 */
export function validateCompanyName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) return "Please enter a company name.";
  if (trimmed.length < 2) return "Company name must be at least 2 characters.";
  if (trimmed.length > 100) return "Company name must not exceed 100 characters.";

  // Reject strings that consist only of numbers or special characters
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  if (!hasLetters) return "Please enter a valid company name.";

  return null;
}

// ---------------------------------------------------------------------------
// Text Helpers
// ---------------------------------------------------------------------------

/**
 * Truncates a string to a maximum length and appends an ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Converts a camelCase or snake_case string into a readable label.
 */
export function toReadableLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------

/**
 * Returns the progress percentage for a given step index.
 */
export function getProgressPercent(currentStep: number, totalSteps: number): number {
  if (totalSteps === 0) return 0;
  return Math.round(((currentStep + 1) / totalSteps) * 100);
}
