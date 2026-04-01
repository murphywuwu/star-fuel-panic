"use client";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = "PROCESSING..." }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 border border-eve-yellow/35 bg-[#1a1a1a] px-8 py-6 shadow-[0_0_40px_rgba(229,179,43,0.15)]">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-eve-yellow/20 border-t-eve-yellow" />
        </div>
        <p className="font-mono text-xs font-black uppercase tracking-[0.24em] text-eve-yellow">
          {message}
        </p>
      </div>
    </div>
  );
}
