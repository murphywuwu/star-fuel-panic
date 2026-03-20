import type { ButtonHTMLAttributes } from "react";

type TacticalTone = "primary" | "ghost" | "danger";

interface TacticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: TacticalTone;
  fullWidth?: boolean;
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toneClass(tone: TacticalTone) {
  if (tone === "danger") {
    return "border-eve-red bg-eve-red/20 text-eve-offwhite hover:bg-eve-red/35";
  }
  if (tone === "ghost") {
    return "border-eve-yellow/60 bg-transparent text-eve-offwhite hover:border-eve-offwhite";
  }
  return "border-eve-yellow bg-eve-yellow text-eve-black hover:bg-eve-offwhite";
}

export function TacticalButton({ tone = "primary", fullWidth = false, className, ...props }: TacticalButtonProps) {
  return (
    <button
      className={cn(
        "border px-3 py-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] transition duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
        toneClass(tone),
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
