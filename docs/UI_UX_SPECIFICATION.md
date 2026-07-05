# AlphaLens AI

## UI & UX Specification

Version: 2.0 (Frozen)

---

# Purpose

This document defines the visual language, layout, interaction patterns, and user experience for AlphaLens AI.

The goal is to create an interface that feels like a modern AI workspace rather than a chatbot or dashboard template.

---

# Design Philosophy

AlphaLens AI should communicate:

* Intelligence
* Trust
* Simplicity
* Focus
* Professionalism

The interface should minimize distractions and maximize readability.

Every screen should direct attention toward the investment analysis.

---

# Design Inspiration

Primary inspiration:

* Linear
* Vercel Dashboard
* Perplexity
* Notion
* Stripe Dashboard

Avoid:

* ChatGPT-style chat windows
* Marketing landing pages
* Excessive gradients
* Heavy glassmorphism
* Flashy animations

---

# Color Palette

## Background

Primary

#09090B

Secondary

#111827

Surface

#18181B

---

## Accent

Primary

Emerald

Used for:

* Analyze button
* Success states
* Positive indicators

---

## Status Colors

Success

Green

Warning

Amber

Error

Red

Information

Blue

Neutral

Slate

---

## Text

Primary

White

Secondary

Slate 300

Muted

Slate 500

---

# Typography

Use clean typography with generous spacing.

Heading

Large

Bold

Readable

Body

16px

Comfortable line height

Cards should avoid dense text.

---

# Layout

Desktop

```text
-------------------------------------------------------
Navbar
-------------------------------------------------------

Sidebar | Main Workspace

Sidebar (280px)

Main Workspace (Flexible)

-------------------------------------------------------
```

The main workspace should always receive the majority of the available width.

---

# Navbar

Height

64px

Contents

Left

* AlphaLens AI Logo

Right

* GitHub Link

No user profile.

No theme switch.

No unnecessary controls.

---

# Sidebar

Desktop

Collapsible.

Default

Expanded.

Mobile

Slide-out drawer.

---

## Sidebar Sections

### New Analysis

Primary action.

Always visible.

---

### Recent Analyses

Display

Maximum

20 analyses.

Each item displays

* Company Name
* Recommendation Badge
* Timestamp

Selecting an item immediately loads the report.

---

# Main Workspace

The workspace is divided into three vertical sections.

1.

Search Area

↓

2.

Analysis Progress

↓

3.

Investment Report

---

# Search Area

Position

Top of workspace.

Contents

Large search input.

Analyze button.

Suggested companies.

Placeholder

"Analyze a public company..."

Suggested companies

* Apple
* NVIDIA
* Microsoft
* Amazon
* Reliance Industries
* Tata Consultancy Services

Clicking a suggestion fills the input.

---

# Analysis Progress

Displayed only during analysis.

Instead of a spinner, show meaningful progress.

Example

✓ Understanding company

✓ Researching business

✓ Collecting financial data

✓ Reading latest news

✓ Evaluating market position

✓ Assessing investment risks

✓ Building investment thesis

✓ Preparing report

Progress should animate smoothly.

Later these steps map directly to LangGraph nodes.

---

# Investment Report

The report occupies most of the workspace.

Sections appear vertically.

---

## Executive Summary

Displays

* Company Name
* Industry
* Headquarters
* Recommendation
* Investment Score
* Confidence

This is the hero section.

---

## Company Overview

Displays

* Business description
* Core products
* Industry
* Market position

---

## Financial Health

Metric cards

Revenue

Net Income

EPS

P/E Ratio

Debt

Cash Flow

Unavailable metrics should display "Not Available" gracefully.

---

## Market Position

Displays

Strengths

Weaknesses

Competitors

---

## Recent News

Display

Headline

Summary

Impact

Positive

Neutral

Negative

Limit to the most relevant items.

---

## Risks

Display

Risk Level

Key risks

Bulleted format.

---

## Opportunities

Display

Growth opportunities.

Expansion.

Innovation.

Industry trends.

---

## Recommendation

This section receives the strongest visual emphasis.

Display

Investment Score

Recommendation

Confidence

Investment Thesis

Key Positives

Key Risks

---

## Sources

Display every reference used by the AI.

Each source should include

* Title
* URL

Links open in a new tab.

---

# Empty State

Displayed before the first analysis.

Headline

Start your first investment analysis

Description

Enter the name of a public company to generate an AI-powered investment report.

Include a simple illustration or icon.

---

# Error State

Friendly language.

Example

"We couldn't complete the analysis."

Provide a Retry button.

Never display technical error messages.

---

# Loading Skeletons

Every report section should have its own skeleton.

Avoid layout shifts.

The interface should remain stable while data loads.

---

# Animations

Use subtle animations only.

Preferred

* Fade
* Slide
* Scale

Avoid excessive motion.

Animation should reinforce progress rather than attract attention.

---

# Responsive Behavior

Desktop

Sidebar visible.

Tablet

Sidebar collapsible.

Mobile

Sidebar becomes a drawer.

Cards stack vertically.

Search remains at the top.

The Analyze button remains easily accessible.

---

# Accessibility

Keyboard navigation.

Visible focus states.

Semantic HTML.

ARIA labels where appropriate.

Color contrast should meet accessibility standards.

---

# UX Principles

The user should feel that the AI is actively researching the company.

The application should never feel like it is simply waiting for an API response.

The interface should remain calm, predictable, and easy to understand.

Every interaction should reinforce confidence in the AI's reasoning process.

---

# Definition of Good UX

A successful experience is one where a first-time user can:

1. Open the application.
2. Understand its purpose immediately.
3. Analyze a company without guidance.
4. Read the investment report comfortably.
5. Reopen previous analyses effortlessly.

The interface should require little to no explanation.
