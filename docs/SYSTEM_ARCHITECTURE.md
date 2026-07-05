# AlphaLens AI

## System Architecture

Version 1.0

---

# Purpose

This document defines the software architecture for AlphaLens AI.

The goal is to ensure every implementation follows the same architecture, folder responsibilities, rendering strategy, and data flow.

This document is the architectural source of truth.

---

# High-Level Architecture

```
                User
                  │
                  ▼
        Next.js Frontend
                  │
                  ▼
         API Route (/analyze)
                  │
                  ▼
      Investment Intelligence Pipeline
            (LangGraph Agent)
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
 Company Tool  Finance Tool News Tool
        └─────────┼─────────┘
                  ▼
          Gemini Reasoning
                  │
                  ▼
       Structured Investment Report
                  │
                  ▼
            React Dashboard
                  │
                  ▼
        Local History (localStorage)
```

---

# Architecture Layers

The application is divided into six layers.

## 1. Presentation Layer

Responsible for:

* UI
* User interaction
* Rendering reports
* Loading states
* Error states

Contains:

```
app/

components/

styles/
```

No business logic.

---

## 2. API Layer

Responsible for:

* Receiving requests

* Validation

* Starting LangGraph

* Returning structured report

Contains:

```
app/api
```

No UI.

No prompt logic.

---

## 3. AI Layer

Responsible for:

* LangGraph

* Agent

* Node execution

* Prompt orchestration

Contains:

```
langgraph/

nodes/

prompts/
```

No UI.

---

## 4. Service Layer

Responsible for:

External APIs.

Examples

Company Search

Financial API

News API

Contains

```
services/
```

Every external integration lives here.

---

## 5. Utility Layer

Contains

Formatting

Validation

Helpers

Constants

Date formatting

Score calculations

Contains

```
utils/

lib/
```

---

## 6. Storage Layer

Browser only.

Uses

```
localStorage
```

Stores

Recent analyses.

No database.

---

# Folder Responsibilities

## app/

Pages.

Routing.

API routes.

No reusable business logic.

---

## components/

Reusable UI only.

Every component should have one responsibility.

---

## langgraph/

Creates graph.

Defines graph state.

Connects nodes.

---

## nodes/

Each file represents one AI capability.

Example

```
companyResearch.ts

financialAnalysis.ts

newsAnalysis.ts

riskAnalysis.ts

growthAnalysis.ts

decision.ts

formatter.ts
```

---

## prompts/

Prompt templates only.

No API calls.

No business logic.

---

## services/

Every API wrapper.

Example

```
financial.service.ts

company.service.ts

news.service.ts
```

---

## hooks/

Reusable React hooks.

Example

```
useAnalysis.ts

useLocalHistory.ts

useTheme.ts
```

---

## types/

Shared interfaces.

Used across frontend and backend.

---

## utils/

Pure utility functions.

---

# Rendering Strategy

Use Server Components by default.

Use Client Components only when:

* user interaction

* animations

* localStorage

* hooks

Everything else remains Server Components.

---

# Data Flow

```
User

↓

Search Company

↓

POST /api/analyze

↓

Validate Input

↓

Run LangGraph

↓

Research Company

↓

Collect Financial Data

↓

Collect News

↓

Risk Analysis

↓

Growth Analysis

↓

Gemini Decision

↓

Structured Report

↓

Return JSON

↓

Dashboard renders report

↓

Save report locally
```

---

# Component Communication

```
Dashboard

│

├── SearchBar

├── ProgressTimeline

├── Report

│      ├── Summary

│      ├── Financials

│      ├── Risks

│      ├── Opportunities

│      ├── News

│      └── Recommendation

└── HistorySidebar
```

Communication always flows downward.

No sibling communication.

---

# State Management

React state.

Custom hooks.

No Redux.

No Zustand.

No unnecessary Context Providers.

---

# History Strategy

Every completed report is stored locally.

Fields

Company

Timestamp

Recommendation

Score

Complete JSON report

Maximum

20 reports.

Oldest reports automatically removed.

---

# Error Flow

API Error

↓

Catch

↓

Return structured error

↓

UI renders friendly message

Never expose stack traces.

---

# Prompt Flow

Prompt files are independent.

Each prompt has one responsibility.

Nodes load prompt.

Prompt receives structured input.

Prompt returns structured JSON.

---

# Report Format

Every report must contain

Company

Overview

Financial Health

News

Risks

Growth

Recommendation

Investment Score

Confidence

Investment Thesis

Sources

---

# Performance

Lazy load heavy sections.

Memoize expensive components.

Avoid unnecessary renders.

Minimize API calls.

---

# Security

Never expose API keys.

Validate all inputs.

Sanitize company names.

Limit request size.

---

# Logging

Development

Console logging.

Production

Minimal logging.

No sensitive information.

---

# Deployment

Platform

Vercel

Environment Variables

Gemini API Key

Financial API Key

Search API Key (if required)

---

# Engineering Principles

Every module should have a single responsibility.

Dependencies should always point downward.

UI should never know how AI works.

AI should never know how UI works.

Services should never know about React.

Prompt files should contain only prompts.

Every layer should be independently replaceable.

The architecture should remain modular, scalable, and easy to explain during technical interviews.
