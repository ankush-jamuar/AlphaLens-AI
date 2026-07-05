import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="space-y-4">
        <p className="text-6xl font-bold al-text-gradient">404</p>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-400 ring-1 ring-emerald-400/30 transition-colors hover:bg-emerald-400/20"
        >
          Return to workspace
        </Link>
      </div>
    </div>
  );
}
