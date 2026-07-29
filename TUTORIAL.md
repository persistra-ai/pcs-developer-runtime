# Persistent Project Assistant

**A 10-minute walkthrough of persistent cognitive substrate**

---

## What You'll Learn

In this tutorial, you'll experience three architectural moments that demonstrate PCS is not a stateful assistant—it's a different architectural layer:

1. **State lives outside the model** - Decisions and constraints persist independently
2. **Constraints remain binding** - Runtime enforcement, not advisory prompts
3. **Model changes don't erase work** - Continuity across providers

**Time:** 10-15 minutes  
**Prerequisites:** Node.js 18+, API keys for Anthropic and Groq

---

## Setup

**Using GitHub Codespaces?** The runtime is already installed and linked. Skip to "Set API Keys" below.

### Install PCS Developer Runtime (Local Setup Only)

```bash
cd pcs-developer-runtime
npm install
npm link
```

### Set API Keys

```bash
export ANTHROPIC_API_KEY=your_anthropic_key_here
export GROQ_API_KEY=your_groq_key_here
```

---

## Part 1: Initialize Project with Substrate State

### Step 1: Create Project

```bash
pcs init my-backend
cd my-backend
```

**Expected output:**
```
✅ Created PCS project: my-backend
✅ Initialized substrate state in .pcs/
✅ Project ready

Next steps:
  cd my-backend
  pcs decision add    # Add architectural decisions
  pcs vision set      # Set project vision
```

**What happened:**
- Created a local PCS project
- Initialized substrate state in `.pcs/`
- Decisions, constraints, vision, and trace are now persisted outside the model

**Verify:**
```bash
ls -la .pcs/
# Should show: decisions.json, constraints.json, vision.json, trace.json
```

**Key insight:** This is not a chat session. This is a project with persistent state.

---

### Step 2: Add Architectural Decisions

**Run `pcs decision add` twice to add two decisions:**

**Decision 1:**
- Title: `Use PostgreSQL for persistence`
- Statement: `Use PostgreSQL for all data persistence needs`
- Rationale: `Proven reliability, ACID compliance, strong ecosystem`

**Decision 2:**
- Title: `Use gRPC between internal services`
- Statement: `Internal service communication should use gRPC`
- Rationale: `Type safety, performance, built-in streaming support`

**Verify:**
```bash
pcs decision list
```

**What you see:**
```
=== Active Decisions (2) ===

[abc123] Use PostgreSQL for persistence
  Use PostgreSQL for all data persistence needs
  Rationale: Proven reliability, ACID compliance, strong ecosystem
  Created: 5/12/2026, 12:00:00 PM

[def456] Use gRPC between internal services
  Internal service communication should use gRPC
  Rationale: Type safety, performance, built-in streaming support
  Created: 5/12/2026, 12:01:00 PM
```

**What this shows:** These are not chat notes. They are active project decisions in substrate state.

**See the state yourself:**
```bash
cat .pcs/decisions.json
```

**What you see:**
```json
{
  "decisions": [
    {
      "id": "abc123",
      "title": "Use PostgreSQL for persistence",
      "statement": "Use PostgreSQL for all data persistence needs",
      "rationale": "Proven reliability, ACID compliance, strong ecosystem",
      "created": "2026-05-12T12:00:00Z"
    },
    {
      "id": "def456",
      "title": "Use gRPC between internal services",
      "statement": "Internal service communication should use gRPC",
      "rationale": "Type safety, performance, built-in streaming support",
      "created": "2026-05-12T12:01:00Z"
    }
  ]
}
```

**Key insight:** This state exists on your disk, independent of any model or runtime. The assistant doesn't "remember" these decisions—it reads them from authoritative substrate state.

---

### Step 3: Add Binding Constraint

```bash
pcs constraint add
```

**Add constraint:**
- Title: `Java-only backend`
- Rule: `Backend services must use Java; do not generate Python backend code`
- Mode: `block`

**Verify:**
```bash
pcs constraint list
```

**What you see:**
```
=== Active Constraints (1) ===

[ghi789] Java-only backend
  Rule: Backend services must use Java; do not generate Python backend code
  Mode: block
  Created: 5/12/2026, 12:02:00 PM
```

**Why this matters:** This constraint will be enforced at runtime, not just suggested.

---

### Step 4: Set Project Vision

```bash
pcs vision set
```

**Set vision:**
```
Build a modular microservices backend with strong internal consistency and low operational complexity
```

