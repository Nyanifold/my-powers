---
name: writing-task-files
description: "splitting-specs 完成后使用。串行为每个板块编写任务文件，定义实现阶段、成果、依赖与演示方案。"
---

# Writing Task Files — 任务文件编写

为每个叶子板块编写任务文件，将 spec 中的功能映射为可独立演示的实现阶段。所有任务文件完成后交用户审阅，确认后进入 writing-plans。

**宣告：** 「我正在使用 my-powers:writing-task-files，当前板块：<name>」

<HARD-GATE>
用户未确认所有任务文件之前，不得调用 writing-plans。每个阶段必须有可运行的演示方案。
</HARD-GATE>

## 第 0 步：确认当前目标阶段范围

**在读取任何 spec 或划分任何阶段之前，先确认本次要实现哪些迭代阶段。**

### ① 用户是否显式声明了目标阶段？

- 若用户明确说"实现 Core"、"做 Update 1"、"实现全部"等 → 按用户声明执行
- 若未声明 → 继续执行 ②

### ② 推断已完成的阶段

```bash
# 查看已打的 tag
git tag | sort
```

读取每个板块的原始 spec，从「迭代计划」章节获取阶段列表。对照 tag 逐一判断：

| 阶段 | 对应 tag | 已完成？ |
|------|----------|----------|
| Core | `v-core` | tag 存在则已完成 |
| Update 1：<feature> | `v-update-1-<feature>` | tag 存在则已完成 |
| Update N：<feature> | `v-update-N-<feature>` | tag 存在则已完成 |

### ③ 确定本次目标

**若 Core 未完成：**
默认目标为 Core。宣告：
> 「本次将编写 **Core 阶段**任务文件，仅覆盖 spec-core 范围。」

**若 Core 已完成，存在未完成的 Update 阶段：**
列出所有未完成的 Update 阶段，询问用户：

```
检测到 Core 阶段已完成（tag: v-core）。
以下更新阶段尚未实现：

1. Update 1：<feature-name> — <一句话说明>
2. Update 2：<feature-name> — <一句话说明>
...

本次实现哪些？（示例："全部"、"1"、"1 和 2"）
```

等待用户明确回答，不得跳过。

根据用户选择，检查依赖关系（来自各 spec-update 文件的「依赖条件」字段）：
- 若所选阶段依赖某个未选的 Update 阶段 → 提示依赖关系，请用户确认

依赖确认后宣告：
> 「本次将编写 **<目标阶段列表>** 的任务文件。」

**若所有阶段均已完成：**
告知用户，不生成任务文件。

## 执行流程

1. 执行第 0 步，确认目标阶段范围
2. 读取 `docs/YYYY-MM-DD-modules.md`，获取叶子板块列表（排除 TODO 板块）
3. 按依赖顺序排列（被依赖的板块先做）
4. 串行为每个板块执行「单板块任务划分流程」
5. 所有任务文件完成后，列出文件清单，请用户审阅
6. 用户确认后，调用 writing-plans 子技能 — 读取 `writing-plans/SKILL.md` 技能文件

## 单板块任务划分流程

### 读取输入文件

- `docs/specs/YYYY-MM-DD-<module>-spec.md`（原始 spec）
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md`（Core 阶段范围）
- `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md`（Update 1，如在本次目标内）
- `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`（其余 Update，如在本次目标内）

### 划分阶段

**阶段划分原则：**
- 每个阶段对应一批**可以独立演示**的功能
- Core 功能构成前几个阶段（按功能自然分组，一个 spec-core 可拆为多个 Stage）
- 每个 Update 阶段通常对应一个或若干个 Stage
- 阶段之间的依赖关系要显式声明
- 一个阶段的工作量：建议对应数小时到一天的实现量（不要过细，也不要过粗）

**划分范围与本次目标阶段严格对齐：**
- 本次目标为 **Core** → 只对 spec-core 中的功能划分阶段
- 本次目标为 **部分 Update 阶段** → 只对确认的目标 Update 阶段划分阶段
- 本次目标为 **全部** → 对 Core 和所有未完成 Update 阶段一并划分

不在本次目标范围内的功能，不划阶段、不写演示、不写计划。任务文件只反映本次要做的事。

**成果描述原则（增量式）：**
- 新增：哪些新功能、新文件、新接口出现
- 删除：哪些临时代码、Mock、桩代码被移除
- 改变：哪些已有行为发生变化

**演示方案要求：**
- 演示文件统一放在 `demo/<module>/stage-N/` 下
- 演示方式选一种：命令行参数 / 输入文件 / 交互式 CLI
- 明确说明所需上下文（样例数据、数据库初始状态、环境变量）
- 明确说明哪些依赖板块用 Mock，Mock 的行为是什么
- 演示应该能用一两条命令运行，不需要复杂的前置操作

### 写任务文件

文件路径：`docs/tasks/YYYY-MM-DD-<module>-tasks.md`

```markdown
# <板块名> 任务文件

