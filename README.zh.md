# my-powers

[English](README.md)

面向 AI 编码智能体的多模块软件开发方法论技能集。

my-powers 深受 Jesse Vincent 的 [superpowers](https://github.com/obra/superpowers) 启发。核心理念——将技能作为可组合的流程文档、由子智能体驱动的两阶段审查实现、TDD 作为强制性要求、完成声明前必须提供证据——均直接来源于该项目。my-powers 在此基础上进行了适配与扩展，专为以多模块系统设计为核心的工作流程而构建。

---

## 安装

将技能目录放置在智能体可访问的路径下即可完成安装：

```bash
# Claude Code 示例：
# 克隆或复制到技能目录
mkdir -p ~/.claude/skills/using-my-powers
cp -r using-my-powers ~/.claude/skills/using-my-powers
# 如需使用英文版本
cp -r using-my-powers-en ~/.claude/skills/using-my-powers
```

然后在 `AGENTS.md` / `CLAUDE.md` 中引用，或启动会话后执行：

```
/skill using-my-powers
```

---

## 工作原理

superpowers 的起点是"你想构建什么"，而 my-powers 则提前一步：**"系统应当如何拆解"**。在编写任何规格说明之前，先显式定义模块——包括边界、接口与依赖方向。后续每个阶段均基于此模块图展开。

结构明确之后，按模块编写规格说明，拆分为核心版与增强版，再细化为任务文件与详细计划。实现阶段按依赖顺序派发子智能体，每个子智能体获得精确构建的上下文。两阶段审查（规格符合性审查，继而代码质量审查）对每项任务进行把关，通过后方可标记完成。

质量保障技能——系统性调试、完成前验证——始终可用，并在实现流程中被明确引用。

---

## 适用范围

my-powers 的核心价值在于**更细粒度的流程划分**与**更丰富的中间状态产出**：将从需求到实现的完整过程拆解为可独立确认的阶段，每个阶段产出结构化制品——规格说明、任务文件、计划文档、演示与实现报告。这些制品不仅是下一阶段的输入，也为用户提供了在任意时间点观察、评估与学习实现内容的窗口。本 skill 的工作流程为线性结构，且须经人工审核——每个阶段产出的制品需经人工确认后方可进入下一阶段。检查点的存在，是为了使纠偏发生在设计层面，而非在大量代码已经写成之后。

**超出本工具范围的工作：**

- 不监控运行中的系统，不响应生产环境信号。
- 不自动调优性能、延迟或资源占用。
- 不管理持续的维护周期或迭代式特性交付。

初始实现上线后，后续迭代由人工驱动：使用系统、判断需要调整之处，再从适当的阶段重新进入工作流——重写规格说明、修订任务文件、新增模块。本方法论支持上述循环，但不对其进行自动化处理。

对于需要系统性调优的工作——如机器学习模型训练、GPU 核函数优化、超参数搜索——推荐模式是先借助 my-powers 构建结构正确、架构清晰的原型，再交由专用调优技能执行迭代优化。my-powers 负责确保架构的正确性；调优技能负责驱动性能优化迭代。

---

## 工作流程

```
module-brainstorming（模块头脑风暴）
   讨论系统拆解方案，定义模块边界、接口与依赖方向。
   产出 docs/YYYY-MM-DD-modules.md。
   ↓ 用户确认
writing-module-specs（编写模块规格说明）
   针对每个叶子模块：头脑风暴需求，产出包含渐进式实现章节
   （核心版 vs. 增强版）的完整规格说明。
   ↓ 用户确认所有规格说明
splitting-specs（拆分规格说明）
   并行子智能体将每份规格说明拆分为 -spec-core.md 与
   -spec-enhanced.md 差异文件，原始规格说明保持不变。
   ↓
writing-task-files（编写任务文件）
   针对每个模块：将规格说明特性映射至可独立演示的阶段。
   定义可交付成果、依赖关系与演示方案。
   ↓ 用户确认所有任务文件
writing-plans（编写计划）
   并行子智能体为每个任务阶段生成详细计划文档，
   包含逐步说明、测试伪代码与演示环境配置。
   ↓ 用户确认所有计划
subagent-implementation（子智能体实现）
   按依赖顺序派发实现子智能体。每项任务通过两阶段审查后
   写入报告并标记完成。所有任务完成后执行全局审查。
   ↓
finishing-a-module（完成模块）
   验证测试与演示。提供合并 / PR / 保留 / 丢弃选项。
   执行工作树清理。
```

质量保障技能独立存在，可在任意时刻触发：

```
systematic-debugging（系统性调试）          ← 任何缺陷、测试失败或意外行为
verification-before-completion（完成前验证） ← 在任何完成声明或提交操作之前
```

### 上下文长度管理

大型项目在推进过程中可能积累大量上下文，导致对话窗口接近上限。建议在以下两个自然断点新开对话：

- **完成所有规格说明、进入 `splitting-specs` 前**：此时 spec 已经过充分讨论，后续阶段只需读取文档，无需依赖对话历史。
- **完成所有计划、进入 `subagent-implementation` 前**：计划文档已完备，实现阶段以文档为输入驱动，与对话历史解耦。

新开对话时，将以下文件一并提供给新会话：原始需求文档，以及 `docs/` 目录下截至当前阶段已产出的所有文档。

---

## 与 superpowers 的关系

### 关注点

superpowers 专注于单个特性或任务内的开发循环：正确编写代码、系统性调试、严格审查、干净收尾。其前提是开发者已明确所要构建的内容及其归属模块。

my-powers 是在实际使用 superpowers 过程中形成的渐进改进。它将循环向上游延伸，增加了显式的系统拆解阶段——定义模块边界、接口与依赖方向——使后续每一步均建立在结构清晰的基础之上。实现阶段直接沿用了 superpowers 的核心模式：子智能体隔离、两阶段审查、TDD 纪律、完成声明前须提供证据。

为辅助用户在整个构建过程中保持清晰的全局视野，另引入了两项补充机制：每个任务阶段须提供可运行的演示，使特性行为在每一步均可观测；每项完成的任务产出结构化实现报告，使用户可在任意时间点了解已构建的内容及其设计决策。

### 阶段映射

my-powers 中的每个阶段在 superpowers 中均有直接前身或近似对应。

| my-powers 阶段 | superpowers 来源 | 说明 |
|---|---|---|
| `module-brainstorming` | `brainstorming` | 从单特性设计扩展至全系统模块拆解，增加结构化边界与接口定义 |
| `writing-module-specs` | `brainstorming` + `writing-plans` | 融合 `brainstorming` 的设计对话与 `writing-plans` 的规格产出；增加渐进式实现章节 |
| `splitting-specs` | — | 原创阶段。产出核心/增强差异变体，驱动版本化实现 |
| `writing-task-files` | `writing-plans` | 规格与计划之间的中间阶段；确保每个实现阶段可独立演示 |
| `writing-plans` | `writing-plans` | 直接改编。并行子智能体派发，同等强调步骤层面的具体性 |
| `subagent-implementation` | `subagent-driven-development` | 直接改编。保留两阶段审查（规格符合性，继而代码质量）；新增依赖排序、四种状态码及逐任务实现报告 |
| `finishing-a-module` | `finishing-a-development-branch` | 直接移植。增加工作树所有权检查与 `discard` 确认门控 |
| `systematic-debugging` | `systematic-debugging` | 直接移植并适配中文。新增在 `docs/reports/` 中以当前阶段文件名前缀记录缺陷修复记录的要求 |
| `verification-before-completion` | `verification-before-completion` | 直接移植并适配中文 |
| `receiving-code-review` | `receiving-code-review` | 直接移植并适配中文。去除个性化语言；保留技术验证流程与回推指导 |

superpowers `test-driven-development` 技能中的 TDD 纪律被直接内嵌至 `subagent-implementation`，而非作为独立技能保留。实现子智能体将收到明确的 TDD 红色警告与同一条铁律：未见失败测试，不写生产代码。

---

## 文档约定

所有中间文件采用 `YYYY-MM-DD-` 日期前缀。`docs/` 目录由 my-powers 技能自动管理——请勿手动编辑其中的文件。

```
docs/
├── YYYY-MM-DD-modules.md                        # module-brainstorming
├── specs/
│   ├── YYYY-MM-DD-<module>-spec.md              # writing-module-specs
│   ├── YYYY-MM-DD-<module>-spec-core.md         # splitting-specs
│   └── YYYY-MM-DD-<module>-spec-enhanced.md     # splitting-specs
├── tasks/
│   └── YYYY-MM-DD-<module>-tasks.md             # writing-task-files
├── plans/
│   └── YYYY-MM-DD-<module>-task-N-plan.md       # writing-plans
└── reports/
    ├── YYYY-MM-DD-<module>-task-N-report.md     # subagent-implementation
    └── YYYY-MM-DD-<module>-task-N-bugfix[-M].md # systematic-debugging
```

演示文件位于 `demo/<module>/stage-N/`。

---

## 仓库结构

```
my-powers/
├── README.md
├── README.cn.md
├── LICENSE
├── docs/                              # 由技能在运行时生成
├── using-my-powers/                   # 中文变体
│   ├── SKILL.md                       # 入口
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
└── using-my-powers-en/                # 英文变体（结构相同）
    ├── module-brainstorming/
    ├── writing-module-specs/
    └── ...
```

---

## 技能列表

**主工作流**
- `module-brainstorming` — 系统拆解与边界定义
- `writing-module-specs` — 包含渐进式实现章节的模块规格说明
- `splitting-specs` — 并行核心/增强规格拆分
- `writing-task-files` — 附演示方案的逐阶段任务定义
- `writing-plans` — 并行详细实现计划
- `subagent-implementation` — 带审查机制的依赖序子智能体执行
- `finishing-a-module` — 验证、合并/PR 选项与工作树清理

**质量保障**
- `systematic-debugging` — 任何修复尝试前须经历的四阶段根因排查流程
- `verification-before-completion` — 始终要求证据，不接受未经验证的完成声明
- `receiving-code-review` — 对审查反馈进行技术评估；验证后再实施，有误时予以回推

---

## 反馈

如果在使用过程中遇到非预期的行为，欢迎在 [Discussion 区](https://github.com/Nyanifold/my-powers/discussions) 进行讨论。

---

## 许可证

[MIT](LICENSE)。

---

## 致谢

本项目构建于 Jesse Vincent 的 [superpowers](https://github.com/obra/superpowers) 之上。系统性调试、完成前验证与子智能体驱动开发技能均改编自该项目。铁律、合理化陷阱对照表与两阶段审查模式均源自该项目。