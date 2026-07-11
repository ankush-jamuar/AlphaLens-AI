import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Last updated: July 11, 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing the AlphaLens AI investment research platform, you agree to comply with and be bound by these 
              Terms of Service and our Privacy Policy. If you do not agree, please do not access or use the workspace.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">2. Investment Disclaimer</h2>
            <p>
              AlphaLens AI compiles information dynamically using AI models and external financial APIs. 
              The structured reasoning, scores, and SWOT assessments are for informational and educational purposes only. 
              We are not financial advisors, and nothing on this platform constitutes a solicitation, recommendation, or offer to buy or sell securities.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">3. API Usage Limits</h2>
            <p>
              We enforce rate limits and parameters on company analysis runs to prevent abuse of our financial statement endpoints. 
              We cache data for 15 minutes to preserve performance. Automated scrapers or scripts targeting our endpoints are strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-extrabold text-white">4. User Account Rules</h2>
            <p>
              You must log in using a valid, authenticated Clerk session. You are responsible for all workspace allocations, 
              watchlists, and searches registered under your session ID.
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
