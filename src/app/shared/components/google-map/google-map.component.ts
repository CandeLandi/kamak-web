import { Component, OnInit, inject, ViewChild, Inject } from '@angular/core';
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
export class GoogleMapComponent implements OnInit {
  apiKey: string;
  center = { lat: -38.4161, lng: -63.6167 };

  constructor(@Inject('GOOGLE_MAPS_API_KEY') apiKey: string) {
    this.apiKey = apiKey;
  }
  zoom = 4;
  markers: { lat: number; lng: number; title: string; address: string }[] = [];
  @ViewChild('infoWindow') infoWindow!: MapInfoWindow;
  selectedMarker: { lat: number; lng: number; title: string; address: string } | null = null;
  loading = true;
  error = false;

  private projectsService = inject(ProjectsService);
  private googleMapsService = inject(GoogleMapsService);

  ngOnInit() {
    // Verificar si estamos en el servidor (SSR)
    if (typeof window === 'undefined') {
      console.log('Google Map Component: Running on server, skipping initialization');
      this.loading = false;
      return;
    }

    this.loadGoogleMapsAndProjects();
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

  loadProjects() {
    this.loading = true;
    this.error = false;

    this.projectsService.getPublicProjects().subscribe({
      next: (projects) => {

        const projectsWithLocation = projects.filter(p =>
          p.address &&
          typeof p.address.lat === 'number' &&
          typeof p.address.lng === 'number' &&
          !isNaN(p.address.lat) &&
          !isNaN(p.address.lng)
        );

        this.markers = projectsWithLocation.map(p => ({
          lat: p.address.lat,
          lng: p.address.lng,
          title: p.name,
          address: p.address.address || 'Dirección no disponible'
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openInfoWindow(marker: any) {
    this.selectedMarker = marker;
    this.infoWindow.open();
  }

  retryLoad() {
    this.loadProjects();
  }
}
