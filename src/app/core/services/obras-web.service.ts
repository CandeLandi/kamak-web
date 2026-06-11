import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ObraWeb } from '../models/obra-web.interface';

// Lee las obras publicadas desde el ERP Kamak (endpoint público sanitizado).
// Reemplaza el uso de ProjectsService.getPublicProjects() (api.rakium.dev) para
// las páginas públicas. Tolerante a error: si el ERP no responde, devuelve vacío
// (la página no se rompe). El base URL se puede override en runtime con
// window.__KAMAK_CONFIG__.obrasApiUrl (mismo patrón que la Google Maps key).
@Injectable({ providedIn: 'root' })
export class ObrasWebService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private baseUrl(): string {
    if (isPlatformBrowser(this.platformId)) {
      const cfg = (globalThis as unknown as { __KAMAK_CONFIG__?: { obrasApiUrl?: string } }).__KAMAK_CONFIG__;
      if (cfg?.obrasApiUrl) return cfg.obrasApiUrl;
    }
    return environment.obrasApiUrl;
  }

  getObras(): Observable<ObraWeb[]> {
    return this.http.get<{ obras: ObraWeb[]; total: number }>(`${this.baseUrl()}/obras`).pipe(
      map(r => (Array.isArray(r?.obras) ? r.obras : [])),
      catchError(() => of([] as ObraWeb[])),
    );
  }

  getObra(slug: string): Observable<ObraWeb | null> {
    return this.http.get<{ obra: ObraWeb }>(`${this.baseUrl()}/obras/${encodeURIComponent(slug)}`).pipe(
      map(r => r?.obra ?? null),
      catchError(() => of(null)),
    );
  }
}
