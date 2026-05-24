# Spec Splitter Subagent Prompt Template

Use this template when dispatching a spec splitting subagent for a module.

**Purpose:** Extract core and enhanced content scope from the original spec, generating two diff files.

**Dispatch timing:** `splitting-specs` Step 2, one subagent per leaf module.

```
Agent (general-purpose):
  description: "Split spec-core and spec-enhanced for module [<module-name>]"
  prompt: |
    Your task is to generate two diff files for module "<module-name>",
    extracting and distinguishing core and enhanced content scope from the original spec.

    **Input file:**
    - Original spec: `docs/specs/YYYY-MM-DD-<module>-spec.md`

    **This module's definition in modules.md (provided by coordinator; no need to read modules.md):**
    ```
    <Coordinator pastes the module's responsibilities, boundaries, and interfaces paragraph from modules.md here>
    ```

    **Output files (original spec remains unchanged; do not modify it):**
    - `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
    - `docs/specs/YYYY-MM-DD-<module>-spec-enhanced.md`

    ## Generate spec-core.md

    Describe the core version implementation scope. Structure:

    ```markdown
    # <module-name> Core Spec

    > This file describes the core version scope of `docs/specs/YYYY-MM-DD-<module>-spec.md`.
    > Complete interface definitions are in the original spec; this file only describes what the core version implements.

    ## Core Version Implementation Scope

    <Extracted from the original spec "Progressive Implementation → Core Features" section, listed item by item>

    ## Interface Behavior Notes (Core Version)

    <Only list interfaces that differ in behavior from the enhanced version; describe the behavior limitation in the core version>
    <If the core version fully implements an interface, no need to repeat here>

    Example:
    - `POST /items`: Core version only supports synchronous creation, not batch creation
    - `GET /items/{id}`: Core version does not return the `related_items` field

    ## Not Implementing (Left for Enhanced Version)

    <Extracted from the original spec "Progressive Implementation → Enhanced Features" section, listed item by item>
    <This is an explicit exclusion list so implementers know what NOT to do>
    ```

    ## Generate spec-enhanced.md

    Describe the incremental content the enhanced version adds on top of the core version. Structure:

    ```markdown
    # <module-name> Enhanced Spec

    > This file describes incremental content on top of the core version.
    > The core version must be complete before implementing the enhanced version.
    > Complete interface definitions are in the original spec.

    ## Enhanced Feature List

    ### Enhanced Feature 1: <Name>

    **Trigger condition:** <When this feature needs to be implemented>

    **Behavior changes (relative to core version):**
    <Specifically describe which core version behavior changes, or what new behavior is added>

    **Interface changes (if any):**
    <New fields, new endpoints, parameter changes, etc.>

    **Dependency conditions:**
    <Whether it depends on other enhanced features being completed first, or depends on other modules' enhanced versions>

    ---

    ### Enhanced Feature 2: <Name>

    (Same format as above)
    ```

    ## Report on Completion

    After writing both files, commit to git, then report:
    `DONE: <module-name> — Generated spec-core.md and spec-enhanced.md`

    ## Red Flags

    **Never:**
    - Modify the original spec file
    - Repeat complete interface definitions in spec-core (reference instead)
    - Write implementation details in spec-enhanced (only behavior changes)
    - Read other modules' files
```

**Subagent returns:** DONE status + two file paths, or failure description
