---
name: using-my-powers
description: "Entry point for my-powers: a multi-module AI-assisted development methodology. Read this to understand the full workflow and navigate to the relevant sub-skills based on where you are in the process."
---

# My-Powers — 系统级开发方法论

My-Powers 是一套面向多模块系统的 AI 辅助开发方法论。它将系统开发拆解为：模块划分 → 规格设计 → 任务规划 → 子智能体实现 → 收尾，每个阶段都有明确的人机协作检查点。

**宣告：** 每当进入一个新技能时，宣告「我正在使用 my-powers:<skill-name>」。

## 适用场景

- 新系统从零开始构建
- 为现有系统增加需要多个模块协作的大型功能
- 任何需要在动手前先做模块边界设计的工作

## 完整流程

```
module-brainstorming        ← 与用户讨论系统分解，定义板块边界与接口
         ↓ 用户确认板块说明文档
writing-module-specs        ← 串行对每个叶子板块做头脑风暴，编写 spec
         ↓ 用户确认所有 spec
splitting-specs             ← 子智能体并行为每个板块拆分各迭代阶段 spec（spec-core + spec-update-N-*）
         ↓
writing-task-files          ← 串行为每个板块编写任务文件（阶段、成果、演示）
         ↓ 用户确认所有任务文件
writing-plans               ← 子智能体并行为每个任务生成计划文档
         ↓ 用户确认所有计划
subagent-implementation     ← 子智能体驱动实现，按依赖顺序调度
         ↓
finishing-a-module          ← 验证、收尾、合并或 PR
```

## 文档约定

所有中间文件均带日期前缀 `YYYY-MM-DD-`。

```
docs/
├── YYYY-MM-DD-modules.md                             # 板块说明文档
├── specs/
│   ├── YYYY-MM-DD-<module>-spec.md                       # 原始 spec（主智能体）
│   ├── YYYY-MM-DD-<module>-spec-core.md                  # Core 阶段范围（子智能体）
│   ├── YYYY-MM-DD-<module>-spec-update-1-<feature>.md    # Update 1 增量（子智能体）
│   └── YYYY-MM-DD-<module>-spec-update-N-<feature>.md    # Update N 增量（子智能体）
├── tasks/
│   └── YYYY-MM-DD-<module>-tasks.md                 # 任务文件（主智能体）
├── plans/
│   └── YYYY-MM-DD-<module>-task-N-plan.md           # 计划文档（子智能体）
└── reports/
    ├── YYYY-MM-DD-<module>-task-N-report.md         # 实现报告（子智能体）
    └── YYYY-MM-DD-<module>-task-N-bugfix[-M].md     # bug 修复记录（调试时额外生成）
```

演示文件统一放在 `demo/<module>/stage-N/` 下。

## 核心原则

- **板块边界优先**：先把边界定清楚，板块内部变化不影响其他板块
- **渐进式实现**：每个板块的迭代计划从 Core（最小可运行集）出发，按需叠加 Update 阶段，各阶段不破坏已有接口
- **子智能体隔离**：每个子智能体只获得完成自身任务所需的精确上下文，不继承会话历史
- **验证先于声明**：没有运行过验证命令，不得宣称任何阶段完成
- **连续执行**：实现阶段除非遇到无法解决的 BLOCKED，不中途询问用户是否继续

## 按需选用，无需走全流程

**不是每次都要从头到尾走完整流程。** 根据用户需求，直接跳到对应阶段读取子技能：

- 用户只想头脑风暴模块划分 → 只用 `module-brainstorming`
- 用户已有模块定义，需要写 spec → 直接从 `writing-module-specs` 开始
- 用户已有 spec，需要拆分 → 直接用 `splitting-specs`
- 用户已有任务文件，需要规划 → 直接用 `writing-plans`
- 用户已有计划，需要实现 → 直接用 `subagent-implementation`
- 遇到 bug → 直接用 `systematic-debugging`
- 声称完成之前 → 直接用 `verification-before-completion`
- 收到代码审查 → 直接用 `receiving-code-review`

## 各技能位置

所有子技能均位于本文件所在目录（`using-my-powers/`）下：

```
using-my-powers/SKILL.md                        ← 入口（本文件）
using-my-powers/module-brainstorming/SKILL.md
using-my-powers/writing-module-specs/SKILL.md
using-my-powers/splitting-specs/SKILL.md
using-my-powers/writing-task-files/SKILL.md
using-my-powers/writing-plans/SKILL.md
using-my-powers/subagent-implementation/SKILL.md
using-my-powers/finishing-a-module/SKILL.md

# 质量保证（随时可独立触发）
using-my-powers/systematic-debugging/SKILL.md           ← 遇到 bug 或非预期行为时
using-my-powers/verification-before-completion/SKILL.md ← 声称完成之前
using-my-powers/receiving-code-review/SKILL.md          ← 收到 PR 审查反馈时
```
