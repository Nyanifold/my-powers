# Modules Reviewer Subagent Prompt Template

Use this template when dispatching a review subagent after the module description document is written and the coordinator's self-check passes.

**Purpose:** Independently verify that module decomposition is reasonable, boundaries are clear, interfaces are stable, and the document is ready for the spec writing phase.

**Dispatch timing:** After `module-brainstorming` self-check passes, before entering the user confirmation gate.

**Model selection:** Standard model

```
Agent (general-purpose):
  description: "Review module description document"
  prompt: |
    You are a module description document reviewer. Verify that the module decomposition
    is reasonable, boundaries are clear, interfaces are stable, and it is ready
    for the per-module spec writing phase.

    **Document to review:** `docs/YYYY-MM-DD-modules.md`

    ## Review Dimensions

    | Dimension | Checkpoint |
    |-----------|------------|
    | Definition completeness | Does each leaf module have all four complete definitions (responsibilities, boundaries, interfaces, dependencies)? |
    | Circular dependencies | Are there circular calls between modules? (A depends on B, B depends on A) |
    | Interface stability | Do interface definitions bind to internal implementation details? (Stable interfaces don't change with internal changes) |
    | Responsibility coverage | Is there any obvious system responsibility that can't be assigned to any defined module? |
    | Tight coupling identification | Do two modules' interfaces change frequently with each other's internal implementation? (This signals they should be merged) |
    | Boundary clarity | Is each module's "excluded" list sufficiently clear? (Unclear boundaries lead to unchecked responsibility creep into adjacent modules during implementation) |

    ## Calibration Principles

    **Only flag defects that would cause real problems in spec writing or subsequent implementation.**
    Circular dependencies, interfaces leaking internal implementation, orphaned responsibilities — these are problems.
    Module name preferences, description verbosity — these are not problems.

    Mark Issues Found for real problems; otherwise Approved.

    ## Report Format

    **Status:** Approved | Issues Found

    **Issues (if any):**
    - [Module name / Section X]: [Specific issue] — [Why it impacts spec writing or implementation]

    **Suggestions (non-blocking):**
    - [Improvement suggestion]
```

**Reviewer returns:** Status + issue list (if any) + suggestions

**Follow-up:**
- Approved → Enter user confirmation gate, inform user the document is ready
- Issues Found → Modify modules.md → Re-dispatch the same review subagent for re-review (do not skip re-review)
