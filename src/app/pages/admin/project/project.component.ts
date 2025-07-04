import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../../../shared/components/admin-header/admin-header.component';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { Project } from '../interfaces/project.interface';
import { ProjectImagesComponent } from './project-info/project-images/project-images.component';
import { ProjectInfoComponent } from './project-info/project-info/project-info.component';
import { ProjectVideosComponent } from './project-info/project-videos/project-videos.component';
import { ProjectsService } from '../../../core/services/projects.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    AdminHeaderComponent,
    RouterModule,
    MatTabsModule,
    LucideAngularModule,
    ProjectImagesComponent,
    ProjectVideosComponent,
    ProjectInfoComponent
  ],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);

  protected selectedTabIndex = 0;
  protected projectId: string | null = null;
  protected isEditMode = false;
  protected project: Project | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = id;
        this.isEditMode = true;
        this.loadProject(id);
      } else {
        this.isEditMode = false;
        this.project = null; // Limpiar datos si estamos en modo creación
      }
    });

    this.route.queryParamMap.subscribe(params => {
      if (params.get('tab') === 'images') {
        this.selectedTabIndex = 1;
      }
    });
  }

  loadProject(id: string): void {
    this.projectsService.getProjectById(id).subscribe({
      next: (projectData) => {
        this.project = projectData;
      },
      error: () => {
        this.snackBar.open('Error al cargar el proyecto.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  onTabChange(index: number): void {
    if (!this.isEditMode && index > 0) {
      this.snackBar.open('Primero debes guardar el proyecto para añadir imágenes o videos.', 'Cerrar', { duration: 4000 });
      setTimeout(() => this.selectedTabIndex = 0, 0);
      return;
    }
    this.selectedTabIndex = index;
    // Limpiar query params para que no se quede pegada la tab en la URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onProjectCreated(newProject: Project): void {
    // Navegar a la misma ruta pero con el ID del nuevo proyecto y un query param
    this.router.navigate(['/admin/project', newProject.id], {
      queryParams: { tab: 'images' }
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/dashboard']);
  }
}
