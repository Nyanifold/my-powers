---
name: writing-module-specs
description: "Use after the module description document is confirmed. Brainstorm each leaf module serially, write complete specs including progressive implementation sections."
---

# Writing Module Specs — Module Specification Writing

Brainstorm each leaf module in sequence, writing complete specification documents. Present all generated specs to the user for review together; after user confirmation, proceed to splitting-specs.

**Declaration:** 「I am using my-powers:writing-module-specs, current module: <name>」

**Task tracking:** For each leaf module, create a "Module <name> spec" task with TaskCreate. Mark it in_progress when starting and completed after the review passes and the spec is committed.

<HARD-GATE>
Do not call splitting-specs until the user confirms all specs. Each module's spec must include an "Iteration Plan" section.

The spec must resolve all technology choices and specific algorithms — no "TBD" left behind. The only exception: items the user explicitly says "this is work for a future version" during the discussion. Once the user confirms the spec, they are no longer involved in these decisions.
</HARD-GATE>

## Anti-Pattern: "This Module Is Simple, I Can Skip the Draft Confirmation"

Every module goes through this process. Skipping the draft confirmation just defers disagreements to the implementation phase, where the cost of rework is much higher. The spec can be short, but it must be written through discussion and confirmed by the user — you cannot assume requirement details.

**"The user probably knows what I'm building" is not the same as "the user has confirmed this spec."**

## Processing Order

1. Read `docs/my-powers-output/YYYY-MM-DD-modules.md`, extract all leaf module list
2. Order leaf modules by dependency (depended-on modules first)
3. Execute the "Single Module Brainstorming Process" serially for each module
4. After all modules complete, list all spec files for user review
5. After user confirmation (or TODO annotation), call splitting-specs

## Single Module Brainstorming Process

### Step 1: Declare and Review Context

Declare the current module and briefly recap its definition from the module description document:
> "Beginning spec brainstorming for module '<name>'. Per the module description document, this module's responsibilities are <...>, external interfaces include <...>."

**On internal details mentioned in modules.md:**

modules.md focuses on boundaries and interfaces, but sometimes lightly mentions internal implementation directions (e.g., data structure names, storage approach, internal layering). These are **not constraints** — the spec phase starts from scratch on internal design. Any conclusion reached here is valid as long as it doesn't conflict with the **boundaries and external interfaces** defined in modules.md. Do not treat internal details from modules.md as settled conclusions and skip the corresponding discussion.

### Step 2: Ask Clarifying Questions One at a Time

**Rules:**
- Ask only one question at a time; wait for the user's answer before asking the next
- For each question, offer 3-5 concrete options and briefly explain the core tradeoff of each, helping the user make an informed choice rather than just picking a name
- When structure or relationships need illustration, use ASCII trees, ASCII block diagrams, or mermaid/dot syntax

**Cover the following dimensions (choose applicable ones based on module nature):**

- **Functional requirement refinement**
  - What is the specific behavior of core features?
  - Are there priority distinctions?

- **Constraints and non-functional requirements**
  - Performance requirements? Latency limits? Throughput?
  - Reliability requirements? Need retries, idempotency?
  - Security boundaries? What data needs protection?

- **Interface details**
  - Specific fields of data structures?
  - How are error cases classified and returned?
  - Any version compatibility considerations?

- **Edge cases with adjacent modules**
  - How does this module handle errors returned by dependent modules?
  - Is there state that needs cross-module synchronization?

- **Technology choices and algorithms (must all be resolved in this discussion)**
  - Which algorithm for core functionality? (e.g., inverted index vs. vector search; priority queue vs. timing wheel)
  - Which library or framework?
  - Storage approach? (specific choice of relational / document / KV)
  - Any other choices that affect how the module is implemented?
  - **Rule: any choice the user has not explicitly deferred to "a future version" must be fully decided here — nothing left open.**

- **Iteration plan**
  - Which features form the minimal set for system operation (Core)?
  - Are there natural feature groupings suited for delivery as separate update phases?
  - Are there dependency orderings between update phases?
  - Based on feature scope and dependencies, how many update phases are recommended?

