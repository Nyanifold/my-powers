# my-powers

**Version:** 0.1.1

[中文](README.zh.md)

A multi-module software development methodology skill for AI coding agents.

> **Tested environments:** Claude Code + Claude Sonnet 4.6 / Deepseek V4 Pro / Kimi 2.6. Behavior on other agents or models is untested.

> **Note:** This project might be updated occasionally based on real usage experience. See [CHANGELOG](CHANGELOG.md) for what changed.

my-powers is deeply inspired by [superpowers](https://github.com/obra/superpowers) by Jesse Vincent. The core philosophy—skills as composable process documentation, subagent-driven implementation with two-stage review, TDD as a hard requirement, evidence before completion claims—comes directly from that project. my-powers adapts and extends that foundation for workflows centered on multi-module system design.

---

## Installation

Install it by placing the skill directory where your agent can find it:

```bash
# Claude Code example:
# Clone or copy to your skills directory
mkdir -p ~/.claude/skills/using-my-powers
cp -r using-my-powers-en ~/.claude/skills/using-my-powers # English version
# or if you prefer to use the Chinese version
cp -r using-my-powers ~/.claude/skills/using-my-powers # Chinese version
```

```bash
# Codex example:
# Clone or copy to your skills directory
mkdir -p ~/.agents/skills/using-my-powers
cp -r using-my-powers-en ~/.agents/skills/using-my-powers # English version
# or if you prefer to use the Chinese version
cp -r using-my-powers ~/.agents/skills/using-my-powers # Chinese version
```

To install the skill for one project only, just replace the `~` above to the project path. 

Then reference it in your `AGENTS.md` / `CLAUDE.md` or start a session and invoke:

```
/skill using-my-powers
```

---

## How It Works

Where superpowers starts from "what are you trying to build," my-powers starts one step earlier: "how should the system be decomposed." Before any spec is written, modules are explicitly defined with boundaries, interfaces, and dependency directions. Every subsequent phase operates on this module graph.

Once the structure is clear, specs are written per module, split into core and enhanced variants, then broken into task files and detailed plans. Implementation runs via subagents dispatched in dependency order, each receiving precisely constructed context. Two-stage review (spec compliance, then code quality) gates every task before it is marked complete.

The quality assurance skills—systematic debugging, verification before completion—are always available and explicitly referenced from the implementation flow.

---

## Scope and Intended Use

The core value of my-powers lies in **fine-grained phase decomposition** and **rich intermediate artifacts**: the full path from requirements to implementation is broken into independently confirmable stages, each producing structured outputs—specs, task files, plan documents, demos, and implementation reports. These artifacts are not only inputs to the next phase; they give users a window to observe, evaluate, and learn from the implementation at any point in the process. The workflow is linear and human-gated—each phase produces artifacts that a person reviews before the next phase begins. The checkpoints exist so that course corrections happen at the design level, not after thousands of lines have been written.

**What my-powers does not do:**

- It does not monitor running systems or react to production signals.
- It does not tune performance, latency, or resource usage automatically.
- It does not manage ongoing maintenance cycles or iterative feature delivery.

After the initial implementation ships, iteration happens manually: use the system, form opinions about what needs to change, then re-enter the workflow at the appropriate phase—rewrite a spec, revise a task file, add a new module. The methodology supports that loop, but does not automate it.

For work that requires systematic tuning—ML model training, GPU kernel optimization, hyperparameter search—the recommended pattern is to use my-powers to build a correct, well-structured prototype first, then hand off to a dedicated tuning skill for iterative optimization. my-powers gets the architecture right; the tuning skill drives the performance loop.

---

## Workflow

```
module-brainstorming
   Discuss system decomposition. Define module boundaries, interfaces,
   and dependency directions. Produce docs/my-powers-output/YYYY-MM-DD-modules.md.
   ↓ user confirms
writing-module-specs
   For each leaf module: brainstorm requirements, produce full spec
   with an iteration plan section (Core + optional Update phases).
   ↓ user confirms all specs
splitting-specs
   Parallel subagents split each spec into spec-core.md and
   spec-update-N-<feature>.md files per the iteration plan.
   Original spec stays unchanged.
   ↓
writing-task-files
   For each module: map spec features to independently demonstrable
   stages. Define deliverables, dependencies, and demo plans.
   ↓ user confirms all task files
writing-plans
   Parallel subagents generate a detailed plan document for each task
   stage, including step-by-step instructions, test pseudocode, and
   demo setup.
   ↓ user confirms all plans
subagent-implementation
   Dispatch implementation subagents in dependency order. Each task
   passes two-stage review before a report is written and the task
   is marked done. Global review runs after all tasks complete.
   ↓
finishing-a-module
   Verify tests and demos. Present merge / PR / keep / discard options.
   Handle worktree cleanup.
```

Quality assurance skills are independent and trigger at any time:

```
systematic-debugging          ← any bug, test failure, unexpected behavior
verification-before-completion ← before any completion claim or commit
```

### Context Length Management

Large projects can accumulate enough context to approach the conversation window limit.

During the design phases (`module-brainstorming`, `writing-module-specs`, `writing-plans`), each document is self-contained once written. You can start a fresh conversation **between any two documents** if the context is growing large — there is no need to wait for a phase boundary. Two particularly clean breakpoints are:

- **After all specs are complete, before entering `splitting-specs`**: Specs have been fully discussed; subsequent phases only need to read documents, not conversation history.
- **After all plans are complete, before entering `subagent-implementation`**: Plan documents are self-contained; implementation is driven by documents, not conversation history.

When starting the new conversation, provide the original requirements document plus all documents produced so far under `docs/my-powers-output/`.

---

## Relationship to superpowers

### Focus

superpowers centers on the development loop within a single feature or task: writing code correctly, debugging systematically, reviewing carefully, finishing cleanly. It assumes you already know what you're building and which module owns it.

my-powers is a slight refinement born from personal experience using superpowers. It extends the loop upstream by adding an explicit system decomposition phase—defining module boundaries, interfaces, and dependency directions—so that every subsequent step operates on a well-structured foundation. The implementation phase draws directly from superpowers' patterns: subagent isolation, two-stage review, TDD discipline, evidence before completion claims.

Two small additions are made to help users stay oriented throughout the build: each task stage requires a runnable demo so the feature's behavior is observable at every step, and each completed task produces a structured implementation report so users can follow what was built and why at any point in the process.

### Phase mapping

Each phase in my-powers has a direct ancestor or close analogue in superpowers.

| my-powers phase | superpowers origin | Notes |
|---|---|---|
| `module-brainstorming` | `brainstorming` | Extended from single-feature design to whole-system module decomposition, with structured boundary and interface definition |
| `writing-module-specs` | `brainstorming` + `writing-plans` | Merges the design dialogue from `brainstorming` with the spec-writing output from `writing-plans`; adds iteration plan sections (Core + optional Update phases) |
| `splitting-specs` | — | Original. Produces per-phase diff variants (spec-core + spec-update-N-*) derived from the spec's iteration plan |
| `writing-task-files` | `writing-plans` | Intermediate stage between spec and plan; makes each implementation stage independently demonstrable |
| `writing-plans` | `writing-plans` | Direct adaptation. Parallel subagent dispatch, same emphasis on step-level specificity |
| `subagent-implementation` | `subagent-driven-development` | Direct adaptation. Preserves two-stage review (spec compliance then code quality); adds dependency ordering, four status codes, and per-task implementation reports |
| `finishing-a-module` | `finishing-a-development-branch` | Direct port. Adds worktree ownership checks and `discard` confirmation gate |
| `systematic-debugging` | `systematic-debugging` | Direct port with Chinese adaptation. Adds mandatory bugfix records in `docs/my-powers-output/reports/` using the current stage's filename prefix |
| `verification-before-completion` | `verification-before-completion` | Direct port with Chinese adaptation |
| `receiving-code-review` | `receiving-code-review` | Direct port with Chinese adaptation. Removes personalized language; keeps technical verification flow and pushback guidance |

The TDD discipline from superpowers' `test-driven-development` skill is embedded directly into `subagent-implementation` rather than kept as a separate skill. Implementation subagents receive explicit TDD red flags and the same iron law: no production code without a failing test first.

---

## Document Conventions

All intermediate files use a `YYYY-MM-DD-` date prefix. The `docs/my-powers-output/` directory is managed automatically by my-powers skills — do not edit files there by hand.

```
docs/my-powers-output/
├── YYYY-MM-DD-modules.md                        # module-brainstorming
├── specs/
│   ├── YYYY-MM-DD-<module>-spec.md                    # writing-module-specs
│   ├── YYYY-MM-DD-<module>-spec-core.md               # splitting-specs (Core phase)
│   ├── YYYY-MM-DD-<module>-spec-update-1-<feature>.md # splitting-specs (Update 1)
│   └── YYYY-MM-DD-<module>-spec-update-N-<feature>.md # splitting-specs (Update N)
├── tasks/
│   └── YYYY-MM-DD-<module>-tasks.md             # writing-task-files
├── plans/
│   └── YYYY-MM-DD-<module>-task-N-plan.md       # writing-plans
└── reports/
    ├── YYYY-MM-DD-<module>-task-N-report.md     # subagent-implementation
    └── YYYY-MM-DD-<module>-task-N-bugfix[-M].md # systematic-debugging
```

Demo files live under `demo/<module>/stage-N/`.

---

## Repository Layout

```
my-powers/
├── README.md
├── LICENSE
├── using-my-powers/                   # Chinese variant
│   ├── SKILL.md                       # entry point
│   ├── module-brainstorming/
│   │   └── modules-reviewer-prompt.md
│   ├── writing-module-specs/
│   │   └── spec-reviewer-prompt.md
│   ├── splitting-specs/
│   │   └── spec-splitter-prompt.md
│   ├── writing-task-files/
│   │   └── task-file-reviewer-prompt.md
│   ├── writing-plans/
│   │   ├── plan-writer-prompt.md
│   │   └── plan-reviewer-prompt.md
│   ├── subagent-implementation/
│   │   ├── implementer-prompt.md
│   │   ├── spec-compliance-reviewer-prompt.md
│   │   ├── code-quality-reviewer-prompt.md
│   │   └── final-reviewer-prompt.md
│   ├── finishing-a-module/
│   ├── systematic-debugging/
│   │   ├── root-cause-tracing.md
│   │   ├── defense-in-depth.md
│   │   ├── condition-based-waiting.md
│   │   └── condition-based-waiting-example.ts
│   ├── verification-before-completion/
│   └── receiving-code-review/
└── using-my-powers-en/                # English variant (same structure)
    ├── module-brainstorming/
    ├── writing-module-specs/
    └── ...
```

---

## Skills

**Main workflow**
- `module-brainstorming` — system decomposition and boundary definition
- `writing-module-specs` — per-module spec with progressive implementation
- `splitting-specs` — parallel core/enhanced spec splitting
- `writing-task-files` — stage-by-stage task definitions with demos
- `writing-plans` — parallel detailed implementation plans
- `subagent-implementation` — dependency-ordered subagent execution with review
- `finishing-a-module` — verification, merge/PR options, cleanup

**Quality assurance**
- `systematic-debugging` — 4-phase root cause process before any fix attempt
- `verification-before-completion` — evidence before completion claims, always
- `receiving-code-review` — technical evaluation of review feedback; verify before implementing, push back when wrong

---

## Feedback

If you encounter unexpected behavior while using my-powers, feel free to open a discussion in the [Discussions tab](https://github.com/Nyanifold/my-powers/discussions).

---

## License

[MIT](LICENSE).

---

## Acknowledgements

Built on the shoulders of [superpowers](https://github.com/obra/superpowers) by Jesse Vincent. The systematic-debugging, verification-before-completion, and subagent-driven-development skills are adapted from that project. The iron laws, rationalization tables, and two-stage review pattern originate there.
