import { Component, input, output, signal, effect, computed, untracked } from '@angular/core';
import { Topping, Cubierta, PrecioVaso, VasoPedido } from '../../../core/models/product.model';

@Component({
  selector: 'app-vaso-card',
  standalone: true,
  imports: [],
  templateUrl: './vaso-card.component.html'
})
export class VasoCardComponent {
  vaso      = input.required<VasoPedido>();
  index     = input<number>(0);
  toppings  = input<Topping[]>([]);
  cubiertas = input<Cubierta[]>([]);
  precios   = input<PrecioVaso[]>([]);

  vasoChange = output<VasoPedido>();
  remove     = output<void>();

  selectedPrecio      = signal<number>(0);
  selectedPrecioLabel = signal<string>('');
  selectedToppings    = signal<string[]>([]);
  selectedCubierta    = signal<string>('');
  combinado           = signal<boolean>(false);
  cantidad            = signal<number>(1);
  notas               = signal<string>('');

  // Precios ordenados de menor a mayor
  preciosOrdenados = computed(() =>
    [...this.precios()].sort((a, b) => a.precio - b.precio)
  );

  // Límite de toppings según combinado
  maxToppings = computed(() => this.combinado() ? 2 : 1);

  constructor() {
    effect(() => {
      const v = this.vaso();
      untracked(() => {
        this.selectedPrecio.set(v.precio);
        this.selectedPrecioLabel.set(v.precioLabel ?? '');
        this.selectedToppings.set([...v.toppings]);
        this.selectedCubierta.set(v.cubierta);
        this.combinado.set(v.combinado);
        this.cantidad.set(v.cantidad);
        this.notas.set(v.notas);
      });
    });
  }

  setPrecio(precio: number, label: string): void {
    this.selectedPrecio.set(precio);
    this.selectedPrecioLabel.set(label);
    this.emitChange();
  }

  toggleTopping(id: string): void {
    const current = this.selectedToppings();
    if (current.includes(id)) {
      this.selectedToppings.set(current.filter(t => t !== id));
    } else {
      if (current.length < this.maxToppings()) {
        this.selectedToppings.set([...current, id]);
      }
    }
    this.emitChange();
  }

  setCubierta(id: string): void {
    this.selectedCubierta.set(id);
    this.emitChange();
  }

  toggleCombinado(): void {
    this.combinado.update(v => !v);
    if (!this.combinado()) {
      const current = this.selectedToppings();
      if (current.length > 1) this.selectedToppings.set(current.slice(0, 1));
    }
    this.emitChange();
  }

  onCantidadChange(event: Event): void {
    this.cantidad.set(Math.max(1, Number((event.target as HTMLInputElement).value)));
    this.emitChange();
  }

  onNotasInput(event: Event): void {
    this.notas.set((event.target as HTMLTextAreaElement).value);
    this.emitChange();
  }

  emitChange(): void {
    const toppingIds   = this.selectedToppings();
    const cubiertaId   = this.selectedCubierta();
    const toppingNames = toppingIds.map(id => this.toppings().find(t => t.id === id)?.name ?? id);
    const cubiertaName = this.cubiertas().find(c => c.id === cubiertaId)?.name ?? 'Sin cubierta';

    this.vasoChange.emit({
      id:          this.vaso().id,
      precio:      this.selectedPrecio(),
      precioLabel: this.selectedPrecioLabel(),
      toppings:    toppingIds,
      toppingNames,
      cubierta:    cubiertaId,
      cubiertaName,
      combinado:   this.combinado(),
      cantidad:    this.cantidad(),
      notas:       this.notas()
    });
  }

  isToppingSelected(id: string): boolean {
    return this.selectedToppings().includes(id);
  }

  isToppingDisabled(id: string): boolean {
    return !this.isToppingSelected(id) && this.selectedToppings().length >= this.maxToppings();
  }
}
