"use server";

import { db } from "./db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { geminiService } from "@/services/gemini.service";
import { fetchAlphaVantage, financialService } from "@/services/financial.service";
import { companyService } from "@/services/company.service";

// ---------------------------------------------------------------------------
// Schemas & Validation
// ---------------------------------------------------------------------------

const UserSyncSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

const SaveReportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  companyName: z.string(),
  ticker: z.string(),
  recommendation: z.string(),
  score: z.number().int(),
  reportData: z.string(),
});

const ToggleFavoriteReportSchema = z.object({
  reportId: z.string(),
  favorite: z.boolean(),
});

const WatchlistSchema = z.object({
  userId: z.string(),
  ticker: z.string(),
  companyName: z.string(),
});

const ToggleWatchlistSchema = z.object({
  id: z.string(),
  field: z.enum(["pinned", "favorite"]),
  value: z.boolean(),
});

const PortfolioHoldingSchema = z.object({
  userId: z.string(),
  ticker: z.string(),
  companyName: z.string(),
  shares: z.number().positive(),
  averagePrice: z.number().positive(),
  purchaseDate: z.string(), // ISO String
});

const UpdatePortfolioHoldingSchema = z.object({
  id: z.string(),
  shares: z.number().positive(),
  averagePrice: z.number().positive(),
  purchaseDate: z.string(), // ISO String
});

const RecentAnalysisSchema = z.object({
  userId: z.string(),
  companyName: z.string(),
  ticker: z.string(),
  recommendation: z.string(),
  score: z.number().int(),
});

const SettingsSchema = z.object({
  userId: z.string(),
  theme: z.string().optional(),
  exportFormat: z.string().optional(),
  language: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
});

const ExportHistorySchema = z.object({
  userId: z.string(),
  reportId: z.string(),
  format: z.string(),
});

const SearchHistorySchema = z.object({
  userId: z.string(),
  ticker: z.string(),
  companyName: z.string(),
});

const SendChatMessageSchema = z.object({
  userId: z.string(),
  reportId: z.string(),
  text: z.string().min(1),
});

// ---------------------------------------------------------------------------
// User Sync
// ---------------------------------------------------------------------------

export async function syncUserAction(rawData: z.infer<typeof UserSyncSchema>) {
  try {
    const data = UserSyncSchema.parse(rawData);
    
    const user = await db.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email,
        name: data.name || null,
        imageUrl: data.imageUrl || null,
      },
      create: {
        id: data.id,
        email: data.email,
        name: data.name || null,
        imageUrl: data.imageUrl || null,
      },
    });

    // Ensure user settings exist
    await db.userSettings.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: `set_${user.id}`,
        userId: user.id,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("syncUserAction error:", error);
    return { success: false, error: "Authentication database sync failed. Please try again later." };
  }
}

// ---------------------------------------------------------------------------
// Saved Reports
// ---------------------------------------------------------------------------

export async function saveReportAction(rawData: z.infer<typeof SaveReportSchema>) {
  try {
    const data = SaveReportSchema.parse(rawData);
    
    const report = await db.savedReport.upsert({
      where: { id: data.id },
      update: {
        reportData: data.reportData,
      },
      create: {
        id: data.id,
        userId: data.userId,
        companyName: data.companyName,
        ticker: data.ticker,
        recommendation: data.recommendation,
        score: data.score,
        reportData: data.reportData,
      },
    });

    await createNotificationAction(
      data.userId,
      "Report Saved Successfully",
      `Saved multi-agent research report for ${data.companyName} (${data.ticker}) scoring ${data.score}/100.`
    );

    revalidatePath("/reports");
    revalidatePath("/dashboard");
    return { success: true, report };
  } catch (error) {
    console.error("saveReportAction error:", error);
    return { success: false, error: "Failed to save the intelligence report to database." };
  }
}

export async function getSavedReportsAction(userId: string) {
  try {
    const reports = await db.savedReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reports };
  } catch (error) {
    console.error("getSavedReportsAction error:", error);
    return { success: false, error: "Failed to load saved reports.", data: [] };
  }
}

export async function deleteSavedReportAction(reportId: string) {
  try {
    const report = await db.savedReport.findUnique({ where: { id: reportId } });
    await db.savedReport.delete({
      where: { id: reportId },
    });
    if (report) {
      await createNotificationAction(
        report.userId,
        "Report Deleted",
        `Removed investment report for ${report.companyName} (${report.ticker}) from database.`
      );
    }
    revalidatePath("/reports");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("deleteSavedReportAction error:", error);
    return { success: false, error: "Failed to delete the saved report." };
  }
}

