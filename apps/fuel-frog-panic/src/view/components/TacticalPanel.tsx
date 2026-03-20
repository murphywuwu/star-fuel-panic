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
    <section className={cn("border border-eve-yellow/40 bg-eve-grey/65 p-4 backdrop-blur-sm", className)}>
      {eyebrow ? <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-eve-yellow/90">{eyebrow}</p> : null}
      <h2 className="mt-1 font-mono text-sm font-bold uppercase tracking-[0.14em] text-eve-offwhite">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
