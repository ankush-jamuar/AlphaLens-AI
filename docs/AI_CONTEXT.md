# AlphaLens AI

## AI Development Context

Version: 2.0 (Frozen)

---

# Purpose

This document defines the engineering standards for AlphaLens AI.

Every AI-assisted implementation must follow these rules.

If any generated code conflicts with this document, this document takes priority.

---

# Project Summary

AlphaLens AI is an AI-powered Investment Research Workspace.

The application allows users to analyze public companies and receive an explainable investment recommendation.

The primary objective is to demonstrate modern AI engineering using LangChain.js and LangGraph.js.

The application should feel like a polished SaaS product rather than an AI demo.

---

# Technology Stack

Framework

* Next.js 16 (App Router)

Language

* TypeScript

Styling

* Tailwind CSS

UI Components

* shadcn/ui

Animations

* Framer Motion

AI Framework

* LangChain.js

Agent Framework

* LangGraph.js

LLM

* Gemini 2.5 Flash

Deployment

* Vercel

Storage

* Browser localStorage

---

# Architecture Rules

The project follows a layered architecture.

UI Layer

↓

API Layer

↓

AI Layer

↓

External Services

↓

Structured JSON

↓

UI Rendering

Each layer has one responsibility.

Layers should remain independent.

---

# Folder Responsibilities

app/

Routing and API endpoints only.

components/

Reusable UI components.

hooks/

Reusable React hooks.

langgraph/

Graph construction and orchestration.

nodes/

Individual LangGraph nodes.

prompts/

Prompt templates.

services/

External API wrappers.

types/

Shared interfaces.

utils/

Pure utility functions.

lib/

Shared constants and helper functions.

docs/

Project documentation.

---

# Coding Standards

Use TypeScript everywhere.

Never use `any` unless there is no practical alternative.

Prefer interfaces over loosely typed objects.

Prefer named exports.

Keep files focused.

One responsibility per component.

One responsibility per function.

Avoid deeply nested logic.

Avoid unnecessary abstractions.

---

# React Guidelines

Use Server Components by default.

Use Client Components only when required for:

* User interaction
* Animations
* Browser APIs
* localStorage
* React hooks

Do not convert everything into Client Components.

---

# Component Rules

Components should be presentation-focused.

Components must not contain:

* API requests
* Prompt logic
* LangGraph logic
* Financial calculations

Business logic belongs in hooks, services, or utilities.

---

# State Management

Use React state.

Use custom hooks where appropriate.

Do not introduce Redux, Zustand, MobX, or unnecessary Context providers.

Keep state as close as possible to where it is used.

---

# Prompt Engineering

Every prompt must exist in the `prompts/` directory.

Never embed prompts inside React components.

Every prompt should have one responsibility.

Prompt outputs must be structured.

---

# LangGraph Rules

Every node performs exactly one responsibility.

Nodes communicate only through the shared graph state.

Nodes must not directly manipulate UI concerns.

Graph outputs should always be structured JSON.

---

# API Rules

Expose only business capabilities.

The frontend should never know implementation details.

Validate all incoming requests.

Return consistent response envelopes.

Never expose API keys.

---

# Storage Rules

Use browser localStorage only.

History is stored locally.

Maximum history size:

20 reports.

Remove the oldest report when the limit is exceeded.

---

# Error Handling

Validate inputs before processing.

Handle API failures gracefully.

Return user-friendly error messages.

Never expose stack traces to users.

Log useful debugging information only during development.

---

# Performance

Avoid unnecessary re-renders.

Memoize expensive computations when appropriate.

Lazy-load heavy UI sections.

Avoid duplicate API calls.

Keep bundle size reasonable.

---

# UI Philosophy

The application should resemble a modern AI workspace.

Design inspiration:

* Linear
* Vercel
* Notion
* Perplexity

Do not imitate ChatGPT.

The workspace should feel calm, minimal, and professional.

Whitespace is preferred over visual clutter.

---

# Animation Guidelines

Animations should communicate progress.

Prefer:

* Fade
* Slide
* Scale

Avoid excessive motion.

Animations should never distract from the content.

---

# Accessibility

Use semantic HTML.

Provide keyboard accessibility.

Maintain sufficient color contrast.

Use ARIA attributes where appropriate.

---

# Security

Store secrets only in environment variables.

Never commit API keys.

Validate user input.

Sanitize company names before external requests.

Do not trust client input.

---

# Documentation Rules

Generated code should be easy to understand.

Avoid unnecessary comments.

Write comments only when they explain intent rather than implementation.

Public functions should have clear names that reduce the need for comments.

---

# Future-Proofing

Design every module so it can be extended without major refactoring.

Future features such as authentication, cloud storage, watchlists, and portfolio management should be possible without changing the existing architecture.

---

# Development Workflow

For every implementation task:

1. Read all documentation inside `/docs`.
2. Follow the documented architecture.
3. Implement only the requested milestone.
4. Do not introduce future features.
5. Leave TODO markers only where the next milestone connects.
6. Ensure the application builds successfully before considering the task complete.

---

# Engineering Philosophy

AlphaLens AI should demonstrate thoughtful software engineering.

Every implementation should optimize for:

* Clarity
* Maintainability
* Explainability
* Product quality

The objective is not to write the most code.

The objective is to build software that is clean, reliable, and easy to extend while showcasing strong AI engineering practices.
