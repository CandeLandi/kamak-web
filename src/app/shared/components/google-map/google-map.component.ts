import { Component, OnInit, inject, ViewChild, Inject, AfterViewInit, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../../app/core/services/projects.service';
import { MapInfoWindow } from '@angular/google-maps';
import { GoogleMapsService } from '../../../../app/core/services/google-maps.service';
import { MapMarkerPopupComponent } from '../map-marker-popup/map-marker-popup.component';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit, AfterViewInit {
  apiKey: string;
  center = { lat: -38.4161, lng: -63.6167 };
  zoom = 4;
  markers: { lat: number; lng: number; title: string; address: string; imageAfter?: string; projectId?: string }[] = [];
  selectedMarker: { lat: number; lng: number; title: string; address: string; imageAfter?: string } | null = null;
  loading = true;
  error = false;
  mapUnavailable = false;

  @ViewChild('infoWindow') infoWindow!: MapInfoWindow;

  private map: google.maps.Map | null = null;
  private customMarkers: google.maps.Marker[] = [];
  private customInfoWindow: google.maps.InfoWindow | null = null;
  private mapReady = false;

  private appRef = inject(ApplicationRef);
  private popupComponentRef: ComponentRef<MapMarkerPopupComponent> | null = null;
  private environmentInjector = inject(EnvironmentInjector);
  private projectsService = inject(ProjectsService);
  private googleMapsService = inject(GoogleMapsService);

  constructor(@Inject('GOOGLE_MAPS_API_KEY') apiKey: string) {
    this.apiKey = apiKey;
  }

  ngOnInit() {
    this.loadGoogleMapsAndProjects();
  }

  ngAfterViewInit() {
    this.initializeCustomTooltips();
  }

  private async loadGoogleMapsAndProjects() {
    if (!this.apiKey) {
      this.mapUnavailable = true;
      this.loading = false;
      return;
    }

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
    setTimeout(() => {
      if (typeof google !== 'undefined' && google.maps && this.mapReady) {
        this.setupCustomTooltips();
      }
    }, 500);
  }

  private setupCustomTooltips() {
    this.customInfoWindow = new google.maps.InfoWindow({
      disableAutoPan: false,
      maxWidth: 280,
      zIndex: 1000
    });

    google.maps.event.addListener(this.customInfoWindow, 'closeclick', () => {});
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

          return hasValidLat && hasValidLng;
        });

        this.markers = projectsWithLocation.map(p => ({
          lat: p.address.lat,
          lng: p.address.lng,
          title: p.name,
          address: p.address.address || 'Direccion no disponible',
          imageAfter: p.imageAfter,
          projectId: p.id
        }));

        if (this.mapReady && this.map) {
          setTimeout(() => {
            this.createCustomMarkers();
          }, 100);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
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

    this.customMarkers.forEach(marker => marker.setMap(null));
    this.customMarkers = [];

    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: this.map,
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

      marker.addListener('click', () => {
        if (this.infoWindow && typeof this.infoWindow.close === 'function') {
          this.infoWindow.close();
        }
        if (this.customInfoWindow) {
          this.customInfoWindow.close();
        }
        (window as any).closeInfoWindow = () => {
          if (this.customInfoWindow) {
            this.customInfoWindow.close();
          }
        };
        this.openCustomInfoWindow(marker, markerData);
      });

      marker.addListener('dblclick', () => {
        this.openInfoWindow(markerData);
      });

      this.customMarkers.push(marker);
    });
  }

  onMapReady(map: google.maps.Map) {
    this.map = map;
    this.mapReady = true;
    this.setupCustomTooltips();

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
    this.mapUnavailable = false;
    this.loadGoogleMapsAndProjects();
  }

  private openCustomInfoWindow(marker: google.maps.Marker, markerData: any) {
    if (!this.map || !this.customInfoWindow) return;

    if (this.popupComponentRef) {
      this.appRef.detachView(this.popupComponentRef.hostView);
      this.popupComponentRef.destroy();
      this.popupComponentRef = null;
    }

    const ref = createComponent(MapMarkerPopupComponent, {
      environmentInjector: this.environmentInjector
    });
    ref.instance.title = markerData.title;
    ref.instance.address = markerData.address;
    ref.instance.imageAfter = markerData.imageAfter;
    ref.instance.projectId = markerData.projectId;

    ref.instance.close.subscribe(() => {
      if (this.customInfoWindow) {
        this.customInfoWindow.close();
      }
    });

    this.appRef.attachView(ref.hostView);

    const popupDiv = document.createElement('div');
    popupDiv.appendChild((ref.hostView as any).rootNodes[0]);
    this.popupComponentRef = ref;

    this.customInfoWindow.setContent(popupDiv);
    this.customInfoWindow.open(this.map, marker);

    google.maps.event.addListenerOnce(this.customInfoWindow, 'closeclick', () => {
      this.appRef.detachView(ref.hostView);
      ref.destroy();
      this.popupComponentRef = null;
    });
  }
}
