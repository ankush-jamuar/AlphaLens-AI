# AlphaLens AI

> Production-ready AI-powered Investment Research Platform built using LangGraph, Gemini 2.5, Next.js 16, Prisma, Neon PostgreSQL and Clerk Authentication.

---

## 🌐 Quick Links

### 🔗 Live Demo
https://alpha-lens-ai-six.vercel.app/

### 💻 GitHub Repository
https://github.com/ankush-jamuar/AlphaLens-AI

---

# Overview

AlphaLens AI is an Agentic Investment Research Platform that analyzes publicly listed companies using a multi-stage AI workflow.

Instead of relying on a single LLM prompt, AlphaLens AI follows a structured research pipeline that independently gathers company information, financial statements, market data, and recent news before generating an investment recommendation.

The objective is to reduce hallucinations by grounding AI responses in real-world financial data.

The system produces institutional-style investment reports containing:

- Company Overview
- Financial Analysis
- Market Position
- Competitive Landscape
- Recent News
- Risks
- Opportunities
- Investment Thesis
- Confidence Score
- Final Recommendation (Invest / Watch / Pass)

---

# Features

## AI Research Engine

- LangGraph Multi-Agent Workflow
- Structured AI Pipeline
- Gemini 2.5 Flash reasoning
- Evidence aggregation
- Report validation
- Streaming progress updates

---

## Investment Research

- Company Profile
- Financial Statements
- Balance Sheet
- Income Statement
- Cash Flow
- Market Assessment
- Risk Analysis
- Strategic Opportunities
- Competitor Analysis
- Investment Recommendation

---

## Platform Features

- Clerk Authentication
- Protected Dashboard
- Portfolio Management
- Watchlist
- Saved Reports
- Company Comparison
- AI Research Chat
- Search History
- Export Reports
- Command Palette
- Notifications
- Responsive Design

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

## Backend

- Next.js App Router
- LangGraph
- LangChain
- Prisma ORM
- Neon PostgreSQL

## AI

- Gemini 2.5 Flash
- LangGraph
- LangChain

## Authentication

- Clerk

## External APIs

- Alpha Vantage
- GNews

---

# Project Structure

```
app/
components/
hooks/
langgraph/
nodes/
services/
lib/
types/
utils/
prisma/
prompts/
docs/
```

---

# How to Run

## 1. Clone Repository

```bash
git clone <repository-url>

cd alpha-lens-ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create

```
.env
```

using

```
.env.example
```

Fill the following values:

- DATABASE_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- GEMINI_API_KEY
- ALPHA_VANTAGE_API_KEY
- GNEWS_API_KEY

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Push Database Schema

```bash
npx prisma db push
```

---

## 6. Start Development Server

```bash
npm run dev
```

Application:

```
http://localhost:3000
```

---

# Production Build

```bash
npm run build

npm start
```

---

# AI Workflow

```
User Query
      │
      ▼
Planning Node
      │
      ▼
──────────────────────────
│       Parallel         │
│                        │
│ Company Research       │
│ Financial Analysis     │
│ News Analysis          │
──────────────────────────
      │
      ▼
Market Assessment
      │
      ▼
Evidence Aggregation
      │
      ▼
Investment Reasoning
      │
      ▼
Report Formatter
      │
      ▼
Investment Report
```

---

# Architecture

The platform follows a modular Agentic architecture.

Every responsibility is separated into dedicated nodes.

Instead of asking an LLM to directly answer investment questions, AlphaLens AI first gathers evidence from external APIs before generating the final reasoning.

This architecture improves explainability, modularity, and maintainability.

---

# Design Decisions

### LangGraph

Chosen for deterministic multi-agent orchestration.

---

### Gemini

Used only for high-level investment reasoning rather than data collection.

---

### Alpha Vantage

Used for financial statements and company overview.

---

### GNews

Used for recent market news.

---

### Prisma + Neon

Provides a scalable relational database layer with type-safe access.

---

### Clerk

Handles secure authentication and protected routes.

---

# Trade-offs

### Current Scope

The project focuses on publicly listed companies.

### AI Cost Optimization

Gemini usage is minimized to reduce API consumption.

### Market Data

Uses free financial APIs, which may occasionally be rate-limited.

---

# Example Companies

Test the platform using:

- Apple
- Microsoft
- NVIDIA
- Amazon
- Tesla
- Meta
- Alphabet
- Reliance Industries
- Infosys
- Tata Consultancy Services

---

# Future Improvements

Given more development time, the platform could be extended with:

- Real-time stock prices
- SEC filing analysis
- Earnings call transcript analysis
- Portfolio optimization
- RAG over financial documents
- Vector database integration
- Multi-model AI routing
- AI Copilot with memory
- Multi-user collaboration
- Scheduled investment alerts

---

# Assignment Notes

This project was developed using AI-assisted software engineering practices while maintaining architectural control, manual verification, debugging, and iterative refinement throughout development.

The AI assistance accelerated implementation, while system design, validation, debugging, integration, and production stabilization were continuously reviewed and refined.

---

# License

This project was developed as part of a Software Engineering Internship Assignment.