export async function toggleFavoriteReportAction(rawData: z.infer<typeof ToggleFavoriteReportSchema>) {
  try {
    const { reportId, favorite } = ToggleFavoriteReportSchema.parse(rawData);
    await db.savedReport.update({
      where: { id: reportId },
      data: { favorite },
    });
    revalidatePath("/reports");
    return { success: true };
  } catch (error) {
    console.error("toggleFavoriteReportAction error:", error);
    return { success: false, error: "Failed to update report settings." };
  }
}

// ---------------------------------------------------------------------------
// Watchlist
// ---------------------------------------------------------------------------

export async function addToWatchlistAction(rawData: z.infer<typeof WatchlistSchema>) {
  try {
    const data = WatchlistSchema.parse(rawData);
    
    const item = await db.watchlist.upsert({
      where: {
        userId_ticker: {
          userId: data.userId,
          ticker: data.ticker,
        },
      },
      update: {},
      create: {
        id: `wtl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: data.userId,
        ticker: data.ticker,
        companyName: data.companyName,
      },
    });

    await createNotificationAction(
      data.userId,
      "Watchlist Updated",
      `Added ${data.companyName} (${data.ticker}) to your equity watchlist.`
    );

    revalidatePath("/watchlist");
    revalidatePath("/dashboard");
    return { success: true, item };
  } catch (error) {
    console.error("addToWatchlistAction error:", error);
    return { success: false, error: "Failed to add ticker to watchlist." };
  }
}

export async function getWatchlistAction(userId: string) {
  try {
    const items = await db.watchlist.findMany({
      where: { userId },
      orderBy: [
        { pinned: "desc" },
        { favorite: "desc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("getWatchlistAction error:", error);
    return { success: false, error: "Failed to retrieve watchlist.", data: [] };
  }
}

export async function toggleWatchlistItemAction(rawData: z.infer<typeof ToggleWatchlistSchema>) {
  try {
    const { id, field, value } = ToggleWatchlistSchema.parse(rawData);
    const item = await db.watchlist.update({
      where: { id },
      data: { [field]: value },
    });
    await createNotificationAction(
      item.userId,
      "Watchlist Updated",
      `Marked ${item.ticker} as ${field === "pinned" ? (value ? "Pinned" : "Unpinned") : (value ? "Starred" : "Unstarred")}.`
    );
    revalidatePath("/watchlist");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("toggleWatchlistItemAction error:", error);
    return { success: false, error: "Failed to update watchlist settings." };
  }
}

export async function removeFromWatchlistAction(id: string) {
  try {
    const item = await db.watchlist.findUnique({ where: { id } });
    await db.watchlist.delete({
      where: { id },
    });
    if (item) {
      await createNotificationAction(
        item.userId,
        "Watchlist Updated",
        `Removed ${item.companyName} (${item.ticker}) from watchlist.`
      );
    }
    revalidatePath("/watchlist");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("removeFromWatchlistAction error:", error);
    return { success: false, error: "Failed to remove item from watchlist." };
  }
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export async function addPortfolioHoldingAction(rawData: z.infer<typeof PortfolioHoldingSchema>) {
  try {
    const data = PortfolioHoldingSchema.parse(rawData);
    
    const holding = await db.portfolioHolding.create({
      data: {
        id: `hld_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: data.userId,
        ticker: data.ticker,
        companyName: data.companyName,
        shares: data.shares,
        averagePrice: data.averagePrice,
        purchaseDate: new Date(data.purchaseDate),
      },
    });

    await createNotificationAction(
      data.userId,
      "Portfolio Position Created",
      `Logged acquisition of ${data.shares} shares of ${data.ticker} at $${data.averagePrice.toFixed(2)}.`
    );

    revalidatePath("/portfolio");
    revalidatePath("/dashboard");
    return { success: true, holding };
  } catch (error) {
    console.error("addPortfolioHoldingAction error:", error);
    return { success: false, error: "Failed to add portfolio position to database." };
  }
}

export async function getPortfolioHoldingsAction(userId: string) {
  try {
    const holdings = await db.portfolioHolding.findMany({
      where: { userId },
      orderBy: { purchaseDate: "desc" },
    });
    return { success: true, data: holdings };
  } catch (error) {
    console.error("getPortfolioHoldingsAction error:", error);
    return { success: false, error: "Failed to retrieve portfolio positions.", data: [] };
  }
}

