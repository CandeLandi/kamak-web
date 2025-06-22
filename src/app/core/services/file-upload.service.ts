import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);


  uploadImage(file: File, folder?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    // Los headers de autorización se manejan automáticamente con el interceptor.
    return this.http.post(`${this.apiUrl}/upload/image`, formData);
  }

  /**
   * Sube una imagen a la galería de un proyecto específico.
   * @param projectId El ID del proyecto.
   * @param file El archivo de imagen a subir.
   * @param title El título de la imagen (opcional).
   * @param description La descripción de la imagen (opcional).
   * @returns Un observable con la respuesta del servidor.
   */
  uploadToProjectGallery(
    projectId: string,
    file: File,
    title?: string,
    description?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    // URL Corregida para que coincida con la de Swagger
    const url = `${this.apiUrl}/projects/${projectId}/gallery/upload`;

    return this.http.post(url, formData);
  }
}
