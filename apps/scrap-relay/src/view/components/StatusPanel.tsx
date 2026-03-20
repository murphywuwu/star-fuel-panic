import { ReactNode } from "react";

export function StatusPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border border-eve-yellow/40 bg-eve-black/85 p-4 backdrop-blur-sm">
      <header className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-eve-yellow">{label}</header>
      <div className="text-sm text-eve-offwhite">{children}</div>
    </section>
  );
}
