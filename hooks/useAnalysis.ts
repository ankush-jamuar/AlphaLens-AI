"use client";

/**
 * useAnalysis — Custom hook for managing investment analysis state.
 *
 * Milestone 1: Stub implementation. Simulates analysis with mock data.
 * TODO [Milestone 2]: Replace mock simulation with real POST /api/analyze call
 *                     and connect to LangGraph progress streaming.
 */

import { useState, useCallback } from "react";
import type { AnalysisState } from "@/types";
import { PIPELINE_STEPS } from "@/lib/constants";
import { MOCK_NVIDIA_REPORT } from "@/lib/mock-data";
import { validateCompanyName } from "@/utils/format";

const INITIAL_STATE: AnalysisState = {
  status: "idle",
  report: null,
  error: null,
  currentStep: 0,
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);

  /**
   * Submits a company name for analysis.
   *
   * Milestone 1: Simulates pipeline progress with timeouts using mock data.
   * TODO [Milestone 2]: Replace with actual fetch to POST /api/analyze.
   *                     Stream progress events from LangGraph node execution.
   */
  const analyze = useCallback(async (companyName: string) => {
    const validationError = validateCompanyName(companyName);
    if (validationError) {
      setState((prev) => ({ ...prev, status: "error", error: validationError }));
      return;
    }

    setState({ status: "loading", report: null, error: null, currentStep: 0 });

    // TODO [Milestone 2]: Remove mock simulation below.
    // Replace with: const response = await fetch("/api/analyze", { ... })
    try {
      for (let step = 0; step < PIPELINE_STEPS.length; step++) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setState((prev) => ({ ...prev, currentStep: step }));
      }

      setState({
        status: "success",
        report: MOCK_NVIDIA_REPORT,
        error: null,
        currentStep: PIPELINE_STEPS.length - 1,
      });
    } catch {
      setState({
        status: "error",
        report: null,
        error: "Something went wrong. Please try again.",
        currentStep: 0,
      });
    }
  }, []);

  /**
   * Resets analysis state back to idle.
   */
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    status: state.status,
    report: state.report,
    error: state.error,
    currentStep: state.currentStep,
    isLoading: state.status === "loading",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    analyze,
    reset,
  };
}
