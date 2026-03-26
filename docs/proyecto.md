📘 KOA AGENT CLI - DOCUMENTACIÓN COMPLETA Y ANÁLISIS TÉCNICO
Versión: 1.0
Fecha: Marzo 2026
Autor del análisis: Basado en conversaciones con Benjamín Rebolledo
Estado: Producto funcional, no publicado en NPM

1. RESUMEN EJECUTIVO
¿Qué es Koa Agent CLI?
Koa Agent CLI es una herramienta de línea de comandos creada por Benjamín Rebolledo que genera proyectos Angular con una arquitectura AI-resistente. A diferencia de los boilerplates tradicionales, Koa implementa un sistema de enforcement activo mediante hooks que bloquean (no solo advierten) violaciones arquitectónicas en tiempo real cuando agentes de IA como Claude Code intentan escribir código que degrada la calidad del proyecto.
El sistema se compone de tres capas fundamentales: (1) un CLI orquestador basado en Node.js que gestiona la creación del proyecto, (2) un conjunto de blueprints/templates que inyectan la estructura base incluyendo guardrails, memoria de contexto y hooks de validación, y (3) un sistema de enforcement que intercepta operaciones de escritura de archivos y ejecuta process.exit(2) si detecta violaciones de las reglas arquitectónicas establecidas.
Problema que Resuelve
Cuando desarrolladores utilizan agentes de IA para programar (Claude Code, Cursor, GitHub Copilot), los modelos de lenguaje frecuentemente generan código que:

Hardcodea valores que deberían usar tokens de diseño
Obvia OnPush change detection en Angular
Mezcla lógica de negocio con componentes UI
Usa patrones legacy (@angular/animations en lugar de GSAP)
Crea componentes monolíticos en lugar de Smart/Dumb separation
Ignora las convenciones establecidas del proyecto

El problema fundamental es que el código generado por IA "parece correcto" y compila sin errores, pero viola principios arquitectónicos que degradan la mantenibilidad del código a largo plazo. Los linters tradicionales no capturan estas violaciones porque son reglas de negocio específicas del proyecto, no errores sintácticos.
Benjamín describe el impacto: lo que antes le tomaba "3 días" de desarrollo ahora lo completa en "unas horas" cuando usa Koa, porque el agente no puede desviarse de la arquitectura establecida.
Value Proposition Única
"Shadow CI in Development Time" - Koa funciona como un sistema de integración continua que valida arquitectura ANTES de que el código sea escrito, no después. A diferencia de:

Skills/prompts manuales (Web Reactiva): Requieren que el agente "recuerde" seguir las reglas, pero no hay enforcement
Linters tradicionales (ESLint, TSLint): Solo validan sintaxis, no arquitectura de negocio
Code review humano: Ocurre después de escribir el código, no previene la escritura
CI/CD checks: Detectan problemas post-commit, Koa los previene pre-write

El moat técnico es el enforcement agresivo: los hooks no sugieren, no advierten, BLOQUEAN. Si Claude intenta escribir código que hardcodea un color Tailwind, la operación falla con process.exit(2) y stderr explica qué regla violó.
Para Quién Es
Target primario: Desarrolladores Angular que usan AI coding tools y quieren mantener arquitectura enterprise-grade a pesar de la tendencia de los LLMs a generar código "rápido pero sucio".
Target secundario: Equipos de desarrollo que necesitan onboarding rápido de nuevos developers (junior o AI-assisted) sin comprometer standards de código.
Anti-target: Proyectos donde la velocidad de prototipado es más importante que la arquitectura a largo plazo, o developers que no usan Angular o no trabajan con agentes de IA.

2. DESCRIPCIÓN TÉCNICA COMPLETA
2.1 Arquitectura del Sistema
┌─────────────────────────────────────────────────────────┐
│                    CAPA CLI                              │
│  bin/index.js (Node.js orchestrator)                    │
│  • Validación de plataforma (Windows/Mac/Linux)         │
│  • Wizard interactivo (Inquirer.js)                     │
│  • Gestión de procesos asíncronos (spawn)               │
│  • Spinners animados para feedback                      │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                CAPA BLUEPRINT                            │
│  templates/                                              │
│  ├── .claude/          (Memoria y reglas para Claude)   │
│  ├── docs/             (Documentación técnica)          │
│  ├── indices/          (Progressive disclosure)         │
│  └── boilerplate/      (Código base Angular)            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA ENFORCEMENT                            │
│  Hooks system:                                           │
│  • pre-write-guard.js  (Intercepta escrituras)          │
│  • bash-guard.js       (Valida comandos shell)          │
│  • Validación exhaustiva con process.exit(2)            │
│  • Escape agresivo ante violaciones                     │
└─────────────────────────────────────────────────────────┘
Flujo de Ejecución Completo:

Inicialización:

bash   npx create-koa-agent
   # o desde código fuente localmente

Wizard interactivo:

Inquirer.js presenta opciones
Usuario elige: Full Scaffold vs Solo Memoria
Full Scaffold: crea proyecto Angular completo
Solo Memoria: solo inyecta sistema .claude/


Scaffold (si Full):

javascript   // Pseudo-código del proceso
   const platform = process.platform === 'win32' ? 'npm.cmd' : 'npm';
   
   spawn('ng', ['new', projectName], { shell: true })
     .then(() => installDependencies())
     .then(() => injectTemplates())
     .then(() => configureAngularJson())
     .then(() => setupTsConfig())
     .then(() => injectHooks())
     .then(() => createMemorySystem())

Inyección de componentes:

/docs: documentación arquitectural
/indices: listados de componentes/servicios/DB schemas
CLAUDE.md: reglas y contexto para el agente
Hooks: guardias de validación
Boilerplate: componentes base con patrones aprobados


Configuración automática:

angular.json: paths, assets, estilos
tsconfig.json: strict mode, paths mapping
.mcp.json: placeholder para API key (requiere llenado manual)


Resultado final:
Proyecto Angular listo para desarrollo con agente IA que NO puede degradar arquitectura.

2.2 Características Técnicas Detalladas
Funcionalidad de Instalación
Proceso Completo Paso a Paso:
bash# Estado actual (pre-NPM)
git clone [koa-repo]
cd koa-agent-cli
npm install
npm link  # hace create-koa-agent disponible globalmente

# Uso
create-koa-agent my-project

# Wizard presenta:
? Nombre del proyecto: my-project
? Tipo de instalación: 
  ❯ Full Scaffold (Angular + Koa completo)
    Solo Memoria (inyectar .claude/ en proyecto existente)
? Usar PrimeNG: (Y/n) Y
? Usar Tailwind v4: (Y/n) Y
? Configurar Supabase: (Y/n) Y

# Si Full Scaffold:
[spinner] Creando proyecto Angular...
[spinner] Instalando PrimeNG...
[spinner] Configurando Tailwind...
[spinner] Inyectando sistema Koa...
[spinner] Configurando hooks...
✓ Proyecto creado exitosamente

# Siguiente paso manual:
cd my-project
# Editar .mcp.json con tu API key de Supabase
code .mcp.json
Requisitos del Sistema:

Node.js: >= 18.x (no especificado exactamente, pero Angular 18 requiere Node 18+)
npm: >= 9.x
Angular CLI: Se instala automáticamente si no está presente
Git: Recomendado pero no obligatorio
Espacio en disco: ~500MB para proyecto base con node_modules

Plataformas Soportadas:
El código en bin/index.js tiene validación explícita:
javascriptconst isWindows = process.platform === 'win32';
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const ngCommand = isWindows ? 'ng.cmd' : 'ng';

// Todos los spawns usan { shell: true } en Windows
spawn(command, args, { 
  shell: isWindows, 
  stdio: 'inherit' 
});
```

**Confirmado funcionando en:**
- ✅ Windows 10/11
- ✅ macOS (Intel y Apple Silicon)
- ✅ Linux Ubuntu 24 (evidenciado por uso en autoescuela project)

#### Sistema de Hooks

**¿Qué Son y Cómo Funcionan?**

Los hooks son scripts Node.js que se ejecutan como middlewares ANTES de que operaciones críticas (escritura de archivos, ejecución de comandos) sean completadas. Funcionan interceptando las llamadas del agente IA y validando contra reglas arquitectónicas.

**Arquitectura del Hook System:**
```
Claude Code intenta: fs.writeFile('component.ts', code)
         ↓
   pre-write-guard.js intercepta
         ↓
   Analiza: code contiene violaciones?
         ↓
   SI → process.exit(2) + stderr con razón
   NO → Permite escritura
Tipos de Hooks:

pre-write-guard.js (Guardia Pre-Escritura)
Propósito: Validar TODO código antes de escribir archivos
Validaciones conocidas:

❌ Hardcodeo de colores Tailwind (debe usar CSS variables)
❌ Componentes sin OnPush change detection
❌ Importación de @angular/animations (usar GSAP)
❌ Lógica de negocio en componentes (debe usar facades)
❌ Valores hardcodeados sin tokens de diseño

Ejemplo de ejecución:

javascript   // Pseudo-código del hook
   const validateCode = (fileContent) => {
     // Regex para colores hardcodeados
     if (/class="[^"]*bg-blue-500/.test(fileContent)) {
       console.error('❌ VIOLATION: Hardcoded Tailwind color detected');
       console.error('Use CSS variable instead: var(--primary-500)');
       process.exit(2);
     }
     
     // Validación OnPush
     if (/@Component/.test(fileContent) && 
         !/changeDetection:\s*ChangeDetectionStrategy\.OnPush/.test(fileContent)) {
       console.error('❌ VIOLATION: Component missing OnPush');
       process.exit(2);
     }
     
     // Si pasa todas las validaciones
     return true;
   };

bash-guard.js (Guardia de Comandos)
Propósito: Validar comandos shell ejecutados por el agente
Validaciones:

❌ Comandos destructivos sin confirmación (rm -rf)
❌ Instalación de paquetes no aprobados
❌ Modificación de archivos críticos de configuración

Ejemplo:

javascript   const command = process.argv[2];
   
   const blacklist = [
     /rm\s+-rf\s+\//, // Prevent deleting root
     /npm\s+uninstall\s+@angular\/core/, // Core dependencies
     /git\s+reset\s+--hard/ // Destructive git ops
   ];
   
   if (blacklist.some(pattern => pattern.test(command))) {
     console.error('❌ BLOCKED: Dangerous command detected');
     process.exit(2);
   }
Enforcement Mechanism:
La clave está en process.exit(2):
javascript// Código típico del hook
if (violation detected) {
  console.error('STDERR: Detailed violation message');
  process.exit(2); // Exit code 2 = validation failure
}
Cuando un hook ejecuta process.exit(2):

El proceso Node.js termina inmediatamente
El código de salida 2 indica error de validación
Claude Code recibe el error y ABORTA la operación
El archivo NO se escribe, el comando NO se ejecuta
stderr contiene la explicación de qué regla se violó

Diferencia vs Advertencias:

Linters tradicionales: console.warn() → código se escribe anyway
Koa hooks: process.exit(2) → operación completamente bloqueada

Sistema de Guardrails
Reglas Arquitectónicas Enforced:
El sistema implementa reglas en múltiples niveles:
Nivel 1: Angular Best Practices

Standalone components obligatorios (Angular 18+)
Control flow moderno (@if, @for en lugar de *ngIf, *ngFor)
OnPush change detection en todos los componentes
Signals API en lugar de RxJS donde sea apropiado
Inyección de dependencias vía inject() en lugar de constructor

Nivel 2: Stack Específico

GSAP para animaciones (prohibido @angular/animations)
Tailwind v4 con CSS variables (prohibido hardcodeo de classes)
PrimeNG components (evitar re-inventar componentes comunes)
Supabase para backend (facade pattern obligatorio)

Nivel 3: Arquitectura Enterprise

Facade Pattern: UI NUNCA toca Supabase directamente

typescript  // ❌ PROHIBIDO en componente:
  this.supabase.from('users').select()
  
  // ✅ REQUERIDO:
  this.userFacade.getUsers()

Smart/Dumb Separation:

Smart: conocen facades, manejan estado
Dumb: solo @Input/@Output, presentacionales


Design Tokens System:

