# Prompt Templates

> **TODO [Milestone 2]**: This folder will contain all Gemini prompt templates.

## Purpose

Every LangGraph node owns exactly one prompt file.
No prompts exist inside React components, API routes, or services.
Prompt outputs are always structured JSON.

## Planned Files (from LANGGRAPH_DESIGN.md)

```
prompts/
├── planning.ts         — Validates and normalizes company name
├── company.ts          — Collects company profile and business overview
├── financial.ts        — Analyzes financial metrics and health
├── news.ts             — Summarizes recent news and impact
├── market.ts           — Evaluates competitive landscape
├── reasoning.ts        — Synthesizes evidence into investment assessment
├── recommendation.ts   — Generates final Invest/Watch/Pass decision
└── formatter.ts        — Formats structured InvestmentReport JSON
```

## Prompt Contract

Every prompt:
1. Receives structured input (subset of `GraphState`)
2. Returns structured JSON
3. Never returns Markdown
4. Never returns HTML

## Usage Pattern

```ts
// TODO [Milestone 2]: Example pattern
import { companyPrompt } from "@/prompts/company";

const result = await model.invoke(companyPrompt(companyName));
```
