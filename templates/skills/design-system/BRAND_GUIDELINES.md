# 🏠 Design System — Base Template
> Versión: 2.0 | Stack: Angular 20 + Tailwind v4 + SCSS + GSAP 3
> **Fuente de verdad**: `src/styles/tokens/_variables.scss` · `src/styles/layout/_bento-grid.scss` · `docs/ANIMATIONS.md`

---

## 📌 Contexto del Proyecto

<!-- ★ PERSONALIZAR: Describir el contexto de tu proyecto -->
Aplicación moderna construida con Angular 20 + Tailwind v4 + SCSS + GSAP 3. El design system es paramétrico: cambiar el color de marca en `_variables.scss` Capa 3 actualiza todo el sistema en cascada.

---

## 🎨 Filosofía de Diseño

**Referencia estética**: Apple (precisión, aire, jerarquía) + Frosted Cards (profundidad sobre blanco) + Bento Grid (densidad informativa organizada)

### Principios irrenunciables

- **Claridad y usabilidad** — interfaz pensada para el día a día del usuario
- **Legibilidad ante todo** — usuarios de 35-60 años, uso diurno intensivo 8+ horas
- **Profundidad con capas** — sombras y bordes crean jerarquía; dark mode disponible
- **Color como acento** — `--ds-brand` / `--color-primary` para CTAs, iconos activos y highlights. El resto es neutro
- **Densidad con respiro** — bento grid organiza información sin aglomerar
- **Motion con propósito** — GSAP anima con intención, nunca como decoración

### Theming y Marca Blanca (White-labeling)

- **NUNCA** usar colores directos ni clases de paleta específicas (ej. `bg-blue-500`) en dominios de negocio o componentes compartidos.
- **OBLIGATORIO**: Mapear todos los valores visuales a variables CSS semánticas (`var(--ds-brand)`, `var(--text-primary)`, etc.).
- Cada cliente nuevo en el ecosistema solo requiere un archivo de tema que sobrescriba estas variables globales.
- Servicios que animen estilos (ej. `GsapAnimationsService`) deben leer tokens vía `getComputedStyle(document.documentElement).getPropertyValue('--token')` en lugar de valores hardcodeados.

---

## 🎨 Sistema de Color

### Tokens base (CSS Variables)

```css
/* ============================================
   LIGHT MODE — :root
   Fuente: src/styles/tokens/_variables.scss
   ============================================ */
:root {
  /* Fondos en capas (Zinc scale) */
  --bg-base:     #f4f4f5;  /* Zinc 100 — fondo base */
  --bg-surface:  #ffffff;   /* Tarjetas, modales, sidebar */
  --bg-elevated: #fafafa;  /* Hover de filas, áreas diferenciadas */
  --bg-subtle:   #e4e4e7;  /* Inputs, chips, separadores */
  --bg-surface-mix: #ffffff;  /* Para color-mix (card-tinted) */

  /* Tipografía — jerarquía de texto */
  --text-primary:   #09090b;  /* Zinc 950 */
  --text-secondary: #52525b;  /* Zinc 600 */
  --text-muted:     #a1a1aa;  /* Zinc 400 — placeholders, metadata */
  --text-disabled:  #d4d4d8;  /* Zinc 300 */

  /* Bordes */
  --border-subtle:  rgba(9, 9, 11, 0.06);
  --border-default: rgba(9, 9, 11, 0.12);
  --border-strong:  rgba(9, 9, 11, 0.20);

  /* Sombras — Apple style */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.02);
  --shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.08);

  /* Estados semánticos */
  --state-success:        #16a34a;
  --state-success-bg:     #f0fdf4;
  --state-success-border: #bbf7d0;
  --state-warning:        #d97706;
  --state-warning-bg:     #fffbeb;
  --state-warning-border: #fde68a;
  --state-error:          #dc2626;  /* SOLO errores, nunca como marca */
  --state-error-bg:       #fef2f2;
  --state-error-border:   #fecaca;
  --state-info:           #0284c7;
  --state-info-bg:        #f0f9ff;
  --state-info-border:    #bae6fd;

  /* Marca — Azul Rey (único color de marca) */
  --ds-brand:            #2563eb;
  --color-primary:       #2563eb;
  --color-primary-hover:  #1d4ed8;
  --color-primary-dark:   #1e40af;
  --color-primary-muted:  rgba(37, 99, 235, 0.08);
  --color-primary-tint:  rgba(37, 99, 235, 0.04);
  --color-primary-text:  #ffffff;
  --accent-border:       rgba(37, 99, 235, 0.20);
  --accent-glow:         rgba(37, 99, 235, 0.15);
  --accent-border-width: 3px;

  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
  --gradient-subtle:  linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(37, 99, 235, 0.02) 100%);

  /* Radius — sistema Apple */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   20px;
  --radius-2xl:  28px;
  --radius-full: 9999px;

  /* Espaciado base 4px */
  --space-1:  4px;  --space-2:  8px;   --space-3:  12px;
  --space-4:  16px; --space-5:  20px;  --space-6:  24px;
  --space-8:  32px; --space-10: 40px;  --space-12: 48px;
  --space-16: 64px;
}

/* ============================================
   DARK MODE — [data-mode='dark']
   Personalidad: inmersivo, técnico, enfocado
   ============================================ */
[data-mode='dark'] {
  --bg-base:     #09090b;   /* Zinc 950 */
  --bg-surface:  #18181b;   /* Zinc 900 */
  --bg-elevated: #27272a;   /* Zinc 800 */
  --bg-subtle:   #2d2d30;
  --bg-surface-mix: #27272a;

  --text-primary:   #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted:     #71717a;
  --text-disabled:  #52525b;

  --border-subtle:  rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.12);
  --border-strong:  rgba(255, 255, 255, 0.20);

  --ds-brand:            #3b82f6;
  --color-primary:       #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-primary-dark:  #2563eb;
  --color-primary-muted: rgba(59, 130, 246, 0.15);
  --color-primary-tint:  rgba(59, 130, 246, 0.08);
  --color-primary-text:  #ffffff;
  --accent-border:       rgba(59, 130, 246, 0.25);
  --accent-glow:         rgba(59, 130, 246, 0.25);
  --shadow-focus:        0 0 0 3px rgba(59, 130, 246, 0.30);

  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #818cf8 100%);
  --gradient-subtle:  linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 100%);
}
```

