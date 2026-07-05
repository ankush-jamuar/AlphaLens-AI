# AlphaLens AI

### AI-Powered Investment Research Workspace

Version: 2.0 (Frozen Architecture)

---

# 1. Overview

AlphaLens AI is an AI-powered investment research workspace that helps users analyze publicly listed companies and generates an explainable investment recommendation.

The application is designed to demonstrate modern AI engineering using LangChain.js and LangGraph.js while maintaining a clean, production-ready software architecture.

The primary goal is **not** to predict stock prices.

The primary goal is to research a company, synthesize reliable evidence, evaluate investment factors, and produce a transparent recommendation.

---

# 2. Assignment Goal

Build an AI Investment Research Agent using:

* Next.js
* TypeScript
* LangChain.js
* LangGraph.js
* Gemini
* Modern React UI

The application accepts a company name and returns:

* Company Overview
* Financial Analysis
* Market Position
* Recent News
* Risks
* Opportunities
* Investment Score
* Confidence Score
* Investment Recommendation
* Investment Thesis
* Sources

---

# 3. Product Vision

AlphaLens AI should feel like a professional AI workspace rather than an AI chatbot.

The interface should communicate:

* Trust
* Clarity
* Speed
* Professionalism
* Explainability

The AI should behave like a junior equity research analyst instead of simply answering prompts.

---

# 4. Core Principles

The project prioritizes:

1. AI Engineering
2. Explainability
3. Product Design
4. Clean Architecture
5. Maintainability

The project intentionally avoids unnecessary complexity that does not improve the AI workflow.

---

# 5. Architecture Decisions

## Authentication

No authentication.

Reason:

Authentication is outside the scope of the assignment and does not improve the investment research workflow.

---

## Database

No database.

Reason:

Every company analysis is independent.

Persistent backend storage is unnecessary for the MVP.

---

## History

History is stored using browser localStorage.

Reason:

Users can reopen previous analyses without introducing unnecessary backend complexity.

Maximum stored reports:

20

Old reports are automatically removed.

---

## Theme

Dark-first only.

No light mode.

No theme toggle.

Reason:

Maintains a consistent premium experience while reducing unnecessary UI complexity.

---

# 6. User Journey

User opens AlphaLens AI.

↓

Investment Workspace opens immediately.

↓

User enters company name.

↓

User clicks Analyze.

↓

Investment Agent researches the company.

↓

AI generates report.

↓

Report appears inside workspace.

↓

Report is automatically stored in local history.

↓

User may reopen previous reports from the sidebar.

---

# 7. Application Pages

Only the following routes exist.

## /

Investment Workspace

Primary application interface.

Contains:

* Search
* Progress
* Report
* History Sidebar

---

## 404

Custom Not Found page.

---

No additional pages exist in Version 1.

---

# 8. Main Workspace Layout

The workspace contains four major areas.

1. Navbar

2. Sidebar

3. Search Workspace

4. Investment Report

---

# 9. Navbar

Displays:

* AlphaLens AI Logo
* GitHub Link

No profile.

No authentication controls.

No theme switch.

---

# 10. Sidebar

Displays:

* New Analysis
* Recent Analyses

The sidebar is collapsible on desktop.

On mobile it becomes a slide-out drawer.

Selecting a previous analysis immediately loads that report.

---

# 11. Search Workspace

Contains:

Large search input.

Analyze button.

Suggested companies.

Examples:

* Apple
* Microsoft
* NVIDIA
* Amazon
* Reliance Industries
* Tata Consultancy Services

---

# 12. Analysis Progress

Instead of a spinner, AlphaLens displays meaningful progress.

Example:

✓ Understanding company

✓ Collecting financial information

✓ Reading recent news

✓ Evaluating market position

✓ Assessing investment risks

✓ Building investment thesis

✓ Preparing final report

These steps will later map directly to LangGraph node execution.

---

# 13. Investment Report

The report contains the following sections.

## Company Overview

* Name
* Industry
* Headquarters
* Description
* Market Cap

---

## Financial Health

* Revenue
* Net Income
* EPS
* PE Ratio
* Debt
* Cash Flow

---

## Market Position

* Competitors
* Strengths
* Weaknesses

---

## Recent News

Recent developments with impact labels.

Positive

Neutral

Negative

---

## Risks

Business risks.

Regulatory risks.

Competitive risks.

Financial risks.

---

## Growth Opportunities

Expansion

Innovation

Industry Trends

Emerging Opportunities

---

## Recommendation

Displays:

Investment Score

Recommendation

Confidence

Investment Thesis

Key Positives

Key Risks

---

## Sources

Every report displays the sources used for analysis.

---

# 14. Recommendation Categories

Three possible recommendations exist.

Invest

Watch

Pass

Investment Score

0–100

Confidence

0–100%

---

# 15. Technology Stack

Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

Backend

* Next.js Route Handlers

AI

* LangChain.js
* LangGraph.js
* Gemini

Storage

* Browser localStorage

Deployment

* Vercel

---

# 16. AI Workflow

The LangGraph agent performs:

1. Company Research

2. Financial Analysis

3. News Analysis

4. Market Analysis

5. Evidence Aggregation

6. Investment Reasoning

7. Recommendation Generation

8. Report Formatting

The frontend never interacts directly with the AI workflow.

It only consumes the structured report returned by the backend.

---

# 17. Non-Functional Requirements

The application must be:

* Responsive
* Accessible
* Modular
* Maintainable
* Explainable
* Production-ready

Every component should have a single responsibility.

Business logic must remain separate from presentation.

---

# 18. Constraints

The project intentionally uses:

* Free APIs
* No paid services
* No authentication
* No database

These decisions keep the implementation focused on AI engineering and ensure the project is easy to run, deploy, and explain during technical interviews.

---

# 19. Future Improvements

Potential future features include:

* User accounts
* Cloud synchronization
* Portfolio tracking
* Company comparison
* Watchlists
* Scheduled re-analysis
* Email reports
* Analyst consensus
* SEC filing analysis
* Earnings call analysis

These features are intentionally excluded from Version 1.

---

# 20. Definition of Done

AlphaLens AI is complete when:

* Users can analyze a public company.
* The AI agent researches the company using external information.
* A structured investment report is generated.
* Reports include recommendation, confidence, risks, opportunities, and sources.
* Previous analyses are available through local history.
* Reports can be exported.
* The application is responsive.
* The application is deployed successfully.
* Documentation is complete.
* Every architectural decision can be explained confidently during a technical interview.
