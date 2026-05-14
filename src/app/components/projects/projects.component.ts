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
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

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
    PaginationComponent,
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

  public pagination = signal({
    pageIndex: 0,
    pageSize: 6,
  });

  public filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const projects = this.allProjects();

    if (!query) {
      return projects;
    }

    return projects.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  public paginatedProjects = computed(() => {
    const projects = this.filteredProjects();
    const { pageIndex, pageSize } = this.pagination();
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return projects.slice(start, end);
  });

  public totalPages = computed(() => {
    const length = this.filteredProjects().length;
    const pageSize = this.pagination().pageSize;
    if (!length || !pageSize) return 0;
    return Math.ceil(length / pageSize);
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
        this.loading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.goToPage(0);
  }

  goToPage(pageIndex: number): void {
    const total = this.totalPages();
    const newPageIndex = Math.max(0, Math.min(pageIndex, total - 1));

    this.pagination.set({ ...this.pagination(), pageIndex: newPageIndex });
  }
}
