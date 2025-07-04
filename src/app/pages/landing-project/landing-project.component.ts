import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ViewportScroller, CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectsService } from '../../core/services/projects.service';
import { Project, ProjectVideo } from '../admin/interfaces/project.interface';
import { switchMap, tap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { ImageLightboxDialogComponent, ImageLightboxData } from '../../shared/components/image-lightbox-dialog/image-lightbox-dialog.component';
import { VideoService } from '../../core/services/video.service';

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

  limit = 10;

  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private sanitizer = inject(DomSanitizer);
  private viewportScroller = inject(ViewportScroller);
  private dialog = inject(MatDialog);
  private videoService = inject(VideoService);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.loadProjectData();
  }

  loadProjectData(): void {
    this.loading = true;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) throw new Error('Project ID not found');
        return this.projectsService.getPublicProjectById(id).pipe(
          tap(project => {
            this.project = project;
            this.loading = false;
            this.loadVideos();
          })
        );
      })
    ).subscribe({
      next: () => {},
      error: err => {
        console.error('Error loading project data:', err);
        this.error = 'No se pudo cargar el proyecto. Intente más tarde.';
        this.loading = false;
      }
    });
  }

  loadVideos(): void {
    if (!this.project?.id) return;
    this.loading = true;
    this.videoService.getVideos(this.project.id, { page: 1, limit: this.limit }).subscribe({
      next: (res) => {
        this.videos = res.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.videos = [];
        this.loading = false;
      }
    });
  }

  get mainVideo(): ProjectVideo | null {
    return this.videos.length > 0 ? this.videos[0] : null;
  }

  get additionalVideos(): ProjectVideo[] {
    return this.videos.length > 1 ? this.videos.slice(1) : [];
  }

  get projectDetails() {
    if (!this.project) return [];
    const details = [];
    // Ubicación
    let addressValue = '';
    if (this.project.address && typeof this.project.address === 'object' && this.project.address.address) {
      addressValue = this.project.address.address;
    } else if (typeof this.project.address === 'string') {
      addressValue = this.project.address;
    }
    if (addressValue) {
      details.push({ label: 'Ubicación', value: addressValue, icon: 'map-pin' });
    }
    // Superficie
    if (this.project.area) {
      details.push({ label: 'Superficie', value: this.project.area, icon: 'ruler' });
    }
    // Duración
    if (this.project.duration) {
      details.push({ label: 'Duración', value: this.project.duration, icon: 'clock' });
    }
    // Fecha inicio
    if (this.project.startDate) {
      details.push({ label: 'Fecha inicio', value: this.project.startDate, icon: 'calendar' });
    }
    // Fecha fin
    if (this.project.endDate) {
      details.push({ label: 'Fecha fin', value: this.project.endDate, icon: 'calendar-check' });
    }
    return details;
  }

  isYoutube(url: string): boolean {
    return /youtu(be\.com|\.be)/.test(url);
  }

  get displayedGallery() {
    if (!this.project?.gallery) return [];
    return this.showAllImages ? this.project.gallery : this.project.gallery.slice(0, this.initialImageCount);
  }

  get hasMoreImages() {
    if (!this.project?.gallery) return false;
    return this.project.gallery.length > this.initialImageCount;
  }

  openImageLightbox(index: number): void {
    if (!this.project?.gallery || this.project.gallery.length === 0) return;

    // Obtener las URLs de las imágenes de la galería
    const imageUrls = this.project.gallery.map(img => img.url).filter(url => url);

    if (imageUrls.length === 0) return;

    // Ajustar el índice para que coincida con las imágenes mostradas
    const actualIndex = this.showAllImages ? index : Math.min(index, this.initialImageCount - 1);

    const dialogData: ImageLightboxData = {
      images: imageUrls,
      currentIndex: actualIndex,
      projectName: this.project.name
    };

    this.dialog.open(ImageLightboxDialogComponent, {
      data: dialogData,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      panelClass: 'lightbox-dialog'
    });
  }

  openBeforeAfterLightbox(index: number): void {
    if (!this.project?.imageBefore || !this.project?.imageAfter) return;

    const images = [this.project.imageBefore, this.project.imageAfter];
    const labels = ['Antes', 'Después'];

    const dialogData: ImageLightboxData = {
      images: images,
      currentIndex: index,
      projectName: `${this.project.name} - ${labels[index]}`
    };

    this.dialog.open(ImageLightboxDialogComponent, {
      data: dialogData,
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '100%',
      height: '100%',
      panelClass: 'lightbox-dialog'
    });
  }

  generatePlaceholderUrl(text: string): string {
    // Devuelve una URL de placeholder con texto (mockup)
    return `https://via.placeholder.com/600x400?text=${encodeURIComponent(text)}`;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    if (this.isYoutube(url)) {
      const videoId = this.extractVideoId(url);
      if (!videoId) return null;
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private extractVideoId(url: string): string | null {
    if (!url) return null;
    // Soporta múltiples formatos de YouTube
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
}
