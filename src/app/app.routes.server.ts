import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/project/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/project',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin/dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin/login',
    renderMode: RenderMode.Prerender
  },
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
