// 条件等待工具函数完整实现
// 来源：Lace 测试基础设施改进（2025-10-03）
// 背景：将任意时间延迟替换为条件等待，修复了 15 个不稳定测试

import type { ThreadManager } from '~/threads/thread-manager';
import type { LaceEvent, LaceEventType } from '~/threads/types';

/**
 * 等待 thread 中出现指定类型的事件
 *
 * @param threadManager - 用于查询的 thread manager
 * @param threadId - 要检查的 thread
 * @param eventType - 要等待的事件类型
 * @param timeoutMs - 最长等待时间（默认 5000ms）
 * @returns Promise，resolve 为第一个匹配的事件
 *
 * 示例：
 *   await waitForEvent(threadManager, agentThreadId, 'TOOL_RESULT');
 */
export function waitForEvent(
  threadManager: ThreadManager,
  threadId: string,
  eventType: LaceEventType,
  timeoutMs = 5000
): Promise<LaceEvent> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const events = threadManager.getEvents(threadId);
      const event = events.find((e) => e.type === eventType);

      if (event) {
        resolve(event);
      } else if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timeout waiting for ${eventType} event after ${timeoutMs}ms`));
      } else {
        setTimeout(check, 10); // 每 10ms 轮询一次
      }
    };

    check();
  });
}

/**
 * 等待指定类型的事件出现指定次数
 *
 * @param threadManager - 用于查询的 thread manager
 * @param threadId - 要检查的 thread
 * @param eventType - 要等待的事件类型
 * @param count - 需要等待的事件数量
 * @param timeoutMs - 最长等待时间（默认 5000ms）
 * @returns Promise，resolve 为达到数量后所有匹配的事件
 *
 * 示例：
 *   // 等待 2 个 AGENT_MESSAGE 事件（初始响应 + 后续内容）
 *   await waitForEventCount(threadManager, agentThreadId, 'AGENT_MESSAGE', 2);
 */
export function waitForEventCount(
  threadManager: ThreadManager,
  threadId: string,
  eventType: LaceEventType,
  count: number,
  timeoutMs = 5000
): Promise<LaceEvent[]> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const events = threadManager.getEvents(threadId);
      const matchingEvents = events.filter((e) => e.type === eventType);

      if (matchingEvents.length >= count) {
        resolve(matchingEvents);
      } else if (Date.now() - startTime > timeoutMs) {
        reject(
          new Error(
            `Timeout waiting for ${count} ${eventType} events after ${timeoutMs}ms (got ${matchingEvents.length})`
          )
        );
      } else {
        setTimeout(check, 10);
      }
    };

    check();
  });
}

/**
 * 等待满足自定义条件的事件
 * 适用于需要检查事件数据（而非仅检查类型）的场景
 *
 * @param threadManager - 用于查询的 thread manager
 * @param threadId - 要检查的 thread
 * @param predicate - 匹配时返回 true 的函数
 * @param description - 用于错误信息的描述文字
 * @param timeoutMs - 最长等待时间（默认 5000ms）
 * @returns Promise，resolve 为第一个匹配的事件
 *
 * 示例：
 *   // 等待特定 ID 的 TOOL_RESULT
 *   await waitForEventMatch(
 *     threadManager,
 *     agentThreadId,
 *     (e) => e.type === 'TOOL_RESULT' && e.data.id === 'call_123',
 *     'TOOL_RESULT with id=call_123'
 *   );
 */
export function waitForEventMatch(
  threadManager: ThreadManager,
  threadId: string,
  predicate: (event: LaceEvent) => boolean,
  description: string,
  timeoutMs = 5000
): Promise<LaceEvent> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const events = threadManager.getEvents(threadId);
      const event = events.find(predicate);

      if (event) {
        resolve(event);
      } else if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`));
      } else {
        setTimeout(check, 10);
      }
    };

    check();
  });
}

// 真实调试会话中的对比示例：
//
// 改造前（不稳定）：
// -----------------
// const messagePromise = agent.sendMessage('Execute tools');
// await new Promise(r => setTimeout(r, 300)); // 希望 300ms 内工具能启动
// agent.abort();
// await messagePromise;
// await new Promise(r => setTimeout(r, 50));  // 希望 50ms 内结果能到达
// expect(toolResults.length).toBe(2);         // 随机失败
//
// 改造后（稳定）：
// ---------------
// const messagePromise = agent.sendMessage('Execute tools');
// await waitForEventCount(threadManager, threadId, 'TOOL_CALL', 2);   // 等工具启动
// agent.abort();
// await messagePromise;
// await waitForEventCount(threadManager, threadId, 'TOOL_RESULT', 2); // 等结果到达
// expect(toolResults.length).toBe(2); // 始终通过
//
// 效果：通过率 60% → 100%，执行时间加快 40%
