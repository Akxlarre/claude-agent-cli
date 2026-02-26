# 🧠 Guía del Usuario: Cómo Operar a Claude

Bienvenido a tu nuevo Workspace orquestado por **Claude Agent System Blueprint v3**.
Este documento es para **TI (el humano)**. Te enseñará a extraer el máximo rendimiento de la inteligencia artificial de este repositorio.

## 1. El Concepto de "Project Knowledge"
Si usas Claude.ai (Pro), debes subir toda la carpeta `/docs`, `/indices` y `CLAUDE.md` a la sección de **Project Knowledge**.
Al hacerlo, Claude tendrá en todo momento el contexto arquitectónico de tu app sin que tengas que explicárselo.

Si usas **Claude Code CLI**, el agente leerá autómaticamente `CLAUDE.md` apenas inicies la consola.

## 2. Prompts Recomendados (Voz de Mando)
Claude a veces intenta ser "demasiado útil" e inventa. Para evitar esto, sé dictatorial. Usa estos prompts probados:

### A. Para Crear Componentes Nuevos
> "Quiero crear una nueva card para mostrar estadísticas de ventas semanales. Antes de escribir código, revisa `indices/COMPONENTS.md` para ver si puedo reusar un componente base. Si no, géneralo en `shared/components` respetando el Bento Grid e implementa su respectivo Skeleton Colocated según las reglas. Respeta `BRAND_GUIDELINES.md` para los estilos, no uses tailwind genérico."

### B. Para Feature Nuevas (Flujo Completo)
> "Necesito implementar la feature de Pagos. Primero, planea el schema de BD y créalo en `supabase/migrations`. Luego, crea el `PagosFacadeCoreService` e impleméntalo siguiendo nuestras reglas de Facade en `TECH-STACK-RULES.md`. Finalmente, crea un componente Smart en `features/pagos`."

### C. Para Forzar Documentación
> "Haz el refactor de Auth. AL TERMINAR, DEBES obligatoriamente imprimir un bloque `<memory_update>` para que yo copie las alertas en mis índices."

## 3. Límites Actuales de la IA y Cómo Mitigarlos

1. **Ceguera UI:** Claude no puede ver si la página quedó fea o descuadrada.
   - **Solución:** Dale instrucciones layout precisas: "El componente padre debe ser bento-feature y contener a su derecha dos bento-square apilados".
2. **Amnesia de Sesión:** Si inicias un chat nuevo, Claude olvidará los cambios recientes de la BD o Componentes si no los dejaste documentados.
   - **Solución:** Por eso exigimos el paso 4 (`<memory_update>`). Tú eres el responsable de copiar/pegar las actualizaciones que Claude proponga hacia los archivos `.md` de la carpeta `indices/`.

## 4. Evolución del Sistema
A medida que tu app escale:
1. Agrégale más `.agent/skills/` (ej: `testing-cypress.md` o `ngrx-rules.md`).
2. Actualiza `BRAND_GUIDELINES.md` si cambias tu esquema visual.

**Eres el Arquitecto. Claude es tu Teclado Ultra-rápido.** Delega la escritura, retén el diseño del sistema.
