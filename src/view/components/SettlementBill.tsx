import type { SettlementBill } from "@/types/settlement";
import { TacticalPanel } from "@/view/components/TacticalPanel";

interface SettlementBillProps {
  bill: SettlementBill;
}

function money(value: number) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} LUX`;
}

function percent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export function SettlementBill({ bill }: SettlementBillProps) {
  return (
    <div className="grid gap-4">
      <TacticalPanel title="Settlement Ledger" eyebrow="Gross -> Fee -> Payout">
        <div className="overflow-hidden border border-eve-red/15 bg-[#080808]/75">
          <table className="w-full border-collapse text-left text-sm text-eve-offwhite/90">
            <thead className="bg-[#1a1a1a]/90 text-xs uppercase tracking-[0.16em] text-eve-red">
              <tr>
                <th className="border-b border-eve-red/20 px-3 py-2">Field</th>
                <th className="border-b border-eve-red/20 px-3 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Match ID</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono">{bill.matchId}</td>
              </tr>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Status</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono uppercase">{bill.status}</td>
              </tr>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Gross Pool</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono text-eve-red">{money(bill.grossPool)}</td>
              </tr>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Platform Fee</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono">{money(bill.platformFee)}</td>
              </tr>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Payout Pool</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono text-eve-red">{money(bill.payoutPool)}</td>
              </tr>
              <tr>
                <td className="border-b border-eve-red/10 px-3 py-2">Result Hash</td>
                <td className="border-b border-eve-red/10 px-3 py-2 font-mono text-xs">{bill.resultHash}</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Settlement Tx</td>
                <td className="px-3 py-2 font-mono text-xs">{bill.settlementTx ?? "PENDING"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TacticalPanel>

      <TacticalPanel title="Team + Member Payouts" eyebrow="Two-Layer Distribution">
        <div className="space-y-3">
          {bill.teamBreakdown.length === 0 ? (
            <p className="text-xs text-eve-offwhite/70">NO TEAM SETTLEMENT DATA</p>
          ) : null}
          {bill.teamBreakdown.map((team) => (
            <section key={team.teamId} className="border border-eve-red/15 bg-[#080808]/75 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-eve-red">
                  #{team.rank} {team.teamName}
                </p>
                <p className="font-mono text-xs text-eve-offwhite/80">
                  Score {team.totalScore} | Ratio {percent(team.prizeRatio)} | Prize {money(team.prizeAmount)}
                </p>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-eve-offwhite/85">
                {team.members.map((member) => (
                  <li
                    key={`${team.teamId}-${member.walletAddress}`}
                    className="flex flex-wrap items-center justify-between gap-2 border border-eve-red/10 bg-[#1a1a1a]/80 px-2 py-1"
                  >
                    <span className="font-mono uppercase tracking-[0.08em]">{member.walletAddress}</span>
                    <span className="font-mono uppercase tracking-[0.08em] text-eve-red">{member.role}</span>
                    <span className="font-mono">SCORE {member.personalScore}</span>
                    <span className="font-mono">RATIO {percent(member.contributionRatio)}</span>
                    <span className="font-mono">{money(member.prizeAmount)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </TacticalPanel>
    </div>
  );
}
