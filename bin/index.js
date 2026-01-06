#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import ora from "ora";

const depsByFramework = {
  nextjs: [
    "eslint",
    "@eslint/compat",
    "@next/eslint-plugin-next",
    "eslint-config-next",
    "eslint-config-prettier",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-prettier",
    "eslint-plugin-react",
    "eslint-plugin-react-compiler",
    "eslint-plugin-react-hooks",
    "prettier",
    "prettier-plugin-tailwindcss",
    "typescript",
    "typescript-eslint",
    "globals",
  ],
  vite: [
    "eslint",
    "@eslint/compat",
    "eslint-config-prettier",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-prettier",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks",
    "prettier",
    "prettier-plugin-tailwindcss",
    "typescript",
    "typescript-eslint",
    "globals",
  ],
  "backend-ts": [
    "eslint",
    "@eslint/compat",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint-config-prettier",
    "eslint-config-semistandard",
    "eslint-plugin-import",
    "eslint-plugin-n",
    "eslint-plugin-prettier",
    "eslint-plugin-promise",
    "globals",
    "prettier",
    "typescript",
  ],
};

function buildEslintConfigContent(framework) {
  const isNext = framework === "nextjs";
  const isBackend = framework === "backend-ts";

  if (isNext) {
    return `import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginImport from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // Ignorar carpetas
  {
    ignores: ["node_modules", ".next", "out", "coverage", ".idea"],
  },

  // Base: Next.js + TypeScript
  ...tseslint.configs.recommended,
  // Next.js reglas recomendadas (flat config)
  {
    plugins: { "@next/next": nextPlugin },
    rules: { ...nextPlugin.configs["core-web-vitals"].rules },
  },

  // Reglas generales
  {
    rules: {
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: ["return", "export"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "no-console": ["warn", { allow: ["error"] }],
    },
  },

  // TypeScript: ajustes
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_.*?$",
          caughtErrorsIgnorePattern: "^_.*?$",
        },
      ],
    },
  },

  // Imports
  {
    plugins: {
      import: fixupPluginRules(eslintPluginImport),
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/*",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
    },
  },

  // Prettier + Tailwind
  eslintPluginPrettier,
  {
    rules: {
      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
          plugins: ["prettier-plugin-tailwindcss"],
        },
      ],
    },
  },

  // Configuración global de entorno
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.node,
      },
    },
  },
];
`;
  }

  if (isBackend) {
    return `import { fixupPluginRules } from "@eslint/compat";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import semistandard from "eslint-config-semistandard";
import importPlugin from "eslint-plugin-import";
import nPlugin from "eslint-plugin-n";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import promisePlugin from "eslint-plugin-promise";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", "dist", "coverage", ".idea"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Lint con información de tipos
        project: ["./tsconfig.json"],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.serviceworker, // fetch, Request, Response
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: fixupPluginRules(importPlugin),
      n: nPlugin,
      promise: promisePlugin,
    },
    rules: {
      ...semistandard.rules,

      // Adaptaciones para TS
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_.*?$",
          caughtErrorsIgnorePattern: "^_.*?$",
        },
      ],
      // TS adicional
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],

      // Desactivar reglas de ESLint que chocan con TS
      "no-unused-vars": "off",
      "no-undef": "off",

      // Estilo: líneas en blanco entre declaraciones
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: ["return", "export"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],

      // Console: permitir solo errores
      "no-console": ["warn", { allow: ["error"] }],

      // Orden de imports
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/*",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
      "import/no-duplicates": "warn",
      "import/newline-after-import": ["warn", { count: 1 }],
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.ts",
            "**/*.spec.ts",
            "drizzle.config.ts",
            "eslint.config.mjs",
            "bunfig.toml",
          ],
        },
      ],

      // Promesas
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",

      // Node
      "n/no-missing-import": "off", // TS resuelve imports
      "n/no-process-exit": "warn",
      "n/shebang": "off",
      "n/no-unsupported-features/es-syntax": "off",
    },
  },
  // Prettier recomendado (añade la regla prettier/prettier)
  prettierRecommended,
  // Ajustes de Prettier del proyecto
  {
    rules: {
      // Configuración de Prettier centralizada en ESLint
      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],
    },
  },
  // Desactivar reglas en conflicto con Prettier
  eslintConfigPrettier,
];
`;
  }

  // Vite (React + TS) — sin Next.js
  return `import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginImport from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";

export default [
  // Ignorar carpetas
  {
    ignores: ["node_modules", "dist", "coverage", ".idea"],
  },

  // Base: TypeScript recomendado
  ...tseslint.configs.recommended,

  // Reglas generales
  {
    rules: {
      "padding-line-between-statements": [
        "warn",
        { blankLine: "always", prev: "*", next: ["return", "export"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      ],
      "no-console": ["warn", { allow: ["error"] }],
    },
  },

  // TypeScript: ajustes
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_.*?$",
          caughtErrorsIgnorePattern: "^_.*?$",
        },
      ],
    },
  },

  // Imports
  {
    plugins: {
      import: fixupPluginRules(eslintPluginImport),
    },
    rules: {
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/*",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
    },
  },

  // Prettier + Tailwind
  eslintPluginPrettier,
  {
    rules: {
      "prettier/prettier": [
        "warn",
        {
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
          plugins: ["prettier-plugin-tailwindcss"],
        },
      ],
    },
  },

  // Configuración global de entorno
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.node,
      },
    },
  },
];
`;
}

