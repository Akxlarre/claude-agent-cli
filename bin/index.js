#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Run a command asynchronously so ora can animate freely
function run(cmd, args, opts = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, { ...opts, stdio: 'pipe', shell: true });
        let stderr = '';
        proc.stderr.on('data', d => { stderr += d.toString(); });
        proc.on('close', code => {
            if (code !== 0) reject(new Error(stderr.trim() || `Exit code ${code}`));
            else resolve();
        });
        proc.on('error', reject);
    });
}

// Resolving __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

function printBanner() {
    const border = chalk.blue('║');
    const topBottom = chalk.blue;
    console.log('');
    console.log(topBottom('╔══════════════════════════════════════════════╗'));
    console.log(`${border}                                              ${border}`);
    console.log(`${border}   ${chalk.white.bold('🧠  Claude Agent CLI  ·  Blueprint v4.0')}   ${border}`);
    console.log(`${border}       ${chalk.blue('Angular · Supabase · GSAP · PrimeNG')}   ${border}`);
    console.log(`${border}                                              ${border}`);
    console.log(topBottom('╚══════════════════════════════════════════════╝'));
    console.log('');
}

function printSuccess(projectName, isFull, targetDir) {
    const line = chalk.blue('──────────────────────────────────────────────');
    console.log('');
    console.log(line);
    console.log(`  ${chalk.green('✅')}  ${chalk.white.bold(projectName)} ${chalk.blue('·')} ${chalk.white('Blueprint v4.0 listo')}`);
    console.log(line);
    console.log('');
    console.log(chalk.white.bold('  Próximos pasos:'));
    console.log('');

    let step = 1;

    if (isFull) {
        console.log(`  ${chalk.blue.bold(step)}  ${chalk.cyan(`cd ${projectName}`)}`);
        console.log('');
        step++;
    }

    console.log(`  ${chalk.blue.bold(step)}  ${chalk.white('Configura Supabase MCP')}  ${chalk.gray('(opcional pero recomendado)')}`);
    console.log(`     ${chalk.gray('→')} Edita ${chalk.cyan('.mcp.json')}`);
    console.log(`     ${chalk.gray('→')} Obtén tu token en: ${chalk.cyan('supabase.com/dashboard/account/tokens')}`);
    console.log(`     ${chalk.gray('→')} Reemplaza ${chalk.yellow('YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN')}`);
    console.log('');
    step++;

    if (isFull) {
        console.log(`  ${chalk.blue.bold(step)}  ${chalk.white('Inicia el servidor')}`);
        console.log(`     ${chalk.gray('→')} ${chalk.cyan('ng serve')}`);
        console.log('');
        step++;
    }

    console.log(`  ${chalk.blue.bold(step)}  ${chalk.white('Abre Claude Code y escribe:')}`);
    console.log(`     ${chalk.cyan.italic('"Lee CLAUDE.md y dime si estás listo para trabajar."')}`);
    console.log('');

    if (isFull) {
        console.log(`  ${chalk.white('Shortcuts disponibles:')}`);
        console.log(`     ${chalk.cyan('npm run claude:review')}   ${chalk.gray('Auditoría de arquitectura')}`);
        console.log(`     ${chalk.cyan('npm run claude:sync')}     ${chalk.gray('Sincroniza índices del proyecto')}`);
        console.log(`     ${chalk.cyan('npm run claude:fix')}      ${chalk.gray('Corrige errores de lint automáticamente')}`);
        console.log('');
    }

    console.log(line);
    console.log('');
}

