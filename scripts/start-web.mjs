import { spawn } from "node:child_process";

const port = process.env.PORT?.trim() || "3010";
const host = process.env.HOST?.trim() || "0.0.0.0";
const pnpmBinary = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const child = spawn(pnpmBinary, ["exec", "next", "start", "-H", host, "-p", port], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
