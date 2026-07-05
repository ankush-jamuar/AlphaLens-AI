"use client";

/**
 * Workspace — Primary application container.
 *
 * Responsible for:
 * - Composing the interface
 * - Coordinating page-level state (current report, loading, error)
 * - Rendering the correct view (empty / loading / report / error)
 *
 * Owns: current report, loading state, error state (COMPONENT_TREE.md).
 *
 * Component tree:
 * Workspace
 *   ├── Sidebar (with HistoryList)
 *   ├── SearchSection
 *   ├── ProgressTimeline (while loading)
 *   ├── ReportSection (when report loaded)
 *   ├── EmptyState (initial)
 *   └── ErrorState (on failure)
 */

import { useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchSection } from "@/components/search/SearchSection";
import { ProgressTimeline } from "@/components/progress/ProgressTimeline";
import { ReportSection } from "@/components/report/ReportSection";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ReportSkeleton } from "@/components/shared/SkeletonLoader";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useHistory } from "@/hooks/useHistory";
import type { InvestmentReport } from "@/types";

export function Workspace() {
  const { status, report, error, currentStep, isLoading, analyze, reset } =
    useAnalysis();
  const { history } = useHistory();

  const handleAnalyze = useCallback(
    async (companyName: string) => {
      await analyze(companyName);
    },
    [analyze]
  );

  const handleSelectHistoryReport = useCallback(
    (_selectedReport: InvestmentReport) => {
      // TODO [Milestone 2]: Load full report from localStorage by ID and inject into analysis state.
      // For now this resets to idle — report loading from history will be wired in Milestone 2.
      reset();
    },
    [reset]
  );

  return (
    <div className="flex h-[calc(100dvh-64px)] overflow-hidden">
      {/* ----------------------------------------------------------------
          Sidebar
      ---------------------------------------------------------------- */}
      <Sidebar
        history={history}
        onNewAnalysis={reset}
        onSelectReport={handleSelectHistoryReport}
      />

      {/* ----------------------------------------------------------------
          Main content area
      ---------------------------------------------------------------- */}
      <main className="al-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          {/* Search — always visible */}
          <SearchSection
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            hasReport={status === "success"}
          />

          {/* Content area */}
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                <ProgressTimeline currentStep={currentStep} />
                <ReportSkeleton />
              </motion.div>
            )}

            {/* Error state */}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState
                  message={error ?? "We couldn't complete the analysis. Please try again."}
                  onRetry={reset}
                />
              </motion.div>
            )}

            {/* Report */}
            {status === "success" && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <ReportSection report={report} />
              </motion.div>
            )}

            {/* Empty state */}
            {status === "idle" && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
