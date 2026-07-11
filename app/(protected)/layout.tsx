"use client";

import React from "react";
import { PlatformShell } from "@/components/layout/PlatformShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlatformShell>{children}</PlatformShell>;
}
