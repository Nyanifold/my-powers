---
name: module-brainstorming
description: "Use before any implementation. Discuss system decomposition with the user, define module boundaries, interfaces and conventions, write the module description document."
---

# Module Brainstorming — Module Decomposition and Boundary Definition

Decompose the system into modules with clear boundaries that are relatively independent. Once module boundaries are well-defined, changes within a module should not affect how other modules call it.

**Declaration:** 「I am using my-powers:module-brainstorming」

**Task tracking:** Use TaskCreate to create a task for each item in the checklist. Complete them in order and mark each done with TaskUpdate.

<HARD-GATE>
Do not enter writing-module-specs until the user confirms the module description document. Do not begin writing specs when module boundaries are fuzzy and interfaces are undefined.
</HARD-GATE>

## Anti-Pattern: "This System Doesn't Need Decomposition"

Every system goes through this process. Systems that "seem simple" are exactly where unexamined assumptions cause wasted effort downstream. The decomposition discussion can be short — for a genuinely simple system, the valid conclusion is "one module" — but you must complete the discussion and get user confirmation. "The system is simple" is not a reason to skip the process.

**"One module" is a valid conclusion reached through discussion, not a reason to skip discussion.**

## Checklist

Complete each item in order:

1. **Explore existing context** — For existing projects, check code structure, docs, recent commits
2. **Discuss system decomposition** — Ask questions one at a time, identify the system's main components
3. **Identify tight coupling zones** — Don't decompose tightly coupled areas; keep them as one module
4. **Define leaf modules** — For each finest-granularity module, define responsibilities, boundaries, interfaces
5. **Collect reference materials** — Check whether the working directory has project infrastructure; check whether the user mentioned any reference materials. If so, dispatch a subagent with the initial module breakdown to report the relevant files or directories per module. If not, record "no reference materials" and continue
6. **Write module description document** — First write `docs/my-powers-output/drafts/YYYY-MM-DD-modules-draft.md`, confirm each key point, then write the formal document to `docs/my-powers-output/YYYY-MM-DD-modules.md`, commit to git
7. **Wait for user confirmation** — Call writing-module-specs once there are no objections

## Discussing System Decomposition

**Questioning approach:**
- Ask only one question at a time
- For each question, offer 3-5 concrete options and briefly explain the core tradeoff of each, helping the user make an informed choice rather than just picking a name. Example: frontend/backend separate — clear interface boundaries, independent iteration, but requires maintaining an API contract; monolithic — less development friction, shared types, but boundaries tend to blur as the system grows
- Go from high-level to detail; don't start with details

**Decomposition dimensions (choose applicable ones based on system type):**
- Runtime location: server / client / edge
- Responsibility layer: data collection / processing / storage / presentation
- Data flow: generation / cleaning / training / inference / evaluation
- Deployment unit: frontend / backend / database / message queue / worker process
- User interaction: API layer / business logic layer / persistence layer

**Decomposition principles:**
- Decomposition is hierarchical — find top-level boundaries first, then refine downward
- Don't force decomposition of tight coupling: if two parts' interfaces change frequently with each other's internal implementation, they should be one module
- Leaf module criteria: given the boundary and interface contract, internal changes don't affect external callers
- Leaf modules may have internal sub-modules (internal organization details; no separate spec or task file required) — this is fine
- **If the system is simple enough to be a single module with no meaningful split, that is a valid conclusion — accept it; don't decompose for the sake of decomposing**

**Identifying tight coupling:**
- Ask: "What data structures do these two parts share?"
- Ask: "If A changes its internal implementation, does B need to change too?"
- If the answer is "yes" and can't be isolated through interfaces, merge into one module

## Defining Each Leaf Module

For each leaf module, clarify the following:

**Responsibilities (what it does):**
- One sentence describing this module's core responsibility
- List the main data or state it manages

