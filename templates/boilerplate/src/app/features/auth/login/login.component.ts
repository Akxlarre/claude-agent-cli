import {
    Component,
    ChangeDetectionStrategy,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * LoginComponent — Página pública de inicio de sesión.
 *
 * Genérico y reutilizable. Usa design tokens del sistema
 * y AuthService para autenticación con Supabase.
 *
 * Modos disponibles: login | register | reset
 */
@Component({
    selector: 'app-login',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, RouterLink],
    template: `
    <div class="flex min-h-[100dvh] items-center justify-center bg-base bg-[image:var(--gradient-subtle)] p-4">
      <div class="w-full max-w-[420px] rounded-xl border border-border-subtle bg-surface p-8 shadow-lg">
        <!-- Logo / Brand -->
        <div class="mb-6 text-center">
          <div class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--gradient-primary)]">
            <span class="text-2xl brightness-[10]">🧠</span>
          </div>
          <h1 class="m-0 mb-2 font-display text-2xl font-bold text-text-primary">
            @switch (mode()) {
              @case ('register') { Crear Cuenta }
              @case ('reset') { Recuperar Contraseña }
              @default { Iniciar Sesión }
            }
          </h1>
          <p class="m-0 text-sm text-text-muted">
            @switch (mode()) {
              @case ('register') { Completa los campos para registrarte }
              @case ('reset') { Ingresa tu correo para recibir un enlace }
              @default { Ingresa tus credenciales para continuar }
            }
          </p>
        </div>

        <!-- Error message -->
        @if (errorMsg()) {
          <div class="mb-4 flex items-center gap-2 rounded-md border border-[var(--state-error-border)] bg-[var(--state-error-bg)] px-4 py-3 text-sm text-error" role="alert">
            <span class="error-icon">⚠</span>
            {{ errorMsg() }}
          </div>
        }

        <!-- Success message -->
        @if (successMsg()) {
          <div class="mb-4 flex items-center gap-2 rounded-md border border-[var(--state-success-border)] bg-[var(--state-success-bg)] px-4 py-3 text-sm text-success" role="status">
            <span class="success-icon">✓</span>
            {{ successMsg() }}
          </div>
        }

        <!-- Form -->
        <form class="flex flex-col gap-4" (ngSubmit)="onSubmit()">
          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-text-secondary">Correo electrónico</label>
            <input
              id="email"
              type="email"
              class="w-full box-border rounded-[var(--input-radius)] border border-[var(--input-border-default)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] font-body text-base text-[var(--input-text)] outline-none transition-[var(--transition-input)] placeholder-[var(--input-placeholder)] focus:border-[var(--input-border-focus)] focus:shadow-[var(--input-shadow-focus-neutral)]"
              placeholder="tu@correo.com"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
            />
          </div>

          <!-- Password (not in reset mode) -->
          @if (mode() !== 'reset') {
            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-medium text-text-secondary">Contraseña</label>
              <input
                id="password"
                type="password"
                class="w-full box-border rounded-[var(--input-radius)] border border-[var(--input-border-default)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] font-body text-base text-[var(--input-text)] outline-none transition-[var(--transition-input)] placeholder-[var(--input-placeholder)] focus:border-[var(--input-border-focus)] focus:shadow-[var(--input-shadow-focus-neutral)]"
                placeholder="••••••••"
                [(ngModel)]="password"
                name="password"
                required
                autocomplete="current-password"
              />
            </div>
          }

          <!-- Display name (register only) -->
          @if (mode() === 'register') {
            <div class="flex flex-col gap-2">
              <label for="displayName" class="text-sm font-medium text-text-secondary">Nombre para mostrar</label>
              <input
                id="displayName"
                type="text"
                class="w-full box-border rounded-[var(--input-radius)] border border-[var(--input-border-default)] bg-[var(--input-bg)] px-[var(--input-padding-x)] py-[var(--input-padding-y)] font-body text-base text-[var(--input-text)] outline-none transition-[var(--transition-input)] placeholder-[var(--input-placeholder)] focus:border-[var(--input-border-focus)] focus:shadow-[var(--input-shadow-focus-neutral)]"
                placeholder="Tu nombre"
                [(ngModel)]="displayName"
                name="displayName"
                autocomplete="name"
              />
            </div>
          }

          <!-- Submit button -->
          <button
            type="submit"
            class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--btn-primary-radius)] border-none bg-[var(--btn-primary-bg)] px-[var(--btn-primary-padding-x)] py-[var(--btn-primary-padding-y)] font-body text-base font-semibold text-[var(--btn-primary-text)] shadow-[var(--btn-primary-shadow)] transition-[var(--transition-btn)] hover:enabled:bg-[var(--btn-primary-bg-hover)] hover:enabled:shadow-[var(--btn-primary-shadow-hover)] active:enabled:scale-[var(--btn-press-scale-value)] disabled:cursor-not-allowed disabled:opacity-70"
            [disabled]="loading()"
          >
            @if (loading()) {
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[rgba(255,255,255,0.3)] border-t-current"></span>
            }
            @switch (mode()) {
              @case ('register') { Crear Cuenta }
              @case ('reset') { Enviar Enlace }
              @default { Iniciar Sesión }
            }
          </button>
        </form>

        <!-- Footer links -->
        <div class="mt-6 flex items-center justify-center gap-2">
          @switch (mode()) {
            @case ('login') {
              <button class="cursor-pointer border-none bg-transparent p-0 font-body text-sm text-brand transition-[var(--transition-color)] hover:text-brand-hover" (click)="switchMode('reset')">
                ¿Olvidaste tu contraseña?
              </button>
              <span class="text-sm text-text-muted">·</span>
              <button class="cursor-pointer border-none bg-transparent p-0 font-body text-sm text-brand transition-[var(--transition-color)] hover:text-brand-hover" (click)="switchMode('register')">
                Crear cuenta
              </button>
            }
            @case ('register') {
              <button class="cursor-pointer border-none bg-transparent p-0 font-body text-sm text-brand transition-[var(--transition-color)] hover:text-brand-hover" (click)="switchMode('login')">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            }
            @case ('reset') {
              <button class="cursor-pointer border-none bg-transparent p-0 font-body text-sm text-brand transition-[var(--transition-color)] hover:text-brand-hover" (click)="switchMode('login')">
                Volver a iniciar sesión
              </button>
            }
          }
        </div>
      </div>
    </div>
  `,
    host: { style: 'display: contents;' }
})
export class LoginComponent {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    readonly mode = signal<'login' | 'register' | 'reset'>('login');
    readonly loading = signal(false);
    readonly errorMsg = signal('');
    readonly successMsg = signal('');

