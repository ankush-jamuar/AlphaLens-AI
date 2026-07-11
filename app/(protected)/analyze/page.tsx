"use client";

import { Workspace } from "@/components/layout/Workspace";
import { Navbar } from "@/components/layout/Navbar";

export default function AnalyzePage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <Workspace />
    </div>
  );
}
