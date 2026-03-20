"use client";

import {
  claimRewardHandler,
  enterRoleLockHandler,
  heartbeatTickHandler,
  lockRoleHandler,
  requestSettlementHandler,
  restartMatchHandler,
  startRelayHandler,
  submitBlueprintStepHandler,
  useScrapRelayControllerViewModel
} from "@/controller/scrapRelayController";
import { Role, RoomState } from "@/types/scrapRelay";
import { TacticalButton } from "@/view/components/TacticalButton";
import { useEffect, useMemo, useState } from "react";

const PLAYER_ID = "pilot-alpha";
const WALLET_ADDRESS = "0x8c71d4f1b8aa23990ff1bb4c14b7e1d6b0ca2db3";

type ScreenId = "S-001" | "S-002" | "S-003" | "S-004";
type UiStateKey =
  | "ROOM_LIST_LOADING"
  | "WALLET_DISCONNECTED"
  | "ROLE_LOCK_CONFLICT"
  | "STEP_BLOCKED"
  | "ILLEGAL_SUBMIT"
  | "SETTLEMENT_PENDING"
  | "SETTLEMENT_FAILED";

interface UiStateNotice {
  tone: "loading" | "warning" | "error";
  ariaLive: "polite" | "assertive";
  copy: string;
  nextAction: string;
}

const UI_STATE_NOTICE: Record<UiStateKey, UiStateNotice> = {
  ROOM_LIST_LOADING: {
    tone: "loading",
    ariaLive: "polite",
    copy: "正在同步可加入房间...",
    nextAction: "等待同步完成，或手动刷新列表"
  },
  WALLET_DISCONNECTED: {
    tone: "error",
    ariaLive: "assertive",
    copy: "钱包连接中断，无法继续入场（E_WALLET_DISCONNECTED）",
    nextAction: "点击重连钱包后重试"
  },
  ROLE_LOCK_CONFLICT: {
    tone: "error",
    ariaLive: "assertive",
    copy: "该职责已被占用，请在倒计时内重选",
    nextAction: "切换未占用角色后再次锁定职责"
  },
  STEP_BLOCKED: {
    tone: "warning",
    ariaLive: "polite",
    copy: "当前工序被阻塞：优先补齐关键材料",
    nextAction: "标记缺料并请求支援"
  },
  ILLEGAL_SUBMIT: {
    tone: "error",
    ariaLive: "assertive",
    copy: "提交失败：依赖未满足（E_BLUEPRINT_DEPENDENCY_UNMET）",
    nextAction: "查看可执行步骤后重新提交"
  },
  SETTLEMENT_PENDING: {
    tone: "loading",
    ariaLive: "polite",
    copy: "结算确认中，请勿重复提交",
    nextAction: "等待结算确认完成"
  },
  SETTLEMENT_FAILED: {
    tone: "error",
    ariaLive: "assertive",
    copy: "结算未完成，请按 requestId 重试或联系房主",
    nextAction: "检查错误码后重试结算"
  }
};

const ROOM_FEED = [
  {
    roomId: "SR-271",
    tier: "Practice",
    playerCount: 3,
    capacity: 8,
    entryFeeLux: 30,
    platformRakeBps: 600,
    hostRevshareBps: 3000,
    blueprintId: "bp-practice-a"
  },
  {
    roomId: "SR-809",
    tier: "Ranked",
    playerCount: 7,
    capacity: 8,
    entryFeeLux: 100,
    platformRakeBps: 1000,
    hostRevshareBps: 4000,
    blueprintId: "bp-ranked-c"
  },
  {
    roomId: "SR-990",
    tier: "Championship",
    playerCount: 8,
    capacity: 8,
    entryFeeLux: 180,
    platformRakeBps: 1200,
    hostRevshareBps: 5000,
    blueprintId: "bp-championship-e"
  }
] as const;

const ROLE_ORDER: Role[] = ["Miner", "Runner", "Assembler", "Guard"];
const ROLE_OCCUPANCY: Partial<Record<Role, string>> = {
  Runner: "pilot-delta",
  Guard: "pilot-echo"
};

