"use client";

/**
 * HistoryItem — Single history entry in the sidebar.
 * Displays: company name, recommendation badge, timestamp.
 */

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { RecommendationBadge } from "@/components/shared/StatusBadge";
import { formatRelativeTime } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { HistoryEntry, InvestmentReport } from "@/types";

interface HistoryItemProps {
  entry: HistoryEntry;
  onSelect: (report: InvestmentReport) => void;
  isActive?: boolean;
}

export function HistoryItem({ entry, onSelect, isActive }: HistoryItemProps) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(entry.report)}
      className={cn(
        "w-full relative rounded-xl border px-3 py-2.5 text-left transition-all duration-300 select-none group",
        isActive
          ? "border-emerald-500/25 bg-emerald-500/8 text-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03] hover:border-border/40"
      )}
    >
      {/* Active highlight bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r bg-emerald-400" />
      )}

      <div className="flex items-start gap-2.5">
        {/* Company icon container */}
        <div className={cn(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
          isActive ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-muted-foreground/60 group-hover:bg-white/10 group-hover:text-foreground"
        )}>
          <Building2 className="h-3 w-3" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <p
            className={cn(
              "truncate text-xs font-semibold tracking-tight transition-colors duration-300",
              isActive ? "text-foreground font-bold" : "text-foreground/80 group-hover:text-foreground"
            )}
          >
            {entry.companyName}
          </p>

          <div className="flex items-center justify-between gap-2">
            <RecommendationBadge decision={entry.recommendation} size="sm" />
            <span className="shrink-0 text-[9px] font-medium tracking-tight text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/80">
              {formatRelativeTime(entry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
