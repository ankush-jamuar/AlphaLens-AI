/**
 * POST /api/analyze — Investment Analysis Endpoint
 *
 * Request:  POST /api/analyze   { companyName: string }
 * Response: { success: boolean, data?: { report }, error?: { code, message } }
 *
 * See API_SPECIFICATION.md for full contract.
 */

import { type NextRequest, NextResponse } from "next/server";
import { graph, runInvestmentAgent, finalReportCache } from "@/langgraph";
import { validateEnv } from "@/lib/env-validator";

interface AnalyzeRequest {
  companyName: string;
}

export async function POST(request: NextRequest) {
  try {
    validateEnv();
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
      let isClosed = false;
      const stream = new ReadableStream({
        async start(controller) {
          const send = (obj: Record<string, unknown>) => {
            if (isClosed) return;
            try {
              controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
            } catch (err) {
              console.warn("Stream enqueue failed, probably closed/aborted:", err);
            }
          };

          try {
            const key = companyName.trim().toLowerCase();
            const cachedEntry = finalReportCache.get(key);
            if (cachedEntry && Date.now() - cachedEntry.timestamp < (15 * 60 * 1000)) {
              console.log(`[Cache] Report reused for ${companyName}`);
              send({ type: "progress", step: 6 });
              send({ type: "report", report: cachedEntry.report });
              return;
            }

            const initialState = {
              companyName,
              errors: [],
            };

            const eventStream = await graph.stream(initialState, { streamMode: "updates" });
            for await (const chunk of eventStream) {
              if (isClosed) break;

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
                  finalReportCache.set(key, { report, timestamp: Date.now() });
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
            isClosed = true;
            try {
              controller.close();
            } catch {
              // ignore if already closed
            }
          }
        },
        cancel() {
          isClosed = true;
        }
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