**Verify:**
```bash
pcs vision show
```

**Check project status:**
```bash
pcs status
```

**What you see:**
```
=== PCS Project Status ===

Project: my-backend
Created: 5/12/2026, 12:00:00 PM

Active Decisions: 2
Active Constraints: 1
Vision: Set

Audit Events: 5
```

**Architectural point:** All substrate state is now active and inspectable.

---

## Part 2: Experience Runtime Enforcement

### Step 5: Start Assistant with Substrate Context

```bash
pcs run assistant
```

**What you see:**
```
=== PCS Project Assistant: my-backend ===
Model: claude-sonnet-4-6
Substrate loaded: 2 decisions, 1 constraint, vision
Active Decisions: 2
Active Constraints: 1
Vision: Set

Type your message (or 'exit' to quit):
```

**Key insight:** The runtime pre-loaded substrate state before the first prompt. This is not context-window stuffing—it's architectural binding. The assistant knows about your decisions, constraints, and vision before you say anything.

---

### Step 6: Request Compliant Design

**You:**
```
Design the initial service structure for the backend
```

**Assistant response (excerpt):**
```
# Initial Service Structure for `my-backend`

## Architecture Overview

Given the project vision (modular microservices, strong internal consistency, 
low operational complexity), here's a pragmatic structure...

## Recommended Services

my-backend/
├── api-gateway/
├── user-service/
├── core-service/
...
```

**Key insight:** The assistant explicitly references your vision and incorporates your decisions (PostgreSQL, gRPC, Java).

**This is not chat memory. The vision visibly shapes the response.**

---

### Step 7: Trigger Constraint Violation

**You:**
```
Generate a FastAPI Python backend for the auth service
```

**Assistant response:**
```
I cannot fulfill that request because it violates active project constraints:

- **Java-only backend**: Backend services must use Java; do not generate Python backend code

Please revise your request to comply with the project constraints, or update the 
constraints if they need to change.
```

**⚠️ Constraint violation recorded in Decision Trace**

**Key insight:** This is runtime enforcement, not a keyword filter. The constraint is:
- Cited by title
- Explained clearly
- Enforced at runtime boundary
- Recorded in audit trail

**This is not prompt engineering. This is governed project state.**

---

### Step 8: Inspect Decision Trace

Exit the assistant (type `exit`), then:

```bash
pcs audit show
```

**What you see:**
```
=== Decision Trace (last 10 events) ===

[5/12/2026, 12:00:00 PM] Project Created
  my-backend
  Initialized substrate state store

[5/12/2026, 12:01:00 PM] Decision Added
  Use PostgreSQL for persistence
  This decision is now active in project state

[5/12/2026, 12:02:00 PM] Decision Added
  Use gRPC between internal services
  This decision is now active in project state

[5/12/2026, 12:03:00 PM] Constraint Added
  Java-only backend
  This constraint will be enforced at runtime

[5/12/2026, 12:04:00 PM] Vision Set
  "Build a modular microservices backend..."
  Vision will guide all assistant interactions

[5/12/2026, 12:05:00 PM] Session Started
  Model: claude-sonnet-4-6

[5/12/2026, 12:07:00 PM] ⚠️  Constraint Violation Blocked
  Request: "Generate a FastAPI Python backend for the auth service"
  Violated constraints:
    - Java-only backend: Backend services must use Java; do not generate Python backend code
  Action: Request blocked by runtime enforcement

This trace shows all substrate state changes and runtime enforcement actions.
```

**Key insight:** Full inspectability. You can see:
- What state is active
- What blocked the request
- What model was used
- Why the runtime behaved as it did

**This is not a log dump. This is substrate inspectability.**

---

## Part 3: Experience Model-Agnostic Continuity

### Step 9: Resume with Different Model

```bash
pcs run assistant --model llama-3.1-8b-instant --resume
```

**What you see:**
```
Resuming session from 5/12/2026, 12:05:00 PM
Previous model: claude-sonnet-4-6

=== PCS Project Assistant: my-backend ===
Model: llama-3.1-8b-instant
Active Decisions: 2
Active Constraints: 1
Vision: Set

Type your message (or 'exit' to quit):
```

**Key insight:** Different model, same project state.

---

### Step 10: Verify Continuity

**You are now asking a different model to continue the same governed project without rebuilding the context manually.**

**You:**
```
What are the main architectural decisions so far?
```

