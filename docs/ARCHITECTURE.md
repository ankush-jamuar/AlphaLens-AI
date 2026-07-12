# AlphaLens AI Architecture

## Overview

AlphaLens AI follows a modular, agent-based architecture built on LangGraph. Instead of relying on a single AI prompt, the system decomposes investment analysis into independent research stages.

Each stage has a clearly defined responsibility and contributes structured evidence to the final investment recommendation.

The architecture is designed to maximize explainability, modularity, and maintainability while minimizing AI hallucinations.

---

# High-Level Architecture

```
                     ┌───────────────────────────┐
                     │        Web Client         │
                     │   Next.js + React UI      │
                     └─────────────┬─────────────┘
                                   │
                                   ▼
                    Next.js App Router API
                           /api/analyze
                                   │
                                   ▼
                       LangGraph Workflow Engine
                                   │
         ┌───────────────┬───────────────┬───────────────┐
         │               │               │
         ▼               ▼               ▼
 Company Service   Financial Service   News Service
         │               │               │
         │               │               │
 Alpha Vantage    Alpha Vantage       GNews API
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
               Market Assessment Node
                         │
                         ▼
               Evidence Aggregation Node
                         │
                         ▼
             Gemini Investment Reasoning
                         │
                         ▼
                 Report Formatter Node
                         │
                         ▼
                Structured Investment Report
```

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

---

## Backend

- Next.js App Router
- LangGraph
- LangChain
- Prisma ORM
- Neon PostgreSQL

---

## Authentication

- Clerk

---

## AI

- Gemini 2.5 Flash
- LangGraph

---

## External APIs

- Alpha Vantage
- GNews

---

# Request Lifecycle

A typical investment analysis follows the workflow below.

```
User enters company name
            │
            ▼
Planning Node
            │
            ▼
Resolve company ticker
            │
            ▼
Run research nodes in parallel

├── Company Profile
├── Financial Statements
└── News Collection

            │
            ▼
Market Assessment
            │
            ▼
Evidence Aggregation
            │
            ▼
Gemini Investment Reasoning
            │
            ▼
Report Formatting
            │
            ▼
Return structured report
```

---

# LangGraph Workflow

## 1. Planning Node

Responsibilities

- Normalize user input
- Resolve company ticker
- Validate request
- Initialize graph state

Output

```
{
  company,
  ticker
}
```

---

## 2. Company Research Node

Responsibilities

- Retrieve company overview
- Industry
- Headquarters
- Description
- Market capitalization

Data Source

Alpha Vantage

---

## 3. Financial Analysis Node

Responsibilities

Retrieve

- Revenue
- Net Income
- EPS
- Cash Flow
- Debt
- PE Ratio

Data Source

Alpha Vantage

---

## 4. News Analysis Node

Responsibilities

- Retrieve recent news
- Extract summaries
- Classify sentiment
- Preserve publication dates

Data Source

GNews

---

## 5. Market Assessment Node

Responsibilities

Uses deterministic business rules to estimate

- Competitors
- Strengths
- Weaknesses
- Market position

No LLM is used in this stage.

---

## 6. Evidence Aggregation Node

Responsibilities

Merge outputs from

- Company
- Financials
- News
- Market

into one structured evidence object.

---

## 7. Investment Reasoning Node

This is the **only node** that invokes Gemini.

Responsibilities

Generate

- Investment Thesis
- Recommendation
- Confidence
- Score
- Risks
- Opportunities
- Positives
- Negatives

using the collected evidence.

---

## 8. Report Formatter Node

Transforms graph state into the final

```
InvestmentReport
```

returned to the frontend.

---

# Database Architecture

Prisma ORM manages all persistence.

Main entities include:

- User
- SavedReport
- Watchlist
- PortfolioHolding
- RecentAnalysis
- FavoriteCompany
- ExportHistory
- Notifications
- SearchHistory
- ChatMessages
- UserSettings

---

# Authentication Flow

Authentication is managed by Clerk.

```
Visitor
    │
    ▼
Landing Page

Sign In / Sign Up

    │
    ▼
Clerk Authentication

    │
    ▼
Protected Routes

/analyze
/dashboard
/watchlist
/reports
/chat
/settings
```

---

# Report Generation Pipeline

```
User Request

↓

Planning

↓

Company Research

↓

Financial Analysis

↓

News Analysis

↓

Market Assessment

↓

Evidence Aggregation

↓

Gemini Reasoning

↓

Formatter

↓

Investment Report
```

---

# Error Handling Strategy

The platform implements graceful degradation.

If one external API fails:

- Available evidence is preserved
- Remaining nodes continue execution
- The report indicates unavailable data
- The graph does not terminate unexpectedly

---

# Design Decisions

## Why LangGraph?

LangGraph provides deterministic orchestration, allowing each research stage to be isolated and independently tested.

---

## Why Gemini?

Gemini is reserved exclusively for investment reasoning to reduce hallucinations and API usage.

---

## Why Alpha Vantage?

Provides structured financial statements and company metadata.

---

## Why GNews?

Provides recent company-related news for contextual investment analysis.

---

## Why Prisma + Neon?

Type-safe database access with managed PostgreSQL infrastructure suitable for production deployment.

---

# Scalability

The architecture is designed to support future additions such as:

- SEC Filing Analysis
- Earnings Call Analysis
- RAG over Financial Documents
- Multi-model AI Routing
- Portfolio Optimization
- Real-time Market Data
- Scheduled Investment Alerts
- AI Memory
- Multi-user Collaboration

These features can be implemented as additional LangGraph nodes without requiring changes to the existing workflow.

---

# Conclusion

AlphaLens AI follows a modular, evidence-driven architecture that combines deterministic software engineering with AI reasoning. By separating data collection, analysis, and reasoning into dedicated stages, the platform produces explainable investment reports while remaining scalable, maintainable, and suitable for future enhancements.