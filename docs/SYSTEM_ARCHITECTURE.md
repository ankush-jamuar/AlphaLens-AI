# AlphaLens AI

## System Architecture

Version: 2.0 (Frozen)

---

# Purpose

This document defines the software architecture for AlphaLens AI.

It establishes the responsibilities of each layer, folder, and module, ensuring a clean separation of concerns and a maintainable codebase.

This document is the architectural source of truth.

---

# High-Level Architecture

```text
                        User
                          │
                          ▼
                Investment Workspace
                          │
                          ▼
                  Search Component
                          │
                          ▼
                POST /api/analyze
                          │
                          ▼
              LangGraph Investment Agent
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
 Company Research   Financial Analysis   News Analysis
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                 Market Analysis
                          ▼
                Evidence Aggregation
                          ▼
              Investment Reasoning
                          ▼
             Recommendation Generator
                          ▼
                Report Formatter
                          ▼
               Structured JSON Report
                          │
                          ▼
                 React Report Components
                          │
                          ▼
              Browser localStorage (History)
```

---

# Layered Architecture

The application is divided into five independent layers.

## 1. Presentation Layer

Responsible for:

* User Interface
* User Interaction
* Rendering Reports
* Loading States
* Error States

Folders

```text
app/
components/
```

Rules

* No business logic.
* No API calls.
* No prompt logic.
* No financial calculations.

---

## 2. API Layer

Responsible for:

* Request validation
* Input sanitization
* Starting the LangGraph workflow
* Returning structured responses

Folder

```text
app/api/
```

Rules

* Thin layer only.
* No presentation logic.
* No prompt definitions.

---

## 3. AI Layer

Responsible for:

* Graph construction
* Agent orchestration
* Node execution
* Prompt execution
* Investment reasoning

Folders

```text
langgraph/
nodes/
prompts/
```

Rules

* Independent of React.
* Independent of UI.
* Returns structured objects only.

---

## 4. Service Layer

Responsible for all external integrations.

Examples

* Gemini
* Financial Data API
* Company Information API

Folder

```text
services/
```

Rules

* One service per external provider.
* No React imports.
* No UI knowledge.

---

## 5. Utility Layer

Responsible for reusable helpers.

Folders

```text
lib/
utils/
types/
```

Examples

* Validation
* Formatting
* Constants
* Shared interfaces
* Score calculations

---

# Storage Strategy

Browser localStorage is the only persistence mechanism.

Purpose

* Save previous analyses.
* Restore previous reports.
* Improve user experience.

Rules

* Maximum 20 reports.
* Newest report appears first.
* Remove the oldest report when the limit is exceeded.
* Never store API keys or sensitive data.

---

# Folder Responsibilities

## app/

Contains

* Routes
* Layout
* Metadata
* API routes

No reusable business logic.

---

## components/

Contains reusable UI components.

Organized by feature.

```text
components/
├── layout/
├── report/
├── search/
├── progress/
├── history/
├── shared/
└── ui/
```

---

## hooks/

Contains reusable React hooks.

Examples

* useAnalysis
* useHistory

Hooks coordinate UI behavior.

They do not implement AI logic.

---

## langgraph/

Responsible for graph construction.

Contains

* Graph definition
* Graph state
* Node connections

---

## nodes/

Each file implements one AI capability.

Examples

```text
companyResearch.ts
financialAnalysis.ts
newsAnalysis.ts
marketAnalysis.ts
evidenceAggregation.ts
investmentReasoning.ts
recommendation.ts
reportFormatter.ts
```

One responsibility per node.

---

## prompts/

Contains only prompt templates.

No API calls.

No business logic.

Each prompt supports exactly one node.

---

## services/

Wraps all external APIs.

Examples

```text
gemini.service.ts
financial.service.ts
company.service.ts
```

---

## lib/

Contains

* Constants
* Configuration
* Shared helpers

---

## utils/

Contains pure utility functions.

Examples

* formatCurrency()
* formatDate()
* calculateScore()
* validateCompanyName()

---

## types/

Contains all shared TypeScript interfaces.

Used by both frontend and backend.

---

# Rendering Strategy

Use Server Components by default.

Use Client Components only when required.

Examples

Client Components

* Search input
* Progress animation
* Sidebar interactions
* localStorage access

Server Components

* Static layout
* Report rendering
* Shared layout elements (where possible)

---

# Request Lifecycle

```text
User enters company
        │
        ▼
Search submitted
        │
        ▼
POST /api/analyze
        │
        ▼
Validate request
        │
        ▼
Execute LangGraph
        │
        ▼
Collect evidence
        │
        ▼
Generate recommendation
        │
        ▼
Return structured report
        │
        ▼
Render report
        │
        ▼
Save to localStorage
```

---

# Data Flow

Data always flows downward.

```text
Workspace
    │
    ├── SearchSection
    │
    ├── ProgressTimeline
    │
    ├── ReportSection
    │
    └── HistorySidebar
```

Child components never modify parent state directly.

Shared state is managed through custom hooks.

---

# Error Flow

```text
Validation Error
        │
        ▼
Structured API Error
        │
        ▼
ErrorState Component
```

Never expose stack traces.

Display friendly messages.

---

# Module Dependencies

Allowed dependency direction

```text
UI
    ↓
Hooks
    ↓
API
    ↓
LangGraph
    ↓
Services
```

Forbidden

* UI → Services
* UI → LangGraph
* Components → Prompts
* Components → External APIs

---

# Non-Functional Requirements

The architecture must support

* Responsiveness
* Accessibility
* Maintainability
* Testability
* Scalability
* Explainability

---

# Known Constraints

* Free APIs only.
* No authentication.
* No database.
* Browser-based persistence.
* Single backend endpoint for MVP.

These constraints are intentional and align with the project scope.

---

# Future Expansion

The architecture should allow future additions without major refactoring.

Examples

* User accounts
* Cloud persistence
* Portfolio management
* Watchlists
* Scheduled analysis
* Company comparison
* Team collaboration

---

# Engineering Principles

Every module has a single responsibility.

Every layer remains independent.

The frontend should never understand AI implementation details.

The AI layer should never contain UI logic.

Services should remain replaceable.

The architecture should remain modular, predictable, and easy to explain during technical interviews.
