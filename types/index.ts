/**
 * AlphaLens AI — Shared Type Definitions
 *
 * These interfaces are shared across the frontend and backend.
 * They reflect the API contract defined in API_SPECIFICATION.md.
 */

// ---------------------------------------------------------------------------
// Core Report Types
// ---------------------------------------------------------------------------

export interface CompanyProfile {
  name: string;
  ticker?: string;
  industry: string;
  headquarters: string;
  description: string;
  marketCap?: string;
}

export interface FinancialData {
  revenue?: string;
  netIncome?: string;
  eps?: string;
  peRatio?: string;
  debt?: string;
  cashFlow?: string;
}

export interface MarketAnalysis {
  strengths: string[];
  weaknesses: string[];
  competitors: string[];
}

export interface NewsItem {
  title: string;
  summary: string;
  impact: "Positive" | "Neutral" | "Negative";
  url?: string;
  publishedDate?: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface Recommendation {
  decision: "Invest" | "Watch" | "Pass";
  score: number;
  confidence: number;
  thesis: string;
  positives: string[];
  negatives: string[];
}

export interface InvestmentReport {
  id: string;
  createdAt: string;
  company: CompanyProfile;
  financials: FinancialData;
  market: MarketAnalysis;
  news: NewsItem[];
  risks: string[];
  opportunities: string[];
  recommendation: Recommendation;
  sources: Source[];
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export interface HistoryEntry {
  id: string;
  companyName: string;
  recommendation: "Invest" | "Watch" | "Pass";
  score: number;
  createdAt: string;
  report: InvestmentReport;
}

// ---------------------------------------------------------------------------
// Analysis State (used by useAnalysis hook)
// ---------------------------------------------------------------------------

export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export interface AnalysisState {
  status: AnalysisStatus;
  report: InvestmentReport | null;
  error: string | null;
  currentStep: number;
  isNewAnalysis?: boolean;
}

// ---------------------------------------------------------------------------
// Progress Pipeline Steps
// ---------------------------------------------------------------------------

export interface PipelineStep {
  id: string;
  label: string;
  description: string;
}

// ---------------------------------------------------------------------------
// API Response Envelope (API_SPECIFICATION.md)
// ---------------------------------------------------------------------------

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ---------------------------------------------------------------------------
// LangGraph State (LANGGRAPH_DESIGN.md — Milestone 2)
// ---------------------------------------------------------------------------

/**
 * This interface maps to the LangGraph graph state.
 * Each node reads from and writes to a subset of these fields.
 */
export interface GraphState {
  companyName: string;
  ticker?: string;
  companyProfile?: CompanyProfile;
  financialData?: FinancialData;
  news?: NewsItem[];
  marketAnalysis?: MarketAnalysis;
  evidence?: EvidenceSummary;
  recommendation?: Recommendation;
  report?: InvestmentReport;
  errors?: string[];
}

/**
 * Built by the Evidence Aggregation node.
 */
export interface EvidenceSummary {
  keyFacts: string[];
  financialHighlights: string[];
  newsHighlights: string[];
  marketInsights: string[];
  riskFactors: string[];
  growthCatalysts: string[];
}

export interface ReasoningResult {
  thesis: string;
  decision: "Invest" | "Watch" | "Pass";
  score: number;
  confidence: number;
  positives: string[];
  negatives: string[];
}

