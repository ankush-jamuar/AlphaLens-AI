"use client";

/**
 * ExecutiveSummaryCard — Hero section of the investment report.
 * Highest visual priority. Displays company name, recommendation, score, confidence.
 * (COMPONENT_TREE.md: ExecutiveSummaryCard)
 */

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { RecommendationBadge } from "@/components/shared/StatusBadge";
import { getScoreColor, getRecommendationColors, formatFullDate } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { InvestmentReport } from "@/types";

interface ExecutiveSummaryCardProps {
  report: InvestmentReport;
}

export function ExecutiveSummaryCard({ report }: ExecutiveSummaryCardProps) {
  const { company, recommendation } = report;
  const colors = getRecommendationColors(recommendation.decision);

  const ringClass =
    recommendation.decision === "Invest"
      ? "ring-emerald-400/20"
      : recommendation.decision === "Watch"
      ? "ring-amber-400/20"
      : "ring-red-400/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("al-card space-y-6 ring-1", colors.border, ringClass)}
    >
      {/* Company & Recommendation row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Company info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            {company.ticker && (
              <span className="rounded-md border border-border bg-white/5 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {company.ticker}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {company.industry}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{company.name}</h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {company.headquarters}
            </span>
            {company.marketCap && (
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                Market Cap: {company.marketCap}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatFullDate(report.createdAt)}
            </span>
          </div>
        </div>

        {/* Recommendation badge */}
        <RecommendationBadge decision={recommendation.decision} size="lg" />
      </div>

      {/* Score row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {/* Investment Score */}
        <div className="rounded-lg border border-border bg-white/[0.02] p-4">
          <p className="mb-1 text-xs text-muted-foreground">Investment Score</p>
          <p className={cn("text-3xl font-bold tabular-nums", getScoreColor(recommendation.score))}>
            {recommendation.score}
            <span className="text-base font-normal text-muted-foreground">/100</span>
          </p>
        </div>

        {/* Confidence */}
        <div className="rounded-lg border border-border bg-white/[0.02] p-4">
          <p className="mb-1 text-xs text-muted-foreground">Confidence</p>
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {recommendation.confidence}
            <span className="text-base font-normal text-muted-foreground">%</span>
          </p>
        </div>

        {/* Decision */}
        <div
          className={cn(
            "col-span-2 flex flex-col justify-center rounded-lg border p-4 sm:col-span-1",
            colors.border,
            colors.bg
          )}
        >
          <p className="mb-1 text-xs text-muted-foreground">Decision</p>
          <p className={cn("text-xl font-bold", colors.text)}>
            {recommendation.decision}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
