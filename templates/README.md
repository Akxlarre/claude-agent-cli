# 🧠 Koa Agent CLI (Blueprint v5.0)

Un orquestador CLI construido en Node.js para auto-generar ecosistemas de trabajo (Angular + Supabase) perfectamente diseñados para ser entendidos y mantenidos por Agentes de IA ( el ecosistema **Claude Pro / Claude Code**).

## 🚀 ¿Qué hace?

A diferencia de un simple *template*, esta herramienta ejecuta comandos reales y deposita una arquitectura estricta:

1. **Scaffolds Reales:** Ejecuta `npx @angular/cli new` por debajo instalando Standalone components, Routing y SCSS.
2. **Dependencias Críticas:** Instala y configura `primeng`, `gsap` y `@supabase/supabase-js`.
3. **Inyección Cerebral (AI Blueprint):** Copia una estructura densa de Markdowns (`/docs`, `/indices`, `/skills`, y un `CLAUDE.md` maestro) directamente dictando las reglas arquitectónicas (Patrón Facade, Atomic Design, Skeletons) a cualquier IA que lea la carpeta.

## 📦 Instalación Global (Opcional)

Si quieres usar esta herramienta desde cualquier lugar en tu máquina, enlaza el paquete globalmente:

```bash
cd /ruta/a/koa-agent-cli
npm link
```

## 🛠️ Uso

Simplemente abre una terminal en la carpeta (fuera de un workspace de Angular existente) donde desees alojar tu nuevo proyecto, y ejecuta:

```bash
create-koa-agent
```

O si no la has hecho global:

```bash
node /ruta/a/koa-agent-cli/bin/index.js
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

> *"Eres el Arquitecto. Claude es tu Teclado Ultra-rápido."*

Este boilerplate busca domar la ventana de 200k tokens de Claude para que en lugar de que improvise arquitecturas "Hola Mundo", siga tus convenciones maduras de nivel enterprise desde el segundo cero.
