"use client";

/**
 * RisksCard — Key business risks in bulleted format.
 */

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface RisksCardProps {
  risks: string[];
  animationDelay?: number;
}

export function RisksCard({ risks, animationDelay = 0.5 }: RisksCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-card space-y-4"
    >
      <SectionHeader
        title="Investment Risks"
        subtitle="Key risk factors to consider"
        icon={AlertTriangle}
      />

      <ul className="space-y-2.5">
        {risks.map((risk, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationDelay + index * 0.05 }}
            className="flex items-start gap-3 rounded-lg border border-red-400/10 bg-red-400/5 px-3 py-2.5"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            <span className="text-sm text-muted-foreground">{risk}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
