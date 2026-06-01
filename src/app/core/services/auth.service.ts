import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../pages/admin/interfaces/user.interface';
import { signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';
  private readonly KAMAK_CLIENT_ID = '78abe353-1728-49b0-b268-1d2ad5786317';

  public clientIdSignal: WritableSignal<string | null> = signal(this.getClientId());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string; user: User }> {
    return this.http.post<{ access_token: string; user: User }>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(res => {
        if (res.access_token) {
          localStorage.setItem(this.TOKEN_KEY, res.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          this.clientIdSignal.set(res.user.clientId || null);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.clientIdSignal.set(null);
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
    if (user?.clientId) {
      return user.clientId;
    }

    return user?.role === 'ADMIN' ? this.KAMAK_CLIENT_ID : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
