"use client";

import React from "react";
import { ClerkProvider as NextClerkProvider } from "@clerk/nextjs";
import { 
  SignedIn as ReactSignedIn, 
  SignedOut as ReactSignedOut, 
  UserButton as ReactUserButton, 
  useUser as reactUseUser, 
  useAuth as reactUseAuth 
} from "@clerk/clerk-react";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return <NextClerkProvider>{children}</NextClerkProvider>;
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  return <ReactSignedIn>{children}</ReactSignedIn>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  return <ReactSignedOut>{children}</ReactSignedOut>;
}

export function UserButton() {
  return (
    <ReactUserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8 border border-emerald-500/30 rounded-full",
          userButtonPopoverCard: "border border-white/10 bg-zinc-950 p-4 shadow-2xl rounded-2xl al-glass",
          userButtonPopoverActionButtonText: "text-zinc-300 hover:text-white font-bold",
          userButtonPopoverFooter: "hidden"
        }
      }}
    />
  );
}

export function useUser() {
  const { isLoaded, isSignedIn, user } = reactUseUser();
  return {
    isLoaded,
    isSignedIn,
    user: user ? {
      id: user.id,
      primaryEmailAddress: { emailAddress: user.primaryEmailAddress?.emailAddress || "" },
      fullName: user.fullName || "",
      imageUrl: user.imageUrl || "",
    } : null,
  };
}

export function useAuth() {
  const { isLoaded, userId, signOut } = reactUseAuth();
  return {
    isLoaded,
    isSignedIn: !!userId,
    userId,
    signOut,
    openSignIn: () => {
      window.location.href = "/sign-in";
    },
  };
}
