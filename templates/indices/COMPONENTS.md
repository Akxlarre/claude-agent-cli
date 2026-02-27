# Registro de Componentes (Atomic Design)

> **Regla de Actualización (OBLIGATORIA):** El Agente DEBE usar sus herramientas de sistema (escritura de archivos) para agregar los nuevos componentes a estas tablas. Solo si el entorno no los soporta, usa el bloque `<memory_update>` para que el humano lo copie.

## Átomos (Atoms)
*Elementos UI básicos e indivisibles (botones, inputs, badges).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| `skeleton-block` | Loading | `variant` (`rect`, `circle`, `text`), `width`, `height` | `shared/components/skeleton-block.component.ts` | ✅ Estable |

## Moléculas (Molecules)
*Agrupación de átomos que forman una unidad funcional simple (search bar, card preview).*

| Componente | Tipo/Categoría | Props principales | Ubicación | Estado |
|------------|----------------|-------------------|-----------|--------|
| — | — | — | — | — |

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
| `/login` — `LoginComponent` | Login, registro y reset de contraseña | `AuthService` | `features/auth/login.component.ts` | ✅ Estable |
| `/**` — `NotFoundComponent` | Página 404 | — | `features/not-found/not-found.component.ts` | ✅ Estable |

