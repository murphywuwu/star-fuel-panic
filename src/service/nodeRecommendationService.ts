import type { NodeRecommendation } from "@/types/node";

async function parseJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as
    | T
    | {
        ok?: false;
        error?: {
          message?: string;
        };
      };

  if (!response.ok || (typeof payload === "object" && payload !== null && "ok" in payload && payload.ok === false)) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload ? payload.error?.message ?? "Request failed" : "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export const nodeRecommendationService = {
  async getRecommendations(input: {
    currentSystemId: number;
    maxJumps?: number;
    urgency?: Array<"critical" | "warning" | "safe">;
    limit?: number;
  }): Promise<NodeRecommendation[]> {
    const params = new URLSearchParams({
      currentSystem: String(input.currentSystemId)
    });

    if (typeof input.maxJumps === "number" && input.maxJumps > 0) {
      params.set("maxJumps", String(input.maxJumps));
    }
    if (typeof input.limit === "number" && input.limit > 0) {
      params.set("limit", String(input.limit));
    }
    if (input.urgency && input.urgency.length > 0) {
      params.set("urgency", input.urgency.join(","));
    }

    const payload = await parseJson<{
      recommendations: NodeRecommendation[];
    }>(await fetch(`/api/network-nodes/recommendations?${params.toString()}`, { cache: "no-store" }));

    return payload.recommendations;
  }
};
