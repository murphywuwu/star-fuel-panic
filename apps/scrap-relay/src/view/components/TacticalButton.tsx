import { ButtonHTMLAttributes } from "react";

type TacticalIntent = "primary" | "secondary" | "danger";

type TacticalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: TacticalIntent;
};

const intentClassMap: Record<TacticalIntent, string> = {
  primary: "bg-eve-yellow text-black border-black hover:bg-eve-offwhite",
  secondary: "bg-eve-grey text-eve-offwhite border-eve-yellow/70 hover:bg-eve-black",
  danger: "bg-eve-red text-eve-offwhite border-black hover:bg-[#de4716]"
};

export function TacticalButton({ className = "", intent = "primary", ...rest }: TacticalButtonProps) {
  return (
    <button
      className={`border-r-4 border-b-4 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide transition duration-150 ease-linear active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eve-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-eve-black ${intentClassMap[intent]} ${className}`}
      {...rest}
    />
  );
}
