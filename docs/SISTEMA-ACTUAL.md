# Documento del Sistema Actual — `koa-agent-cli` (Koa Agent Blueprint v5.1)

> Este documento describe **el sistema real que existe hoy en el repositorio**: qué es, qué hace y cómo lo hace.  
> Está basado en el código fuente del CLI (`bin/index.js`) y en las plantillas que el CLI inyecta (`templates/`), además del sistema de guardrails (`.claude/`) y el linter arquitectónico (`scripts/architect.js` dentro del boilerplate).

## 1) ¿Qué es este sistema?

`koa-agent-cli` es un **CLI en Node.js** (comando: `create-koa-agent`) cuyo propósito es **generar e inyectar un “Blueprint”** para proyectos *AI-Native*.

Ese Blueprint no es “solo un starter”: incluye un conjunto de **guardrails automáticos** (hooks y linting) y una **arquitectura estricta** para que un agente (Claude/otro) implemente features sin degradar el diseño del sistema.

En la práctica, este repositorio tiene dos “capas”:

- **Capa A — CLI (orquestador)**: el programa que ejecutas en tu máquina y que crea/provisiona un proyecto.
- **Capa B — Blueprint (plantillas)**: el conjunto de archivos que el CLI copia/inserta en el proyecto destino: `.claude/`, `docs/`, `indices/`, `.mcp.json`, y (si eliges scaffold completo) un boilerplate Angular en `src/` + `scripts/`.

## 2) ¿Qué hace?

El CLI ofrece **dos modos**:

### A) “Full Scaffold”

Crea un proyecto Angular nuevo y le inyecta el Blueprint completo (reglas + boilerplate de app).

**Acciones principales (alto nivel):**

- Crea un proyecto Angular con `npx @angular/cli@latest new ...` (standalone, routing, SCSS, sin tests y sin git).
- Instala dependencias de UI, animación y datos (PrimeNG, GSAP, Supabase, Tailwind v4, Lucide, animations async).
- Intenta inicializar Supabase localmente (`npx supabase init`) si está disponible.
- Inyecta archivos desde `templates/` (memoria + guardrails).
- Inyecta un boilerplate Angular desde `templates/boilerplate/src` hacia `src/` y scripts auxiliares hacia `scripts/`.
- Parchea configuración del proyecto para alinear Tailwind/PrimeNG, alias de paths y calidad de build.
- Agrega scripts npm orientados a workflows agénticos (`claude:*`) y un linter arquitectónico (`lint:arch`).

### B) “Solo inyectar Memoria Koa Blueprint”

No crea un Angular nuevo: simplemente **copia la “memoria”** (reglas, hooks, docs, índices, configuración MCP, etc.) dentro del directorio actual.

Esto sirve para “convertir” un proyecto existente a un proyecto con guardrails AI-Native (con las limitaciones obvias: no te crea automáticamente el boilerplate completo de `src/` si no ejecutas Full Scaffold).

## 3) ¿Cómo lo hace? (flujo detallado)

### 3.1 Punto de entrada del CLI

- **Binario**: `create-koa-agent`
- **Implementación**: `bin/index.js`
- **Dependencias CLI**: `inquirer` (prompts), `ora` (spinners), `chalk` (colores), Node `fs/path/spawn`.

El CLI:

- Muestra un banner.
- Pregunta si quieres Full Scaffold o solo inyección.
- Resuelve `TEMPLATES_DIR` como `../templates`.
- Ejecuta comandos (Angular CLI, npm install, supabase init) vía `spawn(..., { shell: true })`.
- Copia recursivamente archivos desde `templates/` al destino.

### 3.2 Inyección de plantillas (Blueprint)

La inyección tiene 2 fases:

#### Fase 1 — Copia de “memoria”

Se copia **todo** lo que haya en `templates/` excepto `templates/boilerplate/`.

Incluye típicamente:

- `CLAUDE.md` y `.claude/CLAUDE.md` (reglas/contrato del agente y del proyecto).
- `.claude/hooks/*` (guardrails ejecutados automáticamente en Claude Code).
- `.claude/rules/*` (reglas de arquitectura, modelos, base de datos, sistema visual, etc.).
- `.claude/skills/*` (skills internas para tareas comunes).
- `docs/*` (documentación del sistema: stack rules, hooks, brand guidelines, etc.).
- `indices/*` (la “memoria viva” que el agente debe mantener).
- `.mcp.json` (servidores MCP: TypeScript LSP, Angular CLI MCP, Supabase MCP).
- `.gitignore` (desde `gitignore.template`).

También realiza **sustitución de variables** en `CLAUDE.md`/`.claude/CLAUDE.md`:

- Reemplaza `{{PROJECT_NAME}}` por el nombre real del proyecto.

