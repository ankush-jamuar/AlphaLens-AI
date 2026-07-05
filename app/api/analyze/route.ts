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

    // TODO [Milestone 2]: Remove this stub and execute the LangGraph agent.
    // const report = await runInvestmentAgent(companyName);
    // return NextResponse.json({ success: true, data: { report } });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_IMPLEMENTED",
          message:
            "AI analysis engine is not yet connected. This will be implemented in Milestone 2.",
        },
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "An unexpected error occurred. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
