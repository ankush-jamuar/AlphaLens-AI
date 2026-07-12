# Known Limitations

## Overview

AlphaLens AI is designed as a production-oriented proof of concept for AI-assisted investment research. While the platform provides a complete end-to-end workflow, certain limitations remain due to external API constraints, project scope, and assignment timelines.

These limitations have been documented transparently and provide opportunities for future enhancements.

---

# 1. External API Rate Limits

## Description

The platform relies on third-party APIs such as Alpha Vantage and GNews.

The free tiers of these services impose:

- Daily request limits
- Per-minute request limits
- Temporary throttling

During periods of heavy usage, some requests may fail or return incomplete data.

## Current Handling

- Graceful error handling
- User-friendly fallback messages
- Retry-safe architecture
- Cached responses where applicable

## Future Improvement

- Premium API subscriptions
- Redis-based caching
- Background data synchronization
- Multiple provider failover

---

# 2. Financial Data Availability

Some companies may not expose complete financial information through the selected APIs.

Examples include:

- Newly listed companies
- Foreign exchanges
- Smaller organizations
- Companies with incomplete public disclosures

The platform displays available information while marking unavailable fields appropriately.

---

# 3. AI Recommendations

Investment recommendations are generated using Gemini after collecting structured evidence.

Although grounded by external data sources, AI-generated insights should be considered informational rather than financial advice.

Users should perform independent research before making investment decisions.

---

# 4. Market Coverage

The current implementation focuses primarily on companies that are well-supported by the integrated APIs.

Coverage for international exchanges may vary depending on provider support.

Future versions will expand support to additional global markets.

---

# 5. Portfolio Analytics

The portfolio module currently provides:

- Holdings management
- Asset allocation
- Basic calculations

Advanced financial analytics such as:

- Sharpe Ratio
- Beta
- Alpha
- Portfolio optimization
- Monte Carlo simulations

are outside the scope of this assignment.

---

# 6. AI Chat Context

The AI chat currently focuses on report-specific conversations.

It does not maintain long-term conversational memory across multiple sessions.

Future versions may incorporate persistent memory using vector databases.

---

# 7. Real-Time Data

The platform retrieves data when analyses are requested.

It does not currently stream live market updates or real-time price changes.

Future versions may integrate WebSockets and streaming market providers.

---

# 8. Offline Support

AlphaLens AI requires internet connectivity to access:

- Authentication
- Financial APIs
- News APIs
- AI services

Offline operation is not currently supported.

---

# 9. Notification System

Notifications are generated for major user actions such as completed analyses and exports.

Advanced notification capabilities such as scheduled alerts, email notifications, and push notifications are planned for future releases.

---

# 10. Export Features

Reports can currently be exported as:

- PDF
- Markdown
- JSON

Future releases may support:

- DOCX
- Excel
- PowerPoint
- Shareable report links
- Cloud storage integrations

---

# 11. Testing Coverage

The project has been manually tested across major workflows, including:

- Authentication
- Analysis generation
- Database operations
- Navigation
- Report exports

Due to project time constraints, a comprehensive automated testing suite (unit, integration, and end-to-end tests) has not yet been implemented.

This would be a priority before deploying the platform in a production environment.

---

# 12. Security Considerations

The platform uses Clerk for secure authentication and protects sensitive API keys through environment variables.

Additional production hardening could include:

- Rate limiting
- Request throttling
- Audit logging
- Security monitoring
- Role-based access control
- Penetration testing

---

# 13. Deployment Dependencies

Successful deployment depends on correctly configuring external services, including:

- Neon PostgreSQL
- Clerk Authentication
- Gemini API
- Alpha Vantage API
- GNews API

Misconfigured environment variables or unavailable third-party services may impact functionality.

---

# Summary

The identified limitations primarily stem from external service dependencies and the scope of the assignment rather than architectural constraints.

The platform has been intentionally designed with modularity and extensibility in mind, allowing these limitations to be addressed incrementally without major architectural changes.

Despite these constraints, AlphaLens AI successfully demonstrates a scalable, full-stack AI-powered investment research platform with modern engineering practices and a strong foundation for future development.