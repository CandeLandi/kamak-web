import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Project {
  id: string;
  title: string;
  imageAfter?: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      id: '1',
      title: 'Puma CQ – Necochea',
      imageAfter: '/assets/images/work-done/necochea-cq/necochea-cq.webp'
    },
    {
      id: '2',
      title: 'B.AGRO – Bahía Blanca',
      imageAfter: '/assets/images/work-done/bahia-blanca/construction-site.webp'
    },
    {
      id: '3',
      title: 'Azul – Sapeda',
      imageAfter: '/assets/images/work-done/azul-sapeda/station.webp'
    },
    {
      id: '4',
      title: 'Baradero – Costa Paraná',
      imageAfter: '/assets/images/work-done/baradero-costa-parana/portada.webp'
    },
    {
      id: '5',
      title: 'Las Toninas – Trearie',
      imageAfter: '/assets/images/work-done/las-toninos-trearie/portada.webp'
    },
    {
      id: '6',
      title: 'Zárate – Traslux',
      imageAfter: '/assets/images/work-done/zarate-traslux/traslux.webp'
    }
  ];
}
