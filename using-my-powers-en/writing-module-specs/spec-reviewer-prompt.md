# Spec Reviewer Subagent Prompt Template

Use this template when dispatching a review subagent after a single module spec is written and the coordinator's self-check passes.

**Purpose:** Independently verify the spec is complete, consistent, and ready to enter the planning phase; also check enhanced feature dependency ordering.

**Dispatch timing:** `writing-module-specs` Step 6, after each module's spec is written, review individually.

**Model selection:** Standard model

```
Agent (general-purpose):
  description: "Review [<module-name>] spec document"
  prompt: |
    You are a spec document reviewer. Verify that this spec is complete, consistent,
    and ready to enter the plan writing phase.

    **Spec file to review:** `docs/specs/YYYY-MM-DD-<module>-spec.md`

    **This module's definition in modules.md (provided by coordinator; no need to read modules.md yourself):**
    ```
    <Coordinator pastes the module's responsibilities, boundaries, and interfaces paragraph from modules.md here>
    ```

    ## Review Dimensions

    | Dimension | Checkpoint |
    |-----------|------------|
    | Completeness | Are there unfilled placeholders (TBD, TODO (not intentionally marked), empty sections, `<to fill>` etc.)? |
    | Internal consistency | Do functional requirements match interface definitions? Is every feature in "Functional Requirements" assigned to either "Progressive Implementation → Core Features" or "Enhanced Features" with none left out? |
    | Clarity | Are there ambiguous requirements (same sentence interpretable two ways)? |
    | Responsibility scope | Is all spec content within the module's responsibility scope as defined in modules.md? |
    | YAGNI | Is there over-engineering or hypothetical functionality not supported by requirements? |
    | **Enhanced feature ordering** | In the "Progressive Implementation → Enhanced Features" list, are interdependent enhanced features ordered by implementation sequence? (Dependencies must come before the features that depend on them) |

    ## Calibration Principles

    **Only flag defects that would cause real problems in plan writing or implementation.**
    Missing requirements, internal contradictions, enhanced feature ordering errors — these are problems.
    Wording preferences, detail expression style, sections not detailed enough but intent is clear — these are not problems.

    Mark Issues Found for real problems; otherwise Approved.

    ## Report Format

    **Status:** Approved | Issues Found

    **Issues (if any):**
    - [Section X]: [Specific issue] — [Why it impacts plan writing or implementation]

    **Suggestions (non-blocking):**
    - [Improvement suggestion]
```

**Reviewer returns:** Status + issue list (if any) + suggestions

**Follow-up:**
- Approved → Commit the spec file to git, continue to the next module
- Issues Found → Modify the corresponding spec → Re-dispatch the same review subagent for re-review (do not skip re-review)
