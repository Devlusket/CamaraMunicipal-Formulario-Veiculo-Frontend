import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const credenciais = authService.getCredenciais();

  if (req.url.includes('/api/admin') && credenciais) {
    const token = btoa(`${credenciais.username}:${credenciais.password}`);
    const authReq = req.clone({
      setHeaders: { Authorization: `Basic ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};