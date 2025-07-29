import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lazy-youtube-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full">
      <!-- Placeholder con thumbnail -->
      <div 
        *ngIf="!isLoaded" 
        class="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer"
        (click)="loadVideo()"
      >
        <div class="text-center">
          <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p class="text-white text-sm">Haz clic para reproducir</p>
        </div>
      </div>
      
      <!-- Video real -->
      <iframe 
        *ngIf="isLoaded && safeUrl" 
        [src]="safeUrl"
        class="w-full h-full rounded-lg"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        [title]="'Video de YouTube - ' + (youtubeUrl || '')">
      </iframe>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class LazyYoutubeVideoComponent implements OnInit {
  @Input() youtubeUrl: string = '';
  @Input() startTime: number = 0;
  
  isLoaded = false;
  safeUrl: SafeResourceUrl | null = null;
  
  private sanitizer = inject(DomSanitizer);
  
  ngOnInit() {
    // No cargar automáticamente, solo cuando el usuario haga clic
  }
  
  loadVideo() {
    if (!this.youtubeUrl) return;
    
    const videoId = this.extractVideoId(this.youtubeUrl);
    if (!videoId) return;
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${this.startTime}&autoplay=1`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.isLoaded = true;
  }
  
  private extractVideoId(url: string): string | null {
    const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }
}