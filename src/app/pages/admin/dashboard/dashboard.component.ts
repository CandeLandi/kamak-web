import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
import { ProjectsService } from '../../../core/services/projects.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Project } from '../interfaces/project.interface';
import { ProjectCategory } from '../../../core/models/enums';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardStatsComponent } from '../components/dashboard-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    AdminHeaderComponent,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatPaginatorModule,
    LucideAngularModule,
    DashboardStatsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  // Expose ProjectCategory to template
  protected readonly ProjectCategory = ProjectCategory;

  // Variables normales
  loading: boolean = true;
  error: string | null = null;
  currentPage = signal<number>(1);
  projectsPerPage = 9;
  categoryFilter = signal<string>('todos');
  projects = signal<Project[]>([]);

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    // Suscribirse a los cambios del signal de proyectos del servicio
    effect(() => {
      this.projects.set(this.projectsService.projects());
    });
  }

  // Computed values
  filteredProjects = computed(() => {
    const filter = this.categoryFilter();
    if (filter === 'todos') return this.projects();
    return this.projects().filter(p => p.category === filter);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProjects().length / this.projectsPerPage)
  );

  indexOfFirstProject = computed(() => (this.currentPage() - 1) * this.projectsPerPage);
  indexOfLastProject = computed(() => Math.min(this.indexOfFirstProject() + this.projectsPerPage, this.filteredProjects().length));

  currentProjects = computed(() => {
    const start = this.indexOfFirstProject();
    return this.filteredProjects().slice(start, start + this.projectsPerPage);
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    const clientId = this.authService.getClientId?.();
    if (!clientId) {
      this.error = 'No se pudo obtener el ID del cliente';
      this.loading = false;
      return;
    }

    this.projectsService.refreshProjects(clientId, () => {
      this.loading = false;
    });
  }

  handlePageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
  }

  handleDeleteProject(projectId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.projectsService.deleteProject(projectId).subscribe({
        next: () => {
          this.snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.error = 'Error al eliminar el proyecto';
          this.snackBar.open('Error al eliminar el proyecto', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  setCategoryFilter(value: string): void {
    this.categoryFilter.set(value);
    this.currentPage.set(1);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.setCategoryFilter(value);
  }

  protected handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
