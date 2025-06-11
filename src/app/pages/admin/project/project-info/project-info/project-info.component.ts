import { Component, OnInit, inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectsService } from '../../../../../core/services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCategory } from '../../../../../core/models/enums';
import { CreateProjectDto, Project } from '../../../interfaces/project.interface';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-project-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatExpansionModule,
    LucideAngularModule
  ],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.scss'
})
export class ProjectInfoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  @Input() projectId: string | null = null;
  @Input() isEditMode = false;
  @Output() projectCreated = new EventEmitter<void>();

  projectForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
 projectCategories = ProjectCategory;

  ngOnInit(): void {
    this.initForm();
    if (this.projectId) this.loadProject();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      category: [ProjectCategory.ESTACIONES, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      longDescription: ['', [Validators.required, Validators.minLength(50)]],
      imageBefore: [''],
      imageAfter: [''],
      videoUrl: [''],
      address: ['', Validators.required],
      area: ['', Validators.required],
      duration: ['', Validators.required],
      date: ['', Validators.required],
      challenge: ['', [Validators.required, Validators.minLength(20)]],
      solution: ['', [Validators.required, Validators.minLength(20)]],
      showOnHomepage: [true],
      latitude: [], // Descomentar si se usan en el UI
      longitude: [],
    });
  }

  private loadProject(): void {
    this.projectsService.getProjectById(this.projectId!).subscribe({
      next: (project: Project) => {
        this.projectForm.patchValue({
          name: project.name,
          category: project.category,
          description: project.description,
          longDescription: project.longDescription,
          imageBefore: project.imageBefore || '',
          imageAfter: project.imageAfter || '',
          videoUrl: project.videoUrl || '',
          address: project.address,
          area: project.area,
          duration: project.duration,
          date: project.date,
          challenge: project.challenge,
          solution: project.solution,
          showOnHomepage: project.showOnHomepage,
          // latitude: project.latitude || null,
          // longitude: project.longitude || null,
        });
      },
      error: () => {
        this.error = 'Error al cargar el proyecto';
        this.snackBar.open(this.error ? this.error : 'Error al cargar el proyecto', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  saveForm(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const clientId = this.authService.getClientId?.();
    if (!clientId) {
      this.error = 'No se pudo obtener el ID del cliente';
      this.snackBar.open(this.error, 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isSubmitting = false;
      return;
    }

    const projectDto: CreateProjectDto = {
      ...this.projectForm.value,
      clientId,
      // latitude: this.projectForm.value.latitude || undefined,
      // longitude: this.projectForm.value.longitude || undefined,
    };

    this.projectsService.createProject(projectDto).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Proyecto creado correctamente', 'Cerrar', {
          duration: 2500,
          panelClass: ['success-snackbar']
        });
        this.projectCreated.emit();
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Error al crear el proyecto';
        this.snackBar.open(
          `${this.error || 'Error al crear el proyecto'}`,
          'Cerrar',
          { duration: 3000, panelClass: ['error-snackbar'] }
        );
        console.error('Error al crear el proyecto:', err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
