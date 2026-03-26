# Registro de Componentes (Atomic Design)

> **Regla de Actualización (CRÍTICA - SINGLE SOURCE OF TRUTH):** El Agente DEBE usar sus herramientas de sistema (escritura de archivos) para agregar incondicionalmente todos los nuevos componentes creados a estas tablas. 
> Esta tabla es tu ÚNICA fuente de la verdad para conocer qué átomos y moléculas existen. Antes de crear un componente UI, verifica aquí si ya existe uno que resuelva el problema. Si ignoras mantener esta tabla actualizada, fallarás en la tarea gravemente por provocar duplicación de código e inconsistencia de UI.

## Átomos (Atoms)
*Elementos UI básicos e indivisibles (botones, inputs, badges).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `skeleton-block` | Loading | `variant` (`rect`, `circle`, `text`), `width`, `height` | `shared/components/skeleton-block/skeleton-block.component.ts` | ✅ Estable |
| `app-icon` | Ícono (Lucide) | `name` (requerido, kebab-case), `size` (default 16), `color` (default currentColor), `ariaHidden` (default true) | `shared/components/icon/icon.component.ts` | ✅ Estable |

### Ejemplos de uso — Átomos

```html
<!-- skeleton-block: placeholder durante carga -->
<skeleton-block variant="rect" width="100%" height="120px" />
<skeleton-block variant="circle" width="48px" height="48px" />
<skeleton-block variant="text" width="60%" />

<!-- app-icon: siempre usar en vez de emojis o SVG inline -->
<app-icon name="trending-up" [size]="14" />
<app-icon name="users" [size]="24" style="color: var(--color-primary)" />
```

## Moléculas (Molecules)
*Agrupación de átomos que forman una unidad funcional simple (search bar, card preview).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `app-kpi-card` | KPI / Métrica | `value` (number, req), `label` (string, req), `suffix` (''), `prefix` (''), `trend` (number\|undefined), `trendLabel` (''), `accent` (false) | `shared/components/kpi-card/kpi-card.component.ts` | ✅ Estable |
| `app-kpi-card-skeleton` | Skeleton de KPI | — (skeleton colocated de app-kpi-card) | `shared/components/kpi-card/kpi-card-skeleton.component.ts` | ✅ Estable |

### Ejemplos de uso — app-kpi-card

```html
<!-- KPI monetario con tendencia positiva -->
<app-kpi-card
  [value]="84320"
  label="Ingresos del mes"
  prefix="$"
  [trend]="12.5"
  trendLabel="vs. mes anterior"
  [accent]="true"
/>

<!-- KPI porcentaje con tendencia negativa -->
<app-kpi-card
  [value]="4.7"
  label="Tasa de conversión"
  suffix="%"
  [trend]="-3.1"
  trendLabel="últimas 24 h"
/>

<!-- KPI simple sin tendencia (funciona como stat card) -->
<app-kpi-card
  [value]="1234"
  label="Usuarios activos"
/>

<!-- Skeleton mientras carga -->
<app-kpi-card-skeleton />
```

## Moléculas — Feedback
*Comunicación de estados del sistema al usuario.*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `app-empty-state` | Estado vacío | `message` (string, req), `subtitle` (string), `icon` (Lucide kebab-case), `actionLabel` (string), `actionIcon` (default 'plus'), `(action)` output | `shared/components/empty-state/empty-state.component.ts` | ✅ Estable |
| `app-alert-card` | Alerta / Feedback | `title` (string, req), `severity` ('error'\|'warning'\|'info'\|'success', default 'info'), `actionLabel` (string), `dismissible` (boolean), `(action)` output, `(dismissed)` output. Body via `ng-content`. | `shared/components/alert-card/alert-card.component.ts` | ✅ Estable |

### Ejemplos de uso — app-empty-state

```html
<!-- Sin datos (mínimo) -->
<app-empty-state message="No hay transacciones todavía." />

<!-- Búsqueda sin resultados con acción -->
<app-empty-state
  icon="search"
  message="Sin resultados"
  subtitle="Intenta con otros términos de búsqueda."
  actionLabel="Limpiar filtros"
  actionIcon="x"
  (action)="resetFilters()"
/>

<!-- Sección vacía con invitación a crear -->
<app-empty-state
  icon="users"
  message="No tienes usuarios todavía"
  subtitle="Invita a tu equipo para empezar a colaborar."
  actionLabel="Invitar usuario"
  (action)="openInviteModal()"
/>
```

### Ejemplos de uso — app-alert-card

```html
<!-- Info básica -->
<app-alert-card title="Actualización disponible">
  Se publicó la versión 2.1 con mejoras de rendimiento.
</app-alert-card>

<!-- Error con acción de reintento -->
<app-alert-card
  severity="error"
  title="No se pudo guardar"
  actionLabel="Reintentar"
  (action)="saveData()"
>
  Hubo un problema al conectarse con el servidor.
</app-alert-card>

<!-- Éxito descartable -->
<app-alert-card
  severity="success"
  title="Cambios guardados"
  [dismissible]="true"
  (dismissed)="showAlert.set(false)"
/>
```

## Moléculas — Contenedores

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `app-drawer` | Panel lateral | `isOpen` (boolean, req), `title` (string, req), `icon` (string), `hasFooter` (boolean), `(closed)` output. Body via `ng-content`, footer via `[drawer-footer]`. | `shared/components/drawer/drawer.component.ts` | ✅ Estable |

### Ejemplos de uso — app-drawer

```html
<!-- Drawer de detalle con footer -->
<app-drawer
  [isOpen]="showDrawer()"
  title="Detalle del usuario"
  icon="user"
  [hasFooter]="true"
  (closed)="showDrawer.set(false)"
>
  <!-- Body: cualquier contenido -->
  <div class="flex flex-col gap-4">
    <p>Contenido del drawer...</p>
  </div>

  <!-- Footer: botones de acción -->
  <div drawer-footer class="flex justify-end gap-2">
    <button class="btn-ghost" (click)="showDrawer.set(false)">Cancelar</button>
    <button class="btn-primary" (click)="save()">Guardar</button>
  </div>
</app-drawer>
```

## Organismos (Organisms)
*Secciones complejas y autónomas compuestas por moléculas y átomos. Para tablas, formularios y modals usa PrimeNG (ver regla component-selection.md).*

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

## Auto-Index — Componentes detectados por AST (generado automáticamente)

<!-- AUTO-GENERATED:BEGIN -->
_Sin componentes auto-detectados aún. Ejecuta `npm run indices:sync` para poblar._
<!-- AUTO-GENERATED:END -->