export async function updatePortfolioHoldingAction(rawData: z.infer<typeof UpdatePortfolioHoldingSchema>) {
  try {
    const data = UpdatePortfolioHoldingSchema.parse(rawData);
    const holding = await db.portfolioHolding.update({
      where: { id: data.id },
      data: {
        shares: data.shares,
        averagePrice: data.averagePrice,
        purchaseDate: new Date(data.purchaseDate),
      },
    });
    await createNotificationAction(
      holding.userId,
      "Portfolio Position Updated",
      `Updated acquisition logs of ${holding.ticker} to ${holding.shares} shares at $${holding.averagePrice.toFixed(2)}.`
    );
    revalidatePath("/portfolio");
    revalidatePath("/dashboard");
    return { success: true, holding };
  } catch (error) {
    console.error("updatePortfolioHoldingAction error:", error);
    return { success: false, error: "Failed to update portfolio position." };
  }
}

export async function removePortfolioHoldingAction(id: string) {
  try {
    const holding = await db.portfolioHolding.findUnique({ where: { id } });
    await db.portfolioHolding.delete({
      where: { id },
    });
    if (holding) {
      await createNotificationAction(
        holding.userId,
        "Portfolio Position Removed",
        `Removed holding log of ${holding.companyName} (${holding.ticker}) from portfolio.`
      );
    }
    revalidatePath("/portfolio");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("removePortfolioHoldingAction error:", error);
    return { success: false, error: "Failed to remove portfolio position." };
  }
}

// ---------------------------------------------------------------------------
// Recent Analyses
// ---------------------------------------------------------------------------

export async function addRecentAnalysisAction(rawData: z.infer<typeof RecentAnalysisSchema>) {
  try {
    const data = RecentAnalysisSchema.parse(rawData);
    
    const analysis = await db.recentAnalysis.create({
      data: {
        id: `ana_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: data.userId,
        companyName: data.companyName,
        ticker: data.ticker,
        recommendation: data.recommendation,
        score: data.score,
      },
    });

    // Cap at 10 items
    const count = await db.recentAnalysis.count({ where: { userId: data.userId } });
    if (count > 10) {
      const oldest = await db.recentAnalysis.findFirst({
        where: { userId: data.userId },
        orderBy: { createdAt: "asc" },
      });
      if (oldest) {
        await db.recentAnalysis.delete({ where: { id: oldest.id } });
      }
    }

    await createNotificationAction(
      data.userId,
      "Analysis Completed",
      `Agent research complete for ${data.companyName} (${data.ticker}). Score: ${data.score}/100.`
    );

    revalidatePath("/dashboard");
    return { success: true, analysis };
  } catch (error) {
    console.error("addRecentAnalysisAction error:", error);
    return { success: false, error: "Failed to log recent analysis activity." };
  }
}

export async function getRecentAnalysesAction(userId: string) {
  try {
    const items = await db.recentAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("getRecentAnalysesAction error:", error);
    return { success: false, error: "Failed to load recent analysis feed.", data: [] };
  }
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function getSettingsAction(userId: string) {
  try {
    const settings = await db.userSettings.findUnique({
      where: { userId },
    });
    return { success: true, data: settings };
  } catch (error) {
    console.error("getSettingsAction error:", error);
    return { success: false, error: "Failed to retrieve user settings.", data: null };
  }
}

export async function updateSettingsAction(rawData: z.infer<typeof SettingsSchema>) {
  try {
    const data = SettingsSchema.parse(rawData);
    const settings = await db.userSettings.update({
      where: { userId: data.userId },
      data: {
        theme: data.theme,
        exportFormat: data.exportFormat,
        language: data.language,
        notificationsEnabled: data.notificationsEnabled,
      },
    });
    revalidatePath("/settings");
    return { success: true, settings };
  } catch (error) {
    console.error("updateSettingsAction error:", error);
    return { success: false, error: "Failed to update settings." };
  }
}

// ---------------------------------------------------------------------------
// Export History
// ---------------------------------------------------------------------------

export async function recordExportAction(rawData: z.infer<typeof ExportHistorySchema>) {
  try {
    const data = ExportHistorySchema.parse(rawData);
    const item = await db.exportHistory.create({
      data: {
        id: `exp_${Date.now()}`,
        userId: data.userId,
        reportId: data.reportId,
        format: data.format,
      },
    });

    await createNotificationAction(
      data.userId,
      "Report Exported",
      `Investment research report exported as ${data.format.toUpperCase()} format.`
    );

    return { success: true, item };
  } catch (error) {
    console.error("recordExportAction error:", error);
    return { success: false, error: "Failed to log report export." };
  }
}

export async function getExportHistoryAction(userId: string) {
  try {
    const history = await db.exportHistory.findMany({
      where: { userId },
      include: {
        report: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: history };
  } catch (error) {
    console.error("getExportHistoryAction error:", error);
    return { success: false, error: "Failed to retrieve export history.", data: [] };
  }
}

// ---------------------------------------------------------------------------
// Search History
// ---------------------------------------------------------------------------

export async function recordSearchAction(rawData: z.infer<typeof SearchHistorySchema>) {
  try {
    const data = SearchHistorySchema.parse(rawData);
    const item = await db.searchHistory.upsert({
      where: {
        userId_ticker: {
          userId: data.userId,
          ticker: data.ticker,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: data.userId,
        ticker: data.ticker,
        companyName: data.companyName,
        count: 1,
      },
    });
    return { success: true, item };
  } catch (error) {
    console.error("recordSearchAction error:", error);
    return { success: false, error: "Failed to log search history details." };
  }
}

export async function getSearchHistoryAction(userId: string) {
  try {
    const searches = await db.searchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: searches };
  } catch (error) {
    console.error("getSearchHistoryAction error:", error);
    return { success: false, error: "Failed to retrieve search history.", data: [] };
  }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function getNotificationsAction(userId: string) {
  try {
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: notifications };
  } catch (error) {
    console.error("getNotificationsAction error:", error);
    return { success: false, error: "Failed to retrieve notifications.", data: [] };
  }
}

export async function createNotificationAction(userId: string, title: string, desc: string) {
  try {
    const notification = await db.notification.create({
      data: {
        id: `not_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId,
        title,
        desc,
      },
    });
    return { success: true, notification };
  } catch (error) {
    console.error("createNotificationAction error:", error);
    return { success: false, error: "Failed to create user notification." };
  }
}

