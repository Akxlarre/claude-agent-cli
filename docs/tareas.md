# Blueprint v7.0 — Plan de Implementacion Detallado

> Fecha: 2026-03-19
> Prerequisito: v6.0 completado. Se recomienda generar 2-3 proyectos reales con v6 antes de iniciar v7.
> Fuentes: roadmap original + hallazgos ESTUDIO.md + evaluacion critica de opinion Gemini

---

## Fase 0: Validacion de v6 (pre-v7)

Antes de construir sobre v6, validar que funciona en escenarios reales.

| Tarea | Criterio de exito |
|-------|-------------------|
| Generar proyecto con `--no-supabase` | Compila, lint:arch pasa, hooks no lanzan errores de Supabase |
| Generar proyecto con `--no-gsap` | Compila, animaciones no referenciadas, architect.js skipea reglas GSAP |
| Generar proyecto full (default) | Compila, `ng serve` funciona, dashboard renderiza |
| Ejecutar `npm run indices:sync` en proyecto generado | Los 4 indices se regeneran correctamente |
| Ejecutar `npm run lint:arch` en proyecto generado | 0 errores, warnings esperados |

**Gate:** No iniciar Fase 1 hasta que los 5 checks pasen.

---

## Fase 1: Quick Wins del Linter (1 sesion)

### WI 7-02: Facades Delgadas

**Archivo:** `templates/boilerplate/scripts/architect.js`

**Implementacion:**
1. Leer el AST existente que ya parsea facades
2. Agregar 2 heurísticas como WARNINGS (no errores):
   - `ARCH-11`: Facade con mas de 5 `inject()` calls → "Consider splitting this facade"
   - `ARCH-12`: Metodo en facade con mas de 50 lineas → "Extract logic to core/utils/"
3. Ambas son warnings, no blocking — el agente las ve pero puede continuar

**Archivos tocados:** `architect.js` (1 archivo)
**Tests:** Agregar 2 fixtures en el linter test: `facade-fat.fixture.ts` y `facade-lean.fixture.ts`
**Riesgo:** Bajo — extension de logica existente

---

### WI 7-04: Pipeline LESSONS -> ANTI-PATTERNS

**Archivos:** `templates/boilerplate/scripts/lint-arch-wrapper.js`

**Implementacion:**
1. `lint-arch-wrapper.js` ya escribe a `LESSONS_LEARNED.md`
2. Agregar script `npm run anti-patterns:review` que:
   - Lee `LESSONS_LEARNED.md`
   - Agrupa por ARCH-ID
   - Si un patron aparece >= 3 veces, lo marca como candidato a promocion
   - Imprime en consola: "Pattern ARCH-03 detected 5 times. Consider adding to ANTI-PATTERNS.md"
3. NO automatizar la promocion — el humano decide

**Archivos tocados:** Nuevo `templates/boilerplate/scripts/anti-patterns-review.js`, `package.json` (nuevo script)
**Tests:** No requiere — es script de reporte, no de logica
**Riesgo:** Bajo

---

## Fase 2: RAG Boilerplate (1-2 sesiones)

### WI 7-05: `--with-rag`

**Prerequisito:** `--no-supabase` y `--with-rag` son mutuamente excluyentes. Validar en `bin/index.js`.

#### Sub-tarea 5.1: Migracion SQL

**Archivo nuevo:** `templates/boilerplate/supabase/migrations/00000000000003_rag_documents.sql`

