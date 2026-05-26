---
name: splitting-specs
description: "所有板块 spec 用户确认后使用。并行唤起子智能体，为每个板块按迭代计划拆分各阶段 spec 文件。"
---

# Splitting Specs — 迭代阶段 Spec 拆分

并行为每个板块生成各迭代阶段的 spec 文件：`spec-core.md`（Core 阶段范围说明）以及若干 `spec-update-N-<feature>.md`（各更新阶段增量说明）。原始 spec 保持不变。

**宣告：** 「我正在使用 my-powers:splitting-specs，共 <N> 个板块将并行处理」

## 执行流程

### 第 1 步：准备任务列表

读取 `docs/YYYY-MM-DD-modules.md`，提取所有叶子板块列表（排除标注为 leave it TODO 的板块）。

对每个板块，确认对应的原始 spec 文件存在：
`docs/specs/YYYY-MM-DD-<module>-spec.md`

读取每个 spec 的「迭代计划」章节，记录各板块的阶段结构：
- Core 阶段（必有）
- Update 1～N 阶段（0 个到多个）

### 第 2 步：并行派发子智能体

**并行冲突避免规则：**
- 每个子智能体只操作自己板块的文件，不读写其他板块的文件
- 生成的文件路径不同，不存在写冲突
- 子智能体之间无需通信，完全独立

**每个子智能体获得的精确上下文（由协调者显式打包，不让子智能体自行搜索）：**
- 原始 spec 文件的完整路径
- 板块说明文档中该板块的定义段落（职责、边界、接口）
- 该板块迭代计划的阶段列表（Core + 各 Update 名称）
- 输出文件的目标路径列表
- 本文件中「子智能体任务说明」章节的完整文本

**模型选择：**
- 拆分任务是判断性任务（需要理解 spec 的意图），使用标准模型
- 不使用低成本模型（容易错误分类功能）

### 第 3 步：并行派发检查子智能体

所有 splitter 子智能体完成后，对每个板块并行派发一个检查子智能体，使用 `spec-split-checker-prompt.md` 中的模板。

**每个检查子智能体获得的上下文（由协调者打包）：**
- 原始 spec 文件路径
- 该板块所有生成的阶段文件路径列表（spec-core + 所有 spec-update-N-*）
- 本文件「检查子智能体任务说明」章节的完整文本

检查结果：
- **PASS** → 该板块通过
- **FAIL** → 修复对应的 splitter 子智能体输出，重新派发该板块的检查子智能体，直到 PASS

### 第 4 步：汇总结果

所有板块的检查子智能体均通过后：
- 列出所有生成的文件
- 确认每个板块均已通过检查

汇总完成后：调用 `my-powers:writing-task-files`

---

## 子智能体任务说明

> 以下内容由协调者完整复制进子智能体的 prompt。

你的任务是为板块「<module-name>」生成各迭代阶段的差异文件，从原始 spec 中提取并区分各阶段的内容范围。

**输入文件：**
- 原始 spec：`docs/specs/YYYY-MM-DD-<module>-spec.md`

**该板块的迭代阶段：**
- Core：<最小可运行集名称>
- Update 1：<feature-name>（如有）
- Update N：<feature-name>（如有）

**输出文件：**
- `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
- `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md`（如有 Update 1）
- `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`（如有更多 Update）

**原始 spec 保持不变，不要修改它。**

### 生成 spec-core.md

描述 Core 阶段的实现范围。结构如下：

```markdown
# <板块名> Core Spec

> 本文件是 `docs/specs/YYYY-MM-DD-<module>-spec.md` 的 Core 阶段范围说明。
> 接口的完整定义以原始 spec 为准，本文件仅说明 Core 阶段实现哪些部分。

## Core 实现范围

<从原始 spec「迭代计划 → Core」章节提取，逐条列出>

## 接口行为说明（Core 阶段）

<只需列出与后续阶段有行为差异的接口，说明 Core 阶段下该接口的行为限制>
<如果 Core 阶段完整实现了某接口，无需在此重复>

示例：
- `POST /items`：Core 阶段仅支持同步创建，不支持批量创建
- `GET /items/{id}`：Core 阶段不返回 `related_items` 字段

## 暂不实现（留给后续更新阶段）

<从原始 spec「迭代计划 → Update N」各章节提取，逐条列出>
<这里是明确的排除列表，让实现者知道什么不需要做>
```

### 生成 spec-update-N-<feature>.md

为每个 Update 阶段生成一个文件，描述该阶段在前序阶段基础上增加的内容。结构如下：

```markdown
# <板块名> Update N：<feature-name> Spec

> 本文件描述「Update N：<feature-name>」阶段在前序阶段基础上的增量内容。
> 实现本阶段之前，前序所有阶段必须已完成。
> 接口完整定义以原始 spec 为准。

## 本阶段功能范围

<从原始 spec「迭代计划 → Update N：<feature-name>」章节提取，逐条列出>

## 行为变化（相对前序阶段）

<具体说明前序阶段的哪个行为会改变，或新增了什么行为>

## 接口变更（如有）

<新增字段、新增端点、参数变化等>

## 依赖条件

<是否依赖其他 Update 阶段先完成，或依赖其他板块的某一阶段>

## 暂不实现（留给后续更新阶段）

<如果本阶段之后还有更多 Update，在此列出本阶段不做的内容>
<如果本阶段是最后一个阶段，此节可省略>
```

### 完成后上报

写完所有文件后，在 git 中提交，然后上报状态：
`DONE: <module-name> — 已生成 spec-core.md 及 <N> 个 spec-update-*.md`

---

## Red Flags

**绝不：**
- 修改原始 spec 文件
- 在 spec-core 中重复完整的接口定义（引用即可）
- 在 spec-update 中写实现细节（只写行为变化）
- 让某个板块的子智能体读取其他板块的文件
- 遗漏原始 spec 迭代计划中的任何一个 Update 阶段
- 检查子智能体返回 FAIL 后未修复就进入 writing-task-files
