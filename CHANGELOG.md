# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [0.1.3] - 2026-05-29

### Fixed

- **Prompt template pointers missing** — Key dispatch steps in `splitting-specs`, `writing-plans`, and `subagent-implementation` were not referencing the prompt template files that already existed alongside them. Added an explicit "Prompt template:" line to each dispatch step naming the `.md` file to use. Coordinators previously had to infer which template applied to which step.

### Added

- **Reference materials passed to plan-writer subagents** — `writing-plans` now includes the reference material paths listed for each module in `modules.md` in the context package sent to plan-writer subagents. The subagent is instructed to read those files before designing implementation steps. Added to both `SKILL.md` and `plan-writer-prompt.md` (EN and ZH).

### Changed

- **Implementation report ownership clarified** — `subagent-implementation` now explicitly states that the implementer subagent (not the coordinator) writes the implementation report. The coordinator must not write the report on the subagent's behalf.
- **Pre-final-review checklist expanded** — Coordinator's pre-audit check before dispatching the global review subagent now includes two additional items: (1) each completed stage has a corresponding implementation report under `docs/my-powers-output/reports/`; (2) each report's interface examples, file paths, and expected output are consistent with the actual code changes.
- **`spec-compliance-reviewer-prompt.md` — "Implementation Report" dimension added** — Spec compliance review now checks whether a report exists for the stage, whether interface usage examples match the actual code, whether file paths are accurate, and whether expected output is reproducible. "Implementation Report" added as a fourth issue type alongside Missing Requirement / Over-implementation / Misunderstanding. Applied to both EN and ZH versions.
- **Global review — report consistency dimension added** — The final global review subagent now checks whether each completed stage has a corresponding implementation report and whether the report's interface examples, file paths, and expected output are consistent with the actual implementation.

---

## [0.1.2] - 2026-05-29

### Breaking Changes

- **Output directory renamed** — All generated files moved from `docs/` to `docs/my-powers-output/`. Affects every phase (modules, specs, tasks, plans, reports, drafts). Existing projects must manually migrate the `docs/` directory to `docs/my-powers-output/`.

### Changed

- **Draft confirmation — expanded point presentation** — When confirming each key point with the user one at a time, the agent now fully expands the content of that point and explains the rationale behind the decision (why this option was chosen over the alternatives discussed). Applies to `module-brainstorming` (Step 2) and `writing-module-specs` (Step 4, point 2), both EN and ZH.
- **`splitting-specs` — Core-only fast path** — Modules whose iteration plan contains only a Core phase (no Update phases) now skip the splitting subagent entirely. The original spec is copied directly as `spec-core.md`, committed to git, and the coordinator explicitly declares this for each such module. Only multi-phase modules proceed through the splitter and checker subagents. Added two corresponding Red Flags: do not dispatch a subagent for a Core-only module; do not omit the explicit declaration when copying.

### Added

- **Self-review checklists** — All design and implementation phases now include a self-review step for the main agent to run before dispatching a subagent reviewer. Each checklist targets common failure modes for that phase:
  - `module-brainstorming`: five required leaf-module fields, no implementation detail in interfaces, no dependency cycles, spec writing order matches dependency order, no missing open questions
  - `writing-module-specs`: iteration plan present, interfaces defined to field level, boundaries non-empty, no unexplained TBD/TODO, open-questions section contains only items the user explicitly deferred to a later version
  - `writing-task-files`: each stage has a demonstrable artifact, dependency order correct, review checklist covers all expected outputs, demo steps are concrete and executable
  - `writing-plans`: implementation steps are specific, test pseudocode covers boundary cases, demo matches tasks file, no missing handoffs between stages
  - `subagent-implementation` (coordinator): pre-audit check of git diff scope and naming conventions; pre-global-audit check that all stages are complete, interfaces match `modules.md`, and demo commands are runnable
