import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, ArrowLeft, FileText, User, DollarSign, X, Plus, Upload, Image, MoreVertical, Edit, Trash2, Star, Folder } from 'lucide-angular';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({ ArrowLeft, FileText, User, DollarSign, X, Plus, Upload, Image, MoreVertical, Edit, Trash2, Star, Folder })
    ),
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
};