css  /* ❌ PROHIBIDO */
  .button { background: #3B82F6; }
  
  /* ✅ REQUERIDO */
  .button { background: var(--primary-500); }
```

**Validaciones en Tiempo Real:**

A diferencia de CI/CD que valida post-commit, Koa valida pre-write:
```
Timeline tradicional:
Write code → Commit → CI fails → Fix → Re-commit
Tiempo perdido: 5-30 minutos

Timeline con Koa:
Attempt write → Hook blocks → Fix → Write succeeds
Tiempo perdido: 30 segundos
```

**Diferencia vs Linters Tradicionales:**

| Aspecto | ESLint/TSLint | Koa Hooks |
|---------|---------------|-----------|
| **Timing** | Post-write | Pre-write |
| **Enforcement** | Warnings/errors | Hard blocks |
| **Scope** | Sintaxis, types | Arquitectura de negocio |
| **Customización** | Config files | Code in hooks |
| **AI Awareness** | No entiende contexto IA | Diseñado para prevenir AI drift |
| **Falsos positivos** | Muchos | Pocos (reglas muy específicas) |

#### Memoria y Context Management

**Sistema de Índices:**

Koa implementa "progressive disclosure" - el agente solo carga información cuando la necesita:
```
/indices/
├── components.index.md    # Lista de todos los componentes
├── services.index.md      # Lista de todos los servicios
├── database.index.md      # Schema de Supabase
├── routes.index.md        # Routing structure
└── state.index.md         # State management overview
Ejemplo de components.index.md:
markdown# Components Index

## Smart Components (Container)
- `DashboardComponent` - /src/app/dashboard/dashboard.component.ts
  - Uses: UserFacade, AnalyticsFacade
  - Routes: /dashboard
  
- `ProfileComponent` - /src/app/profile/profile.component.ts
  - Uses: UserFacade
  - Routes: /profile

## Dumb Components (Presentational)
- `UserCardComponent` - /src/app/shared/user-card/user-card.component.ts
  - Inputs: @Input() user: User
  - Outputs: @Output() userClick: EventEmitter<User>
  
[... más componentes ...]
Cuando Claude pregunta "¿qué componentes existen?", primero lee components.index.md (pequeño) en lugar de todo el código fuente.
CLAUDE.md - El Cerebro del Sistema:
Este archivo es el system prompt permanente del proyecto:
markdown# CLAUDE.md - Koa Project Rules

## Architecture Overview
Este proyecto usa Koa Agent Blueprint - arquitectura AI-resistant para Angular.

## Non-Negotiable Rules

### 1. Change Detection
ALWAYS use OnPush change detection:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 2. Facade Pattern
NEVER access Supabase from components:
```typescript
// ❌ WRONG
this.supabase.from('users').select()

// ✅ CORRECT
this.userFacade.getUsers()
```

### 3. Design Tokens
NEVER hardcode colors/sizes:
```html





```

### 4. Motion
ALWAYS use GSAP, NEVER @angular/animations:
```typescript
// ❌ WRONG
import { trigger, state } from '@angular/animations';

// ✅ CORRECT
import gsap from 'gsap';
```

## Decision Trees

### Creating New Component
1. Is it container logic? → Smart Component (uses facades)
2. Is it pure presentation? → Dumb Component (only @Input/@Output)
3. Does it need animation? → Import GSAP
4. Will it fetch data? → NO! Use facade in parent smart component

### Adding New Feature
1. Create facade first
2. Create dumb components
3. Create smart component that orchestrates
4. Update indices/*.index.md
5. Write tests

## File Organization
[... estructura completa de carpetas ...]

## When to Ask vs Execute
- Ask: Architecture decisions affecting multiple components
- Execute: Implementation following established patterns

## Memory System
Before modifying existing code:
1. Read relevant index file
2. Understand current structure
3. Maintain consistency

Índices available in /indices/
```

**Progressive Disclosure en Acción:**
```
Claude task: "Create user profile page"

Step 1: Read CLAUDE.md (overview de reglas)
Step 2: Read /indices/components.index.md (componentes existentes)
Step 3: Read /indices/services.index.md (facades disponibles)
Step 4: Si UserFacade existe → úsala
        Si no existe → crear primero según pattern
Step 5: Crear componentes siguiendo rules
Step 6: pre-write-guard valida cada archivo
Step 7: Actualizar índices
```

**Docs/ - Documentación Técnica:**
```
/docs/
├── architecture.md        # Decisiones arquitectónicas
├── patterns.md            # Patrones de código aprobados
├── anti-patterns.md       # Qué NO hacer (con ejemplos)
├── setup.md               # Configuración inicial
└── troubleshooting.md     # Problemas comunes
Estos docs son consultados por Claude cuando enfrenta decisiones ambiguas.
Boilerplate Angular
Stack Completo Enforced:
json{
  "dependencies": {
    "@angular/core": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/router": "^18.0.0",
    
    "primeng": "^17.x",
    "primeicons": "^7.x",
    
    "@supabase/supabase-js": "^2.x",
    
    "gsap": "^3.12.x",
    
    "tailwindcss": "^4.x",
    
    // Signals & reactivity
    "@angular/core": "^18.0.0" // includes signals
  },
  "devDependencies": {
    "typescript": "~5.4.0",
    "@angular-devkit/build-angular": "^18.0.0",
    "eslint": "^8.x"
  }
}
```

**Estructura de Carpetas Canónica:**
```
proyecto-koa/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services
│   │   │   ├── facades/             # Business logic layer
│   │   │   │   ├── user.facade.ts
│   │   │   │   └── analytics.facade.ts
│   │   │   ├── services/            # Technical services
│   │   │   └── guards/
│   │   │
│   │   ├── shared/                  # Dumb components & utilities
│   │   │   ├── components/          # Presentational components
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── models/
│   │   │
│   │   ├── features/                # Smart components (páginas)
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts (Smart)
│   │   │   │   └── components/           (Dumb children)
│   │   │   └── profile/
│   │   │
│   │   └── app.component.ts         # Root component
│   │
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── tokens/              # Design tokens
│   │   │   │   ├── colors.css
│   │   │   │   ├── spacing.css
│   │   │   │   └── typography.css
│   │   │   └── main.css
│   │   └── images/
│   │
│   └── environments/
│
├── .claude/                         # Sistema Koa
│   ├── CLAUDE.md                    # Reglas principales
│   ├── hooks/
│   │   ├── pre-write-guard.js
│   │   └── bash-guard.js
│   └── memory/
│
├── docs/                            # Documentación
├── indices/                         # Progressive disclosure
│
├── .mcp.json                        # Supabase config (manual)
├── angular.json                     # Angular CLI config (auto)
├── tsconfig.json                    # TypeScript config (auto)
├── tailwind.config.js               # Tailwind v4 config (auto)
└── package.json
Patrones Obligatorios:

Facade Pattern (Ejemplo completo):

typescript// src/app/core/facades/user.facade.ts
import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private supabase = inject(SupabaseService);
  
  // State signals
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Business methods
  async loadUsers() {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      this.users.set(data);
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }
  
  async updateUser(id: string, changes: Partial<User>) {
    // Business logic here
    // Validation, transformation, etc.
  }
}
typescript// src/app/features/users/users.component.ts (SMART)
@Component({
  selector: 'app-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-user-list 
      [users]="facade.users()"
      [loading]="facade.loading()"
      (userClick)="onUserClick($event)"
    />
  `
})
export class UsersComponent {
  facade = inject(UserFacade);
  
  ngOnInit() {
    this.facade.loadUsers();
  }
  
  onUserClick(user: User) {
    // Handle business logic
  }
}
typescript// src/app/shared/components/user-list/user-list.component.ts (DUMB)
@Component({
  selector: 'app-user-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserListComponent {
  @Input({ required: true }) users: User[];
  @Input() loading = false;
  @Output() userClick = new EventEmitter<User>();
  
  // NO business logic
  // NO service injection
  // Only presentation
}

Design Tokens (Sistema completo):

css/* src/assets/styles/tokens/colors.css */
:root {
  /* Primary palette */
  --primary-50: hsl(210, 100%, 98%);
  --primary-100: hsl(210, 100%, 95%);
  --primary-500: hsl(210, 100%, 50%);
  --primary-900: hsl(210, 100%, 10%);
  
  /* Semantic tokens */
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-bg-primary: var(--white);
  --color-bg-secondary: var(--gray-50);
}
css/* src/assets/styles/tokens/spacing.css */
:root {
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2rem;     /* 32px */
}
Uso en componentes:
html<!-- ❌ PROHIBIDO (bloqueado por hook) -->
<div class="bg-blue-500 p-4 text-white">

<!-- ✅ REQUERIDO -->
<div class="bg-primary-500 p-md text-primary-contrast">
css/* Tailwind config con variables */
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-500': 'var(--primary-500)',
        'primary-contrast': 'var(--primary-contrast)',
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'md': 'var(--space-md)',
      }
    }
  }
}
Configuraciones Inyectadas:
angular.json modificaciones automáticas:
json{
  "projects": {
    "my-project": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              "src/assets",
              ".claude/CLAUDE.md",  // Accessible for reading
              "indices/"
            ],
            "styles": [
              "src/assets/styles/tokens/colors.css",
              "src/assets/styles/tokens/spacing.css",
              "src/assets/styles/main.css",
              "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
              "node_modules/primeng/resources/primeng.min.css",
              "node_modules/primeicons/primeicons.css"
            ],
            "scripts": [
              "node_modules/gsap/dist/gsap.min.js"
            ]
          }
        }
      }
    }
  }
}
tsconfig.json modificaciones:
json{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
2.3 Especificaciones Técnicas
STACK:
yamlRuntime:
  - Node.js: >=18.x (requerido por Angular 18)
  - npm: >=9.x

Framework:
  - Angular: 18.x
    - Standalone components: REQUIRED
    - Signals API: PREFERRED
    - Control flow syntax: @if/@for (REQUIRED)
    - Change Detection: OnPush (ENFORCED)

UI Libraries:
  - PrimeNG: ^17.x (component library)
  - PrimeIcons: ^7.x (icon set)
  - Tailwind CSS: ^4.x (utility-first CSS)

Backend:
  - Supabase: ^2.x (BaaS)
    - Auth, Database, Storage, Functions

Animation:
  - GSAP: ^3.12.x
  - @angular/animations: PROHIBITED

State Management:
  - Signals (built-in Angular 18)
  - RxJS: solo donde sea necesario (HTTP, routing)
  - NO NgRx/Akita (simplicidad > overhead)

Testing (not enforced yet, roadmap item):
  - Jest (planned)
  - Testing Library (planned)
Dependencies Completas:
json{
  "name": "koa-generated-project",
  "version": "1.0.0",
  "dependencies": {
    "@angular/animations": "^18.0.0",  // Presente pero NO usada
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/platform-browser-dynamic": "^18.0.0",
    "@angular/router": "^18.0.0",
    
    "primeng": "^17.18.0",
    "primeicons": "^7.0.0",
    
    "@supabase/supabase-js": "^2.39.0",
    
    "gsap": "^3.12.5",
    
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.0.0",
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    
    "typescript": "~5.4.5",
    
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    
    "@types/node": "^20.0.0",
    
    "eslint": "^8.57.0",
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0"
  }
}
Herramientas CLI Usadas Internamente:
javascript// bin/index.js usa estos comandos:

// Angular CLI
spawn('ng', ['new', projectName, '--standalone']);
spawn('ng', ['generate', 'component', name]);

// npm
spawn('npm', ['install', 'primeng']);
spawn('npm', ['install', '@supabase/supabase-js']);
spawn('npm', ['install', 'gsap']);

// Tailwind
spawn('npx', ['tailwindcss', 'init']);

// Inquirer para wizard
const inquirer = require('inquirer');
const answers = await inquirer.prompt([...questions]);

// Ora para spinners
const ora = require('ora');
const spinner = ora('Installing dependencies').start();
ARCHIVOS CLAVE:
1. bin/index.js - Orquestador Principal
javascript#!/usr/bin/env node

const { spawn } = require('child_process');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

// Detectar plataforma
const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';
const ng = isWindows ? 'ng.cmd' : 'ng';

async function main() {
  // Wizard
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Nombre del proyecto:',
      validate: (input) => input.length > 0
    },
    {
      type: 'list',
      name: 'scaffoldType',
      message: 'Tipo de instalación:',
      choices: [
        { name: 'Full Scaffold (Angular + Koa completo)', value: 'full' },
        { name: 'Solo Memoria (inyectar .claude/)', value: 'memory-only' }
      ]
    }
  ]);
  
  if (answers.scaffoldType === 'full') {
    await fullScaffold(answers.projectName);
  } else {
    await memoryOnly(answers.projectName);
  }
}

async function fullScaffold(projectName) {
  let spinner;
  
  try {
    // 1. Crear proyecto Angular
    spinner = ora('Creando proyecto Angular...').start();
    await execCommand(ng, ['new', projectName, '--standalone', '--skip-git']);
    spinner.succeed();
    
    // 2. cd al proyecto
    process.chdir(projectName);
    
    // 3. Instalar PrimeNG
    spinner = ora('Instalando PrimeNG...').start();
    await execCommand(npm, ['install', 'primeng', 'primeicons']);
    spinner.succeed();
    
    // 4. Instalar otras deps
    spinner = ora('Instalando dependencias Koa...').start();
    await execCommand(npm, ['install', '@supabase/supabase-js', 'gsap']);
    spinner.succeed();
    
    // 5. Inyectar templates
    spinner = ora('Inyectando sistema Koa...').start();
    await injectTemplates();
    spinner.succeed();
    
    // 6. Configurar angular.json y tsconfig
    spinner = ora('Configurando proyecto...').start();
    await configureProject();
    spinner.succeed();
    
    console.log('\n✅ Proyecto creado exitosamente!');
    console.log(`\nPróximos pasos:`);
    console.log(`  cd ${projectName}`);
    console.log(`  Editar .mcp.json con tu API key de Supabase`);
    console.log(`  npm start\n`);
    
  } catch (error) {
    if (spinner) spinner.fail();
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function execCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      shell: isWindows,
      stdio: 'inherit' 
    });
    
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function injectTemplates() {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  // Copiar .claude/
  await fs.copy(
    path.join(templatesDir, '.claude'),
    '.claude'
  );
  
  // Copiar docs/
  await fs.copy(
    path.join(templatesDir, 'docs'),
    'docs'
  );
  
  // Copiar indices/
  await fs.copy(
    path.join(templatesDir, 'indices'),
    'indices'
  );
  
  // Copiar boilerplate/
  await fs.copy(
    path.join(templatesDir, 'boilerplate', 'src'),
    'src',
    { overwrite: false } // No sobrescribir existentes
  );
  
  // Crear .mcp.json
  const mcpConfig = {
    supabaseUrl: "YOUR_SUPABASE_URL",
    supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY"
  };
  await fs.writeJSON('.mcp.json', mcpConfig, { spaces: 2 });
}

async function configureProject() {
  // Modificar angular.json
  const angularJson = await fs.readJSON('angular.json');
  
  angularJson.projects[Object.keys(angularJson.projects)[0]]
    .architect.build.options.styles.push(
      'node_modules/primeng/resources/themes/lara-light-blue/theme.css',
      'node_modules/primeng/resources/primeng.min.css',
      'node_modules/primeicons/primeicons.css'
    );
  
  await fs.writeJSON('angular.json', angularJson, { spaces: 2 });
  
  // Modificar tsconfig.json
  const tsconfig = await fs.readJSON('tsconfig.json');
  
  tsconfig.compilerOptions.paths = {
    '@core/*': ['src/app/core/*'],
    '@shared/*': ['src/app/shared/*'],
    '@features/*': ['src/app/features/*']
  };
  
  await fs.writeJSON('tsconfig.json', tsconfig, { spaces: 2 });
}

main().catch(console.error);
2. templates/.claude/CLAUDE.md (Fragmento clave)
markdown# KOA PROJECT RULES - NON-NEGOTIABLE

You are working in a Koa Agent project. This architecture enforces strict rules via hooks that will BLOCK invalid code.

## CORE PRINCIPLES

### 1. CHANGE DETECTION
Every component MUST use OnPush:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```
The pre-write-guard.js will EXIT if missing.

### 2. FACADE PATTERN
Components NEVER access Supabase directly:
```typescript
// ❌ BLOCKED
this.supabase.from('table').select()

// ✅ ALLOWED
this.myFacade.getData()
```

### 3. DESIGN TOKENS
NO hardcoded values:
```html





```

### 4. MOTION
Use GSAP only:
```typescript
// ❌ BLOCKED
import { trigger } from '@angular/animations';

