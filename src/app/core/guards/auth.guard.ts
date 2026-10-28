import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Garantiza sesión activa directa con credenciales configuradas
  const user = await auth.ensureAuthenticated();
  if (!user) {
    // Si no hay usuario y no se pudo autenticar, redirigir al login
    return router.createUrlTree(['/admin/login']);
  }

  const role = await auth.waitForRole();
  if (role === 'inactivo') {
    await auth.logout();
    return router.createUrlTree(['/admin/login']);
  }

  return true;
};