#### Fase 2 — Boilerplate Angular (solo si es Full Scaffold)

Cuando eliges Full Scaffold, además:

- Copia `templates/boilerplate/src/` a `src/` del proyecto nuevo.
- Copia `templates/boilerplate/scripts/` a `scripts/`.
- Copia `postcss.config.json` al root del proyecto (config Tailwind v4).

Luego parchea varios archivos del proyecto Angular generado:

- **`tsconfig.json`**: agrega `compilerOptions.baseUrl` y `paths`:
  - `@core/*` → `src/app/core/*`
  - `@shared/*` → `src/app/shared/*`
  - `@features/*` → `src/app/features/*`
  - `@layout/*` → `src/app/layout/*`
- **`angular.json`**:
  - inserta `src/tailwind.css` en la lista de styles.
  - desactiva `optimization.styles.inlineCritical` para evitar que el pipeline de CSS “pierda” utilidades en templates inline.
- **`src/index.html`**: agrega `preconnect`/stylesheet para Google Fonts (evita imports bloqueantes).
- **`src/app/app.config.ts`**:
  - agrega `provideAnimationsAsync()`
  - configura PrimeNG con theme preset (Aura) y el orden de CSS layers junto a Tailwind.
- **`package.json` (del proyecto generado)**:
  - agrega scripts `claude:review`, `claude:sync`, `claude:fix`, `claude:tdd`, y `lint:arch`.

## 4) ¿Qué arquitectura impone el Blueprint?

### 4.1 Estructura canónica

El proyecto generado sigue una estructura fija:

```text
src/
├── app/
│   ├── core/        # Facades, guards, interceptors, modelos, utils, servicios base
│   ├── features/    # Smart Components (páginas enrutables)
│   ├── shared/      # Dumb Components (UI presentacional)
│   └── layout/      # Shell (sidebar/topbar/app-shell)
├── styles/
│   ├── tokens/      # variables SCSS (tokens semánticos)
│   └── vendors/     # overrides de PrimeNG / terceros
supabase/
└── migrations/      # SQL idempotente versionado (DDL + RLS)
```

### 4.2 Patrón Facade estricto (regla central)

La UI **no habla con Supabase/HTTP directamente**:

- **Prohibido**: importar `@supabase/supabase-js` en `features/` y `shared/`.
- **Prohibido**: inyectar `*Service` directamente en componentes “vista” (`features/` y `shared/`), salvo excepciones explícitas de infraestructura (p.ej. animación).
- **Obligatorio**: la UI consume un `*FacadeService` que centraliza estado y errores, y expone señales al template.

### 4.3 Smart vs Dumb Components (Atomic Design)

- **`shared/` (Dumb)**:
  - 90% de la UI.
  - Solo `input()`/`output()` (signal inputs/outputs).
  - No inyecta Facades.
  - Idealmente, sin dependencias de datos.
- **`features/` (Smart / Páginas)**:
  - Inyecta Facades.
  - Orquesta y compone componentes de `shared/`.
  - Maneja estados de carga/error (vía signals) y navegación.

### 4.4 Reactividad (Signals + RxJS)

Convención típica:

- `signal()` para estado sincrónico en UI.
- RxJS dentro de servicios para flujos asíncronos.
- `toSignal()` para exponer streams al template desde la Facade.

### 4.5 Templates modernos (Angular 17+)

En templates:

- **Obligatorio**: `@if`, `@for` (control flow nativo).
- **Prohibido**: `*ngIf`, `*ngFor`, `[ngClass]`, `[ngStyle]`.

### 4.6 Estilos / UI system

La filosofía es:

- Tailwind para layout/spacing/sizing.
- **Tokens semánticos** (y clases del design system) para identidad visual.
- **Prohibido** hardcodear colores tailwind tipo `text-red-500`, `bg-blue-200`, etc.

### 4.7 Motion

Reglas clave:

- **GSAP es obligatorio** para animaciones de componentes/microinteracciones.
- **Prohibido**: `@angular/animations`.
- **Prohibido**: `@keyframes` dentro de estilos bajo `src/app/` (la intención es centralizar motion).

## 5) ¿Cómo se garantiza que las reglas se cumplan? (defensa en profundidad)

El sistema combina dos mecanismos:

### 5.1 Hooks (tiempo real, “no negociables”)

Cuando se usa en un entorno compatible con hooks (Claude Code CLI), se activa un sistema que:

- **Bloquea escrituras** si no se siguió el proceso (por ejemplo, no se leyeron índices).
- **Bloquea escrituras** si el contenido viola reglas (control flow legacy, colores hardcodeados, etc.).
- **Protege archivos críticos** (hooks, settings, linter).
- **Evita creación de archivos por comandos** (para que todo pase por ediciones controladas).
- **Reinyecta memoria** tras compactaciones (para no perder contexto).
- **Obliga** a sincronizar índices al terminar si hubo cambios estructurales.

