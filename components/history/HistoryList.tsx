"use client";

/**
 * HistoryList — Scrollable list of previous analyses.
 * Reads history from useHistory hook.
 */

import { AnimatePresence } from "framer-motion";
import { HistoryItem } from "./HistoryItem";
import type { HistoryEntry, InvestmentReport } from "@/types";

interface HistoryListProps {
  history: HistoryEntry[];
  onSelect: (report: InvestmentReport) => void;
  onRemove?: (id: string) => void;
  activeId?: string;
}

export function HistoryList({
  history,
  onSelect,
  activeId,
}: HistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {history.map((entry) => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            onSelect={onSelect}
            isActive={activeId === entry.report.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
