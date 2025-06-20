import { Component, Input, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project.interface';
import { ProjectCategory } from '../../../../core/models/enums';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.component.html',
})
export class DashboardStatsComponent {
  @Input() projects!: Signal<Project[]>;

  private validProjects = computed(() => {
    // Asegurarnos de que el signal exista y filtrar proyectos inválidos
    return this.projects?.() ? this.projects().filter(p => p && p.id) : [];
  });

  get total() {
    return this.validProjects().length;
  }
  get estaciones() {
    return this.validProjects().filter(p => p.category === ProjectCategory.ESTACIONES).length;
  }
  get tiendas() {
    return this.validProjects().filter(p => p.category === ProjectCategory.TIENDAS).length;
  }
  get comerciales() {
    return this.validProjects().filter(p => p.category === ProjectCategory.COMERCIALES).length;
  }
}
