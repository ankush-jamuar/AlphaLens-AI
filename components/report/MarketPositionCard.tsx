"use client";

/**
 * MarketPositionCard — Competitors, Strengths, Weaknesses.
 */

import { motion } from "framer-motion";
import { Target, TrendingUp, TrendingDown, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import type { MarketAnalysis } from "@/types";

interface MarketPositionCardProps {
  market: MarketAnalysis;
  animationDelay?: number;
}

export function MarketPositionCard({
  market,
  animationDelay = 0.3,
}: MarketPositionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Market Position"
        subtitle="Competitive landscape and strategic assessment"
        icon={Target}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Strengths */}
        <BulletList
          title="Strengths"
          icon={TrendingUp}
          items={market.strengths}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/5 border-emerald-500/10"
          dotClass="bg-emerald-400"
        />

        {/* Weaknesses */}
        <BulletList
          title="Weaknesses"
          icon={TrendingDown}
          items={market.weaknesses}
          colorClass="text-red-400"
          bgClass="bg-red-500/5 border-red-500/10"
          dotClass="bg-red-400"
        />

        {/* Competitors */}
        <BulletList
          title="Competitors"
          icon={Users}
          items={market.competitors}
          colorClass="text-sky-400"
          bgClass="bg-sky-500/5 border-sky-500/10"
          dotClass="bg-sky-400"
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Internal reusable bullet list
// ---------------------------------------------------------------------------

interface BulletListProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  colorClass: string;
  bgClass: string;
  dotClass: string;
}

function BulletList({
  title,
  icon: Icon,
  items,
  colorClass,
  bgClass,
  dotClass,
}: BulletListProps) {
  return (
    <div className={cn("rounded-xl border p-5 shadow-sm transition-all duration-300 hover:bg-white/[0.015]", bgClass)}>
      <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
        <Icon className={cn("h-4 w-4", colorClass)} />
        <span className={cn("text-xs font-bold uppercase tracking-wider", colorClass)}>{title}</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                dotClass
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