function detectarGestorPaquetes() {
  const userAgent = process.env.npm_config_user_agent || "";

  if (userAgent.startsWith("pnpm")) return "pnpm";
  if (userAgent.startsWith("bun")) return "bun";
  if (userAgent.startsWith("yarn")) return "yarn";
  return "npm";
}

function readPackageJson() {
  const pkgPath = "package.json";

  if (!fs.existsSync(pkgPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return null;
  }
}

function detectFramework() {
  const pkg = readPackageJson();
  const allDeps = {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  };

  const hasDep = (name) => Boolean(allDeps[name]);

  const hasNextConfig =
    fs.existsSync("next.config.js") ||
    fs.existsSync("next.config.mjs") ||
    fs.existsSync("next.config.ts");
  const hasViteConfig =
    fs.existsSync("vite.config.js") ||
    fs.existsSync("vite.config.mjs") ||
    fs.existsSync("vite.config.ts");
  const hasTsconfig = fs.existsSync("tsconfig.json");

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

  if (candidates.has("nextjs")) {
    candidates.delete("vite");
    candidates.delete("backend-ts");
  }

  if (candidates.has("vite")) {
    candidates.delete("backend-ts");
  }

  if (candidates.size === 1) return [...candidates][0];
  return null;
}

async function main() {
  console.log(chalk.bold.blue("\n🚀 Configurador ESLint personalizado\n"));

  const packageManager = detectarGestorPaquetes();
  console.log(chalk.green(`Detectado gestor de paquetes: ${packageManager}`));

  const detectedFramework = detectFramework();
  let framework = detectedFramework;

  if (framework) {
    console.log(chalk.green(`Framework detectado: ${framework}`));
  } else {
    const response = await inquirer.prompt({
      type: "list",
      name: "framework",
      message: "Selecciona el framework de tu proyecto",
      choices: ["nextjs", { name: "react-ts + vite", value: "vite" }, "backend-ts"],
      default: "nextjs",
    });
    framework = response.framework;
  }

  const spinner = ora("Instalando dependencias...").start();

  try {
    const deps = depsByFramework[framework];
    const installCmd = {
      npm: "npm install -D",
      pnpm: "pnpm add -D",
      bun: "bun add -d",
      yarn: "yarn add -D",
    }[packageManager] || "npm install -D";

    execSync(`${installCmd} ${deps.join(" ")}`, { stdio: "inherit" });

    spinner.succeed("Dependencias instaladas correctamente");
  } catch (e) {
    spinner.fail("Error instalando dependencias");
    process.exit(1);
  }

  // Crear archivo eslint.config.mjs
  try {
    fs.writeFileSync("eslint.config.mjs", buildEslintConfigContent(framework));
    console.log(chalk.green("Archivo eslint.config.mjs creado con éxito"));
  } catch (e) {
    console.error(chalk.red("Error creando el archivo eslint.config.mjs"));
    process.exit(1);
  }

  // Añadir script lint a package.json
  try {
    const pkgPath = "package.json";
    if (!fs.existsSync(pkgPath)) {
      console.warn(chalk.yellow("No se encontró package.json, no se agregó script lint."));
    } else {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.lint = "eslint .";
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(chalk.green("Script 'lint' agregado a package.json"));
    }
  } catch {
    console.warn(chalk.yellow("No se pudo modificar package.json para añadir el script lint."));
  }

  console.log(chalk.bold.blue("\n🎉 ¡Configuración completada con éxito!\n"));
}

main();
