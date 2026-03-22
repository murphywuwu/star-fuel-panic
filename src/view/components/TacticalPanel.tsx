import type { ReactNode } from "react";

interface TacticalPanelProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function TacticalPanel({ title, eyebrow, children, className }: TacticalPanelProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border border-eve-red/20 bg-[linear-gradient(180deg,rgba(42,42,42,0.96)_0%,rgba(26,26,26,0.96)_100%)] p-4 shadow-[0_0_0_1px_rgba(255,95,0,0.05),0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-md",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-eve-red/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-eve-red via-eve-red/60 to-transparent" />
      {eyebrow ? <p className="relative text-[10px] font-black uppercase tracking-[0.32em] text-eve-red/90">{eyebrow}</p> : null}
      <h2 className="relative mt-1 text-sm font-black uppercase tracking-[0.18em] text-eve-offwhite">{title}</h2>
      <div className="relative mt-3">{children}</div>
    </section>
  );
}
