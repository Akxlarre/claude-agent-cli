---
name: design-system
description: >
  Sistema de diseño del proyecto: tokens, Frosted Cards, Bento Grid, modo claro/oscuro, GSAP.
  Activar SIEMPRE cuando se cree o modifique un componente Angular (.component.ts, .html),
  se trabaje en dashboard, cards, KPIs, layouts, o estilos.
  NUNCA usar text-pink-500, bg-blue-50, ni colores Tailwind arbitrarios.
  SIEMPRE usar var(--ds-brand), var(--color-primary), bg-surface, text-muted, bento-grid, card-tinted.
  Usar junto a angular-component y angular-signals.
user-invocable: false
allowed-tools: Read, Edit, Glob, Grep
---

# Design System — Referencia completa

Ver guía completa de tokens y componentes en [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md).

## Stack técnico

- **Angular 20** — standalone components, signals, OnPush
- **Tailwind v4** — solo para spacing/layout base
- **SCSS + CSS Variables** — sistema de temas y Frosted Cards
- **GSAP 3** — todas las animaciones y transiciones de entrada

## Reglas absolutas

### Colores: siempre tokens

```scss
// INCORRECTO
color: #9B1D20;
background: bg-blue-500;

// CORRECTO
color: var(--color-primary);
background: var(--bg-surface);
```

### Fondos y superficies

- Página: `var(--bg-base)` (light: `#f4f4f5`, dark: `#09090b`)
- Cards/modales: `var(--bg-surface)`
- Modo dark: `[data-mode='dark']` en documentElement via `ThemeService`

### Todo componente usa OnPush

```typescript
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
```

### Radios mínimos

- Cards: `var(--radius-lg)` (14px) o mayor
- Botones: `var(--radius-full)` (pill)
- Chips/badges: `var(--radius-md)` (10px)

## Bento Grid

```html
<section class="bento-grid" [appBentoGridLayout] aria-label="Panel principal">
  <app-feature-card title="Dashboard" size="hero" [accent]="true" />
  @for (kpi of kpis(); track kpi.id) {
    <app-kpi-card [data]="kpi" />
  }
  <app-feature-card title="Section" size="2x2">
    <!-- contenido -->
  </app-feature-card>
</section>
```

| Clase | Descripción |
|---|---|
| `bento-square` | 1x1 normal |
| `bento-wide` | 2x1 ancho |
| `bento-tall` | 2x2 alto |
| `bento-feature` | 3x2 bloque grande |
| `bento-hero` | Full width superior |
| `bento-banner` | Full width cualquier posición |

**Regla**: Solo 1 `.card-accent` por sección bento.

## GSAP — Patrones de animación

```typescript
ngAfterViewInit(): void {
  const hero = this.host.nativeElement.querySelector<HTMLElement>('.bento-hero');
  if (hero) this.gsap.animateHero(hero);
  this.gsap.animateBentoGrid(this.grid().nativeElement);
}
```

Reglas GSAP:
- Siempre `clearProps: 'transform'` tras animaciones de movimiento
- Registrar plugins (`ScrollTrigger`, `Flip`) solo en browser (`isPlatformBrowser`)
- **No** usar `@angular/animations` en ningún componente
- Hover de cards con `addCardHover()`, no con CSS `transition`
- Contadores KPI con `animateCounter()` al entrar en viewport

## Checklist antes de entregar un componente

- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Todos los colores son `var(--...)` — ningún hardcodeado
- [ ] Usa `.card`, `.card-accent` o `.card-tinted` según contexto
- [ ] 1 solo `.card-accent` por sección
- [ ] GSAP en `ngAfterViewInit` para entrada
- [ ] Funciona en modo claro y oscuro
- [ ] Contraste WCAG AA (mínimo 4.5:1 en texto normal)
- [ ] Radios respetan el sistema (`--radius-lg` mínimo en cards)