```sql
-- Tabla base para documentos RAG
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  metadata jsonb default '{}',
  embedding vector(1536),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indice HNSW para busqueda semantica
create index on public.documents
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- RLS
alter table public.documents enable row level security;

-- Funcion de busqueda semantica
create or replace function public.match_documents(
  query_embedding vector(1536),
  match_threshold float default 0.78,
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id, d.title, d.content, d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.documents d
  where 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

#### Sub-tarea 5.2: RagFacade

**Archivo nuevo:** `templates/boilerplate/src/app/core/facades/rag.facade.ts`

Estructura:
- `private _results = signal<RagResult[]>([])` — resultados de busqueda
- `private _isSearching = signal(false)`
- `public readonly results = this._results.asReadonly()`
- `searchSimilar(query: string)` — llama a Edge Function que genera embedding, luego llama a `match_documents` RPC
- NO genera embeddings desde el frontend — siempre via Edge Function

#### Sub-tarea 5.3: Edge Function template

**Archivo nuevo:** `templates/boilerplate/supabase/functions/generate-embedding/index.ts`

- Recibe `{ text: string }` via POST
- Genera embedding via `fetch` a API configurable (env var `EMBEDDING_API_URL`)
- Retorna `{ embedding: number[] }`
- **Decision critica:** NO hardcodear OpenAI. Usar env var para que el usuario configure su provider. Documentar en README que soporta OpenAI, Cohere, o modelos locales via transformers.js

#### Sub-tarea 5.4: Modelo DTO

**Archivo nuevo:** `templates/boilerplate/src/app/core/models/dto/document.model.ts`

```typescript
export interface Document {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface RagResult {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}
```

#### Sub-tarea 5.5: Condicionalidad en CLI

**Archivo:** `bin/index.js`

1. Agregar flag `--with-rag` al inquirer prompts
2. Validar incompatibilidad: `--no-supabase` + `--with-rag` → error con mensaje claro
3. Guardar en `blueprint.json`: `"rag": true/false`
4. Copiar archivos RAG solo si flag activo
5. `architect.js`: skipear validaciones RAG si `blueprint.rag === false`

#### Sub-tarea 5.6: Indices

Agregar entradas a:
- `indices/DATABASE.md` — tabla `documents`, funcion `match_documents`
- `indices/FACADES.md` — `RagFacade`
- `indices/MODELS.md` — `Document`, `RagResult`

**Combinaciones a validar:**
| Combinacion | Debe funcionar |
|-------------|---------------|
| default (sin flag) | Si — sin archivos RAG |
| `--with-rag` | Si — todos los archivos RAG presentes |
| `--with-rag --no-gsap` | Si — RAG sin animaciones |
| `--with-rag --no-supabase` | Error explicito en CLI |

---

## Fase 3: MCP Server Scaffold (1-2 sesiones)

### WI 7-06: `--with-mcp-server`

#### Sub-tarea 6.1: Template del servidor

**Directorio nuevo:** `templates/mcp-server/`

```
templates/mcp-server/
  src/
    index.ts          # Entry point: configura Server, registra resources/tools
    resources/
      schema.ts       # Resource: expone esquema de BD como texto legible
    tools/
      query.ts        # Tool: ejecuta SELECT con filtros (read-only por default)
    config.ts         # Lee env vars (SUPABASE_URL, SUPABASE_SERVICE_KEY)
  package.json
  tsconfig.json
  README.md
```

#### Sub-tarea 6.2: Resource — Schema Introspection

`resources/schema.ts`:
- Conecta a Supabase con service_role key
- Query a `information_schema.columns` para listar tablas/columnas/tipos
- Expone como Resource MCP con URI `supabase://schema`
- El agente puede leer el esquema real de la BD en cualquier momento

#### Sub-tarea 6.3: Tool — Safe Query

`tools/query.ts`:
- Tool MCP que acepta: `{ table: string, select: string, filters?: object, limit?: number }`
- Ejecuta query via Supabase client con `service_role`
- **SOLO SELECT** — no permite INSERT/UPDATE/DELETE por default (seguridad)
- Parametro opcional `allowMutations: boolean` en config para habilitar escritura

#### Sub-tarea 6.4: Integracion con .mcp.json

**Archivo:** `bin/index.js`

1. Si `--with-mcp-server`, agregar entrada a `.mcp.json`:
```json
{
  "mcpServers": {
    "project-db": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "",
        "SUPABASE_SERVICE_KEY": ""
      }
    }
  }
}
```
2. El usuario llena las env vars manualmente (documentado en README)

#### Sub-tarea 6.5: Condicionalidad

- Flag `--with-mcp-server` en inquirer
- `blueprint.json`: `"mcpServer": true/false`
- Compatible con todas las combinaciones excepto `--no-supabase` (misma validacion que RAG)

**NO incluir:**
- Health-check endpoint (innecesario — Claude Code ya maneja errores MCP)
- Prompts MCP (premature — depende del dominio del proyecto, no se puede generalizar)

---

## Fase 4: Custom Rules (1 sesion)

### WI 7-03: `custom-project-rules/`

**Implementacion:**
1. Crear directorio `templates/custom-rules/` con un ejemplo `.yml`:

```yaml
# custom-rules/no-console-log.yml
name: no-console-log
id: CUSTOM-01
severity: error
pattern: "console.log"
file_glob: "src/app/**/*.ts"
message: "Use LoggerService instead of console.log"
doc: "docs/TECH-STACK-RULES.md#logging"
```

2. En `architect.js`, al inicio del lint:
   - Leer todos los `.yml` de `custom-rules/` (si existe el directorio)
   - Parsear con `js-yaml` (ya es dep o agregar)
   - Para cada regla: `grep` el pattern en los archivos que matchean `file_glob`
   - Reportar con el mismo formato `[CUSTOM-XX]` que las reglas built-in

3. Documentar en README: "Agrega archivos .yml a custom-rules/ para extender el linter"

**Archivos tocados:** `architect.js`, nuevo `templates/custom-rules/example.yml`
**Riesgo:** Medio — parsing YAML puede tener edge cases

---

## Fase 5: Update Command (2-3 sesiones) — v7.1

### WI 7-01: `create-koa-agent update`

**Decision arquitectonica:** Diferir a v7.1. Es el WI mas complejo y no bloquea nada.

**Diseño preliminar (para cuando se implemente):**

1. **Managed files** — archivos que el CLI controla al 100%:
   - `.claude/hooks/*`, `.claude/rules/*`, `.claude/skills/*`
   - `scripts/architect.js`, `scripts/indices-sync.js`
   - `docs/HOOKS-SYSTEM.md`, `docs/CLAUDE-USER-GUIDE.md`
   → Estos se SOBRESCRIBEN sin merge

2. **Protected files** — archivos que el usuario modifica:
   - `src/app/**/*`, `supabase/migrations/*`, `indices/*`
   → Estos NUNCA se tocan

3. **Merge files** — archivos hibridos:
   - `package.json` → deep merge (agregar deps nuevas, no borrar las del usuario)
   - `.mcp.json` → deep merge (agregar servers nuevos, no sobrescribir env vars)
   - `angular.json` → merge selectivo (solo campos del blueprint)

4. **Flujo:**
   ```
   create-koa-agent update
   → Lee blueprint.json del proyecto (version actual)
   → Compara con version del CLI instalado
   → Genera diff de managed files
   → Muestra dry-run al usuario
   → Si confirma: backup en .koa-backup/, aplica cambios
   ```

**No implementar ahora.** Documentar el diseño para la proxima sesion.

---

## Fase 6: AI Streaming UI (2 sesiones) — v7.2

### WI 7-07: `--with-ai-ui`

**Decision:** Diferir a v7.2. Es el mas complejo, el de menor ROI inmediato, y requiere que el usuario tenga un backend Node.js configurado.

**Cuando implementar:** Despues de que 7-05 y 7-06 esten validados en proyectos reales.

---

## Matriz de Compatibilidad de Flags

Toda combinacion debe validarse en `bin/index.js` al inicio:

| Flag A | Flag B | Resultado |
|--------|--------|-----------|
| `--with-rag` | `--no-supabase` | ERROR: "RAG requires Supabase" |
| `--with-mcp-server` | `--no-supabase` | ERROR: "MCP Server requires Supabase" |
| `--with-ai-ui` | `--no-primeng` | WARNING: "AI UI chat uses PrimeNG inputs" |
| `--with-rag` | `--with-mcp-server` | OK — independientes, complementarios |
| `--with-rag` | `--no-gsap` | OK — RAG no usa animaciones |
| `--with-mcp-server` | `--no-gsap` | OK |
| `--with-ai-ui` | `--with-rag` | OK — el chat puede usar RAG como backend |

---

## Orden de Ejecucion Final

```
FASE 0 ──> Validar v6 (gate obligatorio)
  |
FASE 1 ──> 7-02 (facades) + 7-04 (lessons pipeline)     [1 sesion]
  |
FASE 2 ──> 7-05 (RAG boilerplate)                        [1-2 sesiones]
  |
FASE 3 ──> 7-06 (MCP Server scaffold)                    [1-2 sesiones]
  |
FASE 4 ──> 7-03 (custom rules)                           [1 sesion]
  |
v7.0 RELEASE ──> Tag + README update
  |
FASE 5 ──> 7-01 (update command)                          [v7.1]
  |
FASE 6 ──> 7-07 (AI streaming UI)                         [v7.2]
```

**Total estimado para v7.0:** 4-6 sesiones de trabajo
**v7.0 scope:** WI 7-02, 7-03, 7-04, 7-05, 7-06
**Diferido a v7.1:** WI 7-01 (update)
**Diferido a v7.2:** WI 7-07 (AI UI)
