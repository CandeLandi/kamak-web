import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from '../environments/environment';

// Render mode por ruta (Angular SSG estático para GitHub Pages):
//  • Páginas públicas (home / obras / detalle) → PRERENDER: HTML real en build,
//    así crawlers y previews sociales reciben contenido (no <app-root></app-root>).
//  • Admin / landing-project / rutas desconocidas → CLIENT: necesitan runtime
//    (auth, Google Maps) y no aportan SEO; se renderizan en el navegador.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'obras', renderMode: RenderMode.Prerender },
  {
    path: 'obras/:slug',
    renderMode: RenderMode.Prerender,
    // Slugs de las obras publicadas, leídos del ERP en build-time. Si el ERP no
    // responde NO rompe el build: se prerenderan / y /obras y los detalles caen
    // a client-render (la página igual funciona).
    async getPrerenderParams() {
      try {
        const res = await fetch(`${environment.obrasApiUrl}/obras`);
        const data = await res.json();
        const obras: Array<{ slug?: string }> = Array.isArray(data?.obras) ? data.obras : [];
        return obras
          .map((o) => o?.slug)
          .filter((s): s is string => !!s)
          .map((slug) => ({ slug }));
      } catch {
        return [];
      }
    },
  },
  { path: '**', renderMode: RenderMode.Client },
];
