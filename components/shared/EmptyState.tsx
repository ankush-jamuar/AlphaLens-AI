"use client";

/**
 * EmptyState — Displayed when no report has been loaded yet.
 * First screen users see when opening AlphaLens AI.
 */

import { motion } from "framer-motion";
import { Search, TrendingUp, BarChart2, Zap } from "lucide-react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Icon cluster */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-xl" />

        {/* Floating icons */}
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card">
          <BarChart2 className="h-4 w-4 text-blue-400" />
        </div>
        <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
        </div>

        {/* Center icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
          <Search className="h-7 w-7 text-muted-foreground" />
        </div>
      </div>

      {/* Headline */}
      <h2 className="mb-3 text-xl font-semibold text-foreground">
        Start your investment analysis
      </h2>

      {/* Description */}
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Enter the name of any public company to generate an AI-powered
        investment report with a structured recommendation.
      </p>

      {/* Feature hints */}
      <div className="mt-10 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
        {[
          { icon: BarChart2, label: "Financial Analysis" },
          { icon: TrendingUp, label: "Investment Score" },
          { icon: Zap, label: "Instant Insights" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-white/[0.02] p-3"
          >
            <Icon className="h-4 w-4 text-muted-foreground/60" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
