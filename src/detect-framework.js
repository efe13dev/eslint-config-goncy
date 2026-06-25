import fs from "fs";

function readPackageJson(cwd = process.cwd()) {
  const pkgPath = `${cwd}/package.json`;

  if (!fs.existsSync(pkgPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Detecta el framework del proyecto a partir de dependencias y archivos de configuración.
 * Retorna "nextjs" | "vite" | "backend-ts" | null.
 */
export function detectFramework(cwd = process.cwd()) {
  const pkg = readPackageJson(cwd);
  const allDeps = {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  };

  const hasDep = (name) => Boolean(allDeps[name]);

  const hasNextConfig =
    fs.existsSync(`${cwd}/next.config.js`) ||
    fs.existsSync(`${cwd}/next.config.mjs`) ||
    fs.existsSync(`${cwd}/next.config.ts`);

  const hasViteConfig =
    fs.existsSync(`${cwd}/vite.config.js`) ||
    fs.existsSync(`${cwd}/vite.config.mjs`) ||
    fs.existsSync(`${cwd}/vite.config.ts`);

  const hasTsconfig = fs.existsSync(`${cwd}/tsconfig.json`);

  const candidates = new Set();

  if (hasDep("next") || hasNextConfig) candidates.add("nextjs");

  if (
    hasDep("vite") ||
    hasViteConfig ||
    hasDep("@vitejs/plugin-react") ||
    hasDep("@vitejs/plugin-react-swc")
  ) {
    candidates.add("vite");
  }

  if (
    hasTsconfig &&
    (hasDep("typescript") || hasDep("@types/node") || hasDep("ts-node") || hasDep("tsx"))
  ) {
    candidates.add("backend-ts");
  }

  // Prioridad: nextjs > vite > backend-ts
  if (candidates.has("nextjs")) return "nextjs";
  if (candidates.has("vite")) return "vite";
  if (candidates.has("backend-ts")) return "backend-ts";

  return null;
}
