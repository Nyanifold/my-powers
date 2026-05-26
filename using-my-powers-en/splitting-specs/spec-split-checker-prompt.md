# Spec Split Checker Subagent Prompt Template

Use this template when dispatching one checker subagent per module in parallel, after all splitter subagents complete.

**Purpose:** Verify that the split results are disjoint and complete relative to the original spec's iteration plan.

**Dispatch timing:** `splitting-specs` Step 3, after all splitters complete; one checker per module, executing in parallel.

```
Agent (general-purpose):
  description: "Check completeness and disjointness of [<module-name>] iteration plan split"
  prompt: |
    Your task is to verify that the iteration plan split for module "<module-name>" satisfies two properties:
    completeness (every feature in the original spec appears in exactly one phase file)
    and disjointness (no feature appears in the implementation scope of more than one phase file).

    **Input files (read directly):**
    - Original spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`
    - Core phase file: `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
    - Update phase files (listed by coordinator):
      - `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md` (if present)
      - `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md` (if present)

    **Do not modify any files.**

    ## Checking Process

    **Step 1: Extract the complete feature set F from the original spec**

    Read the "Iteration Plan" section of the original spec. Extract all feature items from each phase, building the complete feature set F.
    For each feature, record:
    - **Name**: the verbatim feature name from the spec (do not rewrite)
    - **Summary**: a one-sentence description of what the feature does (in your own words, not a copy of the spec text)

    **Step 2: Extract the implementation scope of each phase file**

    Read the "Implementation Scope" (or "Core Phase Implementation Scope" / "This Phase's Feature Scope") section of each phase file.
    Extract the feature items each file claims to implement, recording name (verbatim) and summary in the same format, forming coverage sets S_core, S_update_1, …

    Note: A phase file's "Not Implementing" section is an exclusion declaration, not part of its coverage.

    Subsequent checks use the **name** as the matching key; the summary is included in reports to help readers quickly understand each issue.

    **Step 3: Completeness check**

    Verify: every item in F appears in at least one S.
    Find any items in F not covered by any phase file (missing features).

    **Step 4: Disjointness check**

    Compare the coverage sets of all phase file pairs. Find any items that appear in the implementation scope of more than one phase file (duplicate features).

    ## Report Format

    ```
    Status: PASS | FAIL

    Completeness issues (if any, one per line):
    - "<feature name verbatim>" (<one-sentence summary>) does not appear in any phase file's implementation scope

    Disjointness issues (if any, one per line):
    - "<feature name verbatim>" (<one-sentence summary>) appears in both <file A> and <file B> implementation scopes
    ```

    Output only `Status: PASS` when all checks pass; no further content needed.
```

**Checker returns:** PASS, or FAIL + specific issue list

**Follow-up:**
- PASS → Module passes; wait for all modules to complete
- FAIL → Coordinator fixes the corresponding phase files based on the issues → Re-dispatch this module's checker until PASS
