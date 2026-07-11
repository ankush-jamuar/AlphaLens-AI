"use client";

/**
 * RisksCard — Key business risks in bulleted format.
 */

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle } from "lucide-react";
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
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Consolidated Risk Assessment"
        subtitle="Key vulnerability vectors and risk factors"
        icon={AlertTriangle}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {risks.map((risk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + index * 0.05 }}
            className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4.5 shadow-sm"
          >
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground/80 leading-relaxed font-semibold">{risk}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
