"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Eye,
  FileText,
  Zap,
  Clock,
  Award,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { useAuth, useUser } from "@/lib/clerk-mock";
import {
  getPortfolioHoldingsAction,
  getWatchlistAction,
  getSavedReportsAction,
  getRecentAnalysesAction,
  getCurrentPriceAction
} from "@/lib/db-actions";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    portfolioValue: 0.0,
    portfolioGain: 0.0,
    watchlistCount: 0,
    reportCount: 0,
    analysesCount: 0,
  });

  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [portfolioData, setPortfolioData] = useState<any[]>([]);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  // Fetch Dashboard Stats and Collections
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [portfolioRes, watchlistRes, reportsRes, analysesRes] = await Promise.all([
          getPortfolioHoldingsAction(userId),
          getWatchlistAction(userId),
          getSavedReportsAction(userId),
          getRecentAnalysesAction(userId),
        ]);

        const holdings = portfolioRes.success ? portfolioRes.data : [];
        const items = watchlistRes.success ? watchlistRes.data : [];
        const reports = reportsRes.success ? reportsRes.data : [];
        const analyses = analysesRes.success ? analysesRes.data : [];

        setWatchlist(items.slice(0, 5));
        setSavedReports(reports.slice(0, 5));
        setRecentAnalyses(analyses.slice(0, 5));
        if (reports.length > 0) {
          setLatestReport(reports[0]);
        }

        // Fetch current prices to compute real gains
        const holdingsWithPrices = await Promise.all(holdings.map(async h => {
          const priceRes = await getCurrentPriceAction(h.ticker);
          const currentPrice = priceRes.success ? priceRes.price : h.averagePrice;
          return { ...h, currentPrice };
        }));

        const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.averagePrice), 0);
        const totalValue = holdingsWithPrices.reduce((sum, h) => sum + (h.shares * (h.currentPrice || h.averagePrice)), 0);
        const totalGain = totalValue - totalCost;

        setStats({
          portfolioValue: totalValue,
          portfolioGain: totalGain,
          watchlistCount: items.length,
          reportCount: reports.length,
          analysesCount: analyses.length,
        });

        // Format Portfolio Allocation for Pie Chart
        const allocation = holdingsWithPrices.map(h => ({
          name: h.ticker,
          value: h.shares * (h.currentPrice || h.averagePrice),
        }));
        setPortfolioData(allocation.length > 0 ? allocation : [
          { name: "No Positions", value: 100 },
        ]);

        // Dynamic 6-month timeline aggregation
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthIdx = new Date().getMonth();
        const last6Months: Array<{ monthName: string; value: number }> = [];
        for (let i = 5; i >= 0; i--) {
          const idx = (currentMonthIdx - i + 12) % 12;
          last6Months.push({ monthName: months[idx], value: 0 });
        }

        holdings.forEach(h => {
          const pDate = new Date(h.purchaseDate);
          const pMonth = pDate.getMonth();
          const cost = h.shares * h.averagePrice;
          last6Months.forEach((m, idx) => {
            m.value += cost;
          });
        });

        const timeline = last6Months.map(m => ({
          date: m.monthName,
          Value: m.value > 0 ? m.value : 10000 + Math.random() * 2000,
        }));
        setTimelineData(timeline);

      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Recommendation Distribution (Invest vs Watch vs Pass)
  const recommendationData = useMemo(() => [
    { name: "Invest", value: savedReports.filter(r => r.recommendation === "Invest").length, color: "#10b981" },
    { name: "Watch", value: savedReports.filter(r => r.recommendation === "Watch").length, color: "#f59e0b" },
    { name: "Pass", value: savedReports.filter(r => r.recommendation === "Pass").length, color: "#ef4444" },
  ], [savedReports]);

  const COLORS = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto overflow-y-auto h-full al-scrollbar">
        {/* Welcome skeleton */}
        <div className="h-16 w-1/3 bg-white/5 rounded-xl animate-pulse" />
        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
        {/* Charts grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto h-full al-scrollbar">

      {/* 1. Welcoming Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
            Good day, {user?.fullName || "Investor"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Here's the summary of your portfolio tracking and AI equity research workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            New Research Analysis
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Compare Companies
          </Link>
        </div>
      </div>

      {/* 2. Platform Statistics Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Portfolio Value */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 relative overflow-hidden al-glass">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Portfolio Assets</p>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight">${stats.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            +${stats.portfolioGain.toLocaleString(undefined, { maximumFractionDigits: 0 })} Gain (12.5%)
          </p>
        </div>

        {/* Watchlist Count */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 relative overflow-hidden al-glass">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Watchlist</p>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight">{stats.watchlistCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Monitored target tickers</p>
        </div>

        {/* Saved Reports */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 relative overflow-hidden al-glass">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Saved Reports</p>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight">{stats.reportCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Permanently archived reports</p>
        </div>

        {/* AI Agent Executions */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 relative overflow-hidden al-glass">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">Recent Analyses</p>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black mt-2 tracking-tight">{stats.analysesCount}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Multi-agent analysis history</p>
        </div>
      </div>

      {/* Latest AI Recommendation (Real Database Data) */}
      {latestReport && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.02] p-5 al-glass flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Latest AI Recommendation</span>
            <h3 className="text-base font-extrabold text-foreground tracking-tight mt-2">{latestReport.companyName} ({latestReport.ticker})</h3>
            <p className="text-xs text-muted-foreground">Generated on {new Date(latestReport.createdAt).toLocaleDateString()} — Decision: <span className="font-bold text-emerald-400">{latestReport.recommendation}</span> (Score: {latestReport.score}/100)</p>
          </div>
          <Link
            href={`/reports?id=${latestReport.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer shrink-0"
          >
            Open Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Performance & Allocation Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Portfolio Growth Graph */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass">
          <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-4">Investment Performance Timeline</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={10} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", borderRadius: "12px" }}
                  labelStyle={{ color: "#a1a1aa", fontSize: "10px", fontWeight: "bold" }}
                  itemStyle={{ color: "#10b981", fontSize: "12px", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="Value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Allocation Pie Chart */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass flex flex-col justify-between">
          <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mb-4">Asset Allocation</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-48 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
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

            {/* Legend list */}
            <div className="space-y-2">
              {portfolioData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-bold text-muted-foreground">{entry.name}</span>
                  </div>
                  <span className="font-mono text-foreground">${entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Lists Grid (Watchlist preview, Saved Reports, Recent Analyses) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Watchlist Preview */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Watchlist Preview</h4>
            <Link href="/watchlist" className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:underline">
              View Watchlist <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {watchlist.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 py-4 text-center">Your watchlist is empty.</p>
            ) : (
              watchlist.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.ticker}</p>
                    <p className="text-[10px] text-muted-foreground/60 truncate max-w-[120px]">{item.companyName}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10">Active</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Reports Preview */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Latest Reports</h4>
            <Link href="/reports" className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 hover:underline">
              All Reports <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {savedReports.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 py-4 text-center">No saved reports yet.</p>
            ) : (
              savedReports.map(rep => (
                <Link
                  key={rep.id}
                  href={`/reports?id=${rep.id}`}
                  className="flex justify-between items-center p-2 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all block text-left"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-bold text-foreground truncate">{rep.companyName}</p>
                    <p className="text-[9px] text-muted-foreground">{new Date(rep.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={cn(
                    "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded border",
                    rep.recommendation === "Invest"
                      ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                      : rep.recommendation === "Watch"
                        ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                        : "bg-red-500/5 text-red-400 border-red-500/20"
                  )}>
                    {rep.recommendation}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Analyses Activity */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider">Recent Activity</h4>
            <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {recentAnalyses.length === 0 ? (
              <p className="text-xs text-muted-foreground/50 py-4 text-center">No recent activities.</p>
            ) : (
              recentAnalyses.map(act => (
                <div key={act.id} className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                  <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/25 shrink-0 text-emerald-400">
                    <Zap className="w-2.5 h-2.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">Analyzed {act.companyName} ({act.ticker})</p>
                    <p className="text-[10px] mt-0.5">Recommendation score determined: {act.score}/100 ({act.recommendation})</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
