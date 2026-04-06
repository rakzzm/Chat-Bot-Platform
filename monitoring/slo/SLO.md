# Service Level Objectives (SLOs) for Megh EngageX

## Overview

SLOs define reliability targets. Error budgets track how much unreliability is acceptable before action is required.

## SLO Definitions

### SLO-1: API Availability
- **Target:** 99.9% uptime (43.2 minutes downtime/month allowed)
- **Measurement:** `up{service="megh-backend"}` over 30-day window
- **Error Budget:** 0.1% of requests can fail

### SLO-2: API Response Time
- **Target:** 95% of requests complete in < 1 second
- **Measurement:** `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service="megh-backend"}[30d]))`
- **Error Budget:** 5% of requests can be slow

### SLO-3: Error Rate
- **Target:** < 0.1% of requests return 5xx errors
- **Measurement:** `rate(http_requests_total{status=~"5.."}[30d]) / rate(http_requests_total[30d])`
- **Error Budget:** 0.1% error rate

### SLO-4: AI Inference Latency
- **Target:** 95% of AI inferences complete in < 5 seconds
- **Measurement:** `histogram_quantile(0.95, rate(ai_inference_duration_seconds_bucket[30d]))`
- **Error Budget:** 5% of inferences can be slow

### SLO-5: Database Availability
- **Target:** 99.95% uptime (21.6 minutes downtime/month allowed)
- **Measurement:** `pg_up` over 30-day window
- **Error Budget:** 0.05% downtime

## Error Budget Policy

| Budget Remaining | Action |
|-----------------|--------|
| > 50% | Normal operations |
| 25-50% | Increase monitoring, review recent incidents |
| 10-25% | Freeze non-critical feature deployments, focus on reliability |
| < 10% | Emergency: All hands on reliability, only bug fixes deployed |
| 0% (Exhausted) | Deployment freeze, post-mortem required, reliability sprint |

## Prometheus Recording Rules

Add to `prometheus/prometheus.yml`:

```yaml
rule_files:
  - 'alert_rules.yml'
  - 'slo_rules.yml'
```

Create `prometheus/slo_rules.yml`:

```yaml
groups:
  - name: slo-recordings
    interval: 1m
    rules:
      # API Availability (30-day window)
      - record: slo:api_availability:ratio_rate30d
        expr: avg_over_time(up{service="megh-backend"}[30d])

      # API Error Rate (30-day window)
      - record: slo:api_error_rate:ratio_rate30d
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[30d]))
          /
          sum(rate(http_requests_total[30d]))

      # API Response Time p95 (30-day window)
      - record: slo:api_response_time_p95:seconds
        expr: |
          histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[30d])) by (le))

      # Error Budget Remaining (%)
      - record: slo:api_availability_error_budget_remaining
        expr: |
          (0.999 - slo:api_availability:ratio_rate30d) / 0.001 * 100

      - record: slo:api_error_rate_budget_remaining
        expr: |
          (0.001 - slo:api_error_rate:ratio_rate30d) / 0.001 * 100
```

## SLO Alert Rules

```yaml
# Add to alert_rules.yml

# Error Budget Burn Rate - Fast burn (14.4x normal rate)
- alert: SLOErrorBudgetFastBurn
  expr: |
    slo:api_error_rate:ratio_rate_rate1h > 14.4 * 0.001
    and
    slo:api_error_rate:ratio_rate_rate5m > 14.4 * 0.001
  for: 3m
  labels:
    severity: critical
    priority: P0
  annotations:
    summary: "SLO error budget burning fast (14.4x)"
    description: "Error budget will be exhausted in < 1 hour at current rate."

# Error Budget Burn Rate - Slow burn (6x normal rate)
- alert: SLOErrorBudgetSlowBurn
  expr: |
    slo:api_error_rate:ratio_rate_rate6h > 6 * 0.001
    and
    slo:api_error_rate:ratio_rate_rate30m > 6 * 0.001
  for: 15m
  labels:
    severity: warning
    priority: P1
  annotations:
    summary: "SLO error budget burning slowly (6x)"
    description: "Error budget will be exhausted in < 6 hours at current rate."

# Error Budget Low
- alert: SLOErrorBudgetLow
  expr: slo:api_error_rate_budget_remaining < 10
  for: 5m
  labels:
    severity: critical
    priority: P0
  annotations:
    summary: "SLO error budget critically low"
    description: "Only {{ $value }}% of error budget remaining."
```
