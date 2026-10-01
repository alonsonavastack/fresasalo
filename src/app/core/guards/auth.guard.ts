import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  // Espera a que Firebase resuelva el estado real de sesión antes de decidir
  const user = await auth.waitForAuth();
  if (!user) return router.createUrlTree(['/admin/login']);

  const role = await auth.waitForRole();
  if (role === 'inactivo') {
    auth.logout(); // Opcional, forzar cierre si está inactivo
    return router.createUrlTree(['/admin/login']);
  }

  return true;
};
