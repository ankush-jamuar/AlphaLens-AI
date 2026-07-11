"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  ChevronRight,
  ChevronLeft,
  X,
  FileCode,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/clerk-mock";
import { getSavedReportsAction, deleteSavedReportAction, toggleFavoriteReportAction, recordExportAction } from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import { ReportSection } from "@/components/report/ReportSection";
import { cn } from "@/lib/utils";

function ReportsContent() {
  const { userId } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRecommendation, setFilterRecommendation] = useState<string>("All");
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Read URL query parameter for direct report view link (from dashboard)
  useEffect(() => {
    const reportId = searchParams.get("id");
    if (reportId) {
      setSelectedReportId(reportId);
    }
  }, [searchParams]);

  const fetchReports = async () => {
    if (!userId) return;
    setIsLoading(true);
    const res = await getSavedReportsAction(userId);
    if (res.success) {
      setReports(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [userId]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await deleteSavedReportAction(id);
    if (res.success) {
      toast("Report deleted successfully", "success");
      if (selectedReportId === id) {
        setSelectedReportId(null);
        router.replace("/reports");
      }
      fetchReports();
    }
  };

  const handleToggleFavorite = async (id: string, currentFav: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await toggleFavoriteReportAction({
      reportId: id,
      favorite: !currentFav,
    });
    if (res.success) {
      toast("Report settings updated", "success");
      fetchReports();
    }
  };

  const handleExport = (report: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const parsedReport = JSON.parse(report.reportData);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedReport, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `alphalens_${report.companyName.toLowerCase().replace(/\s+/g, "_")}_report.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast(`Exported ${report.companyName} report to JSON`, "success");
      if (userId) {
        recordExportAction({
          userId,
          reportId: report.id,
          format: "json",
        });
      }
    } catch (err) {
      toast("Failed to export report", "error");
    }
  };

  // Find selected report parsed data
  const selectedReport = reports.find(r => r.id === selectedReportId);
  let parsedReportData: any = null;
  if (selectedReport) {
    try {
      parsedReportData = JSON.parse(selectedReport.reportData);
    } catch (e) {
      console.error("Failed to parse report data", e);
    }
  }

  // Filters
  const filteredReports = useMemo(() => reports.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRecommendation = filterRecommendation === "All" || r.recommendation === filterRecommendation;
    const matchesFavorite = !filterFavorite || r.favorite;
    return matchesSearch && matchesRecommendation && matchesFavorite;
  }), [reports, searchQuery, filterRecommendation, filterFavorite]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto overflow-y-auto h-full al-scrollbar relative">

      <AnimatePresence>
        {selectedReportId && parsedReportData ? (
          /* Report Overlay Reader */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950 z-50 flex flex-col p-6"
          >
            {/* Overlay Navigation Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6 no-print">
              <button
                onClick={() => {
                  setSelectedReportId(null);
                  router.replace("/reports");
                }}
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronLeft className="w-4.5 h-4.5" />
                Back to List
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleExport(selectedReport, e)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON Export
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                >
                  Print Report
                </button>
              </div>
            </div>

            {/* Main Report Document Panel */}
            <div className="flex-1 overflow-y-auto al-scrollbar max-w-4xl mx-auto w-full px-2">
              <ReportSection report={parsedReportData} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Main List View */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-emerald-400" />
              Saved Intelligence Reports
            </h2>
            <p className="text-xs text-muted-foreground">
              Browse permanently archived stock reports generated by the AlphaLens agent pipeline.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white/[0.01] border border-white/5 p-4 rounded-2xl al-glass">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search by company or ticker..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Recommendation:</span>
              <select
                value={filterRecommendation}
                onChange={e => setFilterRecommendation(e.target.value)}
                className="bg-zinc-950 border border-white/10 rounded-lg text-xs font-bold text-foreground px-2.5 py-1.5 focus:border-emerald-500/50 outline-none"
              >
                <option value="All">All Recommendations</option>
                <option value="Invest">Invest</option>
                <option value="Watch">Watch</option>
                <option value="Pass">Pass</option>
              </select>
            </div>

            <button
              onClick={() => setFilterFavorite(!filterFavorite)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer",
                filterFavorite
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-transparent border-white/10 text-muted-foreground hover:text-foreground"
              )}
            >
              <Star className={cn("w-3.5 h-3.5", filterFavorite ? "fill-amber-400 text-amber-400" : "")} />
              Favorites Only
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-xs font-bold text-foreground">No saved reports found</p>
            <p className="text-[10px] text-muted-foreground mt-1">Generate research reports on the New Analysis workspace.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReports.map(report => (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className="group rounded-2xl border border-white/5 bg-white/[0.01] p-5 hover:bg-white/[0.03] hover:border-emerald-500/20 transition-all cursor-pointer relative al-glass flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{report.ticker}</span>
                    <div className="flex gap-1.5 no-print">
                      <button
                        onClick={(e) => handleToggleFavorite(report.id, report.favorite, e)}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-amber-400 transition-colors"
                      >
                        <Star className={cn("w-4 h-4", report.favorite ? "fill-amber-400 text-amber-400" : "")} />
                      </button>
                      <button
                        onClick={(e) => handleExport(report, e)}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Export to JSON"
                      >
                        <FileCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(report.id, e)}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-foreground tracking-tight mt-2 truncate group-hover:text-emerald-400 transition-colors">
                    {report.companyName}
                  </h3>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">Generated: {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-4">
                  <span className={cn(
                    "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border",
                    report.recommendation === "Invest"
                      ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                      : report.recommendation === "Watch"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                        : "bg-red-500/5 text-red-400 border-red-500/20"
                  )}>
                    {report.recommendation}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-foreground">Score: {report.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading reports panel...</div>}>
      <ReportsContent />
    </Suspense>
  );
}
