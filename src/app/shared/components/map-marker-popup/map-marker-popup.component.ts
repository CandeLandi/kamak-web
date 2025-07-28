import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-marker-popup',
  templateUrl: './map-marker-popup.component.html',
  standalone: true
})
export class MapMarkerPopupComponent {
  @Input() title!: string;
  @Input() address!: string;
  @Input() imageAfter?: string;
  @Input() projectId?: string;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigateToProject() {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    }
  }

  closePopup() {
    this.close.emit();
  }
}
