# Registro de Componentes (Atomic Design)

> **Regla de Actualización (OBLIGATORIA):** El Agente DEBE usar sus herramientas de sistema (escritura de archivos) para agregar los nuevos componentes a estas tablas. Solo si el entorno no los soporta, usa el bloque `<memory_update>` para que el humano lo copie.

## Átomos (Atoms)
*Elementos UI básicos e indivisibles (botones, inputs, badges).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `skeleton-block` | Loading | `variant` (`rect`, `circle`, `text`), `width`, `height` | `shared/components/skeleton-block/skeleton-block.component.ts` | ✅ Estable |
| `app-icon` | Ícono (Lucide) | `name` (requerido, kebab-case), `size` (default 16), `color` (default currentColor), `ariaHidden` (default true) | `shared/components/icon/icon.component.ts` | ✅ Estable |

## Moléculas (Molecules)
*Agrupación de átomos que forman una unidad funcional simple (search bar, card preview).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `app-kpi-card` | KPI / Métrica | `value` (number, req), `label` (string, req), `suffix` (''), `prefix` (''), `trend` (number\|undefined), `trendLabel` (''), `accent` (false) | `shared/components/kpi-card/kpi-card.component.ts` | ✅ Estable |
| `app-kpi-card-skeleton` | Skeleton de KPI | — (skeleton colocated de app-kpi-card) | `shared/components/kpi-card/kpi-card-skeleton.component.ts` | ✅ Estable |

## Moléculas — Feedback
*Comunicación de estados del sistema al usuario.*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `app-empty-state` | Estado vacío | `message` (string, req), `subtitle` (string), `icon` (Lucide kebab-case), `actionLabel` (string), `actionIcon` (default 'plus'), `(action)` output | `shared/components/empty-state/empty-state.component.ts` | ✅ Estable |
| `app-alert-card` | Alerta / Feedback | `title` (string, req), `severity` ('error'\|'warning'\|'info'\|'success', default 'info'), `actionLabel` (string), `dismissible` (boolean), `(action)` output, `(dismissed)` output. Body via `ng-content`. | `shared/components/alert-card/alert-card.component.ts` | ✅ Estable |

## Organismos (Organisms)
*Secciones complejas y autónomas compuestas por moléculas y átomos.*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| — | — | — | — | — |

## Layout (Shell)
*Componentes estructurales del shell de la aplicación — no son páginas enrutables.*

| Componente | Tipo | Propósito | Ubicación | Estado |
|------------|------|-----------|-----------|--------|
| `AppShellComponent` | Smart | Layout principal: sidebar + topbar + router-outlet; drawer animado en mobile | `layout/app-shell.component.ts` | ✅ Estable |
| `SidebarComponent` | Smart | Sidebar de navegación con pill hovers GSAP, theme toggle y avatar de usuario | `layout/sidebar.component.ts` | ✅ Estable |
| `TopbarComponent` | Smart | Barra superior con badge de notificaciones y menú de usuario | `layout/topbar.component.ts` | ✅ Estable |

## Páginas / Vistas (Pages)
*Componentes enrutables (Smart components) que consumen Servicios.*

| Ruta / Componente | Propósito | Servicios Inyectados | Ubicación | Estado |
|-------------------|-----------|-----------------------|-----------|--------|
| `/app/dashboard` — `DashboardComponent` | Dashboard principal de referencia: KPIs, feed de actividad, acciones rápidas, estado del sistema. Ejemplo canónico de todos los patrones del design system (bento-grid, app-kpi-card, app-icon, surface-hero, indicator-live). Reemplazar signals estáticos con Facade real. | `AuthFacade`, `GsapAnimationsService` | `features/dashboard/dashboard.component.ts` | ✅ Estable (datos estáticos — conectar Facade) |
| `/login` — `LoginComponent` | Login, registro y reset de contraseña | `AuthService` | `features/auth/login.component.ts` | ✅ Estable |
| `/**` — `NotFoundComponent` | Página 404 | — | `features/not-found/not-found.component.ts` | ✅ Estable |

