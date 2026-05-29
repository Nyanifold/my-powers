---
name: using-my-powers
description: "Entry point for my-powers: a multi-module AI-assisted development methodology. Read this to understand the full workflow and navigate to the relevant sub-skills based on where you are in the process."
---

# My-Powers — System-Level Development Methodology

My-Powers is an AI-assisted development methodology for multi-module systems. It breaks system development into: module decomposition → spec design → task planning → subagent implementation → finishing. Each phase has clear human-AI collaboration checkpoints.

**Declaration:** Whenever entering a new skill, declare 「I am using my-powers:<skill-name>」.

## When to Use

- Building a new system from scratch
- Adding large features that require multiple modules to collaborate to an existing system
- Any work that requires defining module boundaries before implementation

## Full Workflow

```
module-brainstorming        ← Discuss system decomposition with user, define module boundaries and interfaces
         ↓ User confirms module description document
writing-module-specs        ← Brainstorm each leaf module serially, write specs
         ↓ User confirms all specs
splitting-specs             ← Subagents split each module's spec into iteration phase files in parallel (spec-core + spec-update-N-*)
         ↓
writing-task-files          ← Write task files for each module serially (stages, deliverables, demos)
         ↓ User confirms all task files
writing-plans               ← Subagents generate plan documents for each task in parallel
         ↓ User confirms all plans
subagent-implementation     ← Subagent-driven implementation, scheduled by dependency order
         ↓
finishing-a-module          ← Verification, wrap-up, merge or PR
```

## Document Conventions

All intermediate files use a date prefix `YYYY-MM-DD-`.

```
docs/my-powers-output/
├── YYYY-MM-DD-modules.md                             # Module description document
├── specs/
│   ├── YYYY-MM-DD-<module>-spec.md                       # Original spec (main agent)
│   ├── YYYY-MM-DD-<module>-spec-core.md                  # Core phase scope (subagent)
│   ├── YYYY-MM-DD-<module>-spec-update-1-<feature>.md    # Update 1 increment (subagent)
│   └── YYYY-MM-DD-<module>-spec-update-N-<feature>.md    # Update N increment (subagent)
├── tasks/
│   └── YYYY-MM-DD-<module>-tasks.md                 # Task file (main agent)
├── plans/
│   └── YYYY-MM-DD-<module>-task-N-plan.md           # Plan document (subagent)
└── reports/
    ├── YYYY-MM-DD-<module>-task-N-report.md         # Implementation report (subagent)
    └── YYYY-MM-DD-<module>-task-N-bugfix[-M].md     # Bugfix record (generated during debugging)
```

Demo files are placed under `demo/<module>/stage-N/`.

## Core Principles

- **Module boundaries first**: Define boundaries clearly; internal changes to a module should not affect other modules
- **Progressive implementation**: Each module's iteration plan starts from Core (minimal runnable set), with optional Update phases layered on top; each phase preserves existing interfaces
- **Subagent isolation**: Each subagent receives only the precise context needed for its task; no inherited conversation history
- **Verification before declaration**: Never claim any phase is complete without running verification commands
- **Continuous execution**: During implementation, do not ask the user whether to continue unless encountering an unresolvable BLOCKED state

## Use What You Need — No Need to Run the Full Pipeline

**You don't always need to go through the entire workflow from start to finish.** Jump directly to the relevant phase based on user needs:

- User just wants to brainstorm module decomposition → use only `module-brainstorming`
- User has module definitions and needs specs → start directly from `writing-module-specs`
- User has specs and needs splitting → use `splitting-specs` directly
- User has task files and needs planning → use `writing-plans` directly
- User has plans and needs implementation → use `subagent-implementation` directly
- Encountering a bug → use `systematic-debugging` directly
- Before claiming completion → use `verification-before-completion` directly
- Receiving code review → use `receiving-code-review` directly

## Sub-Skill Structure and Invocation

All sub-skills are located in the same directory as this file (`using-my-powers/`), each with its own `SKILL.md`:

```
using-my-powers/SKILL.md                        ← Entry point (this file)
using-my-powers/module-brainstorming/SKILL.md
using-my-powers/writing-module-specs/SKILL.md
using-my-powers/splitting-specs/SKILL.md
using-my-powers/writing-task-files/SKILL.md
using-my-powers/writing-plans/SKILL.md
using-my-powers/subagent-implementation/SKILL.md
using-my-powers/finishing-a-module/SKILL.md

# Quality assurance (can be triggered independently at any time)
using-my-powers/systematic-debugging/SKILL.md           ← When encountering bugs or unexpected behavior
using-my-powers/verification-before-completion/SKILL.md ← Before claiming completion
using-my-powers/receiving-code-review/SKILL.md          ← When receiving PR review feedback
```

**How to invoke a sub-skill:** When the workflow says "invoke the X sub-skill — read `X/SKILL.md`", use the Read tool to read that file path directly and follow its instructions. No skill-name tool call is needed.
