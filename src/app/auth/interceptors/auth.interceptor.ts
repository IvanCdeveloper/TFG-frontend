
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  // rutas públicas que no requieren token
  const publicPaths = ['/auth/login', '/auth/register'];

  // si la URL coincide, no toques los headers:
  if (publicPaths.some(path => req.url.includes(path))) {
    return next(req);
  }

  const token = inject(AuthService).token();
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  })




  return next(newReq);
}
