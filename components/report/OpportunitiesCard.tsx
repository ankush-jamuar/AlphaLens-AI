"use client";

/**
 * OpportunitiesCard — Growth opportunities, expansion, innovation, industry trends.
 */

import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface OpportunitiesCardProps {
  opportunities: string[];
  animationDelay?: number;
}

export function OpportunitiesCard({
  opportunities,
  animationDelay = 0.6,
}: OpportunitiesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Strategic Growth Catalysts"
        subtitle="Innovation vectors, addressable market expansion, and positive catalysts"
        icon={Rocket}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {opportunities.map((opportunity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + index * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4.5 shadow-sm"
          >
            <Sparkles className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground/80 leading-relaxed font-semibold">{opportunity}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
