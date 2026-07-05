# AlphaLens AI

## LangGraph Agent Design

Version: 2.0 (Frozen)

---

# Purpose

This document defines the architecture of the AI Investment Research Agent.

The agent is responsible for transforming a company name into a structured, explainable investment report.

The implementation uses LangGraph to orchestrate multiple reasoning steps while maintaining a shared graph state.

---

# Design Goals

The agent should:

* Gather reliable evidence.
* Analyze multiple investment dimensions.
* Produce explainable recommendations.
* Return structured JSON.
* Remain modular and extensible.

The agent should behave like a junior investment analyst rather than a chatbot.

---

# High-Level Workflow

```text
                 User
                   │
                   ▼
           Investment Agent
                   │
                   ▼
            Planning Node
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
 Company Node  Financial Node  News Node
        │          │          │
        └──────────┼──────────┘
                   ▼
          Market Analysis Node
                   ▼
      Evidence Aggregation Node
                   ▼
     Investment Reasoning Node
                   ▼
    Recommendation Generator
                   ▼
       Report Formatter Node
                   ▼
        Structured JSON Report
```

---

# Graph State

Every node reads from and writes to a shared graph state.

```ts
interface GraphState {
  companyName: string;

  companyProfile?: CompanyProfile;

  financialData?: FinancialData;

  news?: NewsItem[];

  marketAnalysis?: MarketAnalysis;

  evidence?: EvidenceSummary;

  recommendation?: Recommendation;

  report?: InvestmentReport;

  errors?: string[];
}
```

Nodes should update only the fields they own.

---

# Node Responsibilities

## 1. Planning Node

Purpose

Initialize the workflow.

Responsibilities

* Validate company name.
* Normalize input.
* Create initial graph state.

Output

Validated GraphState.

---

## 2. Company Research Node

Purpose

Understand the business.

Collect

* Company overview
* Industry
* Headquarters
* Core products
* Business model
* Major competitors

Output

CompanyProfile

---

## 3. Financial Analysis Node

Purpose

Evaluate financial strength.

Collect

* Revenue
* Net Income
* EPS
* P/E Ratio
* Debt
* Cash Flow
* Market Capitalization

Output

FinancialData

---

## 4. News Analysis Node

Purpose

Understand recent developments.

Collect

* Product launches
* Partnerships
* Acquisitions
* Regulatory events
* Legal issues
* Significant announcements

Output

NewsItem[]

---

## 5. Market Analysis Node

Purpose

Evaluate competitive position.

Analyze

* Industry trends
* Market growth
* Competitive landscape
* Business strengths
* Business weaknesses

Output

MarketAnalysis

---

## 6. Evidence Aggregation Node

Purpose

Combine research results into one structured evidence object.

Responsibilities

* Remove duplicate findings.
* Group related facts.
* Separate facts from interpretations.
* Prepare context for reasoning.

Output

EvidenceSummary

---

## 7. Investment Reasoning Node

Purpose

Generate an investment assessment using all collected evidence.

Evaluate

* Business quality
* Financial health
* Market position
* Growth opportunities
* Risks

Output

ReasoningResult

---

## 8. Recommendation Generator

Purpose

Produce the final recommendation.

Possible values

* Invest
* Watch
* Pass

Also generate

* Investment Score
* Confidence
* Key Positives
* Key Risks
* Investment Thesis

Output

Recommendation

---

## 9. Report Formatter Node

Purpose

Convert graph state into frontend-ready JSON.

Responsibilities

* Build the InvestmentReport object.
* Ensure consistent structure.
* Remove internal-only fields.

Output

InvestmentReport

---

# Prompt Strategy

Every node owns exactly one prompt.

Directory

```text
prompts/
├── planning.ts
├── company.ts
├── financial.ts
├── news.ts
├── market.ts
├── reasoning.ts
├── recommendation.ts
└── formatter.ts
```

Rules

* One prompt per file.
* No inline prompts.
* Prompts return structured data only.

---

# Tool Design

Each node may use one or more tools.

## Company Tool

Input

Company name.

Returns

Company profile.

---

## Financial Tool

Input

Company name.

Returns

Financial metrics.

---

## News Tool

Input

Company name.

Returns

Recent news.

---

## Market Tool

Input

Company name.

Returns

Market intelligence.

---

# Recommendation Framework

The recommendation should consider multiple dimensions rather than relying on a single metric.

Suggested evaluation areas

| Dimension           | Relative Importance |
| ------------------- | ------------------- |
| Business Quality    | High                |
| Financial Health    | High                |
| Market Position     | Medium              |
| Growth Potential    | High                |
| Risk Profile        | High                |
| Recent Developments | Medium              |

These are guidance signals for reasoning rather than fixed mathematical weights.

---

# Report Structure

Every completed report must contain

* Company Overview
* Financial Health
* Market Position
* Recent News
* Risks
* Growth Opportunities
* Investment Recommendation
* Investment Score
* Confidence
* Investment Thesis
* Sources

No Markdown.

No HTML.

Structured JSON only.

---

# Error Handling

Every node returns either a successful update to the graph state or a structured error.

Example

```ts
{
  success: false,
  node: "FinancialAnalysis",
  error: "Financial data unavailable."
}
```

Critical failures stop the graph gracefully.

Non-critical failures may continue with partial information.

---

# Extensibility

Future nodes can be added without changing the existing workflow.

Examples

* SEC Filing Analysis
* Earnings Call Analysis
* Analyst Consensus
* Insider Trading
* ESG Analysis
* Portfolio Advisor

---

# Engineering Principles

Each node has exactly one responsibility.

Nodes communicate only through GraphState.

Prompt files remain independent.

Tools remain reusable.

Reasoning should always be explainable.

The frontend should never know how the agent reaches its conclusions.

The LangGraph implementation should remain modular, testable, and easy to extend.
