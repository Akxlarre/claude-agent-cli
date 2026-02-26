---
name: design-system
description: >
  Activar SIEMPRE cuando el agente cree o modifique componentes Angular (.component.ts, .html),
  use clases Tailwind (bg-*, text-*, border-*), trabaje en dashboard, cards, KPIs, layouts o estilos.
  Sistema de tokens, Frosted Cards, bento grid, modo claro/oscuro.
  Sistema de tokens, Cards, bento grid, modo claro/oscuro.
  NUNCA usar text-pink-500, bg-blue-50, text-red-700 ni colores Tailwind arbitrarios.
  Usar SIEMPRE var(--ds-brand), var(--color-primary), bg-brand-muted, text-muted, bento-grid, card-tinted.
  Usar junto a angular-component y angular-signals.
---

# Skill: design-system

## Cuándo activar esta skill

El agente debe usar esta skill cuando:
- Cree o modifique cualquier componente Angular de la app
- Trabaje con layouts de dashboard o páginas
- Implemente el modo claro u oscuro
- Genere cards, KPIs, tablas, formularios o modales
- Añada animaciones, transiciones o motion
- Revise si un componente cumple el design system

---

## Stack técnico

- **Angular 20** — standalone components, signals, OnPush
- **Tailwind v4** — para utilidades de spacing/layout base
- **SCSS + CSS Variables** — para el sistema de temas y Frosted Cards
- **Angular CDK** — para overlays, portals, accesibilidad
- **GSAP 3** — para todas las animaciones y transiciones de entrada (ScrollTrigger, Flip, stagger)

---

## Reglas absolutas de implementación

### 1. Nunca usar colores hardcodeados
```scss
// ❌ INCORRECTO
color: #9B1D20;
background: #1B3F6E;

// ✅ CORRECTO
color: var(--color-primary);
background: var(--color-primary-muted);
```

### 1b. Theming y Marca Blanca (White-labeling)
- **NUNCA** colores directos ni clases de paleta (`bg-blue-500`) en dominios o componentes compartidos.
- **OBLIGATORIO**: Mapear valores visuales a variables CSS semánticas (`var(--ds-brand)`, `var(--text-primary)`).
- Nuevo cliente = archivo de tema que sobrescribe variables globales.
- Servicios que animen (GSAP) deben leer tokens vía `getComputedStyle(document.documentElement).getPropertyValue('--token')`.

### 2. Fondos y superficies
Todos los layouts usan `--bg-base` como base de página (light: `#f4f4f5`, dark: `#09090b`).
Las superficies (cards, modales) usan `--bg-surface`.
El modo claro/oscuro se aplica con `[data-mode='dark']` en el documentElement.

### 3. Todo componente usa `OnPush`
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 4. El modo claro/oscuro se inyecta con `ThemeService`
```typescript
readonly themeService = inject(ThemeService);
readonly darkMode = this.themeService.darkMode; // Signal<boolean>

this.themeService.setColorMode('dark');   // 'light' | 'dark' | 'system'
this.themeService.cycleColorMode(event); // alternar light/dark
```

### 5. Radios mínimos
- Cards y contenedores: `var(--radius-lg)` (14px) o mayor
- Botones: `var(--radius-full)` (pill)
- Elementos internos (chips, badges): `var(--radius-md)` (10px)

---

## Plantilla de Componente Card

