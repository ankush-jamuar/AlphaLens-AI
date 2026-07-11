"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  Loader2, 
  Calendar, 
  DollarSign, 
  Percent, 
  Activity,
  ArrowUpRight,
  TrendingDown,
  Search,
  ArrowUpDown,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useAuth } from "@/lib/clerk-mock";
import { 
  getPortfolioHoldingsAction, 
  addPortfolioHoldingAction, 
  updatePortfolioHoldingAction, 
  removePortfolioHoldingAction,
  getCurrentPriceAction
} from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const { userId } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingHolding, setEditingHolding] = useState<any>(null);

  // Form Fields
  const [ticker, setTicker] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [shares, setShares] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"ticker" | "shares" | "price" | "cost" | "gain" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchHoldings = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await getPortfolioHoldingsAction(userId);
      if (res.success) {
        // Fetch current prices to compute real gains/losses
        const holdingsWithPrices = await Promise.all(res.data.map(async (h: any) => {
          const priceRes = await getCurrentPriceAction(h.ticker);
          const currentPrice = priceRes.success ? priceRes.price : h.averagePrice;
          return {
            ...h,
            currentPrice,
          };
        }));
        setHoldings(holdingsWithPrices);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHoldings();
  }, [userId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !ticker.trim() || !companyName.trim() || !shares || !avgPrice) return;

    setIsAdding(true);
    const res = await addPortfolioHoldingAction({
      userId,
      ticker: ticker.trim().toUpperCase(),
      companyName: companyName.trim(),
      shares: parseFloat(shares),
      averagePrice: parseFloat(avgPrice),
      purchaseDate: new Date(purchaseDate).toISOString(),
    });

    if (res.success) {
      toast(`Added holding for ${ticker.toUpperCase()}`, "success");
      setTicker("");
      setCompanyName("");
      setShares("");
      setAvgPrice("");
      setPurchaseDate(new Date().toISOString().split("T")[0]);
      fetchHoldings();
    } else {
      toast(`Failed to add holding: ${res.error}`, "error");
    }
    setIsAdding(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !editingHolding || !shares || !avgPrice) return;

    setIsAdding(true);
    const res = await updatePortfolioHoldingAction({
      id: editingHolding.id,
      shares: parseFloat(shares),
      averagePrice: parseFloat(avgPrice),
      purchaseDate: new Date(purchaseDate).toISOString(),
    });

    if (res.success) {
      toast(`Updated holding for ${editingHolding.ticker}`, "success");
      setEditingHolding(null);
      setTicker("");
      setCompanyName("");
      setShares("");
      setAvgPrice("");
      setPurchaseDate(new Date().toISOString().split("T")[0]);
      fetchHoldings();
    } else {
      toast(`Failed to update holding: ${res.error}`, "error");
    }
    setIsAdding(false);
  };

  const handleStartEdit = (holding: any) => {
    setEditingHolding(holding);
    setTicker(holding.ticker);
    setCompanyName(holding.companyName);
    setShares(holding.shares.toString());
    setAvgPrice(holding.averagePrice.toString());
    setPurchaseDate(new Date(holding.purchaseDate).toISOString().split("T")[0]);
  };

  const handleCancelEdit = () => {
    setEditingHolding(null);
    setTicker("");
    setCompanyName("");
    setShares("");
    setAvgPrice("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
  };

  const handleDelete = async (id: string, ticker: string) => {
    const res = await removePortfolioHoldingAction(id);
    if (res.success) {
      toast(`Removed holding of ${ticker}`, "success");
      fetchHoldings();
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Calculations
  const totalCost = useMemo(() => holdings.reduce((sum, h) => sum + (h.shares * h.averagePrice), 0), [holdings]);
  const totalValue = useMemo(() => holdings.reduce((sum, h) => sum + (h.shares * (h.currentPrice || h.averagePrice)), 0), [holdings]);
  const totalGain = useMemo(() => totalValue - totalCost, [totalValue, totalCost]);
  const gainPercentage = useMemo(() => totalCost > 0 ? (totalGain / totalCost) * 100 : 0.0, [totalGain, totalCost]);

  // Chart data
  const chartData = useMemo(() => holdings.map(h => ({
    name: h.ticker,
    value: h.shares * (h.currentPrice || h.averagePrice),
  })), [holdings]);

  // Filtering & Sorting
  const filteredHoldings = useMemo(() => holdings.filter(h =>
    h.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  ), [holdings, searchQuery]);

  const sortedHoldings = useMemo(() => [...filteredHoldings].sort((a, b) => {
    let valA: any;
    let valB: any;

    if (sortBy === "ticker") {
      valA = a.ticker;
      valB = b.ticker;
    } else if (sortBy === "shares") {
      valA = a.shares;
      valB = b.shares;
    } else if (sortBy === "price") {
      valA = a.averagePrice;
      valB = b.averagePrice;
    } else if (sortBy === "cost") {
      valA = a.shares * a.averagePrice;
      valB = b.shares * b.averagePrice;
    } else if (sortBy === "gain") {
      valA = (a.currentPrice || a.averagePrice) - a.averagePrice;
      valB = (b.currentPrice || b.averagePrice) - b.averagePrice;
    } else {
      valA = new Date(a.purchaseDate).getTime();
      valB = new Date(b.purchaseDate).getTime();
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  }), [filteredHoldings, sortBy, sortOrder]);

  const COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto overflow-y-auto h-full al-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            Portfolio Workspace
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage allocations, log stock acquisitions, and monitor investment performance.
          </p>
        </div>
      </div>

      {/* Top Summary Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Value */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Current Net Asset Value</p>
          <p className="text-2xl font-black mt-2 tracking-tight">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Total invested capital: ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>

        {/* Total Return */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Absolute Return</p>
          <p className={cn("text-2xl font-black mt-2 tracking-tight", totalGain >= 0 ? "text-emerald-400" : "text-red-400")}>
            {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={cn("text-[10px] flex items-center gap-1 mt-1 font-semibold", totalGain >= 0 ? "text-emerald-400" : "text-red-400")}>
            {totalGain >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {totalGain >= 0 ? "+" : ""}{gainPercentage.toFixed(2)}% Overall Return
          </p>
        </div>

        {/* Active Holdings Count */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass">
          <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Acquisitions Count</p>
          <p className="text-2xl font-black mt-2 tracking-tight">{holdings.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Unique equity positions</p>
        </div>
      </div>

      {/* Allocations & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Add/Edit Holding Form */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">
              {editingHolding ? "Edit Acquisition" : "Log Acquisition"}
            </h4>
            {editingHolding && (
              <button 
                onClick={handleCancelEdit}
                className="text-[10px] text-muted-foreground hover:text-white flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={editingHolding ? handleUpdate : handleAdd} className="space-y-3.5">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Stock Ticker</label>
              <input
                type="text"
                placeholder="e.g. NVDA"
                value={ticker}
                onChange={e => setTicker(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none disabled:opacity-50"
                required
                disabled={!!editingHolding}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. NVIDIA Corp"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none disabled:opacity-50"
                required
                disabled={!!editingHolding}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Shares</label>
                <input
                  type="number"
                  step="any"
                  placeholder="10"
                  value={shares}
                  onChange={e => setShares(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Average Price ($)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="125.50"
                  value={avgPrice}
                  onChange={e => setAvgPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground/50 uppercase block mb-1">Acquisition Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
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
              {editingHolding ? "Update Position" : "Add Holding"}
            </button>
          </form>
        </div>

        {/* Charts & Listings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Allocation diagram */}
          {chartData.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass flex flex-col justify-between">
              <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-4">Portfolio Allocations Breakdown</h4>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-44 w-full sm:w-1/2 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px" }}
                        itemStyle={{ fontSize: "11px", fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 grid grid-cols-2 gap-2">
                  {chartData.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="font-bold text-muted-foreground truncate max-w-[80px]">{entry.name}</span>
                      <span className="font-mono text-muted-foreground/60">({totalCost > 0 ? ((entry.value / totalCost) * 100).toFixed(0) : 0}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search & Sort Panel */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-2xl al-glass">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search portfolio..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Holdings list table */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden al-glass">
            <div className="p-4 border-b border-white/5">
              <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Asset Listings</h4>
            </div>

            <div className="overflow-x-auto al-scrollbar">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-muted-foreground font-bold select-none">
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort("ticker")}>
                      Ticker <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort("shares")}>
                      Shares <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort("price")}>
                      Avg Cost <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort("cost")}>
                      Total Cost <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort("gain")}>
                      Gain/Loss <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort("date")}>
                      Date <ArrowUpDown className="inline w-3 h-3 ml-1" />
                    </th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground animate-pulse">Loading holdings...</td>
                    </tr>
                  ) : sortedHoldings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground/50">Your portfolio is currently empty. Log an acquisition on the left to start.</td>
                    </tr>
                  ) : (
                    sortedHoldings.map(h => {
                      const cost = h.shares * h.averagePrice;
                      const val = h.shares * (h.currentPrice || h.averagePrice);
                      const gain = val - cost;
                      return (
                        <tr key={h.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold text-foreground">
                            {h.ticker}
                            <span className="block text-[9px] font-medium text-muted-foreground/60 truncate max-w-[100px]">{h.companyName}</span>
                          </td>
                          <td className="p-4 text-right font-mono">{h.shares}</td>
                          <td className="p-4 text-right font-mono">${h.averagePrice.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono">${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td className={cn("p-4 text-right font-mono font-bold", gain >= 0 ? "text-emerald-400" : "text-red-400")}>
                            {gain >= 0 ? "+" : ""}${gain.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 text-muted-foreground">{new Date(h.purchaseDate).toLocaleDateString()}</td>
                          <td className="p-4 text-center space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleStartEdit(h)}
                              className="p-1.5 rounded-lg border border-white/10 hover:border-emerald-500/20 hover:bg-emerald-500/5 text-muted-foreground hover:text-emerald-400 transition-all cursor-pointer"
                              title="Edit position"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(h.id, h.ticker)}
                              className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/20 hover:bg-red-500/5 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                              title="Delete position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
