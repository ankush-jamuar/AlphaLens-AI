# Key Design Decisions & Trade-offs

## Overview

Throughout the development of AlphaLens AI, several architectural and engineering decisions were made to balance functionality, reliability, scalability, and development time.

This document explains the major decisions, why they were chosen, the alternatives considered, and the trade-offs involved.

---

# 1. Agent-Based Architecture using LangGraph

## Decision

Instead of implementing a single prompt that directly generates an investment recommendation, the application uses a multi-stage LangGraph workflow.

```
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

Investment Reasoning

↓

Report Formatter
```

## Why?

Breaking the workflow into independent stages improves:

- Explainability
- Maintainability
- Debugging
- Extensibility

Each node has a single responsibility and can be improved independently.

## Alternative

Single Prompt

```
User

↓

LLM

↓

Recommendation
```

## Trade-off

Advantages

- Better modularity
- Easier testing
- Lower hallucination risk

Disadvantages

- More code
- More orchestration logic
- Higher implementation complexity

---

# 2. Gemini Used Only for Investment Reasoning

## Decision

Gemini is intentionally used only after collecting all available evidence.

The LLM is responsible for:

- Investment Thesis
- Recommendation
- Confidence
- Risk Analysis
- Opportunities

It is **not** used for retrieving financial data or company information.

## Why?

LLMs are excellent at reasoning but should not be treated as a source of factual financial data.

Using APIs first helps ground the AI response.

## Trade-off

Advantages

- More reliable outputs
- Reduced hallucinations
- Lower API usage

Disadvantages

- Slightly more backend complexity

---

# 3. External APIs for Structured Data

## Decision

Company profiles and financial metrics are retrieved using Alpha Vantage, while recent news is collected using GNews.

## Why?

These APIs provide structured, machine-readable information that is more reliable than generating factual data directly through an LLM.

## Trade-off

Advantages

- Real-world data
- Consistent structure
- Easier validation

Disadvantages

- Free-tier rate limits
- Occasional missing data
- Dependence on third-party services

---

# 4. Deterministic Market Assessment

## Decision

The Market Assessment stage is implemented using TypeScript business rules rather than another AI call.

## Why?

Competitor identification, strengths, and weaknesses can often be inferred from available company metadata and financial indicators.

Keeping this stage deterministic reduces unnecessary AI usage.

## Trade-off

Advantages

- Faster execution
- Lower API cost
- Predictable behavior

Disadvantages

- Less flexible than AI-generated analysis

---

# 5. Server-Side Processing

## Decision

All AI orchestration and external API communication occur on the server.

The client only initiates analysis requests and renders streamed progress updates.

## Why?

This protects API keys and keeps business logic secure.

## Trade-off

Advantages

- Improved security
- Centralized logic
- Easier maintenance

Disadvantages

- Increased server workload

---

# 6. Prisma with Neon PostgreSQL

## Decision

Prisma ORM was selected for database interactions with Neon PostgreSQL.

## Why?

Prisma provides:

- Type safety
- Strong developer experience
- Easy schema evolution
- Excellent integration with Next.js

Neon offers a fully managed PostgreSQL service suitable for deployment.

## Trade-off

Advantages

- Reliable relational storage
- Type-safe queries
- Scalable cloud database

Disadvantages

- Additional deployment configuration
- Dependency on an external database provider

---

# 7. Clerk Authentication

## Decision

Authentication is handled through Clerk instead of implementing a custom authentication system.

## Why?

This allows the project to focus on the investment research platform rather than user authentication logic.

## Trade-off

Advantages

- Secure authentication
- OAuth support
- Session management
- Protected routes

Disadvantages

- Third-party dependency
- Requires Clerk configuration during deployment

---

# 8. Streaming User Experience

## Decision

Analysis progress is streamed back to the frontend while the LangGraph workflow executes.

## Why?

Investment analysis may take several seconds due to multiple API requests and AI reasoning.

Streaming progress provides immediate feedback and improves perceived responsiveness.

## Trade-off

Advantages

- Better user experience
- Transparent workflow progress

Disadvantages

- Slightly more complex implementation

---

# 9. Export Functionality

## Decision

Reports can be exported in PDF, Markdown, and JSON formats.

## Why?

Different users have different workflows:

- PDF for sharing
- Markdown for documentation
- JSON for developers and integrations

## Trade-off

Advantages

- Greater flexibility
- Better usability

Disadvantages

- Additional maintenance for multiple export formats

---

# 10. Features Deferred

To keep the project within the assignment timeline, several advanced capabilities were intentionally deferred.

These include:

- Real-time stock prices
- SEC filing analysis
- Earnings call transcript analysis
- Vector database integration
- Retrieval-Augmented Generation (RAG)
- AI memory
- Portfolio optimization
- Scheduled alerts
- Multi-model orchestration
- Collaborative workspaces

These enhancements are natural extensions of the current architecture and can be integrated without major architectural changes.

---

# Reflection

The primary objective was to build a production-oriented, modular investment research platform rather than simply demonstrating LLM integration.

Where possible, deterministic software engineering techniques were preferred over additional AI calls to improve reliability, maintainability, and explainability.

This architecture provides a strong foundation for future enhancements while remaining practical within the scope and timeline of the assignment.