- **"Spec writing order" section in `modules.md` template** — `module-brainstorming` now produces a ranked list of leaf modules ordered by ascending dependency count. Modules with no dependencies come first; each entry lists its dependencies explicitly. This list doubles as the execution order for `writing-module-specs`, ensuring interface changes only propagate forward and never invalidate already-completed specs.
- **Tech stack must be fully resolved in spec** — `writing-module-specs` now enforces that every technology decision (algorithm, library, storage, interface fields, error handling) is finalized during spec discussion. Items the user has not explicitly deferred to a future version may not appear as TBD in the spec. The discussion template gained a dedicated "Technology Choices & Algorithms" block. The open-questions section is restricted to items the user explicitly labeled "future version work."

---

## [0.1.1] - 2026-05-28

### Added

- **Draft confirmation flow** — `module-brainstorming` and `writing-module-specs` now require writing a draft with `- [ ]` checkboxes before any formal document. Each key point is confirmed with the user one at a time; explicit approval is required before proceeding to the formal document. This prevents misaligned assumptions from surfacing late in the implementation phase.
- **Reference material collection step** — `module-brainstorming` now dispatches an Explore subagent before writing the draft when the working directory contains project infrastructure or the user mentioned reference materials. The subagent maps relevant files/directories per module and attaches findings to the draft.
- **"Dependencies on existing implementations" field** — Leaf module definitions now require a fifth item: listing existing code, libraries, or services the module will reuse or wrap, along with the dependency style (direct call / wrapped and re-exposed / underlying driver). Reviewer prompts updated to check this field.
- **Task tracking** — `module-brainstorming` and `writing-module-specs` now create TaskCreate tasks for each checklist item, marking them completed as work progresses.
- **`reference-collector-prompt.md`** — New template for dispatching the reference material collection subagent in `module-brainstorming` (both EN and ZH versions).
- **Anti-Pattern sections** in `module-brainstorming` and `writing-module-specs` — Explicit call-outs for "this system doesn't need decomposition" and "this module is simple enough to skip draft confirmation." Establishes that single-module and short-spec outcomes are valid conclusions reached through discussion, not reasons to skip the process.

### Changed

- **Sub-skill invocation style** — All sub-skill transitions (e.g., `my-powers:writing-module-specs`) changed to "invoke the X sub-skill — read `X/SKILL.md`" with the Read tool. Entry `SKILL.md` updated in both EN and ZH to document this pattern. Affects: `module-brainstorming`, `writing-module-specs`, `splitting-specs`, `subagent-implementation`, `writing-task-files`, `writing-plans`, `systematic-debugging`, and their reviewer prompts.
- **Questioning approach** — "Provide options" guidance upgraded to "provide 3-5 concrete options with the core tradeoff of each explained." Applied in `module-brainstorming` and `writing-module-specs`.
- **Entry SKILL.md section title** — "Skill Locations" renamed to "Sub-Skill Structure and Invocation" (both EN and ZH).
- **Module tree format** — Template now shows that leaf nodes may contain sub-modules (internal organization; no separate spec or task file required).
- **`writing-module-specs`** — Added note that internal implementation hints in `modules.md` (data structures, storage approach, internal layering) are not constraints; the spec phase starts internal design from scratch.
- **`modules-reviewer-prompt.md`** — Definition completeness check updated from four to five required items; added "existing implementation dependencies" as a dedicated review dimension.
- **`writing-module-specs` step numbering** — Draft Confirmation inserted as new Step 4; former Step 4 (Write Spec File) becomes Step 5; former Step 5 (Dispatch Review Subagent) becomes Step 6.
- **`module-brainstorming` checklist** — Reference material collection inserted as new step 5; former step 5 (write document) becomes step 6; former step 6 (wait for user confirmation) becomes step 7.
- **README / README.zh.md** — Added version badge (`0.1.1`) and tested environment note (Claude Code + Claude Sonnet 4.6 / Deepseek V4 Pro / Kimi 2.6).

### Red Flags added

The following anti-patterns are now explicitly listed as Red Flags in their respective skills:

- `module-brainstorming`: Skip draft confirmation flow; skip reference material collection when infrastructure exists; write formal document without user approval after all points confirmed.
- `writing-module-specs`: Skip draft confirmation flow; write formal spec without user approval after all points confirmed; treat `modules.md` internal hints as settled conclusions and skip discussion.
