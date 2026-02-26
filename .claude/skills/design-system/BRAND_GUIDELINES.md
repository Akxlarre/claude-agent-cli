# Brand Guidelines y Theming

> NUNCA usar colores Tailwind arbitrarios hardcodeados (`text-pink-500`, `bg-[#ff0000]`). SIEMPRE usar Tokens.

## Tokens tipográficos

| Token | Uso |
|---|---|
| `text-primary` | Títulos grandes y legibles |
| `text-secondary` | Subtítulos y descripciones |
| `text-muted` | Timestamps, placeholders, info secundaria |

## Tokens de superficie

| Token | Uso |
|---|---|
| `bg-base` | Fondo general (fuera del card) |
| `bg-surface` | Background de componentes internos |
| `var(--ds-brand)` | Color de marca principal |
| `var(--color-primary)` | Color primario del sistema |
| `var(--color-primary-muted)` | Versión diluida del primario |

## Cards y superficies

| Clase | Comportamiento |
|---|---|
| `.card` | Base con bordes y padding estándar |
| `.card-accent` | Borde superior con `var(--ds-brand)` |
| `.card-tinted` | Fondo `color-mix(in srgb, var(--ds-brand) 4%, ...)` |

**Regla Canónica**: Solo puede haber **UN solo elemento `.card-accent`** por sección bento grid.

## Bento Grid

Columnas: `1 → 4 → 8 → 12` (mobile-first, breakpoints 640/768/1024px)

| Clase | Mobile | sm (4) | md (8) | lg (12) |
|---|---|---|---|---|
| `bento-square` | full | 2 | 2 | 3 |
| `bento-wide` | full | 4 | 4 | 6 |
| `bento-tall` | full+2r | 2+2r | 2+2r | 3+2r |
| `bento-feature` | full+2r | 4+2r | 6+2r | 8+2r |
| `bento-hero` | 1/-1+2r | 1/-1+2r | 1/-1+2r | 1/-1+2r |

**Placement exacto (1024px+)**: `data-col-span`, `data-col-start`, `data-row-span`

SCSS canónico: `src/styles/layout/_bento-grid.scss`

## Radios

- Cards y contenedores: `var(--radius-lg)` (14px) o mayor
- Botones: `var(--radius-full)` (pill)
- Chips/badges: `var(--radius-md)` (10px)

## Animaciones GSAP

- **NUNCA** CSS `@keyframes` para entradas de vistas
- Inyectar `GsapAnimationsService` en `ngAfterViewInit`
- Métodos disponibles:
  - `animateBentoGrid(containerEl)` — stagger de celdas
  - `animateHero(el)` — entrada con blur + scale
  - `animateCounter(el, target, suffix)` — contador KPI
  - `addCardHover(el)` — sombra elevada en hover
  - `animateThemeChange(onSwap)` — transición de tema
  - `animatePageEnter(el)` / `animatePageLeave(el, onComplete)` — route transitions
