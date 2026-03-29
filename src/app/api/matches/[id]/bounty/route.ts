import {
  hydrateRuntimeProjectionFromBackendIfNeeded,
  persistMatchDetailToBackend
} from "@/server/matchBackendStore";
import { addMatchBounty } from "@/server/matchRuntime";
import { createBountyPostHandler } from "@/server/matchBountyRoute";

export const dynamic = "force-dynamic";

export const POST = createBountyPostHandler({
  applyBounty: addMatchBounty,
  ensureHydrated: async (matchId) => {
    await hydrateRuntimeProjectionFromBackendIfNeeded({ matchId });
  },
  afterSuccess: async (matchId) => {
    await persistMatchDetailToBackend(matchId);
  }
});
