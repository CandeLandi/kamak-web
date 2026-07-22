import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trackWhatsAppClick } from '../../pages/home/site-interactions';

interface TeamMember {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  imageOrder?: 'left' | 'right';
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.component.html'
})
export class TeamComponent {
  // Evento GA4 `clic_whatsapp` — no bloquea la navegación (gtag es async).
  trackWa(origen: string): void { trackWhatsAppClick(origen); }

  teamMembers: TeamMember[] = [
    {
      id: '1',
      title: 'Supervision de obra',
      description: 'Nuestros arquitectos permanecen en obra durante todo el proceso, supervisando cada detalle de la construccion y asegurando que se cumplan los estandares de calidad y diseno establecidos en el proyecto.',
      image: 'assets/images/working-people/asistencia-operativa.webp',
      tags: ['Supervision 24/7', 'Resolucion inmediata', 'Control de calidad'],
      imageOrder: 'left'
    },
    {
      id: '2',
      title: 'Logistica',
      description: 'Nuestro personal de logistica se encarga de la coordinacion y entrega puntual de materiales y equipos, optimizando los tiempos de trabajo y evitando retrasos en la ejecucion del proyecto.',
      image: 'assets/images/working-people/working-people.webp',
      tags: ['Entregas programadas', 'Gestion de inventario', 'Optimizacion de recursos'],
      imageOrder: 'right'
    },
    {
      id: '3',
      title: 'Asistencia operativa',
      description: 'Contamos con un asistente operativo en obra que se encarga de tareas clave que no corresponden a ningun gremio en particular. Da soporte a los distintos equipos, resuelve necesidades imprevistas y colabora con proveedores externos.',
      image: 'assets/images/working-people/construction.webp',
      tags: ['Coordinacion de gremios', 'Comunicacion con el cliente', 'Seguimiento de avances'],
      imageOrder: 'left'
    }
  ];
}
