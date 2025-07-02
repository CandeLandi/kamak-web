import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  constructor(@Inject('GOOGLE_MAPS_API_KEY') private apiKey: string) {}

  loadGoogleMaps(): Promise<void> {
    // Verificar si estamos en el servidor (SSR)
    if (typeof window === 'undefined') {
      console.log('Google Maps: Running on server, skipping load');
      return Promise.resolve();
    }

    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      // Verificar si ya está cargado
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Crear el script dinámicamente
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!(typeof window !== 'undefined' && window.google && window.google.maps);
  }
}
