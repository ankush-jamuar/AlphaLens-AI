# AlphaLens AI

## API Specification

Version: 2.0 (Frozen)

---

# Purpose

This document defines the backend API contract for AlphaLens AI.

The API is intentionally minimal.

The backend is responsible only for investment analysis.

History management is handled entirely on the client using browser localStorage.

---

# API Principles

The API should be:

* Simple
* Predictable
* Strongly typed
* Stateless
* Easy to extend

All responses must follow a consistent structure.

The frontend should never depend on implementation details.

---

# API Overview

| Endpoint       | Method | Purpose                                                            |
| -------------- | ------ | ------------------------------------------------------------------ |
| `/api/analyze` | POST   | Analyze a public company and return a structured investment report |

No additional endpoints exist in Version 1.

---

# POST /api/analyze

## Purpose

Analyze a publicly listed company using the LangGraph Investment Agent and return a structured investment report.

---

## Request

### Content-Type

```text id="ggrkgx"
application/json
```

### Request Body

```json id="qukjlwm"
{
  "companyName": "NVIDIA"
}
```

---

# Validation Rules

The backend validates the request before executing the AI workflow.

Rules

* Required field: `companyName`
* Trim leading and trailing whitespace.
* Minimum length: 2 characters.
* Maximum length: 100 characters.
* Reject empty strings.
* Reject invalid characters.

If validation fails, the AI workflow must not start.

---

# Successful Response

HTTP Status

```text id="ls8kk0"
200 OK
```

Response

```json id="k6uybt"
{
  "success": true,
  "data": {
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
}
```

---

# Error Response Format

Every error follows the same structure.

```json id="6h1o9g"
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

# HTTP Status Codes

| Status | Meaning                         |
| ------ | ------------------------------- |
| 200    | Analysis completed successfully |
| 400    | Invalid request                 |
| 404    | Company not found               |
| 429    | Rate limit exceeded             |
| 500    | Internal server error           |

---

# Error Codes

Supported error codes

```text id="f1p6qe"
INVALID_COMPANY_NAME

COMPANY_NOT_FOUND

FINANCIAL_DATA_UNAVAILABLE

NEWS_DATA_UNAVAILABLE

LLM_ERROR

RATE_LIMIT_EXCEEDED

REQUEST_TIMEOUT

UNKNOWN_ERROR
```

These codes should remain stable for future frontend compatibility.

---

# Investment Report Schema

The AI must return the following structure.

```ts id="ep6wzg"
interface InvestmentReport {

  company: {
    name: string;
    ticker?: string;
    industry: string;
    headquarters: string;
    description: string;
    marketCap?: string;
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
    strengths: string[];
    weaknesses: string[];
    competitors: string[];
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

# NewsItem Schema

```ts id="xghz6t"
interface NewsItem {
  title: string;
  summary: string;
  impact: "Positive" | "Neutral" | "Negative";
}
```

---

# Source Schema

```ts id="6fz9y6"
interface Source {
  title: string;
  url: string;
}
```

---

# API Response Envelope

All successful responses must follow this structure.

```json id="cpkpvi"
{
  "success": true,
  "data": {}
}
```

All failures must follow this structure.

```json id="3zbbjo"
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
```

This format must remain consistent across future endpoints.

---

# Request Lifecycle

```text id="lbzv9y"
Client
   │
   ▼
POST /api/analyze
   │
   ▼
Validate Request
   │
   ▼
Execute LangGraph
   │
   ▼
Generate Report
   │
   ▼
Return Structured JSON
   │
   ▼
Frontend Renders Report
   │
   ▼
Frontend Saves Report to localStorage
```

---

# Timeout Strategy

Maximum execution time

```text id="qg8m0f"
60 seconds
```

If exceeded

Return

```text id="y5m2yr"
REQUEST_TIMEOUT
```

The frontend should display a friendly retry message.

---

# Security Requirements

* Validate every request.
* Never expose API keys.
* Sanitize user input.
* Reject malformed payloads.
* Use environment variables for secrets.

---

# Logging

Development

* Request duration
* Validation failures
* Node execution errors

Production

* Minimal logging
* No sensitive information
* No API keys
* No full prompt logging

---

# Future API Extensions

The architecture supports future endpoints without changing the response format.

Examples

```text id="bgtmyl"
POST /api/compare

POST /api/reanalyze

GET /api/market-trends

POST /api/watchlist
```

These are intentionally excluded from Version 1.

---

# Engineering Principles

The backend exposes business capabilities rather than implementation details.

The frontend should never understand LangGraph internals.

The API remains stateless.

Responses remain structured.

The contract defined in this document is considered stable for Version 1.
