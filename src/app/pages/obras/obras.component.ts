import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObrasWebService } from '../../core/services/obras-web.service';
import { ObraWeb } from '../../core/models/obra-web.interface';
import { initSiteInteractions } from '../home/site-interactions';
import { KamakHeaderComponent } from '../kamak-shared/kamak-header.component';
import { KamakFooterComponent } from '../kamak-shared/kamak-footer.component';
import { ImgRetryDirective } from '../../core/directives/img-retry.directive';

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [CommonModule, RouterModule, KamakHeaderComponent, KamakFooterComponent, ImgRetryDirective],
  styles: [`
    .obras-head{position:relative;background:var(--carbon);color:var(--paper);padding-top:calc(var(--nav-h) + clamp(44px,6vw,88px));padding-bottom:clamp(40px,5vw,64px);overflow:hidden}
    .obras-head__stat{font-family:var(--mono);font-size:13px;letter-spacing:.08em;color:var(--gray);margin-top:18px}
    .obras-head__stat b{color:var(--teal)}
    .filters{display:flex;gap:10px;flex-wrap:wrap;margin:clamp(28px,4vw,44px) 0 clamp(28px,4vw,40px)}
    .filter{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;padding:11px 18px;border:1.5px solid var(--line-light);color:var(--gray-d);background:#fff;transition:.2s;cursor:pointer}
    .filter:hover{border-color:var(--teal)}
    .filter.on{background:var(--carbon);color:var(--paper);border-color:var(--carbon)}
    .filter .n{color:var(--teal);margin-left:7px}
    .obras-list{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
    @media(max-width:980px){.obras-list{grid-template-columns:1fr 1fr}}
    @media(max-width:600px){.obras-list{grid-template-columns:1fr}.filters{gap:8px}.filter{padding:14px 13px;font-size:11px;flex:1 1 calc(50% - 8px)}.obras-head__stat{font-size:12px;line-height:1.8}}
    @media(max-width:430px){.filters{gap:6px}.filter{padding:11px 8px;font-size:10px}.ocard__body{padding:14px 14px 18px}}
    .ocard{position:relative;background:#fff;border:1px solid var(--line-light);display:flex;flex-direction:column;overflow:hidden;transition:transform .25s,box-shadow .25s}
    .ocard:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(20,21,24,.1)}
    .ocard__media{position:relative;aspect-ratio:4/3;overflow:hidden}
    .ocard__media .ph,.ocard__img{width:100%;height:100%;transition:transform .5s}
    .ocard__img{object-fit:cover;display:block}
    .ocard:hover .ocard__media .ph,.ocard:hover .ocard__img{transform:scale(1.05)}
    .ocard__badges{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;z-index:3}
    .ocard__body{padding:18px 18px 22px;display:flex;flex-direction:column;gap:10px}
    .ocard__name{font-family:var(--display);font-weight:800;text-transform:uppercase;font-size:clamp(14px,3.5vw,18px);letter-spacing:.01em;line-height:1.2}
    .ocard__meta{font-family:var(--mono);font-size:12px;color:var(--gray-d);letter-spacing:.03em}
    .ocard__meta b{color:var(--ink)}
    .ba-mini{position:absolute;bottom:12px;right:12px;z-index:3;font-family:var(--mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;background:var(--teal);color:#fff;padding:4px 8px}
    .ocard{opacity:0}
    .ocard.drop{animation:cardDrop .85s cubic-bezier(.22,.9,.32,1) both}
    @keyframes cardDrop{0%{opacity:0;transform:translateY(-90px) rotate(-2deg) scale(.96)}55%{opacity:1;transform:translateY(10px) rotate(.6deg) scale(1.01)}78%{transform:translateY(-4px) rotate(-.2deg)}100%{opacity:1;transform:none}}
  `],
  template: `
<kamak-header></kamak-header>
<header class="obras-head">
  <div class="stripes stripes--tr"><i></i></div>
  <div class="wrap">
    <p class="eyebrow"><span class="diamond"></span> Obras <span class="diamond"></span></p>
    <h1 class="display" style="font-size:clamp(36px,6vw,80px);margin:18px 0 0;color:var(--paper)">{{ totalObras }}+ tiendas entregadas.</h1>
    <p class="obras-head__stat">Tiendas llave en mano documentadas · plazos de <b>7 a 30 días</b> · <b>todo el país</b></p>
  </div>
</header>
<section class="section section--paper section--tight">
  <div class="wrap">
    <div class="filters">
      <button class="filter" [class.on]="filtro==='todas'" (click)="setFiltro('todas')">Todas <span class="n">{{ count('todas') }}</span></button>
      <button class="filter" [class.on]="filtro==='tiendas'" (click)="setFiltro('tiendas')">Tiendas <span class="n">{{ count('tiendas') }}</span></button>
      <button class="filter" [class.on]="filtro==='comercial'" (click)="setFiltro('comercial')">Comercial <span class="n">{{ count('comercial') }}</span></button>
      <button class="filter" [class.on]="filtro==='antes'" (click)="setFiltro('antes')">Con antes / después <span class="n">{{ count('antes') }}</span></button>
    </div>
    <div class="obras-list">
      <a class="ocard drop" *ngFor="let o of filtradas; let i = index; trackBy: trackSlug" [routerLink]="['/obras', o.slug]" [style.animationDelay.ms]="i*70">
        <div class="ocard__media">
          <img *ngIf="cover(o) as c" kamakRetry [src]="c" [alt]="o.titulo" class="ocard__img" loading="lazy" decoding="async">
          <div class="ph" *ngIf="!cover(o)"><div class="ph__tag"><span class="dia"></span>{{ o.localidad }}</div></div>
          <div class="ocard__badges"><span class="tag tag--solid">{{ o.categoria || 'Tiendas' }}</span></div>
          <span class="ba-mini" *ngIf="o.antes && o.imageBefore && o.imageAfter">Antes / Después</span>
        </div>
        <div class="ocard__body">
          <div class="ocard__name">{{ o.titulo }}</div>
          <div class="ocard__meta">
            <ng-container *ngIf="o.m2 && o.dias; else locMeta"><b>{{ o.m2 }} m²</b> · <b>{{ o.dias }} días</b><ng-container *ngIf="o.provincia"> · {{ o.provincia }}</ng-container></ng-container>
            <ng-template #locMeta>{{ o.localidad }}<ng-container *ngIf="o.provincia"> · {{ o.provincia }}</ng-container></ng-template>
          </div>
        </div>
      </a>
    </div>
  </div>
</section>
<div class="teal-band teal-band--on-paper"></div>
<section class="section section--carbon on-carbon" style="text-align:center">
  <div class="stripes stripes--bl"><i></i></div>
  <div class="wrap reveal">
    <p class="label-flank" style="justify-content:center"><span class="diamond"></span><span class="txt">Tu tienda</span><span class="diamond"></span></p>
    <h2 class="display title" style="margin:18px 0 28px">¿La próxima es la tuya?</h2>
    <a class="btn btn--primary" routerLink="/" fragment="contacto">Cotizar mi tienda <span class="arr">→</span></a>
  </div>
</section>
<kamak-footer></kamak-footer>
`,
})
export class ObrasComponent implements OnInit, AfterViewInit {
  private obrasSrv = inject(ObrasWebService);
  private platformId = inject(PLATFORM_ID);
  obras: ObraWeb[] = [];
  filtro = 'todas';
  totalObras = 40;
  private viewReady = false;

