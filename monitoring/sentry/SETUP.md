# Sentry Integration for Megh EngageX

## Overview

Sentry provides real-time error tracking with full stack traces, user context, and release tracking.

## Setup

### 1. Create Sentry Project

1. Go to [sentry.io](https://sentry.io) and create an organization for Megh EngageX
2. Create 3 projects:
   - `megh-backend` (Node.js)
   - `megh-frontend` (React)
   - `megh-ai-service` (Python)

### 2. Backend Integration (Node.js)

Install dependencies:
```bash
cd packages/backend
npm install @sentry/node @sentry/tracing
```

Add to `packages/backend/src/app.ts` (before any other imports):
```typescript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    nodeProfilingIntegration(),
  ],
});

// The rest of your app imports
import express from 'express';
// ...

// Add Sentry error handler as the LAST middleware
app.use(Sentry.Handlers.errorHandler());
```

### 3. Frontend Integration (React)

Install dependencies:
```bash
cd packages/frontend
npm install @sentry/react @sentry/browser @sentry/tracing
```

Add to `packages/frontend/src/index.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
});
```

### 4. AI Service Integration (Python)

Install dependencies:
```bash
cd ai-service
pip install sentry-sdk[fastapi]
```

Add to `ai-service/main.py`:
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN_AI_SERVICE"),
    environment=os.getenv("ENVIRONMENT", "development"),
    traces_sample_rate=1.0,
    integrations=[FastApiIntegration()],
)
```

### 5. Environment Variables

Add to `.env`:
```env
# Sentry
SENTRY_DSN_BACKEND=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN_FRONTEND=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_DSN_AI_SERVICE=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=your_auth_token
```

## Error Tracking Rules

### Auto-Capture
- All unhandled exceptions
- All HTTP 5xx errors
- Database connection failures
- AI inference failures

### Custom Events
```typescript
// Backend: Capture custom errors
Sentry.captureException(new Error('Custom error message'), {
  tags: { component: 'ai-service' },
  user: { id: userId, email: userEmail },
  extra: { prompt: promptText, model: modelName },
});

// Frontend: Capture user actions
Sentry.addBreadcrumb({
  category: 'ui',
  message: 'User clicked send message button',
  level: 'info',
});
```

## Release Tracking

Releases are automatically created via the GitHub Actions workflow (see `.github/workflows/ci.yml`).

## Alert Rules in Sentry

Configure these alert rules in Sentry:
1. **New Issue** — Notify immediately on new error type
2. **Regression** — Notify when resolved issue reappears
3. **Error Rate > 5%** — Notify when error rate exceeds threshold
4. **Throughdown** — Notify when event volume drops unexpectedly
