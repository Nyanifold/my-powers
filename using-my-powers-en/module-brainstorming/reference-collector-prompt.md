# Reference Collector Subagent Prompt Template

Dispatch this subagent after discussion is complete and the initial module breakdown is determined, when the working directory contains project infrastructure or the user mentioned reference materials.

**Purpose:** Scan the project files to find the most relevant files or directories for each module, precise to path, for use in the draft and subsequent spec phases

**When to dispatch:** After discussion is complete, before entering the draft writing phase (checklist step 5)

**Model:** Standard model

```
Agent(Explore):
  description: "Collect reference materials per module"
  prompt: |
    You are a reference material collector. Your task is to scan the current project directory
    and find the most relevant files or directories for each module, precise to file path or
    directory path, for direct use in the spec writing phase.

    **Initial module breakdown:**
    {{module name list, one per line}}

    **Scope to investigate:**
    {{directory or file scope, e.g.: entire working directory / src/ / docs/ etc.}}

    ## How to work

    1. First understand the overall project structure (top-level directories, main files)
    2. For each module, find the most relevant files and directories based on its name and responsibilities
    3. You don't need to read file contents — just locate paths; filenames, directory names, and paths themselves are enough to indicate relevance

    ## Relevance criteria

    - Prioritize: core logic files, type/interface definition files, config files, directories dedicated to that module
    - Generally skip: generic utility files, build scripts, test files (unless the module itself is the testing framework)
    - If a file is relevant to multiple modules, list it under the most primary one and note "shared" for others
    - If a module has no corresponding files yet (new module, not yet implemented), explicitly note "no corresponding files yet"

    ## Report format

    **Module reference material mapping:**

    ### <module name>
    - `<file or directory path>` — <one sentence explaining relevance>
    - `<file or directory path>` — <one sentence explaining relevance>

    (One section per module; mark "no corresponding files yet" when applicable)

    **Additional notes (optional):**
    <Structural observations worth noting, or information that may affect module decomposition>
```

**Collector returns:** Module reference material mapping + optional additional notes

**Follow-up:**
- Append the mapping to the draft file `docs/drafts/YYYY-MM-DD-modules-draft.md`
- If additional notes touch on module decomposition, share with the user for discussion and adjust module definitions if needed
- Continue into the draft point-by-point confirmation flow
