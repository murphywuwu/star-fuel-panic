#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(repoRoot, "src");

const allowedControllerModelImports = new Set([
  "src/controller/useAuthController.ts|@/model/authStore",
  "src/controller/useFuelMissionController.ts|@/model/fuelMissionStore",
  "src/controller/useMatchController.ts|@/model/fuelMissionStore",
  "src/controller/useMatchController.ts|@/model/scoreStore",
  "src/controller/useSettlementController.ts|@/model/fuelMissionStore",
  "src/controller/useSettlementController.ts|@/model/authStore",
  "src/controller/useSettlementController.ts|@/model/settlementStore"
]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(abs));
      continue;
    }
    if (abs.endsWith(".ts") || abs.endsWith(".tsx")) {
      files.push(abs);
    }
  }
  return files;
}

function layerOfFile(absPath) {
  const rel = path.relative(repoRoot, absPath).replace(/\\/g, "/");
  if (rel.startsWith("src/view/")) return "view";
  if (rel.startsWith("src/controller/")) return "controller";
  if (rel.startsWith("src/service/")) return "service";
  if (rel.startsWith("src/model/")) return "model";
  return "other";
}

function layerOfImport(specifier) {
  if (!specifier.startsWith("@/")) {
    return "external";
  }
  if (specifier.startsWith("@/view/")) return "view";
  if (specifier.startsWith("@/controller/")) return "controller";
  if (specifier.startsWith("@/service/")) return "service";
  if (specifier.startsWith("@/model/")) return "model";
  return "other";
}

function parseImports(content) {
  const pattern = /(?:import|export)\s+(?:[^"']+?\s+from\s+)?["']([^"']+)["']/g;
  const specs = [];
  for (const match of content.matchAll(pattern)) {
    specs.push(match[1]);
  }
  return specs;
}

const violations = [];

for (const file of walk(srcRoot)) {
  const rel = path.relative(repoRoot, file).replace(/\\/g, "/");
  const sourceLayer = layerOfFile(file);
  const content = fs.readFileSync(file, "utf8");

  for (const specifier of parseImports(content)) {
    const targetLayer = layerOfImport(specifier);
    const allowKey = `${rel}|${specifier}`;

    if (
      sourceLayer === "view" &&
      (specifier.includes("supabaseClient") || specifier.includes("/supabase/"))
    ) {
      violations.push(`${rel}: view layer cannot import Supabase client directly (${specifier})`);
      continue;
    }

    if (sourceLayer === "view" && (targetLayer === "service" || targetLayer === "model")) {
      violations.push(`${rel}: view -> ${targetLayer} is forbidden (${specifier})`);
      continue;
    }

    if (sourceLayer === "controller" && (targetLayer === "view" || targetLayer === "model")) {
      if (!allowedControllerModelImports.has(allowKey)) {
        violations.push(`${rel}: controller -> ${targetLayer} is forbidden (${specifier})`);
      }
      continue;
    }

    if (sourceLayer === "service" && (targetLayer === "view" || targetLayer === "controller")) {
      violations.push(`${rel}: service -> ${targetLayer} is forbidden (${specifier})`);
      continue;
    }

    if (sourceLayer === "model" && (targetLayer === "service" || targetLayer === "controller" || targetLayer === "view")) {
      violations.push(`${rel}: model -> ${targetLayer} is forbidden (${specifier})`);
      continue;
    }
  }
}

if (violations.length > 0) {
  console.error("[layer-lint] violations found:");
  for (const line of violations) {
    console.error(`- ${line}`);
  }
  process.exit(1);
}

console.log("[layer-lint] pass: import direction rules satisfied.");
