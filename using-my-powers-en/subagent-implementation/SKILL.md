---
name: subagent-implementation
description: "Use after the user confirms all plans. Schedule subagents by dependency order to implement each task stage, with two-phase review and implementation reports."
---

# Subagent Implementation — Subagent-Driven Implementation

Schedule implementation subagents by stage dependency order. Each task stage goes through two-phase review after completion, then writes an implementation report.

**Declaration:** 「I am using my-powers:subagent-implementation」

**Core principles:**
- Each task stage corresponds to an independent implementer subagent, with precisely constructed context and no inherited conversation history
- Two-phase review enforces order: spec compliance review first, then code quality review
- Verification before declaration: never claim any stage is complete without running verification commands
- Continuous execution: unless encountering an unresolvable BLOCKED state, do not ask the user mid-way whether to continue

## Step 0: Branch Isolation Check

**Before any implementation begins:**

```bash
BRANCH=$(git branch --show-current)
```

- If currently on `main` or `master`: must create a new branch; never implement directly on the main branch
- If already on a feature branch: continue
- Ask user preference, or default to creating `feature/<system-name>-<date>` branch

## Step 1: Extract All Tasks, Build Execution Queue

Read all plan files at once, extract key information for each task, build a complete task list using TodoWrite:

```
[Module Name] Stage N — <Stage Name>
  Plan file: docs/plans/YYYY-MM-DD-<module>-task-N-plan.md
  Prerequisites: [list]
  Status: Pending
```

Build execution order by dependency: stages with no dependencies execute first; stages with cross-module dependencies wait for their prerequisites to complete.

## Step 2: Execution Loop (Each Task Stage)

### Dispatch Implementer Subagent

**Precise context the implementer subagent receives (constructed by coordinator; subagent does not search on its own):**
- Module name, stage number, stage name
- Corresponding spec file path (provided by coordinator; subagent reads the content itself)
- The complete text of this stage from the corresponding tasks file (extracted and passed in by coordinator)
- The full path to the plan document (provided by coordinator; subagent reads the content itself)
- Current git branch name
- The full text of the "Implementer Subagent Responsibilities" section

**Model selection:**
- Clear plan, only 1-2 files involved: low-cost model
- Multi-file integration, tasks requiring judgment: standard model
- Cross-module interfaces, architectural decisions: most capable model

**Answer questions before implementing:**
When the implementer subagent reports `NEEDS_CONTEXT`, the coordinator answers the questions and re-dispatches; don't push the subagent to continue with insufficient information.

### Handle Subagent Status Reports

The implementer subagent must return one of four statuses:

**`DONE`:** Completed normally. Enter spec compliance review.

**`DONE_WITH_CONCERNS`:** Completed but with concerns. The coordinator reads the concerns first:
- Concerns involve correctness or scope → handle before review
- Concerns are observational notes (e.g., "this file got large") → record and continue review

**`NEEDS_CONTEXT`:** Needs more information. The coordinator provides missing context and re-dispatches the same task.

**`BLOCKED`:** Cannot continue. The coordinator evaluates:
1. Context issue → Supplement context, re-dispatch
2. Needs stronger reasoning → Upgrade model, re-dispatch
3. Task too large → Split and re-dispatch
4. Plan itself has issues → Escalate to user for decision

**Never** ignore BLOCKED or force retry with the same configuration.

### Review Phase 1: Spec Compliance Review

**Mandatory ordering: Spec Compliance Review must complete before Code Quality Review.**

Get git SHA:
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # Or the commit before this task started
HEAD_SHA=$(git rev-parse HEAD)
```

Dispatch Spec Compliance Review subagent (standard model), providing:
- Original spec file path
- The "Review Checklist" from the tasks file for this stage
- `BASE_SHA` and `HEAD_SHA` (for locating the diff scope)

Review dimensions:
- Are all "Expected Deliverables (Incremental)" implemented?
- Is there out-of-scope implementation (over-implementation)?
- Do interfaces conform to spec definitions?

Review result:
- ✅ Pass → Enter code quality review
- ❌ Issues Found → Same implementer subagent fixes → Same review subagent re-reviews (do not skip re-review)

**No performative agreement:** When the review subagent finds issues, describe them in technical language; don't say things like "great find"; directly list the issues.

### Review Phase 2: Code Quality Review

Dispatch Code Quality Review subagent (most capable model), providing:
- Same `BASE_SHA` and `HEAD_SHA`
- Module's tech stack (from spec)

Review dimensions:
- Is the code structure clear? Does each file have a single responsibility?
- Do tests cover the test points in the plan?
- Are there obvious code quality issues (duplicated code, magic numbers, unhandled error paths)?

Review result:
- ✅ Pass → Write implementation report, mark task complete
- ❌ Issues Found → Same implementer subagent fixes → Same review subagent re-reviews

**No performative agreement:** Same as above.

### Write Implementation Report

After both review phases pass, the implementer subagent (or coordinator) writes the implementation report:

File path: `docs/reports/YYYY-MM-DD-<module>-task-<N>-report.md`

```markdown
# <module-name> Stage <N> Implementation Report