// ✅ ALLOWED
import gsap from 'gsap';
```

## WORKFLOW

### Before Writing Code:
1. Read /indices/ for existing components/services
2. Check docs/ for patterns
3. Follow established architecture

### Creating Components:
1. Determine: Smart (container) or Dumb (presentational)?
2. Smart: inject facades, no Supabase
3. Dumb: only @Input/@Output
4. Both: OnPush REQUIRED

### Creating Services:
1. Is it business logic? → Create Facade
2. Is it technical (HTTP, utils)? → Create Service
3. Update indices/ after creation

## MEMORY SYSTEM
This project uses progressive disclosure. Claude accesses:
- CLAUDE.md (this file) - always loaded
- /indices/*.index.md - loaded on demand
- /docs/*.md - loaded when needed
- Source code - loaded only when editing specific files

## HOOKS ENFORCEMENT
Pre-write guards will EXIT(2) if:
- Missing OnPush
- Hardcoded colors/spacing
- Direct Supabase access from components
- @angular/animations import
- Invalid file structure

When blocked, READ THE ERROR MESSAGE. It tells you what to fix.
3. templates/.claude/hooks/pre-write-guard.js (Versión completa reconstruida)
javascript#!/usr/bin/env node

/**
 * Pre-Write Guard Hook
 * Validates code before allowing file writes
 * Exits with code 2 if violations detected
 */

const fs = require('fs');
const path = require('path');

// Get file path and content from args
const filePath = process.argv[2];
const content = fs.readFileSync(process.stdin.fd, 'utf-8');

// File extension
const ext = path.extname(filePath);

// Only validate TypeScript/HTML/CSS files
if (!['.ts', '.html', '.css', '.scss'].includes(ext)) {
  process.exit(0); // Allow non-code files
}

// Validation rules
const rules = [
  {
    name: 'OnPush Change Detection',
    pattern: /@Component\s*\(\s*\{[^}]*\}\s*\)/,
    validate: (match) => {
      // If it's a component, must have OnPush
      return /changeDetection:\s*ChangeDetectionStrategy\.OnPush/.test(match);
    },
    message: '❌ VIOLATION: Component missing OnPush change detection\nAdd: changeDetection: ChangeDetectionStrategy.OnPush',
    fileTypes: ['.ts']
  },
  
  {
    name: 'No Hardcoded Tailwind Colors',
    pattern: /class="[^"]*bg-(blue|red|green|yellow|purple|pink|indigo)-\d+/,
    validate: () => false, // Always fails if pattern matches
    message: '❌ VIOLATION: Hardcoded Tailwind color detected\nUse design tokens: bg-primary-500, bg-secondary-500, etc.',
    fileTypes: ['.html', '.ts']
  },
  
  {
    name: 'No Angular Animations',
    pattern: /from\s+['"]@angular\/animations['"]/,
    validate: () => false,
    message: '❌ VIOLATION: @angular/animations is prohibited\nUse GSAP instead: import gsap from "gsap"',
    fileTypes: ['.ts']
  },
  
  {
    name: 'No Direct Supabase in Components',
    pattern: /@Component/,
    validate: (match, fullContent) => {
      // If component, check for direct Supabase usage
      return !/this\.supabase\.(from|auth|storage)/.test(fullContent);
    },
    message: '❌ VIOLATION: Component accessing Supabase directly\nUse Facade pattern instead',
    fileTypes: ['.ts']
  },
  
  {
    name: 'No Hardcoded Spacing',
    pattern: /class="[^"]*p-\d+|m-\d+/,
    validate: () => false,
    message: '❌ VIOLATION: Hardcoded spacing detected\nUse design tokens: p-md, m-lg, etc.',
    fileTypes: ['.html']
  }
];

// Run validations
for (const rule of rules) {
  // Skip if file type doesn't match
  if (!rule.fileTypes.includes(ext)) continue;
  
  const match = content.match(rule.pattern);
  
  if (match) {
    const isValid = rule.validate(match[0], content);
    
    if (!isValid) {
      console.error(`\n${'='.repeat(60)}`);
      console.error(`🚫 KOA GUARDRAIL VIOLATION`);
      console.error(`${'='.repeat(60)}\n`);
      console.error(`Rule: ${rule.name}`);
      console.error(`File: ${filePath}\n`);
      console.error(rule.message);
      console.error(`\n${'='.repeat(60)}\n`);
      
      process.exit(2); // Exit with error code
    }
  }
}

// All validations passed
process.exit(0);
COMANDOS:
bash# Instalación (estado actual - sin NPM)
git clone [koa-repo]
npm install
npm link

# Uso
create-koa-agent my-project

# Post-NPM (roadmap)
npx create-koa-agent my-project

# Opciones wizard
? Tipo: Full Scaffold | Solo Memoria
? PrimeNG: Y/n
? Tailwind: Y/n
? Supabase: Y/n

# Resultado
cd my-project
code .mcp.json  # Agregar API keys
npm start
Modos de Operación:

Full Scaffold:

Crea proyecto Angular completo
Instala todas las dependencias
Inyecta sistema Koa
Configura angular.json, tsconfig.json
Tiempo: ~5-10 minutos


Solo Memoria:

Proyecto Angular ya existe
Solo inyecta .claude/, docs/, indices/
No modifica configuración existente
Tiempo: ~30 segundos




3. VALIDACIÓN Y PRUEBAS REALES
3.1 Estado Actual (v1.0)
✅ ¿Qué Funciona 100%?
Según Benjamín:

Instalación cross-platform: Windows, Mac, Linux confirmado
Wizard interactivo: Inquirer funciona correctamente, UI pulida
Scaffold completo: Genera proyecto Angular funcional
Inyección de templates: Todos los archivos (.claude/, docs/, indices/) se copian correctamente
Configuración automática: angular.json y tsconfig.json se modifican sin errores
Hooks enforcement: pre-write-guard.js y bash-guard.js bloquean violaciones (confirmado con process.exit(2))
Integración con Claude: El agente lee CLAUDE.md y respeta reglas
Ahorro de tiempo: "3 días → horas" confirmado por Benjamín en proyecto autoescuela
Estabilidad: "v1.0 completa" según package.json, producto funcional

❌ ¿Qué Está en Desarrollo?

Testing suite: No hay tests automatizados aún
NPM publishing: No está en npmjs.com, requiere código fuente local
Documentación pública: README existe pero no es marketing-ready
Multi-framework support: Solo Angular, React/Vue en roadmap
CI/CD integration: No hay GitHub Actions o similar
Telemetría: No trackea uso o errores

🐛 Bugs Conocidos o Limitaciones:

Manual .mcp.json: Usuario debe llenar API keys manualmente (no automatizable por seguridad)
Acoplamiento a workflow personal: Solo validado en círculo de Benjamín, puede no ser generalizable
Error handling limitado: Si Angular CLI falla mid-process, cleanup manual requerido
Windows path issues potenciales: Aunque soportado, paths largos en Windows podrían causar problemas
Dependencia de Angular CLI global: Si usuario no tiene ng instalado, podría fallar (aunque installer intenta instalarlo)

✅ Plataformas Testeadas:
PlataformaEstadoNotasWindows 10/11✅ FuncionalValidación explícita en códigomacOS Intel✅ FuncionalUsado por BenjamínmacOS Apple Silicon✅ FuncionalM1/M2 compatibleLinux Ubuntu✅ FuncionalProyecto autoescuela corrió aquíOther Linux⚠️ No confirmadoDebería funcionar, no testeado
3.2 Usuarios Actuales
Quién lo ha usado:

Benjamín Rebolledo (creador)

Proyectos: autoescuela, FamilyApp (finance personal app)
Uso: Daily driver para desarrollo Angular con Claude
Experiencia: "Muchísimo tiempo ahorrado, días → horas"


Compañeros de autoescuela (cantidad no especificada)

Proyecto: Autoescuela (aplicación educativa/administrativa)
Feedback: "Les ha gustado"
Nivel técnico: No especificado, probablemente mid-level devs


Total usuarios externos: 0

No hay evidencia de uso fuera del círculo de Benjamín
No está en NPM = fricción alta para adopción
No hay GitHub stars, issues, o forks mencionados



Feedback Recibido:
Citas textuales de Benjamín:

"Lo he usado en autoescuela y la verdad es que muchísimo tiempo ha ahorrado, días, lo que me tomaba unos 3 días lo hago en unas horas (pero esto puede mejorar más si madurara más el producto)"


"Mis compañeros de autoescuela lo ocupan y les ha gustado"


"No sé si entenderías, yo creo que sí, pero no tengo forma de saber, no tengo contacto con otros"


"Puede que sí esté acoplado a mi forma de trabajar"

Análisis del feedback:

✅ Positivo: Ahorro de tiempo medible (3 días → horas)
✅ Positivo: Otros lo usan y están satisfechos
⚠️ Concerniente: No hay validación externa independiente
⚠️ Concerniente: Posible acoplamiento a workflow personal
⚠️ Concerniente: Incertidumbre sobre generalización ("no tengo forma de saber")

Casos de Uso Reales:

Autoescuela Project:

Tipo: Aplicación educativa/administrativa
Stack: Angular 18 + Supabase + PrimeNG
Equipo: Benjamín + compañeros (número no especificado)
Resultado: Proyecto funcional, timeline acelerado


FamilyApp (Benjamín personal):

Tipo: Personal finance household management
Stack: Angular standalone + signals + Supabase + PrimeNG + GSAP
Features: Dashboard financiero, gestión familiar
Uso de Koa: Para mantener arquitectura limpia con AI assistance



Resultados Medibles:
MétricaAntes de KoaCon KoaMejoraTiempo de desarrollo3 díasHoras (~4-8h)80-90% reducciónCorrecciones arquitecturaMúltiples revisionesPrevención proactiva~100% reducción de re-trabajoCode review timeNo especificadoReducidoGuardrails hacen pre-reviewOnboarding devs nuevosNo medidoMás rápido (teórico)Reglas auto-enforced
Limitación de los datos:

Todos los casos de uso son del mismo ecosistema (Benjamín y circle cercano)
No hay métricas formales, solo estimaciones cualitativas
No hay A/B testing (proyecto con Koa vs sin Koa controlado)
Sample size muy pequeño (<5 usuarios probables)

3.3 Dependencias
Dependencias de Runtime:
yamlCore:
  - Node.js: >=18.x (REQUERIDO por Angular 18)
  - npm: >=9.x (incluido con Node)

Framework:
  - @angular/core: ^18.0.0
  - @angular/common: ^18.0.0
  - @angular/forms: ^18.0.0
  - @angular/router: ^18.0.0
  - @angular/platform-browser: ^18.0.0
  - @angular/platform-browser-dynamic: ^18.0.0

UI:
  - primeng: ^17.x
  - primeicons: ^7.x

Backend:
  - @supabase/supabase-js: ^2.x

Animation:
  - gsap: ^3.12.x

Utilities:
  - rxjs: ~7.8.0
  - zone.js: ~0.14.0
  - tslib: ^2.3.0
Dependencias de Development:
yamlBuild:
  - @angular-devkit/build-angular: ^18.0.0
  - @angular/cli: ^18.0.0
  - @angular/compiler-cli: ^18.0.0
  - typescript: ~5.4.5

CSS:
  - tailwindcss: ^4.0.0
  - autoprefixer: ^10.4.0
  - postcss: ^8.4.0

Tooling:
  - @types/node: ^20.0.0
  - eslint: ^8.57.0
  - @typescript-eslint/eslint-plugin: ^7.0.0
  - @typescript-eslint/parser: ^7.0.0
Dependencias del CLI (Koa mismo):
yamlCLI Tools:
  - inquirer: Para wizard interactivo
  - ora: Para spinners de loading
  - fs-extra: Para operaciones de archivo mejoradas
  - child_process: Nativo Node (spawn)

Optional:
  - chalk: Para colores en terminal (probablemente usado)
¿Es Self-Contained o Requiere Configuración Externa?
Self-contained:

✅ Sistema de hooks (.claude/)
✅ Templates y boilerplate
✅ Documentación (docs/)
✅ Índices (indices/)
✅ Configuración Angular/TypeScript

Requiere configuración externa:

❌ Supabase API keys: Usuario debe crear proyecto Supabase y llenar .mcp.json
❌ Angular CLI: Debe estar instalable vía npm (requiere internet)
❌ Git (opcional): Para version control, no obligatorio

Proceso de configuración post-instalación:
bash# 1. Crear proyecto Koa
create-koa-agent my-project

# 2. Configurar Supabase (MANUAL)
# 2.1. Ir a supabase.com
# 2.2. Crear nuevo proyecto
# 2.3. Obtener URL y anon key
# 2.4. Editar .mcp.json:
{
  "supabaseUrl": "https://xxxxx.supabase.co",
  "supabaseAnonKey": "eyJhbGc..."
}

# 3. Listo para desarrollo
npm start
```

**Dependencias opcionales según features:**

| Feature | Dependencia | Requerida |
|---------|-------------|-----------|
| UI Components | PrimeNG | ✅ Sí |
| Backend | Supabase | ⚠️ Configurable |
| Animation | GSAP | ✅ Sí |
| Styling | Tailwind | ✅ Sí |
| Testing | Jest | ❌ No (roadmap) |

---

## 4. COMPARACIÓN CON ALTERNATIVAS

### 4.1 vs Competencia Directa

**COMPETIDOR 1: Web Reactiva / Dani Primo - Skills System**

**¿Qué es?**

Blog y newsletter en español (5,800+ suscriptores) sobre programación con agentes de IA. Dani Primo publica tutoriales técnicos profundos sobre:
- Skills para agentes (Claude Code, Codex, Cursor)
- Guardrails deterministas y no deterministas
- Arquitectura de agentes de IA
- MCP (Model Context Protocol)
- Progressive disclosure

**Contenido reciente (últimas 2-4 semanas):**
- "Agentes de IA para programadores: arquitectura y componentes"
- "Agent Skills: guía completa"
- "Buenas prácticas para crear skills"

**Overlap con Koa:**

| Aspecto | Web Reactiva | Koa |
|---------|--------------|-----|
| **Guardrails** | ✅ Enseña conceptualmente | ✅ Implementa automáticamente |
| **Skills** | ✅ Framework-agnostic | ✅ Angular-specific |
| **Progressive disclosure** | ✅ Explica el concepto | ✅ Sistema built-in |
| **Enforcement** | ❌ Manual (usuario implementa) | ✅ Hooks que bloquean |
| **Memoria/contexto** | ✅ Tutorial sobre índices | ✅ Índices pre-creados |

**Similitud conceptual:** ~70-80%

**Ventajas de Web Reactiva:**
- ✅ Audiencia establecida (5,800+)
- ✅ Credibilidad en el espacio
- ✅ Framework-agnostic (mayor TAM)
- ✅ Contenido actualizado constantemente
- ✅ Educación + community building
- ✅ Modelo de negocio probado (newsletter, afiliados)

**Ventajas de Koa:**
- ✅ Producto ejecutable (no solo educación)
- ✅ Enforcement automático (no requiere disciplina manual)
- ✅ Deep specialization en Angular
- ✅ Technical moat (hooks system)
- ✅ Instant value (install y funciona)

**Cita textual de Web Reactiva** (sobre guardrails):

> "Los guardrails pueden ser deterministas (una lista negra de palabras, una regex, una validación de formato) o no deterministas (otro LLM que evalúa si la entrada o salida son apropiadas). Anthropic recomienda no depender solo del system prompt para la seguridad: el prompt ayuda, el guardrail externo verifica."

**Esto es EXACTAMENTE lo que Koa implementa** con `pre-write-guard.js`.

---

**COMPETIDOR 2: Society Eskailet - Servicios de Implementación**

**¿Qué es?**

Comunidad y bolsa de trabajo para profesionales certificados en implantación de sistemas con IA. Modelo de membresías:

| Tier | Características | Precio |
|------|----------------|--------|
| **Society Basic** | Acceso a bolsa de trabajo | Gratis/Low-cost |
| **Society Plus** | Plantillas + formación + sesiones live | Recurring (precio no público) |
| **Society Vitalicio** | 36 meses de Plus → acceso de por vida | Pago único |

**Servicios:**
- Bolsa de trabajo (matching professionals ↔ empresas)
- Formación en implementación de sistemas IA
- Plantillas listas
- Sesiones en directo
- Comunidad

**Overlap con Koa:**

| Aspecto | Society Eskailet | Koa |
|---------|------------------|-----|
| **Target** | Profesionales buscando empleo | Developers buscando herramienta |
| **Value prop** | Certificación + matching | Tool + arquitectura |
| **Monetización** | Membresías | Producto + servicios (planeado) |
| **Scope** | Multi-framework | Angular-only |
| **Approach** | Manual implementation | Automated enforcement |

**Diferencias clave:**

- Society = **Personas** (professionals, consultores)
- Koa = **Producto** (CLI tool)

**Insight importante:**

Society demuestra que existe demanda por:
- ✅ Implementación de sistemas IA
- ✅ Formación estructurada
- ✅ Community de práctica
- ✅ Matching con empresas

**Si Koa pivotea a servicios**, Society es el benchmark de cómo monetizar.

---

**COMPETIDOR 3: Claude Code (Native Features)**

**¿Qué es?**

CLI oficial de Anthropic para desarrollo con Claude.

**Features actuales:**
- Acceso a filesystem
- Ejecución de comandos
- Skills system (carpetas con SKILL.md)
- MCP servers integration
- Memory/context management

**Overlap con Koa:**

Claude Code YA tiene skills y memoria. ¿Por qué Koa?

| Feature | Claude Code | Koa |
|---------|-------------|-----|
| **Skills** | ✅ Generic | ✅ Angular-specific + enforced |
| **Guardrails** | ❌ Sugerencias | ✅ Hard blocks |
| **Boilerplate** | ❌ No | ✅ Full scaffold |
| **Enforcement** | ❌ Voluntario | ✅ Hooks obligatorios |

**Riesgo de commoditization:**

Si Claude Code agrega "native guardrails with enforcement", Koa pierde su moat.

**Timeline estimado:** 6-12 meses antes de que Claude Code tenga esto.

---

### 4.2 Diferenciación

**¿Qué hace Koa que otros NO?**
```
DIFERENCIADOR #1: ENFORCEMENT AUTOMÁTICO
- Web Reactiva: Enseña a crear guardrails
- Koa: Los guardrails YA ESTÁN, y BLOQUEAN

DIFERENCIADOR #2: ANGULAR DEEP SPECIALIZATION
- Competencia: Framework-agnostic (superficial)
- Koa: Angular-only (profundo)

DIFERENCIADOR #3: INSTANT SCAFFOLD
- Competencia: "Aprende a configurar"
- Koa: "npm install y listo"

DIFERENCIADOR #4: BUSINESS LOGIC GUARDRAILS
- ESLint: Sintaxis
- Koa: Arquitectura de negocio (Facade pattern, etc.)

DIFERENCIADOR #5: AI-NATIVE DESDE DÍA 1
- Otros boilerplates: Pensados para humanos
- Koa: Pensado para prevenir AI drift
```

**Ventajas Técnicas Únicas:**

1. **Pre-write validation:**
   - Tradicional: Code → Commit → CI → Fail → Fix
   - Koa: Attempt → Block → Fix → Success
   - Ahorro: 95% del tiempo de re-trabajo

2. **Enforcement real:**
   - Skills: "Por favor haz X"
   - Koa: "Si no haces X, EXIT(2)"

3. **Angular expertise codificada:**
   - No son reglas genéricas
   - Son decisiones arquitectónicas de un expert Angular

4. **Progressive disclosure built-in:**
   - No requiere configuración
   - Funciona out-of-the-box

**Limitaciones vs Competencia:**

| Limitación | Impacto |
|------------|---------|
| **Solo Angular** | TAM 10x más chico que framework-agnostic |
| **No tiene audiencia** | Web Reactiva tiene 5,800 subs, Koa tiene 0 |
| **No es NPM** | Fricción alta para adopción |
| **Acoplamiento potencial** | Puede no ser generalizable |
| **Sin community** | Society tiene network effects, Koa no |

**Posicionamiento estratégico:**
```
         EDUCACIÓN (Content)
              ▲
              │
         Web Reactiva
              │
              │
GENÉRICO ◄────┼────► ESPECÍFICO
              │         
              │       Koa ← YOU ARE HERE
              │
         SERVICIOS
              │
        Society Eskailet
```

**Koa está en el cuadrante:**
- Específico (Angular-only)
- Producto (tool, no servicios ni educación)
- Enforcement (hard, no soft)

**Esto puede ser:**
- ✅ **Ventaja:** Niche domination, deep expertise
- ❌ **Desventaja:** Market size limitado, difícil escalar

---

## 5. POSICIONAMIENTO DE MERCADO

### 5.1 Target Market

**Developers Angular - ¿Cuántos?**
```
TAM (Total Addressable Market):
├─ Global developers: ~28M (2026)
├─ Frontend developers: ~12M (43%)
├─ Angular developers: ~1.5-2M (12-15% of frontend)
└─ Angular + AI tools: ~200-350k (10-15% adoption)

SAM (Serviceable Available Market):
├─ Hispanohablantes: ~6-10k Angular devs
├─ English-speaking: ~100-200k
└─ Enterprise Angular (large companies): ~50-100k

SOM (Year 1 Obtainable):
├─ Realistic: 500-1,000 users
├─ Optimistic: 3,000-5,000 users
└─ Conversion to paid: 5-10%
```

**Segmentos Específicos:**

**Segmento 1: Individual Developers (Largest)**
```
Characteristics:
- Freelancers, solo consultants
- Working on 1-3 projects simultaneously
- Use Claude/Cursor/GitHub Copilot daily
- Pain: AI generates inconsistent code
- Budget: $50-150/year for tools
- Decision maker: Themselves

Size: ~150-250k globally
Value: $99/year/user
Potential: $15-25M TAM
```

**Segmento 2: Startups/Small Teams (Highest Value)**
```
Characteristics:
- 2-10 developers
- Angular + Supabase stack (common combo)
- Fast iteration, quality matters
- Pain: Onboarding devs to AI workflow
- Budget: $500-2,000/year for team tools
- Decision maker: Tech lead / CTO

Size: ~500-1,000 startups globally
Value: $1,000-2,000/year/team
Potential: $500k-2M TAM
```

**Segmento 3: Enterprise Teams (Hardest to reach)**
```
Characteristics:
- 10-100+ developers
- Legacy Angular apps being modernized
- Strict architecture requirements
- Pain: AI breaking established patterns
- Budget: $5,000-50,000/year
- Decision maker: Architecture board

Size: ~200-500 companies
Value: $10,000-50,000/year
Potential: $2-25M TAM
```

