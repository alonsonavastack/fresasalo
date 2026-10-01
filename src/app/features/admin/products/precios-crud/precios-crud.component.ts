<<<<<<< HEAD
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { PrecioVaso } from '../../../../core/models/product.model';

@Component({
  selector: 'app-precios-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './precios-crud.component.html',
=======
  templateUrl: './precios-crud.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class PreciosCrudComponent {
  private fb = inject(FirebaseService);

<<<<<<< HEAD
  items = this.fb.allPrecios;
  modalOpen = signal(false);
  editingItem = signal<PrecioVaso | null>(null);
  saving = signal(false);

  form = new FormGroup({
    label: new FormControl('', Validators.required),
    precio: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    available: new FormControl(true),
=======
  items       = this.fb.allPrecios;
  modalOpen   = signal(false);
  editingItem = signal<PrecioVaso | null>(null);
  saving      = signal(false);

  form = new FormGroup({
    label:     new FormControl('', Validators.required),
    precio:    new FormControl<number>(0, [Validators.required, Validators.min(1)]),
    available: new FormControl(true)
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
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
    try {
      if (this.editingItem()) {
        await this.fb.update('precios', this.editingItem()!.id, this.form.value);
      } else {
        await this.fb.add('precios', this.form.value);
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

  async delete(item: PrecioVaso): Promise<void> {
    if (!confirm(`¿Eliminar "${item.label}"?`)) return;
    await this.fb.delete('precios', item.id);
  }
}