**Tokens adicionales** (dominio financiero, celebración, motion): ver `_variables.scss` completo.

---

## 🔤 Tipografía

```css
--font-display: 'SF Pro Display', 'Plus Jakarta Sans', system-ui, sans-serif;
--font-body:    'SF Pro Text',    'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono:    'SF Mono', 'JetBrains Mono', monospace;

--text-xs:   0.75rem;   /* 12px */   --text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */   --text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */   --text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */   --text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */

--font-regular: 400;  --font-medium: 500;
--font-semibold: 600; --font-bold: 700;

--leading-tight: 1.25;  --leading-snug: 1.375;
--leading-normal: 1.5;  --leading-relaxed: 1.625;
```

---

## 🪟 Frosted Card System

> ⚠️ Glassmorphism (`backdrop-filter: blur`) fue diseñado para fondos oscuros.
> Sobre fondo blanco produce tarjetas grises y sucias sin profundidad real.
> Usamos **Frosted Cards**: capas definidas con sombras, bordes y tints sutiles.

### Capa 1 — Card Base
```css
.card {
  background:    var(--bg-surface);
  border:        1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow:    var(--shadow-md);
}
/* Hover: gestionado por GsapAnimationsService.addCardHover() */
```

### Capa 2 — Card Accent (elemento ancla del bento)
```css
.card-accent {
  background:  var(--bg-surface);
  border:      1px solid var(--accent-border);
  border-top:  var(--accent-border-width) solid var(--ds-brand);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md), 0 0 0 1px var(--accent-border) inset;
}
```

### Capa 3 — Card Tinted (KPIs, stats, highlights)
```css
.card-tinted {
  background: color-mix(in srgb, var(--ds-brand) 4%, var(--bg-surface-mix));
  border:     1px solid var(--accent-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
```
> Usa `--bg-surface-mix` para soportar dark mode.

### Capa 4 — Panel / Sidebar
```css
.panel {
  background:   var(--bg-surface);
  border-right: 1px solid var(--border-default);
  box-shadow:   var(--shadow-lg);
}
```

---

## 🔲 Bento Grid v2

> Fuente: `src/styles/layout/_bento-grid.scss`

**Arquitectura**: Clases de proporción + `data-attributes` para placement exacto.
**Breakpoints**: 640px · 768px · 1024px
**Columnas**: 1 → 4 → 8 → 12

