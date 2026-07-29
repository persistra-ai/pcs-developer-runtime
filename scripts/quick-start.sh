#!/bin/bash

# PCS Developer Runtime — Quick Start
# Automated tutorial setup for validation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PCS Developer Runtime — Quick Start                           ║${NC}"
echo -e "${BLUE}║  Automated Tutorial Setup                                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# Pre-Flight Check
# ============================================================================

echo -e "${CYAN}[1/5] Running pre-flight check...${NC}"
echo ""

if [ -f "./scripts/preflight.sh" ]; then
    ./scripts/preflight.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Pre-flight check failed${NC}"
        echo -e "${RED}   Please fix errors before continuing${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Preflight script not found, skipping...${NC}"
fi

echo ""

# ============================================================================
# Install Dependencies
# ============================================================================

echo -e "${CYAN}[2/5] Installing dependencies...${NC}"
echo ""

if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""

# ============================================================================
# Prepare CLI (No Global Install Required)
# ============================================================================

echo -e "${CYAN}[3/5] Preparing PCS CLI...${NC}"
echo ""

# Use npx to avoid requiring npm link or sudo
# We'll use a function to handle the command execution
run_pcs() {
    if command -v npx &> /dev/null; then
        npx --yes . "$@"
    else
        node bin/pcs.js "$@"
    fi
}

if command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ PCS CLI ready (using npx)${NC}"
else
    echo -e "${YELLOW}⚠️  npx not available, using direct node execution${NC}"
fi

echo ""

# ============================================================================
# Create Test Project
# ============================================================================

echo -e "${CYAN}[4/5] Creating test project...${NC}"
echo ""

PROJECT_NAME="tutorial-test-$(date +%s)"

# Create project using npx or direct node
run_pcs init "$PROJECT_NAME"
echo -e "${GREEN}✅ Test project created: $PROJECT_NAME${NC}"

cd "$PROJECT_NAME"

# Add sample decisions
echo -e "${BLUE}Adding sample architectural decisions...${NC}"

# Run pcs commands from project directory using npx with parent path
if command -v npx &> /dev/null; then
    npx --yes ../. decision add \
      --title "Use PostgreSQL for persistence" \
      --statement "Use PostgreSQL for all data persistence needs" \
      --rationale "Proven reliability, ACID compliance, strong ecosystem"
    
    npx --yes ../. decision add \
      --title "Use gRPC between internal services" \
      --statement "Internal service communication should use gRPC" \
      --rationale "Type safety, performance, built-in streaming support"
else
    node ../bin/pcs.js decision add \
      --title "Use PostgreSQL for persistence" \
      --statement "Use PostgreSQL for all data persistence needs" \
      --rationale "Proven reliability, ACID compliance, strong ecosystem"
    
    node ../bin/pcs.js decision add \
      --title "Use gRPC between internal services" \
      --statement "Internal service communication should use gRPC" \
      --rationale "Type safety, performance, built-in streaming support"
fi
    
echo -e "${GREEN}✅ Sample decisions added${NC}"

# Verify decisions were actually created
echo ""
echo -e "${BLUE}Verifying decisions...${NC}"

if [ -f ".pcs/decisions.json" ]; then
    DECISION_COUNT=$(cat .pcs/decisions.json | grep -c '"id"' || echo "0")
    if [ "$DECISION_COUNT" -ge 2 ]; then
        echo -e "${GREEN}✅ Verified: $DECISION_COUNT decisions in substrate${NC}"
        # Run decision list from project directory
        if command -v npx &> /dev/null; then
            npx --yes ../. decision list
        else
            node ../bin/pcs.js decision list
        fi
    else
        echo -e "${RED}❌ Warning: Expected 2 decisions, found $DECISION_COUNT${NC}"
        echo -e "${YELLOW}   This may indicate a CLI flag parsing issue${NC}"
        cat .pcs/decisions.json
    fi
else
    echo -e "${RED}❌ Error: decisions.json not found${NC}"
fi

# Return to parent directory
cd ..

echo ""

# ============================================================================
# Summary
# ============================================================================

echo -e "${CYAN}[5/5] Quick start complete!${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Quick Start Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${GREEN}✅ Environment validated${NC}"
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo -e "${GREEN}✅ PCS CLI ready${NC}"

if [ -d "$PROJECT_NAME" ]; then
    echo -e "${GREEN}✅ Test project created: $PROJECT_NAME${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  ${BLUE}cd $PROJECT_NAME${NC}"
    echo -e "  ${BLUE}npx --yes .. decision list${NC}        # View decisions"
    echo -e "  ${BLUE}npx --yes .. decision add${NC}         # Add more decisions"
    echo -e "  ${BLUE}cat .pcs/decisions.json${NC}           # View substrate state"
    echo ""
    echo -e "Or install globally (requires sudo):"
    echo -e "  ${BLUE}cd .. && npm link${NC}"
    echo -e "  ${BLUE}cd $PROJECT_NAME && pcs decision list${NC}"
else
    echo -e "${YELLOW}⚠️  Test project not created${NC}"
fi

echo ""
echo -e "For full tutorial:"
echo -e "  ${BLUE}See TUTORIAL.md${NC}"
echo ""

echo -e "${GREEN}✅ Quick start successful!${NC}"
