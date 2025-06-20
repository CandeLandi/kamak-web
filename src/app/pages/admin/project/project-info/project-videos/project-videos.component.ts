import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule } from 'lucide-angular';
import { Project, ProjectVideo } from '../../../interfaces/project.interface';
import { ProjectsService } from '../../../../../core/services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './project-videos.component.html',
  styleUrl: './project-videos.component.scss'
})
export class ProjectVideosComponent implements OnInit {
  @Input() project: Project | null = null;

  videos: ProjectVideo[] = [];
  videoForm: FormGroup;
  loading = false;

  private projectsService = inject(ProjectsService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.videoForm = this.fb.group({
      newVideo: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/)]]
    });
  }

  ngOnInit(): void {
    if (this.project?.id) {
      this.loadVideos();
    }
  }

  loadVideos(): void {
    if (!this.project?.id) return;
    this.loading = true;
    this.projectsService.getProjectVideos(this.project.id).subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error al cargar los videos.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  handleAddVideo(): void {
    if (this.videoForm.invalid || !this.project?.id) {
      return;
    }

    const newVideoUrl = this.videoForm.get('newVideo')?.value;
    this.projectsService.addProjectVideo(this.project.id, newVideoUrl).subscribe({
      next: (newVideo) => {
        this.videos.push(newVideo);
        this.videoForm.reset();
        this.videoForm.get('newVideo')?.setErrors(null);
        this.snackBar.open('Video agregado correctamente.', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al agregar el video.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  handleRemoveVideo(videoId: string): void {
    if (!this.project?.id) return;

    this.projectsService.deleteProjectVideo(this.project.id, videoId).subscribe({
      next: () => {
        this.videos = this.videos.filter(video => video.id !== videoId);
        this.snackBar.open('Video eliminado correctamente.', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al eliminar el video.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
