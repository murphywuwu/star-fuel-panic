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
    return "border-eve-red/45 bg-eve-red/15 text-eve-offwhite hover:border-eve-red hover:bg-eve-red/25";
  }
  if (tone === "ghost") {
    return "border-eve-offwhite/20 bg-transparent text-eve-offwhite hover:border-eve-offwhite/40 hover:bg-eve-offwhite/5";
  }
  return "border-eve-red bg-eve-red text-black hover:bg-[#ffb599] hover:border-[#ffb599]";
}

export function TacticalButton({ tone = "primary", fullWidth = false, className, ...props }: TacticalButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.18em] transition duration-150 active:translate-x-px active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
        toneClass(tone),
        fullWidth && "w-full",
        "shadow-[0_0_0_1px_rgba(255,95,0,0.2)]",
        className
      )}
      {...props}
    />
  );
}
