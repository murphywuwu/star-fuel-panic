import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { NetworkNode } from "../types/node.ts";

export type NodeIndexCursor = {
  eventSeq: string;
  txDigest: string;
} | null;

export type IndexedNodeSnapshot = Omit<NetworkNode, "activeMatchId">;

export type NodeIndexSnapshot = {
  version: 2;
  lastSyncAt: string | null;
  discoveryCursor: NodeIndexCursor;
  locationCursor: NodeIndexCursor;
  nodes: IndexedNodeSnapshot[];
};

const DEFAULT_INDEX_PATH = path.join(process.cwd(), "data", "node-index.json");

function resolveIndexPath() {
  return process.env.NODE_INDEX_STORE_PATH?.trim() || DEFAULT_INDEX_PATH;
}

export function createEmptyNodeIndexSnapshot(): NodeIndexSnapshot {
  return {
    version: 2 as const,
    lastSyncAt: null,
    discoveryCursor: null,
    locationCursor: null,
    nodes: []
  };
}

export async function readNodeIndexSnapshot(): Promise<NodeIndexSnapshot> {
  const filePath = resolveIndexPath();

  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<NodeIndexSnapshot> & {
      version?: number;
      cursor?: NodeIndexCursor;
    };

    if (!parsed || !Array.isArray(parsed.nodes)) {
      return createEmptyNodeIndexSnapshot();
    }

    if (parsed.version === 2) {
      return {
        version: 2 as const,
        lastSyncAt: typeof parsed.lastSyncAt === "string" ? parsed.lastSyncAt : null,
        discoveryCursor: parsed.discoveryCursor ?? null,
        locationCursor: parsed.locationCursor ?? null,
        nodes: parsed.nodes
      };
    }

    if (parsed.version === 1) {
      return {
        version: 2 as const,
        lastSyncAt: typeof parsed.lastSyncAt === "string" ? parsed.lastSyncAt : null,
        discoveryCursor: parsed.cursor ?? null,
        locationCursor: null,
        nodes: parsed.nodes
      };
    }

    return createEmptyNodeIndexSnapshot();
  } catch (error) {
    const candidate = error as NodeJS.ErrnoException;
    if (candidate.code === "ENOENT") {
      return createEmptyNodeIndexSnapshot();
    }
    throw error;
  }
}

export async function writeNodeIndexSnapshot(snapshot: NodeIndexSnapshot) {
  const filePath = resolveIndexPath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(snapshot, null, 2), "utf8");
}

export function resolveNodeIndexPath() {
  return resolveIndexPath();
}
