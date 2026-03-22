import type {
  MatchStatus,
  MemberScoreLine,
  NodeDeficitSnapshot,
  ScoreBoard as LiveScoreBoard,
  ScoreEvent,
  ScoreRejectAuditLog
} from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

export interface OptimisticNodePreview {
  id: string;
  nodeId: string;
  fillDelta: number;
  status: "pending" | "reverted";
  createdAt: number;
}

interface NodeMapProps {
  nodes: NodeDeficitSnapshot[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  optimisticPatches?: OptimisticNodePreview[];
}

interface ActionPanelProps {
  selectedNodeId: string | null;
  busy: boolean;
  interactionLocked?: boolean;
  lockHint?: string;
  onSubmitSupply: () => void;
  onRequestEscort: () => void;
  onReroute: () => void;
  onRefresh: () => void;
  onTick: () => void;
}

interface EventFeedProps {
  events: ScoreEvent[];
  rejections?: ScoreRejectAuditLog[];
  optimisticPatches?: OptimisticNodePreview[];
}

interface ScoreBoardProps {
  scoreBoard: LiveScoreBoard | null;
  myScore: MemberScoreLine | null;
}

interface SprintAlertProps {
  status: MatchStatus;
  remainingSec: number;
  isPanic: boolean;
}

interface MatchStatusRailProps {
  status: MatchStatus;
  remainingSec: number;
  isPanic: boolean;
}

const STATUS_ORDER: MatchStatus[] = ["lobby", "pre_start", "running", "panic", "settling", "settled"];

function urgencyColor(fillRatio: number) {
  const deficit = 1 - fillRatio;
  if (deficit >= 0.7) {
    return "#CC3300";
  }
  if (deficit >= 0.4) {
    return "#E5B32B";
  }
  return "#4A7A4A";
}

function statusLabel(status: MatchStatus) {
  switch (status) {
    case "lobby":
      return "Lobby";
    case "pre_start":
      return "PreStart";
    case "running":
      return "Running";
    case "panic":
      return "Panic";
    case "settling":
      return "Settling";
    case "settled":
      return "Settled";
    default:
      return status;
  }
}

function statusDescription(status: MatchStatus) {
  switch (status) {
    case "lobby":
      return "Waiting for team lock.";
    case "pre_start":
      return "30s countdown before chain start.";
    case "running":
      return "Standard scoring window.";
    case "panic":
      return "Final 90s. Score multiplier x1.5.";
    case "settling":
      return "Settlement pipeline in progress.";
    case "settled":
      return "Match closed. Bill available.";
    default:
      return "";
  }
}

export function MatchStatusRail({ status, remainingSec, isPanic }: MatchStatusRailProps) {
  return (
    <TacticalPanel title="Match Status" eyebrow="F-004 State Machine">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {STATUS_ORDER.map((item) => {
          const active = item === status;
          const reached = STATUS_ORDER.indexOf(item) < STATUS_ORDER.indexOf(status);

          return (
            <div
              key={item}
              className={
                active
                  ? "border border-eve-yellow bg-eve-yellow/20 px-3 py-2"
                  : reached
                    ? "border border-eve-yellow/30 bg-eve-black/55 px-3 py-2"
                    : "border border-eve-grey/70 bg-eve-black/35 px-3 py-2"
              }
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-eve-yellow">{statusLabel(item)}</p>
              <p className="mt-1 text-[11px] text-eve-offwhite/75">{statusDescription(item)}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-eve-offwhite/90">
        <span>STATUS: {statusLabel(status).toUpperCase()}</span>
        <span>T-{remainingSec}s</span>
        <span className={isPanic ? "text-eve-red" : "text-eve-offwhite/75"}>
          PANIC: {isPanic ? "ACTIVE" : "IDLE"}
        </span>
      </div>
    </TacticalPanel>
  );
}

export function NodeMap({ nodes, selectedNodeId, onSelectNode, optimisticPatches = [] }: NodeMapProps) {
  const sortedNodes = [...nodes].sort((a, b) => a.fillRatio - b.fillRatio);

  return (
    <TacticalPanel title="Node Map" eyebrow="Primary Mission Surface">
      <ul className="space-y-2">
        {sortedNodes.map((node) => {
          const selected = node.nodeId === selectedNodeId;
          const pendingFillBoost = optimisticPatches
            .filter((patch) => patch.nodeId === node.nodeId && patch.status === "pending")
            .reduce((sum, patch) => sum + patch.fillDelta, 0);
          const hasOptimistic = pendingFillBoost > 0;
          const displayFill = Math.max(0, Math.min(1, node.fillRatio + pendingFillBoost));
          const fillPct = Math.round(displayFill * 100);
          const pendingPct = Math.round(pendingFillBoost * 100);

          return (
            <li key={node.nodeId}>
              <button
                type="button"
                onClick={() => onSelectNode(node.nodeId)}
                className={
                  selected
                    ? "w-full border border-eve-yellow bg-eve-yellow/20 px-3 py-3 text-left"
                    : "w-full border border-eve-yellow/30 bg-eve-black/70 px-3 py-3 text-left hover:border-eve-yellow/70"
                }
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm uppercase tracking-[0.12em] text-eve-offwhite">{node.name}</p>
                  <p className="font-mono text-xs uppercase tracking-[0.12em]" style={{ color: urgencyColor(displayFill) }}>
                    RISK {node.riskWeight.toFixed(2)}
                  </p>
                </div>
                <div className="relative mt-2 border border-eve-yellow/30 bg-eve-grey/80 p-1">
                  <div
                    className="h-2 transition-all duration-300"
                    style={{ width: `${fillPct}%`, backgroundColor: urgencyColor(displayFill) }}
                  />
                  {hasOptimistic ? (
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 border border-dashed border-eve-yellow/80"
                      style={{ width: `${fillPct}%` }}
                    />
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-eve-offwhite/80">
                  <span>FILL {fillPct}%</span>
                  {hasOptimistic ? (
                    <span className="font-mono uppercase tracking-[0.12em] text-eve-yellow/90">
                      OPTIMISTIC +{pendingPct}%
                    </span>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </TacticalPanel>
  );
}

export function ActionPanel({
  selectedNodeId,
  busy,
  interactionLocked = false,
  lockHint,
  onSubmitSupply,
  onRequestEscort,
  onReroute,
  onRefresh,
  onTick
}: ActionPanelProps) {
  const disabled = busy || interactionLocked;

  return (
    <TacticalPanel title="Action Panel" eyebrow="Main Controls">
      <p className="text-xs text-eve-offwhite/85">Target Node: {selectedNodeId ?? "NONE"}</p>
      {interactionLocked ? (
        <p className="mt-2 border border-eve-red/70 bg-eve-red/20 px-2 py-2 text-[11px] font-mono uppercase tracking-[0.12em] text-eve-offwhite">
          {lockHint ?? "ACTION LOCKED"}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2">
        <TacticalButton onClick={onSubmitSupply} disabled={!selectedNodeId || disabled}>
          Submit Supply Run
        </TacticalButton>
        <TacticalButton tone="ghost" onClick={onRequestEscort} disabled={!selectedNodeId || disabled}>
          Request Escort
        </TacticalButton>
        <TacticalButton tone="ghost" onClick={onReroute} disabled={disabled}>
          Re-route to Most Urgent
        </TacticalButton>
        <TacticalButton tone="ghost" onClick={onRefresh} disabled={disabled}>
          Refresh Snapshot
        </TacticalButton>
        <TacticalButton tone="ghost" onClick={onTick} disabled={disabled}>
          Tick +10s
        </TacticalButton>
      </div>
    </TacticalPanel>
  );
}

export function EventFeed({ events, rejections = [], optimisticPatches = [] }: EventFeedProps) {
  const visibleEvents = events.slice(0, 10);
  const visibleRejections = rejections.slice(0, 6);

  return (
    <TacticalPanel title="Event Feed" eyebrow="LIVE">
      <ul className="space-y-2 text-xs text-eve-offwhite/85">
        {optimisticPatches.map((patch) => (
          <li key={patch.id} className="border border-dashed border-eve-yellow/70 bg-eve-yellow/10 px-2 py-2">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">
              {patch.status === "pending" ? "optimistic_pending" : "optimistic_reverted"}
            </p>
            <p className="mt-1 break-all text-eve-offwhite/75">
              {patch.nodeId} // +{Math.round(patch.fillDelta * 100)}% fill preview
            </p>
          </li>
        ))}

        {visibleEvents.length === 0 && visibleRejections.length === 0 && optimisticPatches.length === 0 ? (
          <li>STANDBY // NO SCORE EVENTS</li>
        ) : null}

        {visibleEvents.map((event) => (
          <li key={event.id} className="border border-eve-yellow/25 bg-eve-black/70 px-2 py-2">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">
              score_event // {event.memberName}
            </p>
            <p className="mt-1 break-all text-eve-offwhite/75">
              {event.assemblyId} // +{event.score.toFixed(2)} pts // tx={event.txDigest}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-eve-offwhite/70">
              delta={event.fuelDelta} × urgency={event.urgencyWeight.toFixed(1)} × panic={event.panicMultiplier.toFixed(1)}
            </p>
          </li>
        ))}

        {visibleRejections.map((audit) => (
          <li key={audit.id} className="border border-eve-red/60 bg-eve-red/10 px-2 py-2">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-red">filter_rejected</p>
            <p className="mt-1 break-all text-eve-offwhite/75">
              reason={audit.reason} // wallet={audit.senderWallet} // tx={audit.txDigest}
            </p>
          </li>
        ))}
      </ul>
    </TacticalPanel>
  );
}

export function ScoreBoard({ scoreBoard, myScore }: ScoreBoardProps) {
  return (
    <TacticalPanel title="Score Board" eyebrow="Team + Personal (On-chain Projection)">
      <div className="grid gap-3 text-sm text-eve-offwhite/90">
        {!scoreBoard ? (
          <p className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2 text-xs">
            WAITING FOR ACCEPTED SCORE EVENTS
          </p>
        ) : null}

        {myScore ? (
          <div className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2 text-xs">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">My Contribution</p>
            <p className="mt-1">
              {myScore.name} // {myScore.personalScore.toFixed(2)} pts // {(myScore.contributionRatio * 100).toFixed(1)}%
            </p>
          </div>
        ) : null}

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Team Score</p>
          <ul className="mt-2 space-y-1 text-sm text-eve-offwhite/85">
            {!scoreBoard || scoreBoard.teams.length === 0 ? <li>NO TEAMS JOINED</li> : null}
            {scoreBoard?.teams.map((team, teamIndex) => (
              <li key={team.teamId} className="border border-eve-yellow/20 bg-eve-black/70 px-2 py-2">
                <p className="flex items-center justify-between">
                  <span>
                    #{teamIndex + 1} {team.teamName}
                  </span>
                  <span className="font-mono">{team.totalScore.toFixed(2)}</span>
                </p>
                <ul className="mt-1 space-y-1 text-xs text-eve-offwhite/75">
                  {team.members.map((member) => (
                    <li key={`${team.teamId}_${member.walletAddress}`} className="flex items-center justify-between">
                      <span>{member.name}</span>
                      <span className="font-mono">
                        {member.personalScore.toFixed(2)} ({(member.contributionRatio * 100).toFixed(1)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TacticalPanel>
  );
}

export function SprintAlert({ status, remainingSec, isPanic }: SprintAlertProps) {
  const panicActive = isPanic || status === "panic";
  const alertClass = panicActive
    ? "border border-eve-red bg-eve-red/20 px-3 py-2 animate-pulse"
    : "border border-eve-yellow/30 bg-eve-black/60 px-3 py-2";

  return (
    <TacticalPanel title="Panic Signal" eyebrow="Last 90 Seconds">
      <div className={alertClass}>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">
          {panicActive ? "PANIC MODE ACTIVE // SCORE x1.5" : "PANIC LOCKED"}
        </p>
        <p className={panicActive ? "mt-1 text-lg font-mono text-eve-red" : "mt-1 text-sm text-eve-offwhite/85"}>
          T-{remainingSec}s
        </p>
        <p className="mt-1 text-xs text-eve-offwhite/80">{statusDescription(status)}</p>
      </div>
    </TacticalPanel>
  );
}
