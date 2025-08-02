import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-gray-700/50 rounded-lg animate-pulse"
      [class]="aspectClass"
      [style.width]="width"
      [style.height]="height">
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ImageSkeletonComponent {
  @Input() aspectRatio: 'square' | 'video' | 'gallery' | 'custom' = 'square';
  @Input() width?: string;
  @Input() height?: string;
  @Input() customAspect?: string;

  get aspectClass(): string {
    switch (this.aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'video':
        return 'aspect-video';
      case 'gallery':
        return 'aspect-[4/3]';
      case 'custom':
        return this.customAspect || 'aspect-square';
      default:
        return 'aspect-square';
    }
  }
}
