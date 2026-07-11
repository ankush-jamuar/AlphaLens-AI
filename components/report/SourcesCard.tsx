"use client";

/**
 * SourcesCard — Displays all research sources with clickable links.
 * Links open in new tab (COMPONENT_TREE.md).
 */

import { motion } from "framer-motion";
import { ExternalLink, Link2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { Source } from "@/types";

interface SourcesCardProps {
  sources: Source[];
  animationDelay?: number;
}

export function SourcesCard({ sources, animationDelay = 0.8 }: SourcesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay, ease: "easeOut" }}
      className="al-glass rounded-2xl border border-border/40 p-6 md:p-8 space-y-6 relative overflow-hidden transition-all duration-300"
    >
      <SectionHeader
        title="Research Sources & Citations"
        subtitle="Referenced statements, GNews feeds, and Alpha Vantage endpoints"
        icon={Link2}
      />

      <ul className="space-y-2.5">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border/30 bg-white/[0.015] px-4 py-3 text-xs font-semibold text-muted-foreground/80 transition-all duration-300 hover:border-emerald-500/20 hover:bg-white/[0.03] hover:text-foreground group"
            >
              <span className="flex-1 truncate leading-relaxed">{source.title}</span>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/30 group-hover:text-emerald-400 transition-colors" />
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
