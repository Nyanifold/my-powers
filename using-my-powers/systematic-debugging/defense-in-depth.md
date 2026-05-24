# Defense-in-Depth Validation - 纵深防御校验

## 概述

修复由无效数据引发的 bug 时，在一处添加校验看起来已经足够。但单一检查可能被不同的代码路径、重构或 mock 所绕过。

**核心原则：** 在数据流经的每一层都添加校验，让 bug 在结构上无法出现。

## 为什么需要多层校验

单层校验：「我们修了这个 bug」
多层校验：「我们让这个 bug 不可能再出现」

各层捕获不同的问题：
- 入口校验捕获大多数 bug
- 业务逻辑校验捕获边界情况
- 环境守卫防止特定上下文下的危险操作
- 调试日志在其他层失效时提供线索

## 四个层次

### 第一层：入口校验
**目的：** 在 API 边界拒绝明显无效的输入

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
  if (!statSync(workingDirectory).isDirectory()) {
    throw new Error(`workingDirectory is not a directory: ${workingDirectory}`);
  }
  // ... 继续执行
}
```

### 第二层：业务逻辑校验
**目的：** 确保数据对当前操作有意义

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
  // ... 继续执行
}
```

### 第三层：环境守卫
**目的：** 防止在特定上下文中执行危险操作

```typescript
async function gitInit(directory: string) {
  // 测试环境下，拒绝在临时目录之外执行 git init
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));

    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
  // ... 继续执行
}
```

### 第四层：调试插桩
**目的：** 捕获上下文，供事后排查

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack,
  });
  // ... 继续执行
}
```

## 应用步骤

发现 bug 后：

1. **追踪数据流** — 无效值从哪里产生？在哪里被使用？
2. **梳理所有检查点** — 列出数据流经的每一处
3. **在每层添加校验** — 入口、业务逻辑、环境守卫、调试日志
4. **逐层测试** — 尝试绕过第一层，验证第二层是否能捕获

## 真实案例

Bug：空的 `projectDir` 导致 `git init` 在源码目录执行

**数据流：**
1. 测试初始化 → 空字符串
2. `Project.create(name, '')`
3. `WorkspaceManager.createWorkspace('')`
4. `git init` 在 `process.cwd()` 执行

**添加的四层防御：**
- 第一层：`Project.create()` 校验非空、目录存在且可写
- 第二层：`WorkspaceManager` 校验 projectDir 非空
- 第三层：`WorktreeManager` 在测试环境下拒绝在 tmpdir 外执行 git init
- 第四层：git init 前记录堆栈追踪

**结果：** 1847 个测试全部通过，bug 无法复现

## 关键认识

四层都是必要的。测试过程中，每一层都捕获了其他层遗漏的问题：
- 不同代码路径绕过了入口校验
- mock 绕过了业务逻辑校验
- 不同平台的边界情况需要环境守卫
- 调试日志识别了结构性误用

**不要止步于一个校验点。** 在每一层都添加校验。
