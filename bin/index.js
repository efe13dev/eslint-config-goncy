#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import ora from "ora";

import { depsByFramework } from "../src/deps.js";
import { detectFramework } from "../src/detect-framework.js";
import { detectPackageManager } from "../src/detect-package-manager.js";
import { generateEslintConfig } from "../src/generate-config.js";

async function main() {
  console.log(chalk.bold.blue("\n🚀 Configurador ESLint personalizado\n"));

  const packageManager = detectPackageManager();
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
    const installCmd =
      {
        npm: "npm install -D",
        pnpm: "pnpm add -D",
        bun: "bun add -d",
        yarn: "yarn add -D",
      }[packageManager] || "npm install -D";

    execSync(`${installCmd} ${deps.join(" ")}`, { stdio: "inherit" });
    spinner.succeed("Dependencias instaladas correctamente");
  } catch {
    spinner.fail("Error instalando dependencias");
    process.exit(1);
  }

  // Crear archivo eslint.config.mjs (con confirmación si ya existe)
  const configPath = "eslint.config.mjs";
  if (fs.existsSync(configPath)) {
    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message: `Ya existe ${configPath}. ¿Sobreescribir?`,
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.yellow(`Se mantuvo el ${configPath} existente.`));
    } else {
      fs.writeFileSync(configPath, generateEslintConfig(framework));
      console.log(chalk.green(`Archivo ${configPath} sobreescrito con éxito`));
    }
  } else {
    try {
      fs.writeFileSync(configPath, generateEslintConfig(framework));
      console.log(chalk.green(`Archivo ${configPath} creado con éxito`));
    } catch {
      console.error(chalk.red(`Error creando el archivo ${configPath}`));
      process.exit(1);
    }
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
