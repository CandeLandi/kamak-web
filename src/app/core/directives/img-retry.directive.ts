import { Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';

const MAX_RETRIES = 3;
const DELAYS_MS = [500, 1200, 2500];

/**
 * Reintenta la carga de un <img> que falló (p. ej. Supabase Storage rechaza
 * streams HTTP/2 bajo ráfagas concurrentes: net::ERR_HTTP2_SERVER_REFUSED_STREAM).
 * El reintento re-pide la misma URL con un query param kr=N como cache-buster.
 */
@Directive({ selector: 'img[kamakRetry]', standalone: true })
export class ImgRetryDirective implements OnDestroy {
  private tries = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private lastBase = '';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    const base = (img.src || '').split(/[?&]kr=/)[0];
    if (!base || base.startsWith('data:')) return;
    if (base !== this.lastBase) { this.lastBase = base; this.tries = 0; }
    if (this.tries >= MAX_RETRIES) return;
    const delay = DELAYS_MS[this.tries] ?? 2500;
    this.tries++;
    this.clear();
    this.timer = setTimeout(() => {
      // Si Angular cambió el [src] mientras esperábamos (p. ej. navegación del
      // lightbox), el reintento quedó obsoleto: no pisar la imagen nueva.
      if ((img.src || '').split(/[?&]kr=/)[0] !== base) return;
      img.src = `${base}${base.includes('?') ? '&' : '?'}kr=${this.tries}`;
    }, delay);
  }

  @HostListener('load')
  onLoad(): void { this.tries = 0; this.lastBase = ''; this.clear(); }

  private clear(): void { if (this.timer) { clearTimeout(this.timer); this.timer = null; } }
  ngOnDestroy(): void { this.clear(); }
}
