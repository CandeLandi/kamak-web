import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectVideo, PaginatedResponse } from '../../pages/admin/interfaces/project.interface';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  addVideo(projectId: string, video: { title: string; youtubeUrl: string; description?: string; order?: number }): Observable<ProjectVideo> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos`, video, { headers });
  }

  getVideos(projectId: string, params?: { page?: number; limit?: number }): Observable<PaginatedResponse<ProjectVideo>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<PaginatedResponse<ProjectVideo>>(`${this.baseUrl}/projects/${projectId}/videos`, {
      params: httpParams,
      headers: headers
    });
  }

  getPublicVideos(projectId: string, params?: { page?: number; limit?: number }): Observable<ProjectVideo[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    return this.http.get<ProjectVideo[]>(`${this.baseUrl}/projects/${projectId}/videos/public`, { params: httpParams });
  }

  getVideoById(projectId: string, videoId: string): Observable<ProjectVideo> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`, { headers });
  }

  updateVideo(projectId: string, videoId: string, video: { title?: string; youtubeUrl?: string; description?: string }): Observable<ProjectVideo> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`, video, { headers });
  }

  deleteVideo(projectId: string, videoId: string): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`, { headers });
  }

  reorderVideos(projectId: string, order: { ids: string[] }): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<void>(`${this.baseUrl}/projects/${projectId}/videos/reorder`, order, { headers });
  }
}
