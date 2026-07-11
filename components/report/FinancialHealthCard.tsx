"use client";

/**
 * FinancialHealthCard — Revenue, Net Income, EPS, P/E, Debt, Cash Flow.
 * Gracefully handles unavailable values (COMPONENT_TREE.md).
 */

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Activity, BarChart2, CreditCard, Wallet } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MetricCard } from "@/components/shared/MetricCard";
import type { FinancialData } from "@/types";

interface FinancialHealthCardProps {
  financials: FinancialData;
  animationDelay?: number;
}

const FINANCIAL_METRICS = [
  { key: "revenue" as const, label: "Revenue", icon: DollarSign },
  { key: "netIncome" as const, label: "Net Income", icon: TrendingUp },
  { key: "eps" as const, label: "EPS", icon: Activity },
  { key: "peRatio" as const, label: "P/E Ratio", icon: BarChart2 },
  { key: "debt" as const, label: "Total Debt", icon: CreditCard },
  { key: "cashFlow" as const, label: "Free Cash Flow", icon: Wallet },
];

export function FinancialHealthCard({
  financials,
  animationDelay = 0.2,
}: FinancialHealthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Financial Snapshot"
        subtitle="Key financial metrics and valuation ratios"
        icon={BarChart2}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FINANCIAL_METRICS.map(({ key, label, icon }) => (
          <MetricCard
            key={key}
            label={label}
            value={financials[key]}
            icon={icon}
          />
        ))}
      </div>
    </motion.div>
  );
}
