---
name: finishing-a-module
description: "所有任务阶段实现完成、全局审查通过后使用。验证测试与演示，呈现收尾选项，处理 worktree 清理。"
---

# Finishing a Module — 收尾

验证实现成果，呈现结构化的收尾选项，执行用户选择，清理工作区。

**宣告：** 「我正在使用 my-powers:finishing-a-module」

**核心原则：** 验证测试 → 检测环境 → 呈现选项 → 执行 → 清理

## 第 1 步：验证测试

运行完整测试套件：

```bash
# 根据项目类型选择命令
npm test / cargo test / pytest / go test ./...
```

**如果测试失败：**
```
测试未通过（<N> 个失败）。必须修复后才能继续收尾：

[显示失败列表]

无法在测试失败的情况下合并或创建 PR。
```

停止，不进入第 2 步。

**如果测试通过：** 继续。

## 第 2 步：验证演示

运行每个已实现阶段的演示，确认可以正常运行：

```bash
# 对每个阶段的演示
cd demo/<module>/stage-N/
<运行命令>
```

**如果演示失败：** 修复后再继续。

**验证先于声明：** 没有实际运行验证命令，不得宣称测试通过或演示可用。

## 第 3 步：检测 git 环境

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

| 状态 | 菜单 | 清理方式 |
|------|------|----------|
| `GIT_DIR == GIT_COMMON`（普通仓库） | 标准 4 选项 | 无 worktree 需清理 |
| `GIT_DIR != GIT_COMMON`，命名分支 | 标准 4 选项 | 基于归属判断（见第 6 步） |
| `GIT_DIR != GIT_COMMON`，detached HEAD | 简化 3 选项（无合并） | 不清理（外部管理） |

## 第 4 步：确定基础分支

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

如果无法确定，询问：「当前分支从 main 分叉，是否正确？」

## 第 5 步：呈现选项

**普通仓库和命名分支 worktree（标准 4 选项）：**

```
实现完成，测试与演示均已验证。接下来如何处理？

1. 合并回 <base-branch>（本地）
2. 推送并创建 Pull Request
3. 保留当前分支（稍后手动处理）
4. 丢弃本次实现

请选择（1-4）：
```

**Detached HEAD（简化 3 选项）：**

```
实现完成，测试与演示均已验证。当前处于 detached HEAD（外部管理的工作区）。

1. 推送为新分支并创建 Pull Request
2. 保留当前状态（稍后手动处理）
3. 丢弃本次实现

请选择（1-3）：
```

**不添加额外说明**，保持选项简洁。

## 第 6 步：执行选择

### 选项 1：本地合并

```bash
# 切换到主仓库根目录
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"

# 先合并，确认成功后再清理
git checkout <base-branch>
git pull
git merge <feature-branch>

# 验证合并后的测试
<test command>
```

合并成功且测试通过后：
- 执行第 7 步清理 worktree
- 删除功能分支：`git branch -d <feature-branch>`

### 选项 2：推送并创建 PR

```bash
git push -u origin <feature-branch>

gh pr create --title "<title>" --body "$(cat <<'EOF'
## 变更摘要
<列出主要变更>

## 实现报告
<列出所有报告文件路径>

## 验证
- [ ] 所有测试通过
- [ ] 所有演示可运行
EOF
)"
```

**不清理 worktree**（用户还需要在上面迭代 PR 反馈）。

### 选项 3：保留分支

报告：「保留分支 <name>，worktree 保留在 <path>。」

**不清理 worktree。**

### 选项 4：丢弃

**必须打字确认，防止误操作：**

```
将永久删除以下内容：
- 分支：<name>
- 提交列表：<commit list>
- Worktree 路径：<path>（如适用）

输入 'discard' 确认，其他任何输入取消：
```

等待用户输入。只有精确输入 `discard` 才继续：

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
```

执行第 7 步清理 worktree，然后：
```bash
git branch -D <feature-branch>
```

## 第 7 步：清理 Worktree（仅选项 1 和 4）

**归属判断：只清理 my-powers 创建的 worktree。**

```bash
WORKTREE_PATH=$(git rev-parse --show-toplevel)
```

**如果 `GIT_DIR == GIT_COMMON`：** 普通仓库，无 worktree 需清理，跳过。

**如果 worktree 路径在以下目录下，说明是 my-powers 创建的，执行清理：**
- `.worktrees/`
- `worktrees/`

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"  # 必须先离开 worktree 目录再执行 remove
git worktree remove "$WORKTREE_PATH"
git worktree prune  # 清理悬空注册
```

**如果 worktree 路径不在上述目录下：** 该 worktree 由外部 harness 管理，不清理。如果平台提供了退出 worktree 的工具，使用该工具；否则保留不动。

## 快速参考

| 选项 | 合并 | 推送 | 保留 Worktree | 删除分支 |
|------|------|------|---------------|----------|
| 1. 本地合并 | ✓ | - | - | ✓ |
| 2. 创建 PR | - | ✓ | ✓ | - |
| 3. 保留 | - | - | ✓ | - |
| 4. 丢弃 | - | - | - | ✓（强制） |

## Red Flags

**绝不：**
- 在测试失败时推进合并或 PR
- 在未运行验证命令的情况下宣称测试通过
- 合并前没有验证合并结果的测试
- 选项 2 时清理 worktree（用户还需要迭代 PR）
- 删除 my-powers 未创建的 worktree（归属检查）
- 丢弃操作不等待打字确认
- 在 worktree 内部执行 `git worktree remove`（先 cd 到主仓库根目录）
- 在 remove worktree 之前删除分支（顺序：合并 → remove worktree → delete branch）
