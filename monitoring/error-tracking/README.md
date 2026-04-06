# Error Rate Tracking and Regression Prevention

## Overview

This directory contains the error tracking configuration and SLO definitions for Megh EngageX.

## Components

### 1. Sentry Integration (`sentry/`)

Real-time error tracking with stack traces, user context, and release tracking.

- **Setup Guide:** See `sentry/SETUP.md`
- **Projects:** `megh-backend`, `megh-frontend`, `megh-ai-service`
- **Features:**
  - Automatic error capture (unhandled exceptions, 5xx errors)
  - Custom error events with context
  - Release tracking via CI/CD
  - Session replay for frontend debugging

### 2. SLO Definitions (`slo/`)

Service Level Objectives and error budget tracking.

- **SLO Document:** See `slo/SLO.md`
- **SLOs Defined:**
  - API Availability: 99.9% uptime
  - API Response Time: p95 < 1 second
  - Error Rate: < 0.1% 5xx responses
  - AI Inference Latency: p95 < 5 seconds
  - Database Availability: 99.95% uptime

### 3. CI/CD Pipeline (`.github/workflows/ci.yml`)

Enhanced CI pipeline with:
- Coverage reporting
- Security scanning (npm audit)
- Automatic Sentry release creation on main branch pushes

## Error Budget Policy

| Budget Remaining | Action |
|-----------------|--------|
| > 50% | Normal operations |
| 25-50% | Increase monitoring, review incidents |
| 10-25% | Freeze non-critical deployments |
| < 10% | Emergency reliability focus |
| 0% | Deployment freeze, post-mortem required |

## Implementation Checklist

- [x] Sentry setup documentation created
- [x] SLO definitions with Prometheus recording rules
- [x] Error budget burn rate alerts (fast and slow)
- [x] CI/CD pipeline enhanced with coverage and security scanning
- [x] Sentry release creation integrated into CI
- [ ] Sentry SDK installed in backend/frontend/AI service (requires code changes)
- [ ] Sentry DSNs configured in environment variables
- [ ] Prometheus SLO recording rules added to prometheus.yml
