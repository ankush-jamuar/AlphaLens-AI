import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

/**
 * Gemini Service Wrapper
 * Manages ChatGoogleGenerativeAI instance and provides completion and structured output.
 */
export interface GeminiService {
  generateCompletion(prompt: string): Promise<string>;
  generateStructuredOutput<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T>;
}

export class GeminiServiceImpl implements GeminiService {
  private modelInstance: ChatGoogleGenerativeAI | null = null;

  private getModel(): ChatGoogleGenerativeAI {
    if (!this.modelInstance) {
      const apiKey = process.env.GEMINI_API_KEY || "placeholder_api_key_for_build_checks";
      this.modelInstance = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: apiKey,
        maxRetries: 2,
        temperature: 0.1,
      });
    }
    return this.modelInstance;
  }

  async generateCompletion(prompt: string): Promise<string> {
    try {
      const model = this.getModel();
      const response = await model.invoke(prompt);
      const content = typeof response.content === "string" 
        ? response.content 
        : JSON.stringify(response.content);
      return content;
    } catch (error) {
      console.error("Gemini completion error:", error);
      throw new Error(`LLM_ERROR: ${error instanceof Error ? error.message : "Unknown Gemini API error"}`);
    }
  }

  async generateStructuredOutput<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    try {
      const model = this.getModel();
      const structuredModel = model.withStructuredOutput(schema);
      const result = await structuredModel.invoke(prompt);
      return result as T;
    } catch (error) {
      console.error("Gemini structured output first attempt failed:", error);
      
      // Retry once if validation or completion fails
      try {
        console.warn("Retrying structured output generation...");
        const model = this.getModel();
        const structuredModel = model.withStructuredOutput(schema);
        const result = await structuredModel.invoke(prompt);
        return result as T;
      } catch (retryError) {
        console.error("Gemini structured output retry failed:", retryError);
        throw new Error(`LLM_ERROR: Structured output validation failed. ${retryError instanceof Error ? retryError.message : "Unknown validation error"}`);
      }
    }
  }
}

export const geminiService = new GeminiServiceImpl();
