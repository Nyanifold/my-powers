---
name: systematic-debugging
description: "Use when encountering any bug, test failure, or unexpected behavior, before proposing any fix."
---

# Systematic Debugging

Random fixes waste time and introduce new bugs. Quick patches mask root problems.

**Declaration:** 「I am using my-powers:systematic-debugging」

**Core principle:** Always find the root cause before attempting a fix. Fixing symptoms is failure.

**Violating the letter of this process is violating its spirit.**

## Iron Rule

```
No fix proposal without completing root cause investigation
```

Do not enter the fix phase without completing Phase 1.

## When to Use

Applies to all technical problems:
- Test failures
- Production bugs
- Unexpected behavior
- Performance issues
- Build failures
- Integration issues

**Especially use when:**
- Time is tight (urgency tempts guessing)
- "Just a quick fix" seems obvious
- Multiple fixes have already been attempted
- The last fix didn't work
- The problem isn't fully understood

**Do not skip when:**
- The problem seems simple (simple bugs have root causes too)
- Time is tight (systematic debugging is faster than trial and error)

## The Four Phases

Must complete each phase in order before moving to the next.

### Phase 1: Root Cause Investigation

**Before attempting any fix:**

1. **Read error messages carefully**
   - Don't skip errors or warnings
   - They often contain the precise solution
   - Read stack traces completely
   - Record line numbers, file paths, error codes

2. **Stabilize reproduction**
   - Can it be reliably triggered?
   - What are the exact steps?
   - Does it happen every time?
   - If unreproducible → gather more data, don't guess

3. **Check recent changes**
   - What changes might have caused this?
   - `git diff`, recent commits
   - New dependencies, config changes, environment differences

4. **Multi-component systems: Add diagnostic tracing**

   **When the system has multiple components (CI → build → signing, API → service → database):**

   **Before proposing a fix, add diagnostic tracing:**
   ```
   At each component boundary:
     - Log data entering the component
     - Log data leaving the component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to collect evidence, determine where things go wrong
   Then analyze evidence, identify the failing component
   Then investigate that specific component
   ```

5. **Trace the data flow**

   **When errors are buried deep in the call stack:**

   See `root-cause-tracing.md` in this directory.

   **TL;DR:**
   - Where did the bad value originate?
   - What code passed this bad value in?
   - Keep tracing upward until you find the source
   - Fix at the source, not at the symptom

### Phase 2: Pattern Analysis

**Find patterns before fixing:**

1. **Find working examples**
   - Find similar working code in the same codebase
   - What similar things work correctly?

2. **Compare with reference**
   - If implementing a pattern, read the reference implementation completely
   - Don't skim — read line by line
   - Fully understand the pattern before applying it

3. **Identify differences**
   - What's different between what works and what doesn't?
   - List every difference, no matter how small
   - Don't assume "that doesn't matter"

4. **Understand dependencies**
   - What other components does this component need?
   - What setup, configuration, environment does it require?
   - What assumptions does it make?

### Phase 3: Hypothesis & Verification

**The scientific method:**

1. **Form a single hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Minimal test**
   - Make the **smallest possible change** to test the hypothesis
   - Change one variable at a time
   - Don't fix multiple issues simultaneously

3. **Verify before continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form a **new hypothesis**
   - **Don't** stack more fixes on top

4. **When you don't know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Research more information

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create a failing test case**
   - Simplest possible reproduction
   - Write an automated test if a test framework exists
   - **Must** have a test before fixing
   - Use the TDD process from `my-powers` implementation spec to write proper failing tests

2. **Implement a single fix**
   - Address the identified root cause
   - **One change at a time**
   - Don't "while I'm here" other things
   - Don't bundle refactoring

3. **Verify the fix**
   - Does the test pass now?
   - No other tests broken?
   - Is the problem truly resolved?

4. **Write bugfix record**

   After the fix passes verification, write an additional record in `docs/reports/` with the same file prefix as the current stage:

   ```
   docs/reports/YYYY-MM-DD-<module>-task-<N>-bugfix.md
   ```

   If multiple bugs are fixed in the same stage, number sequentially: `-bugfix-1.md`, `-bugfix-2.md`.

   Record contents:
   ```markdown
   # <module> Stage <N> Bugfix Record

   ## Symptom
   <Observed phenomenon>

   ## Root Cause
   <Root cause investigation conclusion>

   ## Fix
   <What was done, why>

   ## Verification
   <What commands were run, what was the output>
   ```

   Commit and continue the original task.

5. **When the fix doesn't work**
   - **Stop**
   - Count: How many fix attempts so far?
   - Fewer than 3: Go back to Phase 1, re-analyze with new information
   - **3 or more: Stop. Question the architecture (see Step 5)**
   - Don't attempt a 4th fix without an architecture discussion

5. **3 or more failed fixes: Question the architecture**

   **Patterns indicating architectural problems:**
   - Each fix exposes new shared state/coupling/problems in different places
   - Fixes require "massive refactoring" to implement
   - Each fix produces new symptoms elsewhere

   **Stop and question the fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we persisting "out of inertia"?
   - Should we refactor the architecture instead of continuing to fix symptoms?

   **Discuss with the user before attempting more fixes**

## Red Flags — Stop and Follow the Process

If you find yourself thinking:
- "Quick fix first, investigate later"
- "Try changing X to see if it works"
- "Add multiple changes at once, run tests"
- "Skip the test, manual verification is fine"
- "It's probably X, let me fix it"
- "Don't fully understand, but this might work"
- "While I'm here, might as well change this too"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- **"Try one more fix" (already tried 2+ times)**
- **Each fix exposes new problems in different places**

**All of the above means: STOP. Go back to Phase 1.**

**If 3+ fixes have failed:** Question the architecture (see Phase 4, Step 5)

## Common Excuses

| Excuse | Reality |
|--------|---------|
| "The problem is simple, no process needed" | Simple problems have root causes too. The process is fast for simple bugs too. |
| "Urgent, no time for process" | Systematic debugging is **faster** than trial and error. |
| "Try this first, investigate later" | The first fix sets the pattern. Do it right from the start. |
| "Write the test after confirming the fix works" | Untested fixes don't last. Write the test first to prove it works. |
| "Multiple fixes at once saves time" | Can't isolate which one worked. Produces new bugs. |
| "The reference is too long, I'll adapt it" | Incomplete understanding inevitably produces bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "Try one more time" (after 2 failures) | 3+ failures = architectural problem. Question the pattern, don't fix again. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, collect evidence | Understand what and why |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, minimal test | Confirmed or new hypothesis formed |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## When the Process Shows "No Root Cause"

If systematic investigation shows the problem is truly environmental, timing-dependent, or external:

1. The process is complete
2. Document what you investigated
3. Implement appropriate handling (retries, timeouts, error messages)
4. Add monitoring/logging for future investigation

**However:** 95% of "no root cause" cases are incomplete investigations.

## Supporting Techniques

Supporting files in this directory:

- **`root-cause-tracing.md`** — Trace bugs up the call stack to the original trigger
- **`defense-in-depth.md`** — Add validation at multiple layers after finding root cause
- **`condition-based-waiting.md`** — Replace arbitrary timeouts with condition polling

**Related skills:**
- **verification-before-completion sub-skill** (read `verification-before-completion/SKILL.md`) — Verify before claiming a fix works
