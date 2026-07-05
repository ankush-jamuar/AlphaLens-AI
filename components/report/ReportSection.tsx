"use client";

/**
 * ReportSection — Container for all report cards.
 * Receives InvestmentReport and delegates rendering to child components.
 * (COMPONENT_TREE.md: ReportSection)
 */

import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard";
import { CompanyOverviewCard } from "./CompanyOverviewCard";
import { FinancialHealthCard } from "./FinancialHealthCard";
import { MarketPositionCard } from "./MarketPositionCard";
import { NewsCard } from "./NewsCard";
import { RisksCard } from "./RisksCard";
import { OpportunitiesCard } from "./OpportunitiesCard";
import { RecommendationCard } from "./RecommendationCard";
import { SourcesCard } from "./SourcesCard";
import type { InvestmentReport } from "@/types";

interface ReportSectionProps {
  report: InvestmentReport;
}

export function ReportSection({ report }: ReportSectionProps) {
  return (
    <div className="space-y-4">
      {/* Hero — Executive Summary */}
      <ExecutiveSummaryCard report={report} />

      {/* Company Overview */}
      <CompanyOverviewCard company={report.company} animationDelay={0.1} />

      {/* Financial Health */}
      <FinancialHealthCard financials={report.financials} animationDelay={0.2} />

      {/* Market Position */}
      <MarketPositionCard market={report.market} animationDelay={0.3} />

      {/* Recent News */}
      <NewsCard news={report.news} animationDelay={0.4} />

      {/* Risks */}
      <RisksCard risks={report.risks} animationDelay={0.5} />

      {/* Opportunities */}
      <OpportunitiesCard opportunities={report.opportunities} animationDelay={0.6} />

      {/* Recommendation — hero section */}
      <RecommendationCard recommendation={report.recommendation} animationDelay={0.7} />

      {/* Sources */}
      <SourcesCard sources={report.sources} animationDelay={0.8} />
    </div>
  );
}
