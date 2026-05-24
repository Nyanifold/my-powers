---
name: receiving-code-review
description: "Use when receiving code review feedback, before implementing any suggestions. Especially when feedback comes from external reviewers, is unclear, or involves technical questions."
---

# Receiving Code Review

Code review requires technical evaluation, not emotional performance.

**Declaration:** 「I am using my-powers:receiving-code-review」

**Core principle:** Verify before implementing. Ask when unclear. Technical correctness over social comfort.

**Violating the letter of this rule is violating its spirit.**

## Response Pattern

```
When receiving code review feedback:

1. Read: Read all feedback completely, don't rush to respond
2. Understand: Restate the requirement in your own words (or ask clarifying questions)
3. Verify: Cross-check against the codebase
4. Evaluate: Is it technically sound for the current codebase?
5. Respond: Technical confirmation or reasoned pushback
6. Implement: Handle item by item, testing each separately
```

## Forbidden Responses

**Never say:**
- "You're absolutely right!" (performative agreement)
- "Good point!" / "Thanks for catching that!" (empty praise)
- "Let me implement that right away" (before verification)
- Any expression of gratitude

**Instead:**
- Restate the technical requirement
- Ask clarifying questions
- Push back with technical reasons (if the suggestion is problematic)
- Take direct action (action over words)

## Handling Unclear Feedback

```
If any item is unclear:
  Stop — do not implement any items first
  Ask clarifying questions about the unclear items

Reason: Items may be interrelated. Incomplete understanding = incorrect implementation.
```

**Example:**
```
Feedback: "Fix items 1-6"
You understand 1, 2, 3, 6. You don't understand 4, 5.

❌ Wrong: Implement 1, 2, 3, 6 first, ask about 4, 5 later
✅ Correct: "I understand items 1, 2, 3, 6. Please clarify items 4, 5 before I begin."
```

## Handling by Feedback Source

### From User (Project Owner)
- **Trusted** — Implement after understanding
- **Still clarify** — Ask when scope is unclear
- **No performative agreement**
- **Direct action** or technical confirmation

### From External Reviewer

```
Before implementing:
  1. Check: Is this technically correct for the current codebase?
  2. Check: Will this break existing functionality?
  3. Check: Is there a reason the current implementation exists as-is?
  4. Check: Is this valid across all platforms/versions?
  5. Check: Does the reviewer have full context?

If the suggestion looks problematic:
  Push back with technical reasons

If it can't be easily verified:
  State directly: "I cannot verify this without [X]. Should I [investigate/ask/proceed]?"

If it conflicts with a prior user decision:
  Stop. Discuss with the user first.
```

## YAGNI Check

```
If a reviewer suggests "properly implementing" some feature:
  grep the codebase for actual usage

  If unused: "This interface has no callers. Remove it (YAGNI)?"
  If used: Implement properly
```

## Implementation Order

```
For multiple feedback items:
  1. Clarify all unclear items first
  2. Implement in this order:
     - Blocking issues (breaking changes, security)
     - Simple fixes (typos, imports)
     - Complex fixes (refactoring, logic)
  3. Test each item separately
  4. Confirm no regressions introduced
```

## When to Push Back

Push back when:
- The suggestion would break existing functionality
- The reviewer lacks full context
- It violates YAGNI (unused features)
- Technically incorrect for the current tech stack
- Historical or compatibility reasons exist
- Conflicts with the user's architectural decisions

**How to push back:**
- Use technical reasons, not emotion
- Ask specific questions
- Reference available tests or code
- Involve the user if it concerns architecture

## Confirming Correct Feedback

When feedback is indeed correct:
```
✅ "Fixed. [Brief explanation of what changed]"
✅ "Good catch — [specific issue]. Fixed in [location]."
✅ [Direct fix, shown in code]

❌ "You're absolutely right!"
❌ "Good point!"
❌ "Thanks for catching that!"
❌ Any form of thanks
```

## Gracefully Correcting Your Own Pushback

If you pushed back and realize you were wrong:
```
✅ "You were right — I checked [X] and it does [Y]. Implementing now."
✅ "Verified, you're correct. My initial understanding was wrong because [reason]. Fixing now."

❌ Long apologies
❌ Defending the original pushback
❌ Over-explaining
```

State the correction and move on.

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Performative agreement | State the requirement or take direct action |
| Blind implementation | Verify against the codebase first |
| Batch processing without testing | Implement and test item by item |
| Defaulting to reviewer being correct | Check if it would break existing functionality |
| Avoiding pushback | Technical correctness over comfort |
| Partial implementation | Clarify all items first |
| Continuing when unable to verify | State limitations, ask for direction |

## GitHub Comment Replies

When replying in GitHub inline comment threads, reply to the specific comment thread (`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies`), not as a top-level PR comment.

## Bottom Line

**External feedback = suggestions to evaluate, not commands to execute.**

Verify. Question. Then implement.

No performative agreement. Technical rigor always comes first.
