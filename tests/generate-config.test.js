import { describe, expect, it } from "vitest";

import { generateEslintConfig } from "../src/generate-config.js";

describe("generateEslintConfig", () => {
  it("genera config para nextjs con los imports correctos", () => {
    const config = generateEslintConfig("nextjs");
    expect(config).toContain("@next/eslint-plugin-next");
    expect(config).toContain("typescript-eslint");
    expect(config).toContain("prettier-plugin-tailwindcss");
    expect(config).toContain(".next");
  });

  it("genera config para vite con los imports correctos", () => {
    const config = generateEslintConfig("vite");
    expect(config).toContain("typescript-eslint");
    expect(config).toContain("prettier-plugin-tailwindcss");
    expect(config).not.toContain("@next/eslint-plugin-next");
    expect(config).toContain("dist");
  });

  it("genera config para backend-ts con los imports correctos", () => {
    const config = generateEslintConfig("backend-ts");
    expect(config).toContain("@typescript-eslint/eslint-plugin");
    expect(config).toContain("eslint-config-semistandard");
    expect(config).toContain("eslint-plugin-n");
    expect(config).not.toContain("prettier-plugin-tailwindcss");
  });

  it("genera vite por defecto para frameworks desconocidos", () => {
    const config = generateEslintConfig("unknown");
    expect(config).toContain("typescript-eslint");
    expect(config).not.toContain("@next/eslint-plugin-next");
  });

  it("el contenido generado es un string no vacío", () => {
    for (const fw of ["nextjs", "vite", "backend-ts"]) {
      const config = generateEslintConfig(fw);
      expect(typeof config).toBe("string");
      expect(config.length).toBeGreaterThan(0);
    }
  });

  it("todas las configs contienen export default", () => {
    for (const fw of ["nextjs", "vite", "backend-ts"]) {
      expect(generateEslintConfig(fw)).toContain("export default");
    }
  });
});
