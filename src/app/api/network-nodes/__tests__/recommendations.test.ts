import assert from "node:assert/strict";
import test from "node:test";

function parsePositiveInt(value: string | null): number | undefined {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

test("parsePositiveInt parses integer and float", () => {
  assert.equal(parsePositiveInt("5"), 5);
  assert.equal(parsePositiveInt("5.9"), 5);
});

test("parsePositiveInt rejects invalid values", () => {
  assert.equal(parsePositiveInt("0"), undefined);
  assert.equal(parsePositiveInt("-2"), undefined);
  assert.equal(parsePositiveInt("abc"), undefined);
  assert.equal(parsePositiveInt(null), undefined);
});

test("parseBoolean handles true/false strings", () => {
  assert.equal(parseBoolean("true"), true);
  assert.equal(parseBoolean("1"), true);
  assert.equal(parseBoolean("false"), false);
  assert.equal(parseBoolean("0"), false);
  assert.equal(parseBoolean("x"), undefined);
});
