import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { LucideAngularModule, ArrowLeft, FileText, User, Eye, DollarSign, X, Plus, Upload, Image, MoreVertical, Edit, Trash2, Star, Folder, Search } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Proveedor para los íconos de Lucide
    importProvidersFrom(
      LucideAngularModule.pick({ ArrowLeft, FileText, User, DollarSign, X, Plus, Upload, Image, MoreVertical, Edit, Trash2, Star, Folder, Search, Eye })
    ),

    // Configuración global para los campos de formulario de Angular Material
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
};
