import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
        {children}
      </body>
    </html>
  );
}
