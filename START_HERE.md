# Start Here: PCS Developer Runtime

**Run the tutorial.** It's 10 minutes and shows you:
- State outside the model (see `.pcs/decisions.json` on disk)
- Binding constraints (violations blocked at runtime)
- Cross-model continuity (Claude → Llama without losing state)

**[→ TUTORIAL.md](TUTORIAL.md)**

---

## Evaluation Paths

### If You Have 5 Minutes

1. Read [README](README.md) overview
2. Understand what PCS changes:
   - Decisions persist outside the model
   - Constraints remain binding
   - Model changes don't erase project state

**You'll understand:** The substrate-centered vs model-centered distinction

---

### If You Have 15 Minutes

1. Read [README](README.md)
2. **Run the [tutorial](TUTORIAL.md)** (10 min hands-on)
3. Experience the three architectural moments

**You'll understand:** What PCS feels like in practice

---

### If You Have 30 Minutes

1. Run the tutorial
2. Read [PROJECT_SCOPE.md](PROJECT_SCOPE.md) - What this runtime is/isn't
3. Read [ACCESS_AND_LICENSING.md](ACCESS_AND_LICENSING.md) - Next steps
4. Explore the commands (`pcs status`, `pcs audit show`)

**You'll understand:** The scope and boundaries of this developer runtime

---

### Hands-On Evaluation (Recommended)

**Start here if you learn by doing:**

1. **Run the tutorial** (10 min) - [TUTORIAL.md](TUTORIAL.md)
2. Experience:
   - State persisting outside the model (see `.pcs/decisions.json` on disk)
   - Runtime constraint enforcement (violations blocked)
   - Cross-model continuity (switch from Claude to Llama without losing state)
3. Then read the architecture docs to understand what you just experienced

---

## Understanding the Architecture

**After the tutorial, read:**

- [persistra-public](https://github.com/persistra-ai/persistra-public) - Architectural thesis and overview
- [ARCHITECTURE_OVERVIEW.md](https://github.com/persistra-ai/persistra-public/blob/main/ARCHITECTURE_OVERVIEW.md) - Six architectural invariants
- [VALIDATION_SUMMARY.md](https://github.com/persistra-ai/persistra-public/blob/main/VALIDATION_SUMMARY.md) - What's proven

---

## What This Runtime Is

**PCS Developer Runtime is:**
- ✅ Local evaluation runtime for experiencing persistent cognitive substrate
- ✅ Demonstration of state outside model, binding constraints, cross-model continuity
- ✅ Hands-on way to understand the architectural difference
- ✅ Starting point for evaluating PCS concepts

**PCS Developer Runtime is NOT:**
- ❌ Full PCS reference implementation
- ❌ Production deployment runtime
- ❌ Complete primitive catalog (15/37 primitives)
- ❌ Enterprise-ready system

**See [PROJECT_SCOPE.md](PROJECT_SCOPE.md) for complete boundaries.**

---

## Next Steps

**After experiencing the tutorial:**

1. **For conceptual understanding:** Read [persistra-public](https://github.com/persistra-ai/persistra-public)
2. **For validation evidence:** See [VALIDATION_SUMMARY.md](https://github.com/persistra-ai/persistra-public/blob/main/VALIDATION_SUMMARY.md)
3. **For commercial/strategic discussions:** See [ACCESS_AND_LICENSING.md](ACCESS_AND_LICENSING.md)
4. **For deeper technical validation:** Request NDA access to full test suites

---

**The tutorial is the fastest way to understand why PCS is architecturally different.**
