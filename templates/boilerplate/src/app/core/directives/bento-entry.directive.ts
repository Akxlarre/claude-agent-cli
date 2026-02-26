import { Directive, ElementRef, OnInit, inject } from '@angular/core';

/**
 * Marca una card dentro de un `bento-grid` para animación de entrada.
 * Aplica la clase `card--animate-entry` al host sin acoplar el componente al layout.
 *
 * Uso:
 * ```html
 * <app-feature-card appBentoEntry ...></app-feature-card>
 * ```
 */
@Directive({
  selector: '[appBentoEntry]',
  standalone: true,
})
export class BentoEntryDirective implements OnInit {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef as any);

  ngOnInit(): void {
    this.el.nativeElement.classList.add('card--animate-entry');
  }
}

