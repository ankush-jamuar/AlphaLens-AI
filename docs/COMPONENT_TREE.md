# AlphaLens AI

## Component Architecture

Version: 1.0

---

# Purpose

This document defines the complete React component hierarchy for AlphaLens AI.

Every component should have a single responsibility.

Components should be reusable, modular, and easy to test.

Business logic should never live inside UI components.

---

# Component Philosophy

The UI should be built from small reusable components.

Pages should compose components.

Components should never directly call external APIs.

They receive data through props or hooks.

---

# High-Level Tree

```text
App
│
├── RootLayout
│
├── Navbar
│
├── Sidebar
│
└── DashboardPage
      │
      ├── SearchSection
      │      ├── SearchInput
      │      ├── ExampleCompanies
      │      └── AnalyzeButton
      │
      ├── ProgressTimeline
      │
      ├── ReportSection
      │      ├── CompanyOverviewCard
      │      ├── FinancialCard
      │      ├── MarketPositionCard
      │      ├── NewsCard
      │      ├── RiskCard
      │      ├── OpportunityCard
      │      ├── RecommendationCard
      │      └── SourcesCard
      │
      └── HistorySidebar
             └── HistoryItem
```

---

# Layout Components

## RootLayout

Responsibilities

* Global layout
* Theme
* Fonts
* Metadata
* Providers

Owns

Nothing.

---

## Navbar

Responsibilities

* Branding
* Theme Toggle
* GitHub Button

Future

Profile Menu

---

## Sidebar

Responsibilities

* Navigation
* Recent Analyses
* Future navigation links

Should not perform data fetching.

---

# Search Components

## SearchSection

Acts as the container.

Contains

* SearchInput
* AnalyzeButton
* ExampleCompanies

---

## SearchInput

Responsibilities

* Company input
* Validation
* Keyboard support

No API calls.

---

## AnalyzeButton

Responsibilities

* Trigger analysis

Displays loading state.

---

## ExampleCompanies

Displays quick suggestions.

Examples

* Apple
* NVIDIA
* Microsoft
* Reliance
* Tata Consultancy Services

Future additions should be configurable.

---

# Progress Components

## ProgressTimeline

Displays current pipeline progress.

Examples

✓ Researching company

✓ Reading financial data

✓ Evaluating risks

✓ Generating investment thesis

Should support animated transitions.

---

# Report Components

## ReportSection

Container.

Receives

InvestmentReport

Delegates rendering.

---

## CompanyOverviewCard

Displays

* Company
* Industry
* Headquarters
* Description
* Market Cap

---

## FinancialCard

Displays

* Revenue
* Net Income
* EPS
* PE Ratio
* Debt
* Cash Flow

Should support unavailable values gracefully.

---

## MarketPositionCard

Displays

* Competitors
* Strengths
* Weaknesses

---

## NewsCard

Displays

Recent news.

Each item

Headline

Summary

Impact Badge

---

## RiskCard

Displays

Risk level.

Risk bullets.

Use warning styling.

---

## OpportunityCard

Displays

Growth opportunities.

Expansion.

Innovation.

Industry trends.

---

## RecommendationCard

Hero component.

Displays

Investment Score

Recommendation

Confidence

Investment Thesis

Positive Factors

Negative Factors

This should receive the highest visual emphasis.

---

## SourcesCard

Displays

List of references.

Every source should include

* Title
* URL

Links should open in a new tab.

---

# History Components

## HistorySidebar

Displays previous analyses.

Reads from local storage through a hook.

No storage logic inside the component.

---

## HistoryItem

Displays

Company

Recommendation

Score

Timestamp

Selecting an item reloads the saved report.

---

# Shared Components

## MetricCard

Reusable metric display.

Examples

Revenue

EPS

Market Cap

Confidence

Score

---

## SectionHeader

Reusable section title.

Supports

Title

Subtitle

Icon

---

## Badge

Reusable badge.

Examples

Invest

Watch

Pass

Positive

Negative

Neutral

---

## EmptyState

Used when

No analyses exist.

No report loaded.

---

## ErrorState

Displays friendly error messages.

Supports retry action.

---

## SkeletonLoader

Displayed during loading.

No layout shift.

---

# Hooks

## useAnalysis

Responsibilities

* Execute analysis
* Track loading
* Handle API errors

---

## useHistory

Responsibilities

* Read localStorage
* Save report
* Delete report
* Return sorted history

---

## useTheme

Theme switching.

---

# Utility Components

## LoadingOverlay

Displayed during AI execution.

Contains

ProgressTimeline

---

## PageContainer

Provides consistent spacing.

---

## CardGrid

Responsive card layout.

---

# Props Guidelines

Every component should receive only the data it needs.

Avoid passing the entire report object when a component only requires one section.

Prefer explicit props over deeply nested objects.

---

# State Ownership

Search state

Owned by SearchSection.

Analysis state

Owned by Dashboard page through useAnalysis.

History

Owned by useHistory.

Theme

Owned by Theme Provider.

Components should remain stateless whenever possible.

---

# Data Flow

```text
Dashboard
    │
    ├── SearchSection
    │       │
    │       ▼
    │   useAnalysis
    │       │
    │       ▼
    │   API
    │       │
    │       ▼
    │ InvestmentReport
    │
    ├── ReportSection
    │
    └── HistorySidebar
```

Data always flows downward.

Never mutate parent state inside child components.

---

# Naming Conventions

Use PascalCase for components.

Examples

CompanyOverviewCard

RecommendationCard

HistorySidebar

ProgressTimeline

File names should match component names.

One component per file.

---

# Engineering Principles

Components should be composable.

Components should remain presentation-focused.

Hooks contain UI behavior.

Services contain API communication.

LangGraph contains AI orchestration.

Pages compose the application.

The UI should remain independent from the AI implementation.

Every component should be easy to explain during a technical interview.
