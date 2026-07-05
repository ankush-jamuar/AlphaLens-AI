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
      className="al-card space-y-4"
    >
      <SectionHeader
        title="Sources"
        subtitle="References used for this analysis"
        icon={Link2}
      />

      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-white/[0.04] hover:text-foreground"
            >
              <span className="flex-1">{source.title}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
