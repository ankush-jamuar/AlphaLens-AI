# LangGraph Nodes

> **TODO [Milestone 2]**: This folder will contain all individual LangGraph node implementations.

## Purpose

Each file represents one AI capability.
Each node has exactly one responsibility.
Nodes communicate only through the shared GraphState.

## Planned Files (from LANGGRAPH_DESIGN.md)

```
nodes/
├── companyResearch.ts      — Company Tool: profile, industry, business model
├── financialAnalysis.ts    — Financial Tool: revenue, EPS, P/E, debt
├── newsAnalysis.ts         — News Tool: recent developments, product launches
├── marketAnalysis.ts       — Market Tool: competitive landscape, industry trends
├── evidenceAggregation.ts  — Aggregates all node outputs into EvidenceSummary
├── investmentReasoning.ts  — Gemini reasoning over collected evidence
├── recommendation.ts       — Generates Invest/Watch/Pass decision + thesis
└── reportFormatter.ts      — Formats final InvestmentReport object
```

## Node Contract

Every node:
1. Receives the current `GraphState`
2. Performs one responsibility
3. Returns a partial update to `GraphState`
4. Never modifies unrelated fields

## Error Handling

Every node returns either:
- A successful `GraphState` update, or
- `{ success: false, node: "NodeName", error: "reason" }`

Critical failures stop the graph gracefully.
Non-critical failures may continue with partial information.
