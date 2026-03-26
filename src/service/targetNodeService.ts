import { getSolarSystemName } from "@/utils/solarSystemNames";
import type { NetworkNode } from "@/types/node";

export interface TargetNodeDetail {
  node: NetworkNode;
  systemName: string;
}

class TargetNodeService {
  async getTargetNodeDetail(assemblyId: string): Promise<TargetNodeDetail> {
    const response = await fetch(`/api/nodes/${encodeURIComponent(assemblyId)}`, {
      cache: "no-store"
    });
    const payload = (await response.json()) as {
      node?: NetworkNode;
      error?: {
        message?: string;
      };
    };

    if (!response.ok || !payload.node) {
      throw new Error(payload.error?.message ?? "Node not found");
    }

    const systemName =
      payload.node.solarSystem !== 0 ? await getSolarSystemName(payload.node.solarSystem) : "Unknown System";

    return {
      node: payload.node,
      systemName
    };
  }
}

export const targetNodeService = new TargetNodeService();
