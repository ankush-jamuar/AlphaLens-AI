# AlphaLens AI

## LangGraph & Agent Design

Version: 1.0

---

# Purpose

This document defines the AI architecture for AlphaLens AI.

The goal is to build a real AI Investment Research Agent using LangGraph rather than a single LLM prompt.

The AI should gather evidence, reason over it, and produce an explainable investment recommendation.

---

# Design Philosophy

The AI should behave like a junior investment analyst.

It should not invent facts.

It should collect evidence using tools, synthesize findings, evaluate risks, and generate a structured investment thesis.

The reasoning process should be modular and extensible.

---

# High-Level Flow

```text
User
    │
    ▼
Investment Agent
    │
    ▼
Planning Node
    │
    ├────────────┬───────────────┬──────────────┐
    ▼            ▼               ▼              ▼
Company Tool  Financial Tool   News Tool   Market Tool
    └────────────┴───────────────┴──────────────┘
                    ▼
           Evidence Aggregator
                    ▼
          Investment Reasoning
                    ▼
         Recommendation Generator
                    ▼
           Report Formatter
                    ▼
              Structured JSON
```

---

# Graph State

The graph state is the shared memory between nodes.

```ts
interface GraphState {
  companyName: string;

  companyProfile?: CompanyProfile;

  financialData?: FinancialData;

  news?: NewsItem[];

  marketData?: MarketData;

  evidence?: Evidence;

  recommendation?: Recommendation;

  report?: InvestmentReport;

  errors?: string[];
}
```

Every node reads from and writes to the graph state.

No node should mutate unrelated properties.

---

# Node Responsibilities

## Planning Node

Purpose

Initialize the graph.

Responsibilities

* Validate company name.
* Normalize company name.
* Prepare initial graph state.

Input

companyName

Output

Validated graph state.

---

## Company Research Node

Purpose

Understand the company.

Collect

* Business overview
* Industry
* Headquarters
* Products
* Market position
* Competitors

Returns

CompanyProfile

---

## Financial Analysis Node

Purpose

Evaluate financial strength.

Collect

* Revenue
* Profit
* Net Income
* EPS
* Market Cap
* PE Ratio
* Debt
* Cash Flow

Return

FinancialData

---

## News Analysis Node

Purpose

Understand recent developments.

Collect

* Latest news
* Product launches
* Mergers
* Acquisitions
* Partnerships
* Lawsuits
* Regulatory updates

Return

News[]

---

## Market Intelligence Node

Purpose

Understand market positioning.

Collect

* Industry trends
* Growth outlook
* Market share
* Competitive landscape

Return

MarketData

---

## Evidence Aggregator Node

Purpose

Combine outputs from all research nodes.

Responsibilities

* Remove duplicate information.
* Group related findings.
* Separate facts from assumptions.
* Build structured evidence.

Return

Evidence

---

## Investment Reasoning Node

Purpose

Perform the investment analysis.

The LLM should evaluate

* Business quality
* Financial strength
* Competitive advantage
* Growth opportunities
* Risks
* Valuation

Return

Recommendation draft.

---

## Recommendation Generator

Purpose

Generate final decision.

Possible outputs

* Invest
* Watch
* Pass

Also generate

* Investment score
* Confidence score
* Key positives
* Key risks
* Investment thesis

---

## Report Formatter

Purpose

Convert graph state into frontend-ready JSON.

No markdown.

No HTML.

Only structured JSON.

---

# Tool Design

The agent uses specialized tools.

---

## Company Tool

Input

Company Name

Output

Company Profile

---

## Financial Tool

Input

Company Name

Output

Financial Metrics

---

## News Tool

Input

Company Name

Output

Recent News

---

## Market Tool

Input

Company Name

Output

Industry Intelligence

---

# Prompt Strategy

Each node owns one prompt.

Example

```text
prompts/
    planning.ts
    company.ts
    financial.ts
    news.ts
    market.ts
    reasoning.ts
    recommendation.ts
    formatter.ts
```

Never combine prompts.

Each prompt has one responsibility.

---

# Recommendation Logic

The LLM should not make random decisions.

It should evaluate multiple dimensions.

Suggested weighting

Business Quality → 20%

Financial Health → 25%

Growth Potential → 20%

Risk Level → 20%

Recent Developments → 15%

These weights guide the reasoning process but do not require deterministic scoring.

---

# Report Structure

The final report should contain

* Company Summary
* Industry
* Financial Analysis
* Market Position
* Recent News
* Opportunities
* Risks
* Investment Score
* Confidence
* Recommendation
* Investment Thesis
* Sources

---

# Error Handling

Every node returns structured errors.

Example

```ts
{
  success: false,
  node: "Financial Analysis",
  error: "Unable to fetch financial data."
}
```

The graph should stop gracefully if a critical node fails.

---

# Extensibility

Future tools can be added without changing existing nodes.

Examples

* SEC Filing Tool
* Earnings Call Tool
* Analyst Ratings Tool
* ESG Analysis Tool
* Insider Trading Tool
* Portfolio Analysis Tool

---

# Engineering Principles

Every node has a single responsibility.

Nodes communicate only through the graph state.

Prompts are independent.

Tools are reusable.

The agent should explain every recommendation.

The frontend should never know how the reasoning process works.

The LangGraph implementation should remain modular, testable, and easy to extend.
