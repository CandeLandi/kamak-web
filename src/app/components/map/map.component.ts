import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  reachItems = [
    'Proyectos en distintas localidades',
    'Logística y coordinación operativa',
    'Equipos preparados para obra en territorio',
    'Acompañamiento técnico a distancia y presencial'
  ];

  mapPoints = [
    { name: 'Buenos Aires', left: 58, top: 62 },
    { name: 'Costa Atlántica', left: 66, top: 70 },
    { name: 'Interior bonaerense', left: 48, top: 58 },
    { name: 'Litoral', left: 64, top: 42 }
  ];
}
