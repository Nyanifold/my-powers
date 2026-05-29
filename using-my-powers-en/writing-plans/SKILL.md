---
name: writing-plans
description: "Use after the user confirms all task files. Dispatch subagents in parallel to generate detailed plan documents for each task stage of each module."
---

# Writing Plans — Task Plan Document Writing

Generate plan documents for each task stage of each module in parallel. Plan documents contain implementation steps, test descriptions (pseudocode), and demo setup plans.

**Declaration:** 「I am using my-powers:writing-plans, <N> tasks to process in parallel」

## Execution Flow

### Step 0: Confirm Current Target Phase Scope

Confirm from the context passed by `writing-task-files`:
- Target phase list for this iteration (Core / specific Update phase names)

If context is unclear, re-execute the same judgment logic as `writing-task-files` (Step 0).

Declare the target phase list before building the task matrix, ensuring only Stages within the target scope are included, excluding already-implemented or not-doing-this-time Stages.

### Step 1: Build Task Matrix

Read all task files, build the complete task matrix:

```
<module-1>
  └─ Stage 1 → docs/my-powers-output/tasks/YYYY-MM-DD-<module-1>-tasks.md § Stage 1
  └─ Stage 2 → ...
<module-2>
  └─ Stage 1 → ...
```

Count total tasks, declare: "N tasks total; will dispatch subagents in parallel to generate plans"

### Step 2: Dispatch Subagents in Parallel

**Parallel conflict avoidance rules:**
- Each subagent writes only one plan file; paths are unique; no write conflicts
- Subagents only read the spec and tasks sections corresponding to their own task; no cross-reading
- Plan documents for different modules and stages are completely independent

**Precise context each subagent receives (explicitly packaged by coordinator):**
- Module name, stage number
- Corresponding spec file paths (original spec + the spec-core or spec-update-N-<feature> file for this stage)
- Complete text of the corresponding stage from the tasks file (extracted and passed in by coordinator; subagent does not read files itself)
- Target path for the output plan file
- Complete text of the "Subagent Task Description" section in this file

**Model selection:**
- Single file, clear interface stages: use low-cost model
- Multi-file integration, stages requiring design intent judgment: use standard model
- Cross-module interface, architecture decision stages: use most capable model

### Step 3: Self-Review

After all plan documents are generated, check each one against the following items and fix issues inline — no need to record them:

- [ ] Every implementation step has a concrete action description (not hollow descriptions like "implement feature X")
- [ ] Test pseudocode covers main behaviors and edge cases
- [ ] Demo plan matches the description in the corresponding tasks file
- [ ] No cross-stage gaps (outcomes from the previous stage have a clear handoff point in this stage)

Proceed to dispatching the review subagent only after all items pass.

### Step 4: Subagent Review

After all plan documents are generated, dispatch a review subagent (most capable model) to review each against the corresponding spec and tasks:
- Does the plan cover all expected deliverables for the stage?
- Do test descriptions cover main behaviors and edge cases?
- Is the demo plan consistent with the tasks file?

Issues found in review → Modify the corresponding plan document → Re-review until passing.

### Step 5: List Results, Wait for User Confirmation

```
All plan documents generated:

- docs/my-powers-output/plans/YYYY-MM-DD-<module-1>-task-1-plan.md
- docs/my-powers-output/plans/YYYY-MM-DD-<module-1>-task-2-plan.md
- ...

All plans have passed subagent self-review. Please confirm whether to begin the implementation phase.
```

After user confirmation, invoke the subagent-implementation sub-skill — read `subagent-implementation/SKILL.md`

---

## Subagent Task Description

> The following content is copied in full by the coordinator into the subagent's prompt, with specific parameters filled in.

Your task is to write a plan document for module "<module-name>" Stage <N> (<stage-name>).

**Input information (provided by coordinator; no need to search for files yourself):**

Corresponding spec file paths:
- `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md`
- `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-core.md` (if this stage belongs to the Core scope)
- `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md` (if this stage belongs to an Update phase)

Below is the task description for this stage (extracted from tasks file):

```
<Coordinator pastes the complete text of this stage from the tasks file here>
```

**Output file:** `docs/my-powers-output/plans/YYYY-MM-DD-<module>-task-<N>-plan.md`

### Plan Document Structure

```markdown
# <module-name> Stage <N>: <stage-name> Plan

> Generated: YYYY-MM-DD
> Corresponding spec: docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md
> Corresponding tasks stage: Stage <N>

## Goals and Scope

<One sentence describing the goal of this stage>

Corresponding spec scope: <spec-core or spec-update-N-<feature>, which features>

## File Structure

| Action | File Path | Responsibility |
|--------|-----------|----------------|
| Add | `src/...` | <Responsibility> |
| Modify | `src/...` | <Change content> |
| Add | `demo/<module>/stage-<N>/...` | Demo file |

## Implementation Steps

### Step 1: <Name>

<What to do, key design decisions>

Key code structure (pseudocode, illustrating design intent):
```
<pseudocode>
```

### Step 2: <Name>

(Same format as above)

## Test Description

> Tests should be written during implementation. The following describes test intent and pseudocode approach; full code is not required.

### Test Point 1: <Name>

**Test intent:** Verify <specific behavior>

**Prerequisites:** <System state / input data>

**Pseudocode outline:**
```
given <state>
when <action>
then <expected result>
```

### Test Point 2: <Name>

(Same format as above, covering edge cases and error paths)

## Demo Instructions

**Demo file location:** `demo/<module>/stage-<N>/`

**Minimal context setup:**
<How to initialize sample data, database, environment variables; describe with specific commands>

```bash
# Initialize context
<commands>
```

**Mock interface description:**
<Which external modules' interfaces to mock, what the mock returns, where mock files go>

**Run demo:**
```bash
<specific run command>
```

**Expected output:**
```
<expected output>
```

## Review Checklist

> After implementation completes, the review subagent verifies against the following checklist.

- [ ] All "Expected Deliverables (Incremental)" added items are implemented
- [ ] All "Expected Deliverables (Incremental)" changed items are completed
- [ ] Every test point in the test description has a corresponding test, and tests pass
- [ ] Demo files exist and run correctly following the "Run demo" command
- [ ] Mock interfaces match the mock behavior declared in the tasks file
- [ ] No functionality beyond the tasks file scope has been introduced (no over-implementation)
- [ ] Implementation report written to `docs/my-powers-output/reports/YYYY-MM-DD-<module>-task-<N>-report.md`
```

### Report on Completion

After writing the file and committing to git, report:
`DONE: <module-name> Stage <N> — Plan document generated`

---

## Red Flags

**Never:**
- Write complete implementation code in plan documents (only pseudocode and design intent)
- Let subagents read tasks files on their own (coordinator extracts content and passes it in)
- Let subagents for different modules read each other's files
- Skip the demo instructions section
- Write test descriptions that only say "test feature X" without describing specific behaviors and edge cases
