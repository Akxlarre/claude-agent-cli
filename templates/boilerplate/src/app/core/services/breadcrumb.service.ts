import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { MenuConfigService } from '@core/services/menu-config.service';

export interface BreadcrumbState {
  home: MenuItem;
  items: MenuItem[];
}

/**
 * BreadcrumbService - Deriva el breadcrumb del menú y la ruta actual.
 *
 * Fuente única de verdad: MenuConfigService.
 * - Home: raíz (Inicio → /pagina-1)
 * - Items: ruta desde la categoría hasta la página actual, sin duplicar home
 *
 * Reglas:
 * - Último item: sin routerLink (página actual)
 * - Items intermedios: con routerLink al primer item de la categoría
 */
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private router = inject(Router);
  private menuConfig = inject(MenuConfigService);

  private readonly _url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly breadcrumb = computed<BreadcrumbState>(() => {
    const url = this._url();
    const menu = this.menuConfig.menuItems();
    const { home, items } = this.buildFromMenu(url, menu);
    return { home, items };
  });

  private buildFromMenu(url: string, menu: MenuItem[]): BreadcrumbState {
    const home: MenuItem = {
      icon: 'pi pi-home',
      label: 'Inicio',
      routerLink: '/app/dashboard',
    };

    for (const group of menu) {
      if (!group.items) continue;

      for (const item of group.items) {
        const link = typeof item.routerLink === 'string' ? item.routerLink : item.routerLink?.[0];
        if (!link) continue;
        const matches =
          url === link ||
          url.startsWith(link + '/') ||
          url.startsWith(link + '?');
        if (!matches) continue;

        const categoryLabel = group.label;
        const pageLabel = item.label ?? '';

        if (categoryLabel === 'Inicio') {
          return { home, items: [{ label: pageLabel }] };
        }

        const firstInCategory = group.items[0];
        const firstLink =
          typeof firstInCategory?.routerLink === 'string'
            ? firstInCategory.routerLink
            : firstInCategory?.routerLink?.[0];

        return {
          home,
          items: [
            { label: categoryLabel, routerLink: firstLink ?? link },
            { label: pageLabel },
          ],
        };
      }
    }

    return { home, items: [] };
  }
}
