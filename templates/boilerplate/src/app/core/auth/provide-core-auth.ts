import type { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';

/**
 * Provee el módulo CoreAuth: interceptor de autenticación.
 * AuthService ya está providedIn: 'root'.
 *
 * Incluye:
 * - AuthInterceptor: token en headers, refresh en 401
 */
export function provideCoreAuth(): Provider[] {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ];
}
