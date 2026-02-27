# Sistema Visual

## Prioridad de UI

1. `indices/COMPONENTS.md` — ¿Existe algo reutilizable del Design System local?
2. `PrimeNG` — Para inputs complejos, tablas, calendarios, dropdowns
3. Componente custom — Solo si 1 y 2 no cubren la necesidad

## Tokens de color y Agnósticos (PROHIBIDO hardcodear)

- Textos: `text-primary`, `text-secondary`, `text-muted`
- Fondos: `bg-base` (página), `bg-surface` (cards), `bg-surface-elevated`
- Marca: `var(--ds-brand)`, `var(--color-primary)`
- **NUNCA**: `text-red-500`, `bg-[#ff0000]`, u otras utilities de colores arbitrarios de Tailwind. Usa siempre variables abstractas. Así mantenemos el estilo desconectado de la lógica para cambiar de "tema" sin tocar código.

## Bento Grid

- Contenedor: `.bento-grid` + directiva `[appBentoGridLayout]`
- Hijos: `.bento-square`, `.bento-wide`, `.bento-tall`, `.bento-feature`, `.bento-hero`
- Solo **UN** `.card-accent` por sección bento
- SCSS canónico: `src/styles/layout/_bento-grid.scss`

## Cards

- `.card` — base con borde y padding estándar
- `.card-accent` — borde superior con `var(--ds-brand)` (1 por sección)
- `.card-tinted` — fondo primario diluido (para KPIs y highlights)

## Modo claro/oscuro

- Controlado por `ThemeService` con `[data-mode='dark']` en el documentElement
- `this.themeService.setColorMode('dark' | 'light' | 'system')`
- PrimeNG: usar `darkModeSelector: '.fake-dark-mode'` para evitar conflictos

## Animaciones y Motion Physics (GSAP obligatorio)

- **PROHIBIDO** `@angular/animations` ni CSS `@keyframes` para entradas de vistas.
- **PROHIBIDO** inventar `durations` o `eases` arbitrarios en tus llamadas a GSAP. Usa siempre constantes físicas si el proyecto las provee, o variables CSS.
- **OBLIGATORIO** `GsapAnimationsService` en `ngAfterViewInit`
- Métodos clave: `animateBentoGrid()`, `animateHero()`, `animateCounter()`, `addCardHover()`
- Siempre `clearProps: 'transform'` tras animaciones de movimiento
