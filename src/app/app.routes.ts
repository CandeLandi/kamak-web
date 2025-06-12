import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { LandingProjectComponent } from './pages/landing-project/landing-project.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProjectComponent } from './pages/admin/project/project.component';
import { AuthGuard } from './pages/admin/guards/auth.guard';



export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { animation: 'fade' }
  },
  {
    path: 'admin/login',
    component: LoginComponent,
    data: { animation: 'fade' }
  },
  {
    path: 'proyecto/:id',
    component: LandingProjectComponent,
    data: { animation: 'fade' }
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { animation: 'fade' }
  },
  {
    path: 'admin/project/:id',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: { animation: 'fade' }
  },
  {
    path: 'admin/project',
    component: ProjectComponent,
    canActivate: [AuthGuard],
    data: { animation: 'fade' }
  }
];