### Step 3: Present Design Proposals

Present in segments; confirm each before continuing:
1. **Architecture overview** — Main internal components of the module (include class diagrams if complex)
2. **Interface refinement** — More detailed interface definitions than the module description document (include ER diagrams for persistence modules)
3. **Error handling strategy** — How each type of error is handled
4. **Iteration plan** — Core's minimal set scope, plus the feature boundaries and ordering of each update phase

### Step 4: Draft Confirmation

After presenting all design proposals, **before writing the formal spec file**, follow these steps:

1. Write the discussion conclusions to `docs/my-powers-output/drafts/YYYY-MM-DD-<module>-spec-draft.md`, listing each key point with a `- [ ]` checkbox:

```markdown
## Key Points Checklist

- [ ] **Architecture overview**: <internal components>
- [ ] **Exposed interfaces**: <interface definition summary>
- [ ] **Dependent external interfaces**: <dependency summary>
- [ ] **Error handling strategy**: <strategy>
- [ ] **Iteration plan Core**: <feature list>
- [ ] **Iteration plan Update N**: <feature list> (if applicable)
```

2. Ask the user to confirm one point at a time:
   > "Please confirm the architecture overview: [content] — is this correct?"

3. After the user confirms, change `- [ ]` to `- [x]`; if changes are requested, update the draft and re-confirm.

4. Once all items are `- [x]`, ask the user:
   > "All key points have been confirmed. May I proceed to write the formal spec file?"
   Wait for explicit user approval before proceeding to Step 5.

### Step 5: Write the Spec File

File path: `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md`

```markdown
# <module-name> Spec

> Generated: YYYY-MM-DD
> Parent system module description: docs/my-powers-output/YYYY-MM-DD-modules.md

## Overview

<2-3 sentences describing the module's positioning and role>

## Responsibilities and Boundaries

**Responsibilities:**
<List>

**Out of scope (boundaries):**
<List>

## Architecture Overview

<Describe the main internal components of the module and how they collaborate>

<!-- Diagram notes:
  - Simple internal structure (≤3 classes/components): text description or ASCII block diagram is sufficient
  - Multiple classes/structs collaborating: include a Class Diagram (UML),
    using mermaid/dot classDiagram syntax, showing class attributes, methods, inheritance and composition
  - Complex concurrent flows or business branches: include an Activity Diagram,
    using mermaid/dot flowchart syntax
  - Data processing/ETL type module: include a Data Flow Diagram (DFD),
    using mermaid/dot flowchart or ASCII block diagram showing how data flows and transforms internally
-->

## Interface Definitions

### Exposed Interfaces

<One section per interface, including:>
- Name and protocol (HTTP/gRPC/message queue/function call, etc.)
- Request/input parameters (field name, type, required/optional, description)
- Response/output (field name, type, description)
- Error codes and meanings

<!-- Diagram notes (persistence modules):
  If this module manages persistent data, include an ER diagram here,
  showing entities, field types, primary/foreign keys, relationships (one-to-many/many-to-many, etc.).
  Use mermaid/dot erDiagram syntax.
  The ER diagram is part of the interface definition, not an optional appendix.
-->

### Dependent External Interfaces

<Interfaces this module calls on other modules, same format>

## Functional Requirements

<One section per feature, describing expected behavior including happy path and error path>

<!-- Diagram notes:
  - Features with clear state transitions (order status, connection state, task lifecycle, etc.):
    include a State Machine Diagram, showing states, trigger events, transition conditions.
    Use mermaid/dot stateDiagram-v2 syntax.
  - Criterion: if an object has more than 3 states with different transition conditions, a state machine diagram is warranted
-->

## Non-Functional Requirements

- **Performance:** <Latency/throughput requirements, or "No hard requirements for now">
- **Reliability:** <Retry strategy, idempotency requirements>
- **Security:** <Authentication, authorization, data protection requirements>

## Iteration Plan

> This section defines the iteration phases for this module. The number of phases is determined by feature scope and dependency relationships — from one to many.
> Each phase layers on top of the previous phase without breaking existing interfaces.

### Core: <minimal runnable set name>

> After Core is complete, the module should run independently and the system should function correctly.

- <Feature 1>: <Brief description>
- <Feature 2>: <Brief description>

### Update 1: <feature-name>

> Layers on top of Core without breaking existing interfaces.

- <Feature A>: <Brief description, including interface differences from the preceding phase (if any)>

<!-- If there are more update phases, continue with the format below. If not, delete this comment and the example. -->

### Update N: <feature-name>

- <Feature X>: <Brief description>

## Open Questions (TODO)

<Only items the user explicitly said "this is work for a future version" during discussion. Technology choices, algorithm selections, interface fields, error handling approaches, and any other decision needed for implementation must NOT appear here — these must be fully resolved in the spec.>
```

