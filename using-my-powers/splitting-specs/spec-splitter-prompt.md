# Spec Splitter 子智能体 Prompt 模板

当为某个板块派发 spec 拆分子智能体时，使用此模板。

**用途：** 从原始 spec 提取基础版与增强版的内容范围，生成两个差异文件

**派发时机：** `splitting-specs` 第 2 步，每个叶子板块对应一个子智能体

```
Agent（general-purpose）:
  description: "为板块 [<module-name>] 拆分 spec-core 与 spec-enhanced"
  prompt: |
    你的任务是为板块「<module-name>」生成两个差异文件，
    从原始 spec 中提取并区分基础版和增强版的内容范围。

    **输入文件：**
    - 原始 spec：`docs/specs/YYYY-MM-DD-<module>-spec.md`

    **该板块在 modules.md 中的定义（由协调者提供，无需读取 modules.md）：**
    ```
    <协调者从 modules.md 中提取的该板块职责、边界、接口段落，粘贴在此>
    ```

    **输出文件（原始 spec 保持不变，不要修改它）：**
    - `docs/specs/YYYY-MM-DD-<module>-spec-core.md`
    - `docs/specs/YYYY-MM-DD-<module>-spec-enhanced.md`

    ## 生成 spec-core.md

    描述基础版的实现范围。结构如下：

    ```markdown
    # <板块名> 基础版 Spec

    > 本文件是 `docs/specs/YYYY-MM-DD-<module>-spec.md` 的基础版范围说明。
    > 接口的完整定义以原始 spec 为准，本文件仅说明基础版实现哪些部分。

    ## 基础版实现范围

    <从原始 spec「渐进式实现 → 基础功能」章节提取，逐条列出>

    ## 接口行为说明（基础版）

    <只需列出与增强版有行为差异的接口，说明基础版下该接口的行为限制>
    <如果基础版完整实现了某接口，无需在此重复>

    示例：
    - `POST /items`：基础版仅支持同步创建，不支持批量创建
    - `GET /items/{id}`：基础版不返回 `related_items` 字段

    ## 暂不实现（留给增强版）

    <从原始 spec「渐进式实现 → 增强功能」章节提取，逐条列出>
    <这里是明确的排除列表，让实现者知道什么不需要做>
    ```

    ## 生成 spec-enhanced.md

    描述增强版在基础版之上增加的内容。结构如下：

    ```markdown
    # <板块名> 增强版 Spec

    > 本文件描述在基础版之上的增量内容。
    > 实现增强版之前，基础版必须已完成。
    > 接口完整定义以原始 spec 为准。

    ## 增强功能列表

    ### 增强功能 1：<名称>

    **触发条件：** <什么情况下需要实现这个功能>

    **行为变化（相对基础版）：**
    <具体说明基础版的哪个行为会改变，或新增了什么行为>

    **接口变更（如有）：**
    <新增字段、新增端点、参数变化等>

    **依赖条件：**
    <是否依赖其他增强功能先完成，或依赖其他板块的增强版>

    ---

    ### 增强功能 2：<名称>

    （同上格式）
    ```

    ## 完成后上报

    写完两个文件后，提交到 git，然后上报：
    `DONE: <module-name> — 已生成 spec-core.md 和 spec-enhanced.md`

    ## Red Flags

    **绝不：**
    - 修改原始 spec 文件
    - 在 spec-core 中重复完整的接口定义（引用即可）
    - 在 spec-enhanced 中写实现细节（只写行为变化）
    - 读取其他板块的文件
```

**子智能体返回：** DONE 状态 + 两个文件路径，或失败说明