const toScreenId = (roomState: RoomState): ScreenId => {
  if (roomState === "LobbyReady") {
    return "S-001";
  }
  if (roomState === "RoleLock") {
    return "S-002";
  }
  if (roomState === "Settled") {
    return "S-004";
  }
  return "S-003";
};

const formatLux = (value: number) => `${value.toLocaleString()} LUX`;

const shortWallet = (value: string) => `${value.slice(0, 8)}...${value.slice(-4)}`;

export function ScrapRelayDashboard() {
  const [message, setMessage] = useState("COMMAND LINK ONLINE");
  const [uiStateKey, setUiStateKey] = useState<UiStateKey | null>("ROOM_LIST_LOADING");
  const [roomListLoading, setRoomListLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOM_FEED[0].roomId);
  const [selectedRole, setSelectedRole] = useState<Role>("Miner");
  const [phaseCountdownSec, setPhaseCountdownSec] = useState(0);
  const [lastSettlementRequestId, setLastSettlementRequestId] = useState<string | null>(null);
  const [tabletPanel, setTabletPanel] = useState<"dag" | "contribution" | "bill">("dag");
  const viewModel = useScrapRelayControllerViewModel();
  const screenId = toScreenId(viewModel.roomState);
  const notice = uiStateKey ? UI_STATE_NOTICE[uiStateKey] : null;

  const selectedRoom = ROOM_FEED.find((room) => room.roomId === selectedRoomId) ?? ROOM_FEED[0];
  const myRole = viewModel.roleAssignments[PLAYER_ID] as Role | undefined;
  const roleCoverageRate = useMemo(() => {
    const covered = new Set(Object.values(viewModel.roleAssignments));
    return Math.round((covered.size / ROLE_ORDER.length) * 100);
  }, [viewModel.roleAssignments]);
  const executableSteps = useMemo(
    () =>
      viewModel.steps.filter(
        (step) => !step.completed && step.dependencySteps.every((dep) => viewModel.steps.find((item) => item.stepId === dep)?.completed)
      ),
    [viewModel.steps]
  );
  const blockedTop = viewModel.blockedSteps[0] ?? null;
  const playerPayout = viewModel.bill.memberPayouts.find((item) => item.playerId === PLAYER_ID);
  const rewardClaimed = viewModel.claimedPlayerIds.includes(PLAYER_ID);

  useEffect(() => {
    if (screenId !== "S-001") {
      return;
    }
    setUiStateKey("ROOM_LIST_LOADING");
    setRoomListLoading(true);
    const timer = window.setTimeout(() => {
      setRoomListLoading(false);
      setUiStateKey(walletConnected ? null : "WALLET_DISCONNECTED");
    }, 850);
    return () => window.clearTimeout(timer);
  }, [screenId, walletConnected]);

  useEffect(() => {
    if (!walletConnected) {
      setUiStateKey("WALLET_DISCONNECTED");
    } else if (uiStateKey === "WALLET_DISCONNECTED") {
      setUiStateKey(null);
    }
  }, [walletConnected, uiStateKey]);

  useEffect(() => {
    if (viewModel.roomState === "RoleLock") {
      setPhaseCountdownSec(30);
      return;
    }
    if (viewModel.roomState === "RelayRunning") {
      setPhaseCountdownSec(12 * 60);
      return;
    }
    if (viewModel.roomState === "Overtime") {
      setPhaseCountdownSec(90);
      return;
    }
    setPhaseCountdownSec(0);
  }, [viewModel.roomState]);

  useEffect(() => {
    if (viewModel.roomState !== "RoleLock" && viewModel.roomState !== "RelayRunning" && viewModel.roomState !== "Overtime") {
      return;
    }
    const timer = window.setInterval(() => {
      setPhaseCountdownSec((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [viewModel.roomState]);

  useEffect(() => {
    if (viewModel.roomState !== "RelayRunning" && viewModel.roomState !== "Overtime") {
      return;
    }
    const timer = window.setInterval(() => {
      const result = heartbeatTickHandler();
      if (!result.ok || !result.data) {
        return;
      }
      if (result.data.blockedStep) {
        setUiStateKey("STEP_BLOCKED");
        setMessage(`BLOCKED STEP: ${result.data.blockedStep}`);
      } else if (uiStateKey === "STEP_BLOCKED") {
        setUiStateKey(null);
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [viewModel.roomState, uiStateKey]);

  const handleRefreshRooms = () => {
    setUiStateKey("ROOM_LIST_LOADING");
    setRoomListLoading(true);
    setMessage("ROOM FEED REFRESH REQUESTED");
    window.setTimeout(() => {
      setRoomListLoading(false);
      setUiStateKey(walletConnected ? null : "WALLET_DISCONNECTED");
      setMessage("ROOM FEED SYNCED");
    }, 700);
  };

  const handleEnterRoleLock = () => {
    if (!walletConnected) {
      setUiStateKey("WALLET_DISCONNECTED");
      setMessage("E_WALLET_DISCONNECTED // Wallet connection required");
      return;
    }
    const result = enterRoleLockHandler();
    if (!result.ok) {
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setUiStateKey(null);
    setMessage(`ROOM ${selectedRoom.roomId} READY // ENTER ROLE LOCK`);
  };

  const handleLockRole = () => {
    const occupiedBy = ROLE_OCCUPANCY[selectedRole];
    if (occupiedBy && occupiedBy !== PLAYER_ID) {
      setUiStateKey("ROLE_LOCK_CONFLICT");
      setMessage(`ROLE CONFLICT // ${selectedRole} occupied by ${occupiedBy}`);
      return;
    }

    const result = lockRoleHandler({
      playerId: PLAYER_ID,
      role: selectedRole,
      requestId: crypto.randomUUID()
    });
    if (!result.ok) {
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setUiStateKey(null);
    setMessage(`ROLE LOCKED // ${selectedRole.toUpperCase()}`);
  };

  const handleStartRelay = () => {
    if (!myRole) {
      setMessage("LOCK ROLE BEFORE RELAY START");
      return;
    }
    const result = startRelayHandler();
    if (!result.ok) {
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setUiStateKey(null);
    setMessage("RELAY RUNNING // EXECUTE BLUEPRINT");
  };

  const handleSubmitStep = () => {
    const step = executableSteps[0];
    if (!step) {
      setUiStateKey("STEP_BLOCKED");
      setMessage("NO EXECUTABLE STEP // PRIORITIZE BLOCK CLEAR");
      return;
    }

    const result = submitBlueprintStepHandler({
      playerId: PLAYER_ID,
      stepId: step.stepId,
      materials: [{ typeId: step.requiredTypeId, qty: step.requiredQty, sourceRef: "cargo-unit-alpha" }],
      requestId: crypto.randomUUID()
    });
    if (!result.ok) {
      if (result.error?.code === "E_BLUEPRINT_DEPENDENCY_UNMET" || result.error?.code === "E_MATERIAL_NOT_ALLOWED") {
        setUiStateKey("ILLEGAL_SUBMIT");
      }
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setUiStateKey(null);
    setMessage(`STEP COMMITTED // ${step.stepId}`);
  };

  const handleSettle = async () => {
    const requestId = crypto.randomUUID();
    setLastSettlementRequestId(requestId);
    setUiStateKey("SETTLEMENT_PENDING");
    setMessage("SETTLEMENT PIPELINE STARTED");

    await new Promise((resolve) => window.setTimeout(resolve, 320));

    const result = requestSettlementHandler({
      requestId,
      playerCount: 8,
      entryFeeLux: 100,
      platformRakeBps: 1000,
      hostRevshareBps: 4000,
      antiAbuseInput: {
        matchDurationSec: 420,
        repeatedRouteCount: 1,
        maxPlayerContributionRatio: 0.45,
        sameAddressClusterCount: 1
      }
    });
    if (!result.ok) {
      setUiStateKey("SETTLEMENT_FAILED");
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setUiStateKey(null);
    setMessage("SETTLEMENT LOCKED // MOVE TO DEBRIEF");
  };

  const handleTick = () => {
    const result = heartbeatTickHandler();
    if (!result.ok || !result.data) {
      setMessage("HEARTBEAT FAILED // RETRY");
      return;
    }
    if (result.data.blockedStep) {
      setUiStateKey("STEP_BLOCKED");
      setMessage(`BLOCKED STEP // ${result.data.blockedStep}`);
      return;
    }
    if (uiStateKey === "STEP_BLOCKED") {
      setUiStateKey(null);
    }
    setMessage(`HEARTBEAT OK // EXECUTABLE=${result.data.executableStepCount}`);
  };

  const handleClaimReward = () => {
    const result = claimRewardHandler({ playerId: PLAYER_ID, requestId: crypto.randomUUID() });
    if (!result.ok) {
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setMessage(`REWARD CLAIMED // tx=${lastSettlementRequestId ?? "n/a"}`);
  };

  const handleRestartMatch = () => {
    const result = restartMatchHandler();
    if (!result.ok) {
      setMessage(`${result.error?.code} // ${result.error?.message}`);
      return;
    }
    setSelectedRole("Miner");
    setUiStateKey("ROOM_LIST_LOADING");
    setRoomListLoading(true);
    setMessage("NEW MATCH PREPARATION STARTED");
  };

  const renderStateBanner = () => {
    if (!notice) {
      return null;
    }

    const toneClass =
      notice.tone === "error"
        ? "border-eve-red/80 bg-eve-red/20 text-eve-offwhite"
        : notice.tone === "warning"
          ? "border-eve-red/50 bg-eve-red/15 text-eve-offwhite"
          : "border-eve-yellow/60 bg-eve-yellow/15 text-eve-offwhite";

    return (
      <section
        aria-live={notice.ariaLive}
        className={`mx-4 mt-4 border-l-4 border px-4 py-3 text-xs sm:text-sm ${toneClass}`}
      >
        <p className="font-mono uppercase tracking-[0.12em]">{notice.copy}</p>
        <p className="mt-1 text-eve-offwhite/85">{notice.nextAction}</p>
      </section>
    );
  };

  const renderRoomFeed = () => {
    if (roomListLoading) {
      return (
        <ul className="space-y-2" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={`skeleton-${index}`} className="h-20 border border-eve-yellow/30 bg-eve-grey/50 animate-pulse" />
          ))}
        </ul>
      );
    }

    if (!ROOM_FEED.length) {
      return (
        <div className="border border-eve-yellow/30 bg-eve-black/80 p-4 text-sm">
          <p className="font-mono uppercase text-eve-yellow">暂无可加入房间</p>
          <p className="mt-1 text-eve-offwhite/80">创建房间以开始接力任务。</p>
        </div>
      );
    }

    return (
      <ul className="space-y-2" role="listbox" aria-label="Room feed">
        {ROOM_FEED.map((room) => {
          const isActive = room.roomId === selectedRoomId;
          return (
            <li key={room.roomId}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => setSelectedRoomId(room.roomId)}
                className={`w-full border p-3 text-left transition duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eve-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-eve-black ${
                  isActive
                    ? "border-eve-yellow bg-eve-yellow/10"
                    : "border-eve-yellow/30 bg-eve-black/70 hover:border-eve-yellow/70"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em]">
                  <span className="text-eve-yellow">{room.roomId}</span>
                  <span className="text-eve-offwhite/80">{room.tier}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-eve-offwhite/85">
                  <span>席位 {room.playerCount}/{room.capacity}</span>
                  <span>入场 {room.entryFeeLux} LUX</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderCommandLobby = () => (
    <section className="grid gap-4 xl:grid-cols-[7fr_5fr]">
      <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Room Feed</h2>
          <span className="font-mono text-[11px] text-eve-offwhite/75">S-001</span>
        </header>
        {renderRoomFeed()}
        <div className="mt-4 border border-eve-yellow/30 bg-eve-grey/50 p-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-eve-yellow">Ready Checklist</h3>
          <ul className="mt-2 space-y-1 text-xs text-eve-offwhite/85">
            <li>[{walletConnected ? "x" : " "}] 钱包连接已验证</li>
            <li>[x] 奖池与费率规则已确认</li>
            <li>[x] 蓝图模板已锁定（{selectedRoom.blueprintId}）</li>
          </ul>
        </div>
      </article>

      <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Economy Preview Bill</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-eve-offwhite/75">Buy-in</dt>
            <dd id="economy-buyin" tabIndex={0} aria-describedby="economy-formula-hint" className="font-mono text-eve-offwhite">
              {formatLux(selectedRoom.entryFeeLux)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-eve-offwhite/75">Platform Fee</dt>
            <dd id="economy-rake" tabIndex={0} aria-describedby="economy-formula-hint" className="font-mono text-eve-offwhite">
              {selectedRoom.platformRakeBps / 100}%
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-eve-offwhite/75">Host Revshare</dt>
            <dd id="economy-host" tabIndex={0} aria-describedby="economy-formula-hint" className="font-mono text-eve-offwhite">
              {selectedRoom.hostRevshareBps / 100}%
            </dd>
          </div>
        </dl>
        <p id="economy-formula-hint" className="mt-3 border border-eve-yellow/30 bg-eve-grey/50 p-2 text-xs text-eve-offwhite/80">
          {"gross_pool -> platform_fee -> host_fee -> payout_pool"}
        </p>
        <div className="mt-4 border border-eve-yellow/30 bg-eve-grey/50 p-3 text-xs text-eve-offwhite/85">
          <h3 className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Rule Snapshot</h3>
          <p className="mt-2">任务：按蓝图 DAG 完成采集、运输、组装接力。</p>
          <p>胜利：最先完成舰体，或超时后完工率最高。</p>
          <p>失败代价：越序与缺料会造成阻塞与奖励折损。</p>
        </div>
      </article>
    </section>
  );

  const renderRoleLock = () => (
    <section className="grid gap-4 xl:grid-cols-[7fr_5fr]">
      <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
        <header className="mb-4 grid gap-2 sm:grid-cols-3" aria-live={phaseCountdownSec <= 10 ? "assertive" : "polite"}>
          <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">RoleLock Timer</div>
            <div className="mt-1 font-mono text-lg text-eve-offwhite">{phaseCountdownSec}s</div>
          </div>
          <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">Coverage</div>
            <div className="mt-1 font-mono text-lg text-eve-offwhite">{roleCoverageRate}%</div>
          </div>
          <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">Material Gap</div>
            <div className="mt-1 text-sm text-eve-offwhite">{blockedTop ?? "ore-a pending"}</div>
          </div>
        </header>

        <fieldset role="radiogroup" aria-label="Role Matrix" className="grid gap-2 sm:grid-cols-2">
          {ROLE_ORDER.map((role) => {
            const occupiedBy = ROLE_OCCUPANCY[role];
            const occupied = Boolean(occupiedBy && occupiedBy !== PLAYER_ID);
            const selected = selectedRole === role;
            return (
              <label
                key={role}
                className={`cursor-pointer border p-3 transition duration-150 ease-linear ${
                  selected ? "border-eve-yellow bg-eve-yellow/10" : "border-eve-yellow/30 bg-eve-grey/40 hover:border-eve-yellow/70"
                }`}
              >
                <input
                  type="radio"
                  name="role-select"
                  value={role}
                  checked={selected}
                  onChange={() => setSelectedRole(role)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">{role}</span>
                  <span className="text-[11px] text-eve-offwhite/80">{occupied ? "已占位" : "可选择"}</span>
                </div>
                <p className="mt-1 text-xs text-eve-offwhite/75">
                  {occupied ? `占位者: ${occupiedBy}` : "职责可锁定，支持键盘选择"}
                </p>
              </label>
            );
          })}
        </fieldset>
      </article>

      <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Mission Brief</h2>
        <ol className="mt-3 space-y-2 text-xs text-eve-offwhite/85">
          {viewModel.steps.slice(0, 2).map((step) => (
            <li key={step.stepId} className="border border-eve-yellow/30 bg-eve-grey/50 p-2">
              <p className="font-mono uppercase text-eve-yellow">{step.stepId}</p>
              <p className="mt-1">需求材料: {step.requiredTypeId}</p>
              <p>数量: {step.requiredQty}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 border border-eve-red/40 bg-eve-red/10 p-2 text-xs text-eve-offwhite">
          越序提交会触发 `E_BLUEPRINT_DEPENDENCY_UNMET` 并阻断奖励倍率。
        </p>
      </article>
    </section>
  );

  const renderBlueprintCards = () => (
    <ul className="space-y-2">
      {viewModel.steps.map((step) => {
        const executable = executableSteps.some((item) => item.stepId === step.stepId);
        const blocked = viewModel.blockedSteps.includes(step.stepId);
        const status = step.completed ? "完成" : executable ? "可执行" : blocked ? "阻塞" : "待解锁";
        const statusClass = step.completed
          ? "border-eve-yellow/70 bg-eve-yellow/10 text-eve-offwhite"
          : blocked
            ? "border-eve-red/70 bg-eve-red/10 text-eve-offwhite"
            : executable
              ? "border-eve-yellow/50 bg-eve-grey/70 text-eve-offwhite"
              : "border-eve-yellow/25 bg-eve-black/70 text-eve-offwhite/80";
        return (
          <li key={step.stepId} className={`border p-3 ${statusClass}`}>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.12em]">
              <span>{step.stepId}</span>
              <span>{status}</span>
            </div>
            <p className="mt-2 text-xs">材料: {step.requiredTypeId}</p>
            <p className="text-xs">数量: {step.requiredQty}</p>
          </li>
        );
      })}
    </ul>
  );

  const renderTacticalConsole = () => (
    <section className="space-y-4">
      <header className="grid gap-2 sm:grid-cols-3">
        <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">Stage</div>
          <div className="mt-1 font-mono text-sm text-eve-offwhite">{viewModel.roomState}</div>
        </div>
        <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">Countdown</div>
          <div className="mt-1 font-mono text-sm text-eve-offwhite">{phaseCountdownSec}s</div>
        </div>
        <div className="border border-eve-yellow/30 bg-eve-grey/60 p-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-eve-yellow">Blocked Top1</div>
          <div className="mt-1 text-sm text-eve-offwhite">{blockedTop ?? "none"}</div>
        </div>
      </header>

      <div className="hidden gap-2 md:flex xl:hidden">
        <TacticalButton intent={tabletPanel === "dag" ? "primary" : "secondary"} onClick={() => setTabletPanel("dag")} className="flex-1">
          DAG
        </TacticalButton>
        <TacticalButton
          intent={tabletPanel === "contribution" ? "primary" : "secondary"}
          onClick={() => setTabletPanel("contribution")}
          className="flex-1"
        >
          Contribution
        </TacticalButton>
        <TacticalButton intent={tabletPanel === "bill" ? "primary" : "secondary"} onClick={() => setTabletPanel("bill")} className="flex-1">
          Bill
        </TacticalButton>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <article className={`border border-eve-yellow/30 bg-eve-black/85 p-4 ${tabletPanel === "dag" ? "block" : "hidden"} xl:block`}>
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Blueprint DAG Board</h2>
          <div className="mt-3">{renderBlueprintCards()}</div>
        </article>

        <article
          className={`border border-eve-yellow/30 bg-eve-black/85 p-4 ${tabletPanel === "contribution" ? "block" : "hidden"} xl:block`}
        >
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Contribution & Audit</h2>
          <ul className="mt-3 space-y-2 text-xs text-eve-offwhite/85">
            {Object.entries(viewModel.contributionByPlayer).length === 0 && <li className="border border-eve-yellow/30 p-2">NO CONTRIBUTION DATA</li>}
            {Object.entries(viewModel.contributionByPlayer).map(([playerId, data]) => (
              <li key={playerId} className="border border-eve-yellow/30 p-2">
                <p className="font-mono uppercase text-eve-yellow">{playerId}</p>
                <p className="mt-1">
                  M{data.miningPoints} / H{data.haulingPoints} / A{data.assemblyPoints} / G{data.guardPoints}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border border-eve-yellow/30 bg-eve-grey/50 p-2 text-xs">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Audit Flags</p>
            <p className="mt-1 text-eve-offwhite/85">{viewModel.auditFlags.length ? viewModel.auditFlags.join(", ") : "NONE"}</p>
          </div>
        </article>

        <article className={`border border-eve-yellow/30 bg-eve-black/85 p-4 ${tabletPanel === "bill" ? "block" : "hidden"} xl:block`}>
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-eve-yellow">Material Commit Console</h2>
          <p className="mt-3 text-xs text-eve-offwhite/80">
            当前可执行步骤: {executableSteps[0]?.stepId ?? "无可执行步骤，优先清理阻塞工序"}
          </p>
          <ul className="mt-3 space-y-1 font-mono text-xs text-eve-offwhite/85">
            {viewModel.explainRows.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );

  const renderSettlementDebrief = () => (
    <section className="space-y-4">
      <header className="border border-eve-yellow/50 bg-eve-yellow/10 p-3">
        <h2 className="font-mono text-sm uppercase tracking-[0.12em] text-eve-yellow">Settlement Debrief</h2>
        <p className="mt-1 text-xs text-eve-offwhite/85">复盘账单与贡献，确认奖励分配后可立即再开局。</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[6fr_6fr]">
        <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Settlement Waterfall</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse text-xs text-eve-offwhite">
              <thead>
                <tr className="border-b border-eve-yellow/40 text-left font-mono uppercase tracking-[0.12em] text-eve-yellow">
                  <th scope="col" className="px-2 py-2">Field</th>
                  <th scope="col" className="px-2 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-eve-yellow/20">
                  <th scope="row" className="px-2 py-2 font-medium">gross_pool</th>
                  <td className="px-2 py-2 font-mono">{formatLux(viewModel.bill.grossPool)}</td>
                </tr>
                <tr className="border-b border-eve-yellow/20">
                  <th scope="row" className="px-2 py-2 font-medium">platform_fee</th>
                  <td className="px-2 py-2 font-mono">{formatLux(viewModel.bill.platformFee)}</td>
                </tr>
                <tr className="border-b border-eve-yellow/20">
                  <th scope="row" className="px-2 py-2 font-medium">host_fee</th>
                  <td className="px-2 py-2 font-mono">{formatLux(viewModel.bill.hostFee)}</td>
                </tr>
                <tr>
                  <th scope="row" className="px-2 py-2 font-medium">payout_pool</th>
                  <td className="px-2 py-2 font-mono">{formatLux(viewModel.bill.payoutPool)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="border border-eve-yellow/30 bg-eve-black/85 p-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">Member Payout Grid</h3>
          <ul className="mt-3 space-y-2">
            {viewModel.bill.memberPayouts.length === 0 && (
              <li className="border border-eve-yellow/30 bg-eve-grey/50 p-2 text-xs text-eve-offwhite/80">Settlement Pending</li>
            )}
            {viewModel.bill.memberPayouts.map((item) => (
              <li key={item.playerId} className="border border-eve-yellow/30 bg-eve-grey/50 p-2">
                <p className="font-mono text-xs uppercase text-eve-yellow">{item.playerId}</p>
                <p className="mt-1 text-xs text-eve-offwhite">{formatLux(item.amount)}</p>
              </li>
            ))}
          </ul>
          <div aria-live="polite" className="mt-3 border border-eve-yellow/30 bg-eve-grey/50 p-2 text-xs text-eve-offwhite/85">
            领取状态: {rewardClaimed ? `已领取（tx ${lastSettlementRequestId ?? "n/a"}）` : "待领取"}
          </div>
        </article>
      </div>
    </section>
  );

  const renderScreen = () => {
    if (screenId === "S-001") {
      return renderCommandLobby();
    }
    if (screenId === "S-002") {
      return renderRoleLock();
    }
    if (screenId === "S-003") {
      return renderTacticalConsole();
    }
    return renderSettlementDebrief();
  };

  const renderActionRail = () => {
    if (screenId === "S-001") {
      return (
        <>
          <TacticalButton onClick={handleEnterRoleLock} className="w-full sm:w-auto">
            进入接力
          </TacticalButton>
          <TacticalButton intent="secondary" onClick={handleRefreshRooms} className="w-full sm:w-auto">
            刷新列表
          </TacticalButton>
          <TacticalButton
            intent={walletConnected ? "danger" : "secondary"}
            onClick={() => setWalletConnected((prev) => !prev)}
            className="w-full sm:w-auto"
          >
            {walletConnected ? "断开钱包(模拟)" : "重连钱包"}
          </TacticalButton>
        </>
      );
    }

    if (screenId === "S-002") {
      return (
        <>
          <TacticalButton onClick={handleLockRole} className="w-full sm:w-auto">
            锁定职责
          </TacticalButton>
          <TacticalButton intent="secondary" onClick={handleStartRelay} className="w-full sm:w-auto">
            启动接力
          </TacticalButton>
          <TacticalButton intent="secondary" onClick={() => setMessage("SUPPORT REQUEST DISPATCHED")} className="w-full sm:w-auto">
            请求补位
          </TacticalButton>
        </>
      );
    }

    if (screenId === "S-003") {
      return (
        <>
          <TacticalButton onClick={handleSubmitStep} className="w-full sm:w-auto">
            提交工序
          </TacticalButton>
          <TacticalButton intent="secondary" onClick={handleTick} className="w-full sm:w-auto">
            心跳刷新
          </TacticalButton>
          <TacticalButton intent="secondary" onClick={handleSettle} className="w-full sm:w-auto">
            发起结算
          </TacticalButton>
        </>
      );
    }

    return (
      <>
        <TacticalButton onClick={handleClaimReward} disabled={!playerPayout || rewardClaimed} className="w-full sm:w-auto">
          {rewardClaimed ? "奖励已领取" : "领取奖励"}
        </TacticalButton>
        <TacticalButton intent="secondary" onClick={handleRestartMatch} className="w-full sm:w-auto">
          再来一局
        </TacticalButton>
        <TacticalButton intent="secondary" onClick={() => setMessage("CHAIN TRACE VIEW REQUESTED")} className="w-full sm:w-auto">
          查看链上记录
        </TacticalButton>
      </>
    );
  };

  return (
    <main className="relative min-h-screen px-3 py-4 sm:px-4 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] flex-col border border-eve-yellow/40 bg-eve-black/80 backdrop-blur-[8px]">
        <header className="border-b border-eve-yellow/30 bg-eve-black/90 px-4 py-3">
          <div className="grid gap-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <h1 className="font-mono text-lg font-bold uppercase tracking-[0.14em] text-eve-yellow">Scrap Relay Console</h1>
              <p className="mt-1 text-xs text-eve-offwhite/80">Top Command Bar + Tactical Workspace + Bottom Action Rail</p>
            </div>
            <div className="border border-eve-yellow/30 bg-eve-grey/60 px-3 py-2 text-xs">
              <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Room State</p>
              <p className="mt-1 font-mono text-eve-offwhite">{viewModel.roomState}</p>
            </div>
            <div className="border border-eve-yellow/30 bg-eve-grey/60 px-3 py-2 text-xs">
              <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Network</p>
              <p className="mt-1 text-eve-offwhite">Devnet Sim</p>
            </div>
            <div className="border border-eve-yellow/30 bg-eve-grey/60 px-3 py-2 text-xs">
              <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">Wallet</p>
              <p className="mt-1 font-mono text-eve-offwhite">{walletConnected ? shortWallet(WALLET_ADDRESS) : "DISCONNECTED"}</p>
            </div>
          </div>
        </header>

        {renderStateBanner()}

        <section className="flex-1 overflow-y-auto px-4 py-4">{renderScreen()}</section>

        <footer className="border-t border-eve-yellow/30 bg-eve-black/90 px-4 py-3">
          <div className="mb-3 border border-eve-yellow/30 bg-eve-grey/50 p-2 text-xs text-eve-offwhite">
            <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">System Message</p>
            <p className="mt-1">{message}</p>
          </div>
          <div className="flex flex-wrap gap-2">{renderActionRail()}</div>
        </footer>
      </div>
    </main>
  );
}
