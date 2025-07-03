import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LucideAngularModule } from 'lucide-angular';

export interface ImageLightboxData {
  images: string[];
  currentIndex: number;
  projectName?: string;
}

@Component({
  selector: 'app-image-lightbox-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LucideAngularModule
  ],
  templateUrl: './image-lightbox-dialog.component.html'
})
export class ImageLightboxDialogComponent implements OnInit {
  currentIndex: number = 0;
  images: string[] = [];
  projectName?: string;

  constructor(
    public dialogRef: MatDialogRef<ImageLightboxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageLightboxData
  ) {}

  ngOnInit(): void {
    this.images = this.data.images;
    this.currentIndex = this.data.currentIndex;
    this.projectName = this.data.projectName;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.previous();
        break;
      case 'ArrowRight':
        this.next();
        break;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  next(): void {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }

  get currentImage(): string {
    return this.images[this.currentIndex] || '';
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }
}
