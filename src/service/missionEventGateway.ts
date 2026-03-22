import type { ChainFuelEvent, MissionSnapshotPullResult, NodeDeficitSnapshot } from "@/types/fuelMission";

async function fetchStubSnapshot(): Promise<MissionSnapshotPullResult> {
  return {
    stale: false,
    source: "stub",
    nodes: [
      { nodeId: "n1", name: "Aster Relay", fillRatio: 0.35, riskWeight: 1.2, completed: false },
      { nodeId: "n2", name: "Kite Gate", fillRatio: 0.58, riskWeight: 1.5, completed: false },
      { nodeId: "n3", name: "Vega Corridor", fillRatio: 0.25, riskWeight: 1.8, completed: false }
    ]
  };
}

const fuelEventQueue: ChainFuelEvent[] = [];

export const missionEventGateway = {
  async pullLatestSnapshot(fallbackNodes: NodeDeficitSnapshot[] = []): Promise<MissionSnapshotPullResult> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await fetchStubSnapshot();
      } catch {
        if (attempt === 1) {
          return {
            stale: true,
            source: "fallback",
            nodes: fallbackNodes
          };
        }
      }
    }
    return {
      stale: true,
      source: "fallback",
      nodes: fallbackNodes
    };
  },

  enqueueFuelEvent(event: ChainFuelEvent) {
    fuelEventQueue.push(event);
  },

  pollFuelEvents(matchId: string, limit = 50): ChainFuelEvent[] {
    const matched: ChainFuelEvent[] = [];
    const remaining: ChainFuelEvent[] = [];

    for (const event of fuelEventQueue) {
      if (event.matchId === matchId && matched.length < limit) {
        matched.push(event);
      } else {
        remaining.push(event);
      }
    }

    fuelEventQueue.splice(0, fuelEventQueue.length, ...remaining);
    return matched.sort((a, b) => a.chainTs - b.chainTs);
  },

  clearFuelEvents(matchId?: string) {
    if (!matchId) {
      fuelEventQueue.splice(0, fuelEventQueue.length);
      return;
    }

    const remaining = fuelEventQueue.filter((event) => event.matchId !== matchId);
    fuelEventQueue.splice(0, fuelEventQueue.length, ...remaining);
  }
};
