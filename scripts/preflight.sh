#!/bin/bash

# PCS Developer Runtime — Pre-Flight Environment Check
# Validates environment before running tutorial

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  PCS Developer Runtime — Pre-Flight Environment Check         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

ERRORS=0
WARNINGS=0

# ============================================================================
# Check 1: Node.js Version
# ============================================================================

echo -e "${BLUE}[1/6] Checking Node.js version...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo -e "   Install Node.js 20.6+ from: https://nodejs.org"
    ERRORS=$((ERRORS + 1))
else
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
    NODE_MINOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f2)
    
    if [ "$NODE_MAJOR" -lt 20 ] || { [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 6 ]; }; then
        echo -e "${RED}❌ Node.js version must be 20.6 or higher${NC}"
        echo -e "   Found: $NODE_VERSION"
        echo -e "   Required: v20.6.0+"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ Node.js version: $NODE_VERSION${NC}"
    fi
fi

echo ""

# ============================================================================
# Check 2: npm
# ============================================================================

echo -e "${BLUE}[2/6] Checking npm...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm version: $NPM_VERSION${NC}"
fi

echo ""

# ============================================================================
# Check 3: Dependencies
# ============================================================================

echo -e "${BLUE}[3/6] Checking dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed${NC}"
    echo -e "   Run: npm install"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

echo ""

# ============================================================================
# Check 4: PCS CLI
# ============================================================================

echo -e "${BLUE}[4/6] Checking PCS CLI...${NC}"

if ! command -v pcs &> /dev/null; then
    echo -e "${YELLOW}⚠️  'pcs' command not found${NC}"
    echo -e "   Run: npm link"
    echo -e "   Or use: npx pcs <command>"
    WARNINGS=$((WARNINGS + 1))
else
    PCS_VERSION=$(pcs --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✅ PCS CLI available${NC}"
    if [ "$PCS_VERSION" != "unknown" ]; then
        echo -e "   Version: $PCS_VERSION"
    fi
fi

echo ""

# ============================================================================
# Check 5: API Keys
# ============================================================================

echo -e "${BLUE}[5/6] Checking API keys...${NC}"

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  ANTHROPIC_API_KEY not set${NC}"
    echo -e "   Tutorial requires Claude API access"
    echo -e "   Set with: export ANTHROPIC_API_KEY=your_key_here"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ ANTHROPIC_API_KEY is set${NC}"
fi

if [ -z "$GROQ_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  GROQ_API_KEY not set${NC}"
    echo -e "   Tutorial requires Groq API access (model swap step)"
    echo -e "   Set with: export GROQ_API_KEY=your_key_here"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ GROQ_API_KEY is set${NC}"
fi

echo ""

# ============================================================================
# Check 6: Disk Space
# ============================================================================

echo -e "${BLUE}[6/6] Checking disk space...${NC}"

if command -v df &> /dev/null; then
    AVAILABLE=$(df -h . | tail -1 | awk '{print $4}')
    echo -e "${GREEN}✅ Available disk space: $AVAILABLE${NC}"
else
    echo -e "${YELLOW}⚠️  Could not check disk space${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Pre-Flight Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo -e "${GREEN}   Ready to run tutorial${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  ${BLUE}pcs init my-project${NC}       # Start tutorial"
    echo -e "  ${BLUE}./scripts/quick-start.sh${NC}  # Automated setup"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Pre-flight completed with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}   Tutorial may run but some features might be limited${NC}"
    echo ""
    echo -e "You can proceed with:"
    echo -e "  ${BLUE}pcs init my-project${NC}       # Start tutorial"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Pre-flight failed with $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo -e "${RED}   Please fix errors before running tutorial${NC}"
    echo ""
    exit 1
fi
