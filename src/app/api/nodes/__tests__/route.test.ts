import assert from "node:assert/strict";
import test from "node:test";

/**
 * GET /api/nodes 查询参数解析测试
 *
 * 注意：完整的 API 端点集成测试需要 Next.js 运行时环境。
 * 这里仅测试查询参数解析逻辑，业务逻辑已在 nodeRuntime.test.ts 中测试。
 *
 * 测试覆盖：
 * - urgency 参数解析
 * - hasMatch 参数解析
 * - isOnline 参数解析
 * - typeId 参数解析
 * - limit 参数解析
 * - 无效值处理
 */

// === 从 route.ts 复制的解析函数（用于测试） ===

function parseUrgency(value: string | null): "critical" | "warning" | "safe" | undefined {
  if (value === "critical" || value === "warning" || value === "safe") {
    return value;
  }
  return undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return undefined;
}

function parsePositiveNumber(value: string | null): number | undefined {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

function parseInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

// === parseUrgency 测试 ===

test("parseUrgency: 解析 'critical'", () => {
  assert.equal(parseUrgency("critical"), "critical");
});

test("parseUrgency: 解析 'warning'", () => {
  assert.equal(parseUrgency("warning"), "warning");
});

test("parseUrgency: 解析 'safe'", () => {
  assert.equal(parseUrgency("safe"), "safe");
});

test("parseUrgency: 无效值返回 undefined", () => {
  assert.equal(parseUrgency("invalid"), undefined);
  assert.equal(parseUrgency(""), undefined);
  assert.equal(parseUrgency(null), undefined);
});

// === parseBoolean 测试 ===

test("parseBoolean: 解析 'true'", () => {
  assert.equal(parseBoolean("true"), true);
});

test("parseBoolean: 解析 '1'", () => {
  assert.equal(parseBoolean("1"), true);
});

test("parseBoolean: 解析 'false'", () => {
  assert.equal(parseBoolean("false"), false);
});

test("parseBoolean: 解析 '0'", () => {
  assert.equal(parseBoolean("0"), false);
});

test("parseBoolean: 无效值返回 undefined", () => {
  assert.equal(parseBoolean("invalid"), undefined);
  assert.equal(parseBoolean(""), undefined);
  assert.equal(parseBoolean(null), undefined);
});

// === parsePositiveNumber 测试 ===

test("parsePositiveNumber: 解析正整数", () => {
  assert.equal(parsePositiveNumber("123"), 123);
  assert.equal(parsePositiveNumber("1"), 1);
  assert.equal(parsePositiveNumber("999999"), 999999);
});

test("parsePositiveNumber: 解析浮点数（向下取整）", () => {
  assert.equal(parsePositiveNumber("123.7"), 123);
  assert.equal(parsePositiveNumber("99.1"), 99);
});

test("parsePositiveNumber: 负数返回 undefined", () => {
  assert.equal(parsePositiveNumber("-1"), undefined);
  assert.equal(parsePositiveNumber("-100"), undefined);
});

test("parsePositiveNumber: 零返回 undefined", () => {
  assert.equal(parsePositiveNumber("0"), undefined);
});

test("parsePositiveNumber: 非数字字符串返回 undefined", () => {
  assert.equal(parsePositiveNumber("abc"), undefined);
  assert.equal(parsePositiveNumber(""), undefined);
  assert.equal(parsePositiveNumber(null), undefined);
});

test("parsePositiveNumber: NaN 和 Infinity 返回 undefined", () => {
  assert.equal(parsePositiveNumber("NaN"), undefined);
  assert.equal(parsePositiveNumber("Infinity"), undefined);
});

// === parseInteger 测试（用于 solarSystem） ===

test("parseInteger: 解析非负整数", () => {
  assert.equal(parseInteger("0"), 0);
  assert.equal(parseInteger("123"), 123);
});

test("parseInteger: 解析浮点数（向下取整）", () => {
  assert.equal(parseInteger("10.9"), 10);
});

test("parseInteger: 负数返回 undefined", () => {
  assert.equal(parseInteger("-1"), undefined);
});

test("parseInteger: 非数字字符串返回 undefined", () => {
  assert.equal(parseInteger("abc"), undefined);
  assert.equal(parseInteger(""), undefined);
  assert.equal(parseInteger(null), undefined);
});

test("parseInteger: NaN 和 Infinity 返回 undefined", () => {
  assert.equal(parseInteger("NaN"), undefined);
  assert.equal(parseInteger("Infinity"), undefined);
});
