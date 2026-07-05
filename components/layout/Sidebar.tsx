"use client";

/**
 * Sidebar — Collapsible navigation sidebar.
 *
 * Desktop: Collapsible (expanded by default, 280px).
 * Mobile: Slide-out drawer.
 *
 * Sections:
 * - New Analysis button
 * - Recent Analyses list (from useHistory)
 *
 * COMPONENT_TREE.md: Sidebar > HistoryList > HistoryItem
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  PanelLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HistoryList } from "@/components/history/HistoryList";
import type { HistoryEntry, InvestmentReport } from "@/types";

interface SidebarProps {
  history: HistoryEntry[];
  onNewAnalysis: () => void;
  onSelectReport: (report: InvestmentReport) => void;
  onRemoveHistory?: (id: string) => void;
  className?: string;
}

const SIDEBAR_WIDTH = 280;

export function Sidebar({
  history,
  onNewAnalysis,
  onSelectReport,
  onRemoveHistory,
  className,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggle = useCallback(() => setIsExpanded((prev) => !prev), []);
  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const handleSelectReport = useCallback(
    (report: InvestmentReport) => {
      onSelectReport(report);
      closeMobile();
    },
    [onSelectReport, closeMobile]
  );

  return (
    <>
      {/* ----------------------------------------------------------------
          Mobile trigger button
      ---------------------------------------------------------------- */}
      <button
        onClick={openMobile}
        aria-label="Open sidebar"
        className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg sm:hidden"
      >
        <PanelLeft className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* ----------------------------------------------------------------
          Mobile Overlay
      ---------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-[#0f172a] sm:hidden"
            >
              <SidebarContent
                history={history}
                onNewAnalysis={() => { onNewAnalysis(); closeMobile(); }}
                onSelectReport={handleSelectReport}
                onRemoveHistory={onRemoveHistory}
                isExpanded
                showCloseButton
                onClose={closeMobile}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------
          Desktop Sidebar
      ---------------------------------------------------------------- */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? SIDEBAR_WIDTH : 56 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "relative hidden h-full shrink-0 flex-col border-r border-border bg-[#0f172a] sm:flex",
          className
        )}
      >
        <SidebarContent
          history={history}
          onNewAnalysis={onNewAnalysis}
          onSelectReport={onSelectReport}
          onRemoveHistory={onRemoveHistory}
          isExpanded={isExpanded}
          onToggle={toggle}
        />
      </motion.aside>
    </>
  );
}

// ---------------------------------------------------------------------------
// Internal sidebar content
// ---------------------------------------------------------------------------

interface SidebarContentProps {
  history: HistoryEntry[];
  onNewAnalysis: () => void;
  onSelectReport: (report: InvestmentReport) => void;
  onRemoveHistory?: (id: string) => void;
  isExpanded: boolean;
  onToggle?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  history,
  onNewAnalysis,
  onSelectReport,
  onRemoveHistory,
  isExpanded,
  onToggle,
  showCloseButton,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-4">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.span
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Workspace
            </motion.span>
          )}
        </AnimatePresence>

        {showCloseButton ? (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : onToggle ? (
          <button
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : null}
      </div>

      {/* New Analysis */}
      <div className="shrink-0 px-3 pt-4">
        {isExpanded ? (
          <Button
            onClick={onNewAnalysis}
            className="w-full justify-start gap-2 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 border border-emerald-400/20"
            variant="ghost"
            size="sm"
          >
            <Plus className="h-4 w-4 shrink-0" />
            New Analysis
          </Button>
        ) : (
          <button
            onClick={onNewAnalysis}
            aria-label="New Analysis"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recent Analyses */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden px-3 pt-6">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Recent
            </span>
          </div>

          <HistoryList
            history={history}
            onSelect={onSelectReport}
            onRemove={onRemoveHistory}
          />
        </div>
      )}
    </div>
  );
}