**Geografía:**

| Region | Devs | Opportunity | Challenges |
|--------|------|-------------|------------|
| **Hispanohablantes** (LATAM + España) | 6-10k | First-mover, less competition | Lower budget, payment friction |
| **North America** | 80-120k | High budget, willing to pay | Very competitive, established players |
| **Europe** | 60-90k | Medium budget, quality-focused | Language barrier (some countries) |
| **Asia** | 40-60k | Growing fast | Cultural fit unclear |

**Early adopter profile (más probable):**
```
👤 PERSONA: "Angular Dev using Claude"
├─ Age: 28-45
├─ Experience: 3-8 years Angular
├─ Current tools: Claude Code, Cursor, or GitHub Copilot
├─ Pain points:
│   ├─ AI breaks architecture frequently
│   ├─ Code reviews take forever
│   ├─ Junior devs struggle with AI-generated code
│   └─ Technical debt accumulates fast
├─ Willingness to pay: $99-149/year
├─ Decision time: 1-2 weeks (personal) or 1-2 months (team)
└─ Discovery: Reddit, Twitter, YouTube tutorials
```

### 5.2 Value Proposition

**Para Developers Individuales:**
```
HEADLINE: "Stop Fixing What AI Breaks"

Subheadline: "Koa enforces Angular best practices so Claude can't 
degrade your architecture - even when you're coding at 3am."

Value props:
✅ 3 días → horas (80-90% tiempo ahorrado)
✅ Zero re-work (hooks previenen bad code)
✅ Learn best practices (guardrails teach you)
✅ Instant setup (npx y listo)

Objeciones:
❌ "Ya uso ESLint" → ESLint valida sintaxis, no arquitectura
❌ "Puedo configurar yo" → Te tomará semanas, Koa minutos
❌ "Muy restrictivo" → Puedes deshabilitar hooks específicos
```

**Para Equipos/Empresas:**
```
HEADLINE: "Onboard AI Safely. Scale Without Code Reviews."

Subheadline: "Let junior devs use AI without breaking your 
architecture. Koa blocks bad patterns before they hit production."

Value props:
✅ Onboarding 70% más rápido (rules auto-enforced)
✅ Code review time reducido 50%
✅ Zero tech debt from AI
✅ Compliance built-in (architecture governance)

ROI:
- Developer time saved: $10-30k/year per team
- Code review reduction: $5-15k/year
- Tech debt prevention: $20-50k/year
- Investment: $1,000-2,000/year

Payback: 2-4 semanas
```

**Para Consultoras:**
```
HEADLINE: "Ship Faster. Charge More. Deliver Quality."

Subheadline: "Koa lets you use AI for client projects without 
compromising standards. Your secret weapon."

Value props:
✅ 2-3x más proyectos/año (mismo equipo)
✅ Higher margins (menos re-work)
✅ Client confidence (architecture guaranteed)
✅ White-label available (tu branding)

Numbers:
- Proyecto typical: 3 meses → 1 mes
- Margin improvement: 20-40%
- Client retention: +30% (quality reputation)
```

**ROI Estimado por Segmento:**

**Individual Developer:**
```
Costo Koa: $99/year
Ahorro tiempo: 5-10 hours/month
Value de tiempo: $50-100/hour

ROI mensual:
5 hours × $50 = $250/month saved
Annual ROI: $3,000 saved - $99 cost = $2,901 net
ROI: 2,930%
```

**Startup Team (5 devs):**
```
Costo Koa: $1,000/year (team plan)
Ahorro:
- Dev time: 25 hours/month × $75/hour = $1,875/month
- Code review: 10 hours/month × $100/hour = $1,000/month
- Tech debt prevention: ~$1,000/month equivalent

Total ahorro: $3,875/month = $46,500/year
ROI: $46,500 - $1,000 = $45,500 net
ROI: 4,550%
```

**Enterprise (50 devs):**
```
Costo Koa: $25,000/year (enterprise)
Ahorro:
- Dev time: 250 hours/month × $100/hour = $25,000/month
- Reduced rework: $10,000/month
- Architecture governance: $5,000/month

Total ahorro: $40,000/month = $480,000/year
ROI: $480,000 - $25,000 = $455,000 net
ROI: 1,820%
```

**Estos números son aspiracionales** - requieren validación con usuarios reales.

---

## 6. MODELO DE NEGOCIO PROPUESTO

### 6.1 Estrategias de Monetización Analizadas

**MODELO 1: OPEN CORE (RECOMENDADO)**

**Estructura:**
```
FREE TIER (MIT License):
├─ CLI core (create-koa-agent)
├─ Basic guardrails (OnPush, no animations)
├─ Boilerplate templates
├─ Community support (Discord, GitHub issues)
└─ Documentation

PRO TIER ($99-149/year por developer):
├─ Advanced guardrails
│   ├─ Custom rules engine
│   ├─ AST-based validation
│   └─ Team-specific patterns
├─ Premium templates
│   ├─ E-commerce starter
│   ├─ Dashboard kit
│   └─ Auth boilerplate
├─ VS Code extension
│   ├─ Inline validation
│   └─ Quick fixes
├─ Priority support
└─ Early access to features

ENTERPRISE TIER ($2,400-5,000/year per team):
├─ Everything in Pro
├─ Custom guardrails for your org
├─ Private template repository
├─ SSO integration
├─ SLA (24h response)
├─ Architecture consultation (2h/month included)
├─ Training sessions (quarterly)
├─ Unlimited seats
└─ On-premise deployment option
```

**Pricing Strategy:**
```
Pro Individual:
- Monthly: $15/month ($180/year)
- Annual: $99/year (45% discount, preferred)
- Lifetime: $399 (one-time, limited availability)

Pro Team (up to 10 devs):
- Annual: $749/year ($75/dev/year - 50% discount)

Enterprise (10+ devs):
- Base: $2,400/year (up to 25 devs)
- Scale: $5,000/year (unlimited)
- Custom: Talk to sales
```

**Year 1 Projections (Conservative → Optimistic):**

| Metric | Conservative | Realistic | Optimistic |
|--------|--------------|-----------|------------|
| **Free users** | 1,000 | 3,000 | 10,000 |
| **Pro individuals** | 50 ($4,950) | 200 ($19,800) | 500 ($49,500) |
| **Pro teams** | 10 ($7,490) | 30 ($22,470) | 50 ($37,450) |
| **Enterprise** | 2 ($5,000) | 5 ($12,500) | 10 ($25,000) |
| **Total MRR** | $1,453/month | $4,564/month | $9,329/month |
| **Total ARR** | **$17,440** | **$54,770** | **$111,950** |

**Conversion funnel:**
```
1,000 free users
  ↓ 5% try Pro trial
  50 trials
  ↓ 40% convert
  20 Pro users → $1,980 ARR

Benchmark: Industry standard 2-5% free→paid
Koa assumption: 5% (high value prop)
```

**Pros:**
- ✅ Marketing via free tier
- ✅ Network effects (more users = more visible)
- ✅ Viral potential
- ✅ Community building
- ✅ Open source credibility

**Cons:**
- ❌ Slower to revenue
- ❌ Support burden (free users)
- ❌ Copycats can fork
- ❌ Complex pricing tiers

**Viabilidad para Benjamín:**
- ⚠️ Medium complexity
- ⚠️ Requires marketing skills
- ⚠️ 6-12 months to meaningful revenue
- ✅ Scalable long-term

---

**MODELO 2: PURE SAAS**

**Estructura:**
```
HOSTED VERSION (cloud.koa.dev):
├─ No local installation
├─ Web-based project creation
├─ Real-time validation dashboard
├─ Team collaboration
└─ Analytics & insights

TIERS:
Starter ($19/month):
├─ 1 project
├─ Basic guardrails
└─ 5GB storage

Team ($49/month per seat):
├─ Unlimited projects
├─ Advanced guardrails
├─ Team sharing
└─ 50GB storage

Enterprise ($Custom):
├─ Everything in Team
├─ On-premise option
├─ Custom integrations
└─ SLA
```

**Year 1 Projections:**

| Metric | Conservative | Realistic | Optimistic |
|--------|--------------|-----------|------------|
| **Starter** | 100 ($1,900) | 300 ($5,700) | 800 ($15,200) |
| **Team** | 50 ($29,400) | 150 ($88,200) | 400 ($235,200) |
| **Enterprise** | 1 ($60,000) | 3 ($180,000) | 8 ($480,000) |
| **Total MRR** | $7,608/month | $22,825/month | $60,867/month |
| **Total ARR** | **$91,300** | **$273,900** | **$730,400** |

**Pros:**
- ✅ Higher MRR potential
- ✅ Sticky (usuarios committed)
- ✅ Clearer pricing
- ✅ Easier upsells

**Cons:**
- ❌ Requires infrastructure ($$$)
- ❌ 6-12 months development
- ❌ Competes with VS Code/GitHub
- ❌ Operational complexity (uptime, security)

**Viabilidad para Benjamín:**
- ❌ Low (solo, sin capital)
- ❌ Requires team (backend, DevOps, design)
- ❌ High risk, high reward
- ⚠️ Fase 2, no Fase 1

---

**MODELO 3: SERVICES + PRODUCT (HYBRID) ⭐ FASTEST TO CASH**

**Estructura:**
```
PRODUCTS:
├─ Koa CLI: FREE (open source)
├─ Templates: $49-299 each (one-time)
├─ Pro version: $99/year
└─ Enterprise: $5,000/year

SERVICES:
├─ Implementation: $1,500-3,000 (setup Koa for existing project)
├─ Training: $2,000-5,000 (team workshop on AI coding)
├─ Consulting: $150/hour (architecture review)
├─ Retainer: $3,000-8,000/month (ongoing support)
└─ Transformation: $20,000-50,000 (enterprise Angular modernization)
```

**Timeline to Revenue:**
```
Month 1-3:
├─ Services: 3-5 implementations ($6,000-15,000)
├─ Product: 10-20 Pro licenses ($990-1,980)
└─ Total: $7,000-17,000

Month 4-9:
├─ Services: shift to premium (training, retainers)
├─ Product: scale Pro, launch templates
└─ Total: $15,000-40,000

Month 10-18:
├─ Services: enterprise transformations
├─ Product: steady MRR
└─ Total: $50,000-150,000
```

**Year 1 Projections:**

| Stream | Revenue |
|--------|---------|
| **Implementation services** | $15,000-45,000 |
| **Training** | $8,000-25,000 |
| **Consulting** | $6,000-18,000 |
| **Retainers** | $12,000-48,000 |
| **Product (Pro)** | $10,000-30,000 |
| **Templates** | $2,000-8,000 |
| **Total Year 1** | **$53,000-174,000** |

**Pros:**
- ✅ FAST to cash (services can start week 1)
- ✅ Validates product (real clients = feedback)
- ✅ Self-funded (no investors needed)
- ✅ Leverages existing skills (Benjamín ya hace esto)
- ✅ Multiple revenue streams

**Cons:**
- ❌ Time for money (less scalable)
- ❌ Services distract from product
- ❌ Hard to sell services solo (needs credibility)

**Viabilidad para Benjamín:**
- ✅ HIGH (can start immediately)
- ✅ Low risk (service = guaranteed income)
- ✅ Builds reputation for product
- ⚠️ Requires sales skills

---

**MODELO 4: MARKETPLACE**

**Estructura:**
```
KOA STORE (marketplace.koa.dev):

Creators upload:
├─ Custom guardrails ($5-50)
├─ Template packs ($20-200)
├─ Skills bundles ($10-100)
└─ Plugins/extensions ($15-150)

Koa takes: 20-30% commission

Example:
├─ Creator sells template for $99
├─ Koa keeps $20-30
├─ Creator gets $69-79
```

**Year 1 Projections (Long-term play):**
```
Assumptions:
- 50 creators
- Average 3 products each
- Average price $50
- 200 sales total/year

Revenue:
200 sales × $50 × 25% commission = $2,500
```

**Pros:**
- ✅ Ecosystem play
- ✅ Network effects
- ✅ Creators market for you
- ✅ Passive income potential

**Cons:**
- ❌ Requires established user base first
- ❌ Chicken-egg problem (creators need users, users need content)
- ❌ Low revenue year 1
- ❌ Complex platform to build

**Viabilidad para Benjamín:**
- ⚠️ Phase 3 (after product established)
- ❌ Not viable year 1
- ✅ Good long-term vision

---

**RECOMENDACIÓN: Hybrid (Modelo 3) para Year 1 → Open Core (Modelo 1) para Year 2+**
```
YEAR 1: Services-first
├─ Freelance implementation: $30-50k
├─ Koa Pro: $10-20k
├─ Total: $40-70k
└─ Goal: Self-funded, validate product

YEAR 2: Product-led
├─ Services (premium only): $20-40k
├─ Koa Pro MRR: $50-100k
├─ Enterprise: $20-50k
├─ Total: $90-190k
└─ Goal: Scalable business

YEAR 3: Platform
├─ Services: $10-20k (referrals only)
├─ Product MRR: $150-300k
├─ Marketplace: $20-50k
├─ Total: $180-370k
└─ Goal: Exit or scale to $1M
```

### 6.2 Go-to-Market Strategies

**ESTRATEGIA 1: CONTENT-LED GROWTH** (Principal)

**Estructura:**
```
CONTENT PILLARS:
1. "AI is breaking your codebase" (problem awareness)
2. "How to AI-proof Angular apps" (solution education)
3. "Building with AI agents" (thought leadership)

CHANNELS:
├─ LinkedIn (primary): technical posts en español/inglés
├─ Twitter/X: quick tips, engagement
├─ YouTube: demos, tutorials
├─ Blog: deep dives (SEO)
└─ Newsletter: weekly updates
```

**Cadencia semanal:**
```
LUNES:
├─ LinkedIn post (Spanish): technical insight
└─ Twitter thread: quick tip

MIÉRCOLES:
├─ YouTube video: 5-10min tutorial
└─ LinkedIn post (English): same content

VIERNES:
├─ Blog post: deep dive (1,500-2,000 words)
├─ Newsletter: curated + original content
└─ Twitter: promote blog post

DOMINGO:
└─ Preparar content próxima semana (batch)
```

**Content calendar Q1:**
```
SEMANA 1: "Why AI Breaks Your Architecture"
├─ LinkedIn: case study autoescuela project
├─ YouTube: "Watch Claude destroy my codebase"
├─ Blog: "The Hidden Cost of AI-Generated Code"

SEMANA 2: "Introducing Guardrails"
├─ LinkedIn: guardrails 101
├─ YouTube: "Build your first guardrail"
├─ Blog: "Deterministic vs Non-Deterministic Guardrails"

SEMANA 3: "Angular + AI Best Practices"
├─ LinkedIn: OnPush with AI agents
├─ YouTube: "Facade Pattern for AI-resistant Apps"
├─ Blog: "The Complete Guide to AI-Native Angular"

SEMANA 4: "Koa Deep Dive"
├─ LinkedIn: Koa launch announcement
├─ YouTube: "Koa full tutorial"
├─ Blog: "Case Study: 3 Days → 3 Hours"
```

**Tools para eficiencia:**
```
Generación:
├─ Claude API: draft posts from outlines
├─ Midjourney: thumbnails, diagrams
└─ Canva: branded graphics

Distribución:
├─ Buffer/Hootsuite: schedule posts
├─ Repurpose.io: video → blog → social
└─ Zapier: automation

Analytics:
├─ Google Analytics: blog traffic
├─ LinkedIn Analytics: engagement
└─ YouTube Analytics: views, retention
```

**KPIs:**

| Métrica | Month 1 | Month 3 | Month 6 | Month 12 |
|---------|---------|---------|---------|----------|
| **LinkedIn followers** | 100 | 500 | 2,000 | 10,000 |
| **YouTube subs** | 50 | 200 | 1,000 | 5,000 |
| **Blog visitors** | 500 | 2,000 | 10,000 | 50,000 |
| **Newsletter subs** | 50 | 300 | 1,500 | 8,000 |
| **GitHub stars** | 20 | 200 | 1,000 | 5,000 |

**Conversión esperada:**
```
1,000 followers → 20-50 free users → 2-5 paid
(2-5% conversion rate)

After 6 months:
10,000 total reach → 200-500 users → 20-50 paid
$2,000-5,000 MRR
```

**Viabilidad para Benjamín:**

- ⚠️ Requiere consistencia (52 posts/year)
- ⚠️ Inglés básico = limitante (pero AI puede ayudar)
- ✅ Time investment: 10-15h/week
- ✅ Cost: $0-50/month (tools)

---

**ESTRATEGIA 2: COMMUNITY-LED GROWTH**

**Estructura:**
```
PLATFORMS:
├─ Reddit (r/angular, r/webdev, r/Claude)
├─ Discord (Angular community servers)
├─ Dev.to (articles + engagement)
├─ HackerNews (strategic posts)
└─ GitHub Discussions
```

**Approach: Help-First, Sell Never**
```
EJEMPLO:
Reddit post: "How do I prevent AI from breaking OnPush?"

Reply:
"Great question! OnPush with AI is tricky. Here's what I do:

1. Explicit instruction in context
2. Code review every component
3. Guardrail validation (I built a tool for this)

I wrote a detailed guide here: [blog link]

If you want automated enforcement, check out Koa (I'm the creator, 
but it's free): [github link]"
```

