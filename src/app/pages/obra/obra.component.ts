import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ObrasWebService } from '../../core/services/obras-web.service';
import { ObraWeb } from '../../core/models/obra-web.interface';
import { initSiteInteractions } from '../home/site-interactions';
import { KamakHeaderComponent } from '../kamak-shared/kamak-header.component';
import { KamakFooterComponent } from '../kamak-shared/kamak-footer.component';

@Component({
  selector: 'app-obra',
  standalone: true,
  imports: [CommonModule, RouterModule, KamakHeaderComponent, KamakFooterComponent],
  template: `
<kamak-header></kamak-header>
<main id="obra" *ngIf="obra as o">
  <header class="obra-hero">
    <div class="stripes stripes--tr"><i></i></div>
    <div class="wrap">
      <div class="obra-hero__cat">
        <span class="tag tag--solid">{{ o.categoria || 'Tiendas' }}</span>
        <a routerLink="/obras" class="tag" style="border-color:var(--line-dark);color:var(--gray)">← Todas las obras</a>
      </div>
      <p class="eyebrow obra-hero__eyebrow"><span class="diamond"></span> {{ o.localidad }}<ng-container *ngIf="o.marca"> — {{ o.marca }}</ng-container> <span class="diamond"></span></p>
      <h1 class="display obra-hero__title">{{ o.titulo }}</h1>
      <div class="obra-hero__facts">
        <div class="obra-hero__fact" *ngIf="o.m2"><div class="l">Superficie</div><div class="v">{{ o.m2 }} m²</div></div>
        <div class="obra-hero__fact" *ngIf="o.dias"><div class="l">Plazo</div><div class="v">{{ o.dias }} días</div></div>
        <div class="obra-hero__fact" *ngIf="o.provincia"><div class="l">Provincia</div><div class="v">{{ o.provincia }}</div></div>
        <div class="obra-hero__fact" *ngIf="o.marca"><div class="l">Formato</div><div class="v">{{ o.marca }}</div></div>
      </div>
    </div>
  </header>

  <section class="obra-feature">
    <div class="wrap">
      <ng-container *ngIf="o.antes && o.imageBefore && o.imageAfter; else galHero">
        <div class="ba brackets">
          <div class="ba__layer"><img class="ba__img" [src]="o.imageBefore" alt="Antes" style="width:100%;height:100%;object-fit:cover"></div>
          <div class="ba__layer ba__after"><img class="ba__img" [src]="o.imageAfter" alt="Después" style="width:100%;height:100%;object-fit:cover"></div>
          <span class="ba__label ba__label--before">Antes</span>
          <span class="ba__label ba__label--after">Después</span>
          <div class="ba__handle"><div class="ba__grip">⟷</div></div>
        </div>
        <p class="obra-feature__cap"><span class="diamond diamond--sm"></span> Arrastrá para comparar el antes y el después<ng-container *ngIf="o.m2 && o.dias"> · {{ o.m2 }} m² en {{ o.dias }} días</ng-container></p>
      </ng-container>
      <ng-template #galHero>
        <div class="gallery-hero brackets" *ngIf="cover(o) as c"><img [src]="c" [alt]="o.titulo" style="width:100%;height:100%;object-fit:cover;display:block"></div>
        <p class="obra-feature__cap"><span class="diamond diamond--sm"></span> Galería de obra terminada<ng-container *ngIf="o.m2 && o.dias"> · {{ o.m2 }} m² en {{ o.dias }} días</ng-container></p>
      </ng-template>
    </div>
  </section>

  <section class="obra-body">
    <div class="wrap obra-grid">
      <div class="case-text reveal">
        <p class="label-flank case-eyebrow"><span class="diamond"></span><span class="txt" style="color:var(--teal-d)">El caso</span></p>
        <h2 class="display case-title">De estación apagada a<br>tienda que factura.</h2>
        <p *ngFor="let p of textoParrafos" [innerHTML]="p"></p>
      </div>
      <aside class="ficha brackets reveal" data-d="1">
        <h3>Ficha técnica</h3>
        <div class="ficha__row"><span class="k">Categoría</span><span class="val">{{ o.categoria || 'Tiendas' }}</span></div>
        <div class="ficha__row" *ngIf="o.m2"><span class="k">Superficie</span><span class="val">{{ o.m2 }} m²</span></div>
        <div class="ficha__row" *ngIf="o.dias"><span class="k">Plazo</span><span class="val">{{ o.dias }} días</span></div>
        <div class="ficha__row"><span class="k">Ubicación</span><span class="val">{{ o.localidad }}</span></div>
        <div class="ficha__row" *ngIf="o.provincia"><span class="k">Provincia</span><span class="val">{{ o.provincia }}</span></div>
        <div class="ficha__row" *ngIf="o.marca"><span class="k">Formato</span><span class="val">{{ o.marca }}</span></div>
        <div class="ficha__row"><span class="k">Rubros</span><span class="val" style="max-width:160px">Obra civil · Mobiliario · Gastronomía · Instalaciones · Imagen</span></div>
        <a class="btn btn--primary btn--block ficha__cta" routerLink="/" fragment="contacto">Cotizar una obra así <span class="arr">→</span></a>
      </aside>
    </div>
  </section>

  <section class="obra-gallery" *ngIf="galeria.length">
    <div class="wrap">
      <p class="label-flank reveal" style="margin-bottom:24px"><span class="diamond"></span><span class="txt" style="color:var(--teal-d)">Galería</span><span class="diamond"></span></p>
      <div class="gallery-grid brackets reveal" data-d="1">
        <div *ngFor="let g of galeria; let k = index" class="ph" [class.wide]="k===0 || k===5">
          <button type="button" class="ph__btn" (click)="openLightbox(k)" [attr.aria-label]="'Ampliar foto ' + (k+1) + ' de ' + galeria.length">
            <img [src]="g.url" [alt]="o.titulo + ' — foto ' + (k+1)" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
          </button>
        </div>
      </div>
    </div>
  </section>

  <nav class="obra-nav" *ngIf="prev && next">
    <div class="wrap obra-nav__in">
      <a class="obra-nav__lnk prev" [routerLink]="['/obras', prev.slug]"><span class="dir">← Obra anterior</span><span class="nm">{{ prev.localidad || prev.titulo }}</span></a>
      <div class="obra-nav__mid"><a routerLink="/obras">Ver las obras</a></div>
      <a class="obra-nav__lnk next" [routerLink]="['/obras', next.slug]"><span class="dir">Obra siguiente →</span><span class="nm">{{ next.localidad || next.titulo }}</span></a>
    </div>
  </nav>
</main>

<div class="lightbox" *ngIf="lightboxOpen" (click)="closeLightbox()" role="dialog" aria-modal="true" aria-label="Galería de fotos">
  <button type="button" class="lightbox__close" (click)="closeLightbox(); $event.stopPropagation()" aria-label="Cerrar (Esc)">✕</button>
  <button type="button" class="lightbox__nav lightbox__nav--prev" *ngIf="galeria.length > 1" (click)="prevImg(); $event.stopPropagation()" aria-label="Foto anterior (←)">‹</button>
  <figure class="lightbox__stage" (click)="$event.stopPropagation()">
    <img class="lightbox__img" [src]="galeria[lightboxIndex].url" [alt]="(obra?.titulo || 'Obra') + ' — foto ' + (lightboxIndex + 1)" (click)="nextImg()" draggable="false">
    <figcaption class="lightbox__cap" *ngIf="galeria.length > 1">{{ lightboxIndex + 1 }} / {{ galeria.length }} · tocá la foto o usá ← → para cambiar</figcaption>
  </figure>
  <button type="button" class="lightbox__nav lightbox__nav--next" *ngIf="galeria.length > 1" (click)="nextImg(); $event.stopPropagation()" aria-label="Foto siguiente (→)">›</button>
</div>

<kamak-footer></kamak-footer>
`,
  styles: [`
    .gallery-grid .ph__btn { position:absolute; inset:0; width:100%; height:100%; padding:0; border:0; background:none; cursor:pointer; display:block; }
    .gallery-grid .ph__btn:focus-visible { outline:2px solid var(--teal, #1f9c8b); outline-offset:3px; }
    .lightbox { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; gap:clamp(8px,3vw,28px); padding:clamp(12px,4vw,48px); background:rgba(8,12,14,.93); backdrop-filter:blur(4px); animation:lbFade .18s ease; }
    .lightbox__stage { position:relative; margin:0; display:flex; flex-direction:column; align-items:center; max-width:92vw; }
    .lightbox__img { max-width:92vw; max-height:82vh; width:auto; height:auto; object-fit:contain; display:block; cursor:pointer; border-radius:2px; box-shadow:0 24px 70px rgba(0,0,0,.55); }
    .lightbox__cap { margin-top:14px; color:#cfd6d8; font:500 12px/1.4 'JetBrains Mono',ui-monospace,monospace; letter-spacing:.05em; text-align:center; }
    .lightbox__nav, .lightbox__close { display:flex; align-items:center; justify-content:center; color:#fff; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.18); cursor:pointer; transition:background .15s ease, transform .1s ease; }
    .lightbox__nav { flex:0 0 auto; width:clamp(42px,7vw,56px); height:clamp(42px,7vw,56px); border-radius:50%; font-size:26px; line-height:1; }
    .lightbox__nav:hover { background:rgba(255,255,255,.2); }
    .lightbox__nav:active { transform:scale(.93); }
    .lightbox__close { position:absolute; top:clamp(10px,3vw,22px); right:clamp(10px,3vw,22px); width:44px; height:44px; border-radius:50%; font-size:17px; z-index:2; }
    .lightbox__close:hover { background:rgba(255,255,255,.2); }
    @keyframes lbFade { from { opacity:0 } to { opacity:1 } }
    @media (max-width:560px) {
      .lightbox { padding:0; }
      .lightbox__nav { position:absolute; bottom:18px; }
      .lightbox__nav--prev { left:16px; }
      .lightbox__nav--next { right:16px; }
      .lightbox__img { max-height:86vh; }
      .lightbox__cap { position:absolute; bottom:80px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.4); padding:6px 12px; border-radius:20px; }
    }
  `],
})
export class ObraComponent implements OnInit, OnDestroy {
  private srv = inject(ObrasWebService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private title = inject(Title);
  private meta = inject(Meta);
  obras: ObraWeb[] = [];
  obra: ObraWeb | null = null;
  prev: ObraWeb | null = null;
  next: ObraWeb | null = null;
  private sub?: Subscription;
  lightboxOpen = false;
  lightboxIndex = 0;

  ngOnInit(): void {
    this.srv.getObras().subscribe(list => {
      this.obras = list || [];
      this.sub = this.route.paramMap.subscribe(pm => this.select(pm.get('slug')));
    });
  }
  ngOnDestroy(): void { this.sub?.unsubscribe(); this.setBodyScroll(true); }

  private select(slug: string | null): void {
    if (!this.obras.length) return;
    const i = this.obras.findIndex(o => o.slug === slug);
    if (i < 0) {
      this.obra = null; this.prev = null; this.next = null;
      this.title.setTitle('Obra no encontrada — Kamak Desarrollos');
      return;
    }
    this.obra = this.obras[i];
    this.aplicarSeo(this.obra);
    this.prev = this.obras[(i - 1 + this.obras.length) % this.obras.length];
    this.next = this.obras[(i + 1) % this.obras.length];
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      setTimeout(() => initSiteInteractions(), 0);
    }
  }

