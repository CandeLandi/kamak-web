import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  id: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: '01',
      title: 'Diseño de proyecto',
      description: 'Desarrollamos propuestas <strong>funcionales y visuales</strong> adaptadas al uso real del espacio, la operación del negocio y los objetivos comerciales.'
    },
    {
      id: '02',
      title: 'Dirección de obra',
      description: 'Coordinamos <strong>equipos, tiempos, materiales y procesos</strong> para asegurar una ejecución ordenada y eficiente.'
    },
    {
      id: '03',
      title: 'Ejecución integral',
      description: 'Llevamos adelante <strong>obras completas, reformas y adaptaciones comerciales</strong> con control técnico en cada etapa.'
    },
    {
      id: '04',
      title: 'Fabricación de muebles',
      description: 'Fabricamos <strong>mobiliario y equipamiento a medida</strong> para locales, estaciones de servicio y espacios gastronómicos.'
    },
    {
      id: '05',
      title: 'Equipamiento gastronómico',
      description: 'Integramos soluciones de equipamiento para <strong>atención, cocina, exhibición, almacenamiento y servicio</strong>.'
    },
    {
      id: '06',
      title: 'Opciones de financiamiento',
      description: 'Acompañamos la planificación del proyecto con alternativas que faciliten la <strong>inversión</strong> y la <strong>puesta en marcha</strong>.'
    }
  ];
}
