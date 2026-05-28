---
name: writing-task-files
description: "Use after splitting-specs completes. Write task files for each module serially, defining implementation stages, deliverables, dependencies, and demo plans."
---

# Writing Task Files

Write task files for each leaf module, mapping spec features to independently demonstrable implementation stages. Present all generated task files to the user for review; after confirmation, proceed to writing-plans.

**Declaration:** 「I am using my-powers:writing-task-files, current module: <name>」

<HARD-GATE>
Do not call writing-plans until the user confirms all task files. Every stage must have a runnable demo plan.
</HARD-GATE>

## Step 0: Confirm Current Target Phase Scope

**Before reading any spec or dividing any stages, first confirm which iteration phases to implement this time.**

### ① Has the user explicitly declared a target phase?

- If the user says "implement Core", "do Update 1", "implement all", etc. → Execute per user declaration
- If not declared → Continue to ②

### ② Infer already-completed phases

```bash
# View existing tags
git tag | sort
```

Read each module's original spec and get the phase list from the "Iteration Plan" section. Check each phase against existing tags:

| Phase | Corresponding Tag | Complete? |
|-------|-------------------|-----------|
| Core | `v-core` | Complete if tag exists |
| Update 1: <feature> | `v-update-1-<feature>` | Complete if tag exists |
| Update N: <feature> | `v-update-N-<feature>` | Complete if tag exists |

### ③ Determine target for this iteration

**If Core is not complete:**
Default target is Core. Declare:
> "This iteration will write **Core phase** task files, covering only the spec-core scope."

**If Core is complete and Update phases remain:**
List all incomplete Update phases and ask the user:

```
Core phase is complete (tag: v-core).
The following update phases are not yet implemented:

1. Update 1: <feature-name> — <one-line description>
2. Update 2: <feature-name> — <one-line description>
...

Which ones to implement this time? (Example: "all", "1", "1 and 2")
```

Wait for explicit user answer; do not skip.

Based on user selection, check dependency relationships (from the "Dependency Conditions" field in each spec-update file):
- If a selected phase depends on an unselected Update phase → Highlight dependency and ask user to confirm

After dependency confirmation, declare:
> "This iteration will write task files for **<target phase list>**."

**If all phases are complete:**
Inform the user; no task files to generate.

## Execution Flow

1. Execute Step 0, confirm target phase scope
2. Read `docs/YYYY-MM-DD-modules.md`, get leaf module list (exclude TODO modules)
3. Order by dependency (depended-on modules first)
4. Execute the "Single Module Task Division Process" serially for each module
5. After all task files complete, list files for user review
6. After user confirmation, invoke the writing-plans sub-skill — read `writing-plans/SKILL.md`

## Single Module Task Division Process

### Read Input Files

- `docs/specs/YYYY-MM-DD-<module>-spec.md` (original spec)
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md` (Core phase scope)
- `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md` (Update 1, if in target scope)
- `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md` (further Updates, if in target scope)

### Divide Stages

**Stage division principles:**
- Each stage corresponds to a batch of features that can be **independently demonstrated**
- Core features form the initial stages (one spec-core may be split into multiple stages by natural grouping)
- Each Update phase typically corresponds to one or a few stages
- Dependencies between stages must be explicitly declared
- Stage workload: recommended to correspond to several hours to a day of implementation (not too fine, not too coarse)

**Division scope strictly aligns with the target phases for this iteration:**
- Target is **Core** → Only divide stages for features in spec-core
- Target is **specific Update phases** → Only divide stages for the confirmed target Update phases
- Target is **all** → Divide stages for Core and all incomplete Update phases

Features not in the target scope: no stages, no demos, no plans. Task files only reflect what's being done this iteration.

**Deliverable description principle (incremental):**
- Added: What new features, new files, new interfaces appear
- Removed: What temporary code, mocks, stubs are removed
- Changed: What existing behaviors change

**Demo plan requirements:**
- Demo files uniformly placed under `demo/<module>/stage-N/`
- Choose one demo method: command-line arguments / input file / interactive CLI
- Clearly describe required context (sample data, database initial state, environment variables)
- Clearly describe which dependent modules use mocks, and what the mock behavior is
- The demo should run with one or two commands; no complex prerequisite steps

### Write Task File

File path: `docs/tasks/YYYY-MM-DD-<module>-tasks.md`

```markdown
# <module-name> Task File

