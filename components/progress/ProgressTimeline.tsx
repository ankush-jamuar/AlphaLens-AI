"use client";

/**
 * ProgressTimeline — Premium animated agent progress timeline.
 * Displays live progress through the multi-agent LangGraph pipeline.
 */

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { PIPELINE_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  currentStep: number;
  isComplete?: boolean;
}

const STEP_DESCRIPTIONS: Record<string, string> = {
  planning: "Parsing company name input & resolving official ticker...",
  company: "Fetching official company metadata from Alpha Vantage...",
  financial: "Retrieving annual income, balance sheet & cash flow...",
  news: "Scraping real-time market updates & analyzing GNews feed...",
  market: "Mapping competitors & analyzing competitive positioning...",
  evidence: "Aggregating research, news sentiment & financial ratios...",
  reasoning: "Synthesizing evidence and computing score with Gemini...",
  formatting: "Compiling final PDF/Markdown investment report...",
};

export function ProgressTimeline({
  currentStep,
  isComplete = false,
}: ProgressTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 shadow-2xl relative overflow-hidden no-print"
    >
      {/* Background glow */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between pb-4 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-emerald-400/20">
            {isComplete ? (
              <Check className="h-5 w-5 text-emerald-400 animate-bounce" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              {isComplete ? "Analysis Complete" : "Researching Target Company..."}
            </h3>
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              {isComplete
                ? "Your investment intelligence report is ready"
                : "Multi-agent graph pipeline executing in real-time"}
            </p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 bg-white/[0.04] border border-white/10 rounded-full text-muted-foreground">
          {isComplete ? "100%" : `${Math.round(((currentStep) / PIPELINE_STEPS.length) * 100)}%`}
        </div>
      </div>

      {/* Steps */}
      <div className="relative space-y-6 pl-1">
        {/* Connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/[0.06] rounded-full" />
        
        {/* Active colored line */}
        <motion.div
          className="absolute left-[11px] top-2 w-[2px] bg-gradient-to-b from-emerald-400 to-teal-300 rounded-full"
          initial={{ height: 0 }}
          animate={{
            height: isComplete
              ? "96%"
              : `${((currentStep) / (PIPELINE_STEPS.length - 1)) * 96}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {PIPELINE_STEPS.map((step, index) => {
          const isDone = index < currentStep || isComplete;
          const isActive = index === currentStep && !isComplete;

          return (
            <div key={step.id} className="relative flex gap-4 items-start group">
              {/* Step indicator */}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 shadow-md shadow-emerald-400/20"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3px]" />
                  </motion.div>
                ) : isActive ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-950/80 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="h-2 w-2 rounded-full bg-emerald-400"
                    />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 bg-zinc-900">
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isDone
                        ? "text-foreground"
                        : isActive
                        ? "text-emerald-400 font-bold"
                        : "text-muted-foreground/50"
                    )}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20"
                    >
                      Active
                    </motion.span>
                  )}
                </div>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground/80 mt-1 font-medium leading-relaxed"
                  >
                    {STEP_DESCRIPTIONS[step.id] || "Executing agent calculations..."}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
