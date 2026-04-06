# Megh EngageX — Bug Tracking & Triage Workflow

## 1. Severity Levels

| Level | Name | Response Time | Fix Time | Description |
|-------|------|---------------|----------|-------------|
| **P0** | Critical | 1 hour | 4 hours | System down, data loss, security breach |
| **P1** | High | 4 hours | 24 hours | Major feature broken, no workaround |
| **P2** | Medium | 24 hours | 72 hours | Feature broken, workaround exists |
| **P3** | Low | 48 hours | Next sprint | Cosmetic, minor inconvenience |

## 2. Bug Triage Process

### Step 1: Intake (Automated)
- Bug filed via GitHub Issue template
- Auto-labeled with `triage`
- Assigned to triage rotation

### Step 2: Initial Triage (< 2 hours)
1. Verify the bug is reproducible
2. Assign severity level (P0-P3)
3. Assign component label
4. Set assignee based on component:
   - **Backend API** → Devin
   - **Frontend UI** → Fiona
   - **Widget** → Fiona
   - **AI/ML Service** → Alex Rivera
   - **Database** → Devin
   - **Infrastructure** → Cameron

### Step 3: Investigation
- Assignee investigates root cause
- Update issue with findings
- Adjust severity if needed

### Step 4: Fix & Verification
- Fix implemented in feature/hotfix branch
- PR reviewed by at least one team member
- Automated tests pass
- Deployed to staging for verification

### Step 5: Release
- Merged to main
- Deployed to production
- Issue closed with resolution notes

## 3. Escalation Matrix

| Severity | Initial Owner | Escalation (if SLA breached) |
|----------|---------------|------------------------------|
| P0 | On-call engineer | Marcus Chen (CTO) → Rakesh (CEO) |
| P1 | Component owner | Marcus Chen (CTO) |
| P2 | Component owner | Team lead |
| P3 | Component owner | Next sprint planning |

## 4. Labels

| Label | Purpose |
|-------|---------|
| `bug` | Confirmed bug |
| `triage` | Needs triage review |
| `P0`, `P1`, `P2`, `P3` | Severity level |
| `backend`, `frontend`, `widget`, `ai-ml`, `database`, `infrastructure` | Component |
| `in-progress` | Being worked on |
| `needs-review` | Fix ready for review |
| `verified` | Fix verified in staging |
| `wontfix` | Will not be fixed (with reason) |
| `duplicate` | Duplicate of another issue |

## 5. SLA Tracking

- All P0/P1 issues must have a comment within response SLA
- SLA breaches automatically escalate per matrix above
- Weekly SLA compliance report generated

## 6. Automated Bug Report Templates

Three templates are available in `.github/ISSUE_TEMPLATE/`:
- `bug_report.yml` — Standard bug reports with severity/component fields
- `feature_request.yml` — Feature suggestions
- `performance_issue.yml` — Performance and stability issues
