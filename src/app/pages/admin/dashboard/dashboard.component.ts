import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
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
import { DashboardStatsComponent } from '../components/dashboard-stats/dashboard-stats.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

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
    DashboardStatsComponent,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  protected readonly ProjectCategory = ProjectCategory;

  loading = false;
  error: string | null = null;
  currentPage = signal<number>(1);
  projectsPerPage = 9;
  categoryFilter = signal<string>('todos');
  private readonly dialog = inject(MatDialog);

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  get projects() {
    return this.projectsService.projectsOfClientId;
  }

  // Computed values
  filteredProjects = computed(() => {
    const filter = this.categoryFilter();
    if (filter === 'todos') return this.projects();
    return this.projects().filter((p: Project) => p.category === filter);
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
    this.projectsService.projectsOfClientId.set([]);

    const clientId = this.authService.getClientId?.();
    if (!clientId) {
      this.error = 'No se pudo obtener el ID del cliente';
      this.loading = false;
      return;
    }

    this.projectsService.getProjectsByClientId(clientId).subscribe({
      next: (projects) => {
        this.projectsService.projectsOfClientId.set(projects || []);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar proyectos';
        this.loading = false;
      }
    });
  }

  handlePageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
  }

  handleDeleteProject(projectId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectsService.deleteProject(projectId).subscribe({
          next: () => {
            this.snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            this.snackBar.open('Error al eliminar el proyecto', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
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
