import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Debug logs para verificar el interceptor
  console.log('🔐 Auth Interceptor - URL:', req.url);
  console.log('🔐 Auth Interceptor - Token exists:', !!token);
  console.log('🔐 Auth Interceptor - Token value:', token ? `${token.substring(0, 20)}...` : 'null');

  // Si no hay token, simplemente deja pasar la petición sin modificarla.
  if (!token) {
    console.log('🔐 Auth Interceptor - No token, proceeding without auth');
    return next(req);
  }

  // Clona la petición y añade el header de autorización.
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  console.log('🔐 Auth Interceptor - Token added to request');
  console.log('🔐 Auth Interceptor - Headers:', authReq.headers.get('Authorization') ? 'Authorization header set' : 'No Authorization header');

  // Pasa la nueva petición clonada al siguiente manejador.
  return next(authReq);
};
