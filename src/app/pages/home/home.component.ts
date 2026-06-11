import { Component, OnInit, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ObrasWebService } from '../../core/services/obras-web.service';
import { ObraWeb } from '../../core/models/obra-web.interface';
import { initSiteInteractions, renderKamakMap } from './site-interactions';
import { KamakHeaderComponent } from '../kamak-shared/kamak-header.component';
import { KamakFooterComponent } from '../kamak-shared/kamak-footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, KamakHeaderComponent, KamakFooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  private obrasSrv = inject(ObrasWebService);
  private platformId = inject(PLATFORM_ID);

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
    this.obrasSrv.getObras().subscribe(obras => {
      this.obras = obras || [];
      this.totalObras = Math.max(40, this.obras.length);
      const conFoto = this.obras.filter(o => this.cover(o));
      this.destacadas = [...conFoto].sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0)).slice(0, 3);
      this.baObra = this.obras.find(o => o.antes && !!o.imageBefore && !!o.imageAfter) || null;
      const lead = conFoto[0];
      if (lead) {
        this.deliverPhoto = this.cover(lead)!;
        this.deliverCaption = `${lead.localidad || lead.titulo} — Tienda entregada`;
      }
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
