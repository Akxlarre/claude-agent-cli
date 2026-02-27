import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthFacade } from "@core/services/auth.facade";

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);
  await auth.whenReady;
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(["/login"]);
};
