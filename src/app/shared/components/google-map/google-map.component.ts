import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { ProjectsService } from '../../../../app/core/services/projects.service';
import { Project } from '../../../../app/pages/admin/interfaces/project.interface';
import { MapInfoWindow } from '@angular/google-maps';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-google-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss'
})
export class GoogleMapComponent implements OnInit {
  apiKey = environment.apiKey;
  center = { lat: -38.4161, lng: -63.6167 };
  zoom = 5;
  markers: { lat: number; lng: number; title: string; address: string }[] = [];
  @ViewChild('infoWindow') infoWindow!: MapInfoWindow;
  selectedMarker: { lat: number; lng: number; title: string; address: string } | null = null;
  loading = true;
  error = false;

  private projectsService = inject(ProjectsService);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = false;

    this.projectsService.getPublicProjects().subscribe({
      next: (res) => {
        // Filtrar solo proyectos que tengan coordenadas válidas
        const projectsWithLocation = res.data.filter(p =>
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
