import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../../../shared/admin-header/admin-header.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { ProjectImagesComponent } from './project-info/project-images/project-images.component';
import { ProjectVideosComponent } from './project-info/project-videos/project-videos.component';
import { ProjectInfoComponent } from "./project-info/project-info/project-info.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    AdminHeaderComponent,
    RouterModule,
    MatTabsModule,
    LucideAngularModule,
    ProjectImagesComponent,
    ProjectVideosComponent,
    ProjectInfoComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected selectedTabIndex = 0;
  protected activeTab = 'info';
  protected projectId: string | null = null;
  protected isEditMode = false;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;
  }

  protected onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.activeTab = ['info', 'images', 'videos'][index];
  }

  protected setActiveTab(tab: string): void {
    const idx = ['info', 'images', 'videos'].indexOf(tab);
    if (idx !== -1) {
      this.selectedTabIndex = idx;
      this.activeTab = tab;
    }
  }

  protected handleLogout(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
