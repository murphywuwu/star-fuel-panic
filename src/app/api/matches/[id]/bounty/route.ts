import { addMatchBounty } from "@/server/matchRuntime";
import { createBountyPostHandler } from "@/server/matchBountyRoute";

export const dynamic = "force-dynamic";

export const POST = createBountyPostHandler({
  applyBounty: addMatchBounty
});
