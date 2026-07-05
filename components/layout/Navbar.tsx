/**
 * Navbar — Top navigation bar.
 * Left: AlphaLens AI logo. Right: GitHub link.
 * No profile, no theme toggle (PROJECT_BLUEPRINT.md Section 9).
 */

import Link from "next/link";
import { APP_NAME, GITHUB_URL } from "@/lib/constants";

// GitHub icon as SVG (lucide-react v1.23 does not export a Github icon)
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          {/* Logo mark */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20 ring-1 ring-emerald-400/30">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 10.5L6 4.5L9 8L11 5.5L13 7"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>{APP_NAME}</span>
        </Link>

        {/* Right actions */}
        <nav className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
