# Sidebar — Arquitectura

## Menú lateral

El menú muestra items genéricos de navegación configurados en MenuConfigService.

### Servicio: MenuConfigService

- **Ubicación:** `src/app/core/services/menu-config.service.ts`
- **Responsabilidad:** Generar `MenuItem[]` para el menú.

```typescript
// Uso en SidebarComponent
menuItems = this.menuConfigService.menuItems; // computed signal
```

---

## Diagrama de dependencias

```
SidebarComponent
  └── MenuConfigService
```
