import { Injectable, signal, computed } from '@angular/core';
import { VasoPedido } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  nombreCliente   = signal<string>('');
  telefonoCliente = signal<string>('');
  vasos = signal<VasoPedido[]>([]);

  totalVasos = computed(() =>
    this.vasos().reduce((sum, v) => sum + v.cantidad, 0)
  );

  totalPrecio = computed(() =>
    this.vasos().reduce((sum, v) => sum + v.precio * v.cantidad, 0)
  );

  // Requiere al menos 10 dígitos (número mexicano sin lada de país).
  // Se limpia cualquier espacio, guión o paréntesis antes de contar.
  telefonoValido = computed(() =>
    this.telefonoCliente().replace(/\D/g, '').length >= 10
  );

  hasVasos = computed(() =>
    this.vasos().length > 0 &&
    this.vasos().every(v => v.precio > 0) &&
    this.nombreCliente().trim().length > 0 &&
    this.telefonoValido()
  );

  addVaso(): void {
    const newVaso: VasoPedido = {
      id: crypto.randomUUID(),
      precio: 0,
      precioLabel: '',
      toppings: [],
      toppingNames: [],
      cubierta: '',
      cubiertaName: '',
      combinado: false,
      cantidad: 1,
      notas: ''
    };
    this.vasos.update(v => [...v, newVaso]);
  }

  updateVaso(updated: VasoPedido): void {
    this.vasos.update(vasos =>
      vasos.map(v => (v.id === updated.id ? updated : v))
    );
  }

  removeVaso(id: string): void {
    this.vasos.update(vasos => vasos.filter(v => v.id !== id));
  }

  reset(): void {
    this.vasos.set([]);
    this.nombreCliente.set('');
    this.telefonoCliente.set('');
  }
}
