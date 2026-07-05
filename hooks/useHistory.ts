"use client";

/**
 * useHistory — Custom hook for managing local analysis history.
 *
 * Milestone 1: Returns mock data. localStorage integration is pending.
 * TODO [Milestone 2]: Replace MOCK_HISTORY with actual localStorage read/write.
 *                     Implement save(), remove(), and persistence logic.
 */

import { useState, useCallback } from "react";
import type { HistoryEntry, InvestmentReport } from "@/types";
import { MOCK_HISTORY } from "@/lib/mock-data";

export function useHistory() {
  // TODO [Milestone 2]: Replace useState(MOCK_HISTORY) with localStorage initialization.
  // const [history, setHistory] = useState<HistoryEntry[]>(() => loadFromStorage());
  const [history, setHistory] = useState<HistoryEntry[]>(MOCK_HISTORY);

  /**
   * Saves a completed report to history.
   * TODO [Milestone 2]: Implement localStorage persistence.
   *                     Enforce MAX_HISTORY_SIZE limit by removing oldest entry.
   */
  const save = useCallback((report: InvestmentReport) => {
    const entry: HistoryEntry = {
      id: report.id,
      companyName: report.company.name,
      recommendation: report.recommendation.decision,
      score: report.recommendation.score,
      createdAt: report.createdAt,
      report,
    };

    setHistory((prev) => {
      // TODO [Milestone 2]: Also persist to localStorage here.
      const filtered = prev.filter((h) => h.id !== entry.id);
      return [entry, ...filtered];
    });
  }, []);

  /**
   * Removes a history entry by ID.
   * TODO [Milestone 2]: Also remove from localStorage.
   */
  const remove = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  /**
   * Clears all history.
   * TODO [Milestone 2]: Also clear localStorage.
   */
  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    save,
    remove,
    clear,
    hasHistory: history.length > 0,
  };
}
