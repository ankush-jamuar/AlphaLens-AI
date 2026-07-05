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
      className="al-card space-y-4"
    >
      <SectionHeader
        title="Company Overview"
        subtitle="Business profile and market position"
        icon={Building2}
      />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {company.description}
      </p>

      <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
        {[
          { label: "Industry", value: company.industry },
          { label: "Headquarters", value: company.headquarters },
          ...(company.marketCap
            ? [{ label: "Market Cap", value: company.marketCap }]
            : []),
          ...(company.ticker
            ? [{ label: "Ticker", value: company.ticker }]
            : []),
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-border/60 bg-white/[0.02] p-3"
          >
            <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
