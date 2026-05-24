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

## Step 0: Confirm Current Target Version

**Before reading any spec or dividing any stages, first confirm which version to build.**

Determine in the following order:

**① Has the user explicitly declared a target version?**
- If the user says "do the enhanced version", "implement all features", "include enhanced feature X", etc. → Execute per user declaration
- If the user says "do core first", "only core" → Execute as core version

**② If the user hasn't declared, check if the core version is ready:**
```bash
git tag | grep v-core
```
- If `v-core` tag exists → Core version is done. Ask the user: "Core version detected as complete (tag: v-core). Should we continue with enhanced features this time?" Wait for explicit answer.
- If not → Execute as core version; don't ask.

**③ Default behavior: Execute as core version.**

After confirming version, declare:
> "This iteration will write **core version** task files, covering only the spec-core scope."

If the target is confirmed as enhanced, continue to Step 0b before declaring.

## Step 0b: Confirm Enhanced Feature Scope (Only when target is enhanced version)

**① Infer which enhanced features are already implemented from existing tags and reports:**

```bash
# Check existing enhanced version tags
git tag | grep v-enhanced

# Check existing implementation reports
ls docs/reports/ 2>/dev/null
```

Check each enhanced feature in `spec-enhanced.md`:
- Corresponding `v-enhanced-<feature-name>` tag exists, or a report file for the corresponding Stage exists → **Already implemented**
- Otherwise → **Not yet implemented**

**② List unimplemented enhanced features, ask the user:**

```
The following enhanced features are not yet implemented:

1. <Enhanced feature A>: <One-line description>
2. <Enhanced feature B>: <One-line description>
3. <Enhanced feature C>: <One-line description>

Implement all this time, or only some?
(Example answers: "all", "1 and 3", "just A")
```

Wait for explicit user answer; do not skip.

**③ Based on user selection, determine the target feature list for this iteration.**

If the user selected partial features, check dependency relationships (from the "Dependency conditions" field in each enhanced feature in spec-enhanced):
- If a selected feature depends on an unselected enhanced feature → Prompt: "Enhanced feature X depends on enhanced feature Y; both must be implemented. Confirm?"

After dependency confirmation, declare:
> "This iteration will write enhanced version task files. Target features: <confirmed feature list>."

## Execution Flow

1. Execute Step 0, confirm target version
2. Read `docs/YYYY-MM-DD-modules.md`, get leaf module list (exclude TODO modules)
3. Order by dependency (depended-on modules first)
4. Execute the "Single Module Task Division Process" serially for each module
5. After all task files complete, list files for user review
6. After user confirmation, call `my-powers:writing-plans`

## Single Module Task Division Process

### Read Input Files

- `docs/specs/YYYY-MM-DD-<module>-spec.md` (original spec)
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md` (core version scope)
- `docs/specs/YYYY-MM-DD-<module>-spec-enhanced.md` (enhanced version scope)

### Divide Stages

**Stage division principles:**
- Each stage corresponds to a batch of features that can be **independently demonstrated**
- Core features come first, forming the initial stages
- Enhanced features form subsequent stages; each enhanced feature typically corresponds to one stage
- Dependencies between stages must be explicitly declared
- Stage workload: recommended to correspond to several hours to a day of implementation (not too fine, not too coarse)

**Division scope strictly aligns with the target version for this iteration:**
- Target is **core version** → Only divide stages for features in spec-core; spec-enhanced content does not appear in task files
- Target is **partial enhanced features** → Only divide stages for the feature list confirmed in Step 0b; other enhanced features do not appear
- Target is **all enhanced features** → Divide stages for all unimplemented enhanced features

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
| Stage 1 | <Name> | spec-core: <feature list> | <Estimate> |
| Stage 2 | <Name> | spec-core: <feature list> | <Estimate> |
| Stage 3 | <Name> | spec-enhanced: <enhanced feature name> | <Estimate> |

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
```bash
# Example command
<command>
```

Expected output:
```
<expected output>
```

---

### Stage 2: <Name>

(Same format as above)

---

### Stage N (Enhanced): <Enhanced feature name>

(Same format as above; note in "Corresponding spec scope" that it comes from spec-enhanced)
```

### Dispatch Review Subagent

After self-check passes, use the template in `task-file-reviewer-prompt.md` to dispatch a review subagent (standard model), providing:
- Task file path
- Corresponding spec file paths (original spec, spec-core, spec-enhanced)
- Target version and feature list for this iteration (from Step 0 / Step 0b confirmation)

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

After all confirmed: Call `my-powers:writing-plans`

## Red Flags

**Never:**
- Have a stage without a demo plan
- Have demos requiring complex manual steps
- Omit features from spec-core
- Have unclear cross-module dependencies
- Make stages too fine (one stage per hour) or too coarse (entire module in one stage)
- Commit task files before review subagent passes
- Submit without re-review after issues are found
