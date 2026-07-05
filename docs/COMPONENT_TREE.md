# AlphaLens AI

## Component Architecture

Version: 2.0 (Frozen)

---

# Purpose

This document defines the React component hierarchy for AlphaLens AI.

The objective is to build a modular, maintainable, and reusable interface.

Every component should have a single responsibility.

Pages compose components.

Components compose smaller components.

Business logic remains outside presentation components.

---

# Design Principles

The component architecture follows these principles:

* Composition over inheritance
* Reusable UI
* Feature-based organization
* Single Responsibility Principle
* Minimal prop drilling
* Clear ownership of state

---

# High-Level Component Tree

```text
RootLayout
│
├── Navbar
│
├── Workspace
│   │
│   ├── Sidebar
│   │     ├── NewAnalysisButton
│   │     ├── HistoryList
│   │     │      └── HistoryItem
│   │     └── SidebarToggle
│   │
│   ├── SearchSection
│   │      ├── SearchInput
│   │      ├── AnalyzeButton
│   │      └── SuggestedCompanies
│   │
│   ├── ProgressTimeline
│   │
│   ├── ReportSection
│   │      ├── ExecutiveSummaryCard
│   │      ├── CompanyOverviewCard
│   │      ├── FinancialHealthCard
│   │      ├── MarketPositionCard
│   │      ├── NewsCard
│   │      ├── RisksCard
│   │      ├── OpportunitiesCard
│   │      ├── RecommendationCard
│   │      └── SourcesCard
│   │
│   ├── EmptyState
│   │
│   ├── ErrorState
│   │
│   └── LoadingOverlay
│          └── ProgressTimeline
│
└── NotFoundPage
```

---

# Layout Components

## RootLayout

Responsibilities

* Global layout
* Fonts
* Metadata
* Global styles

Owns no application state.

---

## Navbar

Responsibilities

* Display application logo
* Display GitHub link

No navigation logic.

No user state.

---

## Workspace

The primary application container.

Responsible for:

* Composing the interface
* Coordinating page-level state
* Rendering report or empty state

Owns

* Current report
* Loading state
* Error state

---

# Sidebar

Responsibilities

* New Analysis button
* Recent analyses
* Collapse / expand behavior

History data comes from

```text
useHistory()
```

No direct localStorage access.

---

## SidebarToggle

Controls sidebar visibility.

Desktop

Collapse / Expand.

Mobile

Open / Close drawer.

---

## HistoryList

Displays all saved analyses.

Maximum

20 items.

Sorted newest first.

---

## HistoryItem

Displays

* Company name
* Recommendation badge
* Timestamp

Selecting an item loads the saved report.

---

# Search Components

## SearchSection

Coordinates search interactions.

Contains

* SearchInput
* AnalyzeButton
* SuggestedCompanies

Owns

Current company name.

---

## SearchInput

Responsibilities

* Company input
* Validation feedback
* Keyboard support

No API requests.

---

## AnalyzeButton

Responsibilities

* Trigger analysis

Displays loading state while analysis is running.

---

## SuggestedCompanies

Displays quick examples.

Examples

* Apple
* Microsoft
* NVIDIA
* Amazon
* Reliance Industries
* Tata Consultancy Services

Selecting an example fills the search field.

---

# Progress Components

## ProgressTimeline

Displays AI execution progress.

Milestone 1

Placeholder progress.

Milestone 2

Connected to LangGraph execution.

Example

✓ Understanding company

✓ Reading financial data

✓ Evaluating risks

✓ Building investment thesis

---

# Report Components

## ReportSection

Container for all report cards.

Receives

```ts
InvestmentReport
```

Delegates rendering to child components.

---

## ExecutiveSummaryCard

Displays

* Company
* Industry
* Recommendation
* Investment Score
* Confidence

Highest visual priority.

---

## CompanyOverviewCard

Displays

* Description
* Headquarters
* Market Cap
* Core business

---

## FinancialHealthCard

Displays

* Revenue
* Net Income
* EPS
* PE Ratio
* Debt
* Cash Flow

Gracefully handles unavailable values.

---

## MarketPositionCard

Displays

* Competitors
* Strengths
* Weaknesses

---

## NewsCard

Displays recent news.

Each item includes

* Title
* Summary
* Impact badge

---

## RisksCard

Displays

* Risk level
* Risk bullets

---

## OpportunitiesCard

Displays

* Growth opportunities
* Expansion
* Innovation
* Industry trends

---

## RecommendationCard

Hero component.

Displays

* Investment Score
* Recommendation
* Confidence
* Investment Thesis
* Key Positives
* Key Risks

Receives the greatest visual emphasis.

---

## SourcesCard

Displays references used by the AI.

Each source contains

* Title
* URL

Links open in a new tab.

---

# Shared Components

Reusable UI building blocks.

Examples

```text
MetricCard

SectionHeader

StatusBadge

EmptyState

ErrorState

SkeletonLoader

LoadingOverlay
```

These components should contain presentation logic only.

---

# Hooks

## useAnalysis

Responsibilities

* Submit analysis requests
* Track loading
* Track errors
* Store current report

---

## useHistory

Responsibilities

* Read localStorage
* Save report
* Delete report
* Return sorted history

Owns all browser persistence.

---

# State Ownership

| State            | Owner         |
| ---------------- | ------------- |
| Search Query     | SearchSection |
| Current Report   | Workspace     |
| Loading          | useAnalysis   |
| Error            | useAnalysis   |
| History          | useHistory    |
| Sidebar Expanded | Sidebar       |

State should be owned by the highest component that requires it.

Avoid unnecessary lifting of state.

---

# Data Flow

```text
Workspace
     │
     ├── SearchSection
     │         │
     │         ▼
     │   useAnalysis
     │         │
     │         ▼
     │     /api/analyze
     │         │
     │         ▼
     │  InvestmentReport
     │
     ├── ReportSection
     │
     └── Sidebar
               │
               ▼
         useHistory
               │
               ▼
         localStorage
```

Data always flows downward.

Child components never modify parent state directly.

---

# Naming Conventions

Use PascalCase.

Examples

```text
RecommendationCard

FinancialHealthCard

ProgressTimeline

HistoryList
```

One component per file.

File name matches component name.

---

# Engineering Principles

Components should remain small and focused.

Presentation logic belongs inside components.

Business logic belongs inside hooks and services.

AI logic belongs inside the LangGraph layer.

Components should be reusable, testable, and easy to understand.

The component architecture should scale naturally as future features are added.
