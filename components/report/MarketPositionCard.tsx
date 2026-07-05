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
      className="al-card space-y-5"
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
          bgClass="bg-emerald-400/10 border-emerald-400/20"
          dotClass="bg-emerald-400"
        />

        {/* Weaknesses */}
        <BulletList
          title="Weaknesses"
          icon={TrendingDown}
          items={market.weaknesses}
          colorClass="text-red-400"
          bgClass="bg-red-400/10 border-red-400/20"
          dotClass="bg-red-400"
        />

        {/* Competitors */}
        <BulletList
          title="Competitors"
          icon={Users}
          items={market.competitors}
          colorClass="text-blue-400"
          bgClass="bg-blue-400/10 border-blue-400/20"
          dotClass="bg-blue-400"
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
    <div className={cn("rounded-lg border p-4", bgClass)}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-3.5 w-3.5", colorClass)} />
        <span className={cn("text-xs font-semibold", colorClass)}>{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
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
