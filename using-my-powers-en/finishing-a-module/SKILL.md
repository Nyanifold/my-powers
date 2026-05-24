---
name: finishing-a-module
description: "Use after all task stages are implemented and global review passes. Verify tests and demos, present wrap-up options, handle worktree cleanup."
---

# Finishing a Module — Wrap-Up

Verify implementation results, present structured wrap-up options, execute the user's choice, clean up the workspace.

**Declaration:** 「I am using my-powers:finishing-a-module」

**Core principle:** Verify tests → Detect environment → Present options → Execute → Clean up

## Step 1: Verify Tests

Run the full test suite:

```bash
# Choose command based on project type
npm test / cargo test / pytest / go test ./...
```

**If tests fail:**
```
Tests did not pass (<N> failures). Must fix before continuing wrap-up:

[Display failure list]

Cannot merge or create PR with failing tests.
```

Stop. Do not proceed to Step 2.

**If tests pass:** Continue.

## Step 2: Verify Demos

Run each implemented stage's demo to confirm it works:

```bash
# For each stage's demo
cd demo/<module>/stage-N/
<run command>
```

**If demo fails:** Fix before continuing.

**Verification before declaration:** Without actually running verification commands, never claim tests pass or demos work.

## Step 3: Detect Git Environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

| State | Menu | Cleanup Method |
|-------|------|----------------|
| `GIT_DIR == GIT_COMMON` (normal repo) | Standard 4 options | No worktree to clean |
| `GIT_DIR != GIT_COMMON`, named branch | Standard 4 options | Based on ownership (see Step 6) |
| `GIT_DIR != GIT_COMMON`, detached HEAD | Simplified 3 options (no merge) | Don't clean (externally managed) |

## Step 4: Determine Base Branch

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

If undetermined, ask: "Current branch diverged from main. Is this correct?"

## Step 5: Present Options

**Normal repo and named branch worktree (standard 4 options):**

```
Implementation complete. Tests and demos verified. What would you like to do?

1. Merge back to <base-branch> (local)
2. Push and create Pull Request
3. Keep current branch (handle manually later)
4. Discard this implementation

Choose (1-4):
```

**Detached HEAD (simplified 3 options):**

```
Implementation complete. Tests and demos verified. Currently on detached HEAD (externally managed workspace).

1. Push as new branch and create Pull Request
2. Keep current state (handle manually later)
3. Discard this implementation

Choose (1-3):
```

**Do not add extra commentary.** Keep options concise.

## Step 6: Execute Choice

### Option 1: Local Merge

```bash
# Switch to main repo root
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# Merge first, clean up only after confirming success
git checkout <base-branch>
git pull
git merge <feature-branch>

# Verify tests after merge
<test command>
```

After merge succeeds and tests pass:
- Execute Step 7 to clean up worktree
- Delete feature branch: `git branch -d <feature-branch>`

### Option 2: Push and Create PR

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
<List main changes>

## Implementation Reports
<List all report file paths>

## Verification
- [ ] All tests pass
- [ ] All demos runnable
EOF
)"
```

**Do not clean up worktree** (user still needs it for PR feedback iteration).

### Option 3: Keep Branch

Report: "Branch <name> kept, worktree retained at <path>."

**Do not clean up worktree.**

### Option 4: Discard

**Must type to confirm, to prevent accidents:**

```
The following will be permanently deleted:
- Branch: <name>
- Commit list: <commit list>
- Worktree path: <path> (if applicable)

Type 'discard' to confirm, any other input cancels:
```

Wait for user input. Only proceed if exactly `discard` is typed:

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

Execute Step 7 to clean up worktree, then:
```bash
git branch -D <feature-branch>
```

## Step 7: Clean Up Worktree (Options 1 and 4 only)

**Ownership check: Only clean up worktrees created by my-powers.**

```bash
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**If `GIT_DIR == GIT_COMMON`:** Normal repo, no worktree to clean, skip.

**If worktree path is under the following directories, it was created by my-powers; clean it up:**
- `.worktrees/`
- `worktrees/`

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"  # Must leave worktree directory before remove
git worktree remove "$WORKTREE_PATH"
git worktree prune  # Clean up dangling registrations
```

**If worktree path is not under the above directories:** The worktree is managed by external harness. Do not clean up. If the platform provides a tool to exit worktrees, use that tool; otherwise leave it as-is.

## Quick Reference

| Option | Merge | Push | Keep Worktree | Delete Branch |
|--------|-------|------|---------------|---------------|
| 1. Local Merge | ✓ | - | - | ✓ |
| 2. Create PR | - | ✓ | ✓ | - |
| 3. Keep | - | - | ✓ | - |
| 4. Discard | - | - | - | ✓ (forced) |

## Red Flags

**Never:**
- Proceed with merge or PR when tests fail
- Claim tests pass without running verification commands
- Skip verifying merge results before merging
- Clean up worktree on Option 2 (user still needs to iterate on PR)
- Delete worktrees not created by my-powers (ownership check)
- Skip typed confirmation for discard
- Run `git worktree remove` from inside the worktree (cd to main repo root first)
- Delete branch before removing worktree (order: merge → remove worktree → delete branch)