**Assistant response:**
```
Based on the project vision, decisions, and constraints, the main architectural 
decisions made so far are:

1. **Database Management System (DBMS)**: We will use **PostgreSQL** for all 
   data persistence needs. PostgreSQL is chosen for its proven reliability, 
   ACID compliance, and strong ecosystem.

2. **Inter-Service Communication Protocol**: We will use **gRPC** for internal 
   service communication. gRPC provides type safety, performance, and built-in 
   streaming support...
```

**Key insight:** The new model (Llama) correctly recalls:
- PostgreSQL decision
- gRPC decision
- Java-only constraint
- Project vision

**The model changed. The project state did not.**

**This is what it means for authoritative project state to live outside the model.**

---

## What You Just Experienced

### Three Architectural Moments

**1. State Outside Model**
- Decisions, constraints, vision persist independently
- Not stored in chat history
- Inspectable through Decision Trace
- Survives process restart

**2. Binding Constraints**
- Runtime enforcement at project boundary
- Not advisory prompts
- Violations blocked and explained
- Recorded in audit trail

**3. Model-Agnostic Continuity**
- Same state across different models
- Coherent continuation without re-grounding
- Provider swap doesn't erase work
- Model doesn't own the state

---

## This Is Not

- ❌ Persistent chat history
- ❌ Keyword filtering
- ❌ Prompt engineering
- ❌ Chatbot wrapper with rules
- ❌ Just a stateful coding assistant

---

## This Is

- ✅ Persistent cognitive substrate
- ✅ Runtime enforcement of governed state
- ✅ Authoritative project state outside the model
- ✅ Model-agnostic execution
- ✅ Built-in provenance and inspectability

---

## What Makes This Architectural

**Constraint enforcement felt like:**
- Runtime boundary enforcement
- Clear citation of violated constraint
- Helpful redirection
- Recorded in inspectable trace

**Vision impact felt like:**
- Explicitly referenced in responses
- Visibly shaped design choices
- Actively used, not just included
- Guided architectural philosophy

**Model swap felt like:**
- The project persisted
- The model did not own the state
- State is outside the model
- Continuity across providers

---

## FAQ: Why Not Just Use System Prompts?

### Q: Why can't I just put "Use Java" in my system prompt?

**A: Because system prompts are advisory and ephemeral.**

| System Prompt | PCS Constraint |
|---------------|----------------|
| Advisory suggestion | Structurally binding |
| Ephemeral (per-session) | Persistent (cross-session) |
| Subject to prompt injection | Runtime-enforced boundary |
| Disappears on model change | Survives model transitions |
| No audit trail | Full decision trace |
| Probabilistic compliance | Deterministic enforcement |

**The difference:**
- **System prompt:** "Please use Java"
- **PCS constraint:** "Backend services **must** use Java; violations blocked at runtime"

**Try it yourself:**
1. Ask a model with a system prompt "Use Java" to generate Python code
2. It will often comply despite the instruction
3. PCS constraints are enforced at the runtime boundary—violations are blocked

**This is why PCS is substrate-centered, not prompt-centered.**

---

## Next Steps

### Explore More

```bash
# View all commands
pcs

# Check project status anytime
pcs status

# Inspect decision trace
pcs audit show

# Add more decisions
pcs decision add

# Update vision
pcs vision set
```

### Understand the Architecture

This Developer Runtime demonstrates core PCS capabilities:
1. State outside model (decisions, constraints, vision persist)
2. Binding constraints (runtime enforcement, not advisory)
3. Session continuity (resume without re-grounding)
4. Model-agnostic state (swap models without losing context)
5. Built-in provenance (decision trace for all changes)

