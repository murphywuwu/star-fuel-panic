import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
