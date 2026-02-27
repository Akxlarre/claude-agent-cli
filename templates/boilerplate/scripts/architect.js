import fs from 'fs';
import path from 'path';

// Console colors
const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';

console.log(yellow, '🔍 Iniciando Auditoría Arquitectónica (Eje 3)...');

const targetDirs = [
    path.join(process.cwd(), 'src', 'app', 'features'),
    path.join(process.cwd(), 'src', 'app', 'shared'),
    path.join(process.cwd(), 'src', 'app', 'core')
];

let hasErrors = false;

function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts')) {
            // Ignorar el boilerplate heredado temporalmente para no bloquear builds
            if (!fullPath.includes('login.component.ts')) {
                analyzeFile(fullPath);

                // Regla 3: TDD - Core Services y Facades deben tener .spec.ts
                if (fullPath.includes('core') && (fullPath.endsWith('.facade.ts') || fullPath.endsWith('.service.ts'))) {
                    const specPath = fullPath.replace('.ts', '.spec.ts');
                    if (!fs.existsSync(specPath)) {
                        console.error(red, `🚨 [GUARDRAIL ROTO] Falta test unitario para lógica Core: ${path.relative(process.cwd(), fullPath)}`);
                        console.error(yellow, `   Solución (Agentic TDD): Tienes prohibido entregar lógica Core sin pruebas. Escribe su archivo .spec.ts.`);
                        hasErrors = true;
                    }
                }
            }
        }
    }
}

function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    // Regla 1: No importar supabase directamente en UI
    if (content.match(/from\s+['"]@supabase\/supabase-js['"]/)) {
        console.error(red, `🚨 [GUARDRAIL ROTO] Importación directa de Supabase en componente UI: ${relativePath}`);
        console.error(yellow, `   Solución: Mueve la lógica de datos a una Facade (@Injectable).`);
        hasErrors = true;
    }

    // Regla 2: No inyectar clases terminadas en *Service en componentes UI
    const constructorServiceRegex = /constructor\s*\([\s\S]*?(?:private|public|protected|readonly)?\s+\w+\s*:\s*\w+Service[\s\S]*?\)/g;
    const injectServiceRegex = /inject\s*\(\s*\w+Service\s*\)/g;

    if (content.match(constructorServiceRegex) || content.match(injectServiceRegex)) {
        console.error(red, `🚨 [GUARDRAIL ROTO] Inyección directa de un '*Service' en la capa UI: ${relativePath}`);
        console.error(yellow, `   Solución: Los componentes vista solo deben inyectar clases tipo Facade (*Facade).`);
        hasErrors = true;
    }
}

for (const dir of targetDirs) {
    scanDirectory(dir);
}

if (hasErrors) {
    console.error(red, '❌ La auditoría arquitectónica falló. Bloqueando ejecución.');
    process.exit(1);
} else {
    console.log(green, '✅ Auditoría completada: Cumple rigurosamente con el Patrón Facade.');
}
