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

  /**
   * Add a YouTube video to a project
   */
  addVideo(projectId: string, video: { title: string; youtubeUrl: string; description?: string; order?: number }): Observable<ProjectVideo> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos`, video, { headers });
  }

  /**
   * Get all videos from a project (with optional pagination)
   */
  getVideos(projectId: string, params?: { page?: number; limit?: number }): Observable<PaginatedResponse<ProjectVideo>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<ProjectVideo>>(`${this.baseUrl}/projects/${projectId}/videos`, { params: httpParams });
  }

  /**
   * Get public videos from a project (with optional pagination)
   */
  getPublicVideos(projectId: string, params?: { page?: number; limit?: number }): Observable<ProjectVideo[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    return this.http.get<ProjectVideo[]>(`${this.baseUrl}/projects/${projectId}/videos/public`, { params: httpParams });
  }

  /**
   * Get a specific video by id
   */
  getVideoById(projectId: string, videoId: string): Observable<ProjectVideo> {
    return this.http.get<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`);
  }

  /**
   * Update a video
   */
  updateVideo(projectId: string, videoId: string, video: { title?: string; youtubeUrl?: string; description?: string }): Observable<ProjectVideo> {
    return this.http.patch<ProjectVideo>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`, video);
  }

  /**
   * Delete a video
   */
  deleteVideo(projectId: string, videoId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}/videos/${videoId}`);
  }

  /**
   * Reorder videos in a project
   */
  reorderVideos(projectId: string, order: { ids: string[] }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/projects/${projectId}/videos/reorder`, order);
  }
}
