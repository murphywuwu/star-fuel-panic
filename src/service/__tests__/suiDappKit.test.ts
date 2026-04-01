import assert from "node:assert/strict";
import test from "node:test";

import { buildRuntimeDAppKitConfig, DAPP_KIT_WALLET_CONNECTION_STORAGE_KEY } from "@/service/suiDappKit.ts";

test("buildRuntimeDAppKitConfig keeps persisted wallet sessions enabled", () => {
  const fakeStorage = {} as Storage;
  const config = buildRuntimeDAppKitConfig(fakeStorage);

  assert.equal(config.autoConnect, true);
  assert.equal(config.storage, fakeStorage);
  assert.equal(config.storageKey, DAPP_KIT_WALLET_CONNECTION_STORAGE_KEY);
});
