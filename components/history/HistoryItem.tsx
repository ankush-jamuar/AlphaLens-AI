"use client";

/**
 * HistoryItem — Single history entry in the sidebar.
 * Displays: company name, recommendation badge, timestamp.
 * Selecting loads the saved report (COMPONENT_TREE.md).
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
        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
        isActive
          ? "border-emerald-400/30 bg-emerald-400/10"
          : "border-transparent hover:border-border hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Company icon */}
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/5">
          <Building2 className="h-3 w-3 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p
            className={cn(
              "truncate text-xs font-medium",
              isActive ? "text-foreground" : "text-foreground/80"
            )}
          >
            {entry.companyName}
          </p>

          <div className="flex items-center justify-between gap-2">
            <RecommendationBadge decision={entry.recommendation} size="sm" />
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {formatRelativeTime(entry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