```typescript
// feature-card.component.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feature-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <article
      class="card"
      [class.card-accent]="accent()"
      [class.card-tinted]="tinted()"
      [class]="'bento-' + size()"
    >
      <header class="card__header">
        <div class="card__icon">
          <ng-content select="[slot=icon]" />
        </div>
        <div class="card__meta">
          <h3 class="card__title">{{ title() }}</h3>
          @if (badge()) {
            <span class="card__badge">{{ badge() }}</span>
          }
        </div>
      </header>
      <div class="card__body">
        <ng-content />
      </div>
      @if (hasFooter()) {
        <footer class="card__footer">
          <ng-content select="[slot=footer]" />
        </footer>
      }
    </article>
  `,
  styleUrl: './feature-card.component.scss'
})
export class FeatureCardComponent {
  title    = input.required<string>();
  badge    = input<string>();
  size     = input<'1x1' | '2x1' | '3x1' | '4x1' | '2x2' | '3x2' | 'hero'>('2x1');
  accent   = input(false);   // borde superior con color primario — 1 por sección
  tinted   = input(false);   // fondo tintado suave — para KPIs
  hasFooter = input(false);
}
```

```scss
// feature-card.component.scss
:host {
  display: contents;
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);

  // Estado inicial para GSAP — animateBentoGrid() lo revela
  opacity: 0;
  transform: translateY(16px);

  // Hover: gestionado por GsapAnimationsService.addCardHover()

  // Elemento ancla de la sección (1 por sección máximo)
  &.card-accent {
    border: 1px solid var(--accent-border);
    border-top: var(--accent-border-width) solid var(--ds-brand);
    box-shadow: var(--shadow-md), 0 0 0 1px var(--accent-border) inset;
  }

  // KPIs y stats destacados (usa --bg-surface-mix para dark mode)
  &.card-tinted {
    background: color-mix(in srgb, var(--ds-brand) 4%, var(--bg-surface-mix));
    border: 1px solid var(--accent-border);
    box-shadow: var(--shadow-sm);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: var(--color-primary-muted);
    display: grid;
    place-items: center;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  &__title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    line-height: var(--leading-snug);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 2px var(--space-2);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    background: var(--color-primary-muted);
    color: var(--color-primary);
    border: 1px solid var(--accent-border);
  }

  &__body {
    flex: 1;
    color: var(--text-secondary);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
  }

  &__footer {
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

// Animaciones de entrada: GsapAnimationsService.animateBentoGrid()
```

---

## Bento Grid — Referencia Canónica

> **Este es el lugar canónico para Bento Grid.** Las reglas `bento-grid-patterns.md` y `bento-layout.md` apuntan aquí.

### Grid System v2

Arquitectura: **clases de proporción** + **data-attributes** para placement exacto.
Breakpoints: **640px** · **768px** · **1024px** (mobile-first)
Columnas: **1 → 4 → 8 → 12**

```scss
.bento-grid {
  display: grid;
  grid-template-columns: repeat(var(--bento-cols-mobile), minmax(0, 1fr));
  grid-auto-rows: minmax(var(--bento-row-min), var(--bento-row-max));
  grid-auto-flow: dense;
  gap: var(--bento-gap-mobile);
  padding: var(--bento-pad-mobile);
}
/* Responsive: --bento-cols-sm (4), --bento-cols-md (8), --bento-cols-lg (12) */
```

Variables: `--bento-row-min` (120px), `--bento-gap-*`, `--bento-pad-*`.
Fuente SCSS: `src/styles/layout/_bento-grid.scss`

### Clases de proporción

| Clase | Mobile | sm (4) | md (8) | lg (12) |
|-------|--------|--------|--------|---------|
| `bento-square` | full | 2 | 2 | 3 |
| `bento-wide` | full | 4 | 4 | 6 |
| `bento-tall` | full+2r | 2+2r | 2+2r | 3+2r |
| `bento-feature` | full+2r | 4+2r | 6+2r | 8+2r |
| `bento-hero` | 1/-1+2r | 1/-1+2r | 1/-1+2r | 1/-1+2r |
| `bento-banner` | 1/-1 | 1/-1 | 1/-1 | 1/-1 |

**Aliases legacy**: `bento-1x1` → square · `bento-2x1`/`3x1`/`4x1` → wide · `bento-2x2` → tall · `bento-3x2` → feature

**Placement (1024px+)**: `data-col-span="1"…"12"` · `data-col-start="1"…"11"` · `data-row-span="1"…"4"`

### Directiva appBentoGridLayout

Aplicar `[appBentoGridLayout]` en el contenedor `.bento-grid` para layout dinámico:

```html
<section appBentoGridLayout class="bento-grid" aria-label="Panel principal">
  <!-- celdas -->
</section>
```

Para hijos que cambian tamaño, inyectar el contexto:

```typescript
private layoutContext = inject(BENTO_GRID_LAYOUT_CONTEXT, { optional: true });

onPageChange(): void {
  this.layoutContext?.runLayoutChange(() => {
    this.rows.set(newRows);
  });
}
```

Referencia: `src/app/core/directives/bento-grid-layout.README.md`

### Composition Rules

**1. Un ancla por sección**: Exactamente 1 `.card-accent` por sección bento grid (borde superior `var(--ds-brand)`)

```html
<!-- ✅ CORRECTO: 1 card-accent por sección -->
<section class="bento-grid" appBentoGridLayout aria-label="Panel principal">
  <app-feature-card size="hero" [accent]="true" title="Dashboard" />
  <app-kpi-card [data]="kpi1" />
  <app-kpi-card [data]="kpi2" />
</section>
```

**2. KPI Row Pattern**: 4 cards `.bento-1x1` + `.card-tinted`, contadores con `animateCounter()`

**3. Color Primario Limitado**: Máximo 2-3 apariciones por pantalla

### Layout Example — Dashboard

```
┌─────────────────────────────────────────────┐
│ HERO (1/-1×2) .card-accent                  │
│ "Dashboard"                                 │
└─────────────────────────────────────────────┘
┌────────┬────────┬────────┬────────┐
│ KPI 1  │ KPI 2  │ KPI 3  │ KPI 4  │ bento-1x1 + card-tinted
└────────┴────────┴────────┴────────┘
┌──────────────────┬──────────────────┐
│ bento-2x2        │ bento-2x2        │
└──────────────────┴──────────────────┘
```

### Dashboard Template

```html
<main #container class="dashboard">
  <section #grid class="bento-grid" aria-label="Panel principal">
    <app-feature-card title="Dashboard" size="hero" [accent]="true">
      <!-- contenido hero -->
    </app-feature-card>

    @for (kpi of kpis(); track kpi.id) {
      <app-kpi-card [data]="kpi" />
    }

    <app-feature-card title="Section" size="2x2">
      <!-- chart / lista -->
    </app-feature-card>
  </section>
</main>
```

```scss
.dashboard {
  min-height: 100vh;
  background: var(--bg-base);
}
```

### GSAP Animation Entry

```typescript
ngAfterViewInit(): void {
  const hero = this.host.nativeElement.querySelector<HTMLElement>('.bento-hero');
  if (hero) this.gsap.animateHero(hero);
  this.gsap.animateBentoGrid(this.grid().nativeElement);
}
```

Patrón: stagger 0.4s, `opacity: 0, y: 24, scale: 0.97` → `1, 0, 1`, ease `power3.out`.

### Accessibility

- `aria-label` en el contenedor
- Orden DOM lógico (dense flow puede desincronizar)
- `prefers-reduced-motion`: grid desactiva transiciones

### Do's & Don'ts

✅ 1 `.card-accent` por sección · ✅ `.card-tinted` para KPIs (max 4) · ✅ Jerarquía visual hero > feature > tall > wide > square · ✅ `animateBentoGrid()` en `ngAfterViewInit` · ✅ Testear light/dark · ✅ WCAG AA

❌ Múltiples `.card-accent` · ❌ Hardcodear tamaños · ❌ Saturar color primario · ❌ Omitir GSAP · ❌ Omitir `[appBentoGridLayout]`

### Bento Checklist

- [ ] Grid usa variables `--bento-cols-*` (responsive)
- [ ] Fondo: `var(--bg-base)`
- [ ] 1 solo `.card-accent` por sección
- [ ] KPIs usan `.card-tinted` + animación contador
- [ ] Hero usa `.bento-hero` + `.card-accent`
- [ ] GSAP en `ngAfterViewInit`
- [ ] `[appBentoGridLayout]` si hijos cambian tamaño
- [ ] `aria-label`, orden DOM lógico
- [ ] Color primario ≤ 3 veces

---

## Tema y Preferencias

El modo claro/oscuro se gestiona con `ThemeService`. El selector está en la topbar/sidebar.
Modos: `'light'` | `'dark'` | `'system'`. Se aplica con `[data-mode='dark']` en el documentElement.
Solo existe un color de marca (Azul Rey) definido en los tokens.

---

## GSAP — Patrones de Animación

### Instalación
```bash
npm install gsap
npm install @types/gsap --save-dev
```

### Servicio central de animaciones

```typescript
// gsap-animations.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class GsapAnimationsService {
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /** Animación de entrada para celdas bento — stagger desde abajo */
  animateBentoGrid(containerEl: HTMLElement): void {
    const cells = containerEl.querySelectorAll<HTMLElement>('.bento-grid > *');
    gsap.fromTo(cells,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { amount: 0.4, from: 'start' },
        clearProps: 'transform',
      }
    );
  }

  /** Animación del hero card — entrada con blur + scale */
  animateHero(el: HTMLElement): void {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'expo.out',
        clearProps: 'filter,transform',
      }
    );
  }

  /** Números KPI — counter animado */
  animateCounter(el: HTMLElement, target: number, suffix = ''): void {
    gsap.fromTo({ val: 0 },
      { val: 0 },
      {
        val: target,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate() {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        }
      }
    );
  }

  /** Hover en cards — sombra elevada sobre fondo claro */
  addCardHover(el: HTMLElement): void {
    const enter = () => gsap.to(el, {
      boxShadow: [
        '0 2px 4px rgba(0,0,0,0.04)',
        '0 8px 32px rgba(0,0,0,0.12)',
        '0 24px 48px rgba(0,0,0,0.08)'
      ].join(', '),
      borderColor: 'rgba(0,0,0,0.16)',
      y: -2,
      duration: 0.22,
      ease: 'power2.out',
    });
    const leave = () => gsap.to(el, {
      boxShadow: [
        '0 1px 3px rgba(0,0,0,0.06)',
        '0 4px 16px rgba(0,0,0,0.06)'
      ].join(', '),
      borderColor: 'rgba(0,0,0,0.09)',
      y: 0,
      duration: 0.32,
      ease: 'power2.inOut',
    });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
  }

  /** Transición de cambio de tema — fade out → swap → fade in */
  animateThemeChange(onSwap: () => void): void {
    gsap.to('body', {
      opacity: 0.6,
      duration: 0.15,
      ease: 'power1.in',
      onComplete: () => {
        onSwap();
        gsap.to('body', {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  }

  /** Page route transition — salida */
  animatePageLeave(el: HTMLElement, onComplete: () => void): void {
    gsap.to(el, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete,
    });
  }

  /** Page route transition — entrada */
  animatePageEnter(el: HTMLElement): void {
    gsap.fromTo(el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', clearProps: 'transform' }
    );
  }
}
```

### Uso en un componente Angular 20

```typescript
// dashboard.component.ts
import { Component, OnInit, AfterViewInit, ElementRef, inject,
         ChangeDetectionStrategy, viewChild } from '@angular/core';
import { GsapAnimationsService } from '@core/services/gsap-animations.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main #container class="dashboard">
      <div class="dashboard__bg" aria-hidden="true"></div>
      <section #grid class="bento-grid">
        <!-- celdas -->
      </section>
    </main>
  `
})
export class DashboardComponent implements AfterViewInit {
  private gsap  = inject(GsapAnimationsService);
  private host  = inject(ElementRef<HTMLElement>);

  grid = viewChild.required<ElementRef<HTMLElement>>('grid');

  ngAfterViewInit(): void {
    // Animar hero primero, luego el resto del grid
    const hero = this.host.nativeElement.querySelector<HTMLElement>('.bento-hero');
    if (hero) this.gsap.animateHero(hero);
    this.gsap.animateBentoGrid(this.grid().nativeElement);
  }
}
```

### ThemeService con transición GSAP

```typescript
// theme.service.ts — modo claro/oscuro (light | dark | system)
// Cicla: light → dark → system → light
this.themeService.cycleColorMode(clickEvent);

// O establecer explícitamente:
this.themeService.setColorMode('dark');
// Aplica [data-mode='dark'] en documentElement y persiste en localStorage
```

### Reglas GSAP en este proyecto

- Siempre usar `clearProps: 'transform'` tras animaciones de movimiento para no bloquear `will-change`
- Registrar plugins (`ScrollTrigger`, `Flip`) **solo en browser** (guard con `isPlatformBrowser`)
- No usar `@angular/animations` en ningún componente — todo motion va por GSAP
- Manejar hover de cards con `addCardHover()` del servicio, no con CSS `transition` para colores de sombra
- Los contadores KPI usan siempre `animateCounter()` al entrar en viewport

---

## Checklist antes de entregar un componente

- [ ] Usa `ChangeDetectionStrategy.OnPush`
- [ ] Todos los colores son `var(--...)` — ningún color hardcodeado
- [ ] Usa `.card`, `.card-accent` o `.card-tinted` — nunca `.glass` ni `.glass-tinted`
- [ ] Fondo de página: `var(--bg-base)` | Superficies: `var(--bg-surface)`
- [ ] Llama a `GsapAnimationsService` en `ngAfterViewInit` para la entrada
- [ ] El hover de cards usa `addCardHover()` del servicio
- [ ] No hay `@angular/animations` importado en ningún módulo/componente
- [ ] `.card-accent` aparece máximo 1 vez por sección
- [ ] `--state-error` solo en validación — nunca como color de marca
- [ ] Funciona en modo claro y oscuro (test: alternar `data-mode`)
- [ ] Radios respetan el sistema (`--radius-lg` mínimo en cards)
- [ ] Tipografía usa variables `--text-*` y `--font-*`
- [ ] Contraste WCAG AA verificado (mínimo 4.5:1 en texto normal)

---

## Referencias

- **BRAND_GUIDELINES**: `.agent/skills/design-system/BRAND_GUIDELINES.md` — tokens, bento grid, cards
- **Animaciones**: `docs/ANIMATIONS.md` — API completa de GsapAnimationsService
- **Directivas**: `src/app/core/directives/DIRECTIVES.md` — appPressFeedback, appBentoGridLayout, appSearchShortcut
