import { Injectable, signal, effect, inject, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectVideo, PaginatedResponse, PaginationDto } from '../../pages/admin/interfaces/project.interface';
import { environment } from '../../../environments/environment';
import { ProjectCategory } from '../models/enums';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly baseUrl = environment.apiUrl;
  public projectsSignal: WritableSignal<Project[]> = signal([]);
  private lastClientId: string | null = null;
  private authService = inject(AuthService);

  constructor(private http: HttpClient) {
    // Cuando el usuario cambia (login/logout), reseteamos los proyectos.
    effect(() => {
      const currentId = this.authService.getClientId();
      if (this.lastClientId && this.lastClientId !== currentId) {
        this.projectsSignal.set([]);
      }
      this.lastClientId = currentId;
    });
  }

  /** Signal reactivo global de proyectos */
  get projects() {
    return this.projectsSignal;
  }


  getProjectsByClientId(clientId: string, pagination: PaginationDto): Observable<PaginatedResponse<Project>> {
    let params = new HttpParams();

    if (pagination.page) {
      params = params.set('page', pagination.page.toString());
    }
    if (pagination.limit) {
      params = params.set('limit', pagination.limit.toString());
    }
    if (pagination.search) {
      params = params.set('search', pagination.search);
    }
    if (pagination.category && pagination.category !== 'todos') {
      params = params.set('category', pagination.category);
    }

    return this.http.get<PaginatedResponse<Project>>(`${this.baseUrl}/projects/client/${clientId}`, { params });
  }

  /**
   * Refresca la lista de proyectos usando la última página y búsqueda conocidas.
   * Útil para recargar después de una operación CRUD.
   * @deprecated Este método puede ser confuso. Considere llamar directamente a getProjectsByClientId con el estado de paginación deseado.
   */
  refreshProjects(clientId: string, pagination: PaginationDto, onComplete?: () => void): void {
    this.getProjectsByClientId(clientId, pagination).subscribe({
      next: () => {
        if (onComplete) onComplete();
      },
      error: (err) => {
        console.error("Error refreshing projects", err);
        if (onComplete) onComplete();
      }
    });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  // =================================================================
  // == PUBLIC METHODS (No Auth Required) - DEPRECATED
  // =================================================================

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  updateProject(id: string, project: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects/featured`);
  }

  /** Llama a refreshProjects con el último clientId usado */
  refreshLast(): void {
    if (this.lastClientId) {
      this.refreshProjects(this.lastClientId, { page: 1, limit: 10 });
    }
  }

  // =================================================================
  // == MULTIMEDIA METHODS (Auth Required)
  // =================================================================

  deleteGalleryImage(projectId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/gallery/${imageId}`);
  }

  getProjectVideos(projectId: string): Observable<ProjectVideo[]> {
    return this.http.get<ProjectVideo[]>(`${this.baseUrl}/projects/${projectId}/videos`);
  }

  addProjectVideo(projectId: string, url: string): Observable<ProjectVideo> {
    return this.http.post<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos`, { url });
  }

  deleteProjectVideo(projectId: string, videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`);
  }
}