> Generated: YYYY-MM-DD
> Corresponding plan: docs/plans/YYYY-MM-DD-<module>-task-<N>-plan.md

## Change Summary

**Added:**
- <Files/features list>

**Removed:**
- <Files/features list, or "None">

**Changed:**
- <Change description, or "None">

## Interface Usage Guide

> Focus on interfaces relevant to subsequent tasks, including usage examples.

### <Interface Name>

**Purpose:** <Description>

**Usage example:**
```<language>
<example code>
```

**Notes:** <Edge cases, known limitations>

## Demo File Description

**Location:** `demo/<module>/stage-<N>/`

File descriptions:
- `<filename>`: <Purpose>

**Run Guide (from scratch):**
```bash
# 1. Set up context
<commands>

# 2. Run demo
<commands>
```

**Expected output:**
```
<expected output>
```

## Interface Reservations for Subsequent Tasks

<Describe what interfaces or extension points the current stage reserves for subsequent tasks, helping implementer subagents of later tasks understand the design intent of existing code>

## Outstanding Issues

<Known limitations, TODOs, interface reservation notes for subsequent stages>
```

After writing the report, commit to git, then mark the task complete in TodoWrite and continue to the next task.

## Step 3: Global Final Review

After all task stages complete, dispatch a final code review subagent (most capable model) for a global review of the entire implementation:

**Global review dimensions:**
- Do each module's interfaces match their spec definitions?
- Do inter-module dependency relationships conform to the modules file conventions?
- Are there consistency issues introduced across stages?
- Can all demos run?

After review passes, invoke the finishing-a-module sub-skill — read `finishing-a-module/SKILL.md`

## Continuous Execution Specification

**The only reasons to stop and escalate to the user:**
- BLOCKED status and evaluation determines it cannot be resolved in the current context
- The plan document itself has errors or contradictions requiring user decision

**Situations where you do NOT stop to ask:**
- Routine task completion, continue to the next
- Issues found in review, fix and continue
- Intermediate progress reports (continue directly without waiting for user response)

---

## Implementer Subagent Responsibilities

> The following content is copied in full by the coordinator into the implementer subagent's prompt.

You are an implementer subagent responsible for completing the implementation of a specified task stage. You inherit no conversation history; all context is provided by the coordinator.

**Your task:**
Module "<module-name>" Stage <N>: <stage-name>

**Input file paths (read these files for details):**
- spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`
- plan: `docs/plans/YYYY-MM-DD-<module>-task-<N>-plan.md`

**Below is the task description for this stage (extracted from tasks file; coordinator has already extracted it):**
```
<task description text>
```

**Implementation specification:**
1. Implement in the step order defined by the plan document
2. **TDD Iron Rule**: For each feature point, first write a failing test, confirm the test fails for the right reason, then write the minimum code to make it pass, then confirm no other tests are broken
3. Run the full test suite after implementation, confirm all pass
4. Set up and verify that the demo runs correctly
5. Self-check: Verify each item against the plan document's "Review Checklist"
6. Commit all changes (multiple commits, one per logical unit)

**TDD Red Flags (Stop immediately if you encounter these):**
- Writing implementation code first, then backfilling tests
- A test passes immediately when first written (means it's not testing the right thing)
- Skipping the "confirm test fails" step
- "This is simple, no test needed"

**When encountering bugs:** Follow the systematic debugging process: confirm reproduction, find root cause, fix, verify. After the fix passes, write a bugfix record in `docs/reports/`: `YYYY-MM-DD-<module>-task-<N>-bugfix.md` (if multiple bugs in the same stage, number sequentially: `-bugfix-1.md`, `-bugfix-2.md`).

**Verification before declaration:** Without running the test command, never say "tests pass"; without running the demo command, never say "demo works."

**Report status on completion (must be one of the following four):**
- `DONE`: All steps complete, tests pass, demo runnable
- `DONE_WITH_CONCERNS`: Complete but with concerns; describe the specific concerns
- `NEEDS_CONTEXT`: Need certain information to continue; describe what is needed
- `BLOCKED`: Encountered an unresolvable problem; describe the blocking reason in detail

## Red Flags

**Never:**
- Start implementation directly on main/master branch (Step 0 check)
- Skip Spec Compliance Review and go directly to Code Quality Review (ordering enforced)
- Skip re-review after issues are found (issues found = not complete)
- Claim tests pass or stage complete without running verification commands
- Ignore BLOCKED status or force retry with the same configuration
- Ask the user "whether to continue" mid-way (unless BLOCKED needs escalation)
- Let implementer subagents inherit the coordinator's conversation context
- Enter Code Quality Review when Spec Compliance Review hasn't passed
- Write implementation code first, then backfill tests (TDD Iron Rule violation)
- Skip the step of confirming tests fail
- Not write bugfix records after fixing bugs
