# Reglas Arquitectónicas

## Estructura de carpetas canónica

```text
src/
├── app/
│   ├── core/         # Facades, Guards, Interceptors, Modelos
│   ├── features/     # Smart Components (páginas enrutables)
│   ├── shared/       # Dumb Components (UI presentacional)
│   └── layout/       # Sidebar, Topbar, Shell
├── styles/
│   ├── tokens/       # SCSS variables — NUNCA hardcodear en componentes
│   └── vendors/      # PrimeNG overrides
supabase/
└── migrations/       # SQL idempotentes — NUNCA alterar BD manualmente
```

## Patrón Facade (obligatorio)

- La UI **NUNCA** inyecta `SupabaseService`, `HttpClient`, ni clientes REST directamente
- **SIEMPRE** usar un `*FacadeService` que centraliza estado vía Signals
- El Facade expone data al template con `toSignal()`

## Detección de cambios

- `changeDetection: ChangeDetectionStrategy.OnPush` en **TODOS** los componentes

## Signals & RxJS

- `signal()` → estado sincrónico UI (contadores, modales, toggles)
- `RxJS` → flujos asíncronos en Servicios
- `toSignal()` → exponer RxJS a templates en el Facade

## Templates

- **PROHIBIDO**: `*ngIf`, `*ngFor`, `ngClass`, `ngStyle`, `@Input()`, `@Output()`
- **OBLIGATORIO**: `@if`, `@for`, `[class.active]`, `[style.width.px]`, `input()`, `output()`

## Smart vs Dumb Components

- **Dumb (`shared/`)**: Solo `input()` y `output()`. Sin inyección de Facades.
- **Smart (`features/`)**: Inyectan Facades. Coordinan Dumb Components.
- **Skeleton colocated**: Cada Dumb que recibe data async tiene su `{nombre}-skeleton.component.ts` al lado
