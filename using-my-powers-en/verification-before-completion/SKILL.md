---
name: verification-before-completion
description: "Use before claiming work is done, fixed, or passing, and before committing or creating a PR. Requires running verification commands and confirming output before making any success claim."
---

# Verification Before Completion

Claiming work is complete without verification is dishonesty, not efficiency.

**Declaration:** 「I am using my-powers:verification-before-completion」

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating its spirit.**

## Iron Rule

```
No completion claim without fresh verification evidence from the current session
```

If you haven't run the verification command in this message, don't claim it passed.

## Verification Gate

```
Before claiming any status or expressing satisfaction:

1. Confirm: What command proves this claim?
2. Run: Execute the command in full (fresh, complete)
3. Read: Full output, check exit codes, count failures
4. Verify: Does the output confirm the claim?
   - If no: State the actual situation with evidence
   - If yes: State the claim with evidence attached
5. Only then: Make the claim

Skipping any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Enough |
|-------|----------|------------|
| Tests pass | Test command output: 0 failures | Last run result, "should pass" |
| Code has no lint errors | Lint output: 0 errors | Partial check, inference |
| Build succeeds | Build command: exit 0 | Lint passes, logs look good |
| Bug is fixed | Test of original symptom: passes | Code changed, assumption of fix |
| Regression test works | Red-green cycle verified | Test passed once |
| Subagent completed | VCS diff shows changes | Subagent reported "success" |
| Requirements met | Line-by-line checklist verification | Tests pass |

## Red Flags — Stop

- Using "should", "probably", "looks like"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting subagent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting to wrap up
- **Any wording that implies success without running verification**

## Excuse Prevention

| Excuse | Reality |
|--------|---------|
| "It should work now" | **Run** the verification command |
| "I'm confident" | Confidence ≠ Evidence |
| "Just this once" | No exceptions |
| "Lint passed" | Lint ≠ Compiler |
| "The subagent said it succeeded" | Verify independently |
| "I'm tired" | Fatigue ≠ Excuse |
| "A partial check is enough" | Partial proves nothing |
| "The rule doesn't apply if I phrase it differently" | Spirit over letter |

## Key Patterns

**Testing:**
```
✅ [Run test command] [See: 34/34 passing] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression testing (TDD red-green):**
```
✅ Write test → Run (pass) → Revert fix → Run (must fail) → Restore → Run (pass)
❌ "I wrote a regression test" (without verifying red-green cycle)
```

**Building:**
```
✅ [Run build] [See: exit 0] "Build succeeds"
❌ "Lint passed" (lint doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify one by one → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Subagent delegation:**
```
✅ Subagent reports success → Check VCS diff → Verify changes → Report actual status
❌ Trust subagent report
```

## When It Applies

**Always applies before:**
- Any variant of a success/completion claim
- Any expression of satisfaction
- Any positive statement about work status
- Committing, creating a PR, marking a task complete
- Moving to the next task
- Delegating to a subagent

## Bottom Line

**There are no shortcuts to verification.**

Run the command. Read the output. Then state the result.

This is non-negotiable.
