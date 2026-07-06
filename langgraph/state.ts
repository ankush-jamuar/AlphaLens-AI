import { Annotation } from "@langchain/langgraph";
import type {
  CompanyProfile,
  FinancialData,
  NewsItem,
  MarketAnalysis,
  EvidenceSummary,
  Recommendation,
  InvestmentReport,
} from "./types";

export const GraphStateAnnotation = Annotation.Root({
  companyName: Annotation<string>(),
  ticker: Annotation<string | undefined>(),
  companyProfile: Annotation<CompanyProfile | undefined>(),
  financialData: Annotation<FinancialData | undefined>(),
  news: Annotation<NewsItem[] | undefined>(),
  marketAnalysis: Annotation<MarketAnalysis | undefined>(),
  evidence: Annotation<EvidenceSummary | undefined>(),
  recommendation: Annotation<Recommendation | undefined>(),
  report: Annotation<InvestmentReport | undefined>(),
  errors: Annotation<string[]>({
    reducer: (left: string[] | undefined, right: string | string[] | undefined) => {
      const l = left ?? [];
      const r = right ?? [];
      return [...l, ...(Array.isArray(r) ? r : [r])];
    },
    default: () => [],
  }),
});

