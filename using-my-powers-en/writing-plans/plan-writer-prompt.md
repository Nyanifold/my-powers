# Plan Writer Subagent Prompt Template

Use this template when dispatching a plan writer subagent for a module's task stage.

**Purpose:** Generate a complete plan document for the specified module + stage.

**Dispatch timing:** `writing-plans` Step 2, one subagent per (module, stage); all subagents execute in parallel.

```
Agent (general-purpose):
  description: "Write plan document for [<module-name>] Stage [N]"
  prompt: |
    Your task is to write a plan document for module "<module-name>" Stage <N> (<stage-name>).

    **Input file paths (read these files for details):**
    - Original spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`
    - Core version scope: `docs/specs/YYYY-MM-DD-<module>-spec-core.md` (if applicable)
    - Enhanced version scope: `docs/specs/YYYY-MM-DD-<module>-spec-enhanced.md` (if applicable)

    **Below is the task description for this stage (extracted from tasks file; coordinator has already extracted it; no need to read the file yourself):**
    ```
    <Coordinator pastes the complete text of this stage from the tasks file here>
    ```

    **Output file:** `docs/plans/YYYY-MM-DD-<module>-task-<N>-plan.md`

    ## Plan Document Structure

    ```markdown
    # <module-name> Stage <N>: <stage-name> Plan

    > Generated: YYYY-MM-DD
    > Corresponding spec: docs/specs/YYYY-MM-DD-<module>-spec.md
    > Corresponding tasks stage: Stage <N>

    ## Goals and Scope

    <One sentence describing the goal of this stage>

    Corresponding spec scope: <spec-core or spec-enhanced, which features>

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
    - [ ] Implementation report written to `docs/reports/YYYY-MM-DD-<module>-task-<N>-report.md`
    ```

    ## Report on Completion

    After writing the file and committing to git, report:
    `DONE: <module-name> Stage <N> — Plan document generated`

    ## Red Flags

    **Never:**
    - Write complete implementation code in plan documents (only pseudocode and design intent)
    - Read the tasks file yourself (coordinator has already extracted content and passed it in)
    - Read other modules' files
    - Skip the demo instructions section
    - Write test descriptions that only say "test feature X" without describing specific behaviors and edge cases
```

**Subagent returns:** `DONE: <module-name> Stage <N> — Plan document generated`, or failure description
