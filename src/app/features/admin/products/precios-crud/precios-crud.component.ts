import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { PrecioVaso } from '../../../../core/models/product.model';

@Component({
  selector: 'app-precios-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './precios-crud.component.html'
})
export class PreciosCrudComponent {
  private fb = inject(FirebaseService);

  items       = this.fb.allPrecios;
  modalOpen   = signal(false);
  editingItem = signal<PrecioVaso | null>(null);
  saving      = signal(false);

  form = new FormGroup({
    label:     new FormControl('', Validators.required),
    precio:    new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    available: new FormControl(true)
  });

  openCreate(): void {
    this.form.reset({ available: true, label: '', precio: 0 });
    this.editingItem.set(null);
    this.modalOpen.set(true);
  }

  openEdit(item: PrecioVaso): void {
    this.form.patchValue(item);
    this.editingItem.set(item);
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      if (this.editingItem()) {
        await this.fb.update('precios', this.editingItem()!.id, this.form.value);
      } else {
        await this.fb.add('precios', this.form.value);
      }
      this.closeModal();
    } finally { this.saving.set(false); }
  }

  async delete(item: PrecioVaso): Promise<void> {
    if (!confirm(`¿Eliminar "${item.label}"?`)) return;
    await this.fb.delete('precios', item.id);
  }
}