**NOT:**
```
❌ "Use Koa! It's amazing!"
❌ Spam links
❌ Self-promotion without value
```

**Timeline:**
```
MONTH 1: Lurk & Learn
├─ Join communities
├─ Read, upvote, learn norms
└─ Zero self-promotion

MONTH 2-3: Provide Value
├─ Answer 5-10 questions/week
├─ Write helpful guides
├─ Mention Koa naturally (1/10 answers)

MONTH 4-6: Establish Authority
├─ Known as "Angular + AI expert"
├─ People ask about Koa
├─ Organic mentions
```

**Expected Acquisition:**
```
FIRST 50 USERS: From Reddit/Discord (word of mouth)
NEXT 200: Referrals from first 50
NEXT 1000: Organic (SEO, GitHub trending)
```

**Viabilidad para Benjamín:**
- ✅ LOW time investment (5-10h/week)
- ✅ FREE
- ✅ Natural fit (already technical expert)
- ⚠️ Slow burn (3-6 months to traction)

---

**ESTRATEGIA 3: PARTNERSHIP-LED GROWTH** (High Risk, High Reward)

**Potential Partners:**

**1. INFLUENCERS / EDUCATORS**
```
TARGET: Web Reactiva (Dani Primo)
├─ Audience: 5,800+ subscribers
├─ Content overlap: 70%
├─ Proposal: "Koa is the practical implementation of your teachings"
├─ Deal: 30% affiliate on Pro sales
└─ Pitch: "Your audience learns concepts, Koa executes them"

Expected outcome:
- Best case: 500-1,000 users via his recommendation
- Worst case: Ignored or rejected
```

**2. TOOL INTEGRATIONS**
```
TARGET: Supabase
├─ Audience: Supabase users building Angular apps
├─ Value prop: "Official Angular starter for Supabase"
├─ Proposal: Co-marketing, featured in docs
├─ Deal: Revenue share or free promotion

TARGET: PrimeNG
├─ Audience: PrimeNG users
├─ Value prop: "AI-resistant PrimeNG boilerplate"
├─ Proposal: Featured template in showcase
└─ Deal: Backlink, co-promotion
```

**3. CONSULTORAS / AGENCIES**
```
TARGET: Globant, Accenture, local consultoras
├─ Pain: Junior devs using AI without architecture knowledge
├─ Value prop: "White-label Koa for your clients"
├─ Proposal: License Koa as internal tool
└─ Deal: $10-20k/year enterprise license

Expected: 2-5 agencies in year 1 = $20-100k
```

**4. EDUCATION PLATFORMS**
```
TARGET: Platzi, Udemy, Frontend Masters
├─ Proposal: "Angular with AI Agents" course
├─ Koa as official tool for course
├─ Deal: Student licenses (discount or free)
└─ Exposure: Thousands of students

Expected: 1,000-5,000 student installs
Conversion: 1-2% to paid = 10-100 Pro users
```

**CRÍTICA PARTNERSHIP: Web Reactiva**
```
OUTREACH EMAIL (Draft):

Subject: Koa: Implementando tus enseñanzas sobre guardrails

Hola Dani,

Soy Benjamín, developer Angular de Chile. Leo Web Reactiva 
religiosamente - tus posts sobre guardrails y skills son oro.

He construido Koa: un CLI que IMPLEMENTA automáticamente los 
conceptos que enseñas. Es básicamente "Web Reactiva como código":

- Guardrails → hooks que bloquean (no solo sugieren)
- Skills → templates pre-configurados
- Progressive disclosure → índices built-in

Específicamente para Angular + Supabase.

¿Interés en colaborar? Podría ser:
1. Koa como "herramienta oficial" de tus lectores
2. Affiliate 30% en ventas Pro
3. Co-marketing (win-win-win)

Demo: [link]
GitHub: [link]

¿15min de Zoom esta semana?

Saludos,
Benjamín
```

**Riesgos:**
- ❌ Puede rechazar
- ❌ Puede copiar la idea
- ❌ Puede ignorar
- ❌ Dependencia en un solo partner

**Rewards:**
- ✅ Instant 5,800+ audience
- ✅ Credibility boost
- ✅ Validation del concepto
- ✅ Potential $10-50k revenue year 1

**Viabilidad para Benjamín:**
- ⚠️ HIGH RISK
- ⚠️ Requiere sales pitch
- ✅ LOW time investment (emails)
- ✅ Potentially transformative

---

**ESTRATEGIA 4: PRODUCT-LED GROWTH**

**Built-in Virality:**
```
CLI OUTPUT:
✅ Project created successfully!

Built with Koa Agent CLI ❤️
https://koa.dev

Share your experience:
https://twitter.com/intent/tweet?text=Just%20built%20with%20Koa
Footer in Generated Apps:
html<!-- src/app/app.component.html -->
<footer>
  <small>Built with <a href="https://koa.dev">Koa</a></small>
</footer>
```

**Referral Loop:**
```
When developer runs: koa invite team@example.com

CLI:
├─ Sends email with invite link
├─ Tracked referral code
├─ If team converts → referrer gets 1 month free

Expected: 10-20% of Pro users refer
Conversion: 30% of referrals convert
Net: 3-6% growth from referrals
```

**Public Showcase:**
```
koa.dev/showcase

Real projects built with Koa:
├─ Autoescuela (by creator)
├─ FamilyApp (by creator)
├─ [User-submitted projects]

Each with:
├─ Screenshot
├─ Tech stack
├─ Developer testimonial
└─ "Use This Template" button
```

**GitHub Trending:**
```
Strategy:
├─ Launch on HackerNews
├─ Post to r/programming
├─ Tag #Angular #AI on Twitter
├─ Aim for GitHub trending

Expected: 100-500 stars in first week
Sustained: 50-100 stars/month
Conversion: 1-2% stars → installs → 0.1% paid
```

**Viabilidad para Benjamín:**
- ✅ LOW effort (build once)
- ✅ Compounding over time
- ✅ Organic, sustainable
- ⚠️ Slow initial traction

---

**RECOMENDACIÓN: Multi-Prong Approach**
```
YEAR 1 STRATEGY:

PRIMARY (60% effort):
└─ Content-led growth (LinkedIn, YouTube, Blog)

SECONDARY (30% effort):
└─ Community-led growth (Reddit, Discord, Dev.to)

TERTIARY (10% effort):
├─ Partnership outreach (Web Reactiva, Supabase)
└─ Product-led (built-in virality)

TIMELINE:
Month 1-3: Content + Community (build presence)
Month 4-6: Continue + reach out to partners
Month 7-12: Scale what works, cut what doesn't

DECISION POINTS:
├─ Month 3: Is content getting traction?
├─ Month 6: Did partnerships respond?
└─ Month 9: Are we on track for 500 users?
```

---

## 7. ROADMAP Y PRÓXIMOS PASOS

### 7.1 Gaps Identificados

**GAP #1: NPM Publishing** (Critical)
```
CURRENT STATE:
❌ Requiere git clone + npm link
❌ Fricción extrema para adopción
❌ No discoverable en npm search

DESIRED STATE:
✅ npx create-koa-agent
✅ Versioning semántico
✅ Automática updates

BLOCKER:
- ¿Nombre disponible en NPM? (verificar)
- ¿Necesita cuenta organization?
- ¿Cómo manejar templates/ dentro del package?

EFFORT: 1-2 días
IMPACT: HIGH (elimina fricción #1)
PRIORITY: P0 (debe hacerse antes de lanzamiento)
```

**GAP #2: Falta de Usuarios Externos** (Validation)
```
CURRENT STATE:
❌ Solo círculo de Benjamín (~5 personas)
❌ No hay feedback independiente
❌ Posible acoplamiento a workflow personal

DESIRED STATE:
✅ 50+ instalaciones externas
✅ 5+ testimonials independientes
✅ GitHub issues de usuarios reales

SOLUTION:
- Test con 5-10 Angular devs externos
- Reddit "Show HN" post
- Pedir feedback honesto

EFFORT: 2-3 semanas
IMPACT: HIGH (valida generalización)
PRIORITY: P0 (must-have antes de monetizar)
```

**GAP #3: Acoplamiento a Workflow Personal**
```
SYMPTOM:
Benjamín dice: "Puede que sí esté acoplado a mi forma de trabajar"

RISKS:
❌ Reglas demasiado específicas para su stack
❌ Hooks bloquean casos válidos
❌ No flexible enough para otros teams

TEST:
├─ ¿Otros pueden deshabilitar hooks específicos?
├─ ¿Configuración permite customization?
├─ ¿Funciona para Angular no-Supabase?

SOLUTION (roadmap):
├─ Config file: .koa.config.js
├─ Per-hook enable/disable
├─ Custom rules API

EFFORT: 3-5 días
IMPACT: MEDIUM (mejora adoption)
PRIORITY: P1 (nice-to-have año 1)
```

**GAP #4: Documentación Pública** (Marketing)
```
CURRENT STATE:
❌ GitHub README básico
❌ No landing page (koa.dev no existe)
❌ No case studies públicos
❌ No video demo

DESIRED STATE:
✅ Landing page profesional
✅ Video demo 3-5min
✅ Case study autoescuela
✅ Docs site (docs.koa.dev)

EFFORT: 1-2 semanas
IMPACT: MEDIUM (conversión)
PRIORITY: P1 (antes de marketing push)
```

**GAP #5: Testing & Quality** (Product)
```
CURRENT STATE:
❌ No unit tests
❌ No integration tests
❌ No CI/CD
❌ Manual testing only

DESIRED STATE:
✅ 80%+ test coverage
✅ GitHub Actions CI
✅ Automated releases
✅ Regression suite

EFFORT: 2-3 semanas
IMPACT: LOW (año 1), HIGH (long-term)
PRIORITY: P2 (post-launch)
```

**GAP #6: Multi-Framework Support** (Scaling)
```
CURRENT STATE:
❌ Angular-only
❌ TAM limitado a ~200k devs

DESIRED STATE:
✅ React template
✅ Vue template
✅ Svelte template
✅ TAM expande a 2M+ devs

EFFORT: 4-8 semanas per framework
IMPACT: HIGH (10x TAM)
PRIORITY: P3 (year 2+)
```

**GAP #7: Inglés / i18n** (Global Reach)
```
CURRENT STATE:
⚠️ CLAUDE.md en inglés (good)
⚠️ CLI messages en inglés (good)
❌ Docs mayormente español
❌ Creator inglés básico

DESIRED STATE:
✅ Full English docs
✅ Spanish + English support
✅ CLI i18n

EFFORT: 1 semana (con AI help)
IMPACT: HIGH (global market)
PRIORITY: P1 (antes de lanzamiento global)
```

### 7.2 Plan de Validación Recomendado

**SEMANA 1-2: TEST DE GENERALIZABILIDAD**
```
OBJETIVO: ¿Koa funciona para otros, no solo Benjamín?

ACCIÓN:
1. Publicar en NPM (alpha/beta)
   └─ npx create-koa-agent@beta

2. Reclutar 5 testers externos:
   ├─ Reddit r/angular: "Looking for beta testers"
   ├─ Discord Angular servers
   ├─ LinkedIn DM a Angular devs
   └─ Twitter: "Early access for 5 testers"

3. Onboarding asistido:
   ├─ Video call guiado
   ├─ Observar primeros pasos
   └─ Tomar notas de fricción

4. Feedback estructurado:
   ├─ Survey después de 3 días uso
   ├─ Preguntas específicas:
   │   ├─ ¿Instalación fue fácil? (1-5)
   │   ├─ ¿Entiendes el value prop? (1-5)
   │   ├─ ¿Lo usarías? (sí/no/maybe)
   │   ├─ ¿Qué falta?
   │   └─ ¿Pagarías $99/año? (sí/no)

CRITERIO ÉXITO:
✅ 3/5 instalan sin ayuda
✅ 3/5 entienden valor en <15min
✅ 2/5 dicen "usaría esto"
✅ 0 blockers críticos

CRITERIO FRACASO:
❌ <2 pueden instalarlo
❌ "No entiendo para qué sirve"
❌ "Esto solo funciona para tu setup"
❌ Bugs críticos

ACCIÓN SI FALLA:
└─ Pivotar a herramienta interna
   Usar Koa como ventaja competitiva freelance
   NO intentar vender producto
```

**SEMANA 3-4: TEST DE DEMANDA DE MERCADO**
```
OBJETIVO: ¿Hay interés real en esto?

ACCIÓN:
1. Show HN post en Reddit r/angular:
   ├─ Título: "Show HN: Koa - AI-Resistant Angular Architecture"
   ├─ Content: Demo GIF, problema, solución
   └─ Link a GitHub + landing page

2. YouTube Demo:
   ├─ 5min: "How AI Breaks Your Code (and how to stop it)"
   ├─ Show Claude destruyendo arquitectura
   ├─ Show Koa bloqueándolo
   └─ CTA: GitHub link

3. LinkedIn Launch Posts:
   ├─ Post 1 (Spanish): Announcement + story
   ├─ Post 2 (English): Technical deep dive
   └─ Post 3: Case study (autoescuela)

4. Engage aggressively:
   ├─ Responder TODOS los comments
   ├─ DMs a quienes muestren interés
   └─ Gather email list

CRITERIO ÉXITO:
✅ 100+ GitHub stars en 1 semana
✅ 50+ Reddit upvotes
✅ 20+ comments constructivos
✅ 10+ personas preguntan "when Pro?"
✅ 5+ "I'd pay for this"

CRITERIO FRACASO:
❌ <20 GitHub stars
❌ <10 Reddit upvotes
❌ Comments: "meh" o "no lo entiendo"
❌ Cero interés en pagar

ACCIÓN SI FALLA:
└─ Problema: Messaging o no hay mercado
   ├─ Si comments son "interesante pero no para mí"
   │   → Messaging wrong, iterar
   ├─ Si comments son "no lo necesito"
   │   → No hay mercado, pivotar
```

**SEMANA 5-6: TEST DE WILLINGNESS TO PAY**
```
OBJETIVO: ¿Pagarían por esto?

ACCIÓN:
1. Landing page con pre-order:
   ├─ Headline: "Stop Fixing What AI Breaks"
   ├─ Demo video embedded
   ├─ Pricing: Koa Pro $99/year (early bird $49)
   ├─ CTA: "Pre-order now, launch Q2 2026"
   └─ Email capture

2. Email campaña a interesados:
   ├─ Segment: GitHub stargazers + Reddit engagers
   ├─ Subject: "Early bird Koa Pro: $49 (50% off)"
   ├─ Content: Features, testimonials, urgency
   └─ CTA: "Secure your spot"

3. LinkedIn DM a decision makers:
   ├─ Target: CTOs, tech leads de startups Angular
   ├─ Pitch: Enterprise tier ($2,400/year)
   ├─ Offer: Free pilot (3 months)
   └─ Goal: 1-2 enterprise deals

CRITERIO ÉXITO:
✅ 10+ pre-orders ($490-990)
✅ 50+ email signups
✅ 1 enterprise interesado
✅ Validates willingness to pay

CRITERIO FRACASO:
❌ <3 pre-orders
❌ <20 email signups
❌ Pushback: "too expensive"
❌ "I'll wait for free version"

ACCIÓN SI FALLA:
└─ Free tool, monetize via services
   ├─ Koa = 100% open source
   ├─ Revenue = implementation services
   └─ Model híbrido año 1
```

**DECISION TREE (DÍA 45)**
```
TEST RESULTS:

┌─ TODOS VERDES (Prob: 20%) ──────────────┐
│  All-in Koa                              │
│  ├─ Quit freelance hunting              │
│  ├─ 70% producto, 30% servicios         │
│  ├─ Publish v1.0 en NPM                 │
│  ├─ Launch marketing                    │
│  └─ Expectativa: $2-5k/mes en 6 meses  │
└──────────────────────────────────────────┘

┌─ TEST 1+2 VERDES, TEST 3 ROJO (Prob: 30%) ─┐
│  Free tool + Services                       │
│  ├─ Koa = 100% gratis y open source       │
│  ├─ Monetizar implementaciones            │
│  ├─ Build brand via free tool             │
│  └─ Expectativa: $1.5-3k/mes servicios    │
└─────────────────────────────────────────────┘

┌─ SOLO TEST 1 VERDE (Prob: 30%) ─────────┐
│  Internal Tool + Freelance Advantage     │
│  ├─ Koa = ventaja competitiva personal  │
│  ├─ Pitch: "2x más rápido con mi stack" │
│  ├─ No marketing público                │
│  └─ Expectativa: $2-4k/mes freelance    │
└──────────────────────────────────────────┘

┌─ TODOS ROJOS (Prob: 20%) ────────────────┐
│  Pivot a Trabajo Remoto                  │
│  ├─ Koa = hobby/side project            │
│  ├─ Buscar trabajo estable remoto       │
│  ├─ Expectativa: $1.5-2.5k/mes salario  │
│  └─ Revisar Koa en 1 año                │
└──────────────────────────────────────────┘
```

