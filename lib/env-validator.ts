let envValidated = false;

/**
 * Validates that all required environment variables are configured.
 * Throws a loud and meaningful error if any key is missing.
 * Runs once per process lifecycle to prevent overhead.
 */
export function validateEnv() {
  if (envValidated) return;

  const missing: string[] = [];
  if (!process.env.GEMINI_API_KEY) {
    missing.push("GEMINI_API_KEY");
  }
  if (!process.env.ALPHA_VANTAGE_API_KEY && !process.env.FINANCIAL_API_KEY) {
    missing.push("ALPHA_VANTAGE_API_KEY");
  }
  if (!process.env.GNEWS_API_KEY) {
    missing.push("GNEWS_API_KEY");
  }

  if (missing.length > 0) {
    const errorMsg = `[Startup Error] Missing required environment variables in .env.local: ${missing.join(", ")}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  envValidated = true;
}
