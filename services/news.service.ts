import type { NewsItem } from "@/types";
import { geminiService } from "./gemini.service";
import { newsPrompt, newsClassificationPrompt } from "@/prompts/news";
import { z } from "zod";

interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
}

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

const newsCache = new Map<string, CacheEntry>();
const newsInProgress = new Map<string, Promise<NewsItem[]>>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

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
      const waitTime = delayMs;
      console.warn(`[${serviceName}] Transient failure (attempt ${attempt}). Retrying in ${waitTime}ms... Error: ${errStr}`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * News Service Wrapper
 * Fetches news from GNews API and uses a single structured Gemini call to summarize and classify sentiment.
 * Uses Gemini generation as a fallback if the API is offline.
 */
export interface NewsService {
  getRecentNews(companyName: string): Promise<NewsItem[]>;
}

export class NewsServiceImpl implements NewsService {
  async getRecentNews(companyName: string): Promise<NewsItem[]> {
    const key = companyName.trim().toLowerCase();

    // Check cached news
    const entry = newsCache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      console.log("[News] Cache hit.");
      return entry.data;
    }

    // Check in-progress requests
    const active = newsInProgress.get(key);
    if (active) {
      return active;
    }

    const apiKey = process.env.GNEWS_API_KEY;

    const requestFn = async () => {
      if (!apiKey) {
        throw new Error("No news API key configured in environment variables.");
      }
      
      const query = encodeURIComponent(`"${companyName}"`);
      const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&token=${apiKey}&max=5`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      
      try {
        console.log(`[News] GNews request for ${companyName}.`);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP_${response.status}`);
        }
        
        const data = await response.json();
        const articles = (data.articles || []) as GNewsArticle[];
        
        if (articles.length === 0) {
          throw new Error("No news articles found.");
        }
        
        // Classify all fetched GNews articles using a SINGLE structured Gemini call
        const schema = z.object({
          newsItems: z.array(z.object({
            title: z.string(),
            summary: z.string(),
            impact: z.enum(["Positive", "Neutral", "Negative"]),
            url: z.string(),
            publishedDate: z.string(),
          })),
        });

        console.log(`[News] Classifying ${articles.length} news articles with Gemini...`);
        const prompt = newsClassificationPrompt(companyName, articles);
        const result = await geminiService.generateStructured<{ newsItems: NewsItem[] }>(prompt, schema);
        
        return result.newsItems;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    const promise = retry(requestFn, 1, 1000, "NewsService")
      .then((data) => {
        newsCache.set(key, { data, timestamp: Date.now() });
        newsInProgress.delete(key);
        return data;
      })
      .catch(async (error) => {
        newsInProgress.delete(key);
        
        const errMessage = error instanceof Error ? error.message : String(error);
        console.warn(`[News] GNews fetch failed (${errMessage}). Using Gemini fallback.`);
        
        try {
          const schema = z.object({
            newsItems: z.array(z.object({
              title: z.string(),
              summary: z.string(),
              impact: z.enum(["Positive", "Neutral", "Negative"]),
              url: z.string(),
              publishedDate: z.string(),
            })),
          });

          const prompt = newsPrompt(companyName);
          const fallbackResult = await geminiService.generateStructured<{ newsItems: NewsItem[] }>(prompt, schema);
          
          newsCache.set(key, { data: fallbackResult.newsItems, timestamp: Date.now() });
          return fallbackResult.newsItems;
        } catch (geminiError) {
          console.error("[News] Gemini fallback news generation failed:", geminiError);
          const fallbackDefault = [
            {
              title: `Market updates for ${companyName}`,
              summary: "Corporate tracking and performance monitoring remain consistent. Real-time news currently unavailable.",
              impact: "Neutral" as const,
              url: "https://finance.yahoo.com",
              publishedDate: new Date().toISOString().split("T")[0],
            }
          ];
          newsCache.set(key, { data: fallbackDefault, timestamp: Date.now() });
          return fallbackDefault;
        }
      });

    newsInProgress.set(key, promise);
    return promise;
  }
}

export const newsService = new NewsServiceImpl();
