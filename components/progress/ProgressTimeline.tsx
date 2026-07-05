"use client";

/**
 * ProgressTimeline — Animated pipeline progress display.
 *
 * Milestone 1: Shows placeholder progress animation with mock step timing.
 * TODO [Milestone 2]: Receive real step index from LangGraph node execution events.
 *
 * Each step maps to a LangGraph node (LANGGRAPH_DESIGN.md).
 */

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { PIPELINE_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProgressTimelineProps {
  currentStep: number;
  isComplete?: boolean;
}

export function ProgressTimeline({
  currentStep,
  isComplete = false,
}: ProgressTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-6"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/20">
          {isComplete ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {isComplete ? "Analysis complete" : "Analyzing company…"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isComplete
              ? "Investment report is ready"
              : "AI agent is researching and evaluating"}
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, index) => {
          const isDone = index < currentStep || isComplete;
          const isActive = index === currentStep && !isComplete;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
              className="flex items-center gap-3"
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                  isDone
                    ? "bg-emerald-400 text-emerald-950"
                    : isActive
                    ? "border border-emerald-400/50 bg-emerald-400/10"
                    : "border border-border bg-white/[0.02]"
                )}
              >
                {isDone ? (
                  <Check className="h-3 w-3" />
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-border" />
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "text-sm transition-colors duration-300",
                  isDone
                    ? "text-foreground"
                    : isActive
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-emerald-400"
          initial={{ width: 0 }}
          animate={{
            width: `${
              isComplete
                ? 100
                : ((currentStep + 1) / PIPELINE_STEPS.length) * 100
            }%`,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
