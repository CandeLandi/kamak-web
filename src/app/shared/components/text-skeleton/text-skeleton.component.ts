import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-gray-700/50 rounded animate-pulse"
      [class]="heightClass"
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
export class TextSkeletonComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom' = 'md';
  @Input() width?: string;
  @Input() height?: string;
  @Input() lines: number = 1;

  get heightClass(): string {
    switch (this.size) {
      case 'xs':
        return 'h-3';
      case 'sm':
        return 'h-4';
      case 'md':
        return 'h-5';
      case 'lg':
        return 'h-6';
      case 'xl':
        return 'h-8';
      case 'custom':
        return '';
      default:
        return 'h-5';
    }
  }
}
