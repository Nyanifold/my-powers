---
name: splitting-specs
description: "Use after all module specs are confirmed by the user. Dispatch subagents in parallel to split spec files for each iteration phase of each module."
---

# Splitting Specs — Iteration Phase Spec Splitting

Generate iteration phase spec files for each module in parallel: `spec-core.md` (Core phase scope description) and one `spec-update-N-<feature>.md` per update phase (incremental description). The original spec remains unchanged.

**Declaration:** 「I am using my-powers:splitting-specs, <N> modules to process in parallel」

## Execution Flow

### Step 1: Prepare Task List

Read `docs/YYYY-MM-DD-modules.md`, extract all leaf module list (excluding modules marked as leave it TODO).

For each module, confirm the corresponding original spec file exists:
`docs/specs/YYYY-MM-DD-<module>-spec.md`

Read the "Iteration Plan" section of each spec and record each module's phase structure:
- Core phase (always present)
- Update 1–N phases (zero or more)

### Step 2: Dispatch Subagents in Parallel

**Parallel conflict avoidance rules:**
- Each subagent only operates on its own module's files; no reading or writing other modules' files
- Generated files have different paths; no write conflicts exist
- Subagents don't need to communicate with each other; fully independent

**Precise context each subagent receives (explicitly packaged by coordinator; subagents do not search on their own):**
- Full path to the original spec file
- The module's definition paragraph from the module description document (responsibilities, boundaries, interfaces)
- The phase list from this module's iteration plan (Core + each Update name)
- Target paths for output files
- The full text of the "Subagent Task Description" section in this file

**Model selection:**
- Splitting is a judgment task (requires understanding spec intent); use standard model
- Do not use low-cost models (prone to misclassifying features)

### Step 3: Dispatch Checker Subagents in Parallel

After all splitter subagents complete, dispatch one checker subagent per module in parallel, using the template in `spec-split-checker-prompt.md`.

**Context each checker subagent receives (packaged by coordinator):**
- Original spec file path
- List of all generated phase file paths for this module (spec-core + all spec-update-N-*)
- Complete text of the "Checker Subagent Task Description" section in this file

Checker results:
- **PASS** → Module passes
- **FAIL** → Fix the corresponding splitter output, re-dispatch this module's checker, repeat until PASS

### Step 4: Summarize Results

After all modules' checker subagents pass:
- List all generated files
- Confirm every module passed the check

After summarization: invoke the writing-task-files sub-skill — read `writing-task-files/SKILL.md`

---

## Subagent Task Description

> The following content is copied in full by the coordinator into the subagent's prompt.

Your task is to generate iteration phase diff files for module "<module-name>", extracting and describing each phase's content scope from the original spec.

**Input file:**
- Original spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`

**This module's iteration phases:**
- Core: <minimal runnable set name>
- Update 1: <feature-name> (if present)
- Update N: <feature-name> (if present)

**Output files:**
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
- `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md` (if Update 1 exists)
- `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md` (if more Updates exist)

**The original spec remains unchanged. Do not modify it.**

### Generate spec-core.md

Describe the Core phase implementation scope. Structure:

```markdown
# <module-name> Core Spec

> This file describes the Core phase scope of `docs/specs/YYYY-MM-DD-<module>-spec.md`.
> Complete interface definitions are in the original spec; this file only describes what the Core phase implements.

## Core Phase Implementation Scope

<Extracted from the original spec "Iteration Plan → Core" section, listed item by item>

## Interface Behavior Notes (Core Phase)

<Only list interfaces that differ in behavior from later phases; describe the behavior limitation in the Core phase>
<If the Core phase fully implements an interface, no need to repeat here>

Example:
- `POST /items`: Core phase only supports synchronous creation, not batch creation
- `GET /items/{id}`: Core phase does not return the `related_items` field

## Not Implementing (Left for Later Update Phases)

<Extracted from the original spec "Iteration Plan → Update N" sections, listed item by item>
<This is an explicit exclusion list so implementers know what NOT to do>
```

### Generate spec-update-N-<feature>.md

Generate one file per Update phase, describing what that phase adds on top of all preceding phases. Structure:

```markdown
# <module-name> Update N: <feature-name> Spec

> This file describes the incremental content of "Update N: <feature-name>" on top of all preceding phases.
> All preceding phases must be complete before implementing this phase.
> Complete interface definitions are in the original spec.

## This Phase's Feature Scope

<Extracted from the original spec "Iteration Plan → Update N: <feature-name>" section, listed item by item>

## Behavior Changes (Relative to Preceding Phases)

<Specifically describe which preceding-phase behavior changes, or what new behavior is added>

## Interface Changes (if any)

<New fields, new endpoints, parameter changes, etc.>

## Dependency Conditions

<Whether it depends on other Update phases being completed first, or depends on another module's phase>

## Not Implementing (Left for Later Update Phases)

<If there are more Updates after this phase, list what this phase does not do>
<If this is the last phase, this section may be omitted>
```

### Report on Completion

After writing all files, commit to git, then report status:
`DONE: <module-name> — Generated spec-core.md and <N> spec-update-*.md files`

---

## Red Flags

**Never:**
- Modify the original spec file
- Repeat complete interface definitions in spec-core (reference instead)
- Write implementation details in spec-update files (only behavior changes)
- Let one module's subagent read other modules' files
- Omit any Update phase from the original spec's iteration plan
- Proceed to writing-task-files when any checker subagent returned FAIL
