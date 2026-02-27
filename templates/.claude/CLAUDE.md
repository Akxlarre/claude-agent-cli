# {{PROJECT_NAME}} — Claude Agent Blueprint v4.1

Tu stack: **Angular + Tailwind v4 + PrimeNG + Supabase + GSAP**.

## Comandos del proyecto

- Dev: `ng serve`
- Build: `ng build`
- Lint: `ng lint`
- Supabase local: `npx supabase start`

## Flujo obligatorio (4 pasos)

1. **DESCUBRIR (LSP + Índices)** — Usa herramientas MCP de TypeScript (ej: `get_type_at_position`) sobre el código fuente primero, y luego consulta `indices/COMPONENTS.md`, `indices/SERVICES.md`, `indices/STYLES.md`, `indices/DATABASE.md` antes de escribir código.
2. **PLANIFICAR** — Define qué vas a tocar sin violar las reglas de arquitectura. Si requieres nuevos elementos estructurales, planifica usar la herramienta MCP de Angular. Si modificas bases de datos, planifica usar la herramienta MCP de Supabase.
3. **EJECUTAR (ORQUESTACIÓN MCP)** — 
   - Para scaffolding de Angular (nuevos componentes, servicios), **debes USAR OBLIGATORIAMENTE** la herramienta `angular` del MCP server en lugar de crear archivos o escribirlos a mano.
   - Para operaciones de BD (esquemas, migraciones, ramas de desarrollo), **debes USAR OBLIGATORIAMENTE** las herramientas de `supabase` MCP.
   - Escribe el resto del código verificando siempre la compatibilidad.
4. **VALIDAR (GUARDRAILS & TESTS)** — Aplica estrictamente el "Agentic TDD". Correr siempre `npm run lint:arch` y `npm run test` para asegurar cobertura y verificar el Patrón Facade. Si fallas, debes autocorregirte obligatoriamente (Shadow CI).
5. **SINCRONIZAR** — Al cerrar la sesión, ejecuta `/sync-indices`

## Reglas del proyecto

@.claude/rules/architecture.md
@.claude/rules/visual-system.md
@.claude/rules/testing-tdd.md

## Referencias

- Stack completo: @docs/TECH-STACK-RULES.md
- Brand & UI: @docs/BRAND_GUIDELINES.md
- Visión del producto: @docs/PRODUCT-VISION.md
- Guía de usuario: @docs/CLAUDE-USER-GUIDE.md
