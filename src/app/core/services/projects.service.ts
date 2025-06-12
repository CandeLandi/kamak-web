import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../pages/admin/interfaces/project.interface';
import { environment } from '../../../environments/environment';
import { ProjectCategory } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private readonly baseUrl = environment.apiUrl;
  private projectsSignal = signal<Project[]>([]);
  private lastClientId: string | null = null;

  constructor(private http: HttpClient) {}

  /** Signal reactivo global de proyectos */
  get projects() {
    return this.projectsSignal;
  }

  /** Carga y actualiza el signal de proyectos para un clientId */
  refreshProjects(clientId: string, onComplete?: () => void): void {
    this.lastClientId = clientId;
    this.http.get<Project[]>(`${this.baseUrl}/projects/client/${clientId}`).subscribe({
      next: (projects) => {
        this.projectsSignal.set(projects);
        if (onComplete) onComplete();
      },
      error: () => {
        this.projectsSignal.set([]);
        if (onComplete) onComplete();
      },
    });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project).pipe(
      tap((newProject) => {
        if (this.lastClientId) {
          const currentProjects = this.projectsSignal();
          this.projectsSignal.set([newProject, ...currentProjects]);
        }
      })
    );
  }

  updateProject(id: string, project: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, project).pipe(
      tap((updatedProject) => {
        const currentProjects = this.projectsSignal();
        const updatedProjects = currentProjects.map(p =>
          p.id === id ? updatedProject : p
        );
        this.projectsSignal.set(updatedProjects);
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`).pipe(
      tap(() => {
        const currentProjects = this.projectsSignal();
        const filteredProjects = currentProjects.filter(p => p.id !== id);
        this.projectsSignal.set(filteredProjects);
      })
    );
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
