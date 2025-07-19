import { Injectable, signal, effect, inject, WritableSignal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectVideo, PaginatedResponse, PaginationDto } from '../../pages/admin/interfaces/project.interface';
import { environment } from '../../../environments/environment';
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

    effect(() => {
      const currentId = this.authService.getClientId();
      if (this.lastClientId && this.lastClientId !== currentId) {
        this.projectsSignal.set([]);
      }
      this.lastClientId = currentId;
    });
  }

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

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

<<<<<<< HEAD
  getPublicProjects(): Observable<Project[]> {
    // Usar el clientId público que se usa en el componente de proyectos
    const PUBLIC_CLIENT_ID = '78abe353-1728-49b0-b268-1d2ad5786317';

    console.log('🌐 Fetching public projects from:', `${this.baseUrl}/projects/client/${PUBLIC_CLIENT_ID}`);

    return this.http.get<any>(`${this.baseUrl}/projects/client/${PUBLIC_CLIENT_ID}`).pipe(
      tap(response => {
        console.log('📡 Raw response from backend:', response);
=======
    getPublicProjects(): Observable<Project[]> {
    console.log('Fetching public projects from:', `${this.baseUrl}/projects`);

    // Usar el clientId público que se usa en el componente de proyectos
    const PUBLIC_CLIENT_ID = '78abe353-1728-49b0-b268-1d2ad5786317';

    return this.http.get<any>(`${this.baseUrl}/projects/client/${PUBLIC_CLIENT_ID}`).pipe(
      tap(response => {
        console.log('Raw response from /projects/client:', response);
>>>>>>> main
      }),
      map(response => {
        // Manejar diferentes estructuras de respuesta
        if (response && Array.isArray(response.data)) {
<<<<<<< HEAD
          console.log('✅ Response has data array, length:', response.data.length);
          return response.data;
        } else if (Array.isArray(response)) {
          console.log('✅ Response is direct array, length:', response.length);
          return response;
        } else if (response && Array.isArray(response.projects)) {
          console.log('✅ Response has projects array, length:', response.projects.length);
          return response.projects;
        } else {
          console.error('❌ Unexpected response structure:', response);
=======
          console.log('Response has data array, length:', response.data.length);
          return response.data;
        } else if (Array.isArray(response)) {
          console.log('Response is direct array, length:', response.length);
          return response;
        } else if (response && Array.isArray(response.projects)) {
          console.log('Response has projects array, length:', response.projects.length);
          return response.projects;
        } else {
          console.error('Unexpected response structure:', response);
>>>>>>> main
          return [];
        }
      })
    );
  }

  getPublicProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}/published`);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects/featured`);
  }

  // MULTIMEDIA METHODS
  deleteGalleryImage(projectId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/gallery/${imageId}`);
  }

  createProject(project: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, project);
  }

  updateProject(id: string, project: UpdateProjectDto): Observable<Project> {
    return this.http.patch<Project>(`${this.baseUrl}/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
  }
}
