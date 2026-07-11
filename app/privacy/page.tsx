import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-foreground overflow-y-auto al-scrollbar font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-6">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: July 11, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">1. Information We Collect</h2>
            <p>
              AlphaLens AI collects search queries, stock tickers, and portfolio allocations that you log in your workspace. 
              Authentication is handled securely via Clerk, and we do not store your raw credentials on our database servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">2. How We Use Information</h2>
            <p>
              Your search history, saved research reports, and portfolio allocations are stored strictly to compile stats 
              for your dashboard, compute allocations, and synchronize watchlists. We do not sell or monetize your data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">3. Third Party Services</h2>
            <p>
              We query third-party APIs including Alpha Vantage and GNews to collect real-time financial statements and articles. 
              Specialized investment reasoning is processed securely via Google Gemini AI models under enterprise privacy guarantees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">4. Data Security</h2>
            <p>
              All database connections to our PostgreSQL instances are encrypted in transit. We apply strict security matching rules 
              to prevent cross-user account data leakage.
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8 text-[10px] text-muted-foreground">
          <p>© {new Date().getFullYear()} AlphaLens AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
