# Reglas del Tech Stack (Angular v20+, Supabase, GSAP)

> **Importante para Agentes:** NUNCA rompas estas reglas de arquitectura.

## 1. Patrones de Diseño Arquitectónico Obligatorios

### A. Patrón Facade Estricto
- **NUNCA** inyectes `SupabaseService`, `HttpClient`, o referencias directas a bases de datos en los Componentes UI (`*.component.ts`).
- **SIEMPRE** usa un Patrón Facade: La UI llama a un `*FacadeService` y éste delega en la red. El Facade expone el estado global vía Signals.

### B. Smart vs Dumb Components (Atomic Design)
- **Dumb Components (`shared/`):** El 90% de tu UI. Solo reciben data por `input()` y emiten eventos por `output()`. No saben de dónde viene la data. (Ej: `kpi-card`).
- **Smart Components (`features/`):** Tienen inyectado el Facade. Son responsables de coordinar los Dumb Components pasando states/Signals. Son las "Páginas".
- **Skeletons Colocated:** Todo Dumb component que reciba data asíncrona debe tener su `{componente}-skeleton.component.ts` al lado de él que mantenga EXACTAMENTE el mismo layout y proporciones del grid.

## 2. Reactividad & Angular v20+ Signals
- **`ChangeDetectionStrategy.OnPush`** es OBLIGATORIO en TODO componente creado.
- **Estado UI (Sincrónico):** Usa `signal()` para contadores, modales abiertos, etc.
- **Flujos Async / Red:** Usa `RxJS` internamente en los servicios. En el nivel de la Facade, usa la función `toSignal()` para exponer los flujos a tu HTML.
- **Templates:** Prohibido usar `*ngIf` o `*ngFor`. Usa obligatoriamente el Control Flow nativo: `@if` y `@for`.
- **Inputs:** Migra `@Input()` y `@Output()` hacia las nuevas APIs de Signals (`input()`, `output()`).
- No uses `ngClass` o `ngStyle`, usa binding directo: `[class.active]="isActive()"` o `[style.width.px]="width()"`.

## 3. Jerarquía Visual (Design System -> PrimeNG -> Custom)
Antes de crear un componente presentacional, consulta en este orden:
1. `indices/COMPONENTS.md`: ¿El Boilerplate (Design System local) tiene algo aplicable? Si la respuesta es sí, úsalo.
2. `PrimeNG`: En inputs de data, dropdowns complejos, calendarios, usa `p-dropdown`, `p-calendar` etc. (Ver [PrimeNG Priority Rule](../skills/primeng-priority.md)).
3. Componente Custom: Solo escríbelo si los pasos 1 y 2 no cubrieron la necesidad.

## 4. Base de Datos & Base de Trabajo (Supabase Migrations)
- Todo esquema DDL va en la carpeta `supabase/migrations/` (Naming convention: `YYYYMMDDHHMMSS_<dominio>_<tipo>_<descripcion>.sql`).
- SIEMPRE documentar en `indices/DATABASE.md` cada nueva tabla y su política de Row Level Security (RLS).
- Si usas Supabase realtime, actualiza tus servicios usando RxJS `Observable` -> `toSignal()`.

## 5. Testing y Validación Autónoma
- **Testeo Obligatorio de Facades:** Toda lógica de negocio, transformación de datos o interacción con Supabase que resida en una `Facade` debe tener su respectivo archivo `.spec.ts` construido o actualizado de forma autónoma por el agente.
- **Validación de Flujos:** Los tests deben enfocarse en aislar y validar el comportamiento de los `Signals` expuestos y de los flujos asíncronos (`RxJS`), garantizando que la UI reciba el estado correcto ante cada eventualidad.
- **Evitar Over-Testing en UI pura:** No malgastes tokens ni recursos testeando exhaustivamente *Dumb Components* en el DOM a menos que contengan lógica muy compleja. El foco fundamental de validación garantizada es siempre el núcleo lógico (Facades) y la orquestación principal (Smart Components).