> 生成日期：YYYY-MM-DD
> 对应 spec：docs/specs/YYYY-MM-DD-<module>-spec.md

## 阶段概览

| 阶段 | 名称 | 对应范围 | 预计工作量 |
|------|------|----------|------------|
| Stage 1 | <名称> | Core：<功能列表> | <估计> |
| Stage 2 | <名称> | Core：<功能列表> | <估计> |
| Stage 3 | <名称> | Update 1 (<feature-name>)：<功能列表> | <估计> |
| Stage N | <名称> | Update M (<feature-name>)：<功能列表> | <估计> |

## 阶段依赖关系

<文字描述或 ASCII 图，说明哪些阶段必须先于哪些阶段完成>
<跨板块依赖也在此说明>

示例：
Stage 1 → Stage 2 → Stage 3
Stage 1 依赖 <other-module> Stage 2 完成

## 阶段详情

### Stage 1：<名称>

**目标：** <一句话>

**对应 spec 范围：**
- spec-core 中的：<功能列表>

**预期成果（增量）：**

新增：
- <新增的功能/文件/接口>

删除：
- <暂无 / 或具体内容>

改变：
- <暂无 / 或具体内容>

**阶段依赖：**
- 本板块前置阶段：无（或 Stage N）
- 依赖其他板块：<板块名> Stage M（或无）

**演示方案：**

演示文件位置：`demo/<module>/stage-1/`

演示方式：<命令行参数 / 输入文件 / 交互式 CLI>

所需上下文：
- <样例数据文件说明>
- <数据库初始状态，如有>
- <环境变量，如有>

Mock 的外部依赖：
- `<板块名>`：Mock 为 <Mock 行为说明>（或：无外部依赖）

运行示例：
\`\`\`bash
# 示例命令
<command>
\`\`\`

预期输出：
\`\`\`
<expected output>
\`\`\`

---

### Stage 2：<名称>

（同上格式）

---

### Stage N（Update M：<feature-name>）：<名称>

（同上格式，在「对应 spec 范围」处标注来自 spec-update-M-<feature>）
```

### 派发审查子智能体

自检通过后，使用 `task-file-reviewer-prompt.md` 中的模板派发审查子智能体（标准模型），提供：
- 任务文件路径
- 对应 spec 文件路径（原始 spec、spec-core、本次涉及的 spec-update-N-* 文件）
- 本次目标阶段列表（来自第 0 步的确认结果）

审查结果：
- Approved → 提交文件到 git，继续下一个板块
- Issues Found → 修改任务文件 → 重新派发同一审查子智能体重审（不跳过重审）

## 所有板块完成后

```
所有板块的任务文件已生成完毕：

- docs/tasks/YYYY-MM-DD-<module-1>-tasks.md
- docs/tasks/YYYY-MM-DD-<module-2>-tasks.md
- ...

请审阅每个任务文件，重点关注：
- 阶段划分是否合理？
- 演示方案是否可行？
- 跨板块依赖是否正确？

所有任务文件确认后，我将并行启动计划文档的编写。
```

等待用户确认。有修改时：修改对应文件 → 重新请用户确认 → 继续等待其余文件确认。

全部确认后：调用 writing-plans 子技能 — 读取 `writing-plans/SKILL.md` 技能文件

## Red Flags

**绝不：**
- 没有演示方案的阶段
- 演示需要复杂手动操作的方案
- 遗漏 spec-core 中的功能
- 跨板块依赖不明确
- 阶段粒度过细（每小时一个阶段）或过粗（整个板块一个阶段）
- 审查子智能体未通过就提交任务文件
- 审查发现问题后不重审直接提交
- 将不在本次目标阶段范围内的功能混入任务文件