    email = '';
    password = '';
    displayName = '';

    switchMode(newMode: 'login' | 'register' | 'reset'): void {
        this.mode.set(newMode);
        this.errorMsg.set('');
        this.successMsg.set('');
    }

    async onSubmit(): Promise<void> {
        this.errorMsg.set('');
        this.successMsg.set('');
        this.loading.set(true);

        try {
            switch (this.mode()) {
                case 'login': {
                    const { error } = await this.auth.login(this.email, this.password);
                    if (error) {
                        this.errorMsg.set(error.message);
                    } else {
                        this.router.navigate(['/app']);
                    }
                    break;
                }

                case 'register': {
                    const { error } = await this.auth.signUp(this.email, this.password, {
                        data: { display_name: this.displayName || undefined },
                    });
                    if (error) {
                        this.errorMsg.set(error.message);
                    } else {
                        this.successMsg.set(
                            'Cuenta creada. Revisa tu correo para confirmar tu registro.'
                        );
                        this.switchMode('login');
                    }
                    break;
                }

                case 'reset': {
                    const { error } = await this.auth.resetPasswordForEmail(this.email);
                    if (error) {
                        this.errorMsg.set(error.message);
                    } else {
                        this.successMsg.set(
                            'Se envió un enlace de recuperación a tu correo.'
                        );
                    }
                    break;
                }
            }
        } catch {
            this.errorMsg.set('Ocurrió un error inesperado. Intenta de nuevo.');
        } finally {
            this.loading.set(false);
        }
    }
}
