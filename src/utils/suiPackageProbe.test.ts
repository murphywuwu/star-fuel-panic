import assert from "node:assert/strict";
import test from "node:test";

import { describePackageAvailabilityMismatch } from "./suiPackageProbe.ts";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("describePackageAvailabilityMismatch reports another network when package exists there", async () => {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes("devnet")) {
      return new Response(
        JSON.stringify({
          result: {
            data: {
              type: "package"
            }
          }
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        result: {
          error: {
            code: "notExists"
          }
        }
      }),
      { status: 200 }
    );
  }) as typeof fetch;

  const message = await describePackageAvailabilityMismatch("0xpackage", "testnet");
  assert.match(message, /available on devnet, not testnet/i);
});

test("describePackageAvailabilityMismatch falls back to generic message when no network matches", async () => {
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        result: {
          error: {
            code: "notExists"
          }
        }
      }),
      { status: 200 }
    )) as typeof fetch;

  const message = await describePackageAvailabilityMismatch("0xpackage", "testnet");
  assert.match(message, /not available on testnet/i);
});
