import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from '@core/services/supabase.service';

/**
 * Interceptor de autenticación.
 * - Añade Authorization: Bearer <token> a las peticiones HTTP.
 * - En 401: intenta refreshSession, retry con nuevo token.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private supabase = inject(SupabaseService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const addToken = (request: HttpRequest<unknown>, token: string) =>
      request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return from(this.supabase.getSession()).pipe(
      switchMap(({ data: { session } }) =>
        session?.access_token ? next.handle(addToken(req, session.access_token)) : next.handle(req)
      ),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return from(this.supabase.refreshSession()).pipe(
            switchMap(({ data: { session } }) =>
              session?.access_token
                ? next.handle(addToken(req, session.access_token))
                : throwError(() => err)
            ),
            catchError(() => throwError(() => err))
          );
        }
        return throwError(() => err);
      })
    );
  }
}
