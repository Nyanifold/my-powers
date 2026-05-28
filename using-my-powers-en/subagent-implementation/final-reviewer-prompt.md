# Global Final Reviewer Subagent Prompt Template

Use this template when dispatching a global final review subagent after all task stages are complete.

**Purpose:** Perform a global consistency review of the entire implementation, discovering systemic issues introduced across stages.

**Dispatch timing:** `subagent-implementation` Step 3, after all task stages' two-phase reviews pass.

**Model selection:** Most capable model

```
Agent (general-purpose):
  description: "Global final review: <system-name> all modules"
  prompt: |
    You are a global reviewer, performing a global consistency review of the entire system implementation.
    All per-stage module implementations are complete. Your task is to discover systemic issues introduced across stages and modules.

    **Module description document:** `docs/YYYY-MM-DD-modules.md`

    **All spec files:**
    <List all module spec file paths>

    **All implementation reports:**
    <List all report file paths under docs/reports/>

    ## Review Dimensions

    **Interface consistency:**
    - Do each module's exposed interfaces match their spec definitions?
    - Do cross-module call interfaces (caller expectations) match the callee implementations?
    - Are there interfaces that quietly changed during implementation (deviating from spec but not caught by per-stage reviews)?

    **Dependency relationships:**
    - Do call directions between modules conform to modules.md conventions?
    - Are there dependencies not declared in modules.md?
    - Are there circular dependencies?

    **Cross-stage consistency:**
    - Can each module's core version implementation be independently integrated?
    - Are interface reservations from each stage correctly used by subsequent stages?
    - Does any stage's implementation conflict with its report's "Interface Reservations for Subsequent Tasks" description?

    **Demo completeness:**
    - Can each stage's demo run correctly following the "Run Guide" in the implementation report?
    - Do all demo files exist under `demo/<module>/stage-N/`?

    ## Calibration Principles

    Global review focuses on **cross-stage, cross-module** issues; do not repeat what per-stage reviews already covered.
    Single-stage code quality issues were already handled by code quality reviews — do not re-flag them here.

    Only flag:
    - Interface mismatches (caller expectation ≠ callee provision)
    - Dependency relationships violating modules.md conventions
    - Demos that cannot run

    ## Report Format

    **Global review status:** ✅ Pass | ❌ Issues Found

    **Interface mismatches (if any):**
    - Caller [Module A, Stage N] expects: [Specific description]
    - Callee [Module B] actually provides: [Specific description]
    - Suggested fix: [Where to change]

    **Dependency issues (if any):**
    - [Specific description, citing modules.md original text]

    **Demo issues (if any):**
    - `demo/<module>/stage-N/`: [Reason it cannot run]

    **No performative agreement:** Give direct technical judgments; don't say things like "the overall implementation is very good."
```

**Reviewer returns:** Global status + categorized issue list

**Follow-up:**
- ✅ Pass → invoke the finishing-a-module sub-skill — read `finishing-a-module/SKILL.md`
- ❌ Issues Found → Coordinator evaluates impact scope, decides fix strategy (targeted fix / re-implement a stage), re-dispatches global review after fix
