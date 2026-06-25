import fs from "fs";

/**
 * Detecta el gestor de paquetes del proyecto.
 * Primero busca lockfiles en el directorio actual,
 * luego recurre a npm_config_user_agent como fallback.
 */
export function detectPackageManager(cwd = process.cwd()) {
  if (fs.existsSync(`${cwd}/bun.lockb`) || fs.existsSync(`${cwd}/bun.lock`)) return "bun";
  if (fs.existsSync(`${cwd}/pnpm-lock.yaml`)) return "pnpm";
  if (fs.existsSync(`${cwd}/yarn.lock`)) return "yarn";
  if (fs.existsSync(`${cwd}/package-lock.json`)) return "npm";

  // Fallback: user-agent del proceso que invocó el CLI
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("yarn")) return "yarn";

  return "npm";
}
