import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

const inter = { variable: "font-sans-local" };
const geistMono = { variable: "font-mono-local" };

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — AI Investment Research Workspace`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "AlphaLens AI is an intelligent investment research workspace powered by LangGraph and Gemini. Analyze public companies and receive explainable, structured investment recommendations.",
  keywords: [
    "investment research",
    "AI investing",
    "stock analysis",
    "investment recommendation",
    "LangGraph",
    "Gemini AI",
  ],
  openGraph: {
    title: `${APP_NAME} — AI Investment Research Workspace`,
    description:
      "AI-powered investment analysis. Research any public company and receive an explainable investment recommendation.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { ClerkProvider } from "@/lib/clerk-mock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased" suppressHydrationWarning>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
