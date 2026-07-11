"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchSection } from "@/components/search/SearchSection";
import { ProgressTimeline } from "@/components/progress/ProgressTimeline";
import { ReportSection } from "@/components/report/ReportSection";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ReportSkeleton } from "@/components/shared/SkeletonLoader";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useHistory } from "@/hooks/useHistory";
import { useAuth } from "@/lib/clerk-mock";
import { saveReportAction, addRecentAnalysisAction, recordSearchAction, sendChatMessageAction, getChatMessagesAction, deleteSavedReportAction, getSavedReportsAction } from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import type { InvestmentReport, HistoryEntry } from "@/types";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

function WorkspaceContent() {
  const { userId, isSignedIn } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const { status, report, error, currentStep, isLoading, analyze, selectReport, reset } =
    useAnalysis();
  const { history, save, remove } = useHistory();

  const [dbHistory, setDbHistory] = useState<HistoryEntry[]>([]);

  const fetchDbHistory = useCallback(async () => {
    if (!userId) return;
    const res = await getSavedReportsAction(userId);
    if (res.success && res.data) {
      const entries: HistoryEntry[] = res.data.map((r) => {
        const reportData = typeof r.reportData === "string" ? JSON.parse(r.reportData) : r.reportData;
        return {
          id: r.id,
          companyName: r.companyName,
          recommendation: r.recommendation as "Invest" | "Watch" | "Pass",
          score: r.score,
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
          report: reportData,
        };
      });
      setDbHistory(entries);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchDbHistory();
    }
  }, [userId, fetchDbHistory, status]);

  const handleRemoveHistory = useCallback(async (id: string) => {
    if (userId) {
      const res = await deleteSavedReportAction(id);
      if (res.success) {
        toast("Report deleted from database", "success");
        fetchDbHistory();
      } else {
        toast(`Failed to delete: ${res.error}`, "error");
      }
    } else {
      remove(id);
    }
  }, [userId, remove, fetchDbHistory, toast]);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([]);
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [isTypingChat, setIsTypingChat] = useState(false);

  // Auto-trigger analysis if query parameter ?analyze=TICKER is provided
  const queryToAnalyze = searchParams.get("analyze");
  useEffect(() => {
    if (queryToAnalyze && status === "idle") {
      analyze(queryToAnalyze);
    }
  }, [queryToAnalyze, status, analyze]);

  // Load active report's chat history
  useEffect(() => {
    if (userId && report?.id) {
      getChatMessagesAction(userId, report.id).then(res => {
        if (res.success) {
          setChatMessages(res.data.map((m) => {
            const sender = m.sender === "user" ? "user" : "bot";
            return {
              sender,
              text: m.text,
            };
          }));
        }
      });
    } else {
      setChatMessages([]);
    }
  }, [userId, report]);

  // Save successfully completed reports to localStorage and local SQLite DB automatically
  useEffect(() => {
    if (status === "success" && report) {
      save(report);
      
      // If user is authenticated, sync report & search history to Prisma DB
      if (userId) {
        saveReportAction({
          id: report.id,
          userId,
          companyName: report.company.name,
          ticker: report.company.ticker || "N/A",
          recommendation: report.recommendation.decision,
          score: report.recommendation.score,
          reportData: JSON.stringify(report),
        }).then(res => {
          if (res.success) {
            toast(`Saved report for ${report.company.name} to Cloud Vault`, "success");
          }
        });

        addRecentAnalysisAction({
          userId,
          companyName: report.company.name,
          ticker: report.company.ticker || "N/A",
          recommendation: report.recommendation.decision,
          score: report.recommendation.score,
        });

        recordSearchAction({
          userId,
          ticker: report.company.ticker || "N/A",
          companyName: report.company.name,
        });
      }
    }
  }, [status, report, save, userId, toast]);

  const handleAnalyze = useCallback(
    async (companyName: string) => {
      await analyze(companyName);
    },
    [analyze]
  );

  const handleSelectHistoryReport = useCallback(
    (selectedReport: InvestmentReport) => {
      selectReport(selectedReport);
    },
    [selectReport]
  );

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !userId || !report) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setIsTypingChat(true);

    try {
      const res = await sendChatMessageAction({
        userId,
        reportId: report.id,
        text: userText,
      });

      if (res.success && res.assistantMessage) {
        setChatMessages(prev => [...prev, {
          sender: "bot",
          text: res.assistantMessage.text,
        }]);
      } else {
        toast(res.error || "Failed to receive copilot response", "error");
      }
    } catch (err) {
      toast("Error sending message", "error");
    } finally {
      setIsTypingChat(false);
    }
  };

  const sampleQuestions = [
    "What are the major growth drivers?",
    "Summarize the debt risks",
    "Identify core competitors"
  ];

  return (
    <div className="flex h-[calc(100dvh-64px)] md:h-dvh overflow-hidden w-full bg-zinc-950">
      
      {/* Panel 1: History Sidebar */}
      <Sidebar
        history={isSignedIn && userId ? dbHistory : history}
        onNewAnalysis={reset}
        onSelectReport={handleSelectHistoryReport}
        onRemoveHistory={handleRemoveHistory}
        activeId={report?.id}
      />

      {/* Panel 2: Central Research Panel */}
      <main className="al-scrollbar flex-1 overflow-y-auto border-r border-white/5 bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-8 pb-20 sm:px-6">
          {/* Search Section */}
          <SearchSection
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            hasReport={status === "success"}
          />

          {/* Content area */}
          <AnimatePresence mode="wait">
            {/* Loading state */}
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                <ProgressTimeline currentStep={currentStep} />
                <ReportSkeleton />
              </motion.div>
            )}

            {/* Error state */}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState
                  message={error ?? "We couldn't complete the analysis. Please try again."}
                  onRetry={reset}
                />
              </motion.div>
            )}

            {/* Report */}
            {status === "success" && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <ReportSection report={report} />
              </motion.div>
            )}

            {/* Empty state */}
            {status === "idle" && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Panel 3: Right Sidebar - Future AI Chat Placeholder */}
      {showChatPanel && (
        <aside className="hidden xl:flex flex-col w-80 h-full bg-zinc-950 shrink-0 select-none">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black tracking-tight text-foreground uppercase">AI Copilot Chat</span>
            </div>
            <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">ACTIVE</span>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto al-scrollbar space-y-3 pb-4">
              {!report ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 mb-3 animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground">Interactive AI Copilot</p>
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-1">
                    Once research finishes, query follow-up items using this panel.
                  </p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] font-bold text-foreground">Ask anything about {report.company.name}</p>
                  <p className="text-[10px] text-muted-foreground/60 leading-relaxed mt-1">
                    The assistant will query only the generated investment report context.
                  </p>
                </div>
              ) : (
                chatMessages.map((m, idx) => (
                  <div key={idx} className={cn("text-left p-2.5 rounded-xl border text-[10px] leading-relaxed", m.sender === "user" ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400 ml-6" : "bg-white/[0.01] border-white/5 text-muted-foreground mr-6")}>
                    <p className="font-bold mb-0.5 text-foreground">{m.sender === "user" ? "You" : "Copilot"}</p>
                    <p>{m.text}</p>
                  </div>
                ))
              )}
              {isTypingChat && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-2.5 text-[10px] text-muted-foreground flex items-center gap-1.5 mr-6 al-glass">
                  <Loader2 className="w-3 w-3 animate-spin text-emerald-400" />
                  <span>Copilot reading report context...</span>
                </div>
              )}
            </div>

            {/* Input and suggestions */}
            <div className="space-y-3 border-t border-white/5 pt-3">
              {chatMessages.length === 0 && report && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-muted-foreground/45 uppercase tracking-widest px-1">Suggested Follow-ups</p>
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setChatInput(q)}
                      className="w-full text-left p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-[9px] text-muted-foreground hover:text-foreground truncate transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendChat} className="flex gap-1.5 border border-white/10 bg-zinc-950 rounded-xl p-1 focus-within:border-emerald-500/40 transition-all">
                <input
                  type="text"
                  placeholder="Ask follow-up..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 bg-transparent text-[10px] outline-none text-foreground px-2 border-none"
                  disabled={!report || isTypingChat}
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-emerald-500 text-zinc-950 cursor-pointer disabled:opacity-50"
                  disabled={!report || isTypingChat || !chatInput.trim()}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
}

export function Workspace() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading workspace environment...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
