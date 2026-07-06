"use client";

import { useState, useCallback, useEffect } from "react";
import type { HistoryEntry, InvestmentReport } from "@/types";
import { HISTORY_STORAGE_KEY, MAX_HISTORY_SIZE } from "@/lib/constants";

/**
 * Loads history entries safely from localStorage.
 */
function loadFromStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse local history storage data, resetting history:", error);
    return [];
  }
}

/**
 * Persists history entries to localStorage.
 */
function saveToStorage(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Failed to write history data to localStorage:", error);
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history safely on client mount to bypass SSR mismatches
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(loadFromStorage());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Saves a completed report to local history.
   * Limits history list size to 20 entries, newest first.
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
      // Remove any existing duplicate entries matching the same ID
      const filtered = prev.filter((h) => h.id !== entry.id);
      const updatedHistory = [entry, ...filtered].slice(0, MAX_HISTORY_SIZE);
      saveToStorage(updatedHistory);
      return updatedHistory;
    });
  }, []);

  /**
   * Removes a single history entry by ID.
   */
  const remove = useCallback((id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== id);
      saveToStorage(filtered);
      return filtered;
    });
  }, []);

  /**
   * Clears all stored reports.
   */
  const clear = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to remove history key from localStorage:", error);
      }
    }
  }, []);

  return {
    history,
    save,
    remove,
    clear,
    hasHistory: history.length > 0,
  };
}
