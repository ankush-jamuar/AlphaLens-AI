"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Bot, 
  Clock, 
  Sparkles,
  Loader2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useAuth } from "@/lib/clerk-mock";
import { 
  getSavedReportsAction, 
  getChatMessagesAction, 
  sendChatMessageAction 
} from "@/lib/db-actions";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const { userId } = useAuth();
  
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      sender: "assistant",
      text: "Select a saved intelligence report on the left sidebar to start chatting about it with your AI Research Copilot.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  // Load Saved Reports
  useEffect(() => {
    if (!userId) return;
    setIsLoadingReports(true);
    getSavedReportsAction(userId).then(res => {
      if (res.success) {
        setReports(res.data);
        if (res.data.length > 0) {
          setSelectedReportId(res.data[0].id);
        }
      }
      setIsLoadingReports(false);
    });
  }, [userId]);

  // Load chat messages when report selection changes
  useEffect(() => {
    if (!userId || !selectedReportId) return;
    
    getChatMessagesAction(userId, selectedReportId).then(res => {
      if (res.success && res.data.length > 0) {
        setMessages(res.data.map((m: any) => ({
          id: m.id,
          sender: m.sender as "user" | "assistant",
          text: m.text,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } else {
        const reportName = reports.find(r => r.id === selectedReportId)?.companyName || "selected company";
        setMessages([
          {
            id: "intro",
            sender: "assistant",
            text: `Hello! I am your AlphaLens AI Research Assistant. Ask me anything about the generated investment report for ${reportName}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    });
  }, [userId, selectedReportId, reports]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !userId || !selectedReportId) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await sendChatMessageAction({
        userId,
        reportId: selectedReportId,
        text: textToSend,
      });

      if (res.success && res.assistantMessage) {
        const assistantMsg: Message = {
          id: res.assistantMessage.id,
          sender: "assistant",
          text: res.assistantMessage.text,
          timestamp: new Date(res.assistantMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const starterPrompts = [
    "What are the primary risk factors?",
    "Summarize key strengths and advantages",
    "What is the final investment recommendation decision?",
    "Detail competitor dynamics and market share"
  ];

  return (
    <div className="flex h-full overflow-hidden bg-zinc-950">
      
      {/* Thread Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 h-full border-r border-white/5 bg-zinc-950 shrink-0">
        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2.5">Saved Reports Threads</p>
        </div>
        <div className="flex-1 p-3 space-y-1 overflow-y-auto al-scrollbar">
          {isLoadingReports ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <p className="text-xs text-muted-foreground/50 py-4 text-center">No reports saved yet.</p>
          ) : (
            reports.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                  r.id === selectedReportId ? "bg-white/[0.03] text-foreground border border-white/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{r.companyName}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-extrabold text-foreground tracking-tight">AI Research Assistant</h2>
            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">REPORT SCOPED</span>
          </div>
        </div>

        {/* Message scroll panel */}
        <div className="flex-1 overflow-y-auto al-scrollbar p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map(msg => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 w-full",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0 text-emerald-400">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}
                    
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-xl shadow-md",
                      isUser 
                        ? "bg-emerald-500 text-zinc-950 font-semibold rounded-tr-none" 
                        : "bg-white/[0.02] border border-white/10 text-foreground rounded-tl-none al-glass"
                    )}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className={cn(
                        "text-[8px] block mt-1 text-right",
                        isUser ? "text-zinc-950/60" : "text-muted-foreground/40"
                      )}>{msg.timestamp}</span>
                    </div>

                    {isUser && (
                      <img 
                        src={user?.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isTyping && (
              <div className="flex gap-4 w-full justify-start items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0 text-emerald-400">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2 al-glass">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Reading saved report details...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Input Area */}
        <div className="p-4 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Starter chips */}
            {messages.length === 1 && selectedReportId && (
              <div className="grid grid-cols-2 gap-2">
                {starterPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-emerald-500/20 text-[10px] font-bold text-left text-muted-foreground hover:text-foreground transition-all cursor-pointer truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex gap-2 relative bg-zinc-950 border border-white/10 rounded-2xl p-1.5 focus-within:border-emerald-500/40 transition-all"
            >
              <input
                type="text"
                placeholder={selectedReportId ? "Ask your investment follow-up question here..." : "Select a thread on the left sidebar to start chatting."}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xs text-foreground px-3.5 py-2.5 placeholder:text-muted-foreground/40"
                disabled={isTyping || !selectedReportId}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping || !selectedReportId}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-zinc-950 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
