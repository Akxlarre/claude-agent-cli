# Registro de Componentes (Atomic Design)

> **Regla de Actualización:** El Agente debe sugerir adiciones a esta tabla usando `<memory_update>` cada vez que cree un componente nuevo.

## Átomos (Atoms)
*Elementos UI básicos e indivisibles (botones, inputs, badges).*

| Componente | Tipo/Categoría | Props principales | Estado |
|------------|----------------|-------------------|--------|
| `ui-button` | Acción | `variant`, `disabled`, `size` | ✅ Estable |

## Moléculas (Molecules)
*Agrupación de átomos que forman una unidad funcional simple (search bar, card preview).*

| Componente | Tipo/Categoría | Props principales | Estado |
|------------|----------------|-------------------|--------|
| `search-bar` | Formulario | `placeholder`, `loading` | ✅ Estable |

## Organismos (Organisms)
*Secciones complejas y autónomas compuestas por moléculas y átomos.*

| Componente | Tipo/Categoría | Props principales | Estado |
|------------|----------------|-------------------|--------|
| `top-navbar` | Navegación | `user`, `menuItems` | ✅ Estable |

## Páginas / Vistas (Pages)
*Componentes enrutables (Smart components) que consumen Servicios.*

| Ruta / Componente | Propósito | Servicios Inyectados | Estado |
|-------------------|-----------|-----------------------|--------|
| `/dashboard` | Vista General | `DashboardFacadeService` | 🚧 En desarrollo |
