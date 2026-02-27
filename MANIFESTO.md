# MANIFIESTO: El Amanecer del Desarrollo AI-Native

## La Gran Fricción
Estamos en una era donde la IA puede escribir miles de líneas de código en segundos. Sin embargo, el cuello de botella ya no es la escritura, sino la **orquestación**. Cuando lanzas a una IA a un repositorio desordenado, el resultado es deuda técnica acelerada.

`claude-agent-cli` nace para resolver la paradoja del desarrollador moderno: **¿Cómo mantengo la calidad de arquitecto senior operando a la velocidad de una IA?** Nuestro objetivo es equipar al **Arquitecto de Sistemas Agénticos** (o AI Workflow Engineer) con las herramientas precisas para escalar su visión.

## Los 4 Superpoderes del Arquitecto Agéntico

### 1. Ingeniería de Contexto 2.0 (LSP y Contexto Dinámico)
No inyectamos solo código y markdown muertos; inyectamos **memoria viva**. A través de la integración nativa y obligatoria de **Language Server Protocol (`ts-lsp-mcp`)**, la IA ya no adivina sintaxis. Es capaz de leer tu AST, consultar referencias cruzadas, evaluar firmas de métodos estáticos y resolver el código de la misma forma determinista en que lo haría un humano desde su IDE.

### 2. Orquestación Atómica de Herramientas (MCP)
El asistente no trabaja en el vacío y no debe limitarse a simular bash. Diseñamos este CLI para conectarse con el "mundo real". A través del protocolo MCP (Model Context Protocol), obligamos a la IA a delegar la generación estructural a herramientas pre-verificadas (`@angular/cli mcp`) y a manipular entornos relacionales sin fisuras usando conectores vivos de base de datos (`supabase-mcp`).

### 3. Guardrails Programáticos (Shadow CI)
En lugar de decirle a la IA qué hacer mediante rezos en Prompts, limitamos matemáticamente **lo que tiene prohibido hacer**. 
Nuestra arquitectura v5 introduce **Linters Arquitectónicos de AST** inyectados (`architect.js`) que actúan como un *Shadow CI*. Si la IA alucina e intenta evadir las capas de inyección (por ejemplo, importando Supabase directo desde un componente visual en vez de una Facade), la herramienta romperá el flujo, exigiendo una auto-corrección inmediata. Nosotros diseñamos el plano; ella cumple los límites duros del validador.

### 4. Testing Autónomo (Autonomous Validation)
Una *Feature* no es solo código escrito, es código probado empíricamente. El agente asume el rol de QA a nivel lógico. En este sistema, la IA tiene **prohibido** dar por terminada una Feature que altere la lógica de negocio sin actualizar o crear el test unitario (`.spec.ts`) o E2E correspondiente que valide dicho comportamiento en la respectiva `Facade`.

### Nuestra Apuesta Técnica
- **Angular**: Por su estructura rígida y orientada a tipos, ideal para que una IA no cometa errores de referencia.
- **Supabase**: Por su velocidad de iteración y esquema relacional claro.
- **Strict Patterns**: El uso de `OnPush`, `Signals` y `Facades` garantiza que el estado estricto de la aplicación sea predecible para un agente.
- **Visuales Dictatoriales (Tokens & Bento Grid)**: Prohibimos a la IA "diseñar" con clases nativas incontrolables; la atamos a un Design System crudo (`branding tokens`) para curar su "ceguera UI" y garantizar componentes que luzcan premium de fábrica.

---

**Construye más rápido. Piensa más profundo. Deja que Claude se encargue del boilerplate.**
