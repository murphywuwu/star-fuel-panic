import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

type AliasRecord = {
  systemId?: number;
  id?: number;
  systemName?: string;
  name?: string;
};

type AliasPayload = {
  systems?: AliasRecord[];
};

type AliasCache = {
  filePath: string;
  mtimeMs: number;
  aliases: Map<number, string>;
};

const DEFAULT_ALIAS_PATH = path.join(process.cwd(), "data", "solar-systems.json");

let aliasCache: AliasCache | null = null;

function resolveAliasPath() {
  return process.env.SOLAR_SYSTEM_ALIAS_STORE_PATH?.trim() || DEFAULT_ALIAS_PATH;
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function readAliasRecords(payload: unknown): AliasRecord[] {
  if (Array.isArray(payload)) {
    return payload as AliasRecord[];
  }

  if (payload && typeof payload === "object" && Array.isArray((payload as AliasPayload).systems)) {
    return (payload as AliasPayload).systems as AliasRecord[];
  }

  return [];
}

export function readSolarSystemAliases() {
  const filePath = resolveAliasPath();
  if (!existsSync(filePath)) {
    return new Map<number, string>();
  }

  const stat = statSync(filePath);
  if (aliasCache && aliasCache.filePath === filePath && aliasCache.mtimeMs === stat.mtimeMs) {
    return aliasCache.aliases;
  }

  const raw = readFileSync(filePath, "utf8");
  const payload = JSON.parse(raw);
  const aliases = new Map<number, string>();

  for (const record of readAliasRecords(payload)) {
    const systemId = Number(record.systemId ?? record.id);
    const systemName = typeof record.systemName === "string" ? record.systemName : record.name;
    if (!Number.isFinite(systemId) || systemId <= 0 || typeof systemName !== "string" || !systemName.trim()) {
      continue;
    }
    aliases.set(Math.floor(systemId), systemName.trim());
  }

  aliasCache = {
    filePath,
    mtimeMs: stat.mtimeMs,
    aliases
  };

  return aliases;
}

export function matchesSolarSystemSearch(query: string, systemId: number, systemName: string, aliasName?: string | null) {
  const trimmed = normalizeName(query);
  if (!trimmed) {
    return false;
  }

  if (String(systemId).includes(trimmed)) {
    return true;
  }

  if (normalizeName(systemName).includes(trimmed)) {
    return true;
  }

  if (aliasName && normalizeName(aliasName).includes(trimmed)) {
    return true;
  }

  return false;
}

export function buildSolarSystemSearchLabel(systemId: number, systemName: string, aliasName?: string | null) {
  if (aliasName && normalizeName(aliasName) !== normalizeName(systemName)) {
    return `${aliasName} // ${systemName} (${systemId})`;
  }

  return `${systemName} (${systemId})`;
}

export function __resetSolarSystemAliasStoreForTests() {
  aliasCache = null;
}
