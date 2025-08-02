import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-skeleton.component.html',
  styleUrls: ['./project-skeleton.component.scss']
})
export class ProjectSkeletonComponent {
  @Input() showGallery: boolean = true;
  @Input() showVideos: boolean = true;
  @Input() showBeforeAfter: boolean = true;
}
