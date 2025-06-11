import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return of(true);
    }

    this.router.navigate(['/admin/login']);
    return of(false);
  }
}
