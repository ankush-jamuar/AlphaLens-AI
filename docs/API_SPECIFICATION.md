# AlphaLens AI

## API Specification

Version: 1.0

---

# Purpose

This document defines every API contract used by AlphaLens AI.

All APIs must return structured JSON.

No HTML.

No Markdown.

The frontend is responsible for presentation.

---

# API Principles

* RESTful design
* Predictable responses
* Strong typing
* Consistent error format
* No business logic in UI
* Validation before execution

---

# Base URL

Development

/api

Production

/api

---

# API Overview

| Endpoint         | Method | Purpose               |
| ---------------- | ------ | --------------------- |
| /api/analyze     | POST   | Analyze a company     |
| /api/history     | GET    | Get saved analyses    |
| /api/history     | POST   | Save analysis         |
| /api/history/:id | GET    | Retrieve one analysis |
| /api/history/:id | DELETE | Delete analysis       |

> **Note:** History is stored in browser localStorage for the MVP. These endpoints abstract storage access so the frontend remains independent of the persistence mechanism. In the future they can be backed by a database without changing the UI.

---

# POST /api/analyze

Purpose

Start an investment analysis.

---

## Request

```json
{
  "companyName": "NVIDIA"
}
```

---

## Validation

companyName

Required

Minimum

2 characters

Maximum

100 characters

Trim whitespace.

Reject empty strings.

---

## Success Response

HTTP

200

```json
{
  "success": true,
  "report": {
    "company": {},
    "financials": {},
    "market": {},
    "news": [],
    "risks": [],
    "opportunities": [],
    "recommendation": {},
    "sources": []
  }
}
```

---

## Error Response

HTTP

400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_COMPANY_NAME",
    "message": "Please enter a valid company name."
  }
}
```

---

# GET /api/history

Purpose

Return previously saved analyses.

---

## Success Response

```json
{
  "success": true,
  "history": []
}
```

History items should be sorted newest first.

Maximum

20 items.

---

# POST /api/history

Purpose

Persist a completed analysis.

---

## Request

```json
{
  "report": {}
}
```

---

## Success

```json
{
  "success": true
}
```

---

# GET /api/history/:id

Purpose

Return a single report.

---

## Success

```json
{
  "success": true,
  "report": {}
}
```

---

# DELETE /api/history/:id

Purpose

Remove one report.

---

## Success

```json
{
  "success": true
}
```

---

# Investment Report Schema

Every completed report must follow this structure.

```ts
interface InvestmentReport {

  company: {

    name: string;

    ticker?: string;

    industry: string;

    headquarters: string;

    marketCap?: string;

    description: string;

  };

  financials: {

    revenue?: string;

    netIncome?: string;

    eps?: string;

    peRatio?: string;

    debt?: string;

    cashFlow?: string;

  };

  market: {

    competitors: string[];

    strengths: string[];

    weaknesses: string[];

  };

  news: NewsItem[];

  risks: string[];

  opportunities: string[];

  recommendation: {

    decision: "Invest" | "Watch" | "Pass";

    score: number;

    confidence: number;

    thesis: string;

    positives: string[];

    negatives: string[];

  };

  sources: Source[];

}
```

---

# News Schema

```ts
interface NewsItem {

  title: string;

  summary: string;

  impact: "Positive" | "Neutral" | "Negative";

}
```

---

# Source Schema

```ts
interface Source {

  title: string;

  url: string;

}
```

---

# Standard API Response

Every endpoint must follow this envelope.

```json
{
  "success": true,
  "data": {}
}
```

or

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

# Error Codes

INVALID_COMPANY_NAME

COMPANY_NOT_FOUND

FINANCIAL_DATA_UNAVAILABLE

NEWS_UNAVAILABLE

LLM_ERROR

RATE_LIMIT_EXCEEDED

UNKNOWN_ERROR

---

# HTTP Status Codes

200

Success

400

Bad Request

404

Company not found

429

Rate limit exceeded

500

Unexpected server error

---

# Validation Rules

Validate before calling LangGraph.

Reject

* Empty strings
* Extremely long names
* Unsupported characters
* Null values

Normalize whitespace before processing.

---

# Logging

Development

Log execution time.

Log node failures.

Production

Do not log API keys.

Do not log sensitive information.

---

# Timeout Strategy

Maximum request duration

60 seconds.

If exceeded

Return graceful timeout response.

---

# Future API Extensions

These endpoints are intentionally left out of the MVP.

Possible future additions

GET /api/compare

POST /api/watchlist

POST /api/portfolio

GET /api/market-trends

POST /api/reanalyze

---

# API Design Principles

The API should expose business capabilities rather than implementation details.

The frontend should never know how LangGraph works.

The AI layer should never know how the UI is rendered.

Every endpoint should remain stable even if the underlying implementation changes.

Structured responses are mandatory.

All API contracts should be versionable and easy to extend.