  ngOnInit(): void {
    this.obrasSrv.getObras().subscribe(o => {
      this.obras = o || [];
      this.totalObras = Math.max(40, this.obras.length);
      this.run();
    });
  }
  ngAfterViewInit(): void { this.viewReady = true; this.run(); }
  private run(): void { if (this.viewReady && isPlatformBrowser(this.platformId)) setTimeout(() => initSiteInteractions(), 0); }

  trackSlug = (_: number, o: ObraWeb) => o.slug;
  cover(o: ObraWeb): string | null { return o.portada || o.imageAfter || (o.gallery && o.gallery[0]?.url) || null; }
  matchF(o: ObraWeb, f: string): boolean {
    if (f === 'todas') return true;
    if (f === 'tiendas') return (o.categoria || 'Tienda').toLowerCase().startsWith('tienda');
    if (f === 'comercial') return (o.categoria || '').toLowerCase().startsWith('comercial');
    if (f === 'antes') return !!(o.antes && o.imageBefore && o.imageAfter);
    return true;
  }
  get filtradas(): ObraWeb[] { return this.obras.filter(o => this.matchF(o, this.filtro)); }
  count(f: string): number { return this.obras.filter(o => this.matchF(o, f)).length; }
  setFiltro(f: string): void { this.filtro = f; }
}
