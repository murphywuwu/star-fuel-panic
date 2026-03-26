import { CreateMatchPlanningScreen } from "@/view/screens/CreateMatchPlanningScreen";
import { TeamLobbyScreen } from "@/view/screens/TeamLobbyScreen";

function pickSingleParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

export default async function PlanningPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const view = pickSingleParam(resolvedSearchParams.view);
  const preferredMatchId = pickSingleParam(resolvedSearchParams.matchId) ?? null;

  if (view === "create-match") {
    return <CreateMatchPlanningScreen />;
  }

  return <TeamLobbyScreen preferredMatchId={preferredMatchId} />;
}
