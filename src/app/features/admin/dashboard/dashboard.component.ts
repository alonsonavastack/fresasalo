<<<<<<< HEAD
import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, computed, signal } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FirebaseService } from '../../../core/services/firebase.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private fb = inject(FirebaseService);
  private storage = inject(StorageService);

  totalToppings = computed(() => this.fb.allToppings().length);
  activeToppings = computed(() => this.fb.allToppings().filter((t) => t.available).length);
  totalCubiertas = computed(() => this.fb.allCubiertas().length);
  totalPrecios = computed(() => this.fb.allPrecios().length);
  totalPopulares = computed(() => this.fb.allPopulares().length);

  // Analytics - contamos las visitas reales desde la colección `visits`
  // (el contador agregado en config/stats no es confiable para visitantes
  // anónimos, ver firebase.service.ts → incrementVisit).
  visitsTotal = computed(() => this.fb.allVisitas().length);

  visitsHoy = computed(() => {
    const today = new Date();
    return this.fb.allPedidos().filter((p) => {
=======
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private fb      = inject(FirebaseService);
  private storage = inject(StorageService);

  totalToppings  = computed(() => this.fb.allToppings().length);
  activeToppings = computed(() => this.fb.allToppings().filter(t => t.available).length);
  totalCubiertas = computed(() => this.fb.allCubiertas().length);
  totalPrecios   = computed(() => this.fb.allPrecios().length);
  totalPopulares = computed(() => this.fb.allPopulares().length);

  // Analytics - leyendo las visitas reales desde statsVisits
  visitsTotal = computed(() => this.fb.statsVisits());

  visitsHoy = computed(() => {
    const today = new Date();
    return this.fb.allPedidos().filter(p => {
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      const d = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      return d.toDateString() === today.toDateString();
    }).length;
  });

  visitsSemana = computed(() => {
    const hoy = new Date().getTime();
<<<<<<< HEAD
    const hace7dias = hoy - 7 * 24 * 60 * 60 * 1000;
    return this.fb.allPedidos().filter((p) => {
      const ts =
        p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
=======
    const hace7dias = hoy - (7 * 24 * 60 * 60 * 1000);
    return this.fb.allPedidos().filter(p => {
      const ts = p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      return ts >= hace7dias;
    }).length;
  });

  visitsMes = computed(() => {
    const hoy = new Date().getTime();
<<<<<<< HEAD
    const hace30dias = hoy - 30 * 24 * 60 * 60 * 1000;
    return this.fb.allPedidos().filter((p) => {
      const ts =
        p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
=======
    const hace30dias = hoy - (30 * 24 * 60 * 60 * 1000);
    return this.fb.allPedidos().filter(p => {
      const ts = p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      return ts >= hace30dias;
    }).length;
  });

  totalPedidos = computed(() => this.fb.allPedidos().length);
<<<<<<< HEAD
  pedidosHoy = computed(() => {
    const hoy = new Date();
    return this.fb.allPedidos().filter((p) => {
=======
  pedidosHoy   = computed(() => {
    const hoy = new Date();
    return this.fb.allPedidos().filter(p => {
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      const d = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      return d.toDateString() === hoy.toDateString();
    }).length;
  });
<<<<<<< HEAD
  pedidosPendientes = computed(
    () => this.fb.allPedidos().filter((p) => (p.status ?? 'pendiente') === 'pendiente').length,
  );

  // Logo
  logoUrl = this.fb.logoUrl;
  uploadingLogo = signal(false);
  logoUrlInput = signal('');
  logoMode = signal<'url' | 'file'>('url');
=======
  pedidosPendientes = computed(() =>
    this.fb.allPedidos().filter(p => (p.status ?? 'pendiente') === 'pendiente').length
  );

  // Logo
  logoUrl       = this.fb.logoUrl;
  uploadingLogo = signal(false);
  logoUrlInput  = signal('');
  logoMode      = signal<'url' | 'file'>('url');
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  async onLogoFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadingLogo.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'branding');
      await this.fb.saveLogo(url);
    } finally {
      this.uploadingLogo.set(false);
    }
  }

  async saveLogoUrl(): Promise<void> {
    const url = this.logoUrlInput().trim();
    if (!url) return;
    await this.fb.saveLogo(url);
    this.logoUrlInput.set('');
  }

  onLogoUrlInput(event: Event): void {
    this.logoUrlInput.set((event.target as HTMLInputElement).value);
  }

  async exportQR(): Promise<void> {
<<<<<<< HEAD
    const url =
      'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://fresaconcrema.netlify.app';
=======
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://fresaconcrema.netlify.app';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = 'QR_FresasALO.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error('Error al descargar QR', e);
      window.open(url, '_blank');
    }
  }
}
