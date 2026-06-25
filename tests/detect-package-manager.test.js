import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { detectPackageManager } from "../src/detect-package-manager.js";

describe("detectPackageManager", () => {
  beforeEach(() => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    delete process.env.npm_config_user_agent;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("detecta bun por bun.lockb", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("bun.lockb"));
    expect(detectPackageManager()).toBe("bun");
  });

  it("detecta bun por bun.lock", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("bun.lock"));
    expect(detectPackageManager()).toBe("bun");
  });

  it("detecta pnpm por pnpm-lock.yaml", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("pnpm-lock.yaml"));
    expect(detectPackageManager()).toBe("pnpm");
  });

  it("detecta yarn por yarn.lock", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("yarn.lock"));
    expect(detectPackageManager()).toBe("yarn");
  });

  it("detecta npm por package-lock.json", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("package-lock.json"));
    expect(detectPackageManager()).toBe("npm");
  });

  it("usa user-agent como fallback cuando no hay lockfile", () => {
    process.env.npm_config_user_agent = "pnpm/8.0.0 npm/? node/v20.0.0 linux x64";
    expect(detectPackageManager()).toBe("pnpm");
  });

  it("devuelve npm por defecto si no hay lockfile ni user-agent", () => {
    expect(detectPackageManager()).toBe("npm");
  });

  it("prioriza lockfile sobre user-agent", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((p) => p.endsWith("yarn.lock"));
    process.env.npm_config_user_agent = "pnpm/8.0.0 npm/? node/v20.0.0 linux x64";
    expect(detectPackageManager()).toBe("yarn");
  });
});
