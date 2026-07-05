"use client";

/**
 * HistoryList — Scrollable list of up to 20 previous analyses.
 * Reads history from useHistory hook (passed as prop from Workspace).
 * No direct localStorage access here (COMPONENT_TREE.md).
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
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        No analyses yet.
        <br />
        Search a company to start.
      </p>
    );
  }

  return (
    <div className="al-scrollbar h-full overflow-y-auto space-y-1 pr-0.5">
      <AnimatePresence initial={false}>
        {history.map((entry) => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            onSelect={onSelect}
            isActive={activeId === entry.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
