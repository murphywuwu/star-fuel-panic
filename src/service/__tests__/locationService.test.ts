import assert from "node:assert/strict";
import test from "node:test";

import { locationStore } from "@/model/locationStore.ts";
import { locationService } from "@/service/locationService.ts";

type LocalStorageMock = {
  length: number;
  clear: () => void;
  getItem: (key: string) => string | null;
  key: (index: number) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

type TestWindow = Partial<Window> & {
  localStorage: Storage;
};

const windowHost = globalThis as unknown as { window?: unknown };
const originalWindow = windowHost.window as TestWindow | undefined;

function setTestWindow(value: TestWindow | undefined) {
  if (value === undefined) {
    Reflect.deleteProperty(windowHost, "window");
    return;
  }

  Reflect.set(windowHost, "window", value);
}

function createLocalStorageMock(): LocalStorageMock {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    key(index) {
      return [...store.keys()][index] ?? null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    }
  };
}

test.beforeEach(() => {
  locationStore.getState().reset();
  locationStore.getState().setHydrated(false);
  setTestWindow({
    localStorage: createLocalStorageMock() as unknown as Storage
  } as TestWindow);
});

test("locationService persists selected location and hydrates it back", () => {
  const selected = locationService.setLocation({
    regionId: 10000002,
    constellationId: 20000020,
    systemId: 30000142,
    constellationName: "Kimotoro",
    systemName: "Jita"
  });

  assert.equal(selected.ok, true);
  locationStore.getState().reset();
  locationStore.getState().setHydrated(false);

  const hydrated = locationService.hydrateFromStorage();
  assert.equal(hydrated.ok, true);
  assert.equal(locationStore.getState().current?.systemId, 30000142);
  assert.equal(locationStore.getState().current?.systemName, "Jita");
});

test("locationService rejects incomplete selection payloads", () => {
  const result = locationService.setLocation({
    constellationId: 20000020
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, "INVALID_INPUT");
});

test.after(() => {
  if (originalWindow === undefined) {
    setTestWindow(undefined);
    return;
  }

  setTestWindow(originalWindow);
});
