# AlphaLens AI

### AI-Powered Investment Research Workspace

Version: 1.0

---

# 1. Product Vision

AlphaLens AI is an AI-powered investment research workspace that helps users analyze publicly listed companies and generates a structured investment recommendation.

Instead of acting like a chatbot, AlphaLens behaves like a junior equity research analyst. It gathers information, analyzes multiple aspects of the business, evaluates risks and opportunities, and produces a professional investment report.

The objective is not to predict stock prices but to demonstrate transparent, explainable AI reasoning.

---

# 2. Assignment Goal

Build an AI Investment Research Agent using:

* Next.js
* LangChain.js
* LangGraph.js
* Gemini
* Modern React UI

The application should:

* Accept a company name.
* Research the company.
* Analyze multiple investment factors.
* Decide:

  * Invest
  * Watch
  * Pass
* Explain the reasoning behind the decision.
* Present the result in a professional dashboard.

---

# 3. Product Principles

The application should feel like a SaaS product, not an AI demo.

Priorities:

1. Excellent AI workflow
2. Clean architecture
3. Beautiful UI
4. Explainable outputs
5. Maintainable code

---

# 4. Target Users

Primary:

* Students
* Beginner Investors
* Recruiters evaluating AI products

Secondary:

* Analysts
* Startup founders

---

# 5. Core Features

## Authentication

Google Sign-In.

Simple.

No roles.

---

## Dashboard

Professional dashboard.

Displays:

* New Analysis
* Previous Analyses
* User Profile

---

## Company Search

Single search box.

Example:

Analyze Apple

Analyze NVIDIA

Analyze Reliance Industries

---

## AI Research

Research:

* Company overview
* Business model
* Industry
* Competitors
* Financial health
* Recent news
* Risks
* Growth opportunities

---

## Recommendation Engine

Possible outputs:

* Invest
* Watch
* Pass

Each recommendation includes reasoning.

---

## Report History

Every completed report is stored.

User can reopen old analyses.

---

## Export

Export report as PDF.

---

# 6. Investment Intelligence Pipeline

The application internally uses LangGraph.

Pipeline:

START

↓

Company Research

↓

Financial Analysis

↓

News Analysis

↓

Risk Analysis

↓

Growth Opportunity Analysis

↓

Decision Engine

↓

Report Formatter

↓

END

Each node has one responsibility.

---

# 7. LangGraph Node Responsibilities

## Company Research

Collect:

* Company description
* Industry
* Headquarters
* Products
* Market position

Output:

Structured JSON.

---

## Financial Analysis

Analyze:

* Revenue trend
* Profitability
* Debt
* Cash position
* Market Cap
* P/E
* EPS

Output:

Financial summary.

---

## News Analysis

Research:

* Recent news
* Product launches
* Acquisitions
* Partnerships
* Legal issues

Summarize impact.

---

## Risk Analysis

Evaluate:

* Competition
* Regulation
* Market risks
* Valuation concerns
* Debt

Return:

Risk level

High

Medium

Low

---

## Growth Analysis

Analyze:

* Expansion
* AI adoption
* Market demand
* Innovation
* Future opportunities

---

## Decision Engine

Input:

All previous node outputs.

Output:

Recommendation

Investment Score

Confidence

Investment Thesis

---

## Report Formatter

Creates structured JSON consumed by the frontend.

No markdown.

No HTML.

Only structured objects.

---

# 8. AI Workflow

User enters company.

↓

Backend receives request.

↓

LangGraph executes nodes.

↓

Gemini reasons over collected information.

↓

Structured report generated.

↓

Frontend renders dashboard.

---

# 9. Frontend Pages

Landing

Dashboard

Analysis

History

Profile

404

---

# 10. Dashboard Layout

Header

Search Bar

Quick Stats

Recent Analyses

Investment Report

Footer

---

# 11. Investment Report Sections

Company Overview

Financial Health

Business Strengths

Risks

Growth Opportunities

Recent News

Investment Score

Recommendation

Confidence

Sources

---

# 12. Recommendation System

Investment Score:

0–100

Recommendation Rules:

80–100

Invest

60–79

Watch

Below 60

Pass

Confidence:

0–100%

---

# 13. Folder Structure

src/

app/

components/

hooks/

lib/

langgraph/

nodes/

prompts/

services/

types/

utils/

styles/

docs/

---

# 14. Component Tree

Navbar

Sidebar

SearchBar

LoadingPipeline

ReportCard

MetricCard

RiskCard

OpportunityCard

RecommendationCard

HistoryCard

Footer

---

# 15. API Routes

POST /api/analyze

Runs LangGraph.

Returns report.

GET /api/history

Returns user history.

GET /api/report/:id

Returns previous report.

---

# 16. Database

Tables

User

Analysis

Analysis stores:

Company Name

Report JSON

Recommendation

Score

Confidence

Created At

No additional tables.

---

# 17. UI Theme

Premium SaaS.

Minimal.

Dark-first.

Accent:

Emerald

White

Slate

Rounded cards.

Soft shadows.

Large spacing.

No clutter.

---

# 18. Loading Experience

Instead of spinner:

✓ Researching company

✓ Reading financial data

✓ Analyzing recent news

✓ Evaluating risks

✓ Identifying opportunities

✓ Generating investment thesis

✓ Preparing report

---

# 19. Error Handling

Company not found

API unavailable

Rate limit exceeded

Network error

Invalid company

Each has friendly UI.

---

# 20. Prompt Strategy

Every prompt lives inside:

src/prompts

No inline prompts.

Each prompt has one responsibility.

Examples:

companyResearch.ts

financialAnalysis.ts

riskAnalysis.ts

decision.ts

reportFormatter.ts

---

# 21. Coding Standards

TypeScript only.

No "any".

Reusable components.

No duplicated logic.

Business logic never inside UI components.

Environment variables only.

Meaningful naming.

Small functions.

---

# 22. State Management

React state.

Server Components where appropriate.

No Redux.

Avoid unnecessary Context providers.

---

# 23. Future Improvements

Portfolio Tracking

Watchlists

Company Comparison

Email Reports

Scheduled Reanalysis

Investment Alerts

Analyst Consensus

SEC Filing Analysis

Earnings Call Analysis

---

# 24. Definition of Done

Project is complete when:

✓ User logs in

✓ Searches company

✓ LangGraph executes

✓ AI generates recommendation

✓ Dashboard renders report

✓ Report is saved

✓ User can reopen history

✓ Export works

✓ Responsive UI

✓ Deployed on Vercel

✓ README completed

✓ AI prompt log included

---

# 25. Engineering Philosophy

The application should prioritize:

Correctness over complexity.

Explainability over magic.

Maintainability over shortcuts.

Product quality over feature quantity.

Every engineering decision should make the product easier to understand, easier to extend, and easier to explain during technical interviews.