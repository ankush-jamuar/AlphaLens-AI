"use client";

/**
 * SuggestedCompanies — Quick-select company chips below the search input.
 * Clicking a suggestion fills the search field (UI_UX_SPECIFICATION.md).
 */

import { motion } from "framer-motion";
import { SUGGESTED_COMPANIES } from "@/lib/constants";

interface SuggestedCompaniesProps {
  onSelect: (company: string) => void;
}

export function SuggestedCompanies({ onSelect }: SuggestedCompaniesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">Try:</span>
      {SUGGESTED_COMPANIES.map((company, index) => (
        <motion.button
          key={company}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.2 }}
          onClick={() => onSelect(company)}
          className="rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-400"
        >
          {company}
        </motion.button>
      ))}
    </div>
  );
}
