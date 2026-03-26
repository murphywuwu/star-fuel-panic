import Link from "next/link";
import { useSettlementBillPanelController } from "@/controller/useSettlementBillPanelController";
import type { ControllerResult, PlayerContribution, SettlementBill } from "@/types/fuelMission";
import { TacticalButton } from "@/view/components/TacticalButton";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface SettlementBillPanelProps {
  settlementBill: SettlementBill;
  memberContributions: PlayerContribution[];
  onSettle: () => ControllerResult<SettlementBill>;
}

export function SettlementBillPanel({ settlementBill, memberContributions, onSettle }: SettlementBillPanelProps) {
  const controller = useSettlementBillPanelController({
    settlementBill,
    memberContributions,
    onSettle
  });
  const { view, actions } = controller;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <TacticalPanel title="Settlement Bill Panel" eyebrow="S-005 / IA-005" className="lg:col-span-2">
        <div className="overflow-hidden border border-eve-yellow/40 bg-eve-black/75">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-eve-grey/80 font-mono text-xs uppercase tracking-[0.12em] text-eve-yellow">
              <tr>
                <th className="border-b border-eve-yellow/30 px-3 py-2">Ledger Field</th>
                <th className="border-b border-eve-yellow/30 px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {view.rows.map((row) => (
                <tr key={row.label}>
                  <td className="border-b border-eve-yellow/20 px-3 py-2 text-eve-offwhite/85">{row.label}</td>
                  <td className="border-b border-eve-yellow/20 px-3 py-2 font-mono text-eve-offwhite">{view.money(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <TacticalButton onClick={actions.handleSettle}>Trigger Settlement</TacticalButton>
          <TacticalButton tone="ghost" onClick={actions.showAuditLog}>
            View Audit Log
          </TacticalButton>
          <TacticalButton tone="danger" onClick={actions.reportIssue}>
            Report Issue
          </TacticalButton>
        </div>

        <p className="mt-4 border border-eve-yellow/40 bg-eve-black/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em]">
          {view.message}
        </p>
      </TacticalPanel>

      <TacticalPanel title="Member Payouts" eyebrow="Settlement Detail">
        <p className="text-xs text-eve-offwhite/85">Settlement ID: {settlementBill.settlementId ?? "PENDING"}</p>
        <ul className="mt-3 space-y-2 text-xs text-eve-offwhite/90">
          {settlementBill.memberPayouts.length === 0 ? <li>SYNCING LEDGER...</li> : null}
          {view.memberRows.map((member) => (
            <li key={member.playerId} className="border border-eve-yellow/30 bg-eve-black/70 px-3 py-2">
              <p className="font-mono uppercase tracking-[0.12em] text-eve-yellow">
                {member.displayName}
              </p>
              <p className="mt-1">Payout: {member.displayAmount}</p>
            </li>
          ))}
        </ul>

        <Link
          href="/lobby"
          className="mt-4 inline-flex border border-eve-yellow bg-eve-yellow px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-eve-black transition hover:bg-eve-offwhite"
        >
          Confirm & Continue
        </Link>
      </TacticalPanel>
    </div>
  );
}
