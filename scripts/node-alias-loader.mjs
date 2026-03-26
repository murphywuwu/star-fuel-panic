import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = path.join(PROJECT_ROOT, "src");
const FILE_CANDIDATES = ["", ".ts", ".tsx", ".js", ".mjs"];

function resolveAliasPath(specifier) {
  const relativePath = specifier.slice(2);
  const basePath = path.join(SRC_ROOT, relativePath);

  for (const candidate of FILE_CANDIDATES) {
    const filePath = `${basePath}${candidate}`;
    if (existsSync(filePath)) {
      return filePath;
    }
  }

  for (const indexCandidate of ["index.ts", "index.tsx", "index.js", "index.mjs"]) {
    const filePath = path.join(basePath, indexCandidate);
    if (existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function resolveRelativePath(specifier, parentURL) {
  if (!parentURL?.startsWith("file:")) {
    return null;
  }

  const parentPath = fileURLToPath(parentURL);
  const basePath = path.resolve(path.dirname(parentPath), specifier);

  for (const candidate of FILE_CANDIDATES) {
    const filePath = `${basePath}${candidate}`;
    if (existsSync(filePath)) {
      return filePath;
    }
  }

  for (const indexCandidate of ["index.ts", "index.tsx", "index.js", "index.mjs"]) {
    const filePath = path.join(basePath, indexCandidate);
    if (existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

function hasKnownExtension(specifier) {
  return FILE_CANDIDATES.slice(1).some((extension) => specifier.endsWith(extension));
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context);
  }

  if (specifier.startsWith("@/")) {
    const resolvedPath = resolveAliasPath(specifier);
    if (resolvedPath) {
      return nextResolve(pathToFileURL(resolvedPath).href, context);
    }
  }

  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !hasKnownExtension(specifier)) {
    const resolvedPath = resolveRelativePath(specifier, context.parentURL);
    if (resolvedPath) {
      return nextResolve(pathToFileURL(resolvedPath).href, context);
    }
  }

  return nextResolve(specifier, context);
}
