<<<<<<< HEAD
import {
  Component,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
=======
import { Component, inject, signal, computed, effect } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  fb = inject(FirebaseService);
  router = inject(Router);
  menuOpen = signal(false);

  pendingCount = computed(
    () => this.fb.allPedidos().filter((p) => (p.status ?? 'pendiente') === 'pendiente').length,
  );

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkAccess(event.urlAfterRedirects);
      });
=======
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  auth     = inject(AuthService);
  fb       = inject(FirebaseService);
  router   = inject(Router);
  menuOpen = signal(false);

  pendingCount = computed(() => this.fb.allPedidos().filter(p => (p.status ?? 'pendiente') === 'pendiente').length);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkAccess(event.urlAfterRedirects);
    });
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

    effect(() => {
      // Re-evaluar acceso cuando el rol se cargue
      this.checkAccess(this.router.url);
    });
  }

  private checkAccess(url: string) {
    const role = this.auth.userRole();
    if (role === 'empleado') {
      const allowed = ['/admin/pedidos', '/admin/pos', '/admin/visitas'];
<<<<<<< HEAD
      const isAllowed = allowed.some((route) => url.includes(route));
=======
      const isAllowed = allowed.some(route => url.includes(route));
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      if (!isAllowed) {
        this.router.navigate(['/admin/pedidos']);
      }
    }
  }

<<<<<<< HEAD
  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
  }
=======
  toggleMenu(): void { this.menuOpen.update(v => !v); }
  closeMenu(): void  { this.menuOpen.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  logout(): void {
    this.auth.logout();
  }
}
