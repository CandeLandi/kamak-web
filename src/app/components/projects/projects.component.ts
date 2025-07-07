import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, tap } from 'rxjs';
import { ProjectsService } from '../../core/services/projects.service';
import { AuthService } from '../../core/services/auth.service';
import { Project, PaginationDto } from '../../pages/admin/interfaces/project.interface';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { environment } from '../../../environments/environment';

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
    SearchInputComponent,
    PaginationComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private authService = inject(AuthService);

  public loading = signal(true);
  public error = signal<string | null>(null);

  private allProjects = signal<Project[]>([]);
  public searchQuery = signal('');

  // --- Paginación ---
  public pagination = signal({
    pageIndex: 0,
    pageSize: 6,
  });

  // --- Selectores (Signals Computados) ---
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

  private readonly PUBLIC_CLIENT_ID = '78abe353-1728-49b0-b268-1d2ad5786317';

  // El effect debe ser un campo de clase, no dentro de ngOnInit
  private clientIdEffect = effect(() => {
    const clientId = this.authService.clientIdSignal();
    if (clientId) {
      this.loadProjectsWithClientId(clientId);
    }
  });

  ngOnInit(): void {
    this.loading.set(true);
    const pagination: PaginationDto = { page: 1, limit: 100 };
    this.projectsService.getProjectsByClientId(this.PUBLIC_CLIENT_ID, pagination).subscribe({
      next: (response) => {
        this.allProjects.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadProjectsWithClientId(clientId: string): void {
    this.loading.set(true);
    this.error.set(null);
    const pagination: PaginationDto = { page: 1, limit: 100 };

    this.projectsService.getProjectsByClientId(clientId, pagination).subscribe({
      next: (response) => {
        this.allProjects.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
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

    // Forzar el repintado reiniciando el estado de paginación
    this.pagination.set({ ...this.pagination(), pageIndex: newPageIndex });
  }
}
