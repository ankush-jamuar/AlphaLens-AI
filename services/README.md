# External Service Wrappers

> **TODO [Milestone 2]**: This folder will contain all external API wrappers.

## Purpose

Every external integration is isolated in this folder.
Services have no knowledge of React or UI.
One service file per external provider.

## Planned Files (from SYSTEM_ARCHITECTURE.md)

```
services/
├── gemini.service.ts      — Gemini 2.5 Flash LLM client
├── financial.service.ts   — Financial data API (e.g., Alpha Vantage, yFinance)
└── company.service.ts     — Company profile API (e.g., Finnhub, Yahoo Finance)
```

## Service Contract

Every service:
1. Wraps one external API
2. Handles authentication via environment variables
3. Returns typed objects (never `any`)
4. Throws structured errors on failure

## Environment Variables

```
GEMINI_API_KEY=
FINANCIAL_API_KEY=
```

Secrets must never be hardcoded or committed.
