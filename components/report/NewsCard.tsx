"use client";

/**
 * NewsCard — Recent news and developments with impact labels.
 * Each item: title, summary, impact badge (Positive/Neutral/Negative).
 */

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
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
      className="al-card space-y-4"
    >
      <SectionHeader
        title="Recent News"
        subtitle="Latest developments and announcements"
        icon={Newspaper}
      />

      <div className="space-y-3">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationDelay + index * 0.06 }}
            className="rounded-lg border border-border/50 bg-white/[0.02] p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-foreground leading-snug">
                {item.title}
              </p>
              <ImpactBadge impact={item.impact} />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
