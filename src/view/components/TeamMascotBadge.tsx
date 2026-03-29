import Image from "next/image";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

interface TeamMascotBadgeProps {
  accentColor: string;
  mascotSrc: string;
  teamName: string;
  teamCode: string;
  unitTag: string;
  callsign: string;
  className?: string;
}

export function TeamMascotBadge({
  accentColor,
  mascotSrc,
  teamName,
  teamCode,
  unitTag,
  callsign,
  className
}: TeamMascotBadgeProps) {
  return (
    <div
      className={cn(
        "relative w-[4.25rem] overflow-hidden border bg-eve-black/95 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_20px_rgba(0,0,0,0.28)]",
        className
      )}
      style={{
        borderColor: `${accentColor}88`,
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:100%_4px] opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:8px_100%] opacity-20" />
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accentColor }} />
      <div
        className="absolute right-0 top-0 h-8 w-10 opacity-30"
        style={{ background: `linear-gradient(135deg, ${accentColor}88, transparent)` }}
      />

      <div className="relative flex items-center justify-between border-b border-eve-offwhite/10 px-2 py-1">
        <span
          className="border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-eve-offwhite"
          style={{ borderColor: `${accentColor}88`, color: accentColor }}
        >
          {teamCode}
        </span>
        <span className="max-w-[2.2rem] truncate font-mono text-[7px] uppercase tracking-[0.14em] text-eve-offwhite/60">
          {callsign}
        </span>
      </div>

      <div className="relative flex h-14 items-center justify-center px-2 py-1.5">
        <div
          className="absolute inset-2 border opacity-50"
          style={{ borderColor: `${accentColor}44` }}
        />
        <div
          className="absolute inset-x-3 inset-y-3 opacity-20"
          style={{ background: `radial-gradient(circle at center, ${accentColor}66, transparent 70%)` }}
        />
        <Image
          src={mascotSrc}
          alt={`${teamName} mascot`}
          width={44}
          height={44}
          className="relative z-10 h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]"
        />
      </div>

      <div className="relative border-t border-eve-offwhite/10 px-2 py-1.5">
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: accentColor }}
        />
        <span className="block pl-2 font-mono text-[8px] uppercase tracking-[0.2em] text-eve-offwhite/80">
          {unitTag}
        </span>
      </div>
    </div>
  );
}
