import { Component, OnInit, inject, ViewChild, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../../app/core/services/projects.service';
import { Project } from '../../../../app/pages/admin/interfaces/project.interface';
import { MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsService } from '../../../../app/core/services/google-maps.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit, AfterViewInit {
  apiKey: string;
  center = { lat: -38.4161, lng: -63.6167 };

  constructor(@Inject('GOOGLE_MAPS_API_KEY') apiKey: string) {
    this.apiKey = apiKey;
  }
  zoom = 4;
  markers: { lat: number; lng: number; title: string; address: string; imageAfter?: string }[] = [];
  @ViewChild('infoWindow') infoWindow!: MapInfoWindow;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  selectedMarker: { lat: number; lng: number; title: string; address: string; imageAfter?: string } | null = null;
  loading = true;
  error = false;

  // Variables para tooltips personalizados
  private map: google.maps.Map | null = null;
  private customMarkers: google.maps.Marker[] = [];
  private customInfoWindow: google.maps.InfoWindow | null = null;
  private mapReady = false;

  private projectsService = inject(ProjectsService);
  private googleMapsService = inject(GoogleMapsService);

  ngOnInit() {
    // Verificar si estamos en el servidor (SSR)
    if (typeof window === 'undefined') {
      this.loading = false;
      return;
    }

    this.loadGoogleMapsAndProjects();
  }

  ngAfterViewInit() {
    // Inicializar tooltips personalizados después de que la vista esté lista
    this.initializeCustomTooltips();
  }

  private async loadGoogleMapsAndProjects() {
    try {
      await this.googleMapsService.loadGoogleMaps();
      this.loadProjects();
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      this.error = true;
      this.loading = false;
    }
  }

  private initializeCustomTooltips() {
    // Esperar a que el mapa esté disponible
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.maps && this.mapReady) {
        this.setupCustomTooltips();
      }
    }, 500);
  }

  private setupCustomTooltips() {
    // Crear InfoWindow personalizado con mejor configuración
    this.customInfoWindow = new google.maps.InfoWindow({
      disableAutoPan: false, // Habilitar pan automático para visibilidad
      pixelOffset: new google.maps.Size(0, -10), // Reducido de -40 a -10 para acercar el popup
      maxWidth: 250 // Reducido de 320 a 250 para popup más pequeño
    });

    // Aplicar estilos personalizados al InfoWindow
    google.maps.event.addListener(this.customInfoWindow, 'domready', () => {
      const infoWindowElement = document.querySelector('.gm-style-iw-d') as HTMLElement;
      if (infoWindowElement) {
        infoWindowElement.style.overflow = 'hidden';
      }

      // Ocultar elementos nativos de Google Maps
      const closeButton = document.querySelector('.gm-style-iw-t::after') as HTMLElement;
      if (closeButton) {
        closeButton.style.display = 'none';
      }
    });

    // Prevenir que el InfoWindow se cierre automáticamente
    google.maps.event.addListener(this.customInfoWindow, 'closeclick', () => {
      // No hacer nada, mantener el control manual
    });
  }

  loadProjects() {
    this.loading = true;
    this.error = false;

    this.projectsService.getPublicProjects().subscribe({
      next: (projects) => {
        const projectsWithLocation = projects.filter(p => {
          if (!p.address || typeof p.address !== 'object' || !p.address.lat || !p.address.lng) {
            return false;
          }

          const hasValidLat = typeof p.address.lat === 'number' && !isNaN(p.address.lat);
          const hasValidLng = typeof p.address.lng === 'number' && !isNaN(p.address.lng);

          if (!hasValidLat || !hasValidLng) {
            return false;
          }

          return true;
        });

        this.markers = projectsWithLocation.map(p => ({
          lat: p.address.lat,
          lng: p.address.lng,
          title: p.name,
          address: p.address.address || 'Dirección no disponible',
          imageAfter: p.imageAfter
        }));

        // Crear markers personalizados con tooltips si el mapa está listo
        if (this.mapReady && this.map) {
          setTimeout(() => {
            this.createCustomMarkers();
          }, 100);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading projects:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  private createCustomMarkers() {
    if (!this.map) {
      setTimeout(() => this.createCustomMarkers(), 200);
      return;
    }

    // Limpiar markers anteriores
    this.customMarkers.forEach(marker => marker.setMap(null));
    this.customMarkers = [];

    // Crear markers personalizados
    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.map,
        // Eliminar title para evitar tooltip nativo
        // title: markerData.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2.67C10.84 2.67 6.67 6.84 6.67 12c0 7 9.33 17.33 9.33 17.33s9.33-10.33 9.33-17.33c0-5.16-4.17-9.33-9.33-9.33z" fill="#DC2626"/>
              <circle cx="16" cy="12" r="3.33" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      // Crear contenido del tooltip
      const tooltipContent = `
        <div class="custom-tooltip">
          ${markerData.imageAfter ? `
            <div class="tooltip-image">
              <img src="${markerData.imageAfter}" alt="${markerData.title}" class="tooltip-img" />
              <button class="tooltip-close-btn" onclick="window.closeInfoWindow()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ` : ''}
          <div class="tooltip-content">
            <div class="tooltip-title">${markerData.title}</div>
            <div class="tooltip-address">${markerData.address}</div>
          </div>
        </div>
      `;

      // Evento de clic para abrir el InfoWindow personalizado
      marker.addListener('click', () => {
        // Cerrar InfoWindow original si está abierto
        if (this.infoWindow && typeof this.infoWindow.close === 'function') {
          this.infoWindow.close();
        }

        // Cerrar InfoWindow personalizado si está abierto
        if (this.customInfoWindow) {
          this.customInfoWindow.close();
        }

        // Configurar función global para cerrar
        (window as any).closeInfoWindow = () => {
          if (this.customInfoWindow) {
            this.customInfoWindow.close();
          }
        };

        // Abrir InfoWindow personalizado con posicionamiento correcto
        this.openCustomInfoWindow(marker, tooltipContent);
      });

      // Evento de doble clic para el InfoWindow original (mantener como respaldo)
      marker.addListener('dblclick', () => {
        this.openInfoWindow(markerData);
      });

      this.customMarkers.push(marker);
    });
  }

  onMapReady(map: google.maps.Map) {
    this.map = map;
    this.mapReady = true;

    // Configurar tooltips personalizados
    this.setupCustomTooltips();

    // Crear markers personalizados después de que el mapa esté listo
    if (this.markers.length > 0) {
      setTimeout(() => {
        this.createCustomMarkers();
      }, 200);
    }
  }

  openInfoWindow(marker: any) {
    this.selectedMarker = marker;
    this.infoWindow.open();
  }

  retryLoad() {
    this.loadProjects();
  }

  private openCustomInfoWindow(marker: google.maps.Marker, content: string) {
    if (!this.map || !this.customInfoWindow) return;

    // Configurar el InfoWindow con posicionamiento correcto desde el inicio
    // Habilitar pan automático para asegurar visibilidad
    this.customInfoWindow.setOptions({
      disableAutoPan: false, // Habilitar pan automático para visibilidad
      pixelOffset: new google.maps.Size(0, -10), // Reducido de -40 a -10 para acercar el popup
      maxWidth: 250 // Reducido de 320 a 250 para popup más pequeño
    });

    // Abrir el InfoWindow
    this.customInfoWindow.setContent(content);
    this.customInfoWindow.open(this.map, marker);

    // Verificar posicionamiento después de que el DOM esté listo
    google.maps.event.addListenerOnce(this.customInfoWindow, 'domready', () => {
      const infoWindowElement = document.querySelector('.gm-style-iw') as HTMLElement;
      if (!infoWindowElement) return;

      // Obtener la posición del InfoWindow en el viewport
      const rect = infoWindowElement.getBoundingClientRect();
      const mapRect = this.map!.getDiv().getBoundingClientRect();

      // Verificar si el InfoWindow está completamente visible
      const isFullyVisible =
        rect.left >= mapRect.left &&
        rect.right <= mapRect.right &&
        rect.top >= mapRect.top &&
        rect.bottom <= mapRect.bottom;

      if (!isFullyVisible) {
        // Si no está completamente visible, hacer pan suave
        const markerPosition = marker.getPosition()!;
        const currentCenter = this.map!.getCenter()!;

        // Calcular offset para centrar mejor el InfoWindow
        let latOffset = 0;
        let lngOffset = 0;

        // Si se sale por la derecha
        if (rect.right > mapRect.right) {
          lngOffset = -0.15;
        }
        // Si se sale por la izquierda
        else if (rect.left < mapRect.left) {
          lngOffset = 0.15;
        }

        // Si se sale por arriba
        if (rect.top < mapRect.top) {
          latOffset = -0.08;
        }
        // Si se sale por abajo
        else if (rect.bottom > mapRect.bottom) {
          latOffset = 0.08;
        }

        // Aplicar pan suave si es necesario
        if (latOffset !== 0 || lngOffset !== 0) {
          const newCenter = new google.maps.LatLng(
            currentCenter.lat() + latOffset,
            currentCenter.lng() + lngOffset
          );
          // Pan suave con transición
          this.map!.panTo(newCenter);
        }
      }

      // Agregar evento para cerrar al hacer clic fuera del InfoWindow
      const handleClickOutside = (event: MouseEvent) => {
        if (infoWindowElement && !infoWindowElement.contains(event.target as Node)) {
          this.customInfoWindow!.close();
          document.removeEventListener('click', handleClickOutside);
        }
      };

      // Agregar el listener después de un pequeño delay para evitar que se active inmediatamente
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    });
  }
}
