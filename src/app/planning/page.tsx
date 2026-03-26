import { Suspense } from "react";
import { TeamLobbyScreen } from "@/view/screens/TeamLobbyScreen";

export default function PlanningPage() {
  return (
    <Suspense fallback={null}>
      <TeamLobbyScreen />
    </Suspense>
  );
}
