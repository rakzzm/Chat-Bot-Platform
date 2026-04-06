# Stability Monitoring and Alerting Pipeline

## Overview

This directory contains the complete monitoring stack for the Megh EngageX Chat Bot Platform, built on Prometheus, Grafana, and Alertmanager.

## Components

| Service | Port | Purpose |
|---------|------|---------|
| **Prometheus** | 9090 | Metrics collection and storage |
| **Grafana** | 3002 | Dashboards and visualization |
| **Alertmanager** | 9093 | Alert routing and notifications |
| **Node Exporter** | 9100 | System-level metrics |

## Quick Start

```bash
# Start the monitoring stack
docker-compose up -d prometheus grafana alertmanager node-exporter

# Access Grafana: http://localhost:3002 (admin/admin)
# Access Prometheus: http://localhost:9090
# Access Alertmanager: http://localhost:9093
```

## Configuration

### Prometheus (`prometheus/prometheus.yml`)
- Scrapes metrics from all Megh EngageX services every 15 seconds
- Monitors: backend, frontend, AI service, database, Redis, infrastructure
- Loads alert rules from `alert_rules.yml`
- Sends alerts to Alertmanager

### Alert Rules (`prometheus/alert_rules.yml`)

| Alert | Severity | Priority | Condition |
|-------|----------|----------|-----------|
| ServiceDown | critical | P0 | Any service is down for > 1 minute |
| HighErrorRate | critical | P0 | 5xx error rate > 5% for > 2 minutes |
| DatabaseDown | critical | P0 | PostgreSQL unreachable for > 1 minute |
| HighResponseTime | warning | P1 | p95 response time > 2 seconds |
| HighMemoryUsage | warning | P1 | Memory usage > 512MB |
| HighInferenceLatency | warning | P1 | AI inference p95 > 5 seconds |
| HighCPUUsage | warning | P2 | CPU usage > 80% for > 10 minutes |
| DatabaseConnectionPoolExhaustion | warning | P2 | Connection pool > 80% |
| DiskSpaceLow | warning | P2 | Disk space < 10% |

### Alertmanager (`alertmanager/alertmanager.yml`)
- Routes P0/critical alerts to PagerDuty + Slack
- Routes P1/P2/warning alerts to Slack
- Groups alerts by alert name and service
- Sends resolved notifications

### Grafana Dashboards (`grafana/dashboards/`)
- **Platform Overview** — Service uptime, request rate, error rate, response time, memory usage, AI inference latency, database connections, active alerts

## Integration Guide

### Backend Metrics
Add `prom-client` to your Node.js backend:

```javascript
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Expose metrics endpoint
app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

### AI Service Metrics
Add to your Python AI service:

```python
from prometheus_client import Histogram, generate_latest
import time

ai_inference_duration = Histogram(
    'ai_inference_duration_seconds',
    'Duration of AI inference requests',
    labelnames=['model']
)

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Slack Integration
1. Create a Slack Incoming Webhook for your workspace
2. Add `SLACK_WEBHOOK_URL` to your `.env` file
3. Alerts will be sent to `#megh-engagex-alerts` channel

### PagerDuty Integration
1. Create a PagerDuty service with Prometheus integration
2. Add `PAGERDUTY_SERVICE_KEY` to your `.env` file
3. P0/critical alerts will trigger PagerDuty incidents

## Monitoring Checklist

- [x] Prometheus configured with all service scrape targets
- [x] Alert rules defined for P0-P2 severity levels
- [x] Alertmanager routing to Slack and PagerDuty
- [x] Grafana dashboard provisioned with platform overview
- [x] Node Exporter for infrastructure metrics
- [ ] Backend metrics endpoint implemented (requires code changes)
- [ ] AI service metrics endpoint implemented (requires code changes)
- [ ] Slack webhook configured
- [ ] PagerDuty integration configured
