# koa-agent-cli — CLI Development Instructions

Este es un **CLI de Node.js** (`create-koa-agent`) que genera proyectos Angular pre-configurados
para ser operados por Claude Code como agente principal de desarrollo.

## Stack del CLI

- **Runtime**: Node.js 20+ con ES Modules (`"type": "module"`)
- **Dependencias**: inquirer (prompts), chalk (colores), ora (spinners)
- **Entry point**: `bin/index.js` (shebang `#!/usr/bin/env node`)
- **Comando global**: `create-koa-agent` (via `npm link`)

## Estructura del repositorio

```text
koa-agent-cli/
├── bin/
│   └── index.js              # CLI principal — inquirer prompts, scaffolding logic
├── templates/                 # TODO lo que se copia al proyecto generado
│   ├── .claude/               # Hooks, rules, skills, settings para el proyecto generado
│   │   ├── hooks/             # Pre/Post hooks de Claude Code (guardrails automáticos)
│   │   ├── rules/             # Reglas arquitectónicas (architecture, visual-system, etc.)
│   │   ├── skills/            # Skills invocables por Claude (/sync-indices, etc.)
│   │   ├── scripts/           # Post-edit prettier, etc.
│   │   ├── CLAUDE.md          # Instrucciones de Claude para el proyecto generado
│   │   └── settings.json      # Configuración de hooks del proyecto generado
│   ├── docs/                  # Documentación para humanos
│   ├── indices/               # Memoria viva del proyecto (Components, Services, DB, etc.)
│   ├── boilerplate/           # Código fuente Angular (solo se copia en Full Scaffold)
│   │   ├── src/               # app/, styles/, assets/
│   │   └── scripts/           # architect.js (linter AST)
│   ├── CLAUDE.md              # Stub raíz con @import (compatibilidad Claude.ai Projects)
│   ├── .mcp.json              # Supabase MCP server template
│   └── gitignore.template     # Se renombra a .gitignore al copiar
├── CLAUDE.md                  # ESTE archivo (instrucciones para desarrollar el CLI)
├── README.md                  # Docs públicos del CLI
└── package.json               # ESM, bin: create-koa-agent
```

## Regla fundamental

**`templates/` es la fuente de verdad.** Los archivos en la raíz del repo (`CLAUDE.md`, `.claude/`, `README.md`)
son para desarrollar el CLI. Los archivos en `templates/` son los que se copian al proyecto generado.
**Nunca duplicar** archivos de templates/ en la raíz.

## Convenciones de desarrollo

1. **ESM puro**: Usar `import`/`export`, no `require()`. El package.json tiene `"type": "module"`.
2. **Template variables**: Usar `{{PROJECT_NAME}}` en templates — `bin/index.js` los reemplaza con `injectVars()`.
3. **Dos modos de scaffolding**:
   - **Full Scaffold**: `ng new` + dependencias + todo de `templates/` + `templates/boilerplate/`
   - **Inject Only**: Solo copia `templates/` (sin boilerplate/) a la carpeta actual
4. **No tocar templates manualmente para probar**: Usa `node bin/index.js` o `create-koa-agent` para testear.

## Comandos

- Ejecutar CLI: `node bin/index.js`
- Instalar globalmente (dev): `npm link`
- Test mode: `TEST_MODE=inject node bin/index.js` o `TEST_MODE=full TEST_PROJECT_NAME=test node bin/index.js`

## Qué NO es este repo

Este repo **NO es** un proyecto Angular. No tiene `src/app/`, `ng serve`, ni componentes.
Las reglas de Angular, PrimeNG, Supabase, GSAP, OnPush, Facades, etc. aplican solo
dentro de `templates/` (que se copian a los proyectos generados).
