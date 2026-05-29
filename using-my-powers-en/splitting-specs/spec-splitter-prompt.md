# Spec Splitter Subagent Prompt Template

Use this template when dispatching a spec splitting subagent for a module.

**Purpose:** Extract each iteration phase's content scope from the original spec's "Iteration Plan" section, generating spec-core.md and one spec-update-N-<feature>.md per update phase.

**Dispatch timing:** `splitting-specs` Step 2, one subagent per leaf module.

```
Agent (general-purpose):
  description: "Split iteration phase spec files for module [<module-name>]"
  prompt: |
    Your task is to generate iteration phase diff files for module "<module-name>",
    extracting and describing each phase's content scope from the original spec's "Iteration Plan" section.

    **Input file:**
    - Original spec: `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md`

    **This module's definition in modules.md (provided by coordinator; no need to read modules.md):**
    ```
    <Coordinator pastes the module's responsibilities, boundaries, and interfaces paragraph from modules.md here>
    ```

    **This module's iteration phases (extracted from the spec by the coordinator):**
    - Core: <minimal runnable set name>
    - Update 1: <feature-name> (if present)
    - Update N: <feature-name> (if more exist)

    **Output files (original spec remains unchanged; do not modify it):**
    - `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-core.md`
    - `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md` (if Update 1 exists)
    - `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md` (if more Updates exist)

    ## Generate spec-core.md

    Describe the Core phase implementation scope. Structure:

    ```markdown
    # <module-name> Core Spec

    > This file describes the Core phase scope of `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md`.
    > Complete interface definitions are in the original spec; this file only describes what the Core phase implements.

    ## Core Phase Implementation Scope

    <Extracted from the original spec "Iteration Plan → Core" section, listed item by item>

    ## Interface Behavior Notes (Core Phase)

    <Only list interfaces that differ in behavior from later phases; describe the behavior limitation in the Core phase>
    <If the Core phase fully implements an interface, no need to repeat here>

    Example:
    - `POST /items`: Core phase only supports synchronous creation, not batch creation
    - `GET /items/{id}`: Core phase does not return the `related_items` field

    ## Not Implementing (Left for Later Update Phases)

    <Extracted from the original spec "Iteration Plan → Update N" sections, listed item by item>
    <This is an explicit exclusion list so implementers know what NOT to do>
    ```

    ## Generate spec-update-N-<feature>.md

    Generate one file per Update phase, describing what that phase adds on top of all preceding phases.
    Filename: `docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`
    (N is the phase number; feature is the phase name from the iteration plan, converted to kebab-case)

    Structure for each file:

    ```markdown
    # <module-name> Update N: <feature-name> Spec

    > This file describes the incremental content of "Update N: <feature-name>" on top of all preceding phases.
    > All preceding phases must be complete before implementing this phase.
    > Complete interface definitions are in the original spec.

    ## This Phase's Feature Scope

    <Extracted from the original spec "Iteration Plan → Update N: <feature-name>" section, listed item by item>

    ## Behavior Changes (Relative to Preceding Phases)

    <Specifically describe which preceding-phase behavior changes, or what new behavior is added>

    ## Interface Changes (if any)

    <New fields, new endpoints, parameter changes, etc.>

    ## Dependency Conditions

    <Whether it depends on other Update phases being completed first, or depends on another module's phase>

    ## Not Implementing (Left for Later Update Phases)

    <If there are more Updates after this phase, list what this phase does not do>
    <If this is the last phase, this section may be omitted>
    ```

    ## Report on Completion

    After writing all files, commit to git, then report:
    `DONE: <module-name> — Generated spec-core.md and <N> spec-update-*.md files`

    ## Red Flags

    **Never:**
    - Modify the original spec file
    - Repeat complete interface definitions in spec-core (reference instead)
    - Write implementation details in spec-update files (only behavior changes)
    - Read other modules' files
    - Omit any Update phase from the original spec's iteration plan
```

**Subagent returns:** DONE status + all generated file paths, or failure description
