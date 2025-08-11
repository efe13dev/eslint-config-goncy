 # eslint-falopa

CLI para configurar rápidamente ESLint + Prettier (Flat Config) en proyectos Next.js o Vite.

## Características

- Configuración Flat de ESLint en `eslint.config.mjs`.
- Integración con Prettier y `prettier-plugin-tailwindcss`.
- Reglas recomendadas para TypeScript y Next.js (opcional).
- Orden de imports con `eslint-plugin-import`.
- Detección automática del gestor de paquetes (`npm`, `pnpm`, `yarn`, `bun`).
- Añade script `lint` a `package.json`.

## Requisitos

- Node.js 18+ recomendado.
- Un gestor de paquetes: npm, pnpm, yarn o bun.

## Instalación y uso

Puedes ejecutar el CLI directamente desde el repositorio o publicarlo como paquete.

### Ejecutar localmente (recomendado durante el desarrollo)

1. Instala dependencias del propio CLI (si las hubiera) y asegúrate de tener Node 18+.
2. En la raíz de tu proyecto (el que quieres configurar), ejecuta:

```bash
node ./bin/index.js
```

El asistente te preguntará el framework: `nextjs` o `vite`.

### Uso como comando global (cuando se publique)

Para exponer un comando global (p. ej. `eslint-falopa`), añade el campo `bin` al `package.json` del CLI y publícalo en npm:

```json
{
  "name": "eslint-falopa",
  "version": "1.0.0",
  "bin": {
    "eslint-falopa": "bin/index.js"
  }
}
```

Luego podrás ejecutar:

```bash
npx eslint-falopa
# o
pnpm dlx eslint-falopa
# o
yarn dlx eslint-falopa
```

## ¿Qué hace el CLI?

1. Detecta tu gestor de paquetes.
2. Te pide elegir framework (`nextjs` | `vite`).
3. Instala dependencias según el framework elegido.
4. Crea/reescribe `eslint.config.mjs` con una configuración flat moderna.
5. Añade el script `"lint": "eslint ."` a `package.json` si existe.

## Frameworks soportados y dependencias

- nextjs:
  - `eslint`, `@eslint/compat`, `@next/eslint-plugin-next`, `eslint-config-next`,
    `eslint-config-prettier`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`,
    `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-react-compiler`,
    `eslint-plugin-react-hooks`, `prettier`, `prettier-plugin-tailwindcss`,
    `typescript`, `typescript-eslint`.

- vite (React + TS):
  - `eslint`, `@eslint/compat`, `eslint-config-prettier`, `eslint-plugin-import`,
    `eslint-plugin-jsx-a11y`, `eslint-plugin-prettier`, `eslint-plugin-react`,
    `eslint-plugin-react-hooks`, `prettier`, `prettier-plugin-tailwindcss`,
    `typescript`, `typescript-eslint`.

## Configuración generada (resumen)

- Ignora: `node_modules`, `.next`, `out`, `coverage`, `.idea`.
- Base TypeScript: `typescript-eslint` recomendado.
- Next.js: reglas `@next/eslint-plugin-next` (core-web-vitals) cuando aplica.
- Reglas generales útiles: `padding-line-between-statements`, `no-console` (permite `console.error`).
- TypeScript: ajustes pragmáticos (p. ej. `no-unused-vars` en warn con `_` ignorados).
- Imports: `import/order` con grupos y `@/*` como path group.
- Prettier: integra reglas con opciones (printWidth 100, trailingComma all, etc.) y `prettier-plugin-tailwindcss`.
- Globals: mezcla de `browser`, `serviceworker` y `node`.

## Cómo ejecutar el lint

Tras la configuración, puedes ejecutar:

```bash
npm run lint
# o el equivalente en tu gestor de paquetes
```

## Personalización

- Edita `eslint.config.mjs` para ajustar reglas a tu equipo.
- Puedes cambiar severidades (`off` | `warn` | `error`) y añadir más plugins si los necesitas.

## Solución de problemas

- Si ves errores al instalar dependencias, verifica tu gestor de paquetes y la conexión.
- Asegúrate de ejecutar el CLI desde la raíz del proyecto que quieres configurar (donde está `package.json`).
- Si ya tienes `eslint.config.mjs`, se sobrescribirá. Haz un backup si necesitas conservarlo.

## Licencia

ISC

