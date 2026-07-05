"use client";

/**
 * RecommendationCard — Hero investment recommendation section.
 * Receives the greatest visual emphasis (COMPONENT_TREE.md).
 *
 * Displays: Investment Score, Recommendation, Confidence, Investment Thesis,
 *           Key Positives, Key Risks.
 */

import { motion } from "framer-motion";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { RecommendationBadge } from "@/components/shared/StatusBadge";
import { getRecommendationColors, getScoreColor } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  animationDelay?: number;
}

export function RecommendationCard({
  recommendation,
  animationDelay = 0.7,
}: RecommendationCardProps) {
  const colors = getRecommendationColors(recommendation.decision);

  const ringClass =
    recommendation.decision === "Invest"
      ? "ring-emerald-400/30"
      : recommendation.decision === "Watch"
      ? "ring-amber-400/30"
      : "ring-red-400/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: animationDelay, ease: "easeOut" }}
      className={cn("al-card space-y-6 ring-2", colors.border, ringClass)}
    >
      <SectionHeader
        title="Investment Recommendation"
        subtitle="AI-generated investment decision and thesis"
        icon={Star}
        action={<RecommendationBadge decision={recommendation.decision} size="md" />}
      />

      {/* Score & Confidence */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p
            className={cn(
              "text-5xl font-bold tabular-nums",
              getScoreColor(recommendation.score)
            )}
          >
            {recommendation.score}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">/ 100</p>
          <p className="text-xs font-medium text-muted-foreground">Investment Score</p>
        </div>

        <div className="h-12 w-px bg-border" />

        <div className="text-center">
          <p className="text-5xl font-bold tabular-nums text-foreground">
            {recommendation.confidence}
            <span className="text-2xl">%</span>
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">Confidence</p>
        </div>
      </div>

      {/* Investment Thesis */}
      <div className="rounded-lg border border-border bg-white/[0.02] p-4">
        <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Investment Thesis
        </p>
        <p className="text-sm leading-relaxed text-foreground">
          {recommendation.thesis}
        </p>
      </div>

      {/* Positives & Risks */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Key Positives */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Key Positives
            </span>
          </div>
          <ul className="space-y-1.5">
            {recommendation.positives.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Risks */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Key Risks
            </span>
          </div>
          <ul className="space-y-1.5">
            {recommendation.negatives.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/60" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
