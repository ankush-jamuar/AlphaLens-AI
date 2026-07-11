"use client";

import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  Briefcase, 
  Eye, 
  ArrowLeftRight, 
  FileText, 
  MessageSquare, 
  Settings, 
  Bell, 
  Menu, 
  X, 
  Command, 
  Plus, 
  LogOut, 
  User as UserIcon,
  SearchCode,
  Shield,
  Clock,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@/lib/clerk-mock";
import { 
  syncUserAction, 
  getNotificationsAction, 
  markNotificationReadAction, 
  deleteNotificationAction,
  getSavedReportsAction,
  getRecentAnalysesAction
} from "@/lib/db-actions";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Toast Notification Context
// ---------------------------------------------------------------------------

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within PlatformShell");
  return context;
}

// ---------------------------------------------------------------------------
// ProfileDropdown Component
// ---------------------------------------------------------------------------

function ProfileDropdown() {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isSignedIn || !user) {
    return null;
  }

  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push("/settings");
  };

  const handleSignOutClick = async () => {
    setIsOpen(false);
    await signOut();
    router.push("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-white/[0.04] border border-white/5 transition-all outline-none cursor-pointer"
        aria-label="User profile"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img
          src={user.imageUrl}
          alt={user.fullName || ""}
          className="w-7 h-7 rounded-full object-cover border border-white/10"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl z-50 al-glass"
          >
            {/* Header info */}
            <div className="flex items-center gap-3 p-2.5 border-b border-white/5 mb-1.5 select-none">
              <img
                src={user.imageUrl}
                alt={user.fullName || ""}
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{user.fullName}</p>
                <p className="text-[9px] text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Menu items */}
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              onClick={handleSignOutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs font-semibold text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlatformShell Component
// ---------------------------------------------------------------------------

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, userId, openSignIn, isLoaded } = useAuth();
  const { user } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const hasSynced = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    const res = await getNotificationsAction(userId);
    if (res.success && res.data) {
      setNotifications(res.data.map((n: any) => ({
        id: n.id,
        title: n.title,
        desc: n.desc,
        read: n.read,
        time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [userId, fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (!userId) return;
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markNotificationReadAction(n.id)));
    fetchNotifications();
    toast("All notifications marked as read", "success");
  };

  const handleMarkRead = async (id: string) => {
    const res = await markNotificationReadAction(id);
    if (res.success) {
      fetchNotifications();
    }
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await deleteNotificationAction(id);
    if (res.success) {
      fetchNotifications();
      toast("Notification deleted", "success");
    }
  };

  // Sync user info with local Prisma DB on login
  useEffect(() => {
    if (isSignedIn && user && userId && !hasSynced.current) {
      hasSynced.current = true;
      syncUserAction({
        id: userId,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
        imageUrl: user.imageUrl || undefined,
      }).then(res => {
        if (res.success) {
          console.log("[Auth] User synced successfully with local DB.");
          fetchNotifications();
        } else {
          hasSynced.current = false; // Reset on failure to allow retry
        }
      });
    }
  }, [isSignedIn, user, userId]);

  // Command palette data states
  const [paletteReports, setPaletteReports] = useState<any[]>([]);
  const [paletteRecent, setPaletteRecent] = useState<any[]>([]);

  useEffect(() => {
    if (userId && isCommandPaletteOpen) {
      getSavedReportsAction(userId).then(res => {
        if (res.success) setPaletteReports(res.data);
      });
      getRecentAnalysesAction(userId).then(res => {
        if (res.success) setPaletteRecent(res.data);
      });
    }
  }, [userId, isCommandPaletteOpen]);

  // Global hotkey Ctrl+K for command palette & Escape to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setShowNotifications(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, protected: true },
    { name: "New Analysis", href: "/analyze", icon: Plus, protected: true },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase, protected: true },
    { name: "Watchlist", href: "/watchlist", icon: Eye, protected: true },
    { name: "Compare Companies", href: "/compare", icon: ArrowLeftRight, protected: true },
    { name: "Saved Reports", href: "/reports", icon: FileText, protected: true },
    { name: "AI Research Chat", href: "/chat", icon: MessageSquare, protected: true },
    { name: "Settings", href: "/settings", icon: Settings, protected: true },
  ];

  const handleCommandRun = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
  };

  const currentLink = navLinks.find(link => link.href === pathname);
  const isProtected = currentLink?.protected;
  const showProtectedOverlay = isLoaded && isProtected && !isSignedIn;

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="flex h-dvh bg-zinc-950 text-foreground overflow-hidden font-sans">
        
        {/* 1. Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 h-full border-r border-white/10 bg-zinc-950/80 backdrop-blur-md al-glass relative z-30 shrink-0">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 font-extrabold text-sm tracking-tight text-foreground hover:opacity-85 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path d="M2 10.5L6 4.5L9 8L11 5.5L13 7" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">AlphaLens Platform</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto al-scrollbar">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group relative cursor-pointer",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-emerald-400" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{link.name}</span>
                  </div>
                  {link.protected && !isSignedIn && (
                    <span className="text-[9px] uppercase tracking-widest font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 scale-90">
                      Lock
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Buttons */}
          <div className="p-4 border-t border-white/5 space-y-3">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <Command className="w-3.5 h-3.5" />
                <span>Command Palette</span>
              </div>
              <span className="text-[9px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-muted-foreground">Ctrl+K</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-zinc-950/95 backdrop-blur-lg border-b border-white/10 z-40 flex flex-col p-6 space-y-4"
            >
              <div className="flex-1 space-y-2 overflow-y-auto">
                {navLinks.map(link => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </div>
                      {link.protected && !isSignedIn && (
                        <span className="text-[8px] uppercase tracking-widest font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Lock
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-bold text-muted-foreground"
                >
                  <Command className="w-4 h-4" />
                  Command Palette (Ctrl+K)
                </button>

                {!isSignedIn ? (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openSignIn();
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-zinc-950 text-xs font-black transition-all text-center"
                  >
                    Sign In
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-3">
                      <img src={user?.imageUrl} alt={user?.fullName || ""} className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                      <div>
                        <p className="text-xs font-bold text-foreground">{user?.fullName}</p>
                        <p className="text-[9px] text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Main Dashboard Body Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          
          {/* Top Navigation Bar */}
          <header className="h-16 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md al-glass px-6 flex items-center justify-between shrink-0 relative z-20">
            {/* Left side: Mobile Menu Toggle & Brand (on mobile) or Command Palette Shortcut (on desktop) */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-transparent hover:border-white/10"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/" className="md:hidden flex items-center gap-2.5 font-bold text-sm tracking-tight text-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/25">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M2 10.5L6 4.5L9 8L11 5.5L13 7" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>AlphaLens</span>
              </Link>
              
              <button 
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all text-left text-[10px] font-bold cursor-pointer"
              >
                <Command className="w-3.5 h-3.5" />
                <span>Search or run command...</span>
                <span className="text-[8px] font-mono bg-white/5 border border-white/10 px-1 py-0.5 rounded text-muted-foreground ml-2">Ctrl+K</span>
              </button>
            </div>

            {/* Right side: Notifications & Profile Dropdown */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-white/[0.04] text-muted-foreground hover:text-foreground transition-all relative border border-transparent hover:border-white/5 cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] rounded-xl border border-white/10 bg-zinc-950 p-4 shadow-2xl z-20 al-glass"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2">
                          <p className="text-xs font-bold text-foreground">Notifications</p>
                          {notifications.some(n => !n.read) && (
                            <button 
                              onClick={handleMarkAllRead}
                              className="text-[9px] font-bold text-emerald-400 hover:underline cursor-pointer"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto al-scrollbar">
                          {notifications.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground/50 py-6 text-center">No notifications yet.</p>
                          ) : (
                            notifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => !n.read && handleMarkRead(n.id)}
                                className={cn(
                                  "p-2 rounded-lg border text-left transition-all relative group cursor-pointer",
                                  n.read ? "bg-transparent border-transparent" : "bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10"
                                )}
                              >
                                <button
                                  onClick={(e) => handleDeleteNotification(n.id, e)}
                                  className="absolute top-2 right-2 p-0.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all cursor-pointer"
                                  title="Delete notification"
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                                <p className="text-[10px] font-bold text-foreground pr-4">{n.title}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5 pr-4">{n.desc}</p>
                                <span className="text-[8px] text-muted-foreground/50 block mt-1">{n.time}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Profile Dropdown */}
              <ProfileDropdown />
            </div>
          </header>

          {/* Main workspace container */}
          <main className="flex-1 overflow-hidden relative">
            {!isLoaded && isProtected ? (
              <div className="flex h-full w-full items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              </div>
            ) : showProtectedOverlay ? (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-md z-30">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-950 p-6 md:p-8 text-center shadow-2xl al-glass"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/25 mb-4 text-amber-500">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-extrabold text-foreground tracking-tight">Protected Resource</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    You must be signed in to view your personalized portfolio workspace, watchlist, saved reports, and default account preferences.
                  </p>
                  <button 
                    onClick={openSignIn}
                    className="mt-6 w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-400/20 active:scale-98 transition-all cursor-pointer"
                  >
                    Authenticate Now
                  </button>
                </motion.div>
              </div>
            ) : (
              children
            )}
          </main>
        </div>

        {/* 4. Global Toast Notifications Stack */}
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full no-print">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border shadow-xl",
                  t.type === "success" 
                    ? "bg-zinc-950/95 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5 al-glass"
                    : t.type === "error"
                    ? "bg-zinc-950/95 border-red-500/20 text-red-400 shadow-red-500/5 al-glass"
                    : "bg-zinc-950/95 border-sky-500/20 text-sky-400 shadow-sky-500/5 al-glass"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  t.type === "success" ? "bg-emerald-400" : t.type === "error" ? "bg-red-400" : "bg-sky-400"
                )} />
                <span className="text-xs font-bold text-foreground leading-relaxed">{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 5. Command Palette Modal */}
        <AnimatePresence>
          {isCommandPaletteOpen && (
            <div className="fixed inset-0 z-[999] flex items-start justify-center p-4 pt-[10dvh]">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCommandPaletteOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Palette Card */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl al-glass"
              >
                <div className="flex items-center gap-3 px-4 border-b border-white/5 h-14">
                  <Search className="w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search shortcuts or target company tickers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50 border-none"
                    autoFocus
                  />
                  <div className="text-[10px] text-muted-foreground/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded">ESC</div>
                </div>

                <div className="p-2.5 max-h-[300px] overflow-y-auto al-scrollbar space-y-3">
                  {/* Typed Custom Research Trigger */}
                  {searchQuery.trim().length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-400/50 uppercase tracking-widest px-2.5 py-1">AI Agent Research</p>
                      <button
                        onClick={() => handleCommandRun(() => router.push(`/analyze?analyze=${encodeURIComponent(searchQuery.trim())}`))}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 transition-all text-left cursor-pointer border border-emerald-500/10"
                      >
                        <div className="flex items-center gap-2">
                          <SearchCode className="w-4 h-4 text-emerald-400" />
                          <span>Run Multi-Agent Research for "{searchQuery}"</span>
                        </div>
                        <span className="text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-black">LAUNCH</span>
                      </button>
                    </div>
                  )}

                  {/* Actions / Navigation Shortcuts */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground/45 uppercase tracking-widest px-2.5 py-1">Quick Links & Actions</p>
                    {navLinks
                      .filter(link => link.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(link => (
                        <button
                          key={link.href}
                          onClick={() => handleCommandRun(() => router.push(link.href))}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <link.icon className="w-4 h-4 text-emerald-400" />
                            <span>{link.name}</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground/65">Go to page</span>
                        </button>
                      ))}
                    {/* Add Watchlist Action */}
                    {"add to watchlist".includes(searchQuery.toLowerCase()) && (
                      <button
                        onClick={() => handleCommandRun(() => router.push("/watchlist"))}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-400" />
                          <span>Add to Watchlist</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground/65">Go to watchlist</span>
                      </button>
                    )}
                    {/* Add Holding Action */}
                    {"log acquisition / add holding".includes(searchQuery.toLowerCase()) && (
                      <button
                        onClick={() => handleCommandRun(() => router.push("/portfolio"))}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-emerald-400" />
                          <span>Log Acquisition / Add Holding</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground/65">Go to portfolio</span>
                      </button>
                    )}
                  </div>

                  {/* Saved Reports Search */}
                  {paletteReports.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground/45 uppercase tracking-widest px-2.5 py-1">Saved Intelligence Reports</p>
                      {paletteReports
                        .filter(r => r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || r.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 4)
                        .map(r => (
                          <button
                            key={r.id}
                            onClick={() => handleCommandRun(() => router.push(`/reports?id=${r.id}`))}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span>{r.companyName} ({r.ticker})</span>
                            </div>
                            <span className="text-[8px] text-muted-foreground/65 font-bold uppercase tracking-wider">{r.recommendation} ({r.score})</span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Recent Analyses Activity */}
                  {paletteRecent.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground/45 uppercase tracking-widest px-2.5 py-1">Recent Analyses Feed</p>
                      {paletteRecent
                        .filter(act => act.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || act.ticker.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 3)
                        .map(act => (
                          <button
                            key={act.id}
                            onClick={() => handleCommandRun(() => router.push(`/reports?ticker=${act.ticker}`))}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span>{act.companyName} ({act.ticker})</span>
                            </div>
                            <span className="text-[8px] text-muted-foreground/65">Decision: {act.recommendation}</span>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Suggested Research */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-muted-foreground/45 uppercase tracking-widest px-2.5 py-1">Direct Company Research</p>
                    {["Apple", "Microsoft", "NVIDIA", "Amazon", "Tesla"]
                      .filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(c => (
                        <button
                          key={c}
                          onClick={() => handleCommandRun(() => {
                            router.push(`/analyze?analyze=${encodeURIComponent(c)}`);
                          })}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <SearchCode className="w-4 h-4 text-emerald-400" />
                            <span>Analyze {c}</span>
                          </div>
                          <span className="text-[8px] text-muted-foreground/65">Run agent research</span>
                        </button>
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </ToastContext.Provider>
  );
}
