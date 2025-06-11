import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-project-images',
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
    CommonModule
  ],
  templateUrl: './project-images.component.html',
  styleUrl: './project-images.component.scss'
})
export class ProjectImagesComponent {
  before: string = '';
  after: string = '';
  gallery: string[] = [];

  handleImageBeforeChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.before = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handleImageAfterChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.after = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  handleGalleryImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.gallery.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  handleRemoveGalleryImage(index: number): void {
    this.gallery.splice(index, 1);
  }

  handleRemoveImage(type: 'before' | 'after'): void {
    if (type === 'before') this.before = '';
    if (type === 'after') this.after = '';
  }
}
