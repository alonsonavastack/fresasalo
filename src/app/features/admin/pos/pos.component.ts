import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { OfflineSyncService } from '../../../core/services/offline-sync.service';
import { VasoPedido, Topping, Cubierta, PrecioVaso } from '../../../core/models/product.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class PosComponent {
  firebaseService = inject(FirebaseService);
  sync = inject(OfflineSyncService);

  precios = this.firebaseService.precios;
  toppings = this.firebaseService.toppings;
  cubiertas = this.firebaseService.cubiertas;

  preciosOrdenados = computed(() => [...this.precios()].sort((a, b) => a.precio - b.precio));

  cart = signal<VasoPedido[]>([]);
  cartTotal = computed(() => this.cart().reduce((acc, v) => acc + v.precio * v.cantidad, 0));
  cartTotalItems = computed(() => this.cart().reduce((acc, v) => acc + v.cantidad, 0));

  selectedPrecio = signal<PrecioVaso | null>(null);
  selectedToppings = signal<Topping[]>([]);
  selectedCubierta = signal<Cubierta | null>(null);
  combinado = signal<boolean>(false);
  cantidad = signal<number>(1);
  notas = signal<string>('');

  isSaving = signal<boolean>(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  selectPrecio(p: PrecioVaso) {
    this.selectedPrecio.set(p);
  }

  toggleTopping(t: Topping) {
    const current = this.selectedToppings();
    const idx = current.findIndex((x) => x.id === t.id);
    if (idx > -1) {
      this.selectedToppings.set(current.filter((x) => x.id !== t.id));
    } else {
      const max = this.combinado() ? 2 : 1;
      if (current.length >= max) {
        this.showError(`Máximo ${max} topping${max > 1 ? 's' : ''}`);
        return;
      }
      this.selectedToppings.set([...current, t]);
    }
  }

  toggleCombinado() {
    if (this.combinado() && this.selectedToppings().length > 1) {
      this.showError('Deselecciona un topping primero (máx 1 sin combinado)');
      return;
    }
    this.combinado.set(!this.combinado());
  }

  selectCubierta(c: Cubierta | null) {
    this.selectedCubierta.set(c);
  }

  showError(msg: string) {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(''), 3000);
  }

  addToCart() {
    const p = this.selectedPrecio();
    if (!p) return;
    const ts = this.selectedToppings();
    const c = this.selectedCubierta();

    const vaso: VasoPedido = {
      id: crypto.randomUUID(),
      precio: p.precio,
      precioLabel: p.label,
      toppings: ts.map((x) => x.id),
      toppingNames: ts.length > 0 ? ts.map((x) => x.name) : [],
      cubierta: c?.id || '',
      cubiertaName: c?.name || 'Sin cubierta',
      combinado: this.combinado(),
      cantidad: this.cantidad(),
      notas: this.notas(),
    };

    this.cart.update((curr) => [...curr, vaso]);
    this.selectedPrecio.set(null);
    this.selectedToppings.set([]);
    this.selectedCubierta.set(null);
    this.combinado.set(false);
    this.cantidad.set(1);
    this.notas.set('');
  }

  removeFromCart(index: number) {
    this.cart.update((curr) => curr.filter((_, i) => i !== index));
  }

  async checkout() {
    if (this.cart().length === 0) return;
    this.isSaving.set(true);

    try {
      const result = await this.sync.checkout({
        nombreCliente: 'Venta Mostrador',
        telefonoCliente: 'N/A',
        vasos: this.cart(),
        totalVasos: this.cartTotalItems(),
        totalPrecio: this.cartTotal(),
        timestamp: new Date(),
        mensaje: 'Venta registrada desde Punto de Venta',
        status: 'entregado',
      });

      this.cart.set([]);

      if (result.modo === 'online') {
        this.successMessage.set('✅ Venta registrada');
      } else {
        this.successMessage.set('💾 Guardada sin internet — se sincronizará al reconectarse');
      }
      setTimeout(() => this.successMessage.set(''), 4000);
    } catch (e) {
      console.error('Error en checkout:', e);
      this.showError('Error al registrar la venta');
    } finally {
      this.isSaving.set(false);
    }
  }
}
