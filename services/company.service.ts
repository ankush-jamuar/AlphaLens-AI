import type { CompanyProfile } from "@/types";

/**
 * Company Research Service Wrapper
 * Placeholder for Company API (e.g., Finnhub, Yahoo Finance)
 */
export interface CompanyService {
  getCompanyProfile(companyName: string): Promise<CompanyProfile>;
}

export class CompanyServiceImpl implements CompanyService {
  async getCompanyProfile(companyName: string): Promise<CompanyProfile> {
    // TODO [Milestone 2]: Implement actual company API client
    return {
      name: companyName,
      ticker: "PCHM",
      industry: "Technology (Placeholder)",
      headquarters: "San Francisco, CA (Placeholder)",
      description: "This is a placeholder company description for " + companyName + ".",
      marketCap: "$500B (Placeholder)"
    };
  }
}

export const companyService = new CompanyServiceImpl();
