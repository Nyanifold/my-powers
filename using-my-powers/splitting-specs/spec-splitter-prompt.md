# Spec Splitter 子智能体 Prompt 模板

当为某个板块派发 spec 拆分子智能体时，使用此模板。

**用途：** 从原始 spec 的「迭代计划」章节提取各阶段内容范围，生成 spec-core.md 及若干 spec-update-N-<feature>.md 文件

**派发时机：** `splitting-specs` 第 2 步，每个叶子板块对应一个子智能体

```
Agent（general-purpose）:
  description: "为板块 [<module-name>] 拆分各迭代阶段 spec 文件"
  prompt: |
    你的任务是为板块「<module-name>」生成各迭代阶段的差异文件，
    从原始 spec 的「迭代计划」章节提取并区分各阶段的内容范围。

    **输入文件：**
    - 原始 spec：`docs/specs/YYYY-MM-DD-<module>-spec.md`

    **该板块在 modules.md 中的定义（由协调者提供，无需读取 modules.md）：**
    ```
    <协调者从 modules.md 中提取的该板块职责、边界、接口段落，粘贴在此>
    ```

    **该板块的迭代阶段（由协调者从 spec 中提取后提供）：**
    - Core：<最小可运行集名称>
    - Update 1：<feature-name>（如有）
    - Update N：<feature-name>（如有更多）

    **输出文件（原始 spec 保持不变，不要修改它）：**
    - `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
    - `docs/specs/YYYY-MM-DD-<module>-spec-update-1-<feature>.md`（如有 Update 1）
    - `docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`（如有更多 Update）

    ## 生成 spec-core.md

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

    ## 生成 spec-update-N-<feature>.md

    为每个 Update 阶段生成一个文件，描述该阶段在前序阶段基础上增加的内容。
    文件名：`docs/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`
    （N 为阶段序号，feature 为迭代计划中该阶段的名称，转为 kebab-case）

    每个文件的结构如下：

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

    <如果本阶段之后还有更多 Update，列出本阶段不做的内容>
    <如果本阶段是最后一个阶段，此节可省略>
    ```

    ## 完成后上报

    写完所有文件后，提交到 git，然后上报：
    `DONE: <module-name> — 已生成 spec-core.md 及 <N> 个 spec-update-*.md`

    ## Red Flags

    **绝不：**
    - 修改原始 spec 文件
    - 在 spec-core 中重复完整的接口定义（引用即可）
    - 在 spec-update 中写实现细节（只写行为变化）
    - 读取其他板块的文件
    - 遗漏原始 spec 迭代计划中的任何一个 Update 阶段
```

**子智能体返回：** DONE 状态 + 所有生成文件路径，或失败说明
