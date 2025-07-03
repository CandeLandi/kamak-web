import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { GoogleMapComponent } from '../../shared/components/google-map/google-map.component';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule, GoogleMapComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
}
