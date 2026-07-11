"use client";

/**
 * ExportMenu — Reusable dropdown for exporting reports.
 * Actions: Export PDF (Print), Export Markdown, Export JSON, Copy Report.
 */

import { useState, useRef, useEffect } from "react";
import { Download, FileJson, FileText, Clipboard, Printer, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/clerk-mock";
import { recordExportAction } from "@/lib/db-actions";
import { cn } from "@/lib/utils";
import type { InvestmentReport } from "@/types";

interface ExportMenuProps {
  report: InvestmentReport;
}

export function ExportMenu({ report }: ExportMenuProps) {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      const summaryText = `Investment Analysis: ${report.company.name} (${report.company.ticker || "N/A"})
Decision: ${report.recommendation.decision}
Score: ${report.recommendation.score}/100
Confidence: ${report.recommendation.confidence}%
Thesis: ${report.recommendation.thesis}`;
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (userId) {
        recordExportAction({
          userId,
          reportId: report.id,
          format: "clipboard",
        });
      }
    } catch (err) {
      console.error("Failed to copy report:", err);
    }
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `alphalens_${report.company.name.toLowerCase().replace(/\s+/g, "_")}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (userId) {
      recordExportAction({
        userId,
        reportId: report.id,
        format: "json",
      });
    }
  };

  const handleDownloadMarkdown = () => {
    const mdText = `# Investment Intelligence Report: ${report.company.name} (${report.company.ticker || "N/A"})
Generated: ${new Date(report.createdAt).toLocaleString()}

## Executive Summary
- **Industry**: ${report.company.industry}
- **Headquarters**: ${report.company.headquarters}
- **Market Cap**: ${report.company.marketCap || "N/A"}

## Recommendation
- **Decision**: ${report.recommendation.decision}
- **Investment Score**: ${report.recommendation.score}/100
- **AI Confidence**: ${report.recommendation.confidence}%

### Thesis Summary
${report.recommendation.thesis}

### Strategic Catalysts
${report.recommendation.positives.map((p) => `- ${p}`).join("\n")}

### Key Risks
${report.recommendation.negatives.map((n) => `- ${n}`).join("\n")}

## Financial Health Snapshot
- **Revenue**: ${report.financials.revenue || "N/A"}
- **Net Income**: ${report.financials.netIncome || "N/A"}
- **Earnings Per Share (EPS)**: ${report.financials.eps || "N/A"}
- **P/E Ratio**: ${report.financials.peRatio || "N/A"}
- **Total Outstanding Debt**: ${report.financials.debt || "N/A"}
- **Operating Cash Flow**: ${report.financials.cashFlow || "N/A"}

## Market Analysis
- **Strengths**: ${report.market.strengths.join(", ")}
- **Weaknesses**: ${report.market.weaknesses.join(", ")}
- **Key Competitors**: ${report.market.competitors.join(", ")}

## Source Citations
${report.sources.map((s) => `- [${s.title}](${s.url})`).join("\n")}
`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdText);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `alphalens_${report.company.name.toLowerCase().replace(/\s+/g, "_")}_report.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (userId) {
      recordExportAction({
        userId,
        reportId: report.id,
        format: "markdown",
      });
    }
  };

  const handlePrint = () => {
    window.print();
    if (userId) {
      recordExportAction({
        userId,
        reportId: report.id,
        format: "pdf",
      });
    }
  };

  return (
    <div className="relative inline-block text-left no-print" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-border/80 bg-white/[0.02] px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-foreground hover:bg-white/[0.05] active:scale-95 transition-all"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Download className="h-3.5 w-3.5" />
        Export
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border/40 bg-zinc-900/95 backdrop-blur-md p-1.5 shadow-2xl z-50"
            role="menu"
          >
            {/* Copy Report */}
            <button
              onClick={handleCopy}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground/80 hover:bg-white/[0.04] hover:text-foreground transition-all"
              role="menuitem"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Copied Summary
                </>
              ) : (
                <>
                  <Clipboard className="h-3.5 w-3.5 text-muted-foreground/60" />
                  Copy Summary
                </>
              )}
            </button>

            {/* Export Markdown */}
            <button
              onClick={handleDownloadMarkdown}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground/80 hover:bg-white/[0.04] hover:text-foreground transition-all"
              role="menuitem"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground/60" />
              Export Markdown
            </button>

            {/* Export JSON */}
            <button
              onClick={handleDownloadJSON}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground/80 hover:bg-white/[0.04] hover:text-foreground transition-all"
              role="menuitem"
            >
              <FileJson className="h-3.5 w-3.5 text-muted-foreground/60" />
              Export JSON
            </button>

            <div className="my-1 border-t border-border/20" />

            {/* Print/PDF */}
            <button
              onClick={handlePrint}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-foreground/80 hover:bg-white/[0.04] hover:text-foreground transition-all"
              role="menuitem"
            >
              <Printer className="h-3.5 w-3.5 text-muted-foreground/60" />
              Print / Save PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
