"use client";

/**
 * NewsCard — Recent news and developments with impact labels.
 * Each item: title, summary, impact badge (Positive/Neutral/Negative).
 */

import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ImpactBadge } from "@/components/shared/StatusBadge";
import type { NewsItem } from "@/types";

interface NewsCardProps {
  news: NewsItem[];
  animationDelay?: number;
}

export function NewsCard({ news, animationDelay = 0.4 }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Market Intelligence & News"
        subtitle="Recent news headlines and sentiment signals"
        icon={Newspaper}
      />

      <div className="space-y-4">
        {news.map((item, index) => {
          const hasUrl = !!item.url && item.url !== "https://finance.yahoo.com" && item.url !== "https://gnews.io";
          const formattedDate = item.publishedDate 
            ? new Date(item.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recent";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + index * 0.06 }}
              className="rounded-xl border border-border/30 bg-white/[0.01] p-4.5 space-y-2.5 transition-all duration-300 hover:bg-white/[0.025] hover:border-emerald-500/10 group"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="space-y-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-foreground leading-snug group-hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    {item.title}
                    {hasUrl && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-emerald-400/60 shrink-0 inline transition-colors" />
                    )}
                  </a>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </div>
                </div>
                <div className="shrink-0 self-start sm:self-auto">
                  <ImpactBadge impact={item.impact} />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground/80 font-medium">
                {item.summary}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
