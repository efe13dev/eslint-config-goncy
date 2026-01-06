 # eslint-config-goncy

CLI para configurar rápidamente ESLint + Prettier (Flat Config) en proyectos Next.js, Vite o backend-ts (Node/TypeScript).
 
 Reglas de configuración inspiradas en Goncy.



## Uso rápido

Ejecuta el CLI en la raíz de tu proyecto con tu gestor preferido:

```bash
npx eslint-config-goncy
# o
pnpm dlx eslint-config-goncy
# o
yarn dlx eslint-config-goncy
# o
bunx eslint-config-goncy
```

El CLI intentará detectar el framework automáticamente. Si no puede detectarlo (o es ambiguo), te pedirá que selecciones uno (`nextjs` | `vite` | `backend-ts`) y hará la configuración automáticamente.

### Nota para proyectos Vite

Si tu proyecto fue creado con Vite, elimina el archivo `eslint.config.js` que Vite genera por defecto. Este CLI creará `eslint.config.mjs` (Flat Config).

### Nota para proyectos backend-ts

- Asegúrate de tener un `tsconfig.json` en la raíz del proyecto; el preset usa lint con información de tipos (`parserOptions.project`).
- El preset apunta a entornos Node.js y también habilita APIs de `serviceworker` (para soportar `fetch`, `Request`, `Response` en runtimes tipo Bun/Workers si fuese necesario).

## Requisitos

- Node.js 18+.
- Un gestor de paquetes: npm, pnpm, yarn o bun.

## ¿Qué hace?

- Detecta tu gestor de paquetes.
- Instala las dependencias necesarias.
- Genera `eslint.config.mjs` con configuración Flat + Prettier.
- Añade el script `"lint": "eslint ."` a `package.json` si existe.

## Lint

```bash
npm run lint
```
## Licencia

ISC

