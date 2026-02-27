/**
 * architect.js — Linter Arquitectónico (Guardrails)
 *
 * Analiza el código fuente usando el AST real de TypeScript en lugar de Regex.
 * Esto elimina falsos positivos por imports comentados, strings, etc.
 *
 * Reglas activas:
 *   1. Ningún archivo en la capa UI puede importar '@supabase/supabase-js' directamente.
 *   2. Ningún *.component.ts en features/ o shared/ puede inyectar un *Service directamente
 *      (solo Facades están permitidos en los componentes vista).
 *   3. Todo *.facade.ts y *.service.ts dentro de core/ debe tener su .spec.ts compañero.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// TypeScript es una dependencia de Angular. Usamos createRequire para importar
// el paquete CJS de TypeScript desde un contexto ESM de forma segura.
const require = createRequire(import.meta.url);
const ts = require('typescript');

// ─── Colores de consola ───────────────────────────────────────────────────────
const red    = '\x1b[31m%s\x1b[0m';
const green  = '\x1b[32m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';

console.log(yellow, '🔍 Iniciando Auditoría Arquitectónica (AST Mode)...');

const targetDirs = [
    path.join(process.cwd(), 'src', 'app', 'features'),
    path.join(process.cwd(), 'src', 'app', 'shared'),
    path.join(process.cwd(), 'src', 'app', 'core'),
];

let hasErrors = false;

// ─── Utilidades ──────────────────────────────────────────────────────────────

/** Comprueba si un segmento de ruta pertenece a un directorio concreto. */
function pathContainsSegment(filePath, segment) {
    return filePath.split(path.sep).includes(segment);
}

/** Recorre un nodo AST y sus descendientes en profundidad. */
function walkAst(node, visitor) {
    visitor(node);
    ts.forEachChild(node, child => walkAst(child, visitor));
}

// ─── Análisis por archivo ─────────────────────────────────────────────────────

function analyzeFile(filePath) {
    const content     = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    // Parsear con el compilador de TypeScript (AST real)
    const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        /* setParentNodes */ true,
    );

    // ── Regla 1: Sin importación directa de Supabase en la capa UI ────────────
    for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement)) {
            const specifier = statement.moduleSpecifier
                .getText(sourceFile)
                .replace(/['"]/g, '');

            if (specifier === '@supabase/supabase-js') {
                console.error(red, `🚨 [GUARDRAIL ROTO] Importación directa de Supabase en capa UI: ${relativePath}`);
                console.error(yellow, `   Solución: Mueve la lógica de datos a una Facade (@Injectable).`);
                hasErrors = true;
            }
        }
    }

    // ── Regla 2: Sin inject(*Service) en componentes vista ────────────────────
    // Solo aplica a *.component.ts dentro de features/ o shared/.
    const isViewComponent =
        filePath.endsWith('.component.ts') &&
        (pathContainsSegment(filePath, 'features') || pathContainsSegment(filePath, 'shared'));

    if (isViewComponent) {
        walkAst(sourceFile, node => {
            if (!ts.isCallExpression(node)) return;

            const callee = node.expression;
            if (!ts.isIdentifier(callee) || callee.text !== 'inject') return;
            if (node.arguments.length === 0) return;

            const argText = node.arguments[0].getText(sourceFile);

            // Dispara si el argumento termina en 'Service' pero NO en 'FacadeService'
            if (argText.endsWith('Service') && !argText.endsWith('FacadeService')) {
                console.error(red, `🚨 [GUARDRAIL ROTO] Inyección directa de un '*Service' en componente vista: ${relativePath}`);
                console.error(yellow, `   Solución: Los componentes vista solo deben inyectar clases tipo Facade (*Facade).`);
                hasErrors = true;
            }
        });
    }
}

// ─── Recorrido de directorios ─────────────────────────────────────────────────

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
            continue;
        }

        if (!fullPath.endsWith('.ts') || fullPath.endsWith('.spec.ts')) continue;

        analyzeFile(fullPath);

        // ── Regla 3: TDD — Core Services y Facades deben tener .spec.ts ──────
        const isCoreLogic =
            pathContainsSegment(fullPath, 'core') &&
            (fullPath.endsWith('.facade.ts') || fullPath.endsWith('.service.ts'));

        if (isCoreLogic) {
            const specPath = fullPath.replace('.ts', '.spec.ts');
            if (!fs.existsSync(specPath)) {
                console.error(red, `🚨 [GUARDRAIL ROTO] Falta test unitario para lógica Core: ${path.relative(process.cwd(), fullPath)}`);
                console.error(yellow, `   Solución (Agentic TDD): Escribe el archivo .spec.ts compañero.`);
                hasErrors = true;
            }
        }
    }
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

for (const dir of targetDirs) {
    scanDirectory(dir);
}

if (hasErrors) {
    console.error(red, '❌ La auditoría arquitectónica falló. Bloqueando ejecución.');
    process.exit(1);
} else {
    console.log(green, '✅ Auditoría completada: Cumple rigurosamente con el Patrón Facade.');
}
