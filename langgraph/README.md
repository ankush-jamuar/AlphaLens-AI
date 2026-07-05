# LangGraph Investment Agent

> **TODO [Milestone 2]**: This folder will contain the LangGraph graph construction.

## Purpose

This directory contains the LangGraph Investment Intelligence Pipeline.

Responsible for:
- Graph definition (`graph.ts`)
- Graph state interface
- Node connections and execution order

## Planned Architecture (from LANGGRAPH_DESIGN.md)

```
Planning Node
     │
     ├── Company Research Node
     ├── Financial Analysis Node
     └── News Analysis Node
               │
          Market Analysis Node
               │
        Evidence Aggregation Node
               │
       Investment Reasoning Node
               │
      Recommendation Generator
               │
       Report Formatter Node
               │
        Structured JSON Report
```

## Files to Create in Milestone 2

- `graph.ts` — Graph construction and state definition
- `state.ts` — GraphState type and channel definitions

## Integration Point

The graph will be invoked from `app/api/analyze/route.ts`:

```ts
// TODO [Milestone 2]: Replace this stub
const report = await runInvestmentAgent(companyName);
```
