"use client";

import { useState, useCallback } from "react";
import type { AnalysisState, InvestmentReport } from "@/types";
import { PIPELINE_STEPS } from "@/lib/constants";
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
   * Streams progress events from the backend NDJSON route.
   */
  const analyze = useCallback(async (companyName: string) => {
    const validationError = validateCompanyName(companyName);
    if (validationError) {
      setState((prev) => ({ ...prev, status: "error", error: validationError }));
      return;
    }

    setState({ status: "loading", report: null, error: null, currentStep: 0 });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/x-ndjson",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        throw new Error(errorJson?.error?.message || "Failed to initiate research agent.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("API streaming response body is not readable.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        // Retain the trailing incomplete line
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);
            
            if (event.type === "progress") {
              setState((prev) => ({
                ...prev,
                currentStep: Math.min(event.step, PIPELINE_STEPS.length - 1),
              }));
            } else if (event.type === "report") {
              setState({
                status: "success",
                report: event.report,
                error: null,
                currentStep: PIPELINE_STEPS.length - 1,
              });
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          } catch (jsonError) {
            console.error("Failed parsing line event chunk:", jsonError, line);
            // Re-throw critical LLM errors
            if (jsonError instanceof Error && jsonError.message.includes("LLM_ERROR")) {
              throw jsonError;
            }
          }
        }
      }
    } catch (err) {
      console.error("Analysis hook runtime error:", err);
      setState({
        status: "error",
        report: null,
        error: err instanceof Error ? err.message : "An unexpected error occurred during analysis.",
        currentStep: 0,
      });
    }
  }, []);

  const selectReport = useCallback((loadedReport: InvestmentReport) => {
    setState({
      status: "success",
      report: loadedReport,
      error: null,
      currentStep: PIPELINE_STEPS.length - 1,
    });
  }, []);

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
    selectReport,
    reset,
  };
}
