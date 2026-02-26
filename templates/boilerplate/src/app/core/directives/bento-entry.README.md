# BentoEntryDirective — `[appBentoEntry]`

Marca una card dentro de un `bento-grid` para que entre animada sin acoplarla al layout.

## Propósito / responsabilidad

- Añadir la clase `card--animate-entry` al host cuando se monta.
- Permitir que servicios como `GsapAnimationsService.animateBentoGrid(...)` detecten qué celdas deben entrar con animación.
- Evitar que los componentes (feature-card, breakdown-card, etc.) conozcan si viven dentro de un `bento-grid`.

## Selector y uso

- **Selector**: `[appBentoEntry]`
- **Uso típico**:

```html
<section class="bento-grid" appBentoGridLayout aria-label="Panel principal">
  <app-feature-card
    appBentoEntry
    title="Resumen del Hogar"
    size="hero"
    [accent]="true"
  >
    ...
  </app-feature-card>

  <app-category-breakdown-card
    appBentoEntry
    title="Gastos por categoría"
    size="2x2"
  >
    ...
  </app-category-breakdown-card>
</section>
```

## Cuándo usarla vs cuándo no

**Usar `[appBentoEntry]` cuando:**

- El host es una card hija directa de un contenedor `bento-grid`.
- Quieres que esa card participe en la animación de entrada gestionada por GSAP.
- Quieres evitar props de contexto como `inGrid` en los componentes.

**No usarla cuando:**

- La card se muestra fuera de un `bento-grid` (ej. página de detalle con card única).
- El elemento ya gestiona su propia animación de entrada específica.

## Dependencias

- No depende de servicios externos.
- Se complementa con:
  - `BentoGridLayoutDirective` (`[appBentoGridLayout]`) para animar reflows del grid.
  - `GsapAnimationsService.animateBentoGrid(...)` para la animación inicial de las celdas.

