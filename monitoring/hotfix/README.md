# Hotfix Deployment Pipeline

## Overview

Automated CI/CD hotfix workflow for Megh EngageX with approval gates, one-click rollback, and post-deployment verification.

## Hotfix Workflow

### Creating a Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/P0-critical-bug-fix

# 2. Make your fix
# ... edit files ...

# 3. Commit with severity tag
git commit -m "P0: Fix critical authentication bypass vulnerability

- Patched token validation in auth middleware
- Added regression test
- Severity: P0 (Critical)

Co-Authored-By: Paperclip <noreply@paperclip.ing>"

# 4. Push hotfix branch
git push origin hotfix/P0-critical-bug-fix
```

### Automated Pipeline

Pushing to a `hotfix/*` branch triggers the **Hotfix Deployment** workflow:

```
push to hotfix/* 
    → Validate (lint + test + build)
    → Classify Severity (P0/P1/P2 from commit message)
    → Approval Gate (P0/P1 require CTO approval)
    → Deploy to Production
    → Post-Deploy Verification (health checks + error rate)
    → Auto-Rollback (if verification fails)
```

### Manual Trigger

Hotfixes can also be triggered manually via GitHub Actions:

1. Go to **Actions** → **Hotfix Deployment**
2. Click **Run workflow**
3. Select branch and approval requirement
4. Click **Run workflow**

## Approval Process

| Severity | Approval Required | Approvers |
|----------|------------------|-----------|
| P0 (Critical) | Yes | CTO (Marcus Chen) |
| P1 (High) | Yes | CTO or Team Lead |
| P2 (Medium) | No | Auto-deploy after tests pass |

## One-Click Rollback

### Via Script

```bash
# Rollback to previous deployment
./scripts/rollback.sh

# Rollback to specific SHA
./scripts/rollback.sh <commit_sha>
```

### Via GitHub Actions

1. Go to **Actions** → **Hotfix Deployment**
2. Click **Run workflow**
3. Select the previous stable branch
4. Deploy

### Via Kubernetes (when configured)

```bash
# Undo last deployment
kubectl rollout undo deployment/megh-backend
kubectl rollout undo deployment/megh-frontend

# Check rollout status
kubectl rollout status deployment/megh-backend
```

## Post-Deployment Verification

After every hotfix deployment, the pipeline automatically:

1. **Waits 60 seconds** for deployment to stabilize
2. **Checks health endpoints** (API, frontend)
3. **Monitors error rate** (triggers rollback if > 1%)
4. **Notifies team** of success or failure

### Verification Checklist

- [ ] API health endpoint returns 200
- [ ] Frontend loads without errors
- [ ] Error rate < 1% over 5-minute window
- [ ] No new Sentry errors
- [ ] Database migrations (if any) completed successfully
- [ ] AI service responding normally

## Rollback Triggers

Automatic rollback is triggered if:
- Health check fails after deployment
- Error rate exceeds 1% within 5 minutes
- Post-deploy verification job fails

## Deployment Metadata

Each deployment creates a `deployment-metadata.json` file:

```json
{
  "deployment_id": "<commit_sha>",
  "hotfix_branch": "hotfix/P0-critical-bug-fix",
  "previous_sha": "<previous_commit_sha>",
  "deployed_at": "2026-04-06T08:00:00Z",
  "deployed_by": "marcus-chen",
  "severity": "P0"
}
```

## Environment Configuration

### GitHub Environments

Create these environments in GitHub repository settings:

1. **`hotfix-approval`** — Required reviewers: Marcus Chen (CTO)
2. **`production`** — Required reviewers: Marcus Chen (CTO), Rakesh (CEO)

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `SENTRY_AUTH_TOKEN` | Sentry release creation |
| `KUBE_CONFIG` | Kubernetes deployment (optional) |
| `SLACK_WEBHOOK_URL` | Deployment notifications |
