import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'img-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-full w-full overflow-hidden group border border-white/20 rounded-lg bg-black">
      <div class="flex transition-transform duration-500 h-full w-full" [style.transform]="'translateX(-' + (currentIndex * 100) + '%)'">
        @for (image of images; track image) {
          <div class="min-w-full h-full flex items-center justify-center">
            <img [src]="image" [alt]="'Service image'" class="w-full h-full object-cover">
          </div>
        }
      </div>
      <!-- Flecha izquierda -->
      <button
        type="button"
        class="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full shadow transition-opacity duration-200 opacity-0 group-hover:opacity-100 border border-white/20 z-10"
        (click)="prev()"
        [disabled]="currentIndex === 0"
        aria-label="Anterior"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <!-- Flecha derecha -->
      <button
        type="button"
        class="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full shadow transition-opacity duration-200 opacity-0 group-hover:opacity-100 border border-white/20 z-10"
        (click)="next()"
        [disabled]="currentIndex === images.length - 1"
        aria-label="Siguiente"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        @for (image of images; track image; let i = $index) {
          <button
            class="w-2 h-2 rounded-full transition-colors duration-200 border border-white/30"
            [class.bg-white]="currentIndex === i"
            [class.bg-gray-400]="currentIndex !== i"
            (click)="setCurrentIndex(i)">
          </button>
        }
      </div>
    </div>
  `,
  styles: []
})
export class ImgCarouselComponent {
  @Input() images: string[] = [];
  @Input() height: number = 250;
  currentIndex = 0;

  setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }
}
