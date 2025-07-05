import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UploadService } from '../../../../../core/services/file-upload.service';
import { ProjectsService } from '../../../../../core/services/projects.service';
import { Gallery, Project } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-images',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-images.component.html',
  styleUrls: ['./project-images.component.scss']
})
export class ProjectImagesComponent implements OnChanges {
  @Input() project: Project | null = null;
  @Output() imageUpdated = new EventEmitter<void>();

  private readonly fileUploadService = inject(UploadService);
  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  before: string | undefined = '';
  after: string | undefined = '';
  gallery: Gallery[] = [];
  isUploadingBeforeAfter: 'imageBefore' | 'imageAfter' | null = null;
  isUploadingGallery = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.before = this.project.imageBefore;
      this.after = this.project.imageAfter;
      this.gallery = this.project.gallery || [];
    }
  }

  handleImageChange(event: Event, type: 'imageBefore' | 'imageAfter'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.project) return;

    this.isUploadingBeforeAfter = type;
    this.fileUploadService.uploadImage(file, `projects/${this.project.id}`).subscribe({
      next: (response: { thumbnail: string, medium: string, large: string }) => {
        const imageUrl = response.large;
        this.projectsService.updateProject(this.project!.id, { [type]: imageUrl }).subscribe({
          next: (updatedProject: Project) => {
            if (type === 'imageBefore') this.before = updatedProject.imageBefore;
            if (type === 'imageAfter') this.after = updatedProject.imageAfter;
            this.snackBar.open('Imagen actualizada correctamente.', 'Cerrar', { duration: 3000 });
            this.isUploadingBeforeAfter = null;
            this.imageUpdated.emit();
          },
          error: () => {
            this.snackBar.open('Error al actualizar la URL.', 'Cerrar', { duration: 3000, panelClass: 'error-snackbar' });
            this.isUploadingBeforeAfter = null;
          }
        });
      },
      error: () => {
        this.snackBar.open('Error al subir la imagen.', 'Cerrar', { duration: 3000, panelClass: 'error-snackbar' });
        this.isUploadingBeforeAfter = null;
      }
    });
  }

  handleGalleryImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0 || !this.project) return;

    this.isUploadingGallery = true;
    const uploadObservables = Array.from(files).map(file =>
      this.fileUploadService.uploadToProjectGallery(this.project!.id, file).pipe(
        catchError(() => {
          this.snackBar.open(`Error al subir ${file.name}`, 'Cerrar', { duration: 3000, panelClass: 'error-snackbar' });
          return of(null);
        })
      )
    );

    forkJoin(uploadObservables).subscribe(() => {
      this.snackBar.open('Subida a la galería completada.', 'Cerrar', { duration: 3000 });
      this.projectsService.getProjectById(this.project!.id).subscribe((updatedProject: Project) => {

        // --- INICIO DE LA DEPURACIÓN ---
        console.log('Proyecto recargado después de la subida:', updatedProject);
        console.log('Galería recibida del backend:', updatedProject.gallery);
        // --- FIN DE LA DEPURACIÓN ---

        this.gallery = updatedProject.gallery || [];
        this.isUploadingGallery = false;
      });
    });
  }

  handleRemoveGalleryImage(imageId: string): void {
    if (!this.project) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar imagen',
        message: '¿Estás seguro que deseas eliminar esta imagen de la galería? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      } as ConfirmationDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectsService.deleteGalleryImage(this.project!.id, imageId).subscribe({
        next: () => {
          this.gallery = this.gallery.filter(img => img.id !== imageId);
          this.snackBar.open('Imagen eliminada correctamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la imagen.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }
}
