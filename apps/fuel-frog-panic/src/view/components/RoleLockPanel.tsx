import { useEffect, useMemo, useState } from "react";
import type { ControllerResult, MissionPhase, TeamRole, TeamState } from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface RoleLockPanelProps {
  teams: TeamState[];
  phase: MissionPhase;
  planningCountdown: number;
  rolesLocked: boolean;
  onEnterPlanning: () => ControllerResult<{ from: MissionPhase; to: MissionPhase }>;
  onLockRole: (teamId: string, assignments: Partial<Record<TeamRole, string>>) => ControllerResult<{ teamId: string }>;
  onStartMatch: () => ControllerResult<{ from: MissionPhase; to: MissionPhase }>;
}

const ROLES: TeamRole[] = ["Collector", "Hauler", "Escort", "Dispatcher"];

function autoAssign(team: TeamState | null): Partial<Record<TeamRole, string>> {
  if (!team || team.players.length === 0) {
    return {};
  }
  return {
    Collector: team.players[0]?.playerId,
    Hauler: team.players[1]?.playerId ?? team.players[0]?.playerId,
    Escort: team.players[2]?.playerId ?? team.players[0]?.playerId,
    Dispatcher: team.players[3]?.playerId ?? team.players[0]?.playerId
  };
}

export function RoleLockPanel({
  teams,
  phase,
  planningCountdown,
  rolesLocked,
  onEnterPlanning,
  onLockRole,
  onStartMatch
}: RoleLockPanelProps) {
  const [selectedTeamId, setSelectedTeamId] = useState("team-alpha");
  const team = useMemo(() => teams.find((item) => item.teamId === selectedTeamId) ?? null, [selectedTeamId, teams]);
  const [assignments, setAssignments] = useState<Partial<Record<TeamRole, string>>>({});
  const [message, setMessage] = useState("ROLE LOCK PIPELINE STANDBY");

  useEffect(() => {
    setAssignments(autoAssign(team));
  }, [team]);

  const missingRoles = ROLES.filter((role) => !assignments[role]);

  const handleEnterPlanning = () => {
    const result = onEnterPlanning();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage(`PHASE MOVED // ${result.payload?.from ?? "N/A"} -> ${result.payload?.to ?? "N/A"}`);
  };

  const handleLockAndStart = () => {
    if (!team) {
      setMessage("NO TEAM READY");
      return;
    }

    const lockResult = onLockRole(team.teamId, assignments);
    if (!lockResult.ok) {
      setMessage(`${lockResult.errorCode ?? "E_UNKNOWN"} // ${lockResult.message}`);
      return;
    }

    const startResult = onStartMatch();
    if (!startResult.ok && startResult.errorCode !== "E_INVALID_STATE_TRANSITION") {
      setMessage(`${startResult.errorCode ?? "E_UNKNOWN"} // ${startResult.message}`);
      return;
    }

    setMessage(`ROLES LOCKED // ${team.name.toUpperCase()} // MATCH START REQUESTED`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TacticalPanel title="Planning / Role Lock" eyebrow="S-002" className="lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">Selected Team</span>
            <select
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
              className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
            >
              <option value="team-alpha">Team Alpha</option>
              <option value="team-beta">Team Beta</option>
            </select>
          </label>

          <div className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2 text-xs">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Planning Countdown</p>
            <p className="mt-1 text-lg font-mono text-eve-offwhite">{planningCountdown}s</p>
          </div>
        </div>

        {team?.players.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ROLES.map((role) => (
              <label key={role} className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite/80">{role}</span>
                <select
                  value={assignments[role] ?? ""}
                  onChange={(event) =>
                    setAssignments((current) => ({
                      ...current,
                      [role]: event.target.value || undefined
                    }))
                  }
                  disabled={rolesLocked}
                  className="w-full border border-eve-yellow/40 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none disabled:opacity-60"
                >
                  <option value="">UNASSIGNED</option>
                  {team.players.map((pilot) => (
                    <option key={pilot.playerId} value={pilot.playerId}>
                      {pilot.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-4 border border-eve-red/70 bg-eve-red/20 px-3 py-2 text-xs font-mono uppercase tracking-[0.12em]">
            TEAM HAS NO PILOTS. RETURN TO LOBBY TO JOIN.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <TacticalButton tone="ghost" onClick={handleEnterPlanning}>
            Enter Planning
          </TacticalButton>
          <TacticalButton tone="ghost" onClick={() => setAssignments(autoAssign(team))}>
            Auto Assign
          </TacticalButton>
          <TacticalButton tone="danger" onClick={() => setAssignments({})}>
            Reset
          </TacticalButton>
          <TacticalButton disabled={rolesLocked || !team || missingRoles.length > 0} onClick={handleLockAndStart}>
            Lock Roles & Start
          </TacticalButton>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Role Lock Status" eyebrow="IA-002">
        <ul className="space-y-2 text-xs text-eve-offwhite/85">
          <li>Current Phase: {phase}</li>
          <li>Roles Locked: {rolesLocked ? "YES" : "NO"}</li>
          <li>Missing Roles: {missingRoles.length === 0 ? "NONE" : missingRoles.join(", ")}</li>
          <li>Team Pilots: {team?.players.length ?? 0}</li>
        </ul>
        <p className="mt-4 border border-eve-yellow/40 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]">
          {message}
        </p>
      </TacticalPanel>
    </div>
  );
}