### 7.3 Decisiones Pendientes

**DECISIÓN #1: ¿Colaboración vs Competencia?**
```
OPCIÓN A: COLABORACIÓN (Web Reactiva, Society)
Pros:
├─ Instant audience (5,800+)
├─ Credibility boost
├─ Win-win-win
└─ Faster to traction

Cons:
├─ Dependencia en otros
├─ Pueden rechazar
├─ Pueden copiar idea
└─ Less control

Recomendación: INTENTAR (low risk, high reward)
├─ Email Dani Primo esta semana
├─ Si responde positivo → colaborar
├─ Si no responde en 2 semanas → independiente
```

**DECISIÓN #2: ¿Angular-only vs Multi-framework?**
```
OPCIÓN A: ANGULAR-ONLY (Deep, Not Wide)
Pros:
├─ Dominate niche
├─ Expertise percibida
├─ Menos competencia
└─ Easier to maintain

Cons:
├─ TAM limitado (~200k)
├─ Vulnerable a Angular decline
└─ Hard to scale beyond niche

OPCIÓN B: MULTI-FRAMEWORK (Wide, Not Deep)
Pros:
├─ TAM 10x más grande (2M+)
├─ Framework-agnostic = more users
└─ Diversification

Cons:
├─ Diluted expertise
├─ 3-4x más código para mantener
├─ Harder differentiation
└─ Competes con Web Reactiva directamente

Recomendación: ANGULAR-ONLY year 1
├─ Validar product-market fit primero
├─ Expandir a React/Vue year 2+ si funciona
```

**DECISIÓN #3: ¿Open Source vs Propietario?**
```
OPCIÓN A: OPEN SOURCE (MIT)
Pros:
├─ Marketing viral
├─ Community contributions
├─ Trust & credibility
└─ GitHub trending potential

Cons:
├─ Copycats pueden fork
├─ Harder to monetize
└─ Support burden

OPCIÓN B: PROPIETARIO (Closed)
Pros:
├─ Control total
├─ Easier monetization
└─ Competitive moat

Cons:
├─ Zero organic growth
├─ No community
└─ Trust issues

OPCIÓN C: OPEN CORE (Hybrid) ⭐
Pros:
├─ Best of both worlds
├─ Free tier = marketing
├─ Pro tier = revenue
└─ Community + business model

Recomendación: OPEN CORE
├─ Core CLI: MIT license
├─ Advanced features: Proprietary
├─ Launch with free tier first
```

**DECISIÓN #4: ¿Services-first vs Product-first?**
```
OPCIÓN A: SERVICES-FIRST
Timing:
├─ Month 1: Can earn money
├─ Validation: Real clients = feedback
├─ Risk: LOW (guaranteed income)

Cons:
├─ Time for money
├─ Distracts from product
└─ Not scalable

OPCIÓN B: PRODUCT-FIRST
Timing:
├─ Month 6-12: First revenue
├─ Validation: Market metrics
├─ Risk: HIGH (might fail)

Pros:
├─ Scalable
├─ Passive income potential
└─ Exit potential

Recomendación: SERVICES-FIRST (año 1)
├─ Parallel freelance + Koa development
├─ Use service clients as beta testers
├─ Pivot to product once validated
```

**DECISIÓN #5: ¿Personal Brand vs Company Brand?**
```
OPCIÓN A: PERSONAL (Benjamín Rebolledo)
Pros:
├─ Easier to start
├─ Authentic, relatable
├─ Network effects (LinkedIn)
└─ Lower expectations

Cons:
├─ Hard to sell business later
├─ Single point of failure
└─ Pressure on personality

OPCIÓN B: COMPANY (Koa Labs, etc.)
Pros:
├─ Professional perception
├─ Easier to hire
├─ Saleable asset
└─ Scalable brand

Cons:
├─ Slower trust building
├─ Needs budget (logo, web, etc.)
└─ More formal

Recomendación: PERSONAL FIRST
├─ "Koa by Benjamín" (año 1)
├─ Transition to company (año 2+)
├─ Best: authentic start, professional scale
```

**DECISIÓN #6: ¿Lanzamiento Silencioso vs Gran Launch?**
```
OPCIÓN A: STEALTH LAUNCH
├─ Publicar NPM quietly
├─ Test con 10-20 early users
├─ Iterar basado en feedback
├─ Gran launch después

Pros:
├─ Menos presión
├─ Más tiempo para refinar
└─ Avoid "dead on arrival"

Cons:
├─ No momentum
├─ Slow growth
└─ Missed timing window

OPCIÓN B: GRAN LAUNCH
├─ Coordinado: HN + Reddit + LinkedIn + YouTube
├─ Press kit, demo, landing page
├─ Goal: GitHub trending

Pros:
├─ Maximum visibility
├─ Momentum
└─ Press attention

Cons:
├─ High expectations
├─ If it flops, hard to recover
└─ Need polished product

Recomendación: STEALTH BETA → GRAN LAUNCH
├─ Week 1-6: Beta con 20-50 users
├─ Week 7-8: Polish basado en feedback
├─ Week 9: Gran launch coordinado
```

**DECISIÓN MASTER: ¿Continuar o Pivotar?**
```
EXIT CRITERIA (Month 3):

STOP si:
❌ <50 GitHub stars
❌ 0 pre-orders
❌ 0 inbound interest
❌ Working 60h/week, earning <$500/month
❌ High stress, no enjoyment

CONTINUE si:
✅ 200+ GitHub stars
✅ 5+ pre-orders
✅ 10+ inbound leads
✅ $1,500+ USD/month
✅ Enjoying the process

AMBIGUOUS:
⚠️ 50-200 stars
⚠️ 1-4 pre-orders
⚠️ Some interest but not strong
⚠️ $500-1,500/month
⚠️ Mixed feelings

→ If ambiguous: pivot to hybrid
   (50% freelance, 50% Koa)
```

---

## 8. ANÁLISIS DE RIESGOS

### 8.1 Riesgos Técnicos

**RIESGO #1: Commoditization (AI Tools Mejoran)**
```
ESCENARIO:
Claude Code integra guardrails nativos en 6-12 meses
O
Cursor lanza "Architecture Enforcement" feature

IMPACTO: ⚠️⚠️⚠️ HIGH
├─ Koa's core value prop desaparece
├─ Users migran a solución nativa
└─ Revenue cae 70-90%

PROBABILIDAD: 🎲 40-50% (próximos 12-18 meses)

SEÑALES TEMPRANAS:
├─ Claude Blog posts sobre guardrails
├─ Feature requests en GitHub de Cursor
└─ Competitor launches

MITIGACIÓN:
1. TIMING: Launch RÁPIDO (window: 6-12 meses)
2. PIVOT READY: 
   ├─ Si commoditiza → pivot a "Best Practices Enforcement"
   ├─ Menos AI-specific, más architecture governance
   └─ Value: "Enforce YOUR rules, not just anti-AI"
3. NETWORK EFFECTS:
   ├─ Build community rápido
   ├─ Marketplace de reglas custom
   └─ Switching cost alto
4. VERTICAL SPECIALIZATION:
   ├─ Angular expertise profunda
   ├─ Enterprise governance
   └─ Domain-specific guardrails (fintech, healthcare)
```

**RIESGO #2: Angular Decline**
```
ESCENARIO:
React/Vue continúan ganando market share
Angular cae de 12% → 8% → 5% próximos 3 años

IMPACTO: ⚠️⚠️ MEDIUM
├─ TAM shrinks 40-60%
├─ Less new developers learning Angular
└─ Harder to grow user base

PROBABILIDAD: 🎲 30-40%

SEÑALES TEMPRANAS:
├─ StackOverflow survey: Angular % declines
├─ NPM downloads trend down
└─ Job postings decrease

MITIGACIÓN:
1. MULTI-FRAMEWORK (roadmap):
   ├─ React template (año 2)
   ├─ Vue template (año 2)
   └─ Framework-agnostic core
2. ENTERPRISE FOCUS:
   ├─ Enterprise usa Angular long-term
   ├─ Higher willingness to pay
   └─ More stable market
3. DIVERSIFICATION:
   ├─ No 100% dependiente de Angular
   ├─ Architecture governance = framework-agnostic value
```

**RIESGO #3: Big Player Entry (Google/Microsoft)**
```
ESCENARIO:
Google lanza "Angular Studio" con AI guardrails built-in
O
Microsoft integra en VS Code

IMPACTO: ⚠️⚠️⚠️ CRITICAL
├─ Instant 100k+ users para ellos
├─ Koa se vuelve irrelevante
└─ Game over

PROBABILIDAD: 🎲 20-30% (pero devastador si ocurre)

SEÑALES TEMPRANAS:
├─ Google/Angular blog posts sobre AI
├─ Beta features en Angular CLI
└─ Acquisitions de startups similares

MITIGACIÓN:
1. NICHE DEEP:
   ├─ Focus en enterprise custom rules
   ├─ Consultancy = no replicable por big players
   └─ Community expertise
2. MOVE FAST:
   ├─ Build moat antes que entren
   ├─ 1,000+ users = defensible
   └─ Network effects
3. ACQUISITION TARGET:
   ├─ Positioning: "Google, acquire us"
   ├─ Best outcome if big player interested
```

### 8.2 Riesgos de Negocio

**RIESGO #4: No Product-Market Fit**
```
ESCENARIO:
Después de 6 meses:
├─ <100 users totales
├─ 0 paying customers
├─ Feedback: "interesante pero no lo necesito"
└─ Koa solo funciona para workflow de Benjamín

IMPACTO: ⚠️⚠️⚠️ CRITICAL
├─ 6 meses invertidos → $0
├─ Costo oportunidad: $15-20k (freelance perdido)
└─ Desmotivación

PROBABILIDAD: 🎲 40-50% (el riesgo más alto)

SEÑALES TEMPRANAS:
├─ Instalaciones pero no uso activo
├─ GitHub issues: "cómo deshabilitar X?"
├─ Churn alto (uninstall después de 1 semana)
└─ Feedback: "no entiendo el value"

MITIGACIÓN:
1. VALIDATION EARLY (30 días):
   ├─ Test con usuarios externos ANTES de 6 meses
   ├─ Pivot rápido si no funciona
   └─ No enamorarse del producto
2. PARALLEL INCOME:
   ├─ Freelance simultáneo (50% tiempo)
   ├─ No all-in hasta validar
   └─ Safety net
3. EXIT CRITERIA CLAROS:
   ├─ Si month 3 no hitting targets → stop
   ├─ No "just one more month"
   └─ Data-driven, not emotional
```

**RIESGO #5: Timing Window (Demasiado Tarde)**
```
ESCENARIO:
Web Reactiva publica tutorial "Build Your Own Koa" en 2 meses
O
Competitors copian concepto más rápido

IMPACTO: ⚠️⚠️ MEDIUM-HIGH
├─ First-mover advantage perdido
├─ Concept becomes commoditized
└─ Harder differentiation

PROBABILIDAD: 🎲 30-40%

SEÑALES TEMPRANAS:
├─ Dani Primo posts sobre "building guardrails CLI"
├─ New GitHub repos: "angular-ai-guard", etc.
└─ HackerNews: similar concepts

MITIGACIÓN:
1. SPEED:
   ├─ NPM publish ESTA SEMANA
   ├─ No perfectionism
   ├─ "Done > Perfect"
   └─ Launch v0.8 if needed
2. THOUGHT LEADERSHIP:
   ├─ Content blitz (LinkedIn, YouTube)
   ├─ Claim: "First AI-resistant Angular"
   └─ SEO optimization
3. PARTNERSHIPS:
   ├─ Lock exclusive deals rápido
   ├─ "Official tool of X"
   └─ Strategic positioning
```

**RIESGO #6: Solo Founder Limitations**
```
ESCENARIO:
Benjamín working solo:
├─ No coding skills → no expansion
├─ No design skills → unprofessional look
├─ No marketing skills → no users
├─ No sales skills → no revenue
└─ Burnout after 6 months

IMPACTO: ⚠️⚠️ MEDIUM
├─ Slow development
├─ Limited scope
└─ Quality suffers

PROBABILIDAD: 🎲 50-60%

SEÑALES TEMPRANAS:
├─ Working 70+ hours/week
├─ Code quality dropping
├─ Missed deadlines
└─ Health issues

MITIGACIÓN:
1. LEVERAGE AI:
   ├─ Claude for coding (you already do this)
   ├─ Midjourney for design
   ├─ ChatGPT for marketing copy
   └─ AI = force multiplier
2. OUTSOURCE:
   ├─ Design: Fiverr ($50-200)
   ├─ Video editing: Upwork ($20-50/video)
   └─ VA for admin: $5-10/hour
3. PARTNERSHIPS:
   ├─ Find co-founder? (risky pero escalable)
   ├─ Revenue share con specialist
   └─ Equity for key hires (if growth happens)
4. SCOPE CONTROL:
   ├─ MVP ONLY year 1
   ├─ No feature creep
   └─ "Less but better"
```

**RIESGO #7: Capital Requirements**
```
ESCENARIO:
Para escalar necesitas:
├─ $5k marketing budget
├─ $10k infrastructure (hosting, tools)
├─ $20k para vivir mientras construyes
└─ Total: $35k+

Pero Benjamín tiene:
├─ $0 capital
├─ $1,285/mes ingreso (esperado value Koa)
└─ Runway: 2 meses

IMPACTO: ⚠️⚠️⚠️ CRITICAL
├─ Can't execute plan
├─ Forced to get job
└─ Koa se vuelve side project

PROBABILIDAD: 🎲 60-70% (sin mitigación)

SEÑALES TEMPRANAS:
├─ Expenses > Income (mes 2-3)
├─ Credit card debt acumulando
└─ Stress financiero

MITIGACIÓN:
1. BOOTSTRAP (no investors):
   ├─ Services = capital
   ├─ $5-10k implementaciones
   ├─ Reinvest en product
   └─ Profitable desde día 1
2. FREE TOOLS ONLY:
   ├─ Marketing: organic (content)
   ├─ Infrastructure: free tiers
   ├─ Design: AI + Figma free
   └─ Total cost: <$50/month
3. PARALLEL INCOME:
   ├─ Freelance projects
   ├─ Part-time remote work
   └─ Safety net maintained
4. FUNDRAISING (last resort):
   ├─ Angel investors (Chile ecosystem)
   ├─ Startup Chile (CORFO)
   └─ But: dilution + pressure
```

### 8.3 Mitigaciones Propuestas

**FRAMEWORK DE RISK MANAGEMENT:**
```
TIER 1: PREVENT (Proactive)
├─ Launch fast (counter timing risk)
├─ Validate early (counter PMF risk)
├─ Parallel income (counter financial risk)
└─ Network effects (counter commoditization)

TIER 2: DETECT (Monitoring)
├─ Weekly metrics review
├─ User feedback loops
├─ Competitor watch
└─ Financial dashboard

TIER 3: RESPOND (Reactive)
├─ Pivot plans ready
├─ Exit criteria defined
├─ Backup income sources
└─ Mental health check-ins

TIER 4: RECOVER (Fallback)
├─ Freelance network maintained
├─ Resume updated
├─ Remote job applications ready
└─ Koa becomes portfolio piece
```

**SPECIFIC MITIGATIONS BY RISK CATEGORY:**

**Technical Risks:**
```
IF Claude Code adds native guardrails:
├─ Pivot to enterprise custom rules
├─ Focus on consulting
└─ Marketplace of domain-specific guardrails

IF Angular declines:
├─ Multi-framework expansion
├─ React/Vue templates
└─ Framework-agnostic core

IF Google competes:
├─ Acquisition target positioning
├─ Niche specialization (can't replicate)
└─ Community moat
```

**Business Risks:**
```
IF No PMF by month 3:
├─ Free tool + services
├─ OR pivot to internal tool
└─ OR stop, get job

IF Timing too late:
├─ Differentiate aggressively
├─ Partner with first-movers
└─ Niche down (Angular enterprise only)

IF Solo founder burnout:
├─ AI leverage maximum
├─ Outsource non-core
└─ Scope ruthlessly

IF Capital runs out:
├─ Part-time job
├─ Freelance projects
└─ Bootstrap mindset
```

---

## 9. PROYECCIONES FINANCIERAS

### 9.1 Escenarios Modelados

**ESCENARIO CONSERVADOR (30% probability)**
```
ASSUMPTIONS:
- Marketing: Organic only, no paid
- Growth: Slow, word-of-mouth
- Conversión: 2% free → paid
- Retención: 60% annual
- Services: Occasional (3-5/year)
```

**Month-by-Month Breakdown:**

| Month | Free Users | Pro Users | Services | MRR | Notes |
|-------|-----------|-----------|----------|-----|-------|
| M1 | 50 | 2 | $1,500 | $16 | Launch NPM, Reddit post |
| M2 | 100 | 5 | $1,500 | $41 | First reviews, organic |
| M3 | 200 | 10 | $3,000 | $83 | Decision point |
| M6 | 500 | 25 | $5,000 | $208 | Steady growth |
| M9 | 800 | 40 | $6,000 | $333 | Optimize funnel |
| M12 | 1,000 | 50 | $8,000 | $417 | Year-end review |