**Boundaries (what it doesn't do):**
- Explicitly list what is NOT part of this module
- This prevents module bloat and responsibility creep

**External interfaces:**
- APIs, message formats, file formats, protocols exposed to other modules
- Interfaces must be stable: they don't change with internal implementation changes
- Only define interface shapes here (inputs/outputs/error types), no implementation details

**Dependencies on other modules:**
- List the call direction (A calls B, not B calls A)
- Circular dependencies signal boundary definition problems

**Dependencies on existing implementations:**
- List existing code, libraries, services, or external systems this module will directly reuse or wrap
- Specify the dependency style: direct call / wrapped and re-exposed / used as underlying driver
- If the module itself is an encapsulation layer over existing implementations, state clearly what is being wrapped and what interfaces are exposed
- If there are no existing implementation dependencies, write "None"

## Collecting Reference Materials Before Writing the Draft

After discussion is complete and before entering the draft writing phase, perform the following check:

**Trigger conditions (either one is sufficient):**
- The current working directory contains project code, config files, documentation, or other infrastructure
- The user mentioned reference materials during the conversation (codebases, docs, design files, etc.)

**When reference materials exist:** Use the template in `reference-collector-prompt.md` to dispatch an Explore subagent, providing:
- Initial module breakdown (list of module names)
- Directories or files to investigate

After the subagent completes, attach the reference material mapping to the draft for use in the spec phase. If additional notes touch on module decomposition, discuss with the user and adjust module definitions if needed.

**When no reference materials exist:** Record "no project infrastructure, no reference materials" and proceed directly to the draft confirmation flow.

---

## Module Description Document Structure

Save to `docs/my-powers-output/YYYY-MM-DD-modules.md`:

```markdown
# System Module Description

> Generated: YYYY-MM-DD
> System name: <name>

## Module Tree

<Hierarchical list, use indentation for hierarchy, mark leaf nodes with *; leaf nodes may have sub-modules>

Example:
- Frontend
  - Router layer *
  - Component layer * (leaf modules may have sub-modules; sub-modules don't need their own spec)
    - Form components
    - List components
  - State management layer *
- Backend
  - API layer *
  - Business logic layer *
  - Persistence layer *

## Module Definitions

### <module-name> (leaf)

**Responsibilities:** <One sentence>

**Boundaries (excluded):** <List>

**External interfaces:**
<Interface description, including protocol/format/main method signatures>

**Dependencies:** <List, or "None">

**Dependencies on existing implementations:** <library/service/code path + dependency style, or "None">

---
(One section per leaf module)

## Inter-Module Dependencies

<Brief description of call directions>

<!-- Diagram notes:
  - Few modules (≤5): text description or ASCII block diagram is sufficient
  - Many modules or complex dependencies: include a Component Diagram,
    using mermaid/dot flowchart or graph syntax, showing each module as a component with dependency arrows
  - Multi-node deployment (multiple servers, containers, edge nodes): include a Deployment Diagram,
    using mermaid/dot flowchart or ASCII block diagram showing which modules run on which nodes and network relationships
-->

## Cross-Module Interaction Sequences

<!-- Diagram notes:
  For each important cross-module use case (call chains involving 3+ modules),
  include a Sequence Diagram showing message flow order.
  Use mermaid/dot sequenceDiagram syntax.
  Single-module internal calls don't need to appear here — those belong in each module's spec.

  Deciding whether a sequence diagram is needed:
  - Call chain involves only 2 modules → text description is sufficient
  - Call chain involves 3+ modules, or has async messaging, callbacks → include a sequence diagram

  One section per sequence diagram, format:
  ### <Use case name>
  <Sequence diagram>
  <Necessary supplementary text>
-->

## Open Questions

<Undecided items from discussion, left for the spec phase to resolve>

## Spec Writing Order

<List leaf modules ordered from fewest to most dependencies:>

1. <module-name> — no dependencies (or external libraries only)
2. <module-name> — depends on: <Module A>
3. <module-name> — depends on: <Module A>, <Module B>
...

<!-- Note:
  Writing specs often reveals that module communication interfaces need adjustment.
  Starting from the least-dependent modules means interface changes propagate forward only,
  and don't invalidate specs that are already complete.
  This order also serves as the execution order for the writing-module-specs phase.
-->
```

## Diagram Usage Specification (modules.md scope)

| Diagram Type | Placement | When to Use |
|-------------|-----------|-------------|
| Component Diagram | Inter-Module Dependencies section | ≥ 6 modules, or dependencies too complex for text |
| Deployment Diagram | Inter-Module Dependencies section | System has multi-node deployment needs |
| Sequence Diagram | Cross-Module Interaction Sequences section | Use case involves ≥ 3 modules in call chain, or has async messaging |

**Diagrams NOT placed in modules.md:** ER diagrams, class diagrams, state machine diagrams, activity diagrams, data flow diagrams — these describe internal module details and belong in each module's spec.

## Draft Confirmation Flow

After the user answers all questions, **before writing any formal document**, follow these steps:

### Step 1: Write the draft

Write the discussion results to `docs/my-powers-output/drafts/YYYY-MM-DD-modules-draft.md`, listing each key point with a `- [ ]` checkbox:

```markdown
# System Module Description (Draft — Pending Confirmation)

## Key Points Checklist

- [ ] **Module tree structure**: [complete module tree]
- [ ] **<Module A> definition**: Responsibilities: ...; Boundaries: ...; Interfaces: ...
- [ ] **<Module B> definition**: Responsibilities: ...; Boundaries: ...; Interfaces: ...
- [ ] **Inter-module dependencies**: ...
```

One line per leaf module, summarizing responsibilities, boundaries, and interfaces.

### Step 2: Confirm one point at a time

Ask the user to confirm one point per message. For each point, **fully expand the content** of that item and **explain the rationale** behind the decision — why this structure or boundary was chosen over the alternatives discussed. Example format:

> "Please confirm the **module tree structure**:
>
> [Full module tree with all leaf nodes]
>
> **Rationale:** [Why the system is split this way — e.g., X and Y are separated because their change frequencies differ; A and B are kept together because their interfaces are tightly coupled and abstracting them adds no stability benefit.]
>
> Is this correct?"

After the user confirms, change the corresponding `- [ ]` to `- [x]`.  
If the user requests a change, update the draft and re-confirm that item before moving on.

### Step 3: Request to proceed after all points confirmed

Once all items are `- [x]`, ask the user:

> "All key points have been confirmed. May I proceed to write the formal module description document `docs/my-powers-output/YYYY-MM-DD-modules.md`?"

Wait for explicit user approval before writing the formal document and committing to git.

## Self-Review

After writing the formal document, check the following items and fix issues inline — no need to record them:

- [ ] Every leaf module includes all five fields: responsibilities, boundaries, external interfaces, module dependencies, existing implementation dependencies
- [ ] Interface definitions describe only shape (inputs/outputs/error types) — no implementation details
- [ ] No circular dependencies in the module dependency graph
- [ ] Spec writing order is consistent with the dependency relationships
- [ ] No undecided items missing from the Open Questions section

Proceed to dispatching the review subagent only after all items pass.

## Dispatch Review Subagent

Use the template in `modules-reviewer-prompt.md` to dispatch a review subagent (standard model), providing:
- Module description document path

Review results:
- Approved → Enter user confirmation gate
- Issues Found → Modify modules.md → Re-dispatch the same review subagent for re-review (do not skip re-review)

## User Confirmation Gate

After writing the document, inform the user:

> "The module description document has been written to `docs/my-powers-output/YYYY-MM-DD-modules.md` and committed. Please review the module decomposition and interface definitions. Once confirmed, I will begin brainstorming specs for each module one by one. If adjustments are needed, please describe them directly."

Wait for explicit user confirmation. For any modification requests, modify and re-confirm; do not skip.

After confirmation: invoke the writing-module-specs sub-skill — read `writing-module-specs/SKILL.md`.

## Red Flags

**Never:**
- Start writing specs when boundaries are fuzzy
- Define interfaces too concretely (binding to internal implementation)
- Force decomposition of tightly coupled parts
- Force decomposition when the system is genuinely simple (one module is one module)
- Skip user confirmation and go directly to the next phase
- Ask multiple questions in a single message
- Enter user confirmation gate before review subagent passes
- Continue without re-review after issues are found
- Skip the draft confirmation flow and write the formal module description document directly
- Skip the reference material collection step when project infrastructure exists or user mentioned reference materials
- Start writing the formal document without user approval even after all key points are confirmed
