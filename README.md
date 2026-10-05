# PCS Developer Runtime

**Local evaluation runtime for persistent cognitive substrate**

---

## Overview

PCS Developer Runtime is a local evaluation runtime for experiencing persistent cognitive substrate in long-horizon AI work. It externalizes authoritative project state outside the model, so decisions, constraints, vision, continuity, and decision traces persist across sessions and model changes.

The current public runtime is intentionally focused on one flagship workflow—**Persistent Project Assistant**—to demonstrate the architecture clearly. It is not the full PCS reference implementation or a production deployment runtime.

---

## What PCS Changes

- **Decisions persist outside the model** - Project decisions are stored in authoritative substrate state, not chat memory
- **Constraints remain binding** - Runtime enforces project constraints, blocking violations
- **Vision persists across sessions** - Project vision survives restarts and model changes
- **Model changes do not erase project state** - Swap between Anthropic and Groq-hosted models without losing continuity
- **Audit/decision trace stays inspectable** - Full visibility into what decisions are active and what blocked requests

---

## Installation

**Requires Node.js 20.6 or later** (check with `node --version`).

```bash
git clone git@github.com:persistra-ai/pcs-developer-runtime.git
cd pcs-developer-runtime
npm install
npm link  # Makes 'pcs' command available globally
```

### Environment Setup

Create a `.env` file in the `pcs-developer-runtime` directory with your API keys:

```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
GROQ_API_KEY=your_groq_key_here
```

`pcs` loads `.env` from the current directory and from the `pcs-developer-runtime` directory. Variables already exported in your shell take precedence.

### Automated Setup (Optional)

```bash
./scripts/preflight.sh    # Check Node, npm, CLI, and API keys
./scripts/quick-start.sh  # Install, create a test project, add sample decisions
```

---

## Get Started: 10-Minute Tutorial

**Experience the three architectural moments that make PCS different:**

1. **State lives outside the model** - Decisions and constraints persist independently
2. **Constraints remain binding** - Runtime enforcement, not advisory prompts  
3. **Model changes don't erase work** - Continuity across providers

**→ [Start the Tutorial](TUTORIAL.md)** - Complete walkthrough with actual runtime transcripts

---

## Quick Start

```bash
# Create a new project
pcs init my-backend

# Navigate to project
cd my-backend

# Add project decisions
pcs decision add
# Example: "Use PostgreSQL for persistence"

# Add project constraints
pcs constraint add
# Example: "Backend services must use Java"

# Set project vision
pcs vision set
# Example: "Build a modular microservices backend"

# Start assistant session
pcs run assistant

# View project status
pcs status

# View decision trace
pcs audit show
```

---

## Example Session

```bash
# Initialize project
$ pcs init my-backend
✓ Created PCS project: my-backend
✓ Initialized substrate state store

# Add architectural decision
$ cd my-backend
$ pcs decision add
Decision title: Use PostgreSQL
Decision statement: Use PostgreSQL for persistence
Rationale (optional): Proven reliability and ACID compliance

✓ Added decision: Use PostgreSQL

# Add binding constraint
$ pcs constraint add
Constraint title: Java-only backend
Constraint rule: Backend services must use Java
Enforcement mode (block/warn) [block]: block

✓ Added constraint: Java-only backend

# Set project vision
$ pcs vision set
Project vision: Build a modular microservices backend with strong internal consistency

✓ Set project vision

# Start assistant (Anthropic)
$ pcs run assistant
=== PCS Project Assistant: my-backend ===
Model: claude-sonnet-4-6
Active Decisions: 1
Active Constraints: 1
Vision: Set

> Design the initial service structure

# Initial Service Structure for `my-backend`

## Architecture Overview

Given the project vision (modular microservices, strong internal consistency, 
low operational complexity), here's a pragmatic structure...

> Generate a FastAPI Python backend for the auth service

I cannot fulfill that request because it violates active project constraints:

- **Java-only backend**: Backend services must use Java; do not generate Python backend code

Please revise your request to comply with the project constraints, or update the 
constraints if they need to change.

> exit

# Switch to a Groq-hosted model
$ pcs run assistant --model openai/gpt-oss-120b --resume
Resuming session from 5/12/2026, 11:57:07 AM
Previous model: claude-sonnet-4-6

=== PCS Project Assistant: my-backend ===
Model: openai/gpt-oss-120b
[Session continues with same decisions/constraints/vision]

> What are the main architectural decisions so far?

Based on the project vision, decisions, and constraints, the main architectural 
decisions made so far are:

1. **Database Management System (DBMS)**: We will use **PostgreSQL** for all 
   data persistence needs. PostgreSQL is chosen for its proven reliability, 
   ACID compliance, and strong ecosystem.

2. **Inter-Service Communication Protocol**: We will use **gRPC**...

# Inspect decision trace
$ pcs audit show
=== Decision Trace (last 10 events) ===

[5/12/2026, 11:56:48 AM] Session Started
  Model: claude-sonnet-4-6
  Provider: anthropic

[5/12/2026, 11:57:07 AM] ⚠️  Constraint Violation Blocked
  Request: "Generate a FastAPI Python backend for the auth service"
  Violated constraints:
    - Java-only backend: Backend services must use Java; do not generate Python backend code
  Action: Request blocked by runtime enforcement

[5/12/2026, 11:57:07 AM] Session Started
  Model: openai/gpt-oss-120b
  Provider: groq
  Resumed from previous session

This trace shows all substrate state changes and runtime enforcement actions.
```

