import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import {
  LucideAngularModule, ChevronLeft, ChevronRight, FolderSearch, Eye, Edit, Trash2, Plus, EyeOff, Image, AlertCircle, FileText, Upload, X, ImageOff, MoreVertical, Star, User, DollarSign, Folder, Search, ArrowLeft, MapPin, Building, Ruler, Clock, Calendar, CalendarCheck, ChevronDown, Expand, PlayCircle, Pencil, Video
} from 'lucide-angular';

declare global {
  interface Window {
    __KAMAK_CONFIG__?: {
      googleMapsApiKey?: string;
    };
  }
}

const googleMapsApiKey =
  (typeof window !== 'undefined' ? window.__KAMAK_CONFIG__?.googleMapsApiKey : undefined) ||
  environment.googleMapsApiKey;

export const appConfig: ApplicationConfig = {
  providers: [
    // anchorScrolling: hace que los links del menú (routerLink="/" fragment="...")
    // scrolleen a su sección (#nosotros, #entregamos, #formatos, #contacto).
    // El offset del header fijo se compensa con scroll-padding-top en kamak.css.
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: 'GOOGLE_MAPS_API_KEY',
      useValue: googleMapsApiKey
    },
    importProvidersFrom(LucideAngularModule.pick({
      // Íconos de paginación y galería
      ChevronLeft,
      ChevronRight,
      FolderSearch,
      Eye,
      EyeOff,
      Image,
      AlertCircle,
      // Íconos del dashboard y edición
      Edit,
      Trash2,
      Plus,
      FileText,
      Upload,
      X,
      ImageOff,
      MoreVertical,
      Star,
      User,
      DollarSign,
      Folder,
      Search,
      ArrowLeft,
      MapPin,
      Building,
      Ruler,
      Clock,
      Calendar,
      CalendarCheck,
      ChevronDown,
      Expand,
      PlayCircle,
      Pencil,
      Video
    })),
    // Restaurar la configuración global para los campos de formulario
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }
  ]
};
