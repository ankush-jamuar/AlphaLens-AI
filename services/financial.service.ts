import type { FinancialData } from "@/types";

/**
 * Financial Data Service Wrapper
 * Placeholder for Financial API (e.g., Alpha Vantage, yFinance)
 */
export interface FinancialService {
  getFinancialData(companyName: string): Promise<FinancialData>;
}

export class FinancialServiceImpl implements FinancialService {
  async getFinancialData(companyName: string): Promise<FinancialData> {
    // TODO [Milestone 2]: Implement actual financial API client
    return {
      revenue: "$100B (Placeholder)",
      netIncome: "$20B (Placeholder)",
      eps: "$4.50 (Placeholder)",
      peRatio: "25.4 (Placeholder)",
      debt: "$15B (Placeholder)",
      cashFlow: "$25B (Placeholder)"
    };
  }
}

export const financialService = new FinancialServiceImpl();
