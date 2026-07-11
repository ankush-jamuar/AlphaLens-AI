"use client";

import React from "react";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { ClerkProvider } from "@/lib/clerk-mock";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PlatformShell>{children}</PlatformShell>
    </ClerkProvider>
  );
}
