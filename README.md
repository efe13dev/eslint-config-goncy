 # eslint-falopa

CLI para configurar rápidamente ESLint + Prettier (Flat Config) en proyectos Next.js o Vite.
 
 Reglas de configuración inspiradas en Goncy.

## Uso rápido

Ejecuta el CLI en la raíz de tu proyecto con tu gestor preferido:

```bash
npx eslint-falopa
# o
pnpm dlx eslint-falopa
# o
yarn dlx eslint-falopa
# o
bunx eslint-falopa
```

El asistente te pedirá el framework (`nextjs` | `vite`) y hará la configuración automáticamente.

### Nota para proyectos Vite

Si tu proyecto fue creado con Vite, elimina el archivo `eslint.config.js` que Vite genera por defecto. Este CLI creará `eslint.config.mjs` (Flat Config).

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

