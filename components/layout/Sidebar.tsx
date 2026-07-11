"use client";

/**
 * Sidebar — Collapsible navigation sidebar.
 *
 * Desktop: Collapsible (expanded by default, 280px).
 * Mobile: Slide-out drawer.
 *
 * Sections:
 * - New Analysis button
 * - Filter input (Search history)
 * - Recent Analyses grouped by Today / Yesterday / Earlier
 */

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  PanelLeft,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HistoryList } from "@/components/history/HistoryList";
import type { HistoryEntry, InvestmentReport } from "@/types";

interface SidebarProps {
  history: HistoryEntry[];
  onNewAnalysis: () => void;
  onSelectReport: (report: InvestmentReport) => void;
  onRemoveHistory?: (id: string) => void;
  activeId?: string;
  className?: string;
}

const SIDEBAR_WIDTH = 280;

function groupHistory(entries: HistoryEntry[]) {
  const today: HistoryEntry[] = [];
  const yesterday: HistoryEntry[] = [];
  const earlier: HistoryEntry[] = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  entries.forEach((entry) => {
    const time = new Date(entry.createdAt).getTime();
    if (time >= startOfToday) {
      today.push(entry);
    } else if (time >= startOfYesterday) {
      yesterday.push(entry);
    } else {
      earlier.push(entry);
    }
  });

  return { today, yesterday, earlier };
}

export function Sidebar({
  history,
  onNewAnalysis,
  onSelectReport,
  onRemoveHistory,
  activeId,
  className,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter(
      (entry) =>
        entry.companyName.toLowerCase().includes(q) ||
        (entry.report.company.ticker || "").toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const grouped = useMemo(() => groupHistory(filteredHistory), [filteredHistory]);

  return (
    <>
      {/* Mobile trigger button */}
      <button
        onClick={openMobile}
        aria-label="Open sidebar"
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-zinc-900 shadow-xl sm:hidden active:scale-95 transition-transform"
      >
        <PanelLeft className="h-5 w-5 text-emerald-400" />
      </button>

      {/* Mobile Overlay */}
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
              className="fixed inset-0 z-45 bg-black/60 sm:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border/40 bg-zinc-950 sm:hidden"
            >
              <SidebarContent
                history={history}
                grouped={grouped}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNewAnalysis={() => {
                  onNewAnalysis();
                  closeMobile();
                }}
                onSelectReport={handleSelectReport}
                onRemoveHistory={onRemoveHistory}
                isExpanded
                showCloseButton
                onClose={closeMobile}
                activeId={activeId}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? SIDEBAR_WIDTH : 64 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "relative hidden h-full shrink-0 flex-col border-r border-border/40 bg-zinc-950 sm:flex no-print",
          className
        )}
      >
        <SidebarContent
          history={history}
          grouped={grouped}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewAnalysis={onNewAnalysis}
          onSelectReport={onSelectReport}
          onRemoveHistory={onRemoveHistory}
          isExpanded={isExpanded}
          onToggle={toggle}
          activeId={activeId}
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
  grouped: { today: HistoryEntry[]; yesterday: HistoryEntry[]; earlier: HistoryEntry[] };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewAnalysis: () => void;
  onSelectReport: (report: InvestmentReport) => void;
  onRemoveHistory?: (id: string) => void;
  isExpanded: boolean;
  onToggle?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
  activeId?: string;
}

function SidebarContent({
  history,
  grouped,
  searchQuery,
  onSearchChange,
  onNewAnalysis,
  onSelectReport,
  onRemoveHistory,
  isExpanded,
  onToggle,
  showCloseButton,
  onClose,
  activeId,
}: SidebarContentProps) {
  const hasItems = history.length > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/30 px-4">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.span
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xs font-bold uppercase tracking-widest text-emerald-400"
            >
              AlphaLens AI
            </motion.span>
          ) : (
            <motion.span
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-black text-emerald-400 mx-auto"
            >
              AL
            </motion.span>
          )}
        </AnimatePresence>

        {showCloseButton ? (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground active:scale-95 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        ) : onToggle ? (
          <button
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground active:scale-95 transition-all"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : null}
      </div>

      {/* New Analysis Button */}
      <div className="shrink-0 px-3 pt-4">
        {isExpanded ? (
          <Button
            onClick={onNewAnalysis}
            className="w-full justify-start gap-2 bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/15 border border-emerald-400/20 rounded-xl"
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
            className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/15 border border-emerald-400/20 active:scale-95 transition-all"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Search Input for history filter */}
      {isExpanded && hasItems && (
        <div className="shrink-0 px-3 pt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 pl-9 pr-3 text-xs bg-white/[0.01] border-border/50 rounded-lg placeholder:text-muted-foreground/30 focus-visible:ring-emerald-400/10 focus-visible:border-emerald-400/20"
            />
          </div>
        </div>
      )}

      {/* Recent Analyses grouped sections */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-3 pt-6 al-scrollbar space-y-5 pb-6">
          {grouped.today.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Today
              </div>
              <HistoryList
                history={grouped.today}
                onSelect={onSelectReport}
                onRemove={onRemoveHistory}
                activeId={activeId}
              />
            </div>
          )}

          {grouped.yesterday.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Yesterday
              </div>
              <HistoryList
                history={grouped.yesterday}
                onSelect={onSelectReport}
                onRemove={onRemoveHistory}
                activeId={activeId}
              />
            </div>
          )}

          {grouped.earlier.length > 0 && (
            <div className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Earlier
              </div>
              <HistoryList
                history={grouped.earlier}
                onSelect={onSelectReport}
                onRemove={onRemoveHistory}
                activeId={activeId}
              />
            </div>
          )}

          {!hasItems && (
            <div className="py-8 text-center text-xs text-muted-foreground/40 font-medium">
              No analyses yet.
              <br />
              Analyze a company to start.
            </div>
          )}

          {hasItems &&
            grouped.today.length === 0 &&
            grouped.yesterday.length === 0 &&
            grouped.earlier.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground/40 font-medium">
                No matching reports.
              </div>
            )}
        </div>
      )}
    </div>
  );
}
