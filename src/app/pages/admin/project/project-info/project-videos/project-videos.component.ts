import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule } from 'lucide-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    CommonModule
  ],
  templateUrl: './project-videos.component.html',
  styleUrl: './project-videos.component.scss'
})
export class ProjectVideosComponent {
  videos: string[] = [];
  videoForm: FormGroup;

  constructor(private sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.videoForm = this.fb.group({
      newVideo: ['']
    });
  }

  handleAddVideo(): void {
    const newVideo = this.videoForm.get('newVideo')?.value;
    if (newVideo?.trim()) {
      this.videos.push(newVideo.trim());
      this.videoForm.reset();
    }
  }

  handleRemoveVideo(index: number): void {
    this.videos.splice(index, 1);
  }

  getSafeUrl(url: string): SafeResourceUrl {
    // Convierte una URL de YouTube en embed y la sanitiza
    const videoId = this.extractVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private extractVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }
}
