import { useMemo, useState } from "react";
import type {
  ControllerResult,
  FundingSources,
  NodeDeficitSnapshot,
  RoomState,
  TeamState
} from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface MissionLobbyPanelProps {
  room: RoomState | null;
  funding: FundingSources;
  nodes: NodeDeficitSnapshot[];
  teams: TeamState[];
  onInitMission: () => ControllerResult<NodeDeficitSnapshot[]>;
  onCreateRoom: () => ControllerResult<{ roomId: string; configLockHash: string }>;
  onJoinRoom: (teamId: string, playerId: string, name: string) => ControllerResult<{ teamId: string; playerCount: number }>;
}

const TEAM_OPTIONS = [
  { teamId: "team-alpha", label: "Team Alpha" },
  { teamId: "team-beta", label: "Team Beta" }
];

function teamPlayerCount(teams: TeamState[], teamId: string) {
  return teams.find((team) => team.teamId === teamId)?.players.length ?? 0;
}

function currency(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} LUX`;
}

export function MissionLobbyPanel({
  room,
  funding,
  nodes,
  teams,
  onInitMission,
  onCreateRoom,
  onJoinRoom
}: MissionLobbyPanelProps) {
  const [selectedTeam, setSelectedTeam] = useState("team-alpha");
  const [pilotName, setPilotName] = useState("Pilot Alpha");
  const [joinAttempt, setJoinAttempt] = useState(1);
  const [message, setMessage] = useState("READY FOR ENTRY CONFIRMATION");
  const [entryLocked, setEntryLocked] = useState(false);

  const grossPoolPreview = useMemo(
    () =>
      funding.entryFeeLux * funding.playerCount +
      funding.hostSeedPool +
      funding.platformSubsidyPool +
      funding.sponsorPool,
    [funding]
  );

  const totalPlayers = useMemo(
    () => teams.reduce((sum, team) => sum + team.players.length, 0),
    [teams]
  );

  const urgentNodes = useMemo(
    () => [...nodes].sort((a, b) => a.fillRatio - b.fillRatio).slice(0, 5),
    [nodes]
  );

  const handleInit = () => {
    const result = onInitMission();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage(`MISSION SNAPSHOT READY // NODES=${result.payload?.length ?? 0}`);
  };

  const handleCreate = () => {
    const result = onCreateRoom();
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }
    setMessage(`ROOM CREATED // ${result.payload?.roomId ?? "N/A"}`);
  };

  const handleJoin = () => {
    if (!room) {
      setMessage("ROOM NOT READY");
      return;
    }

    const playerId = `pilot-${selectedTeam}-${joinAttempt}`;
    const result = onJoinRoom(selectedTeam, playerId, pilotName);
    if (!result.ok) {
      setMessage(`${result.errorCode ?? "E_UNKNOWN"} // ${result.message}`);
      return;
    }

    setEntryLocked(true);
    setJoinAttempt((current) => current + 1);
    setMessage(`ENTRY LOCKED // ${result.payload?.teamId ?? selectedTeam} // SLOT ${result.payload?.playerCount ?? 0}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TacticalPanel title="Mission Lobby / Buy-in" eyebrow="S-001">
        {!room ? (
          <div className="space-y-3 text-sm text-eve-offwhite/90">
            <p className="border border-eve-red/70 bg-eve-red/20 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]">
              NO ACTIVE RELAY OPS
            </p>
            <p>Initialize mission snapshot and create a room before player entry.</p>
            <div className="flex flex-wrap gap-2">
              <TacticalButton tone="ghost" onClick={handleInit}>
                Initialize Snapshot
              </TacticalButton>
              <TacticalButton onClick={handleCreate}>Create Room</TacticalButton>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-eve-yellow/90">Room ID: {room.roomId}</p>
            <label className="block space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-eve-offwhite/80">Pilot Callsign</span>
              <input
                value={pilotName}
                onChange={(event) => setPilotName(event.target.value)}
                className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-eve-offwhite/80">Join Team</span>
              <select
                value={selectedTeam}
                onChange={(event) => setSelectedTeam(event.target.value)}
                className="w-full border border-eve-yellow/50 bg-eve-black/80 px-3 py-2 text-sm text-eve-offwhite outline-none focus:border-eve-yellow"
              >
                {TEAM_OPTIONS.map((team) => (
                  <option key={team.teamId} value={team.teamId}>
                    {team.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <TacticalButton onClick={handleJoin}>Join Match</TacticalButton>
              <TacticalButton tone="ghost" onClick={() => setMessage("RULEBOOK // NODE DEFICIT + CONTRIBUTION SETTLEMENT")}>View Rules</TacticalButton>
              <TacticalButton tone="danger" onClick={() => setEntryLocked(false)}>
                Leave Room
              </TacticalButton>
            </div>
          </div>
        )}

        <p className={`mt-4 border px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] ${entryLocked ? "border-eve-yellow/70" : "border-eve-offwhite/30"}`}>
          {message}
        </p>
      </TacticalPanel>

      <TacticalPanel title="Node Deficit Snapshot" eyebrow="Urgency Feed" className="lg:col-span-1">
        <ul className="space-y-2 text-xs">
          {urgentNodes.length === 0 ? <li className="text-eve-offwhite/70">STANDBY // NO NODE DATA</li> : null}
          {urgentNodes.map((node) => (
            <li key={node.nodeId} className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2">
              <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">{node.name}</p>
              <p className="mt-1 text-eve-offwhite/85">FILL RATIO: {Math.round(node.fillRatio * 100)}%</p>
              <p className="text-eve-offwhite/70">RISK WEIGHT: {node.riskWeight.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </TacticalPanel>

      <TacticalPanel title="Pool and Team Slots" eyebrow="Funding Sources" className="lg:col-span-1">
        <ul className="space-y-2 text-sm text-eve-offwhite/85">
          <li className="flex items-center justify-between"><span>Entry Fee</span><span>{currency(funding.entryFeeLux)}</span></li>
          <li className="flex items-center justify-between"><span>Host Seed</span><span>{currency(funding.hostSeedPool)}</span></li>
          <li className="flex items-center justify-between"><span>Platform Subsidy</span><span>{currency(funding.platformSubsidyPool)}</span></li>
          <li className="flex items-center justify-between"><span>Sponsor Pool</span><span>{currency(funding.sponsorPool)}</span></li>
          <li className="flex items-center justify-between border-t border-eve-yellow/30 pt-2 font-mono uppercase tracking-[0.12em] text-eve-yellow">
            <span>Gross Pool Preview</span>
            <span>{currency(grossPoolPreview)}</span>
          </li>
        </ul>

        <div className="mt-4 border border-eve-yellow/30 bg-eve-black/70 px-3 py-3 text-xs">
          <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Team Occupancy</p>
          <p className="mt-2 text-eve-offwhite/85">Team Alpha: {teamPlayerCount(teams, "team-alpha")} pilots</p>
          <p className="text-eve-offwhite/85">Team Beta: {teamPlayerCount(teams, "team-beta")} pilots</p>
          <p className="mt-2 border-t border-eve-yellow/30 pt-2 font-mono uppercase tracking-[0.12em] text-eve-offwhite">
            TOTAL PLAYERS: {totalPlayers}
          </p>
        </div>
      </TacticalPanel>
    </div>
  );
}
