# Plan Writer 子智能体 Prompt 模板

当为某个板块的某个任务阶段派发计划编写子智能体时，使用此模板。

**用途：** 为指定的板块 + 阶段生成完整的计划文档

**派发时机：** `writing-plans` 第 2 步，每个（板块, 阶段）对应一个子智能体，所有子智能体并行执行

```
Agent（general-purpose）:
  description: "为 [<module-name>] Stage [N] 编写计划文档"
  prompt: |
    你的任务是为板块「<module-name>」的 Stage <N>（<阶段名称>）编写计划文档。

    **输入文件路径（读取这些文件获取详情）：**
    - 原始 spec：`docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md`
    - Core 阶段范围：`docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-core.md`（若本阶段属于 Core 范围）
    - Update 阶段范围：`docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec-update-N-<feature>.md`（若本阶段属于某 Update 阶段）

    **该板块的参考资料（来自 modules.md，如有）：**
    - `<路径>` — <说明>
    （若无，此项留空）

    > 参考资料是实现时需要对照的现有文件（如现有代码、接口定义、配置文件、文档等）。编写计划时，应读取这些文件，理解现有结构后再设计实现步骤。

    **以下是该阶段的任务说明（摘自 tasks 文件，协调者已提取，不需要自行读取文件）：**
    ```
    <协调者从 tasks 文件中提取的该阶段完整文本，粘贴在此>
    ```

    **输出文件：** `docs/my-powers-output/plans/YYYY-MM-DD-<module>-task-<N>-plan.md`

    ## 计划文档结构

    ```markdown
    # <板块名> Stage <N>：<阶段名称> 计划

    > 生成日期：YYYY-MM-DD
    > 对应 spec：docs/my-powers-output/specs/YYYY-MM-DD-<module>-spec.md
    > 对应 tasks 阶段：Stage <N>

    ## 目标与范围

    <一句话说明本阶段目标>

    对应 spec 范围：<spec-core 还是 spec-update-N-<feature>，哪些功能>

    ## 文件结构

    | 操作 | 文件路径 | 职责说明 |
    |------|----------|----------|
    | 新增 | `src/...` | <职责> |
    | 修改 | `src/...` | <改动内容> |
    | 新增 | `demo/<module>/stage-<N>/...` | 演示文件 |

    ## 实现步骤

    ### Step 1：<名称>

    <做什么，关键设计决策>

    关键代码结构（伪代码，说明设计意图）：
    ```
    <pseudocode>
    ```

    ### Step 2：<名称>

    （同上格式）

    ## 测试说明

    > 实现时需要编写对应的测试。以下说明测试意图与伪代码思路，不要求完整代码。

    ### 测试点 1：<名称>

    **测试意图：** 验证 <具体行为>

    **前置条件：** <系统状态 / 输入数据>

    **伪代码思路：**
    ```
    given <状态>
    when <操作>
    then <预期结果>
    ```

    ### 测试点 2：<名称>

    （同上格式，覆盖边界情况和错误路径）

    ## 演示说明

    **演示文件位置：** `demo/<module>/stage-<N>/`

    **最小上下文搭建：**
    <如何初始化样例数据、数据库、环境变量，用具体命令说明>

    ```bash
    # 初始化上下文
    <commands>
    ```

    **Mock 接口说明：**
    <Mock 哪些外部板块的接口，Mock 返回什么，Mock 文件放在哪>

    **运行演示：**
    ```bash
    <具体运行命令>
    ```

    **预期输出：**
    ```
    <expected output>
    ```

    ## 审查要点

    > 实现完成后，审查子智能体对照以下清单进行验证。

    - [ ] 所有「预期成果（增量）」中的新增项均已实现
    - [ ] 所有「预期成果（增量）」中的改变项均已完成
    - [ ] 测试说明中的每个测试点均有对应测试，且测试能通过
    - [ ] 演示文件存在且能按「运行演示」中的命令正确运行
    - [ ] Mock 接口与 tasks 文件中声明的 Mock 行为一致
    - [ ] 没有引入 tasks 文件范围之外的功能（不过度实现）
    - [ ] 实现报告已写入 `docs/my-powers-output/reports/YYYY-MM-DD-<module>-task-<N>-report.md`
    ```

    ## 完成后上报

    写完文件并提交 git 后上报：
    `DONE: <module-name> Stage <N> — 计划文档已生成`

    ## Red Flags

    **绝不：**
    - 在计划文档中写完整的实现代码（只写伪代码和设计意图）
    - 自行读取 tasks 文件（协调者已提取内容并传入）
    - 读取其他板块的文件
    - 跳过演示说明章节
    - 测试说明只写"测试 X 功能"而不写具体行为和边界情况
```

**子智能体返回：** `DONE: <module-name> Stage <N> — 计划文档已生成`，或失败说明
