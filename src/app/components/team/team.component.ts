import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  teamMembers: TeamMember[] = [
    {
      id: '1',
      title: 'Supervisión de obra',
      description: 'Nuestros arquitectos permanecen en obra durante todo el proceso, supervisando cada detalle de la construcción y asegurando que se cumplan los estándares de calidad y diseño establecidos en el proyecto.',

      image: 'assets/images/working-people/asistencia-operativa.jpg',
      tags: ['Supervisión 24/7', 'Resolución inmediata', 'Control de calidad'],
      imageOrder: 'left'
    },
    {
      id: '2',
      title: 'Logística',
      description: 'Nuestro personal de logística se encarga de la coordinación y entrega puntual de materiales y equipos, optimizando los tiempos de trabajo y evitando retrasos en la ejecución del proyecto.',
      image: 'assets/images/working-people/working-people.jpg',
      tags: ['Entregas programadas', 'Gestión de inventario', 'Optimización de recursos'],
      imageOrder: 'right'
    },
    {
      id: '3',
      title: 'Asistencia operativa',
      description: 'Contamos con un asistente operativo en obra que se encarga de tareas clave que no corresponden a ningún gremio en particular. Da soporte a los distintos equipos, resuelve necesidades imprevistas y colabora con proveedores externos.',
      image: 'assets/images/working-people/construction.jpg',
      tags: ['Coordinación de gremios', 'Comunicación con el cliente', 'Seguimiento de avances'],
      imageOrder: 'left'
    }
  ];
}
