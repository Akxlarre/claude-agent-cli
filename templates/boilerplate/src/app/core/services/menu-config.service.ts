import { Injectable, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';

/**
 * MenuConfigService - Configuración del menú principal
 * 
 * Centraliza los items de navegación genéricos para la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class MenuConfigService {

  readonly menuItems = computed<MenuItem[]>(() => {
    return [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Configuración',
        icon: 'pi pi-cog',
        routerLink: '/settings'
      }
    ];
  });
}
