import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gallery, CreateGalleryDto, UpdateGalleryDto } from '../../pages/admin/interfaces/gallery.interface';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly baseUrl = '/api/projects'; // Cambia esto si tu baseUrl es diferente

  constructor(private http: HttpClient) {}

  getGallery(projectId: string): Observable<Gallery[]> {
    return this.http.get<Gallery[]>(`${this.baseUrl}/${projectId}/gallery`);
  }

  addImage(projectId: string, dto: CreateGalleryDto): Observable<Gallery> {
    return this.http.post<Gallery>(`${this.baseUrl}/${projectId}/gallery`, dto);
  }

  removeImage(projectId: string, imageId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${projectId}/gallery/${imageId}`);
  }

  updateImage(projectId: string, imageId: string, dto: UpdateGalleryDto): Observable<Gallery> {
    return this.http.patch<Gallery>(`${this.baseUrl}/${projectId}/gallery/${imageId}`, dto);
  }

  reorderGallery(projectId: string, galleryIds: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}/gallery/reorder`, { galleryIds });
  }
}
