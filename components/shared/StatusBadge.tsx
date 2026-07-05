"use client";

/**
 * StatusBadge — Reusable badge for recommendation decisions and impact levels.
 * Follows the color palette defined in UI_UX_SPECIFICATION.md.
 */

import { cn } from "@/lib/utils";
import { getRecommendationColors, getImpactColors } from "@/utils/format";
import type { RecommendationDecision } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Recommendation Badge (Invest / Watch / Pass)
// ---------------------------------------------------------------------------

interface RecommendationBadgeProps {
  decision: RecommendationDecision;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RecommendationBadge({
  decision,
  size = "md",
  className,
}: RecommendationBadgeProps) {
  const colors = getRecommendationColors(decision);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold tracking-wide",
        colors.badge,
        sizeClasses[size],
        className
      )}
    >
      {decision}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Impact Badge (Positive / Neutral / Negative)
// ---------------------------------------------------------------------------

interface ImpactBadgeProps {
  impact: "Positive" | "Neutral" | "Negative";
  className?: string;
}

export function ImpactBadge({ impact, className }: ImpactBadgeProps) {
  const colorClass = getImpactColors(impact);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {impact}
    </span>
  );
}
