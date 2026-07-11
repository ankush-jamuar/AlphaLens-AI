"use client";

/**
 * ExecutiveSummaryCard — Hero section of the investment report.
 * Highest visual priority. Displays company name, recommendation, score, confidence.
 */

import { motion } from "framer-motion";
import { Calendar, MapPin, Landmark, Compass } from "lucide-react";
import { RecommendationBadge } from "@/components/shared/StatusBadge";
import { ExportMenu } from "@/components/shared/ExportMenu";
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
      ? "ring-emerald-500/10 border-emerald-500/25"
      : recommendation.decision === "Watch"
      ? "ring-amber-500/10 border-amber-500/25"
      : "ring-red-500/10 border-red-500/25";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("al-glass rounded-2xl border p-6 md:p-8 space-y-6 relative overflow-hidden", ringClass)}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none" />

      {/* Company & Recommendation/Export row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Company info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            {company.ticker && (
              <span className="rounded-lg border border-border/80 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                {company.ticker}
              </span>
            )}
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-muted-foreground/40" />
              {company.industry}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{company.name}</h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground/80 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/40" />
              {company.headquarters}
            </span>
            {company.marketCap && (
              <span className="flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-muted-foreground/40" />
                MCap: {company.marketCap}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/40" />
              {formatFullDate(report.createdAt)}
            </span>
          </div>
        </div>

        {/* Actions flex column/row */}
        <div className="flex flex-row items-center gap-2.5 sm:self-start">
          <ExportMenu report={report} />
          <RecommendationBadge decision={recommendation.decision} size="lg" />
        </div>
      </div>

      {/* Score overview cards row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 pt-2">
        {/* Investment Score */}
        <div className="rounded-xl border border-border/40 bg-white/[0.01] p-4 shadow-sm">
          <p className="mb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Investment Score</p>
          <p className={cn("text-3xl font-extrabold tabular-nums tracking-tight", getScoreColor(recommendation.score))}>
            {recommendation.score}
            <span className="text-xs font-medium text-muted-foreground/40 ml-1">/100</span>
          </p>
        </div>

        {/* Confidence */}
        <div className="rounded-xl border border-border/40 bg-white/[0.01] p-4 shadow-sm">
          <p className="mb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">AI Confidence</p>
          <p className="text-3xl font-extrabold tabular-nums tracking-tight text-foreground">
            {recommendation.confidence}
            <span className="text-xs font-medium text-muted-foreground/40 ml-1">%</span>
          </p>
        </div>

        {/* Decision */}
        <div
          className={cn(
            "col-span-2 flex flex-col justify-center rounded-xl border p-4 sm:col-span-1 shadow-sm transition-all duration-300",
            colors.border,
            colors.bg
          )}
        >
          <p className="mb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Final Decision</p>
          <p className={cn("text-xl font-black tracking-tight", colors.text)}>
            {recommendation.decision}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