For more on PCS architecture, see: [persistra-public documentation](https://github.com/persistra-ai/persistra-public)

### What's Not Included

This Developer Runtime is intentionally focused on demonstrating substrate concepts. It does **not** include:
- Distributed or federated substrate
- Advanced CSE (Context Salience Engine)
- Team coordination features
- Production deployment capabilities
- Conformance certification

For production deployment, team coordination, or enterprise features, contact us about **PCS Commercial Runtime**.

---

## The Key Realization

**In 10 minutes, you experienced:**

Authoritative project state can live outside the model and persist across sessions, constraints, decisions, and model changes.

**That is the architectural shift PCS is exposing.**

---

## Troubleshooting

### Quick Fixes

#### Pre-Flight Check

**Before starting, validate your environment:**

```bash
cd pcs-developer-runtime
./scripts/preflight.sh
```

This checks:
- Node.js version (18+)
- npm availability
- Dependencies installed
- PCS CLI linked
- API keys set
- Disk space

#### Quick Start (Automated Setup)

**For automated tutorial setup:**

```bash
./scripts/quick-start.sh
```

This automatically:
- Runs preflight check
- Installs dependencies
- Links PCS CLI
- Creates test project
- Adds sample decisions

---

### Common Issues

#### Issue 1: "pcs: command not found"

**Symptom:** Running `pcs` commands fails

**Solution:**
```bash
# Re-link the CLI
cd pcs-developer-runtime
npm link

# Verify
pcs --version
```

**Alternative (if npm link fails):**
```bash
# Use npx instead
npx pcs init my-backend
npx pcs decision add
```

---

#### Issue 2: API Keys Not Set

**Symptom:** Commands requiring API access fail

**Solution:**
```bash
export ANTHROPIC_API_KEY=your_key_here
export GROQ_API_KEY=your_key_here

# Verify
echo $ANTHROPIC_API_KEY
```

**For GitHub Codespaces:**
```bash
# Set in terminal (temporary)
export ANTHROPIC_API_KEY=your_key_here

# Or add to ~/.bashrc (persistent)
echo 'export ANTHROPIC_API_KEY=your_key_here' >> ~/.bashrc
source ~/.bashrc
```

---

#### Issue 3: Not in PCS Project

**Symptom:** `Error: Not in a PCS project directory`

**Solution:**
```bash
# Make sure you're in a project directory
cd my-backend

# Or create a new project
pcs init new-project
cd new-project

# Verify
ls .pcs/
```

---

#### Issue 4: Node Version Too Old

**Symptom:** `Error: Node.js version must be 18 or higher`

**Solution:**
```bash
# Check current version
node --version

# Install Node 18+ from https://nodejs.org
# Or use nvm:
nvm install 18
nvm use 18

# Verify
node --version
```

---

#### Issue 5: Dependencies Not Installed

**Symptom:** `Error: Cannot find module...`

**Solution:**
```bash
cd pcs-developer-runtime
npm install

# Verify
ls node_modules/
```

---

#### Issue 6: Permission Errors

**Symptom:** `EACCES: permission denied`

**Solution:**
```bash
# Fix npm global permissions (macOS/Linux)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then re-link
npm link
```

---

#### Issue 7: GitHub Codespaces Issues

**Symptom:** Codespace won't start or build fails

**Solution:**
1. **Check Codespace status** - Wait for build to complete (~1-2 min)
2. **Rebuild container** - Click "Rebuild Container" in VS Code
3. **Check logs** - View build logs for specific errors
4. **Manual setup** - If auto-setup fails:
   ```bash
   npm install
   npm link
   ./scripts/preflight.sh
   ```

---

### Advanced Troubleshooting

#### Debug Mode

**Enable verbose output:**
```bash
DEBUG=* pcs decision add
```

#### Check State Files

**Inspect substrate state:**
```bash
# View decisions
cat .pcs/decisions.json | json_pp

# View constraints
cat .pcs/constraints.json | json_pp

# View vision
cat .pcs/vision.json | json_pp
```

#### Clean State

**Reset project state:**
```bash
# Backup first
cp -r .pcs .pcs.backup

# Remove state
rm -rf .pcs

# Re-initialize
pcs init .
```

---

### Still Having Issues?

1. **Run preflight check:**
   ```bash
   ./scripts/preflight.sh
   ```

2. **Check GitHub Issues:** [pcs-developer-runtime/issues](https://github.com/persistra-ai/pcs-developer-runtime/issues)

3. **Review documentation:** [README.md](README.md), [START_HERE.md](START_HERE.md)

4. **Contact support:** research@persistra.ai (for NDA access holders)

---

### Prevention Tips

**Before starting tutorial:**

1. **Run preflight check:**
   ```bash
   ./scripts/preflight.sh
   ```

2. **Use GitHub Codespaces** (zero setup):
   - Click "Open in GitHub Codespaces" badge in README
   - Wait for container to build
   - Start tutorial immediately

3. **Set API keys first:**
   ```bash
   export ANTHROPIC_API_KEY=your_key_here
   export GROQ_API_KEY=your_key_here
   ```

4. **Verify environment:**
   ```bash
   node --version  # Should be 18+
   npm --version
   pcs --version
   ```

---

**Tutorial complete. You've experienced persistent cognitive substrate.**
