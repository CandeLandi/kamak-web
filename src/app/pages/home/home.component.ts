import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ObrasWebService } from '../../core/services/obras-web.service';
import { ObraWeb } from '../../core/models/obra-web.interface';
import { initSiteInteractions, renderKamakMap } from './site-interactions';
import { KamakHeaderComponent } from '../kamak-shared/kamak-header.component';
import { KamakFooterComponent } from '../kamak-shared/kamak-footer.component';
import { ImgRetryDirective } from '../../core/directives/img-retry.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, KamakHeaderComponent, KamakFooterComponent, ImgRetryDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private obrasSrv = inject(ObrasWebService);
  private platformId = inject(PLATFORM_ID);
  private title = inject(Title);
  private meta = inject(Meta);

  obras: ObraWeb[] = [];
  destacadas: ObraWeb[] = [];
  baObra: ObraWeb | null = null;
  totalObras = 40;
  deliverPhoto = 'assets/kamak/photos/elena-00.jpg';
  deliverCaption = 'Tienda entregada';
  year = new Date().getFullYear();
  formOk = false;

  private viewReady = false;

  ngOnInit(): void {
    this.title.setTitle('Kamak Desarrollos — Tiendas y locales llave en mano, en días no meses');
    this.meta.updateTag({ name: 'description', content: 'Construimos tu tienda de estación de servicio o local de franquicia llave en mano: proyecto, obra civil, mobiliario, equipamiento e imagen — por una sola empresa, en días no meses y en todo el país.' });
    this.meta.updateTag({ property: 'og:title', content: 'Kamak Desarrollos — Construcción de tiendas llave en mano' });
    this.meta.updateTag({ property: 'og:description', content: 'Tu tienda funcionando en días, no meses. Una sola empresa: proyecto, obra, mobiliario, equipamiento e imagen. Cobertura nacional.' });
    this.obrasSrv.getObras().subscribe(obras => {
      this.obras = obras || [];
      // Home featured = SOLO las obras marcadas "destacada en home" en app.kamak,
      // ordenadas por `orden`. Sin relleno con no-destacadas (ese era el bug).
      this.destacadas = this.obras
        .filter(o => o.destacada)
        .sort((a, b) => (Number.isFinite(a.orden) ? a.orden : 999) - (Number.isFinite(b.orden) ? b.orden : 999));
      this.runWhenReady();
    });
  }

  ngAfterViewInit(): void { this.viewReady = true; this.runWhenReady(); }

  private runWhenReady(): void {
    if (!this.viewReady || !isPlatformBrowser(this.platformId)) return;
    // Esperar que Angular pinte el *ngFor de obras antes de enganchar slider/reveal/mapa.
    setTimeout(() => {
      initSiteInteractions();
      renderKamakMap('mapPlot', this.obras);
    }, 0);
  }

  cover(o: ObraWeb): string | null {
    return o.portada || o.imageAfter || (o.gallery && o.gallery[0]?.url) || null;
  }

  onSubmit(e: Event, form: HTMLFormElement): void {
    e.preventDefault();
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k) || '').toString().trim();
    // Honeypot anti-spam: si un bot rellena el campo oculto, simulamos éxito y cortamos.
    if (get('_gotcha')) { this.formOk = true; return; }
    const body = {
      nombre: get('Nombre / empresa'),
      empresa: get('Nombre / empresa'),
      telefono: get('Teléfono'),
      email: get('Email'),
      ubicacion: get('Ubicación'),
      tipoProyecto: get('Tipo de proyecto'),
      m2: get('m² aprox'),
      plazo: get('Plazo'),
      marca: get('Marca / formato'),
      _gotcha: get('_gotcha'),
    };
    // Validación mínima: exigimos nombre + un canal de contacto (el preventDefault anula la nativa).
    if (!body.nombre || (!body.telefono && !body.email)) return;
    this.obrasSrv.postLead(body).subscribe();   // lead → ERP (fire-and-forget)
    let msg = '*Nueva consulta — Kamak Desarrollos*\n\n';
    for (const [k, v] of fd.entries()) {
      const s = (v || '').toString();
      if (s && k !== '_gotcha') msg += `*${k}:* ${s}\n`;
    }
    if (isPlatformBrowser(this.platformId)) {
      window.open(`https://wa.me/5492262559474?text=${encodeURIComponent(msg)}`, '_blank');
    }
    this.formOk = true;
  }
}
