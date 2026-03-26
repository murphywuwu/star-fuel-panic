#!/usr/bin/env node
import { execFileSync } from "node:child_process";

const baseArgs = [
  "--experimental-strip-types",
  "--import",
  "./scripts/register-test-loader.mjs",
  "--test",
  "--test-concurrency=1"
];

const testFiles = [
  "src/app/api/__tests__/f007-discovery-routes.test.ts",
  "src/app/api/__tests__/f007-match-flow.test.ts",
  "src/service/locationService.test.ts"
];

for (const testFile of testFiles) {
  console.log(`> node ${[...baseArgs, testFile].join(" ")}`);
  execFileSync("node", [...baseArgs, testFile], {
    stdio: "inherit"
  });
}

console.log("[f007] all targeted checks passed.");
