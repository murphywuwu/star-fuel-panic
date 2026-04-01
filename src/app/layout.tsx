import type { Metadata } from "next";
import { Toaster } from "sonner";
import { DAppKitClientProvider } from "@/app/DAppKitClientProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Fuel Panic",
  description: "Co-op fuel logistics arcade"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <DAppKitClientProvider>{children}</DAppKitClientProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(229, 179, 43, 0.35)",
              color: "#f5f5f0"
            },
            className: "font-mono text-xs uppercase tracking-wider"
          }}
        />
      </body>
    </html>
  );
}
