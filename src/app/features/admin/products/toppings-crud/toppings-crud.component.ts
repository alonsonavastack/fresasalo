import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Topping } from '../../../../core/models/product.model';

@Component({
  selector: 'app-toppings-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './toppings-crud.component.html'
})
export class ToppingsCrudComponent {
  private fb      = inject(FirebaseService);
  private storage = inject(StorageService);

  items       = this.fb.allToppings;
  modalOpen   = signal(false);
  editingItem = signal<Topping | null>(null);
  uploading   = signal(false);
  saving      = signal(false);
  uploadMode  = signal<'url' | 'file'>('url');

  form = new FormGroup({
    name:      new FormControl('', Validators.required),
    imageUrl:  new FormControl(''),
    available: new FormControl(true),
    popular:   new FormControl(false),
    order:     new FormControl(1)
  });

  openCreate(): void {
    this.form.reset({ available: true, popular: false, order: 1, name: '', imageUrl: '' });
    this.editingItem.set(null);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  openEdit(item: Topping): void {
    this.form.patchValue(item);
    this.editingItem.set(item);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  closeModal(): void { this.modalOpen.set(false); }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'toppings');
      this.form.patchValue({ imageUrl: url });
    } finally { this.uploading.set(false); }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      if (this.editingItem()) {
        await this.fb.update('toppings', this.editingItem()!.id, this.form.value);
      } else {
        await this.fb.add('toppings', this.form.value);
      }
      this.closeModal();
    } finally { this.saving.set(false); }
  }

  async delete(item: Topping): Promise<void> {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    await this.fb.delete('toppings', item.id);
  }
}
