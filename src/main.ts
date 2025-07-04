import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Home, Menu, Eye, EyeOff, Folder, Trash2, Edit, Plus, AlertCircle, Filter, ChevronLeft, ChevronRight, Search, Save, PlayCircle, Pencil } from 'lucide-angular';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(LucideAngularModule.pick({ Home, Menu, Eye, EyeOff, Folder, Trash2, Edit, Plus, AlertCircle, Filter, ChevronLeft, ChevronRight, Search, Save, PlayCircle, Pencil }))
  ]
}).catch((err) => console.error(err));