```css
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

### Clases de proporción

| Clase | Mobile | sm (4) | md (8) | lg (12) |
|-------|--------|--------|--------|---------|
| `bento-square` | full | 2 | 2 | 3 |
| `bento-wide` | full | 4 | 4 | 6 |
| `bento-tall` | full+2r | 2+2r | 2+2r | 3+2r |
| `bento-feature` | full+2r | 4+2r | 6+2r | 8+2r |
| `bento-hero` | 1/-1+2r | 1/-1+2r | 1/-1+2r | 1/-1+2r |
| `bento-banner` | 1/-1 | 1/-1 | 1/-1 | 1/-1 |

### Aliases legacy (compatibilidad)
- `bento-1x1` → bento-square
- `bento-2x1`, `bento-3x1`, `bento-4x1` → bento-wide
- `bento-2x2` → bento-tall
- `bento-3x2` → bento-feature
- `bento-hero` → full-width + 2 filas

### Placement (1024px+)
- `data-col-span="1"` … `"12"`
- `data-col-start="1"` … `"11"`
- `data-row-span="1"` … `"4"`

**Reglas de composición:**
- 1 elemento ancla por sección (`bento-hero` o `bento-4x1`) siempre con `.card-accent`
- Fila de KPIs: 4 × `bento-1x1` con `.card-tinted`
- `.card-accent` máximo 1 por sección
- Color primario visible máximo 2-3 veces por pantalla

---

## 🧱 Componentes

### Botón Primario (tokens)
```css
/* Usar tokens — PrimeNG pButton o clases con: */
--btn-primary-bg:       var(--ds-brand);
--btn-primary-bg-hover:  var(--color-primary-hover);
--btn-primary-text:     var(--color-primary-text);
--btn-primary-radius:   var(--radius-md);
```

### Botón Secundario
```css
--btn-secondary-bg:       transparent;
--btn-secondary-bg-hover: var(--color-primary-muted);
--btn-secondary-border:   var(--border-default);
--btn-secondary-text:     var(--color-primary);
```

### Input (tokens)
```css
--input-bg:             var(--bg-subtle);
--input-border-default:  var(--border-default);
--input-border-focus:    var(--color-primary);
--input-shadow-focus-neutral: var(--shadow-focus);
```

---

## 🎬 Motion — GSAP

> **Regla**: Usar SIEMPRE `GsapAnimationsService`. NUNCA `@angular/animations` ni CSS `@keyframes`.
> Referencia completa: `docs/ANIMATIONS.md`

| Acción | Método |
|--------|--------|
| Entrada bento | `animateBentoGrid(containerEl)` |
| Hero card | `animateHero(el)` |
| KPI counter | `animateCounter(el, target, suffix)` |
| Hover card | `addCardHover(el)` |
| Hover botón | `addButtonHover(el)` |
| Cambio de tema | `animateThemeChange(fn)` |
| Ruta entrada | `animatePageEnter(el)` |
| Ruta salida | `animatePageLeave(el, onComplete)` |
| Skeleton → contenido | `animateSkeletonToContent(el)` |
| Paneles / Drawers | `animatePanelIn/Out`, `animateDrawer`, etc. |

**Transiciones CSS** (color, background, border): usar tokens `--transition-btn`, `--transition-card`, `--transition-color` en `body` y componentes.

---

## 📐 Reglas Do / Don't

### ✅ DO
- Siempre variables CSS — ningún color hardcodeado
- `--state-error` **exclusivamente** para errores de validación
- `--bg-base` como fondo de página siempre
- `.card-accent` solo en el elemento ancla de cada sección
- Mínimo WCAG AA (ratio 4.5:1) en todo texto
- Color primario máximo 2-3 apariciones por vista
- Usar `--ds-brand` o `--color-primary` para acciones de marca
- Usar `--text-primary` / `--text-secondary` / `--text-muted` para jerarquía de texto (nunca mezclar con `--color-primary`)

### ❌ DON'T
- No usar `--color-primary` en mensajes de error — confusión semántica
- No usar `#FFFFFF` puro como fondo de página (usar `--bg-base`)
- No usar `backdrop-filter: blur()` — no funciona bien sobre fondos claros
- No hardcodear ningún color
- No saturar pantallas con el color primario
- No usar `border-radius` menor a `--radius-sm` (6px)
- No usar temas legacy `[data-theme="red"]` / `[data-theme="blue"]` — eliminados; solo light/dark vía `[data-mode='dark']`
