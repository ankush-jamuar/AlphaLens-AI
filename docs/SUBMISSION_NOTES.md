# AlphaLens AI - Submission Notes

## Candidate Information

**Project:** AlphaLens AI - Agentic Investment Research Platform

**Role Applied:** Software Engineering Intern (Backend & Frontend Engineer in AI)

---

# Repository

GitHub Repository

https://github.com/ankush-jamuar/AlphaLens-AI

---

# Live Demo

https://alpha-lens-ai-six.vercel.app/

---

# Overview

AlphaLens AI is an AI-powered investment research platform that combines deterministic software engineering with Large Language Models to generate explainable investment recommendations.

Instead of relying on a single LLM prompt, the platform follows a structured LangGraph workflow that gathers company information, financial data, market news, and competitive insights before generating an AI-powered investment thesis.

The objective is to build a transparent, modular, and scalable investment research assistant.

---

# Features

✔ AI Investment Research

✔ LangGraph Multi-Agent Workflow

✔ Company Research

✔ Financial Statement Analysis

✔ Market News Aggregation

✔ Market Assessment

✔ AI Recommendation Engine

✔ Portfolio Management

✔ Watchlist

✔ Saved Reports

✔ Company Comparison

✔ AI Chat

✔ Authentication (Clerk)

✔ PostgreSQL Database (Neon)

✔ PDF / Markdown / JSON Export

✔ Responsive SaaS Dashboard

---

# Technology Stack

Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

Backend

- Next.js App Router
- LangGraph
- LangChain
- Prisma ORM
- Neon PostgreSQL

Authentication

- Clerk

AI

- Gemini 2.5 Flash

External APIs

- Alpha Vantage
- GNews

Deployment

- Vercel

---

# Folder Structure

```
app/
components/
hooks/
lib/
nodes/
services/
prompts/
langgraph/
types/
prisma/
docs/
```

---

# How to Run

1.

Clone the repository

```bash
git clone <repository-url>
```

2.

Install dependencies

```bash
npm install
```

3.

Configure environment variables

Refer to:

.env.example

4.

Generate Prisma Client

```bash
npx prisma generate
```

5.

Push database schema

```bash
npx prisma db push
```

6.

Run locally

```bash
npm run dev
```

---

# Suggested Evaluation Flow

For the best experience, I recommend evaluating the application in the following order:

1. Landing Page

2. Authentication

3. AI Research

4. Dashboard

5. Portfolio

6. Watchlist

7. Saved Reports

8. Company Comparison

9. AI Chat

10. Export Reports

---

# Example Companies

The following companies were tested extensively during development.

- Apple
- Microsoft
- NVIDIA
- Amazon
- Tesla
- Alphabet
- Meta
- Reliance
- Infosys
- Tata Consultancy Services

---

# Documentation

Additional documentation is available in the docs directory.

Included documents:

- PROJECT_OVERVIEW.md
- ARCHITECTURE.md
- KEY_DECISIONS_AND_TRADEOFFS.md
- IMPLEMENTATION_TIMELINE.md
- AI_DEVELOPMENT_PROCESS.md
- EXAMPLE_RUNS.md
- FUTURE_IMPROVEMENTS.md
- KNOWN_LIMITATIONS.md

---

# AI Development

This project was built using an AI-assisted software engineering workflow.

AI tools were used for:

- Architecture discussions
- System design
- Debugging
- Code generation
- Refactoring
- Documentation

Engineering decisions, testing, debugging, and validation were performed iteratively throughout development.

A summary of the AI-assisted development process is included in:

docs/AI_DEVELOPMENT_PROCESS.md

---

# Known Limitations

The platform depends on external services such as:

- Alpha Vantage
- GNews
- Gemini
- Clerk
- Neon PostgreSQL

Free-tier rate limits may occasionally affect analysis quality or response time.

These limitations are documented in:

docs/KNOWN_LIMITATIONS.md

---

# Future Roadmap

Potential future enhancements include:

- SEC Filing Analysis
- Earnings Call Analysis
- RAG over Financial Documents
- AI Memory
- Portfolio Optimization
- Real-Time Market Data
- Mobile Applications
- Multi-Model AI Routing

---

# Final Notes

AlphaLens AI was developed as a production-oriented proof of concept demonstrating modern AI application engineering principles.

The focus was not only on integrating an LLM, but also on designing a scalable architecture, implementing modular workflows, ensuring explainability, and delivering a polished full-stack user experience.

Thank you for taking the time to review this project.

I appreciate your consideration and hope you enjoy exploring AlphaLens AI.