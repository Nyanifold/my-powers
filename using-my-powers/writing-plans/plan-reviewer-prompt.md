# Plan Reviewer 子智能体 Prompt 模板

当所有计划文档生成后，派发整体审查子智能体时，使用此模板。

**用途：** 对照 spec 和 tasks 逐一审查计划文档，确认覆盖完整、可实现

**派发时机：** `writing-plans` 第 3 步，所有 plan-writer 子智能体完成后，派发一个审查子智能体

**模型选择：** 最强模型

```
Agent（general-purpose）:
  description: "审查所有计划文档的完整性与 spec 对齐"
  prompt: |
    你是计划文档审查者。对照各板块的 spec 和 tasks 文件，逐一审查计划文档。

    **需要审查的计划文档列表（由协调者提供）：**
    ```
    <列出所有计划文件路径，例如：>
    - docs/plans/YYYY-MM-DD-<module-1>-task-1-plan.md（对应 spec: ..., tasks 阶段: Stage 1）
    - docs/plans/YYYY-MM-DD-<module-1>-task-2-plan.md（对应 spec: ..., tasks 阶段: Stage 2）
    - docs/plans/YYYY-MM-DD-<module-2>-task-1-plan.md（对应 spec: ..., tasks 阶段: Stage 1）
    ```

    ## 审查维度

    对每个计划文档，检查以下内容：

    | 维度 | 检查点 |
    |------|--------|
    | 覆盖完整性 | 是否覆盖了该阶段所有「预期成果（增量）」？ |
    | 测试充分性 | 测试说明是否覆盖了主要行为和边界情况？ |
    | 演示可行性 | 演示方案是否与 tasks 文件中的一致？能用一两条命令运行吗？ |
    | 可执行性 | 实现步骤是否足够具体，实现者可直接执行而不会卡住？ |
    | 范围边界 | 是否有超出该阶段 tasks 范围的内容（过度实现信号）？ |

    ## 校准原则

    **只标记会导致实现出现真实问题的缺陷。**
    缺少某个需求、步骤冲突、演示方案与 tasks 不一致——这些是问题。
    措辞偏好、细节不够详细但不影响实现、风格差异——不是问题。

    有严重缺陷时标记 Issues Found；否则 Approved。

    ## 上报格式

    ### 计划审查结果

    **整体状态：** Approved | Issues Found

    **逐文件结果：**

    #### `docs/plans/YYYY-MM-DD-<module>-task-<N>-plan.md`
    **状态：** Approved | Issues Found
    **问题（如有）：**
    - [章节 X]：[具体问题] - [为什么影响实现]
    **建议（不阻断通过）：**
    - [改进建议]

    （每个计划文档一节）
```

**审查者返回：** 整体状态 + 每个计划文档的逐项结果

**后续处理：**
- 发现问题 → 协调者通知对应的计划文档修改 → 重新派发审查子智能体对该文档重审
- 全部 Approved → 列出所有计划文件，请用户确认，调用 subagent-implementation 子技能 — 读取 `subagent-implementation/SKILL.md` 技能文件
