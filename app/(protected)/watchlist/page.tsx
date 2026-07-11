"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  Plus, 
  Trash2, 
  Pin, 
  Star, 
  Search, 
  ArrowUpDown, 
  Play, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/clerk-mock";
import { 
  getWatchlistAction, 
  addToWatchlistAction, 
  toggleWatchlistItemAction, 
  removeFromWatchlistAction 
} from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import { cn } from "@/lib/utils";

export default function WatchlistPage() {
  const { userId } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [newTicker, setNewTicker] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"ticker" | "date" | "pinned">("pinned");

  const fetchWatchlist = async () => {
    if (!userId) return;
    setIsLoading(true);
    const res = await getWatchlistAction(userId);
    if (res.success) {
      setWatchlist(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [userId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newTicker.trim() || !newCompanyName.trim()) return;

    setIsAdding(true);
    const res = await addToWatchlistAction({
      userId,
      ticker: newTicker.trim().toUpperCase(),
      companyName: newCompanyName.trim(),
    });

    if (res.success) {
      toast(`Added ${newTicker.toUpperCase()} to your watchlist`, "success");
      setNewTicker("");
      setNewCompanyName("");
      fetchWatchlist();
    } else {
      toast(`Failed to add: ${res.error}`, "error");
    }
    setIsAdding(false);
  };

  const handleToggle = async (id: string, field: "pinned" | "favorite", currentValue: boolean) => {
    const res = await toggleWatchlistItemAction({
      id,
      field,
      value: !currentValue,
    });
    if (res.success) {
      toast(`Watchlist item updated`, "success");
      fetchWatchlist();
    }
  };

  const handleDelete = async (id: string, ticker: string) => {
    const res = await removeFromWatchlistAction(id);
    if (res.success) {
      toast(`Removed ${ticker} from your watchlist`, "success");
      fetchWatchlist();
    }
  };

  const handleRunAnalysis = (ticker: string) => {
    router.push(`/analyze?analyze=${encodeURIComponent(ticker)}`);
  };

  // Filter & Sort
  const filteredList = watchlist.filter(item => 
    item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortBy === "ticker") {
      return a.ticker.localeCompare(b.ticker);
    }
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: pinned first, then favorite, then date
    const aPin = a.pinned ? 1 : 0;
    const bPin = b.pinned ? 1 : 0;
    if (bPin !== aPin) return bPin - aPin;

    const aFav = a.favorite ? 1 : 0;
    const bFav = b.favorite ? 1 : 0;
    if (bFav !== aFav) return bFav - aFav;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto overflow-y-auto h-full al-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Eye className="w-6 h-6 text-emerald-400" />
            Watchlist
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitor target companies, pin key listings, and run quick agent-driven analyses.
          </p>
        </div>
      </div>

      {/* Grid: Add Form + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Add Company Form */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
          <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Add Company</h4>
          <form onSubmit={handleAdd} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Stock Ticker</label>
              <input
                type="text"
                placeholder="e.g. AAPL"
                value={newTicker}
                onChange={e => setNewTicker(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Apple Inc."
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer"
            >
              {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add to Watchlist
            </button>
          </form>
        </div>

        {/* Watchlist Main Container */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-2xl al-glass">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search watchlist..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-[10px] text-muted-foreground font-bold">Sort:</span>
              <button 
                onClick={() => setSortBy("pinned")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                  sortBy === "pinned" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-transparent border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                Pinned
              </button>
              <button 
                onClick={() => setSortBy("ticker")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                  sortBy === "ticker" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-transparent border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                Symbol
              </button>
              <button 
                onClick={() => setSortBy("date")}
                className={cn(
                  "px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                  sortBy === "date" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-transparent border-white/10 text-muted-foreground hover:text-foreground"
                )}
              >
                Date Added
              </button>
            </div>
          </div>

          {/* List display */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sortedList.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-xs font-bold text-foreground">Your watchlist is empty</p>
              <p className="text-[10px] text-muted-foreground mt-1">Add tickers on the left to start tracking them.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sortedList.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border bg-white/[0.01] transition-all hover:bg-white/[0.03] al-glass",
                      item.pinned ? "border-emerald-500/20" : "border-white/5"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-foreground">{item.ticker}</span>
                        {item.pinned && <Pin className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
                        {item.favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5">{item.companyName}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunAnalysis(item.ticker)}
                        className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition-all text-xs flex items-center gap-1.5 font-bold cursor-pointer"
                        title="Analyze Company Ticker"
                      >
                        <Play className="w-3 h-3 fill-emerald-400" />
                        Analyze
                      </button>

                      {/* Pin */}
                      <button
                        onClick={() => handleToggle(item.id, "pinned", item.pinned)}
                        className={cn(
                          "p-2 rounded-lg border transition-all cursor-pointer",
                          item.pinned ? "border-emerald-500/25 text-emerald-400 bg-emerald-500/5" : "border-white/10 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Favorite */}
                      <button
                        onClick={() => handleToggle(item.id, "favorite", item.favorite)}
                        className={cn(
                          "p-2 rounded-lg border transition-all cursor-pointer",
                          item.favorite ? "border-amber-500/25 text-amber-400 bg-amber-500/5" : "border-white/10 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>

                      {/* Trash */}
                      <button
                        onClick={() => handleDelete(item.id, item.ticker)}
                        className="p-2 rounded-lg border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
