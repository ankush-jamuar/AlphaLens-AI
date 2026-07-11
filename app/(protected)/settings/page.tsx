"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  User as UserIcon, 
  Palette, 
  Download, 
  Languages, 
  Bell, 
  Loader2, 
  CheckCircle,
  ShieldAlert
} from "lucide-react";
import { useAuth, useUser } from "@/lib/clerk-mock";
import { getSettingsAction, updateSettingsAction } from "@/lib/db-actions";
import { useToast } from "@/components/layout/PlatformShell";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State variables
  const [theme, setTheme] = useState("dark");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [language, setLanguage] = useState("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Fetch settings on load
  useEffect(() => {
    if (!userId) return;

    const fetchSettings = async () => {
      setIsLoading(true);
      const res = await getSettingsAction(userId);
      if (res.success && res.data) {
        setTheme(res.data.theme);
        setExportFormat(res.data.exportFormat);
        setLanguage(res.data.language);
        setNotificationsEnabled(res.data.notificationsEnabled);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    const res = await updateSettingsAction({
      userId,
      theme,
      exportFormat,
      language,
      notificationsEnabled,
    });

    if (res.success) {
      toast("Settings updated successfully", "success");
    } else {
      toast(`Failed to save settings: ${res.error}`, "error");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto overflow-y-auto h-full al-scrollbar animate-pulse">
        <div className="h-16 w-1/3 bg-white/5 rounded-xl" />
        <div className="h-44 bg-white/5 rounded-2xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto overflow-y-auto h-full al-scrollbar">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-emerald-400" />
            Account Settings
          </h2>
          <p className="text-xs text-muted-foreground">
            Configure platform visual options, notification centers, default exports, and member profiles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Profile Summary Card */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={user?.imageUrl} 
              alt={user?.fullName || ""} 
              className="w-14 h-14 rounded-full border border-white/10 object-cover" 
            />
            <div>
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">{user?.fullName}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
              <span className="inline-block mt-2 text-[9px] uppercase tracking-widest font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PRO PLATFORM MEMBERSHIP
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl">
            Linked provider: <span className="font-bold text-foreground capitalize">Google Auth</span>
          </div>
        </div>

        {/* 2. Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Visual Preferences */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              Interface Theme
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Theme Selection</label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                >
                  <option value="dark">Bloomberg Dark Mode</option>
                  <option value="light">Classic Light (Mockup)</option>
                  <option value="system">Follow System Defaults</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Preferences */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-sky-400" />
              Document Exports
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Default Format</label>
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                >
                  <option value="pdf">Structured PDF Document</option>
                  <option value="json">Raw JSON Dataset</option>
                </select>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4 text-purple-400" />
              Language & Region
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Display Language</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-foreground focus:border-emerald-500/50 outline-none"
                >
                  <option value="en">English (Global)</option>
                  <option value="es">Español (Mockup)</option>
                  <option value="hi">हिन्दी (Mockup)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 al-glass space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Real-time alerts</label>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    notificationsEnabled ? "bg-emerald-500" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out",
                      notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Submit Area */}
        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Save Settings
          </button>
        </div>

      </form>

    </div>
  );
}
