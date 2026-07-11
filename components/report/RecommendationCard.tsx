"use client";

/**
 * RecommendationCard — Hero investment recommendation section.
 * Receives the greatest visual emphasis (COMPONENT_TREE.md).
 *
 * Displays: Investment Score, Recommendation, Confidence, Investment Thesis,
 *           Key Positives, Key Risks.
 */

import { motion } from "framer-motion";
import { Star, TrendingUp, TrendingDown, Award } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { RecommendationBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  animationDelay?: number;
}

function CircularProgress({ value, strokeClass, label }: { value: number; strokeClass: string; label: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          {/* Background circle */}
          <circle
            className="text-white/[0.04]"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
          {/* Foreground circle */}
          <motion.circle
            className={strokeClass}
            strokeWidth="5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider mt-2.5">{label}</span>
    </div>
  );
}

export function RecommendationCard({
  recommendation,
  animationDelay = 0.7,
}: RecommendationCardProps) {

  const glowClass =
    recommendation.decision === "Invest"
      ? "shadow-[0_0_30px_rgba(52,211,153,0.1)] border-emerald-500/20"
      : recommendation.decision === "Watch"
      ? "shadow-[0_0_30px_rgba(245,158,11,0.1)] border-amber-500/20"
      : "shadow-[0_0_30px_rgba(239,68,68,0.1)] border-red-500/20";

  const strokeColorClass =
    recommendation.decision === "Invest"
      ? "text-emerald-400"
      : recommendation.decision === "Watch"
      ? "text-amber-400"
      : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: animationDelay, ease: "easeOut" }}
      className={cn(
        "al-glass rounded-2xl border p-6 md:p-8 space-y-8 relative overflow-hidden transition-all duration-300",
        glowClass
      )}
    >
      {/* Decorative ambient background */}
      <div className="absolute -right-24 -bottom-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <SectionHeader
        title="Investment Recommendation"
        subtitle="AI multi-agent consolidated rating & reasoning"
        icon={Star}
        action={<RecommendationBadge decision={recommendation.decision} size="md" />}
      />

      {/* Score & Confidence Radial Gauges */}
      <div className="flex items-center gap-10 bg-white/[0.01] border border-white/5 rounded-2xl p-6 w-fit mx-auto sm:mx-0 shadow-inner">
        <CircularProgress 
          value={recommendation.score} 
          strokeClass={strokeColorClass} 
          label="Investment Score" 
        />
        <div className="h-14 w-px bg-border/40" />
        <CircularProgress 
          value={recommendation.confidence} 
          strokeClass="text-teal-400" 
          label="AI Confidence" 
        />
      </div>

      {/* Investment Thesis */}
      <div className="relative rounded-2xl border border-white/5 bg-white/[0.015] p-5 shadow-sm">
        <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-zinc-950 border border-white/10 rounded-full text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest flex items-center gap-1">
          <Award className="h-3 w-3 text-emerald-400" />
          Executive Thesis
        </div>
        <p className="text-sm leading-relaxed text-foreground/90 font-medium">
          {recommendation.thesis}
        </p>
      </div>

      {/* Positives & Risks list columns */}
      <div className="grid gap-6 sm:grid-cols-2 pt-2">
        {/* Key Positives */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Catalysts & Positives
            </span>
          </div>
          <ul className="space-y-3">
            {recommendation.positives.map((item, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: animationDelay + 0.1 + index * 0.05 }}
                className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed"
              >
                <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Key Risks */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/20 pb-2">
            <TrendingDown className="h-4.5 w-4.5 text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Investment Risk Factors
            </span>
          </div>
          <ul className="space-y-3">
            {recommendation.negatives.map((item, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: animationDelay + 0.1 + index * 0.05 }}
                className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed"
              >
                <div className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                </div>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
