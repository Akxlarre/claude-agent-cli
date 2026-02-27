# koa-agent-cli — Koa Agent Blueprint v5.0

> Si usas **Claude Code CLI**, las reglas completas están en `.claude/CLAUDE.md` y se cargan automáticamente.
> Si usas **Claude.ai Projects**, sube este archivo junto con `docs/` e `indices/` al Project Knowledge.

@.claude/CLAUDE.md

---

<!-- Reglas completas a continuación para compatibilidad con Claude.ai Projects -->

## FLUJO DE TRABAJO OBLIGATORIO (5 PASOS)

Para cada solicitud que implique escribir código o ensamblar UI, debes seguir estos pasos mentalmente (`<thought_process>`):

1. **DESCUBRIR (LSP + Índices):** Usa de forma prioritaria las herramientas MCP del Language Server Protocol (ej: `find_references`, `get_type_at_position`) para navegar el código. Luego consulta `indices/COMPONENTS.md`, `indices/SERVICES.md` y `indices/DATABASE.md` como respaldo documental. ¿Ya existe algo que resuelva parcial o totalmente el problema? Úsalo.
2. **PLANIFICAR:** Define qué vas a tocar sin violar las reglas de Arquitectura y UI (ver abajo).
3. **EJECUTAR:** Escribe el código. Prioriza reutilizar.
4. **VALIDAR (TESTING AUTÓNOMO):** Tienes **PROHIBIDO** dar por terminada una Feature sin actualizar o crear el test unitario (`.spec.ts`) o E2E correspondiente que valide la nueva lógica en la respectiva Facade.
5. **DOCUMENTAR AL CERRAR (`<memory_update>`):** Genera siempre un bloque de código XML explícito con las actualizaciones a las tablas de índices (COMPONENTS.md / SERVICES.md / DATABASE.md) o documenta migraciones de Supabase.

## LÍMITES Y CAPACIDADES DEL AGENTE

- **NO tienes QA Visual:** Eres ciego a la UI renderizada. Dependes de escribir código HTML/CSS semántico perfecto según `BRAND_GUIDELINES.md` y esperar que el Humano lo revise.
- **Project Knowledge:** Tu contexto de 200k tokens te permite leer este documento y toda la carpeta `docs/` y `skills/` al instante. Usa esto a tu favor. No alucines, consulta los archivos.

## ESTRUCTURA DE CARPETAS CANÓNICA (Skeleton Architecture)

Debes respetar esta jerarquía estrictamente. Nunca inventes carpetas fuera de este estándar:

```text
src/
├── app/
│   ├── core/              # Facades, Guards, Interceptors, Modelos e Interfaces.
│   ├── features/          # Smart Components (Páginas completas, ej: Dashboard).
│   ├── shared/            # Dumb Components (UI presentacional, ej: kpi-card, modales).
│   └── layout/            # Sidebar, Topbar, Shell de la app.
├── styles/
│   ├── tokens/            # SCSS variables (var(--ds-brand)). NUNCA hardcodear en componentes.
│   └── vendors/           # PrimeNG overrides y librerías externas.
supabase/
└── migrations/            # Scripts SQL idempotentes numerados. NUNCA alterar BD manualmente.
```

## REGLAS ARQUITECTÓNICAS CRÍTICAS

- **Patrón Facade Estricto:** La UI (Angular Components) **NUNCA** inyecta clientes REST/Supabase directamente. Siempre pasa por un Servicio/Facade que centraliza el estado.
- **Detección de Cambios (OnPush):** Todo componente de UI debe usar `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Estado (Signals & RxJS):** Usa `signal()` para estado sincrónico UI y `RxJS` para flujos asíncronos en Servicios. En la Facade, usa `toSignal()` para exponer data al template de Angular.
- **Data Model (Supabase):** Las transacciones o cambios a base de datos se hacen vía migraciones SQL. Todo esquema nuevo debe documentarse. Ver `skills/supabase-data-model`.

## REGLAS VISUALES Y COMPONENTES (PrimeNG & Atomic Design)

- **Prioridad de UI:** 1. Boilerplate Local (`indices/COMPONENTS.md`) -> 2. `PrimeNG` -> 3. Componentes custom desde cero.
- **PROHIBIDO Tailwind Arbitrario:** **NUNCA** uses colores como `text-red-500` o `bg-[#ff0000]`. Siempre usa nuestros Tokens Semánticos (`var(--ds-brand)`, `text-primary`, `bg-brand-muted`).
- **Grillas y Layout:** Este proyecto utiliza **Bento Grid**. No hagas Grids arbitrarios; utiliza nuestras reglas canónicas.
- Lee los detalles en `docs/TECH-STACK-RULES.md` y `docs/BRAND_GUIDELINES.md`.

## Tu Firma de Salida

Siempre concluye las tareas que alteran la estructura del proyecto o la BBDD con un bloque como este para actualizar mis índices:

```xml
<memory_update>
  ✅ TAREA COMPLETADA
  
  AGREGAR A indices/COMPONENTS.md:
  | `nombre-componente` | Molécula | Breve descripción | ✅ Activo |
</memory_update>
```
