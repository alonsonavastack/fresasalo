import { Component, inject, computed, signal } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
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
      const d = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      return d.toDateString() === today.toDateString();
    }).length;
  });

  visitsSemana = computed(() => {
    const hoy = new Date().getTime();
    const hace7dias = hoy - (7 * 24 * 60 * 60 * 1000);
    return this.fb.allPedidos().filter(p => {
      const ts = p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
      return ts >= hace7dias;
    }).length;
  });

  visitsMes = computed(() => {
    const hoy = new Date().getTime();
    const hace30dias = hoy - (30 * 24 * 60 * 60 * 1000);
    return this.fb.allPedidos().filter(p => {
      const ts = p.timestamp instanceof Date ? p.timestamp.getTime() : new Date(p.timestamp).getTime();
      return ts >= hace30dias;
    }).length;
  });

  totalPedidos = computed(() => this.fb.allPedidos().length);
  pedidosHoy   = computed(() => {
    const hoy = new Date();
    return this.fb.allPedidos().filter(p => {
      const d = p.timestamp instanceof Date ? p.timestamp : new Date(p.timestamp);
      return d.toDateString() === hoy.toDateString();
    }).length;
  });
  pedidosPendientes = computed(() =>
    this.fb.allPedidos().filter(p => (p.status ?? 'pendiente') === 'pendiente').length
  );

  // Logo
  logoUrl       = this.fb.logoUrl;
  uploadingLogo = signal(false);
  logoUrlInput  = signal('');
  logoMode      = signal<'url' | 'file'>('url');

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
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=https://fresaconcrema.netlify.app';
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
