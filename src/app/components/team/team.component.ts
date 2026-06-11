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
      description: '<strong>Seguimiento técnico</strong>, control de avances y coordinación de equipos para mantener el proyecto alineado a los objetivos definidos.',
      image: 'assets/images/working-people/asistencia-operativa.webp',
      tags: ['Coordinación', 'Supervisión', 'Control técnico'],
      imageOrder: 'left'
    },
    {
      id: '2',
      title: 'Logística',
      description: 'Organización de <strong>materiales, traslados, entregas e instalaciones</strong> para asegurar continuidad durante la ejecución.',
      image: 'assets/images/working-people/working-people.webp',
      tags: ['Materiales', 'Traslados', 'Instalación'],
      imageOrder: 'right'
    },
    {
      id: '3',
      title: 'Asistencia operativa',
      description: 'Acompañamiento en <strong>decisiones técnicas, ajustes finales y necesidades específicas</strong> durante la puesta en marcha.',
      image: 'assets/images/working-people/construction.webp',
      tags: ['Ajustes finales', 'Soporte técnico', 'Puesta en marcha'],
      imageOrder: 'left'
    }
  ];
}
