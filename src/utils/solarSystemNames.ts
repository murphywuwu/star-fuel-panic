/**
 * Solar System Name Resolution
 *
 * Maps official EVE Frontier solar system IDs to display names
 * Uses the main /api/solar-systems endpoint and caches the results
 */

import type { SolarSystem } from "@/types/solarSystem";

// In-memory cache for solar system names
const systemNameCache = new Map<number, string>();

// Cache loaded flag
let cacheLoaded = false;

/**
 * Loads all solar system data from main API and extracts names
 * @returns Map of systemId to systemName
 */
async function loadAllSystemNames(): Promise<Map<number, string>> {
  try {
    const response = await fetch("/api/solar-systems", {
      cache: "no-store"
    });

    if (!response.ok) {
      console.warn(`[SolarSystem] API returned ${response.status}`);
      return new Map();
    }

    const data = await response.json();
    const names = new Map<number, string>();

    if (data.systems && Array.isArray(data.systems)) {
      data.systems.forEach((system: SolarSystem) => {
        names.set(system.systemId, system.systemName);
      });
    }

    console.log(`[SolarSystem] Loaded ${names.size} solar system names from API`);
    return names;
  } catch (error) {
    console.error("[SolarSystem] Failed to load solar system names:", error);
    return new Map();
  }
}

/**
 * Ensures cache is loaded
 */
async function ensureCacheLoaded(): Promise<void> {
  if (cacheLoaded) {
    return;
  }

  const names = await loadAllSystemNames();
  names.forEach((name, id) => {
    systemNameCache.set(id, name);
  });
  cacheLoaded = true;
}

/**
 * Gets solar system name with caching
 * @param systemId - EVE Frontier solar system ID
 * @returns Solar system name or formatted fallback
 */
export async function getSolarSystemName(systemId: number): Promise<string> {
  if (systemId === 0) {
    return "Unknown System";
  }

  // Ensure cache is loaded
  await ensureCacheLoaded();

  // Check cache
  const cached = systemNameCache.get(systemId);
  if (cached) {
    return cached;
  }

  // Fallback to ID-based display
  return `System ${systemId}`;
}

/**
 * Batch fetch solar system names for multiple IDs
 * @param systemIds - Array of solar system IDs
 * @returns Map of systemId to name
 */
export async function getSolarSystemNames(systemIds: number[]): Promise<Map<number, string>> {
  // Ensure cache is loaded
  await ensureCacheLoaded();

  const uniqueIds = [...new Set(systemIds)].filter(id => id !== 0);
  const results = new Map<number, string>();

  uniqueIds.forEach((id) => {
    const name = systemNameCache.get(id) || `System ${id}`;
    results.set(id, name);
  });

  return results;
}

/**
 * Preloads solar system names into cache
 * Call this on app initialization to warm up the cache
 */
export async function preloadSolarSystemNames(): Promise<void> {
  await ensureCacheLoaded();
  console.log(`[SolarSystem] Preloaded ${systemNameCache.size} solar system names`);
}

/**
 * Clears the solar system name cache
 */
export function clearSolarSystemCache(): void {
  systemNameCache.clear();
  cacheLoaded = false;
}

/**
 * Forces cache reload
 */
export async function reloadSolarSystemCache(): Promise<void> {
  clearSolarSystemCache();
  await ensureCacheLoaded();
}
