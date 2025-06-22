import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si no hay token, simplemente deja pasar la petición sin modificarla.
  if (!token) {
    return next(req);
  }

  // Clona la petición y añade el header de autorización.
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  // Pasa la nueva petición clonada al siguiente manejador.
  return next(authReq);
};
