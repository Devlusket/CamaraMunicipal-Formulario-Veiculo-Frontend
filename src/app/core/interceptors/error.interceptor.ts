import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    timeout(60000),
    catchError((err) => {
      if (err.name === 'TimeoutError') {
        toastService.show('O servidor demorou para responder. Aguarde e tente novamente.', 'error');
      } else if (err.status === 0) {
        toastService.show('Sem conexão com o servidor.', 'error');
      } else if (err.status === 500) {
        toastService.show('Erro interno do servidor. Tente novamente.', 'error');
      } else if (err.status === 401 && req.url.includes('/api/admin')) {
        router.navigate(['/admin/login']);
      }
      return throwError(() => err);
    })
  );
};