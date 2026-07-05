/**
 * SkeletonLoader — Loading skeletons for the investment report.
 * Prevents layout shift while data loads (UI_UX_SPECIFICATION.md).
 */

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Base skeleton card wrapper
// ---------------------------------------------------------------------------

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("al-card space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28 bg-white/5" />
          <Skeleton className="h-3 w-20 bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-white/5" />
        <Skeleton className="h-3 w-4/5 bg-white/5" />
        <Skeleton className="h-3 w-3/5 bg-white/5" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Executive Summary Skeleton
// ---------------------------------------------------------------------------

export function ExecutiveSummarySkeleton() {
  return (
    <div className="al-card space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-white/5" />
          <Skeleton className="h-4 w-32 bg-white/5" />
          <Skeleton className="h-4 w-40 bg-white/5" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-white/[0.02] p-4 space-y-2">
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-8 w-12 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Financial Grid Skeleton
// ---------------------------------------------------------------------------

export function FinancialSkeleton() {
  return (
    <div className="al-card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
        <Skeleton className="h-4 w-32 bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-white/[0.02] p-4 space-y-2">
            <Skeleton className="h-3 w-16 bg-white/5" />
            <Skeleton className="h-5 w-20 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// News Skeleton
// ---------------------------------------------------------------------------

export function NewsSkeleton() {
  return (
    <div className="al-card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
        <Skeleton className="h-4 w-28 bg-white/5" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-border/50 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-3/4 bg-white/5" />
              <Skeleton className="h-5 w-16 rounded-full bg-white/5" />
            </div>
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-4/5 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recommendation Skeleton (hero section)
// ---------------------------------------------------------------------------

export function RecommendationSkeleton() {
  return (
    <div className="al-card space-y-6">
      <div className="flex flex-col items-center gap-4 py-4">
        <Skeleton className="h-20 w-20 rounded-2xl bg-white/5" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-6 w-32 mx-auto bg-white/5" />
          <Skeleton className="h-4 w-20 mx-auto rounded-full bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full bg-white/5" />
        <Skeleton className="h-3 w-5/6 bg-white/5" />
        <Skeleton className="h-3 w-4/6 bg-white/5" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Generic card skeleton
// ---------------------------------------------------------------------------

export function CardSkeleton() {
  return <SkeletonCard />;
}

// ---------------------------------------------------------------------------
// Full Report Skeleton
// ---------------------------------------------------------------------------

export function ReportSkeleton() {
  return (
    <div className="space-y-4">
      <ExecutiveSummarySkeleton />
      <SkeletonCard />
      <FinancialSkeleton />
      <SkeletonCard />
      <NewsSkeleton />
      <SkeletonCard />
      <RecommendationSkeleton />
      <SkeletonCard />
    </div>
  );
}