> Generated: YYYY-MM-DD
> Corresponding spec: docs/specs/YYYY-MM-DD-<module>-spec.md

## Stage Overview

| Stage | Name | Corresponding Scope | Estimated Effort |
|-------|------|---------------------|-------------------|
| Stage 1 | <Name> | Core: <feature list> | <Estimate> |
| Stage 2 | <Name> | Core: <feature list> | <Estimate> |
| Stage 3 | <Name> | Update 1 (<feature-name>): <feature list> | <Estimate> |
| Stage N | <Name> | Update M (<feature-name>): <feature list> | <Estimate> |

## Stage Dependencies

<Text description or ASCII diagram showing which stages must complete before others>
<Cross-module dependencies also described here>

Example:
Stage 1 → Stage 2 → Stage 3
Stage 1 depends on <other-module> Stage 2 completion

## Stage Details

### Stage 1: <Name>

**Goal:** <One sentence>

**Corresponding spec scope:**
- In spec-core: <Feature list>

**Expected Deliverables (Incremental):**

Added:
- <Added features/files/interfaces>

Removed:
- <None / or specific content>

Changed:
- <None / or specific content>

**Stage dependencies:**
- Prerequisite stages in this module: None (or Stage N)
- Depends on other modules: <module-name> Stage M (or None)

**Demo plan:**

Demo file location: `demo/<module>/stage-1/`

Demo method: <Command-line arguments / Input file / Interactive CLI>

Required context:
- <Sample data file description>
- <Database initial state, if any>
- <Environment variables, if any>

Mocked external dependencies:
- `<module-name>`: Mock as <Mock behavior description> (or: No external dependencies)

Run example:
\`\`\`bash
# Example command
<command>
\`\`\`

Expected output:
\`\`\`
<expected output>
\`\`\`

---

### Stage 2: <Name>

(Same format as above)

---

### Stage N (Update M: <feature-name>): <Name>

(Same format as above; note in "Corresponding spec scope" that it comes from spec-update-M-<feature>)
```

### Dispatch Review Subagent

After self-check passes, use the template in `task-file-reviewer-prompt.md` to dispatch a review subagent (standard model), providing:
- Task file path
- Corresponding spec file paths (original spec, spec-core, spec-update-N-* files involved in this iteration)
- Target phase list for this iteration (from Step 0 confirmation)

Review results:
- Approved → Commit file to git, continue to next module
- Issues Found → Modify task file → Re-dispatch the same review subagent for re-review (do not skip re-review)

## After All Modules Complete

```
All module task files generated:

- docs/tasks/YYYY-MM-DD-<module-1>-tasks.md
- docs/tasks/YYYY-MM-DD-<module-2>-tasks.md
- ...

Please review each task file, focusing on:
- Are stage divisions reasonable?
- Are demo plans feasible?
- Are cross-module dependencies correct?

Once all task files are confirmed, I will begin writing plan documents in parallel.
```

Wait for user confirmation. On modifications: Modify corresponding file → Re-confirm with user → Continue waiting for other file confirmations.

After all confirmed: invoke the writing-plans sub-skill — read `writing-plans/SKILL.md`

## Red Flags

**Never:**
- Have a stage without a demo plan
- Have demos requiring complex manual steps
- Omit features from spec-core
- Have unclear cross-module dependencies
- Make stages too fine (one stage per hour) or too coarse (entire module in one stage)
- Commit task files before review subagent passes
- Submit without re-review after issues are found
- Mix features outside the target phase scope into task files
