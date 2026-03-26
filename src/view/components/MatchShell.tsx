import { FuelMissionShell } from "@/view/components/FuelMissionShell";
import type { ComponentProps } from "react";

export type MatchShellProps = ComponentProps<typeof FuelMissionShell>;

export function MatchShell(props: MatchShellProps) {
  return <FuelMissionShell {...props} />;
}
