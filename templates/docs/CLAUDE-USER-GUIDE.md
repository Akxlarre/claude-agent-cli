# 🧠 Guía del Usuario: Cómo Operar a Claude

Bienvenido a tu nuevo Workspace orquestado por **Koa Agent System Blueprint v5.0**.
Este documento es para **TI (el humano)**. Te enseñará a extraer el máximo rendimiento de la inteligencia artificial de este repositorio.

## 1. El Concepto de "Project Knowledge"
Si usas Claude.ai (Pro), debes subir toda la carpeta `/docs`, `/indices` y `CLAUDE.md` a la sección de **Project Knowledge**.
Al hacerlo, Claude tendrá en todo momento el contexto arquitectónico de tu app sin que tengas que explicárselo.

Si usas **Claude Code CLI**, el agente leerá autómaticamente `CLAUDE.md` apenas inicies la consola, y se conectará automáticamente a los servidores MCP (Typescript LSP, Angular CLI, Supabase).

## 2. Prompts Recomendados (Voz de Mando)
Claude a veces intenta ser "demasiado útil" e inventa. Para evitar esto, sé dictatorial y **fuérzalo a usar sus herramientas MCP v5**:

### A. Para Orquestar Nuevos Componentes (Uso de MCP)
> "Usa tu herramienta MCP de Angular (`@angular/cli`) para generar un componente standalone de estadísticas en `features/dashboard`. Después, impleméntale el estilo usando los tokens delineados en `.claude/rules/visual-system.md` (ej. `bg-surface-elevated`). Recuerda inyectar la AI-Readability base a los botones. No lo crees manualmente, orquéstalo."

### B. Para Code Intelligence Profunda (LSP)
> "Estoy viendo un error en la inyección de dependencias en `home.component.ts`. Usa tus herramientas LSP (`get_type_at_position` o `get_symbols`) para revisar la firma exacta del Facade antes de intentar corregirlo a ciegas."

### C. Para Forzar Autocorrección y Guardrails
> "Termina de implementar la tabla de Supabase. AL TERMINAR, DEBES obligatoriamente ejecutar `npm run lint:arch` para verificar que el Validador Arquitectónico pase. Si estalla porque inyectaste un servicio directamente en UI, autocorrígelo aplicando el patrón Facade."

### D. Para Troubleshooting / Debugging Base
> "El proyecto dejó de compilar. Revisa qué archivos tocaste, corrige el error y asegúrate de priorizar lo dictaminado en `TECH-STACK-RULES.md` sin inventar sintaxis."

## 3. Límites Actuales de la IA y Cómo Mitigarlos

1. **Ceguera UI:** Claude no puede ver si la página quedó fea o descuadrada.
   - **Solución:** Dale instrucciones layout precisas: "El componente padre debe ser bento-feature y contener a su derecha dos bento-square apilados".
2. **Amnesia de Sesión:** Si inicias un chat nuevo, Claude olvidará los cambios recientes de la BD o Componentes si no los dejaste documentados.
   - **Solución:** Exige a Claude que use sus integraciones/herramientas (ej. en Claude Code o MCP) para **escribir y actualizar directamente** los archivos markdown de la carpeta `indices/`. Si tu entorno no lo soporta, tú eres el responsable de copiar/pegar las actualizaciones que Claude proponga en el flag `<memory_update>`. La falta de memoria actualizada equivale a deuda técnica garantizada.

## 4. Evolución del Sistema
A medida que tu app escale:
1. Agrégale más `.agent/skills/` (ej: `testing-cypress.md` o `ngrx-rules.md`).
2. Actualiza `.claude/rules/visual-system.md` si cambias tu esquema visual base o tus variables CSS.

**Eres el Arquitecto. Claude es tu Teclado Ultra-rápido.** Delega la escritura, retén el diseño del sistema.
