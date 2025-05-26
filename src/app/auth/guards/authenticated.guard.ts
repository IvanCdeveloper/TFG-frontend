import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const AuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const notify = inject(NotificationService);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());


  if (!isAuthenticated) {
    notify.show('Acceso denegado. Debe iniciar sesión.');
    router.navigateByUrl('/auth/login');
    return false;

  }




  return true;
}