  // Title + meta por obra: horneados en el HTML prerenderizado (SEO + previews).
  private aplicarSeo(o: ObraWeb): void {
    const loc = o.localidad || 'Argentina';
    // Solo m² en la descripción (dato sano). NO incluimos `dias`: algunas obras de
    // arrastre traen valores raros y "(529 días)" contradice el mensaje de la marca.
    const ficha = o.m2 ? ` (${o.m2} m²)` : '';
    const desc = `Tienda llave en mano construida por Kamak en ${loc}${ficha}. Obra civil, mobiliario propio, equipamiento e imagen de marca — por una sola empresa.`;
    this.title.setTitle(`${o.titulo} — ${loc} | Kamak Desarrollos`);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: `${o.titulo} — Kamak Desarrollos` });
    this.meta.updateTag({ property: 'og:description', content: desc });
    const img = this.cover(o);
    if (img) this.meta.updateTag({ property: 'og:image', content: img });
  }

  cover(o: ObraWeb): string | null { return o.portada || o.imageAfter || (o.gallery && o.gallery[0]?.url) || null; }
  get galeria() { return this.obra?.gallery || []; }
  get textoParrafos(): string[] {
    if (this.obra?.texto && this.obra.texto.length) return this.obra.texto;
    const o = this.obra;
    return o ? [
      `Tienda llave en mano construida por Kamak en ${o.localidad || 'Argentina'}. Obra civil, mobiliario de fabricación propia, equipamiento gastronómico, instalaciones e imagen de marca.`,
      'La tienda funcionando, entregada por una sola empresa.',
    ] : [];
  }

  // --- Visor de galería: clic/flechas para navegar (reemplaza abrir la foto en pestaña nueva) ---
  openLightbox(i: number): void {
    if (!this.galeria.length) return;
    this.lightboxIndex = i;
    this.lightboxOpen = true;
    this.setBodyScroll(false);
  }
  closeLightbox(): void {
    this.lightboxOpen = false;
    this.setBodyScroll(true);
  }
  nextImg(): void {
    if (!this.galeria.length) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.galeria.length;
  }
  prevImg(): void {
    if (!this.galeria.length) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.galeria.length) % this.galeria.length;
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.lightboxOpen) return;
    switch (e.key) {
      case 'Escape': this.closeLightbox(); break;
      case 'ArrowRight':
      case ' ': e.preventDefault(); this.nextImg(); break;
      case 'ArrowLeft': this.prevImg(); break;
    }
  }
  private setBodyScroll(enabled: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.style.overflow = enabled ? '' : 'hidden';
  }
}