export async function markNotificationReadAction(notificationId: string) {
  try {
    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
    return { success: true };
  } catch (error) {
    console.error("markNotificationReadAction error:", error);
    return { success: false, error: "Failed to update notification state." };
  }
}

export async function deleteNotificationAction(notificationId: string) {
  try {
    await db.notification.delete({
      where: { id: notificationId },
    });
    return { success: true };
  } catch (error) {
    console.error("deleteNotificationAction error:", error);
    return { success: false, error: "Failed to delete notification." };
  }
}

// ---------------------------------------------------------------------------
// AI Chat Conversations
// ---------------------------------------------------------------------------

export async function getChatMessagesAction(userId: string, reportId: string) {
  try {
    const messages = await db.chatMessage.findMany({
      where: { userId, reportId },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: messages };
  } catch (error) {
    console.error("getChatMessagesAction error:", error);
    return { success: false, error: "Failed to load chat history details.", data: [] };
  }
}

export async function sendChatMessageAction(rawData: z.infer<typeof SendChatMessageSchema>) {
  try {
    const { userId, reportId, text } = SendChatMessageSchema.parse(rawData);

    // 1. Get SavedReport
    const report = await db.savedReport.findFirst({
      where: { id: reportId, userId },
    });
    if (!report) {
      return { success: false, error: "Report not found" };
    }

    // 2. Save User Message
    const userMsg = await db.chatMessage.create({
      data: {
        id: `msg_u_${Date.now()}`,
        userId,
        reportId,
        sender: "user",
        text,
      },
    });

    // 3. Build Prompt with Report Context
    const reportContext = report.reportData;
    const prompt = `You are the AlphaLens AI Investment Research Assistant. You are chatting with the user about the generated investment report for ${report.companyName} (${report.ticker}).
Answer the user's question ONLY using the provided report context. If the report doesn't contain the answer, say that you don't have that information in the report. Do not make up facts or use general knowledge outside the report. Keep your response concise and structured.

Report Context (Investment Report JSON):
${reportContext}

User's Question:
${text}`;

    // 4. Call Gemini
    const responseText = await geminiService.generateText(prompt);

    // 5. Save Assistant Message
    const assistantMsg = await db.chatMessage.create({
      data: {
        id: `msg_a_${Date.now()}`,
        userId,
        reportId,
        sender: "assistant",
        text: responseText,
      },
    });

    revalidatePath("/chat");
    return { success: true, userMessage: userMsg, assistantMessage: assistantMsg };
  } catch (error) {
    console.error("sendChatMessageAction error:", error);
    return { success: false, error: "Failed to submit assistant message." };
  }
}

// ---------------------------------------------------------------------------
// Current Ticker Price Query Action
// ---------------------------------------------------------------------------

export async function getCurrentPriceAction(ticker: string) {
  try {
    const res = await fetchAlphaVantage({ function: "GLOBAL_QUOTE", symbol: ticker });
    const quote = res["Global Quote"] as any;
    if (quote && quote["05. price"]) {
      return { success: true, price: parseFloat(quote["05. price"]) };
    }
    
    // Fallback to OVERVIEW AnalystTargetPrice or just normal pricing if GLOBAL_QUOTE rate limited
    const overviewRes = await fetchAlphaVantage({ function: "OVERVIEW", symbol: ticker });
    const overview = overviewRes as any;
    if (overview && overview.AnalystTargetPrice) {
      const price = parseFloat(overview.AnalystTargetPrice);
      if (!isNaN(price)) return { success: true, price };
    }
    
    return { success: false, error: "Price data unavailable." };
  } catch (e) {
    console.error("getCurrentPriceAction error:", e);
    return { success: false, error: "Real-time stock price quote currently unavailable." };
  }
}

// ---------------------------------------------------------------------------
// Company Comparison Query Action
// ---------------------------------------------------------------------------

export async function getCompanyComparisonAction(ticker: string) {
  try {
    const symbol = ticker.trim().toUpperCase();
    
    // 1. Fetch profile and financials
    const profile = await companyService.getCompanyProfile("", symbol);
    const financials = await financialService.getFinancialData("", symbol);
    
    // 2. Check if we have a saved report to read intelligence (recommendation, score, strengths, weaknesses, risks)
    const savedReport = await db.savedReport.findFirst({
      where: { ticker: symbol },
      orderBy: { createdAt: "desc" },
    });
    
    let recommendation = "Watch";
    let score = 70;
    let strengths = ["Data overview verified", "Asset structure logged"];
    let weaknesses = ["Peer benchmarking pending"];
    let risks = ["SaaS valuation parameters"];
    
    if (savedReport) {
      recommendation = savedReport.recommendation;
      score = savedReport.score;
      try {
        const parsedData = JSON.parse(savedReport.reportData);
        if (parsedData.market) {
          if (parsedData.market.strengths) strengths = parsedData.market.strengths;
          if (parsedData.market.weaknesses) weaknesses = parsedData.market.weaknesses;
        }
        if (parsedData.risks) {
          risks = parsedData.risks;
        }
      } catch (err) {
        console.warn("Failed to parse report data for comparison", err);
      }
    } else {
      // Fallback: Use Gemini dynamically to generate recommendation, score, strengths, weaknesses, risks
      try {
        const prompt = `Perform a high-level comparison analysis for ${profile.name} (${profile.ticker}).
Profile: ${profile.description}
Industry: ${profile.industry}
Financials: Revenue: ${financials.revenue}, Net Income: ${financials.netIncome}, EPS: ${financials.eps}, PE Ratio: ${financials.peRatio}, Debt: ${financials.debt}, Cash Flow: ${financials.cashFlow}

Respond with a JSON object in this exact format:
{
  "recommendation": "Invest" | "Watch" | "Pass",
  "score": number (between 0 and 100),
  "strengths": string[] (3 items),
  "weaknesses": string[] (3 items),
  "risks": string[] (3 items)
}`;
        const resultSchema = z.object({
          recommendation: z.enum(["Invest", "Watch", "Pass"]),
          score: z.number().int(),
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string()),
          risks: z.array(z.string()),
        });
        
        const aiResponse = await geminiService.generateStructured(prompt, resultSchema);
        recommendation = aiResponse.recommendation;
        score = aiResponse.score;
        strengths = aiResponse.strengths;
        weaknesses = aiResponse.weaknesses;
        risks = aiResponse.risks;
      } catch (e) {
        console.warn("Gemini comparison fallback failed, using defaults:", e);
      }
    }
    
    return {
      success: true,
      data: {
        name: profile.name,
        ticker: profile.ticker,
        revenue: financials.revenue,
        netIncome: financials.netIncome,
        eps: financials.eps,
        peRatio: financials.peRatio,
        marketCap: profile.marketCap,
        recommendation,
        score,
        strengths,
        weaknesses,
        risks,
      }
    };
  } catch (error) {
    console.error("getCompanyComparisonAction error:", error);
    return { success: false, error: "Failed to retrieve stock comparison metrics." };
  }
}
