"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  Plus, 
  X, 
  TrendingUp, 
  AlertTriangle,
  Loader2,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanyComparisonAction } from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const { toast } = useToast();
  const [selectedTickers, setSelectedTickers] = useState<string[]>(["AAPL", "MSFT"]);
  const [tickerInput, setTickerInput] = useState("");
  const [customData, setCustomData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load initial comparison targets
  useEffect(() => {
    const loadInitials = async () => {
      setIsLoading(true);
      try {
        const initials = ["AAPL", "MSFT"];
        for (const t of initials) {
          const res = await getCompanyComparisonAction(t);
          if (res.success && res.data) {
            setCustomData(prev => ({ ...prev, [t]: res.data }));
          }
        }
      } catch (err) {
        console.error("Failed to load initial comparisons", err);
      }
      setIsLoading(false);
    };
    loadInitials();
  }, []);

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTicker = tickerInput.trim().toUpperCase();
    if (!cleanTicker) return;

    if (selectedTickers.includes(cleanTicker)) {
      toast(`${cleanTicker} is already in the comparison list.`, "info");
      setTickerInput("");
      return;
    }

    if (selectedTickers.length >= 4) {
      toast("You can compare up to 4 companies simultaneously.", "info");
      return;
    }

    setIsLoading(true);
    try {
      const res = await getCompanyComparisonAction(cleanTicker);
      if (res.success && res.data) {
        setCustomData(prev => ({ ...prev, [cleanTicker]: res.data }));
        setSelectedTickers(prev => [...prev, cleanTicker]);
        toast(`Added and resolved ${cleanTicker}`, "success");
      } else {
        toast(res.error || `Could not resolve ticker ${cleanTicker}`, "error");
      }
      setTickerInput("");
    } catch (err) {
      toast("Error querying stock details", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTicker = (ticker: string) => {
    setSelectedTickers(prev => prev.filter(t => t !== ticker));
  };

  // Compile company datasets to render side-by-side
  const companies = selectedTickers.map(t => customData[t]).filter(Boolean);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full al-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
            Company Comparison Workspace
          </h2>
          <p className="text-xs text-muted-foreground">
            Compare financial ratios, valuations, and intelligence recommendations for up to 4 companies.
          </p>
        </div>
      </div>

      {/* Ticker Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.01] al-glass">
        <form onSubmit={handleAddTicker} className="flex gap-2 w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Add ticker (e.g. NVDA, AMZN, MSFT)..."
            value={tickerInput}
            onChange={e => setTickerInput(e.target.value)}
            className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || selectedTickers.length >= 4}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Add
          </button>
        </form>

        {/* Display selected tags */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          {selectedTickers.map(t => (
            <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-xs font-bold font-mono">
              <span>{t}</span>
              <button 
                onClick={() => handleRemoveTicker(t)}
                className="hover:bg-emerald-500/20 p-0.5 rounded transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Grid Table */}
      {isLoading && companies.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-white/5">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Gathering financial statements...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <ArrowLeftRight className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-xs font-bold text-foreground">No companies selected</p>
          <p className="text-[10px] text-muted-foreground mt-1">Add tickers using the field above to start side-by-side comparisons.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <AnimatePresence mode="popLayout">
            {companies.map((comp) => (
              <motion.div
                key={comp.ticker}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass flex flex-col justify-between"
              >
                {/* Company Title */}
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div>
                      <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{comp.ticker}</span>
                      <h3 className="text-sm font-extrabold text-foreground tracking-tight mt-1.5 truncate max-w-[150px]">{comp.name}</h3>
                    </div>
                    {selectedTickers.length > 1 && (
                      <button 
                        onClick={() => handleRemoveTicker(comp.ticker)}
                        className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Financial Metrics Grid */}
                  <div className="py-4 space-y-2.5 border-b border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Market Cap</span>
                      <span className="font-mono text-foreground font-bold">{comp.marketCap}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Revenue (TTM)</span>
                      <span className="font-mono text-foreground">{comp.revenue}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">Net Income (TTM)</span>
                      <span className="font-mono text-foreground">{comp.netIncome}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">P/E Ratio</span>
                      <span className="font-mono text-foreground">{comp.peRatio}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-semibold">EPS</span>
                      <span className="font-mono text-foreground">{comp.eps}</span>
                    </div>
                  </div>

                  {/* Insights Section */}
                  <div className="py-4 space-y-4">
                    {/* Strengths */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Core Strengths</p>
                      <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                        {comp.strengths.slice(0, 3).map((st: string, i: number) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Weaknesses */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Risk Factors</p>
                      <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                        {comp.weaknesses.slice(0, 3).map((wk: string, i: number) => (
                          <li key={i}>{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendation Summary Footer */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider">AI Decision</span>
                    <span className={cn(
                      "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border mt-0.5",
                      comp.recommendation === "Invest"
                        ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                        : comp.recommendation === "Watch"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                        : "bg-red-500/5 text-red-400 border-red-500/20"
                    )}>
                      {comp.recommendation}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-wider block">Score</span>
                    <span className="text-sm font-mono font-black text-foreground">{comp.score}/100</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
