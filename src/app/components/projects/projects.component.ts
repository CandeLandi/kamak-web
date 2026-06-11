import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectsService } from '../../core/services/projects.service';
import { Project } from '../../pages/admin/interfaces/project.interface';

interface ProjectPreview {
  id: string;
  name: string;
  location: string;
  category: string;
  scope: string;
  image: string;
  isFallback?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);

  public loading = signal(true);
  public error = signal<string | null>(null);

  private allProjects = signal<Project[]>([]);
  public searchQuery = signal('');
  public visibleProjectCount = signal(5);

  private fallbackProjects: ProjectPreview[] = [
    {
      id: 'zarate-traslux',
      name: 'Zárate — Traslux',
      location: 'Zárate',
      category: 'Estación de servicio',
      scope: 'Obra comercial integral · Puesta en marcha',
      image: 'assets/images/work-done/zarate-traslux/traslux.webp',
      isFallback: true
    },
    {
      id: 'las-toninas-trearie',
      name: 'Las Toninas — Trearie',
      location: 'Costa Atlántica',
      category: 'Gastronomía',
      scope: 'Interior comercial · Mobiliario a medida',
      image: 'assets/images/work-done/las-toninos-trearie/portada.webp',
      isFallback: true
    },
    {
      id: 'baradero-costa-parana',
      name: 'Baradero — Costa Paraná',
      location: 'Baradero',
      category: 'Comercial',
      scope: 'Reforma integral · Equipamiento operativo',
      image: 'assets/images/work-done/baradero-costa-parana/portada.webp',
      isFallback: true
    },
    {
      id: 'necochea-cq',
      name: 'Necochea — CQ',
      location: 'Necochea',
      category: 'Local comercial',
      scope: 'Diseño + ejecución · Terminaciones',
      image: 'assets/images/work-done/necochea-cq/necochea-cq.webp',
      isFallback: true
    },
    {
      id: 'azul-sapeda',
      name: 'Azul — Sapeda',
      location: 'Azul',
      category: 'Estación de servicio',
      scope: 'Intervención comercial · Instalación final',
      image: 'assets/images/work-done/azul-sapeda/station.webp',
      isFallback: true
    }
  ];

  public filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const projects = this.allProjects();

    if (!query) {
      return projects;
    }

    return projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query)
    );
  });

  public displayProjects = computed<ProjectPreview[]>(() => {
    const projects = this.filteredProjects();

    if (!projects.length) {
      return this.fallbackProjects;
    }

    return projects.slice(0, this.visibleProjectCount()).map(project => ({
      id: project.id,
      name: project.name,
      location: project.address?.address?.split(',')[0] || 'Argentina',
      category: this.formatCategory(project.category),
      scope: project.description || project.area || 'Obra comercial integral',
      image: project.imageAfter || project.imageBefore || 'assets/images/work-done/zarate-traslux/traslux.webp'
    }));
  });

  public hasMoreProjects = computed(() => this.filteredProjects().length > this.visibleProjectCount());

  public visibleProjectsLabel = computed(() => {
    const total = this.filteredProjects().length;
    const visible = Math.min(this.visibleProjectCount(), total);

    return `Mostrando ${visible} de ${total} proyectos`;
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.projectsService.getPublicProjects().subscribe({
      next: (projects) => {
        this.allProjects.set(projects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los proyectos.');
        this.allProjects.set([]);
        this.loading.set(false);
      }
    });
  }

  private formatCategory(category?: string | null): string {
    return category?.toLowerCase().replaceAll('_', ' ') || 'Comercial';
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.visibleProjectCount.set(5);
  }

  showMoreProjects(): void {
    this.visibleProjectCount.update(count => count + 5);
  }
}
