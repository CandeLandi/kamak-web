import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewportScroller, CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectsService } from '../../core/services/projects.service';
import { Project, ProjectVideo } from '../admin/interfaces/project.interface';
import { switchMap, tap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-landing-project',
  standalone: true,
  imports: [FooterComponent, RouterModule, CommonModule, MatProgressSpinnerModule, LucideAngularModule],
  templateUrl: './landing-project.component.html',
  styleUrls: ['./landing-project.component.scss']
})
export class LandingProjectComponent implements OnInit {
  project: Project | null = null;
  videos: ProjectVideo[] = [];
  loading = true;
  error: string | null = null;

  showAllImages = false;
  initialImageCount = 6;

  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private sanitizer = inject(DomSanitizer);
  private viewportScroller = inject(ViewportScroller);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Project ID not found');
        }
        return this.projectsService.getPublicProjectById(id).pipe(
          tap(project => {
            this.project = project;
          }),
          switchMap(project => {
            if (!project) throw new Error('Project not available');
            return this.projectsService.getProjectVideos(project.id);
          })
        );
      })
    ).subscribe({
      next: videos => {
        this.videos = videos;
        this.loading = false;
      },
      error: err => {
        this.error = 'No se pudo cargar el proyecto. Intente más tarde.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get displayedGallery() {
    if (!this.project?.gallery) return [];
    return this.showAllImages ? this.project.gallery : this.project.gallery.slice(0, this.initialImageCount);
  }

  get hasMoreImages() {
    if (!this.project?.gallery) return false;
    return this.project.gallery.length > this.initialImageCount;
  }

  openImageModal(index: number) {
    // Lógica para abrir modal de imagen (mockup)
    alert('Abrir imagen modal: ' + index);
  }

  generatePlaceholderUrl(text: string): string {
    // Devuelve una URL de placeholder con texto (mockup)
    return `https://via.placeholder.com/600x400?text=${encodeURIComponent(text)}`;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      // Return a placeholder or an empty safe URL if ID extraction fails
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(url: string): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}