Documentación: ver `templates/docs/HOOKS-SYSTEM.md` (en los proyectos generados vive como `docs/HOOKS-SYSTEM.md`).

### 5.2 Linter arquitectónico (auditoría completa)

En el proyecto generado, el script `npm run lint:arch` ejecuta `scripts/architect.js`.

Ese linter inspecciona el proyecto y valida (hoy) reglas como:

- Sin Supabase directo en UI.
- Sin inyección de `*Service` en componentes vista.
- TDD obligatorio: `*.facade.ts` y `*.service.ts` en `core/` deben tener su `*.spec.ts`.
- `ChangeDetectionStrategy.OnPush` obligatorio en componentes.
- Sin `@angular/animations`.
- Sin `*ngIf/*ngFor/[ngClass]/[ngStyle]` en templates.
- Sin `@keyframes` en estilos dentro de app.
- Sin colores Tailwind hardcodeados.

La idea es “cinturón y tirantes”:

- Hooks = prevención inmediata.
- Linter = verificación completa post-hoc.

## 6) ¿Qué “memoria” se inyecta y para qué sirve?

El Blueprint inyecta dos tipos de documentación:

### 6.1 `docs/` (documentación humana)

Ejemplos típicos (según `templates/docs/`):

- `TECH-STACK-RULES.md`: reglas del stack y patrones obligatorios.
- `HOOKS-SYSTEM.md`: cómo funcionan los guardrails.
- `BRAND_GUIDELINES.md`: tokens y reglas visuales.
- `CLAUDE-USER-GUIDE.md`: guías/prompting recomendado.
- `PRODUCT-VISION.md`: visión para “anclar” decisiones.

### 6.2 `indices/` (memoria viva para el agente)

Los índices son la “fuente de verdad” para:

- Componentes existentes (`indices/COMPONENTS.md`).
- Servicios/Facades existentes (`indices/SERVICES.md`, etc.).
- Esquema de base de datos y RLS (`indices/DATABASE.md`).

La intención es reducir duplicación y drift: antes de crear algo, se consulta el índice y se reutiliza lo existente.

## 7) Integraciones MCP (para operar con “herramientas oficiales”)

El archivo `.mcp.json` configura servidores MCP para que el agente pueda:

- Consultar TypeScript a nivel AST/LSP (`ts-lsp-mcp`).
- Ejecutar Angular CLI en modo herramienta.
- Interactuar con Supabase a través de un MCP server (requiere access token).

En proyectos generados, esto evita que el agente “improvise” comandos y mejora la seguridad/consistencia.

## 8) Cómo usar el sistema (operación)

### En este repo (CLI)

- Instalar dependencias del CLI:
  - `npm install`
- Usar como binario:
  - `npm link`
  - `create-koa-agent`

### En un proyecto generado (Blueprint)

Flujo esperado:

- Dev: `ng serve`
- Auditoría arquitectura: `npm run lint:arch`
- Supabase local (si aplica): `npx supabase start`

Y scripts orientados a workflows agénticos (si el scaffold completo los inyectó):

- `npm run claude:review`
- `npm run claude:sync`
- `npm run claude:fix`
- `npm run claude:tdd`

## 9) Limitaciones / notas realistas

- Este repositorio **no es la app final**: es el generador. La app de referencia vive en `templates/boilerplate/`.
- El `README.md` explica la intención general, pero el comportamiento real del CLI se define en `bin/index.js` y puede diferir de la documentación si cambió el código.
- Parte del “sistema” (hooks) depende del entorno que los soporte. En editores o runtimes sin hooks, solo tendrás la parte de reglas + linter + convenciones.

---

## Apéndice: Mapa rápido de archivos clave (repo actual)

- **CLI**
  - `bin/index.js` — flujo del generador.
  - `package.json` — bin `create-koa-agent`, dependencias CLI.
- **Blueprint (plantillas)**
  - `templates/` — todo lo que se copia al proyecto destino.
  - `templates/boilerplate/src/` — app Angular de referencia (solo Full Scaffold).
  - `templates/boilerplate/scripts/architect.js` — linter arquitectónico (se copia como `scripts/architect.js`).
  - `templates/.mcp.json` — MCP servers para TS/Angular/Supabase.
- **Guardrails / reglas**
  - `templates/.claude/hooks/*` — hooks de bloqueo e inyección de contexto.
  - `templates/.claude/rules/*` — reglas del proyecto (arquitectura, DB, visual, etc.).
  - `templates/docs/HOOKS-SYSTEM.md` — descripción del sistema de hooks.

