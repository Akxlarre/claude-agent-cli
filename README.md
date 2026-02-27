# 🧠 Claude Agent CLI (Blueprint v5.0)

**El orquestador definitivo para el Arquitecto de Sistemas Agénticos (AI Workflow Engineer).**

`claude-agent-cli` es un motor de scaffolding construido en Node.js diseñado para generar ecosistemas de trabajo (Angular + Supabase) optimizados específicamente para ser operados por Agentes de IA (específicamente **Claude 3.7 Sonnet** y **Claude Code**).

## 🎯 Nuestra Misión
Empoderar al **Arquitecto Agéntico**. Cerrar la brecha entre el diseño humano y la ejecución de la IA. En lugar de generar código genérico, este CLI inyecta una **Arquitectura AI-Native** estricta que domina la ventana de contexto de la IA, transformando a Claude de un asistente que "adivina" a un teclado ultra-rápido que sigue tus convenciones exactas.

## 🚀 Arquitectura v5.0 (Los 4 Pilares)

1.  **Context Engineering 2.0 (LSP vía MCP):** El proyecto se genera con conectividad nativa a `ts-lsp-mcp`. La IA ya no está ciega ni es dependiente de RAG plano; puede consultar el AST completo, inferir tipos, variables estáticas y referencias cruzadas en tiempo real.
2.  **Tooling y Orquestación Avanzada:** Autoconfiguración de Angular CLI y Supabase a través de *Model Context Protocol* (`.mcp.json`). La IA puede generar estructuralmente módulos de código y bases de datos disparando herramientas oficiales en lugar de comandos Bash frágiles.
3.  **Guardrails Programáticos (Shadow CI):** No bastaban las instrucciones en texto. v5.0 inyecta un Linter Arquitectónico (AST) en JavaScript (`architect.js`) capaz de bloquear y fallar la compilación si la IA intenta romper el Patrón Facade inyectando Supabase directamente a la UI.
4.  **Testing Autónomo:** Obligación irrefutable para la IA de crear y actualizar tests unitarios antes de dar por cerrada cualquier iteración de código de negocio.


## 📦 Instalación Global (Opcional)

Si quieres usar esta herramienta desde cualquier lugar en tu máquina, enlaza el paquete globalmente:

```bash
cd /ruta/a/claude-agent-cli
npm link
```

## 🛠️ Uso

Simplemente abre una terminal en la carpeta (fuera de un workspace de Angular existente) donde desees alojar tu nuevo proyecto, y ejecuta:

```bash
create-claude-agent
```

O si no la has hecho global:

```bash
node /ruta/a/claude-agent-cli/bin/index.js
```

### Opciones Interactivas
El asistente interactivo (`inquirer`) te preguntará:
- **Acción:** `Full Scaffold (Angular 20 + PrimeNG + Supabase + Boilerplate AI)` o `Solo inyectar Memoria Claude en carpeta actual`.
- **Nombre del proyecto:** Para estructurar correctamente la carpeta principal.

## 🏛️ Arquitectura Inyectada (El "Blueprint")

Cuando inyectas la "Memoria Claude", obtienes:

- `CLAUDE.md`: La directiva principal que gobierna cómo la IA debe escribir código (Uso estricto de OnPush, Signals y prohibición de inyectar dependencias directamente en la UI).
- `docs/TECH-STACK-RULES.md`: Explicación cruda sobre *Smart vs Dumb Components*.
- `docs/CLAUDE-USER-GUIDE.md`: Instrucciones para el **Humano** sobre cómo darle los mejores prompts a Claude.
- `docs/BRAND_GUIDELINES.md`: Tokens estandarizados prohibiendo las clases abusivas de Tailwind.
- `indices/`: Índices de base de datos y componentes que Claude mantendrá vivos.

## 🤝 Filosofía

> *"Eres el Arquitecto Agéntico. Claude es tu Maestro de Obra y Teclado Ultra-rápido."*

Este boilerplate busca domar la ventana de 200k tokens de Claude para que en lugar de que improvise arquitecturas "Hola Mundo", siga tus convenciones maduras de nivel enterprise desde el segundo cero.
