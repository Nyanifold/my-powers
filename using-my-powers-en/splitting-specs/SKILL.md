---
name: splitting-specs
description: "Use after all module specs are confirmed by the user. Dispatch subagents in parallel to split core/enhanced spec diff files for each module."
---

# Splitting Specs — Core/Enhanced Spec Splitting

Generate two diff files for each module in parallel: `spec-core.md` (core version scope description) and `spec-enhanced.md` (enhanced version incremental description). The original spec remains unchanged.

**Declaration:** 「I am using my-powers:splitting-specs, <N> modules to process in parallel」

## Execution Flow

### Step 1: Prepare Task List

Read `docs/YYYY-MM-DD-modules.md`, extract all leaf module list (excluding modules marked as leave it TODO).

For each module, confirm the corresponding original spec file exists:
`docs/specs/YYYY-MM-DD-<module>-spec.md`

### Step 2: Dispatch Subagents in Parallel

**Parallel conflict avoidance rules:**
- Each subagent only operates on its own module's two files; no reading or writing other modules' files
- Generated files have different paths; no write conflicts exist
- Subagents don't need to communicate with each other; fully independent

**Precise context each subagent receives (explicitly packaged by coordinator; subagents do not search on their own):**
- Full path to the original spec file
- The module's definition paragraph from the module description document (responsibilities, boundaries, interfaces)
- Target paths for output files (core and enhanced)
- The full text of the "Subagent Task Description" section in this file

**Model selection:**
- Splitting is a judgment task (requires understanding spec intent); use standard model
- Do not use low-cost models (prone to misclassifying features)

### Step 3: Summarize Results

After all subagents complete:
- List all generated files
- Check that each module generated both files
- If any failures, re-dispatch that module's subagent individually

After summarization: Call `my-powers:writing-task-files`

---

## Subagent Task Description

> The following content is copied in full by the coordinator into the subagent's prompt.

Your task is to generate two diff files for module "<module-name>", extracting and distinguishing core and enhanced content scope from the original spec.

**Input file:**
- Original spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`

**Output files:**
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
- `docs/specs/YYYY-MM-DD-<module>-spec-enhanced.md`

**The original spec remains unchanged. Do not modify it.**

### Generate spec-core.md

Describe the core version implementation scope. Structure:

```markdown
# <module-name> Core Spec

> This file describes the core version scope of `docs/specs/YYYY-MM-DD-<module>-spec.md`.
> Complete interface definitions are in the original spec; this file only describes what the core version implements.

## Core Version Implementation Scope

<Extracted from the original spec "Progressive Implementation → Core Features" section, listed item by item>

## Interface Behavior Notes (Core Version)

<Only list interfaces that differ in behavior from the enhanced version; describe the behavior limitation in the core version>
<If the core version fully implements an interface, no need to repeat here>

Example:
- `POST /items`: Core version only supports synchronous creation, not batch creation
- `GET /items/{id}`: Core version does not return the `related_items` field

## Not Implementing (Left for Enhanced Version)

<Extracted from the original spec "Progressive Implementation → Enhanced Features" section, listed item by item>
<This is an explicit exclusion list so implementers know what NOT to do>
```

### Generate spec-enhanced.md

Describe the incremental content the enhanced version adds on top of the core version. Structure:

```markdown
# <module-name> Enhanced Spec

> This file describes incremental content on top of the core version.
> The core version must be complete before implementing the enhanced version.
> Complete interface definitions are in the original spec.

## Enhanced Feature List

### Enhanced Feature 1: <Name>

**Trigger condition:** <When this feature needs to be implemented>

**Behavior changes (relative to core version):**
<Specifically describe which core version behavior changes, or what new behavior is added>

**Interface changes (if any):**
<New fields, new endpoints, parameter changes, etc.>

**Dependency conditions:**
<Whether it depends on other enhanced features being completed first, or depends on other modules' enhanced versions>

---

### Enhanced Feature 2: <Name>

(Same format as above)
```

### Report on Completion

After writing both files, commit to git, then report status:
`DONE: <module-name> — Generated spec-core.md and spec-enhanced.md`

---

## Red Flags

**Never:**
- Modify the original spec file
- Repeat complete interface definitions in spec-core (reference instead)
- Write implementation details in spec-enhanced (only behavior changes)
- Let one module's subagent read other modules' files
