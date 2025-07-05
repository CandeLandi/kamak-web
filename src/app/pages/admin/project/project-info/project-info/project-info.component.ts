import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GooglePlaceAutocompleteComponent } from '../../../../../shared/components/google-place-autocomplete/google-place-autocomplete.component';
import { AuthService } from '../../../../../core/services/auth.service';
import { CreateProjectDto, Project, UpdateProjectDto } from '../../../interfaces/project.interface';
import { LucideAngularModule } from 'lucide-angular';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCategory, ProjectStatus, ProjectType } from '../../../../../core/models/enums';
import { ProjectsService } from '../../../../../core/services/projects.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    LucideAngularModule,
    MatDatepickerModule,
    MatMomentDateModule,
    GooglePlaceAutocompleteComponent
  ],
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ProjectInfoComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  @Input() projectId: string | null = null;
  @Input() isEditMode = false;
  @Output() projectCreated = new EventEmitter<Project>();

  projectForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  projectCategories = ProjectCategory;
  projectStatus = ProjectStatus;
  expandedPanel: string | null = null;
  showOnHomePage: boolean = true;

  ngOnInit(): void {
    this.initForm();
    if (this.projectId) {
      this.projectsService.getProjectById(this.projectId).subscribe({
        next: (project: Project) => {
          const startDate = project.startDate ? new Date(project.startDate) : null;
          const endDate = project.endDate ? new Date(project.endDate) : null;

          this.projectForm.patchValue({
            name: project.name,
            category: project.category,
            description: project.description,
            longDescription: project.longDescription,
            imageBefore: project.imageBefore || '',
            imageAfter: project.imageAfter || '',
            videoUrl: project.videoUrl || '',
            address: project.address,
            area: typeof project.area === 'string' ? project.area.replace(/\s*m²$/, '').trim() : project.area,
            startDate: startDate,
            endDate: endDate,
            duration: project.duration,
            challenge: project.challenge,
            solution: project.solution,
            status: project.status,
          });
          this.showOnHomePage = project.status === ProjectStatus.PUBLISHED;
        },
        error: () => {
          this.error = 'Error al cargar el proyecto';
          this.snackBar.open(this.error ? this.error : 'Error al cargar el proyecto', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.showOnHomePage = this.projectForm.get('status')?.value === ProjectStatus.PUBLISHED;
    }
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
      address: [null, Validators.required],
      area: ['', Validators.required],
      startDate: [null],
      endDate: [null],
      duration: [{ value: '', disabled: true }],
      challenge: ['', [Validators.required, Validators.minLength(20)]],
      solution: ['', [Validators.required, Validators.minLength(20)]],
      status: [ProjectStatus.PUBLISHED],
      type: [ProjectType.LANDING],
      contactName: [''],
      contactPhone: [''],
      contactEmail: [''],
      budget: [''],
      invoiceStatus: [''],
      notes: [''],
    });

    // Calcular duración automáticamente
    this.projectForm.get('startDate')?.valueChanges.subscribe(() => this.updateDuration());
    this.projectForm.get('endDate')?.valueChanges.subscribe(() => this.updateDuration());
  }

  private updateDuration(): void {
    const start = this.projectForm.get('startDate')?.value;
    const end = this.projectForm.get('endDate')?.value;
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const durationText = diffDays > 0 ? `${diffDays} días` : '0 días';
      this.projectForm.get('duration')?.setValue(durationText, { emitEvent: false });
    } else {
      this.projectForm.get('duration')?.setValue('', { emitEvent: false });
    }
  }

  formatArea(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Eliminar cualquier caracter que no sea número
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  private getFormattedArea(value: string | number): string {
    if (!value) return '';
    // Convertir a string si es número
    const stringValue = value.toString();
    // Eliminar "m²" si ya existe y cualquier espacio
    const numericValue = stringValue.replace(/m²/g, '').trim();
    return `${numericValue} m²`;
  }

  isPublished(): boolean {
    return this.showOnHomePage;
  }

  toggleStatus(): void {
    this.showOnHomePage = !this.showOnHomePage;
    const newStatus = this.showOnHomePage ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT;
    this.projectForm.patchValue({ status: newStatus });
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

    const formValue = this.projectForm.getRawValue();
    formValue.area = this.getFormattedArea(formValue.area);

    if (this.projectId) {
      // --- MODO EDICIÓN ---
      const updateDto: UpdateProjectDto = {
        name: formValue.name,
        category: formValue.category,
        description: formValue.description,
        longDescription: formValue.longDescription,
        address: formValue.address,
        area: formValue.area,
        duration: formValue.duration,
        challenge: formValue.challenge,
        solution: formValue.solution,
        status: this.showOnHomePage ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
        startDate: formValue.startDate,
        endDate: formValue.endDate
    };

      console.log('Enviando para actualizar:', updateDto);

      this.projectsService.updateProject(this.projectId, updateDto).subscribe({
      next: () => {
        this.isSubmitting = false;
          this.snackBar.open('Proyecto actualizado correctamente', 'Cerrar', {
          duration: 2500,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.message || 'Error al actualizar el proyecto';
          this.snackBar.open(
            `${this.error || 'Error al actualizar el proyecto'}`,
            'Cerrar',
            { duration: 3000, panelClass: ['error-snackbar'] }
          );
          console.error('Error al actualizar el proyecto:', err);
        }
      });
    } else {
      // --- MODO CREACIÓN ---
      const createDto: CreateProjectDto = {
        name: formValue.name,
        category: formValue.category,
        description: formValue.description,
        longDescription: formValue.longDescription,
        address: formValue.address,
        area: formValue.area,
        duration: formValue.duration,
        challenge: formValue.challenge,
        solution: formValue.solution,
        status: this.showOnHomePage ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        clientId: clientId
      };

      this.projectsService.createProject(createDto).subscribe({
        next: (newProject) => {
          this.isSubmitting = false;
          this.snackBar.open('Proyecto creado correctamente. Ahora puedes añadir imágenes.', 'Cerrar', {
            duration: 3500,
            panelClass: ['success-snackbar']
          });
          this.projectCreated.emit(newProject);
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
