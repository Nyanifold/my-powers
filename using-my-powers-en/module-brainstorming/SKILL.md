---
name: module-brainstorming
description: "Use before any implementation. Discuss system decomposition with the user, define module boundaries, interfaces and conventions, write the module description document."
---

# Module Brainstorming — Module Decomposition and Boundary Definition

Decompose the system into modules with clear boundaries that are relatively independent. Once module boundaries are well-defined, changes within a module should not affect how other modules call it.

**Declaration:** 「I am using my-powers:module-brainstorming」

<HARD-GATE>
Do not enter writing-module-specs until the user confirms the module description document. Do not begin writing specs when module boundaries are fuzzy and interfaces are undefined.
</HARD-GATE>

## Checklist

Complete each item in order:

1. **Explore existing context** — For existing projects, check code structure, docs, recent commits
2. **Discuss system decomposition** — Ask questions one at a time, identify the system's main components
3. **Identify tight coupling zones** — Don't decompose tightly coupled areas; keep them as one module
4. **Define leaf modules** — For each finest-granularity module, define responsibilities, boundaries, interfaces
5. **Write module description document** — Save to `docs/YYYY-MM-DD-modules.md`, commit to git
6. **Wait for user confirmation** — Call writing-module-specs once there are no objections

## Discussing System Decomposition

**Questioning approach:**
- Ask only one question at a time
- Prefer providing options (server/client? frontend/backend separate or monolithic?)
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

## Module Description Document Structure

Save to `docs/YYYY-MM-DD-modules.md`:

```markdown
# System Module Description

> Generated: YYYY-MM-DD
> System name: <name>

## Module Tree

<Hierarchical list, use indentation for hierarchy, mark leaf nodes with *>

Example:
- Frontend
  - Router layer *
  - Component layer *
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
```

## Diagram Usage Specification (modules.md scope)

| Diagram Type | Placement | When to Use |
|-------------|-----------|-------------|
| Component Diagram | Inter-Module Dependencies section | ≥ 6 modules, or dependencies too complex for text |
| Deployment Diagram | Inter-Module Dependencies section | System has multi-node deployment needs |
| Sequence Diagram | Cross-Module Interaction Sequences section | Use case involves ≥ 3 modules in call chain, or has async messaging |

**Diagrams NOT placed in modules.md:** ER diagrams, class diagrams, state machine diagrams, activity diagrams, data flow diagrams — these describe internal module details and belong in each module's spec.

## Dispatch Review Subagent

After self-check passes, use the template in `modules-reviewer-prompt.md` to dispatch a review subagent (standard model), providing:
- Module description document path

Review results:
- Approved → Enter user confirmation gate
- Issues Found → Modify modules.md → Re-dispatch the same review subagent for re-review (do not skip re-review)

## User Confirmation Gate

After writing the document, inform the user:

> "The module description document has been written to `docs/YYYY-MM-DD-modules.md` and committed. Please review the module decomposition and interface definitions. Once confirmed, I will begin brainstorming specs for each module one by one. If adjustments are needed, please describe them directly."

Wait for explicit user confirmation. For any modification requests, modify and re-confirm; do not skip.

After confirmation: Call `my-powers:writing-module-specs`.

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
