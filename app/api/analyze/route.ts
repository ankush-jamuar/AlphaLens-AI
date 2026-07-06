/**
 * POST /api/analyze — Investment Analysis Endpoint
 *
 * Milestone 1: Returns 501 Not Implemented with structured JSON.
 *
 * TODO [Milestone 2]: Replace stub with full LangGraph investment agent:
 *   1. Import and validate request using Zod
 *   2. Initialize LangGraph Investment Agent (see langgraph/graph.ts)
 *   3. Execute graph: await runInvestmentAgent(companyName)
 *   4. Return structured InvestmentReport
 *   5. Handle node failures gracefully
 *
 * Request:  POST /api/analyze   { companyName: string }
 * Response: { success: boolean, data?: { report }, error?: { code, message } }
 *
 * See API_SPECIFICATION.md for full contract.
 */

import { type NextRequest, NextResponse } from "next/server";
import { graph, runInvestmentAgent } from "@/langgraph";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnalyzeRequest {
  companyName: string;
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AnalyzeRequest;
    const companyName = body?.companyName?.trim();

    // Validate input (API_SPECIFICATION.md validation rules)
    if (!companyName) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_COMPANY_NAME",
            message: "Please enter a valid company name.",
          },
        },
        { status: 400 }
      );
    }

    if (companyName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_COMPANY_NAME",
            message: "Company name must be at least 2 characters.",
          },
        },
        { status: 400 }
      );
    }

    if (companyName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_COMPANY_NAME",
            message: "Company name must not exceed 100 characters.",
          },
        },
        { status: 400 }
      );
    }

    const accept = request.headers.get("accept") || "";
    const wantStream = accept.includes("text/event-stream") || accept.includes("application/x-ndjson");

    if (wantStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const send = (obj: any) => {
            controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
          };

          try {
            const initialState = {
              companyName,
              errors: [],
            };

            const eventStream = await graph.stream(initialState, { streamMode: "updates" });
            for await (const chunk of eventStream) {
              if (chunk.planning) {
                send({ type: "progress", step: 0 });
              } else if (chunk.companyResearch) {
                send({ type: "progress", step: 1 });
              } else if (chunk.financialAnalysis) {
                send({ type: "progress", step: 2 });
              } else if (chunk.newsAnalysis) {
                send({ type: "progress", step: 3 });
              } else if (chunk.marketAssessment) {
                send({ type: "progress", step: 4 });
              } else if (chunk.evidenceAggregation) {
                send({ type: "progress", step: 5 });
              } else if (chunk.investmentReasoning) {
                send({ type: "progress", step: 5 });
              } else if (chunk.reportFormatter) {
                send({ type: "progress", step: 6 });
                const report = chunk.reportFormatter.report;
                if (report) {
                  send({ type: "report", report });
                }
              }
            }
          } catch (err) {
            console.error("Stream execution error:", err);
            send({
              type: "error",
              error: err instanceof Error ? err.message : "Unknown error during streaming execution.",
            });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Standard synchronous execution
    const report = await runInvestmentAgent(companyName);
    return NextResponse.json({
      success: true,
      data: {
        report,
      },
    });

  } catch (error) {
    console.error("API Analyze Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