---

## What Is Included

The Developer Runtime includes:
- **Single-user, local-only** evaluation experience
- **File-based state storage** for decisions, constraints, vision, decision trace
- **Two model integrations**: Anthropic (cloud API) and Groq (cloud API)
- **Runtime constraint enforcement** - blocks violations, records in decision trace
- **Session resumption** - continue work across sessions
- **Model swap capability** - switch models without losing state
- **Inspectable audit trail** - full visibility into substrate state

---

## What Is NOT Included

The Developer Runtime does **not** include:
- Distributed or federated substrate
- Advanced CSE (Context Salience Engine)
- Team coordination or multi-user features
- Conformance testing or certification
- Full commercial runtime features
- Enterprise deployment capabilities
- Hardware acceleration
- Production-grade orchestration

For production deployment, team coordination, advanced salience, or enterprise features, contact us about **PCS Commercial Runtime**.

---

## Commands Reference

### Project Management
- `pcs init <project-name>` - Create new PCS project
- `pcs status` - Show project status snapshot

### Decisions
- `pcs decision add` - Add project decision
- `pcs decision list` - List active decisions

### Constraints
- `pcs constraint add` - Add binding constraint
- `pcs constraint list` - List active constraints

### Vision
- `pcs vision set` - Set project vision
- `pcs vision show` - Show current vision

### Assistant
- `pcs run assistant` - Start assistant session
- `pcs run assistant --model <name>` - Use specific model
- `pcs run assistant --resume` - Resume previous session
- `pcs run assistant --debug` - Show debug information

### Audit
- `pcs audit show` - Show audit/decision trace

---

## Supported Models

### Anthropic (Cloud API)
- `claude-sonnet-4-6` (default)
- `claude-opus-4-7`
- `claude-haiku-4-5-20251001`

### Groq (Cloud API)
- `openai/gpt-oss-120b` (default)
- `openai/gpt-oss-20b`
- `qwen/qwen3.8-27b`

---

## Project Scope

**What is this repository?** A bounded local evaluation runtime for one flagship workflow.

**What is it not?** The full PCS implementation, commercial runtime, or production deployment package.

For complete scope definition, see: **[PROJECT_SCOPE.md](PROJECT_SCOPE.md)**

---

## Architecture Note

**PCS (Persistent Cognitive Substrate)** is an architectural approach to externalizing authoritative state from AI models. The Developer Runtime demonstrates core substrate capabilities:

1. **State outside model** - Decisions, constraints, vision persist independently
2. **Binding constraints** - Runtime enforcement, not advisory prompts
3. **Session continuity** - Resume without manual re-grounding
4. **Model-agnostic state** - Swap models without losing context
5. **Built-in provenance** - Audit trail for all state changes

This is **not persistent chat history**. It is governed project state that remains available, inspectable, and reusable across sessions and model changes.

For more on PCS architecture, see: [persistra-public documentation](https://github.com/persistra-ai/persistra-public)

---

## License

Source-available for evaluation and non-commercial use. See **[LICENSE](LICENSE)** file for complete terms.

For commercial use, production deployment, or enterprise features, contact:

**Exocortical Concepts, Inc.**  
Contact: licensing@persistra.ai

---

## Support

This is an evaluation runtime with best-effort community support:
- Documentation: This README and inline help
- Issues: GitHub issues for bug reports
- No SLA or high-touch support

For enterprise support, see PCS Commercial Runtime.