**Year 1 Total:**
- MRR (Month 12): $417 (~$390k CLP)
- Total Revenue: $12,000 (product) + $30,000 (services) = **$42,000**
- Expenses: $2,000 (tools, hosting)
- **Net: $40,000** (~$3.3k/month)

**Reality Check:**
- ⚠️ Below living wage solo
- ⚠️ Requires parallel freelance
- ✅ Validates concept
- ✅ Foundation for year 2

---

**ESCENARIO REALISTA (40% probability)**
```
ASSUMPTIONS:
- Marketing: Organic + 1 partnership (Web Reactiva OR similar)
- Growth: Moderate, some virality
- Conversión: 5% free → paid
- Retención: 70% annual
- Services: Regular (10-15/year)
```

**Month-by-Month Breakdown:**

| Month | Free Users | Pro Users | Team Plans | Enterprise | Services | MRR |
|-------|-----------|-----------|------------|------------|----------|-----|
| M1 | 100 | 5 | 0 | 0 | $3,000 | $41 |
| M2 | 300 | 15 | 1 | 0 | $3,000 | $185 |
| M3 | 600 | 30 | 2 | 0 | $5,000 | $370 |
| M6 | 1,500 | 75 | 5 | 1 | $8,000 | $1,137 |
| M9 | 3,000 | 150 | 10 | 2 | $10,000 | $2,483 |
| M12 | 5,000 | 250 | 15 | 3 | $12,000 | $3,912 |

**Pricing Used:**
- Pro: $99/year ($8.25/month)
- Team: $749/year ($62/month)
- Enterprise: $2,400/year ($200/month)

**Year 1 Total:**
- MRR (Month 12): $3,912 (~$3.7M CLP)
- Annual Product Revenue: $54,770
- Annual Services Revenue: $90,000
- **Total Revenue: $144,770**
- Expenses: $8,000 (tools, contractors, hosting)
- **Net: $136,770** (~$11.4k/month)

**Reality Check:**
- ✅ Sustainable solo income
- ✅ Validates strong PMF
- ✅ Scalable foundation
- ⚠️ Requires consistency (52 weeks content)

---

**ESCENARIO OPTIMISTA (20% probability)**
```
ASSUMPTIONS:
- Marketing: Organic + 2-3 partnerships + viral moment
- Growth: Fast, GitHub trending, HackerNews front page
- Conversión: 8% free → paid
- Retención: 80% annual
- Services: Full pipeline (20-30/year)
```

**Month-by-Month Breakdown:**

| Month | Free Users | Pro Users | Team Plans | Enterprise | Services | MRR |
|-------|-----------|-----------|------------|------------|----------|-----|
| M1 | 500 | 20 | 2 | 0 | $5,000 | $289 |
| M2 | 1,000 | 40 | 5 | 1 | $8,000 | $785 |
| M3 | 2,000 | 80 | 10 | 2 | $10,000 | $1,570 |
| M6 | 5,000 | 200 | 25 | 5 | $15,000 | $4,225 |
| M9 | 10,000 | 400 | 40 | 8 | $20,000 | $8,450 |
| M12 | 15,000 | 600 | 50 | 12 | $25,000 | $12,550 |

**Year 1 Total:**
- MRR (Month 12): $12,550 (~$11.8M CLP)
- Annual Product Revenue: $211,950
- Annual Services Revenue: $210,000
- **Total Revenue: $421,950**
- Expenses: $25,000 (team, contractors, infra, marketing)
- **Net: $396,950** (~$33k/month)

**Reality Check:**
- ✅✅ Life-changing income
- ✅ Hire help (VA, developer)
- ✅ Reinvest aggressively
- ⚠️ Low probability without luck/virality

---

### 9.2 Comparación con Alternativas

**OPCIÓN A: FREELANCE TRADICIONAL (Workana/Upwork)**
```
ASSUMPTIONS:
- $30-50/hour rate (LATAM standard)
- 80-100 billable hours/month (part-time equivalent)
- 20-30 proposals to land 1 project
- 2-3 projects simultáneos

YEAR 1 PROJECTION:
├─ Month 1-3: Ramp-up ($1,000-1,500/month)
├─ Month 4-9: Steady state ($2,000-3,000/month)
├─ Month 10-12: Established ($2,500-3,500/month)
└─ Average: $2,500/month = $30,000/year

PROS:
✅ Guaranteed income (90% success rate)
✅ Start earning week 1
✅ No product risk
✅ Flexible hours

CONS:
❌ Time for money (no scale)
❌ Client management overhead
❌ No passive income
❌ Ceiling ~$50k/year solo
```

**EXPECTED VALUE:**
```
Probability: 90%
Income: $30,000/year
EV: 0.9 × $30,000 = $27,000/year
```

---

**OPCIÓN B: TRABAJO REMOTO (LATAM Company)**
```
ASSUMPTIONS:
- Mid-level Angular developer
- Remote work for US/EU company
- LATAM salary band

YEAR 1 PROJECTION:
├─ Salary: $1,500-2,500/month
├─ Benefits: Health insurance, PTO
├─ Stability: Very high
└─ Total comp: $18,000-30,000/year

PROS:
✅ Guaranteed income (95% success rate)
✅ Benefits & stability
✅ Career growth
✅ Learning opportunities
✅ 40h/week structure

CONS:
❌ Fixed salary (no upside)
❌ No ownership
❌ Limited side projects time
❌ Geographical arbitrage (lower than US)
```

**EXPECTED VALUE:**
```
Probability: 95%
Income: $24,000/year (mid-point)
EV: 0.95 × $24,000 = $22,800/year
```

---

**OPCIÓN C: KOA (SOLO) - Conservative Scenario**
```
YEAR 1 PROJECTION (from above):
├─ Product MRR: $417/month
├─ Services: $30,000/year
├─ Total: ~$35,000/year

PROS:
✅ Ownership (equity value)
✅ Scalable long-term
✅ Exit potential
✅ Learning máximo

CONS:
❌ High risk (50% failure)
❌ 60-80h weeks
❌ Stress & uncertainty
❌ No benefits
```

**EXPECTED VALUE:**
```
Probability success (>$20k): 50%
Probability failure (<$10k): 50%

Success case: $35,000/year
Failure case: $5,000/year (sunk cost)

EV: (0.5 × $35,000) + (0.5 × $5,000) = $20,000/year
```

**But wait, OPPORTUNITY COST:**
```
If pursuing Koa, NOT doing freelance
Opportunity cost: $27,000 (freelance EV)

Net EV of Koa:
$20,000 (Koa EV) - $27,000 (opp cost) = -$7,000

❌ NEGATIVE expected value
```

---

**OPCIÓN D: KOA + PARTNERSHIPS (Realistic Scenario)**
```
YEAR 1 PROJECTION:
├─ Product MRR: $3,912/month
├─ Services: $90,000/year
├─ Total: ~$137,000/year

PROS:
✅ Partnership amplification
✅ Network effects
✅ Credibility boost
✅ Faster validation

CONS:
❌ Dependency on partners
❌ Revenue share (if applicable)
❌ Less control
```

**EXPECTED VALUE:**
```
Probability success (w/ partnerships): 60%
Probability failure: 40%

Success case: $137,000/year
Failure case: $10,000/year

EV: (0.6 × $137,000) + (0.4 × $10,000) = $86,200/year

Net EV (after opp cost):
$86,200 - $27,000 = $59,200/year

✅ POSITIVE expected value!
```

---

**OPCIÓN E: HYBRID (Services-First + Koa Side)**
```
YEAR 1 PROJECTION:
├─ Freelance (50% time): $15,000
├─ Koa validation services: $20,000
├─ Koa Pro (small): $5,000
├─ Total: $40,000/year

PROS:
✅ Risk mitigation
✅ Steady income
✅ Validation without all-in
✅ Can pivot easily

CONS:
❌ Slower Koa growth
❌ Split focus
❌ Koa might not reach potential
```

**EXPECTED VALUE:**
```
Probability: 80% (high, because hedged)
Income: $40,000/year

EV: 0.8 × $40,000 = $32,000/year

Net EV:
$32,000 - $13,500 (half opp cost) = $18,500/year

✅ POSITIVE, lower variance
```

---

**COMPARISON TABLE:**

| Option | Year 1 Income | Probability | Expected Value | Variance | Stress |
|--------|--------------|-------------|----------------|----------|--------|
| **Freelance** | $30k | 90% | **$27k** | Low | Low |
| **Remote Job** | $24k | 95% | **$22.8k** | Very Low | Very Low |
| **Koa Solo** | $35k | 50% | **$20k** | Very High | Very High |
| **Koa + Partners** | $137k | 60% | **$86.2k** | High | High |
| **Hybrid** | $40k | 80% | **$32k** | Medium | Medium |

**After Opportunity Cost:**

| Option | Net EV | Recommendation |
|--------|--------|----------------|
| Freelance | $27k | ✅ Safe baseline |
| Remote Job | $22.8k | ✅ Very safe |
| Koa Solo | -$7k | ❌ Don't do this |
| **Koa + Partners** | **$59.2k** | ✅✅ Best EV if can execute |
| Hybrid | $18.5k | ✅ Balanced risk |

**CONCLUSION:**
```
RANKED BY EXPECTED VALUE:
1. Koa + Partnerships: $59.2k ⭐ (if partnerships work)
2. Hybrid: $32k ⭐ (safest with upside)
3. Freelance: $27k ⭐ (reliable fallback)
4. Remote Job: $22.8k
5. Koa Solo: -$7k ❌ (don't do)

RECOMMENDATION:
├─ Month 1-2: Hybrid (validate + income)
├─ Month 3: Decision point
│   ├─ If partnerships materialize → All-in Koa
│   ├─ If PMF unclear → Continue hybrid
│   └─ If failing → Freelance or remote job
```

**TIME-ADJUSTED (3-Year Horizon):**
```
FREELANCE (3 years):
Year 1: $30k
Year 2: $35k (more experience)
Year 3: $40k
Total: $105k
Exit value: $0

REMOTE JOB (3 years):
Year 1: $24k
Year 2: $30k (promotion)
Year 3: $36k
Total: $90k
Exit value: $0

KOA SUCCESS (3 years):
Year 1: $137k
Year 2: $300k (scale product)
Year 3: $500k
Total: $937k
Exit value: $1-3M (acquisition)

KOA + PARTNERSHIPS makes sense 
if you believe 3-year compounding.

10. INFORMACIÓN DEL CREADOR
10.1 Perfil de Benjamín
Background Técnico:
yamlName: Benjamín Rebolledo
Location: Concepción, Chile
Experience: 5-8 years (estimate, based on complexity of work)
Education: No especificado (probablemente self-taught o bootcamp)

Technical Stack:
  Primary:
    - Angular: 18+ (deep expertise)
    - TypeScript: Advanced
    - Node.js: CLI development
    - Supabase: Backend-as-service
  
  Frontend:
    - PrimeNG: Component library
    - Tailwind CSS: v4 (bleeding edge)
    - GSAP: Animation
    - Signals API: State management
  
  Architecture:
    - Facade Pattern: Mastered
    - Smart/Dumb Components: Enforced
    - OnPush Change Detection: Non-negotiable
    - Design Tokens: Systematic approach
  
  AI Tools:
    - Claude (primary): Daily driver
    - Claude Code: Development workflow
    - Prompt engineering: Advanced
    - Multi-expert panel framework: Custom methodology

Philosophy:
  - "Architecture over speed"
  - "AI-resistant by design"
  - "Enforcement > Suggestions"
  - "Less but better"
```

**Experiencia Relevante:**

**Proyecto 1: Autoescuela**
```
Type: Educational/Administrative application
Role: Lead developer (team project)
Stack: Angular 18 + Supabase + Koa
Timeline: Estimated 3-6 months
Impact: 
├─ "3 días → horas" (time saved with Koa)
├─ Team members use Koa, positive feedback
└─ Production-ready, active use

Key Achievement:
└─ Validated Koa in real-world team environment
```

**Proyecto 2: FamilyApp**
```
Type: Personal finance household management
Role: Solo developer
Stack: Angular standalone + Signals + Supabase + PrimeNG + GSAP
Features:
├─ Finance dashboard
├─ Household management
├─ AI-assisted development with Koa
└─ Full design system (tokens, components)

Key Achievement:
├─ Built with multi-expert panel (design, UX, architecture)
├─ Iterative improvements using Claude
└─ Production-grade personal project
```

**Proyecto 3: Koa Agent CLI (this product)**
```
Type: Developer tool / CLI
Role: Creator & maintainer
Timeline: Unknown (estimate: 3-6 months development)
Status: v1.0 complete
Distribution: Not on NPM yet (local install only)

Key Achievement:
└─ Solved personal pain point at scale
```

**Skills Actuales:**
```
STRONG:
✅ Angular architecture (expert-level)
✅ Full-stack development (Angular + Supabase)
✅ AI-assisted development (advanced prompting)
✅ System design (facades, patterns)
✅ CLI tool development (Node.js)

MEDIUM:
⚠️ Marketing (no track record)
⚠️ Sales (no experience mentioned)
⚠️ Community building (starting from 0)
⚠️ Content creation (untested)

WEAK:
❌ English (self-reported "básico")
❌ Business development (first product)
❌ Fundraising (no experience)
❌ Team management (mostly solo)
```

**Limitaciones Identificadas:**

**1. Inglés Básico**
```
Impact:
├─ Global market limited
├─ Technical writing harder
├─ Video content challenging
└─ Partnership communication difficult

Mitigation:
├─ AI translation (Claude, DeepL)
├─ Focus on Spanish market first
├─ Hire translator for critical content
└─ Partner with English-speaking co-creator
```

**2. Marketing Sin Experiencia**
```
Impact:
├─ No audience (0 followers)
├─ No content track record
├─ Unknown how to grow users
└─ Risk of invisible product

Mitigation:
├─ Learn via doing (content every week)
├─ Study competitors (Web Reactiva model)
├─ Hire marketing consultant ($500-1,000)
└─ Partner with established influencer
```

**3. Solo Founder**
```
Impact:
├─ Limited bandwidth
├─ Single point of failure
├─ No complementary skills
└─ Burnout risk

Mitigation:
├─ AI as force multiplier
├─ Outsource non-core (design, video editing)
├─ Find co-founder (equity split)
└─ Scope ruthlessly (MVP only)
10.2 Contexto Personal
Situación Financiera Actual:
yamlEmployment: Desempleado
Primary Support: Padres + pareja
Partner Income: ~$450k CLP/mes (OXXO cashier)
Rent: $500k CLP/mes
  Split:
    - Partner: 50% ($250k)
    - Mother: 50% ($250k)

Current Projects:
  Autoescuela:
    Total Payment: $300k CLP
    Structure: 3 payments
    Received: 1/3 (~$100k CLP)
    Pending: 2/3 (~$200k CLP)
    Due: March/April 2026 end

Monthly Baseline:
  Income: ~$100k CLP (autoescuela 1 payment amortized)
  Expenses: $250k CLP (rent share) + personal (~$150k)
  Deficit: -$200-300k CLP/mes

Critical Timeline:
  Runway: ~2 months without new income
  Urgency: HIGH
```

**Constraints de Tiempo:**
```
Available Hours: 5h/day (self-reported)

Breakdown (estimate):
├─ 3h deep work (coding, building)
├─ 1h communication (emails, DMs)
└─ 1h learning/research

Reality Check:
⚠️ 5h/day solo puede ser:
  - Afternoon (if morning commitments)
  - Split sessions (not ideal for flow)
  - Inconsistent (life happens)

Recommendation:
├─ Protect 3h uninterrupted block
├─ Batch emails/calls to 1h
└─ Time-box learning
```

**Motivaciones:**

Cita textual de Benjamín:

> "Me gusta porque fue una necesidad que era mía, pero es más por dinero"

**Análisis:**
```
PRIMARY DRIVER: Financial (💰)
├─ Desempleado, necesita ingresos
├─ Familia depende de él
└─ 2 meses de runway = presión

SECONDARY DRIVER: Problem-solving (🧠)
├─ Built Koa para resolver SU pain point
├─ Enjoys building solutions
└─ Pride in craftsmanship

NOT DRIVEN BY: Passion for domain (⚠️)
├─ No está "enamorado" de developer tools
├─ No es "AI evangelist"
└─ No menciona visión grand de cambiar industria

IMPLICATIONS:
⚠️ If Koa doesn't make money in 3-6 months
   → High risk of abandonment
⚠️ Less resilience durante hard times
⚠️ May not have stamina for multi-year grind

✅ BUT: Honest assessment is GOOD
   - No delusion
   - Will pivot rápido si no funciona
   - Data-driven, not emotional
```

**Support System:**
```
FINANCIAL:
├─ Padres: Covering 50% rent
├─ Pareja: Covering 50% rent + supporting
└─ Autoescuela: Final payments pendientes

EMOTIONAL:
├─ Pareja: Supportive (assumption)
├─ Compañeros autoescuela: Using Koa, positive
└─ No mention of mentor/advisor

PROFESSIONAL:
├─ Network: Unknown size
├─ Angular community: Not active yet
└─ Freelance contacts: Likely has some (previous work)

GAPS:
❌ No co-founder
❌ No advisor/mentor
❌ No investors
❌ Small professional network (assumption)
```

