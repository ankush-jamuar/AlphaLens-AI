import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`TIMEOUT: ${errorMessage}`));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delayMs: number,
  serviceName: string
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      const errStr = error instanceof Error ? error.message : String(error);
      const isTransient = 
        !errStr.includes("429") && 
        !errStr.includes("RATE_LIMIT") && 
        !errStr.includes("401") && 
        !errStr.includes("403") && 
        !errStr.toLowerCase().includes("api key") &&
        !errStr.toLowerCase().includes("unauthorized") &&
        !errStr.toLowerCase().includes("quota") &&
        !errStr.toLowerCase().includes("limit");

      if (attempt > retries || !isTransient) {
        throw error;
      }
      console.warn(`[${serviceName}] Transient failure (attempt ${attempt}). Retrying in ${delayMs}ms... Error: ${errStr}`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Gemini Service Wrapper
 * Manages ChatGoogleGenerativeAI instance and provides completion and structured output.
 */
export interface GeminiService {
  generateText(prompt: string): Promise<string>;
  generateStructured<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T>;
}

export class GeminiServiceImpl implements GeminiService {
  private modelInstance: ChatGoogleGenerativeAI | null = null;

  private getModel(): ChatGoogleGenerativeAI {
    if (!this.modelInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not configured.");
      }
      this.modelInstance = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: apiKey,
        maxRetries: 0, // We manage retries ourselves
        temperature: 0.1,
      });
    }
    return this.modelInstance;
  }

  async generateText(prompt: string): Promise<string> {
    console.log("[GeminiService] Generating text...");
    const callFn = async () => {
      const model = this.getModel();
      const response = await model.invoke(prompt);
      return typeof response.content === "string" 
        ? response.content 
        : JSON.stringify(response.content);
    };

    try {
      // 30s timeout, maximum 2 attempts (1 retry) for transient errors
      return await retry(
        () => withTimeout(callFn(), 30000, "Gemini text generation timed out after 30s"),
        1,
        1000,
        "GeminiService"
      );
    } catch (error) {
      const errStr = error instanceof Error ? error.message : String(error);
      console.error(`[GeminiService] Text generation failed: ${errStr}`);
      throw new Error(`LLM_ERROR: ${errStr}`);
    }
  }

  async generateStructured<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    console.log("[GeminiService] Generating structured report...");
    const callFn = async () => {
      const model = this.getModel();
      const structuredModel = model.withStructuredOutput(schema);
      return await structuredModel.invoke(prompt) as T;
    };

    try {
      // 30s timeout, maximum 2 attempts (1 retry) for transient errors
      return await retry(
        () => withTimeout(callFn(), 30000, "Gemini structured generation timed out after 30s"),
        1,
        1000,
        "GeminiService"
      );
    } catch (error) {
      const errStr = error instanceof Error ? error.message : String(error);
      console.error(`[GeminiService] Structured generation failed: ${errStr}`);
      throw new Error(`LLM_ERROR: Structured output validation failed. ${errStr}`);
    }
  }
}

export const geminiService = new GeminiServiceImpl();
