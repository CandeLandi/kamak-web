import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../interfaces/project.interface';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.component.html',
})
export class DashboardStatsComponent {
  @Input() projects!: Signal<Project[]>;

  get total() {
    return this.projects?.() ? this.projects().length : 0;
  }
  get estaciones() {
    return this.projects?.() ? this.projects().filter(p => (p as any).category === 'estaciones').length : 0;
  }
  get tiendas() {
    return this.projects?.() ? this.projects().filter(p => (p as any).category === 'tiendas').length : 0;
  }
  get comerciales() {
    return this.projects?.() ? this.projects().filter(p => (p as any).category === 'comerciales').length : 0;
  }
}