async function main() {
    printBanner();

    let answers;
    if (process.env.TEST_MODE === 'inject') {
        answers = { action: 'Solo inyectar Memoria Claude en carpeta actual' };
    } else if (process.env.TEST_MODE) {
        answers = {
            action: 'Full Scaffold (Angular 20 + PrimeNG + Supabase)',
            projectName: process.env.TEST_PROJECT_NAME || 'test-project'
        };
    } else {
        answers = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'action',
                message: '¿Qué deseas hacer?',
                choices: [
                    'Full Scaffold (Angular 20 + PrimeNG + Supabase + Boilerplate AI)',
                    'Solo inyectar Memoria Claude en carpeta actual'
                ]
            },
            {
                type: 'input',
                name: 'projectName',
                message: '¿Cuál es el nombre del proyecto?',
                default: path.basename(process.cwd()),
                when: (ans) => ans.action.includes('Full Scaffold')
            }
        ]);
    }

    const isFull = answers.action && answers.action.includes('Full Scaffold');
    let targetDir = process.cwd();

    if (isFull) {
        targetDir = path.join(process.cwd(), answers.projectName);

        // --- Spinner: ng new ---
        const spinnerNg = ora({
            text: chalk.yellow('Creando proyecto Angular (puede tardar 1-2 min)...'),
            color: 'yellow'
        }).start();

        try {
            await run(
                `npx @angular/cli@latest new ${answers.projectName} --standalone=true --routing=true --style=scss --skip-tests --skip-git=true`,
                [], {}
            );
            spinnerNg.succeed(chalk.green('Proyecto Angular creado'));
        } catch (e) {
            spinnerNg.fail(chalk.red('Error al ejecutar ng new'));
            console.error('');
            console.error(chalk.yellow('💡 Si el error dice "not available inside a workspace", significa que estás'));
            console.error(chalk.yellow('   intentando crear el proyecto DENTRO de otro workspace de Angular.'));
            console.error(chalk.yellow('   👉 Abre una nueva terminal en tu Escritorio o raíz del disco e inténtalo allí.'));
            process.exit(1);
        }

        // --- Spinner: npm install ---
        const spinnerNpm = ora({
            text: chalk.yellow('Instalando dependencias (PrimeNG, GSAP, Supabase)...'),
            color: 'yellow'
        }).start();

        try {
            await run(
                `npm install primeng @primeng/themes gsap @supabase/supabase-js`,
                [], { cwd: targetDir }
            );
            spinnerNpm.succeed(chalk.green('Dependencias instaladas'));
        } catch (e) {
            spinnerNpm.fail(chalk.red('Error al instalar dependencias'));
            console.error(chalk.gray(e.message));
            process.exit(1);
        }
    }

    // --- Spinner: template injection ---
    const spinnerBlueprint = ora({
        text: chalk.yellow('Inyectando Blueprint v4.0...'),
        color: 'blue'
    }).start();

    // Recursive copy helper
    const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();

        if (isDirectory) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    };

    // Replace template variables in a file
    const injectVars = (filePath, projectName) => {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
            fs.writeFileSync(filePath, content);
        }
    };

    try {
        // 1. Copy everything from templates/ except boilerplate/
        fs.readdirSync(TEMPLATES_DIR).forEach(item => {
            if (item !== 'boilerplate') {
                copyRecursiveSync(
                    path.join(TEMPLATES_DIR, item),
                    path.join(targetDir, item)
                );
            }
        });

        const projectName = answers.projectName || path.basename(targetDir);

        // 2. Inject project name into both CLAUDE.md locations
        injectVars(path.join(targetDir, 'CLAUDE.md'), projectName);
        injectVars(path.join(targetDir, '.claude', 'CLAUDE.md'), projectName);

        spinnerBlueprint.succeed(chalk.green('Blueprint inyectado'));

        // 3. If Full Scaffold: inject code boilerplate + patch app.config.ts + add npm scripts
        if (isFull) {
            const BOILERPLATE_SRC = path.join(TEMPLATES_DIR, 'boilerplate', 'src');
            if (fs.existsSync(BOILERPLATE_SRC)) {
                copyRecursiveSync(BOILERPLATE_SRC, path.join(targetDir, 'src'));

                // Patch app.config.ts with PrimeNG provider
                const appConfigPath = path.join(targetDir, 'src', 'app', 'app.config.ts');
                if (fs.existsSync(appConfigPath)) {
                    let configStr = fs.readFileSync(appConfigPath, 'utf8');
                    if (!configStr.includes('providePrimeNG')) {
                        const importsToAdd =
                            `import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';\n` +
                            `import { providePrimeNG } from 'primeng/config';\n` +
                            `import Aura from '@primeng/themes/aura';\n`;

                        configStr = importsToAdd + configStr;
                        configStr = configStr.replace(
                            /providers: \[([^\]]+)\]/,
                            `providers: [$1, provideAnimationsAsync(), providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.fake-dark-mode', cssLayer: { name: 'primeng', order: 'tailwind-base, primeng, tailwind-utilities' } } } })]`
                        );
                        fs.writeFileSync(appConfigPath, configStr);
                        console.log(chalk.green('   ✓ app.config.ts configurado'));
                    }
                }

                // 4. Inject claude headless scripts into package.json
                const pkgPath = path.join(targetDir, 'package.json');
                if (fs.existsSync(pkgPath)) {
                    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                    pkg.scripts = {
                        ...pkg.scripts,
                        'claude:review': 'claude -p "Revisa el código de esta sesión y sugiere mejoras de arquitectura" --allowedTools Read,Glob,Grep',
                        'claude:sync': 'claude -p "Ejecuta /sync-indices para actualizar los índices del proyecto" --allowedTools Read,Edit,Glob,Grep',
                        'claude:fix': 'claude -p "Ejecuta ng lint, identifica los errores y corrígelos" --allowedTools Read,Edit,Bash',
                    };
                    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
                    console.log(chalk.green('   ✓ Scripts claude:* agregados'));
                }
            }
        }

        printSuccess(answers.projectName || path.basename(targetDir), isFull, targetDir);

    } catch (err) {
        spinnerBlueprint.fail(chalk.red('Error al inyectar Blueprint'));
        console.error(chalk.gray(err.message));
        process.exit(1);
    }
}

main();
