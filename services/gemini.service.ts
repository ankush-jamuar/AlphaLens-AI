/**
 * Gemini Service Wrapper
 * Placeholder for Gemini 2.5 Flash LLM client
 */
export interface GeminiService {
  generateCompletion(prompt: string): Promise<string>;
  generateStructuredOutput<T>(prompt: string, schema: any): Promise<T>;
}

export class GeminiServiceImpl implements GeminiService {
  async generateCompletion(prompt: string): Promise<string> {
    // TODO [Milestone 2]: Implement actual Gemini API call
    return JSON.stringify({ message: "Gemini response placeholder" });
  }

  async generateStructuredOutput<T>(prompt: string, schema: any): Promise<T> {
    // TODO [Milestone 2]: Implement actual Gemini structured API call
    return {} as T;
  }
}

export const geminiService = new GeminiServiceImpl();
