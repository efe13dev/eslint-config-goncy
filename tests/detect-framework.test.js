import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { detectFramework } from "../src/detect-framework.js";

// Helper para mockear existsSync y readFileSync juntos
function mockProject({ files = [], deps = {}, devDeps = {} } = {}) {
  const pkg = JSON.stringify({ dependencies: deps, devDependencies: devDeps });

  vi.spyOn(fs, "existsSync").mockImplementation((p) => {
    if (p.endsWith("package.json")) return true;
    return files.some((f) => p.endsWith(f));
  });

  vi.spyOn(fs, "readFileSync").mockImplementation((p) => {
    if (p.endsWith("package.json")) return pkg;
    throw new Error("unexpected readFileSync");
  });
}

describe("detectFramework", () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("detecta nextjs por dependencia 'next'", () => {
    mockProject({ deps: { next: "14.0.0" } });
    expect(detectFramework()).toBe("nextjs");
  });

  it("detecta nextjs por next.config.mjs", () => {
    mockProject({ files: ["next.config.mjs"] });
    expect(detectFramework()).toBe("nextjs");
  });

  it("detecta vite por dependencia 'vite'", () => {
    mockProject({ devDeps: { vite: "5.0.0" } });
    expect(detectFramework()).toBe("vite");
  });

  it("detecta vite por vite.config.ts", () => {
    mockProject({ files: ["vite.config.ts"] });
    expect(detectFramework()).toBe("vite");
  });

  it("detecta vite por @vitejs/plugin-react", () => {
    mockProject({ devDeps: { "@vitejs/plugin-react": "4.0.0" } });
    expect(detectFramework()).toBe("vite");
  });

  it("detecta backend-ts por tsconfig.json + typescript", () => {
    mockProject({ files: ["tsconfig.json"], devDeps: { typescript: "5.0.0" } });
    expect(detectFramework()).toBe("backend-ts");
  });

  it("detecta backend-ts por tsconfig.json + @types/node", () => {
    mockProject({ files: ["tsconfig.json"], devDeps: { "@types/node": "20.0.0" } });
    expect(detectFramework()).toBe("backend-ts");
  });

  it("nextjs tiene prioridad sobre vite cuando ambos están presentes", () => {
    mockProject({
      deps: { next: "14.0.0" },
      devDeps: { vite: "5.0.0" },
    });
    expect(detectFramework()).toBe("nextjs");
  });

  it("nextjs tiene prioridad sobre backend-ts", () => {
    mockProject({
      deps: { next: "14.0.0" },
      files: ["tsconfig.json"],
      devDeps: { typescript: "5.0.0" },
    });
    expect(detectFramework()).toBe("nextjs");
  });

  it("vite tiene prioridad sobre backend-ts cuando ambos están presentes", () => {
    mockProject({
      devDeps: { vite: "5.0.0", typescript: "5.0.0" },
      files: ["tsconfig.json"],
    });
    expect(detectFramework()).toBe("vite");
  });

  it("retorna null si no detecta ningún framework", () => {
    mockProject();
    expect(detectFramework()).toBeNull();
  });

  it("retorna null si no hay package.json", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(detectFramework()).toBeNull();
  });
});
