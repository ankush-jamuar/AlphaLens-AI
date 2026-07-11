"use client";

import { useAuth } from "@/lib/clerk-mock";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LandingPage } from "@/components/layout/LandingPage";

export default function HomePage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/analyze");
    }
  }, [userId, isLoaded, router]);

  if (!isLoaded || userId) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-muted-foreground/60">
        Loading AlphaLens...
      </div>
    );
  }

  return <LandingPage />;
}
