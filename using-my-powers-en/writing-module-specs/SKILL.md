---
name: writing-module-specs
description: "Use after the module description document is confirmed. Brainstorm each leaf module serially, write complete specs including progressive implementation sections."
---

# Writing Module Specs — Module Specification Writing

Brainstorm each leaf module in sequence, writing complete specification documents. Present all generated specs to the user for review together; after user confirmation, proceed to splitting-specs.

**Declaration:** 「I am using my-powers:writing-module-specs, current module: <name>」

<HARD-GATE>
Do not call splitting-specs until the user confirms all specs. Each module's spec must include a "Progressive Implementation" section.
</HARD-GATE>

## Processing Order

1. Read `docs/YYYY-MM-DD-modules.md`, extract all leaf module list
2. Order leaf modules by dependency (depended-on modules first)
3. Execute the "Single Module Brainstorming Process" serially for each module
4. After all modules complete, list all spec files for user review
5. After user confirmation (or TODO annotation), call splitting-specs

## Single Module Brainstorming Process

### Step 1: Declare and Review Context

Declare the current module and briefly recap its definition from the module description document:
> "Beginning spec brainstorming for module '<name>'. Per the module description document, this module's responsibilities are <...>, external interfaces include <...>."

### Step 2: Ask Clarifying Questions One at a Time

**Rules:**
- Ask only one question at a time; wait for the user's answer before asking the next
- Prefer providing options to reduce the user's cognitive load
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

- **Progressive implementation breakdown**
  - Which features form the minimal set for system operation?
  - Which features can be layered on later without breaking interfaces?

### Step 3: Present Design Proposals

Present in segments; confirm each before continuing:
1. **Architecture overview** — Main internal components of the module (include class diagrams if complex)
2. **Interface refinement** — More detailed interface definitions than the module description document (include ER diagrams for persistence modules)
3. **Error handling strategy** — How each type of error is handled
4. **Progressive implementation breakdown** — Specific boundaries between core features vs. enhanced features

### Step 4: Write the Spec File

File path: `docs/specs/YYYY-MM-DD-<module>-spec.md`

```markdown
# <module-name> Spec

> Generated: YYYY-MM-DD
> Parent system module description: docs/YYYY-MM-DD-modules.md

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

## Progressive Implementation

### Core Features

> These features form the minimal runnable set for the module. The system should function correctly after core implementation.

- <Feature 1>: <Brief description>
- <Feature 2>: <Brief description>

### Enhanced Features

> These features layer on top of the core version without breaking existing interfaces.

- <Enhanced feature A>: <Brief description, including interface differences from core version (if any)>
- <Enhanced feature B>: <Brief description>

## Open Questions (TODO)

<Undecided items from discussion, marked TODO, left for later resolution>
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

### Step 5: Dispatch Review Subagent

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

- docs/specs/YYYY-MM-DD-<module-1>-spec.md
- docs/specs/YYYY-MM-DD-<module-2>-spec.md
- ...

Please review each one. For each spec, you may:
- Confirm as-is
- Propose modifications (I will revise and re-confirm that spec with you)
- Mark as leave it TODO (this module won't be implemented yet; keep the documentation)

Once all specs are confirmed, I will proceed to the next phase.
```

**Wait for explicit user confirmation of all specs.**

On modification requests: Modify the corresponding spec → Re-confirm with the user → Continue waiting for other specs' confirmation.

After all confirmed: Call `my-powers:splitting-specs`.

## Red Flags

**Never:**
- Ask multiple questions in a single message
- Skip the "Progressive Implementation" section
- Call splitting-specs before the user confirms all specs
- Commit a spec before the review subagent passes
- Submit without re-review after issues are found
- Pass review with enhanced features that have dependency ordering issues uncorrected
