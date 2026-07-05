# AlphaLens AI

## Implementation Roadmap

Version: 2.0 (Frozen)

---

# Purpose

This document defines the implementation milestones for AlphaLens AI.

The project should be implemented in sequential milestones.

Each milestone must leave the application in a working, buildable state before moving to the next.

---

# Project Goal

Build a production-quality AI Investment Research Workspace that demonstrates:

* Modern AI engineering
* LangGraph orchestration
* Explainable AI
* Clean software architecture
* Professional UI/UX

---

# Milestones

| Milestone | Name              | Status  |
| --------- | ----------------- | ------- |
| 1         | Foundation        | Pending |
| 2         | AI Engine         | Pending |
| 3         | Production Polish | Pending |

---

# Milestone 1

## Foundation

### Goal

Create the complete frontend foundation and project structure.

No AI functionality should be implemented during this milestone.

---

## Deliverables

### Application Structure

Create the complete project structure.

Required folders

```text
app/
components/
hooks/
langgraph/
nodes/
prompts/
services/
types/
utils/
lib/
```

---

### Workspace

Build the primary workspace located at

```
/
```

The workspace contains

* Navbar
* Sidebar
* Search Area
* Progress Area
* Report Area

---

### Sidebar

Implement

* New Analysis
* Recent Analyses

Use realistic mock data.

Do not implement localStorage yet.

---

### Search Area

Implement

* Search Input
* Analyze Button
* Suggested Companies

Use placeholder interactions.

---

### Progress Timeline

Implement the complete progress component.

Display placeholder progress.

No AI integration yet.

---

### Report Components

Create all report cards using realistic mock investment data.

Sections

* Company Overview
* Financial Health
* Market Position
* Recent News
* Risks
* Opportunities
* Recommendation
* Sources

---

### Shared Components

Implement reusable components.

Examples

* Metric Card
* Section Header
* Empty State
* Error State
* Skeleton Loader

---

### Styling

Implement

* Dark theme
* Responsive layout
* Typography
* Icons
* Animations

---

### API

Create placeholder endpoint

```
POST /api/analyze
```

Return

```
501 Not Implemented
```

Include TODO markers for Milestone 2.

---

### Hooks

Create placeholder hooks.

* useAnalysis
* useHistory

Do not implement business logic.

---

### Acceptance Criteria

* Application builds successfully.
* Workspace is responsive.
* Navigation works.
* Mock report renders correctly.
* Components are reusable.
* No AI implementation exists.

---

# Milestone 2

## AI Engine

### Goal

Implement the complete AI Investment Agent.

---

## Deliverables

### LangGraph

Implement the graph defined in

```
LANGGRAPH_DESIGN.md
```

---

### Nodes

Implement

* Company Research
* Financial Analysis
* News Analysis
* Market Analysis
* Evidence Aggregation
* Investment Reasoning
* Recommendation
* Report Formatting

---

### Prompt Layer

Create prompt templates.

One prompt per node.

No inline prompts.

---

### External Services

Integrate

* Gemini
* Financial Data API
* Company Research API (if required)

Each integration belongs in the services layer.

---

### Report Generation

Generate structured JSON.

Do not return Markdown.

---

### History

Replace mock history with browser localStorage.

Maximum

20 reports.

Newest first.

---

### Acceptance Criteria

* Company analysis works.
* LangGraph executes successfully.
* Reports are generated correctly.
* History persists across refreshes.
* Errors handled gracefully.

---

# Milestone 3

## Production Polish

### Goal

Prepare the application for deployment and demonstration.

---

## Deliverables

### User Experience

Improve

* Loading animations
* Empty states
* Error handling
* Accessibility
* Mobile responsiveness

---

### Performance

Optimize

* Rendering
* API calls
* Bundle size
* Component loading

---

### Export

Allow users to export reports as PDF.

---

### Documentation

Complete

* README
* AI Prompt Log
* Example Runs
* Architecture Notes
* Trade-offs

---

### Deployment

Deploy on Vercel.

Verify production build.

Configure environment variables.

---

### Acceptance Criteria

* Application deployed.
* Responsive on desktop and mobile.
* Export works.
* Documentation complete.
* Project ready for technical interviews.

---

# Development Rules

Every milestone must satisfy the following requirements.

* The application must compile successfully.
* No broken routes.
* No unused code.
* No duplicated components.
* Leave TODO markers only where the next milestone connects.

Do not implement future milestones early.

---

# Implementation Order

Always follow this order.

1. Read all documentation in `/docs`.
2. Implement only the requested milestone.
3. Verify the application builds.
4. Verify TypeScript has no errors.
5. Verify responsive layout.
6. Commit changes.
7. Move to the next milestone.

---

# Definition of Done

The project is complete when:

* A user can analyze a public company.
* The AI agent researches and evaluates the company.
* A structured investment report is generated.
* Previous analyses are stored locally.
* Reports can be exported as PDF.
* The application is fully responsive.
* The application is deployed.
* Documentation is complete.
* Every design decision can be explained confidently during a technical interview.

---

# Engineering Philosophy

The roadmap prioritizes stability over speed.

Each milestone should produce a working application.

The project should evolve incrementally while preserving clean architecture and maintainable code.

The final result should resemble a production AI product rather than a classroom assignment.
