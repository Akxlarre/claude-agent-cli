import { ApplicationConfig } from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from "@angular/router";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";
import { MessageService, ConfirmationService } from "primeng/api";

import { routes } from "./app.routes";
import { provideCoreAuth } from "@core/auth/provide-core-auth";

/**
 * Configuración principal de la aplicación.
 *
 * provideCoreAuth() ya incluye provideHttpClient(withInterceptors([authInterceptor])).
 * NO añadas provideHttpClient() por separado o se duplicará.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".fake-dark-mode",
          cssLayer: {
            name: "primeng",
            order: "tailwind-base, primeng, tailwind-utilities",
          },
        },
      },
    }),
    provideCoreAuth(),
    MessageService,
    ConfirmationService,
  ],
};
