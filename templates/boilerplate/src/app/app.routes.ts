import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { guestGuard } from '@core/guards/guest.guard';

/**
 * Rutas de la aplicación.
 *
 * Estructura sugerida:
 *   /           → rutas públicas (login, register, reset-password)
 *   /app        → rutas protegidas envueltas en AppShellComponent (sidebar + topbar)
 *   /app/**     → features cargadas con lazy loading
 */
export const routes: Routes = [
  // Rutas públicas — autenticación
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },

  // Rutas protegidas — envueltas en el layout AppShell
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      // TODO: Añade tus feature routes aquí
      // {
      //   path: 'dashboard',
      //   loadComponent: () =>
      //     import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      // },
    ],
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

