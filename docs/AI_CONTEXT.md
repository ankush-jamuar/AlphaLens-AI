# AlphaLens AI - AI Development Context

This document provides permanent implementation guidance for all AI-assisted development.

Every implementation must follow these rules unless explicitly instructed otherwise.

---

# Project Overview

AlphaLens AI is an AI-powered Investment Research Workspace.

The application should feel like a production-ready SaaS application rather than an AI demo.

The primary focus is the quality of the AI workflow.

---

# Development Philosophy

Always prefer:

* Simplicity
* Readability
* Maintainability
* Scalability

Avoid unnecessary abstractions.

Avoid overengineering.

---

# Tech Stack

Framework

* Next.js 16 (App Router)

Language

* TypeScript

Styling

* Tailwind CSS
* shadcn/ui

Animation

* Framer Motion

AI

* LangChain.js
* LangGraph.js
* Gemini 2.5 Flash

Deployment

* Vercel

---

# Architecture Rules

Use App Router.

Use Server Components where appropriate.

Use Client Components only when necessary.

Never place business logic inside UI components.

Separate:

* UI
* AI
* Services
* Utilities
* Prompts

---

# Folder Responsibilities

app/

Routing only.

components/

Reusable UI.

langgraph/

Graph construction.

nodes/

Each AI node.

prompts/

Prompt templates.

services/

External APIs.

lib/

Shared utilities.

types/

Shared interfaces.

hooks/

Reusable hooks.

---

# Coding Rules

Use TypeScript everywhere.

Never use "any".

Prefer interfaces.

Prefer named exports.

Keep functions small.

Avoid duplicate code.

Avoid deeply nested logic.

Write self-documenting code.

---

# Prompt Rules

Never hardcode prompts inside components.

Every prompt must exist as its own file.

Prompts should have one responsibility.

---

# LangGraph Rules

Each node should perform only one task.

Nodes communicate using structured objects.

Never return markdown.

Never return HTML.

Return typed JSON only.

---

# UI Guidelines

Design should feel premium.

Minimal.

Modern.

Professional.

Use whitespace generously.

Avoid clutter.

Do not imitate ChatGPT.

Do not build a chat interface.

The application is an analytics dashboard.

---

# UX Rules

Always show progress.

Never leave users waiting without feedback.

Every long-running operation should display meaningful progress.

---

# Error Handling

Every API call should be wrapped in try/catch.

Display user-friendly errors.

Never expose stack traces.

---

# Performance

Lazy load heavy components.

Avoid unnecessary renders.

Optimize API usage.

---

# Accessibility

Semantic HTML.

Keyboard navigation.

ARIA labels where necessary.

Good color contrast.

---

# Security

Never expose API keys.

Use environment variables.

Validate every API request.

---

# Documentation

Code should be easy to explain during interviews.

Prioritize clarity over cleverness.

---

# Development Goal

Build software that looks like it was created by an AI Product Engineer working at a startup.

Every engineering decision should support that objective.