<<<<<<< HEAD
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Producto, PrecioProducto } from '../../../../core/models/product.model';

@Component({
  selector: 'app-productos-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './productos-crud.component.html',
=======
  templateUrl: './productos-crud.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class ProductosCrudComponent {
  private fb = inject(FirebaseService);

<<<<<<< HEAD
  items = this.fb.allProductos;
  modalOpen = signal(false);
  editingItem = signal<Producto | null>(null);
  saving = signal(false);

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    emoji: new FormControl('🍓', Validators.required),
    available: new FormControl(true),
    orden: new FormControl(1),
    precios: new FormArray<FormGroup>([]),
=======
  items       = this.fb.allProductos;
  modalOpen   = signal(false);
  editingItem = signal<Producto | null>(null);
  saving      = signal(false);

  form = new FormGroup({
    nombre:    new FormControl('', Validators.required),
    emoji:     new FormControl('🍓', Validators.required),
    available: new FormControl(true),
    orden:     new FormControl(1),
    precios:   new FormArray<FormGroup>([])
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  });

  get preciosArray(): FormArray<FormGroup> {
    return this.form.get('precios') as FormArray<FormGroup>;
  }

  private buildPrecioGroup(label = '', precio = 0): FormGroup {
    return new FormGroup({
<<<<<<< HEAD
      label: new FormControl(label, Validators.required),
      precio: new FormControl(precio, [Validators.required, Validators.min(1)]),
=======
      label:  new FormControl(label, Validators.required),
      precio: new FormControl(precio, [Validators.required, Validators.min(1)])
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    });
  }

  openCreate(): void {
    this.form.reset({ available: true, orden: 1, nombre: '', emoji: '🍓' });
    this.preciosArray.clear();
    this.addPrecio();
    this.editingItem.set(null);
    this.modalOpen.set(true);
  }

  openEdit(item: Producto): void {
<<<<<<< HEAD
    this.form.patchValue({
      nombre: item.nombre,
      emoji: item.emoji,
      available: item.available,
      orden: item.orden,
    });
    this.preciosArray.clear();
    (item.precios ?? []).forEach((p) =>
      this.preciosArray.push(this.buildPrecioGroup(p.label, p.precio)),
    );
=======
    this.form.patchValue({ nombre: item.nombre, emoji: item.emoji, available: item.available, orden: item.orden });
    this.preciosArray.clear();
    (item.precios ?? []).forEach(p => this.preciosArray.push(this.buildPrecioGroup(p.label, p.precio)));
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    if (this.preciosArray.length === 0) this.addPrecio();
    this.editingItem.set(item);
    this.modalOpen.set(true);
  }

  addPrecio(): void {
    this.preciosArray.push(this.buildPrecioGroup());
  }

  removePrecio(i: number): void {
    if (this.preciosArray.length > 1) this.preciosArray.removeAt(i);
  }

<<<<<<< HEAD
  closeModal(): void {
    this.modalOpen.set(false);
  }
=======
  closeModal(): void { this.modalOpen.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    const { nombre, emoji, available, orden } = this.form.value;
<<<<<<< HEAD
    const precios: PrecioProducto[] = this.preciosArray.controls.map((g) => ({
      label: g.value.label as string,
      precio: Number(g.value.precio),
=======
    const precios: PrecioProducto[] = this.preciosArray.controls.map(g => ({
      label:  g.value.label  as string,
      precio: Number(g.value.precio)
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    }));
    const data = { nombre, emoji, available, orden, precios };
    try {
      if (this.editingItem()) {
        await this.fb.update('productos', this.editingItem()!.id, data);
      } else {
        await this.fb.add('productos', data);
      }
      this.closeModal();
<<<<<<< HEAD
    } finally {
      this.saving.set(false);
    }
=======
    } finally { this.saving.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  }

  async delete(item: Producto): Promise<void> {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
    await this.fb.delete('productos', item.id);
  }
}
