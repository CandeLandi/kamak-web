// This file will be replaced.

import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Project, PaginationDto } from '../interfaces/project.interface';
import { ProjectsService } from '../../../core/services/projects.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectCategory } from '../../../core/models/enums';

// Componentes y Módulos
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { DashboardStatsComponent } from '../../../shared/components/dashboard-stats/dashboard-stats.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    LucideAngularModule,
    AdminHeaderComponent,
    SearchInputComponent,
    DashboardStatsComponent,
    ProjectCardComponent,
    PaginationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {

  public projectsService = inject(ProjectsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  public loading = signal(true);
  public error = signal<string | null>(null);
  public clientReady = signal(false);

  public searchQuery = signal('');
  public categoryControl = new FormControl('todos');
  public selectedCategory = signal('todos');

  public allProjects = signal<Project[]>([]);

  public pagination = signal({
    pageIndex: 0,
    pageSize: 6,
  });

  private destroy$ = new Subject<void>();
  private clientId!: string;



  // 1. Filtra por categoría y búsqueda
  public filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    let projects = this.allProjects();

    // Filtrar por categoría
    if (category && category !== 'todos') {
      projects = projects.filter(p => p.category === category);
    }

    // Filtrar por búsqueda
    if (query) {
      projects = projects.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return projects;
  });

  // 2. Aplica la paginación a los proyectos filtrados
  public paginatedProjects = computed(() => {
    const projects = this.filteredProjects();
    const { pageIndex, pageSize } = this.pagination();
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return projects.slice(start, end);
  });

  // 3. Calcula el total de páginas
  public totalPages = computed(() => {
    const length = this.filteredProjects().length;
    const pageSize = this.pagination().pageSize;
    if (!length || !pageSize) return 0;
    return Math.ceil(length / pageSize);
  });

  // 4. Genera los números de página a mostrar
  public displayedPages = computed(() => {
    const total = this.totalPages();
    const current = this.pagination().pageIndex + 1;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    range.push(total);
    return range;
  });

  ngOnInit(): void {
    this.error.set(null);
    const clientId = this.authService.getClientId();
    if (!clientId) {
      this.clientReady.set(false);
      return;
    }
    this.clientId = clientId;
    this.clientReady.set(true);
    this.loadProjects();

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('/admin/dashboard')) {
        this.loadProjects();
      }
    });

    this.categoryControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.selectedCategory.set(value || 'todos');
      this.goToPage(0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    const pagination: PaginationDto = {
      page: 1,
      limit: 100,
    };
    this.projectsService.getProjectsByClientId(this.clientId, pagination).subscribe({
      next: (response) => {
        this.allProjects.set(response.data);
        this.loading.set(false);
        },
      error: (err) => {
        this.error.set('No se pudieron cargar los proyectos.');
        this.snackBar.open('Error al cargar proyectos.', 'Cerrar', { duration: 4000 });
        this.loading.set(false);
        console.error(err);
      },
      });
    }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.goToPage(0);
  }

  goToPage(pageIndex: number): void {
    const total = this.totalPages();
    const newPageIndex = Math.max(0, Math.min(pageIndex, total > 0 ? total - 1 : 0));
    this.pagination.update(p => ({ ...p, pageIndex: newPageIndex }));
  }

  previousPage(): void {
    if (this.pagination().pageIndex > 0) {
      this.goToPage(this.pagination().pageIndex - 1);
  }
  }

  nextPage(): void {
    if (this.pagination().pageIndex < this.totalPages() - 1) {
      this.goToPage(this.pagination().pageIndex + 1);
  }
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  deleteProject(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar proyecto',
        message: '¿Estás seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      } as ConfirmationDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectsService.deleteProject(id).subscribe({
        next: () => {
          this.snackBar.open('Proyecto eliminado correctamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadProjects();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el proyecto.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }

  editProject(id: string) {
    this.router.navigate(['/admin/project', id]);
  }

  viewProject(id: string) {
    window.open(`/projects/${id}`, '_blank');
  }

  protected readonly ProjectCategory = ProjectCategory;
  public readonly projectCategories = Object.values(ProjectCategory);
  }

