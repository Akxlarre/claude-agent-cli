# Brand Guidelines y Theming

> NUNCA usar colores Tailwind arbitrarios hardcodeados (`text-pink-500`, `bg-[#ff0000]`). SIEMPRE usar Tokens.

## Grid y Layout (El Bento Grid)

En este proyecto maquetaremos usando el patrón exclusivo **Bento Grid**:
- El contenedor padre lleva la clase `.bento-grid`.
- Usa las clases de proporción sobre los hijos:
  - `.bento-square` (1x1 normal)
  - `.bento-wide` (2x1 ancho)
  - `.bento-tall` (2x2 alto y ancho)
  - `.bento-feature` (3x2 bloque grande)
  - `.bento-hero` (Full width hero superior)

**Regla Canónica del Bento:** Solo puede haber **UN solo elemento de acento** (`.card-accent`) por sección bento grid.

## Cards y Superficies

Si construyes un contenedor, modal o tarjeta usa las clases CSS permitidas del sistema:
- `.card`: La base por default, con bordes y padding estándar.
- `.card-accent`: Agrega un borde superior con `var(--ds-brand)`.
- `.card-tinted`: Aplica color primario diluido al fondo, ideal para KPIs y Highlights.

## Tokens Tipográficos y Semántica de Color

Para textos e íconos SIEMPRE usa las clases correctas:
- **`text-primary`**: Títulos grandes y legibles.
- **`text-secondary`**: Subtítulos y descripciones.
- **`text-muted`**: Información que no debe resaltar (timestamps, placeholders).
- **`bg-base`**: Para el fondo general (fuera del card).
- **`bg-surface`**: El background de tu componente principal interno.

## Transiciones / Animación (GSAP Obligatorio)

- **No uses CSS `@keyframes`** para animar vistas de entrada.
- Inyecta `GsapAnimationsService` en el `ngAfterViewInit`.
- Métodos clave: `this.gsap.animateBentoGrid(this.grid.nativeElement)`, `animateHero()`, `animateCounter()`.
