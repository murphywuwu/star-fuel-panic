import assert from "node:assert/strict";
import test from "node:test";

import { createMatchStore } from "@/model/createMatchStore.ts";
import { createMatchService } from "@/service/createMatchService.ts";
import { setWalletRuntimeBridge } from "@/service/walletService.ts";

type DeferredResponse = {
  promise: Promise<Response>;
  reject: (error: unknown) => void;
  resolve: (response: Response) => void;
};

const originalFetch = globalThis.fetch;

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

function createDeferredResponse(signal?: AbortSignal | null): DeferredResponse {
  let resolve!: (response: Response) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<Response>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  if (signal) {
    signal.addEventListener(
      "abort",
      () => {
        reject(new DOMException("The operation was aborted.", "AbortError"));
      },
      { once: true }
    );
  }

  return {
    promise,
    reject,
    resolve
  };
}

test.beforeEach(() => {
  createMatchService.reset();
  globalThis.fetch = originalFetch;
  setWalletRuntimeBridge(null);
});

test.after(() => {
  createMatchService.reset();
  globalThis.fetch = originalFetch;
  setWalletRuntimeBridge(null);
});

test("createMatchService clears stale search results after selecting a system", async () => {
  let deferredSearch: DeferredResponse | null = null;

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);

    if (url.startsWith("/api/search?")) {
      deferredSearch = createDeferredResponse(init?.signal);
      return deferredSearch.promise;
    }

    if (url === "/api/solar-systems/30000142") {
      return jsonResponse({
        system: {
          systemId: 30000142,
          systemName: "Jita",
          constellationId: 20000020,
          gateLinks: []
        }
      });
    }

    if (url.startsWith("/api/network-nodes?solarSystem=30000142")) {
      return jsonResponse({
        nodes: [
          {
            objectId: "0xnode-1",
            name: "NetworkNode-1",
            coordX: 0,
            coordZ: 0,
            fillRatio: 0.12,
            urgency: "critical",
            isOnline: true
          }
        ]
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }) as typeof globalThis.fetch;

  const searchPromise = createMatchService.searchSystems("Jit");
  assert.equal(createMatchStore.getState().searching, true);

  const selectResult = await createMatchService.selectSystem(30000142);
  assert.equal(selectResult.ok, true);
  assert.equal(createMatchStore.getState().selectedSystem?.systemId, 30000142);
  assert.deepEqual(createMatchStore.getState().searchHits, []);

  assert.ok(deferredSearch);
  const pendingSearch = deferredSearch as DeferredResponse;
  pendingSearch.resolve(
    jsonResponse({
      hits: [
        {
          type: "system",
          id: 30000142,
          label: "Jita (30000142)"
        }
      ]
    })
  );

  const searchResult = await searchPromise;
  assert.equal(searchResult.ok, true);
  assert.deepEqual(createMatchStore.getState().searchHits, []);
  assert.equal(createMatchStore.getState().searching, false);
});

test("createMatchService surfaces package/network mismatch before publish escrow transaction", async () => {
  createMatchStore.getState().setField("solarSystemId", 30000142);
  createMatchStore.getState().setField("sponsorshipFee", 50);
  createMatchStore.getState().setField("maxTeams", 4);
  createMatchStore.getState().setField("entryFee", 50);
  createMatchStore.getState().setField("durationHours", 2);
  createMatchStore.getState().setDraftId("draft-001");

  let executed = false;
  setWalletRuntimeBridge({
    connect: async () => "0xabc",
    disconnect: async () => undefined,
    currentAddress: () => "0xabc",
    signTransaction: async () => {
      throw new Error("not used");
    },
    signAndExecuteTransaction: async () => {
      executed = true;
      return { txDigest: "tx-should-not-run" };
    },
    getBalance: async () => 0,
    objectExists: async () => false
  });

  const result = await createMatchService.executePublishEscrowTransaction("0xabc");
  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "E_WALLET_UNAVAILABLE");
  assert.match(result.message, /(escrow package|fuel frog package id)/i);
  assert.equal(executed, false);
});