**Health & Wellbeing:**
```
Physical Health: Not mentioned
Mental Health: Not mentioned

Risk Factors:
⚠️ Financial stress (2 months runway)
⚠️ Unemployment anxiety
⚠️ Pressure to provide
⚠️ Solo founder isolation

Protective Factors:
✅ Partner support
✅ Family support
✅ Flexible schedule
✅ Work from home possible

Recommendations:
├─ Exercise routine (non-negotiable)
├─ Sleep hygiene (critical for decisions)
├─ Support group (other founders)
└─ Therapy/coaching if stress high

11. RECURSOS Y REFERENCIAS
11.1 Links Mencionados
Competidores:

Web Reactiva (Dani Primo)

URL: https://www.webreactiva.com/blog/agentes-ia-programadores
Newsletter: 5,800+ suscriptores
Contenido: Skills, guardrails, arquitectura de agentes
Relevancia: 70-80% overlap conceptual con Koa


Society Eskailet

URL: https://society.eskailet.com/
Modelo: Community + job board + formación
Tiers: Basic, Plus, Vitalicio
Relevancia: Model de negocio servicios + community



Koa Repository:

GitHub: [No public URL mencionado, assumed private]
NPM: Not published yet
Landing page: koa.dev (no existe aún)

Related Technologies:

Angular: https://angular.io
Supabase: https://supabase.com
PrimeNG: https://primeng.org
GSAP: https://greensock.com/gsap
Claude Code: https://claude.ai/code
MCP Protocol: https://modelcontextprotocol.io (Anthropic)

11.2 Tecnologías y Herramientas
Development Stack (Complete):
yamlFrontend:
  Framework: Angular 18
  State: Signals API (built-in)
  Components: PrimeNG 17
  Icons: PrimeIcons 7
  Styling: Tailwind CSS v4
  Animation: GSAP 3.12

Backend:
  BaaS: Supabase 2.x
    - Auth: Supabase Auth
    - Database: PostgreSQL (via Supabase)
    - Storage: Supabase Storage
    - Functions: Supabase Edge Functions

CLI Tools:
  Runtime: Node.js 18+
  Package Manager: npm 9+
  Wizard: Inquirer.js
  Spinners: Ora
  File Ops: fs-extra
  Process: child_process (spawn)

Development:
  Language: TypeScript 5.4
  Build: Angular CLI 18
  CSS: PostCSS + Autoprefixer
  Linting: ESLint + TypeScript ESLint

AI Tools:
  Primary: Claude Sonnet 4.5
  Development: Claude Code
  Assistance: Multi-expert panel framework

Version Control:
  VCS: Git
  Hosting: GitHub (assumed)
  CI/CD: None yet (manual)

Design:
  Tokens: CSS Variables
  Design Tool: Figma (assumed for mockups)
  AI Design: Midjourney (for assets)
Tools for Marketing/Operations:
yamlContent Creation:
  Writing: Claude API (drafts)
  Video: Loom (demos)
  Graphics: Canva (branded)
  Images: Midjourney (thumbnails)

Distribution:
  Scheduling: Buffer/Hootsuite
  Repurposing: Repurpose.io
  Automation: Zapier

Analytics:
  Web: Google Analytics
  Social: Native platform analytics
  GitHub: GitHub Insights

Communication:
  Email: Gmail (free tier)
  Calendar: Google Calendar
  Video Calls: Zoom/Google Meet

Hosting (Future):
  Landing: Vercel/Netlify (free tier)
  Docs: Docusaurus/GitBook
  Blog: Ghost/Medium

Costs Estimate:
  Total: $0-50/month (mostly free tiers)

12. APÉNDICES
A. Glosario Técnico
Guardrails:
Reglas automatizadas que validan código o comportamiento de AI agents antes de ejecutar acciones. Pueden ser deterministas (regex, listas negras) o no-deterministas (LLM como juez).
Hooks:
Scripts que interceptan operaciones (escritura de archivos, comandos shell) para validar contra reglas antes de permitir ejecución. En Koa: pre-write-guard.js, bash-guard.js.
Progressive Disclosure:
Técnica donde información se carga incrementalmente según necesidad, en lugar de todo al inicio. Koa usa índices pequeños que se expanden on-demand.
Skills:
Carpetas con instrucciones especializadas (SKILL.md) que agentes IA descubren automáticamente. Similar a plugins pero basados en archivos markdown.
MCP (Model Context Protocol):
Protocolo abierto de Anthropic para conectar aplicaciones IA con fuentes de datos externas (databases, APIs, filesystems) de forma estandarizada.
Facade Pattern:
Patrón arquitectónico donde una capa intermedia (facade) abstrae complejidad de sistemas subyacentes. En Koa: facades manejan Supabase, componentes nunca tocan DB directamente.
OnPush Change Detection:
Estrategia de Angular donde componentes solo re-renderizan cuando inputs cambian o eventos ocurren, vs default (re-render en cada ciclo). Más performante.
Signals API:
Sistema de reactividad introducido en Angular 16+, alternativa a RxJS. Más simple, mejor performance, menos boilerplate.
Design Tokens:
Variables que centralizan decisiones de diseño (colores, spacing, typography). En Koa: CSS variables en lugar de hardcoded values.
Smart/Dumb Components:

Smart: Contienen lógica, manejan estado, conectan a services
Dumb: Solo presentación, solo @Input/@Output, no lógica de negocio

AI Drift:
Tendencia de AI agents a degradar calidad arquitectónica del código con el tiempo por generar soluciones "rápidas" vs "correctas".
Shadow CI:
Validación continua que ocurre DURANTE desarrollo (pre-write), no POST-commit como CI/CD tradicional.
B. Código de Ejemplo
Ejemplo 1: Hook de Validación (pre-write-guard.js)
javascript#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
const content = fs.readFileSync(process.stdin.fd, 'utf-8');
const ext = path.extname(filePath);

// Solo validar archivos TypeScript
if (ext !== '.ts') {
  process.exit(0);
}

// RULE 1: OnPush obligatorio en componentes
if (/@Component/.test(content)) {
  if (!/changeDetection:\s*ChangeDetectionStrategy\.OnPush/.test(content)) {
    console.error('\n❌ VIOLATION: Missing OnPush change detection');
    console.error('Fix: Add changeDetection: ChangeDetectionStrategy.OnPush');
    console.error(`File: ${filePath}\n`);
    process.exit(2); // BLOCK
  }
}

// RULE 2: No @angular/animations
if (/from\s+['"]@angular\/animations['"]/.test(content)) {
  console.error('\n❌ VIOLATION: @angular/animations prohibited');
  console.error('Fix: Use GSAP instead');
  console.error(`File: ${filePath}\n`);
  process.exit(2); // BLOCK
}

// RULE 3: Components no pueden usar Supabase directamente
if (/@Component/.test(content) && /this\.supabase\./.test(content)) {
  console.error('\n❌ VIOLATION: Component accessing Supabase directly');
  console.error('Fix: Use Facade pattern');
  console.error(`File: ${filePath}\n`);
  process.exit(2); // BLOCK
}

// Todas las validaciones pasaron
process.exit(0);
Ejemplo 2: Facade Pattern (user.facade.ts)
typescriptimport { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

@Injectable({ providedIn: 'root' })
export class UserFacade {
  private supabase = inject(SupabaseService);
  
  // Reactive state
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  async loadUsers(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      this.users.set(data as User[]);
    } catch (e: any) {
      this.error.set(e.message);
      console.error('Error loading users:', e);
    } finally {
      this.loading.set(false);
    }
  }
  
  async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      this.users.update(users => 
        users.map(u => u.id === id ? { ...u, ...updates } : u)
      );
      
      return true;
    } catch (e: any) {
      this.error.set(e.message);
      return false;
    }
  }
  
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      this.users.update(users => users.filter(u => u.id !== id));
      
      return true;
    } catch (e: any) {
      this.error.set(e.message);
      return false;
    }
  }
}
Ejemplo 3: Smart Component usando Facade
typescriptimport { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { UserFacade } from '@core/facades/user.facade';
import { UserListComponent } from '@shared/components/user-list/user-list.component';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [UserListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush, // REQUIRED by hook
  template: `
    <div class="container p-lg">
      <h1 class="text-heading-1 mb-md">Users</h1>
      
      @if (userFacade.loading()) {
        <p>Loading...</p>
      }
      
      @if (userFacade.error()) {
        <div class="alert alert-error">
          {{ userFacade.error() }}
        </div>
      }
      
      <app-user-list
        [users]="userFacade.users()"
        (userDelete)="handleDelete($event)"
        (userEdit)="handleEdit($event)"
      />
    </div>
  `
})
export class UsersPageComponent {
  userFacade = inject(UserFacade);
  
  ngOnInit() {
    this.userFacade.loadUsers();
  }
  
  handleDelete(userId: string) {
    if (confirm('Are you sure?')) {
      this.userFacade.deleteUser(userId);
    }
  }
  
  handleEdit(user: User) {
    // Navigate to edit page or open modal
  }
}
Ejemplo 4: Design Tokens (colors.css)
css/* Design Tokens - Colors */
:root {
  /* Base palette */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-500: #6B7280;
  --gray-900: #111827;
  
  --primary-50: #EEF2FF;
  --primary-100: #E0E7FF;
  --primary-500: #6366F1;
  --primary-900: #312E81;
  
  --success-500: #10B981;
  --warning-500: #F59E0B;
  --danger-500: #EF4444;
  
  /* Semantic tokens */
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-500);
  --color-text-inverse: var(--gray-50);
  
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: var(--gray-50);
  --color-bg-elevated: #FFFFFF;
  
  --color-border-default: var(--gray-200);
  --color-border-focus: var(--primary-500);
  
  /* Interactive states */
  --color-interactive-default: var(--primary-500);
  --color-interactive-hover: var(--primary-600);
  --color-interactive-active: var(--primary-700);
  
  /* Status */
  --color-status-success: var(--success-500);
  --color-status-warning: var(--warning-500);
  --color-status-danger: var(--danger-500);
}

/* Tailwind custom utilities */
@layer utilities {
  .bg-primary-500 {
    background-color: var(--primary-500);
  }
  
  .text-primary {
    color: var(--color-text-primary);
  }
  
  .border-default {
    border-color: var(--color-border-default);
  }
}
```

### C. Decision Trees

**Decision Tree 1: ¿Cuándo Usar Koa?**
```
START: Tengo un proyecto Angular
  │
  ├─ ¿Uso AI tools para programar? (Claude, Cursor, Copilot)
  │   │
  │   YES ──► ¿Me importa arquitectura long-term?
  │   │         │
  │   │         YES ──► ¿Equipo o solo?
  │   │         │        │
  │   │         │        EQUIPO ──► ✅ KOA (onboarding benefit)
  │   │         │        SOLO ──► ✅ KOA (prevención drift)
  │   │         │
  │   │         NO ──► ❌ NO KOA (prototipo rápido OK)
  │   │
  │   NO ──► ❌ NO KOA (no value si no usas AI)
  │
  └─ ¿Stack es Angular + Supabase?
      │
      YES ──► ✅ KOA (perfect fit)
      NO ──► ⚠️ PARTIAL (solo arquitectura Angular)
```

**Decision Tree 2: ¿Continuar Koa o Pivotar? (Day 45)**
```
START: 45 días de validación completados
  │
  ├─ TEST 1: Generalizabilidad
  │   │
  │   ├─ 3/5 instalaron sin problemas? 
  │   │   YES ──► ✅ PASS
  │   │   NO ──► ❌ FAIL → STOP, herramienta interna
  │   │
  │   └─ 2/5 dijeron "lo usaría"?
  │       YES ──► ✅ PASS
  │       NO ──► ❌ FAIL → STOP
  │
  ├─ TEST 2: Demanda de mercado
  │   │
  │   ├─ 100+ GitHub stars?
  │   │   YES ──► ✅ PASS
  │   │   NO ──► ❌ FAIL → Revisar messaging
  │   │
  │   └─ 50+ Reddit upvotes + engagement?
  │       YES ──► ✅ PASS
  │       NO ──► ❌ FAIL → No hay mercado
  │
  └─ TEST 3: Willingness to pay
      │
      ├─ 10+ pre-orders?
      │   YES ──► ✅ PASS
      │   NO ──► ❌ FAIL → Free tool + services
      │
      └─ 1+ enterprise interesado?
          YES ──► ✅ BONUS
          NO ──► ⚠️ OK

RESULTS:
├─ ALL 3 PASS (20%) ──► All-in Koa (70% producto, 30% servicios)
├─ TEST 1+2 PASS (30%) ──► Free tool + monetizar servicios
├─ SOLO TEST 1 PASS (30%) ──► Internal advantage + freelance
└─ ALL FAIL (20%) ──► Trabajo remoto + Koa hobby
```

**Decision Tree 3: ¿Colaborar con Web Reactiva?**
```
START: Considerar partnership con Dani Primo
  │
  ├─ ¿Respondió al email en 2 semanas?
  │   │
  │   NO ──► Independiente, content-led growth
  │   │
  │   YES ──► ¿Respuesta positiva o negativa?
  │       │
  │       NEGATIVA ──► Independiente, no insistir
  │       │
  │       POSITIVA ──► ¿Qué tipo de colaboración propone?
  │           │
  │           ├─ AFFILIATE (30%) ──► ✅ ACCEPT
  │           │   - Low commitment
  │           │   - Win-win
  │           │   - Instant audience
  │           │
  │           ├─ CO-MARKETING ──► ✅ ACCEPT
  │           │   - Shared promotion
  │           │   - Cross-pollination
  │           │
  │           ├─ EXCLUSIVE TOOL ──► ⚠️ NEGOTIATE
  │           │   - More commitment
  │           │   - Better exposure
  │           │   - But lock-in
  │           │
  │           └─ WANTS TO COPY/INTEGRATE ──► ❌ DECLINE
  │               - Would kill Koa
  │               - Offer license instead
```

### D. Cronología de la Conversación

**Sesión 1: Contexto Inicial y Problema**

1. Benjamín introduce su situación: desempleado, buscando dirección
2. Menciona dos ideas: virtual fitting room, Koa Agent CLI
3. Revela frustración con falta de rumbo profesional
4. Yo (Claude) pido más info sobre Koa antes de opinar

**Sesión 2: Deep Dive Koa**

5. Benjamín explica Koa en detalle (arquitectura, hooks, uso)
6. Revela que ya está funcional (v1.0) y lo usa en autoescuela
7. Feedback: "3 días → horas", compañeros lo usan
8. Pero: solo círculo cercano, no NPM, posible acoplamiento

**Sesión 3: Análisis de Mercado**

9. Yo analizo TAM/SAM/SOM
10. Proyecciones financieras (conservador → optimista)
11. Modelos de negocio (Open Core, SaaS, Hybrid, Marketplace)
12. Go-to-market strategies (Content, Community, Partnership)

**Sesión 4: Validación Competencia**

13. Benjamín pide análisis de 2 links: Web Reactiva, Society Eskailet
14. Yo busco y analizo competidores
15. **TURNING POINT:** Descubrimiento que competencia existe y es seria
16. Overlap 70-80% con Web Reactiva (conceptualmente)
17. Society valida mercado de servicios de implementación IA

**Sesión 5: Evaluación Brutal**

18. Yo doy assessment honesto: riesgos altos, pero oportunidad real
19. Probabilidades actualizadas: 50% fail solo, 60% success con partnerships
20. Recomiendo validación 30 días antes de all-in
21. Decision tree con exit criteria claros

**Sesión 6: Documentación Request**

22. Benjamín pide prompt para documentar Koa completamente
23. Yo creo prompt estructurado (15-30 páginas)
24. Benjamín envía mensaje vacío (implicando: "ejecuta ahora")
25. Yo genero este documento (estás leyéndolo)

**Insights Evolution:**
```
Inicio: "Koa suena cool, validemos"
    ↓
Medio: "Koa tiene potencial $100-500k/año"
    ↓
Post-competencia: "Koa tiene potencial $50-200k/año, pero..."
    ↓
Final: "Koa viable SI partnerships + validation rápida"
```

**Cambios en Recomendación:**

| Aspecto | Pre-Competencia | Post-Competencia |
|---------|----------------|------------------|
| **Probabilidad éxito** | 20-30% | 10-20% (solo) / 40-60% (partnerships) |
| **Revenue potential** | $100-500k | $50-200k |
| **Timing urgency** | Medium | HIGH (6-12 meses window) |
| **Strategy** | Product-first | Services-first OR partnerships |
| **Risk level** | Medium | HIGH (commoditization) |

**Momentos Críticos:**

1. **"3 días → horas"** - Validó que Koa resuelve problema real
2. **Web Reactiva discovery** - Cambió todo el assessment
3. **"Más por dinero que pasión"** - Honestidad sobre motivación
4. **Runway 2 meses** - Urgency crítica

**Tono Evolutivo:**
```
Inicio: Explorative, curious
Media: Analytical, optimistic
Post-competencia: Brutally honest, risk-focused
Final: Balanced, action-oriented