import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env-validator";

export async function GET() {
  try {
    validateEnv();
    return NextResponse.json({
      success: true,
      data: {
        GEMINI: !!process.env.GEMINI_API_KEY,
        ALPHA: !!process.env.ALPHA_VANTAGE_API_KEY,
        GNEWS: !!process.env.GNEWS_API_KEY,
        status: "All environment variables are set and validated.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ENV_VALIDATION_FAILED",
          message: error instanceof Error ? error.message : "Environment validation failed.",
        },
      },
      { status: 500 }
    );
  }
}