## Diagram Usage Specification (spec scope)

| Diagram Type | Placement | When to Use |
|-------------|-----------|-------------|
| Class Diagram (UML) | Architecture Overview | ≥ 4 classes/structs collaborating within the module |
| Activity Diagram | Architecture Overview | Complex concurrent branches or multi-path business processes |
| Data Flow Diagram (DFD) | Architecture Overview | Data processing/ETL modules emphasizing data transformation over control flow |
| ER Diagram | Interface Definitions | Module manages persistent data (mandatory, not optional) |
| State Machine Diagram | Functional Requirements | Objects with ≥ 3 states and different transition conditions |

**Diagrams NOT placed in spec:** Sequence diagrams (cross-module interaction), component diagrams, deployment diagrams — these belong in modules.md.

### Step 6: Self-Review

After writing the spec file, check the following items and fix issues inline — no need to record them:

- [ ] Iteration Plan section exists and Core scope is explicit (no "TBD" placeholders)
- [ ] Each functional requirement covers both happy path and error path
- [ ] Interface definitions are field-level (field name/type/required), not just protocol names
- [ ] Boundaries (out of scope) section is non-empty
- [ ] No dependency ordering issues across Update phases
- [ ] No unexplained TBD/TODO placeholders
- [ ] Open Questions section contains no technology choices or algorithm decisions (only items the user explicitly deferred to a future version)

Proceed to dispatching the review subagent only after all items pass.

### Step 7: Dispatch Review Subagent

Use the template in `spec-reviewer-prompt.md` to dispatch a review subagent (standard model), providing:
- Spec file path
- The module's definition paragraph from modules.md (extracted and passed in by the coordinator)

Review results:
- Approved → Commit the spec file to git, continue to the next module
- Issues Found → Modify the spec → Re-dispatch the same review subagent for re-review (do not skip re-review)

## After All Modules Complete

List all generated spec files:

```
All module specs have been generated:

- docs/my-powers-output/specs/YYYY-MM-DD-<module-1>-spec.md
- docs/my-powers-output/specs/YYYY-MM-DD-<module-2>-spec.md
- ...

Please review each one. For each spec, you may:
- Confirm as-is
- Propose modifications (I will revise and re-confirm that spec with you)
- Mark as leave it TODO (this module won't be implemented yet; keep the documentation)

Once all specs are confirmed, I will proceed to the next phase.
```

**Wait for explicit user confirmation of all specs.**

On modification requests: Modify the corresponding spec → Re-confirm with the user → Continue waiting for other specs' confirmation.

After all confirmed: invoke the splitting-specs sub-skill — read `splitting-specs/SKILL.md`.

## Red Flags

**Never:**
- Ask multiple questions in a single message
- Skip the "Iteration Plan" section
- Call splitting-specs before the user confirms all specs
- Commit a spec before the review subagent passes
- Submit without re-review after issues are found
- Pass review with Update phases that have dependency ordering issues uncorrected
- Skip the draft confirmation flow and write the formal spec directly
- Start writing the formal spec without user approval even after all key points are confirmed
- Treat internal implementation hints in modules.md as settled conclusions and skip the corresponding discussion
- Use "TBD" to defer a technology choice or algorithm — unless the user explicitly said "future version", the spec must make the choice; nothing left open
