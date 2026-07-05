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
  trend,
  className,
}: MetricCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-border bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p
        className={cn(
          "text-base font-semibold",
          value ? trendColor || "text-foreground" : "text-muted-foreground/50"
        )}
      >
        {value ?? "Not Available"}
      </p>
    </div>
  );
}
