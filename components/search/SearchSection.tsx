"use client";

/**
 * SearchSection — Main search area.
 * Contains: SearchInput, AnalyzeButton, SuggestedCompanies.
 * Owns: current company name state (COMPONENT_TREE.md).
 */

import { useState, useCallback, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles, Clock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuggestedCompanies } from "./SuggestedCompanies";
import { validateCompanyName } from "@/utils/format";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/clerk-mock";
import { getSearchHistoryAction } from "@/lib/db-actions";

interface SearchSectionProps {
  onAnalyze: (companyName: string) => void;
  isLoading: boolean;
  hasReport: boolean;
}

export function SearchSection({
  onAnalyze,
  isLoading,
  hasReport,
}: SearchSectionProps) {
  const { userId } = useAuth();
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);

  // Cycling placeholders for premium SaaS search experience
  const placeholders = [
    "Apple Inc. (AAPL)...",
    "Microsoft Corporation (MSFT)...",
    "NVIDIA Corporation (NVDA)...",
    "Tesla Inc. (TSLA)...",
    "Amazon.com Inc. (AMZN)...",
    "Meta Platforms (META)...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Load search history
  useEffect(() => {
    if (userId) {
      getSearchHistoryAction(userId).then(res => {
        if (res.success) {
          setSearchHistory(res.data);
        }
      });
    }
  }, [userId, isLoading]); // Refetch on loading changes to get newly completed search

  // Keyboard shortcut listener (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("company-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const error = validateCompanyName(query);
      if (error) {
        setValidationError(error);
        return;
      }
      setValidationError(null);
      onAnalyze(query.trim());
    },
    [query, onAnalyze]
  );

  const handleSuggestionSelect = useCallback(
    (company: string) => {
      setQuery(company);
      setValidationError(null);
      onAnalyze(company);
    },
    [onAnalyze]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      if (validationError) setValidationError(null);
    },
    [validationError]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "space-y-4 no-print",
        hasReport ? "py-2" : "py-14"
      )}
    >
      {/* Heading — shown only before first report */}
      {!hasReport && (
        <div className="mb-8 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            AI Investment Research{" "}
            <span className="al-text-gradient bg-gradient-to-r from-emerald-400 to-teal-300">Engine</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl">
            Analyze any public company with a multi-agent AI framework, performing parallel research and structured financial analysis.
          </p>
        </div>
      )}

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-3xl">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 transition-colors" />
          <Input
            id="company-search"
            type="text"
            value={query}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="off"
            aria-label="Company name"
            aria-describedby={validationError ? "search-error" : undefined}
            className={cn(
              "h-12 pl-11 pr-16 text-sm rounded-xl font-medium",
              "border-border/50 bg-white/[0.02] placeholder:text-muted-foreground/40",
              "focus-visible:border-emerald-400/40 focus-visible:ring-2 focus-visible:ring-emerald-400/10 focus-visible:bg-white/[0.04]",
              "transition-all duration-300",
              validationError && "border-red-400/40 focus-visible:ring-red-400/10"
            )}
          />
          {/* Animated custom placeholder */}
          {!query && (
            <div className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 overflow-hidden h-5 text-sm text-muted-foreground/40 font-medium">
              <AnimatePresence mode="wait">
                <motion.div
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {placeholders[placeholderIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Keyboard shortcut indicator */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
            <kbd className="inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/10 bg-white/[0.04] px-1.5 font-mono text-[9px] font-semibold text-muted-foreground/50 tracking-wider">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          size="default"
          className="h-12 gap-2 bg-emerald-400 rounded-xl px-6 text-sm font-semibold text-emerald-950 hover:bg-emerald-300 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </form>

      {/* Validation error */}
      {validationError && (
        <p
          id="search-error"
          role="alert"
          className="text-xs font-semibold text-red-400 pl-1"
        >
          {validationError}
        </p>
      )}

      {/* Suggestions */}
      {!isLoading && (
        <SuggestedCompanies onSelect={handleSuggestionSelect} />
      )}

      {/* Search History sections */}
      {!isLoading && !hasReport && searchHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5 max-w-3xl">
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" /> Recent Searches / Last Viewed
            </span>
            <div className="flex flex-col gap-1.5">
              {searchHistory.slice(0, 5).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSuggestionSelect(item.companyName)}
                  className="w-full flex items-center justify-between text-left rounded-xl border border-white/5 bg-white/[0.01] hover:border-emerald-500/20 hover:bg-emerald-500/5 px-3.5 py-2 text-xs text-zinc-300 hover:text-emerald-400 transition-all cursor-pointer font-medium"
                >
                  <span className="truncate">{item.companyName}</span>
                  <span className="font-mono text-[9.5px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 ml-2">{item.ticker}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-zinc-400" /> Most Frequently Analyzed
            </span>
            <div className="flex flex-col gap-1.5">
              {[...searchHistory].sort((a, b) => b.count - a.count).slice(0, 5).map(item => (
                <button
                  key={`freq_${item.id}`}
                  onClick={() => handleSuggestionSelect(item.companyName)}
                  className="w-full flex items-center justify-between text-left rounded-xl border border-white/5 bg-white/[0.01] hover:border-emerald-500/20 hover:bg-emerald-500/5 px-3.5 py-2 text-xs text-zinc-300 hover:text-emerald-400 transition-all cursor-pointer font-medium"
                >
                  <span className="truncate">{item.companyName}</span>
                  <div className="flex items-center gap-2 font-mono text-[9.5px] shrink-0 ml-2">
                    <span className="font-bold bg-white/5 px-1.5 py-0.5 rounded text-zinc-400">{item.ticker}</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">{item.count}x</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
