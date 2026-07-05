"use client";

/**
 * ErrorState — Displays friendly error messages with a retry option.
 * Never exposes technical details to the user (AI_CONTEXT.md).
 */

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "We couldn't complete the analysis.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Icon */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
        <AlertTriangle className="h-7 w-7 text-red-400" />
      </div>

      {/* Message */}
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Analysis failed
      </h3>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">{message}</p>

      {/* Retry */}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 border-white/10 bg-white/5 hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </motion.div>
  );
}
