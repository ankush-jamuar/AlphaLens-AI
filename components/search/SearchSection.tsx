"use client";

/**
 * SearchSection — Main search area.
 * Contains: SearchInput, AnalyzeButton, SuggestedCompanies.
 * Owns: current company name state (COMPONENT_TREE.md).
 */

import { useState, useCallback, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuggestedCompanies } from "./SuggestedCompanies";
import { validateCompanyName } from "@/utils/format";
import { cn } from "@/lib/utils";

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
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

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
        "space-y-4",
        hasReport ? "py-4" : "py-10"
      )}
    >
      {/* Heading — shown only before first report */}
      {!hasReport && (
        <div className="mb-6 space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground">
            Investment Research{" "}
            <span className="al-text-gradient">Workspace</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Analyze any public company with AI-powered research and explainable
            recommendations.
          </p>
        </div>
      )}

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="company-search"
            type="text"
            placeholder="Analyze a public company..."
            value={query}
            onChange={handleChange}
            disabled={isLoading}
            autoComplete="off"
            aria-label="Company name"
            aria-describedby={validationError ? "search-error" : undefined}
            className={cn(
              "h-11 pl-10 pr-4 text-sm",
              "border-border bg-white/[0.03] placeholder:text-muted-foreground/50",
              "focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20",
              validationError && "border-red-400/50 focus-visible:ring-red-400/20"
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          size="default"
          className="h-11 gap-2 bg-emerald-400 px-5 text-sm font-semibold text-emerald-950 hover:bg-emerald-300 disabled:opacity-50"
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
          className="text-xs text-red-400"
        >
          {validationError}
        </p>
      )}

      {/* Suggestions — shown only before first report or after */}
      {!isLoading && (
        <SuggestedCompanies onSelect={handleSuggestionSelect} />
      )}
    </motion.div>
  );
}
