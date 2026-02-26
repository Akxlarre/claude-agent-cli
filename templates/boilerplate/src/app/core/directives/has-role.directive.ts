import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  signal,
} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import type { UserRole } from '@core/models/user.model';

/**
 * Directiva estructural para ocultar elementos según el rol del usuario.
 * No requiere lógica en el componente.
 *
 * @example
 * <button *appHasRole="'admin'">Solo administradores</button>
 * <div *appHasRole="['admin', 'member']">Admin o member</div>
 */
@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);

  private roles = signal<UserRole[]>([]);

  @Input() set appHasRole(value: UserRole | UserRole[]) {
    this.roles.set(Array.isArray(value) ? value : [value]);
  }

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const allowedRoles = this.roles();
      const hasRole = user && allowedRoles.length > 0 && allowedRoles.includes(user.role);

      this.viewContainer.clear();
      if (hasRole) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
