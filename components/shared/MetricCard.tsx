"use client";

/**
 * MetricCard — Reusable financial metric display card.
 * Used within FinancialHealthCard to display individual KPIs.
 */

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | undefined | null;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  className,
}: MetricCardProps) {
  const isAvailable = value && value !== "Not Available" && value !== "N/A";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border/30 bg-white/[0.01] p-4 transition-all duration-300 hover:bg-white/[0.03] hover:border-emerald-500/20 shadow-sm group hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.02] text-muted-foreground/60 transition-colors duration-300 group-hover:bg-emerald-400/10 group-hover:text-emerald-400 border border-white/5">
          {Icon && <Icon className="h-3.5 w-3.5" />}
        </div>
        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={cn(
          "text-lg font-bold tracking-tight transition-colors duration-300",
          isAvailable ? "text-foreground" : "text-muted-foreground/40 font-medium"
        )}
      >
        {value ?? "Not Available"}
      </p>
    </div>
  );
}
