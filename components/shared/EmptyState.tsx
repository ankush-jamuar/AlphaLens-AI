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
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
    >
      {/* Decorative center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Icon Cluster */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-full bg-emerald-400/10 blur-xl animate-pulse" />

        {/* Floating cards */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-zinc-900 shadow-md"
        >
          <TrendingUp className="h-4 w-4 text-emerald-400" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-zinc-900 shadow-md"
        >
          <BarChart2 className="h-4 w-4 text-sky-400" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.7, ease: "easeInOut" }}
          className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-lg border border-border/80 bg-zinc-900 shadow-md"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
        </motion.div>

        {/* Center card */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border/80 bg-zinc-950 shadow-lg">
          <Search className="h-6 w-6 text-muted-foreground/60" />
        </div>
      </div>

      {/* Headline */}
      <h2 className="mb-2 text-xl font-bold text-foreground tracking-tight">
        Initialize Investment Analysis
      </h2>

      {/* Description */}
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground/80 font-medium">
        Enter a public company name or ticker symbol. The multi-agent workspace compiles real-time filings, financial ratios, and news intelligence.
      </p>

      {/* Feature hints grid */}
      <div className="mt-12 grid grid-cols-3 gap-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest max-w-md w-full">
        {[
          { icon: BarChart2, label: "Core Financials" },
          { icon: TrendingUp, label: "Agent Evaluation" },
          { icon: Zap, label: "Unified Intelligence" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 rounded-xl border border-border/30 bg-white/[0.01] p-4.5 transition-all duration-300 hover:bg-white/[0.025]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.02] border border-white/5 text-muted-foreground/50">
              <Icon className="h-4 w-4" />
            </div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
