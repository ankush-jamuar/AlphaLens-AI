"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Shield, 
  Cpu, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Globe, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Search,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/clerk-mock";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const { openSignIn } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Cpu,
      title: "LangGraph Orchestration",
      desc: "Executes parallel research tasks through independent specialized nodes for deterministic intelligence gathering."
    },
    {
      icon: BarChart3,
      title: "Alpha Vantage Data",
      desc: "Pulls real-time financial statements, balance sheets, and cash flow historical details straight from official listings."
    },
    {
      icon: Zap,
      title: "Gemini 2.5 Flash Synthesis",
      desc: "Performs single-pass structured reasoning with strict type constraints to compile comprehensive investment theses."
    },
    {
      icon: TrendingUp,
      title: "Market Rules Analysis",
      desc: "Derives competitive peers and SWOT insights deterministically via TypeScript business rules without LLM hallucinations."
    }
  ];

  const workflowSteps = [
    { step: "01", title: "Target Resolution", desc: "Programmatic alias matching and ticker symbol verification." },
    { step: "02", title: "Parallel Harvesting", desc: "Concurrent retrieval of financial metrics, profiles, and GNews articles." },
    { step: "03", title: "SWOT Formulation", desc: "TypeScript validation of balance sheets and competitors." },
    { step: "04", title: "Reasoning & Format", desc: "Single structured LLM generation mapped to a validated JSON schema." }
  ];

  const faqs = [
    {
      q: "How does AlphaLens AI resolve tickers?",
      a: "AlphaLens uses a multi-stage programmatic resolver that cleans search inputs, applies local alias corrections (e.g. Google to Alphabet), queries Alpha Vantage symbol search, and ranks matches. It fast-tracks common listings to bypass external API rate limits."
    },
    {
      q: "Are the reports generated in real time?",
      a: "Yes. Every analysis fires active live queries to Alpha Vantage and GNews, compiling fresh information on demand. Final intelligence reports are cached in memory for 15 minutes to optimize performance."
    },
    {
      q: "Which AI model powers the workspace?",
      a: "The final reasoning synthesis is powered by Gemini 2.5 Flash, executing a single structured schema compilation for maximum speed, accuracy, and deterministic cost profiles."
    }
  ];

  return (
    <div className="min-h-dvh bg-zinc-950 text-foreground overflow-y-auto al-scrollbar font-sans select-none">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 10.5L6 4.5L9 8L11 5.5L13 7" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">AlphaLens AI</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={openSignIn}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={openSignIn}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Production-Ready Equity Research
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
          Agentic Investment Intelligence <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-300 bg-clip-text text-transparent">
            Without the Hallucinations
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          AlphaLens AI deploys specialized, parallel LangGraph analyst nodes to harvest real-time statements, financial metrics, and GNews sentiments, compiling structured investment theses dynamically.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button 
            onClick={openSignIn}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
          >
            Launch Free Workspace
            <ArrowRight className="w-4 h-4" />
          </button>
          <a 
            href="#features"
            className="px-6 py-3 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] text-foreground font-bold text-xs rounded-xl transition-all flex items-center gap-2"
          >
            Explore Platform Architecture
          </a>
        </div>
      </section>

      {/* 3. Tech Stack Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Enterprise Platform Integrations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-300">
            {["Next.js 16", "LangGraph", "Gemini 2.5", "Prisma ORM", "Neon Postgres", "Clerk Security"].map(tech => (
              <span key={tech} className="text-xs font-black tracking-wider text-muted-foreground font-mono">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Structured Research Node Pipeline</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            A precise, non-sequential multi-agent workspace built on rigorous financial calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass relative overflow-hidden flex flex-col gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-foreground tracking-tight">{feat.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-20 bg-white/[0.01] border-y border-white/5 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">The Analysis Timeline</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              How the LangGraph workflow translates user input into investment recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="p-5 border border-white/5 bg-zinc-950 rounded-2xl relative space-y-2">
                <span className="text-2xl font-black text-emerald-500/20 font-mono block">{step.step}</span>
                <h4 className="text-xs font-extrabold text-foreground">{step.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section (Placeholder Content) */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Endorsed by Top Analysts</h2>
          <p className="text-xs text-muted-foreground">What our early beta testers are saying about the platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] al-glass space-y-3">
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              "AlphaLens AI has completely cut down our research collection time. Getting clean statements alongside calculated sentiment saves hours per ticket."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <p className="text-[10px] font-bold text-foreground">Sarah Jenkins</p>
                <p className="text-[9px] text-muted-foreground">Lead Buy-Side Analyst, Apex Fund</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] al-glass space-y-3">
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              "The TypeScript-based SWOT generation is incredibly reliable. I can trust that competitors and financials are verified by code rather than LLM assumptions."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div>
                <p className="text-[10px] font-bold text-foreground">Marcus Chen</p>
                <p className="text-[9px] text-muted-foreground">Managing Director, Horizon Partners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 bg-white/[0.01] border-t border-white/5 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-2xl font-black text-white text-center tracking-tight">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-zinc-950 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left text-xs font-bold text-foreground hover:bg-white/[0.02] transition-colors outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4.5 h-4.5 text-muted-foreground transition-transform", activeFaq === i ? "rotate-180" : "")} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-white/[0.01] text-[11px] text-muted-foreground p-4 leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action / Footer */}
      <section className="py-24 text-center space-y-6 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white tracking-tight">Ready to leverage agentic research?</h2>
        <p className="text-xs text-muted-foreground">Create your free workspace and run your first intelligence report today.</p>
        <button 
          onClick={openSignIn}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-xl shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
        >
          Get Started Now (Free)
        </button>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-[10px] text-muted-foreground bg-zinc-950 space-y-2">
        <p>© {new Date().getFullYear()} AlphaLens AI. All rights reserved. Supported by Clerk and Neon Postgres.</p>
        <div className="flex justify-center gap-4 text-[9px] text-muted-foreground/60">
          <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
        </div>
      </footer>

    </div>
  );
}
