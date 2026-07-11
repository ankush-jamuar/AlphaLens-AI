"use client";

/**
 * CompanyOverviewCard — Business description, headquarters, market position.
 */

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { CompanyProfile } from "@/types";

interface CompanyOverviewCardProps {
  company: CompanyProfile;
  animationDelay?: number;
}

export function CompanyOverviewCard({
  company,
  animationDelay = 0.1,
}: CompanyOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Company Profile"
        subtitle="Business operations and strategic description"
        icon={Building2}
      />

      <p className="text-sm leading-relaxed text-muted-foreground/90 font-medium">
        {company.description}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
        {[
          { label: "Industry", value: company.industry },
          { label: "Headquarters", value: company.headquarters },
          ...(company.marketCap
            ? [{ label: "Market Cap", value: company.marketCap }]
            : []),
          ...(company.ticker
            ? [{ label: "Ticker Symbol", value: company.ticker }]
            : []),
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border/30 bg-white/[0.015] p-4 shadow-sm"
          >
            <p className="mb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-foreground truncate">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
