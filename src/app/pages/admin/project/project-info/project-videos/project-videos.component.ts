import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, OnChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule } from 'lucide-angular';
import { Project, ProjectVideo } from '../../../interfaces/project.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideoService } from '../../../../../core/services/video.service';
import { debounceTime, distinctUntilChanged, filter, skip } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProjectsService } from '../../../../../core/services/projects.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-videos',
  standalone: true,
  imports: [
    LucideAngularModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  templateUrl: './project-videos.component.html',
  styleUrl: './project-videos.component.scss'
})
export class ProjectVideosComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;

  videos: ProjectVideo[] = [];
  loading = false;
  submitting = false;
  savingIndex: number | null = null;

  // Estado para UI tipo Vercel
  isEditMode = false;
  selectedVideo: ProjectVideo | null = null;
  selectedVideoId: string | null = null;
  formData = { title: '', youtubeUrl: '', description: '' };
  newVideo = { title: '', youtubeUrl: '', description: '' };
  errors: { title?: string | null; youtubeUrl?: string | null; description?: string | null } = {};

  private videoService = inject(VideoService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private projectsService = inject(ProjectsService);

  constructor() {}

  ngOnInit(): void {
    if (this.project?.id) {
      this.loadVideos();
    }
  }

  ngOnChanges(): void {
    if (this.project?.id) {
      this.loadVideos();
    }
  }

  loadVideos(): void {
    if (!this.project?.id) return;
    this.loading = true;
    this.videoService.getVideos(this.project.id, { page: 1, limit: 10 }).subscribe({
      next: (res) => {
        this.videos = res.data || [];
        this.loading = false;
        // Si estamos editando un video, refrescar el formData con el video actualizado
        if (this.isEditMode && this.selectedVideoId) {
          const updated = this.videos.find(v => v.id === this.selectedVideoId);
          if (updated) {
            this.selectedVideo = updated;
            this.formData = {
              title: updated.title,
              youtubeUrl: updated.youtubeUrl,
              description: updated.description || ''
            };
          } else {
            this.handleCancelEdit();
          }
        }
      },
      error: () => {
        this.snackBar.open('Error al cargar los videos.', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  handleVideoClick(video: ProjectVideo): void {
    this.isEditMode = true;
    this.selectedVideo = video;
    this.selectedVideoId = video.id;
    this.formData = {
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      description: video.description || ''
    };
  }

  handleCancelEdit(): void {
    this.isEditMode = false;
    this.selectedVideo = null;
    this.selectedVideoId = null;
    this.formData = { title: '', youtubeUrl: '', description: '' };
  }

  handleAddVideo(): void {
    if (!this.project?.id || this.videos.length >= 10) return;
    const { title, youtubeUrl, description } = this.formData;
    if (!title.trim() || !youtubeUrl.trim()) return;
    this.submitting = true;
    this.videoService.addVideo(this.project.id, {
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      description: description.trim()
    }).subscribe({
      next: () => {
        this.snackBar.open('Video añadido.', 'Cerrar', { duration: 2000 });
        this.formData = { title: '', youtubeUrl: '', description: '' };
        this.loadVideos();
        this.submitting = false;
      },
      error: (err) => {
        this.snackBar.open('Error al añadir el video: ' + (err?.error?.message || ''), 'Cerrar', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  handleUpdateVideo(): void {
    if (!this.project?.id || !this.selectedVideo) return;
    const { title, youtubeUrl, description } = this.formData;
    if (!title.trim() || !youtubeUrl.trim()) return;
    this.submitting = true;
    this.videoService.updateVideo(this.project.id, this.selectedVideo.id, {
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      description: description.trim()
    }).subscribe({
      next: () => {
        this.snackBar.open('Video actualizado.', 'Cerrar', { duration: 2000 });
        this.handleCancelEdit();
        this.loadVideos();
        this.submitting = false;
      },
      error: (err) => {
        this.snackBar.open('Error al actualizar el video: ' + (err?.error?.message || ''), 'Cerrar', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  handleDelete(): void {
    if (!this.project?.id || !this.selectedVideo) return;
    this.loading = true;
    this.videoService.deleteVideo(this.project.id, this.selectedVideo.id).subscribe({
      next: () => {
        this.snackBar.open('Video eliminado.', 'Cerrar', { duration: 2000 });
        this.handleCancelEdit();
        this.loadVideos();
      },
      error: () => {
        this.snackBar.open('Error al eliminar el video.', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    // Extraer el ID del video de YouTube y armar la URL embebida
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getYoutubeThumbnail(url: string): string | null {
    if (!url) return null;
    // Extraer el ID del video de YouTube
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  }
}
