import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectVideo } from '../../pages/admin/interfaces/project.interface';
import { environment } from '../../../environments/environment';
import { ProjectCategory } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly baseUrl = environment.apiUrl;
  projectsOfClientId = signal<Project[]>([]);
  lastClientId: string | null = null;

  constructor(private http: HttpClient) {}

  /** Signal reactivo global de proyectos */
  get projects() {
    return this.projectsOfClientId;
  }

  /** Obtiene un proyecto específico por su ID */
  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  /** Obtiene todos los proyectos de un cliente */
  getProjectsByClientId(clientId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`, { params: { clientId } });
  }

  /** Carga y actualiza el signal de proyectos para un clientId */
  refreshProjects(clientId: string, onComplete?: () => void): void {
    this.lastClientId = clientId;
    this.getProjectsByClientId(clientId).subscribe({
      next: (projects) => {
        this.projectsOfClientId.set(projects);
        if (onComplete) onComplete();
      },
      error: () => {
        this.projectsOfClientId.set([]);
        if (onComplete) onComplete();
      },
    });
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project).pipe(
      tap((newProject) => {
        if (this.lastClientId) {
          const currentProjects = this.projectsOfClientId();
          this.projectsOfClientId.set([newProject, ...currentProjects]);
        }
      })
    );
  }

  updateProject(id: string, project: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, project).pipe(
      tap((updatedProject) => {
        const currentProjects = this.projectsOfClientId();
        const updatedProjects = currentProjects.map(p =>
          p.id === id ? updatedProject : p
        );
        this.projectsOfClientId.set(updatedProjects);
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projectsOfClientId();
        const filteredProjects = currentProjects.filter(p => p.id !== id);
        this.projectsOfClientId.set(filteredProjects);
      })
    );
  }

  /**
   * Elimina una imagen de la galería de un proyecto.
   * @param projectId El ID del proyecto.
   * @param imageId El ID de la imagen en la galería.
   * @returns Un observable que se completa cuando la operación finaliza.
   */
  deleteGalleryImage(projectId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/gallery/${imageId}`);
  }

  // =================================================================
  // == VIDEO METHODS
  // =================================================================

  /**
   * Obtiene todos los videos de un proyecto.
   * @param projectId El ID del proyecto.
   * @returns Un observable con el array de videos del proyecto.
   */
  getProjectVideos(projectId: string): Observable<ProjectVideo[]> {
    return this.http.get<ProjectVideo[]>(`${this.baseUrl}/projects/${projectId}/videos`);
  }

  /**
   * Agrega un nuevo video de YouTube a un proyecto.
   * @param projectId El ID del proyecto.
   * @param url La URL del video de YouTube.
   * @returns Un observable con el objeto del video recién creado.
   */
  addProjectVideo(projectId: string, url: string): Observable<ProjectVideo> {
    return this.http.post<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos`, { url });
  }

  /**
   * Elimina un video de un proyecto.
   * @param projectId El ID del proyecto.
   * @param videoId El ID del video a eliminar.
   * @returns Un observable que se completa cuando la operación finaliza.
   */
  deleteProjectVideo(projectId: string, videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects/featured`);
  }

  /** Llama a refreshProjects con el último clientId usado */
  refreshLast(): void {
    if (this.lastClientId) {
      this.refreshProjects(this.lastClientId);
    }
  }
}
