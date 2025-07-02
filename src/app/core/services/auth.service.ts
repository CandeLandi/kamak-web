import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../pages/admin/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{ access_token: string; user: User }>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(res => {
        if (res.access_token) {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getClientId(): string | null {
    const user = this.getUser();
    return user?.clientId || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Método de debug para verificar el estado de autenticación
  debugAuthStatus(): void {
    const token = this.getToken();
    const user = this.getUser();
    console.log('🔐 Auth Debug - Token exists:', !!token);
    console.log('🔐 Auth Debug - Token value:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('🔐 Auth Debug - User exists:', !!user);
    console.log('🔐 Auth Debug - User:', user);
    console.log('🔐 Auth Debug - Client ID:', this.getClientId());
  }
}
