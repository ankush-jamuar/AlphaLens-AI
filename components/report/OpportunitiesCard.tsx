"use client";

/**
 * OpportunitiesCard — Growth opportunities, expansion, innovation, industry trends.
 */

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
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
      className="al-card space-y-4"
    >
      <SectionHeader
        title="Growth Opportunities"
        subtitle="Potential catalysts and expansion areas"
        icon={Rocket}
      />

      <ul className="space-y-2.5">
        {opportunities.map((opportunity, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationDelay + index * 0.05 }}
            className="flex items-start gap-3 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-3 py-2.5"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm text-muted-foreground">{opportunity}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
