#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Resolving __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the templates directory can be resolved correctly
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

async function main() {
    console.log(chalk.blue.bold('\n🧠 Inicializando Memoria Claude (Blueprint v3.0)\n'));

    let answers;
    if (process.env.TEST_MODE) {
        answers = {
            action: 'Full Scaffold (Angular 20 + PrimeNG + Supabase)',
            projectName: 'test-project'
        };
    } else {
        answers = await inquirer.prompt([
            {
                type: 'list',
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

    let targetDir = process.cwd();

    if (answers.action && answers.action.includes('Full Scaffold')) {
        targetDir = path.join(process.cwd(), answers.projectName);
        console.log(chalk.yellow(`\n🚀 Creando proyecto Angular en ./${answers.projectName}...`));

        try {
            execSync(`npx @angular/cli@latest new ${answers.projectName} --standalone=true --routing=true --style=scss --skip-tests --skip-git=true`, { stdio: 'inherit' });

            console.log(chalk.yellow('\n📦 Instalando dependencias base (PrimeNG, GSAP, Supabase)...'));
            execSync(`npm install primeng @primeng/themes gsap @supabase/supabase-js`, { cwd: targetDir, stdio: 'inherit' });

        } catch (e) {
            console.error(chalk.red('\n❌ Hubo un error al ejecutar ng new.'));
            console.error(chalk.yellow('💡 ASTUCIA: Si el error dice "not available inside a workspace", significa que estás intentando'));
            console.error(chalk.yellow('   crear el proyecto Angular DENTRO de otro proyecto de Angular (como tu base actual).'));
            console.error(chalk.yellow('   👉 Abre una nueva terminal en tu Escritorio o raíz del disco y corre allí el npx.'));
            process.exit(1);
        }
    }

    console.log(chalk.yellow('\n🧠 Inyectando Arquitectura de Agente Claude...\n'));

    // Helper object to track generated directories to ensure not failing if they exist
    const createDir = (dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    };

    // 1. Copy structure recursively
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

    try {
        copyRecursiveSync(TEMPLATES_DIR, targetDir);

        // 2. Inject answers into CLAUDE.md
        const claudePath = path.join(targetDir, 'CLAUDE.md');
        if (fs.existsSync(claudePath)) {
            let content = fs.readFileSync(claudePath, 'utf8');
            content = content.replace(/{{PROJECT_NAME}}/g, answers.projectName || path.basename(targetDir));
            fs.writeFileSync(claudePath, content);
        }

        // Success response
        console.log(chalk.green('✅ Scaffold generado exitosamente.'));
        console.log(chalk.white(`   Directorio base: ${targetDir}`));
        console.log(chalk.white('   Se han creado las carpetas: /docs, /indices, /.agent, y CLAUDE.md en la raíz.'));
        console.log(chalk.blue('\nSiguiente Paso: Abre un chat con Claude o Claude Code y escribe:\n'));
        console.log(chalk.cyan.italic('   "Lee CLAUDE.md para entender el sistema del proyecto y dime si estás listo."\n'));

    } catch (err) {
        console.error(chalk.red('\n❌ Error al crear los archivos:'), err.message);
    }
}

main();
