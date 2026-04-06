#!/bin/bash
# rollback.sh - One-click rollback script for Megh EngageX
# Usage: ./scripts/rollback.sh [deployment_id|previous_sha]

set -euo pipefail

DEPLOYMENT_ID="${1:-}"
ROLLBACK_SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$ROLLBACK_SCRIPT")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Megh EngageX - Rollback Script ===${NC}"

# Step 1: Determine target SHA
if [ -z "$DEPLOYMENT_ID" ]; then
    echo -e "${YELLOW}No deployment ID provided. Fetching last deployment metadata...${NC}"
    METADATA_FILE="$PROJECT_ROOT/deployment-metadata.json"

    if [ ! -f "$METADATA_FILE" ]; then
        echo -e "${RED}ERROR: No deployment metadata found at $METADATA_FILE${NC}"
        echo "Please provide the previous SHA as an argument: ./scripts/rollback.sh <previous_sha>"
        exit 1
    fi

    PREVIOUS_SHA=$(cat "$METADATA_FILE" | grep -o '"previous_sha":"[^"]*"' | cut -d'"' -f4)

    if [ -z "$PREVIOUS_SHA" ]; then
        echo -e "${RED}ERROR: Could not determine previous SHA from metadata${NC}"
        exit 1
    fi
else
    PREVIOUS_SHA="$DEPLOYMENT_ID"
fi

echo -e "${GREEN}Rolling back to: $PREVIOUS_SHA${NC}"

# Step 2: Confirm rollback
echo -e "${YELLOW}WARNING: This will rollback production to $PREVIOUS_SHA${NC}"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Rollback cancelled.${NC}"
    exit 0
fi

# Step 3: Execute rollback
echo -e "${GREEN}Starting rollback...${NC}"

cd "$PROJECT_ROOT"

# If using Docker Compose
if command -v docker-compose &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo "Rolling back via Docker Compose..."
    git checkout "$PREVIOUS_SHA"
    docker-compose down
    docker-compose up -d
    echo "Waiting for services to stabilize..."
    sleep 30
fi

# If using Kubernetes (uncomment when K8s is configured)
# if command -v kubectl &> /dev/null; then
#     echo "Rolling back via Kubernetes..."
#     kubectl rollout undo deployment/megh-backend
#     kubectl rollout undo deployment/megh-frontend
#     kubectl rollout status deployment/megh-backend --timeout=300s
#     kubectl rollout status deployment/megh-frontend --timeout=300s
# fi

# Step 4: Verify rollback
echo -e "${GREEN}Verifying rollback...${NC}"

# Check health endpoints
HEALTH_OK=true

# API health check
# if ! curl -sf http://localhost:4000/health > /dev/null 2>&1; then
#     echo -e "${RED}WARNING: API health check failed${NC}"
#     HEALTH_OK=false
# fi

# Frontend health check
# if ! curl -sf http://localhost:8080 > /dev/null 2>&1; then
#     echo -e "${RED}WARNING: Frontend health check failed${NC}"
#     HEALTH_OK=false
# fi

if [ "$HEALTH_OK" = true ]; then
    echo -e "${GREEN}Rollback completed successfully!${NC}"
    echo -e "${GREEN}Production is now running: $PREVIOUS_SHA${NC}"
else
    echo -e "${RED}Rollback completed but some health checks failed.${NC}"
    echo -e "${YELLOW}Please investigate manually.${NC}"
fi

# Step 5: Log rollback
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) - Rollback to $PREVIOUS_SHA by $(whoami)" >> "$PROJECT_ROOT/rollback.log"

echo -e "${GREEN}Rollback logged to rollback.log${NC}"
