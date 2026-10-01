import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Cubierta } from '../../../../core/models/product.model';

@Component({
  selector: 'app-cubiertas-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './cubiertas-crud.component.html',
})
export class CubiertasCrudComponent {
  private fb = inject(FirebaseService);
  private storage = inject(StorageService);

  items = this.fb.allCubiertas;
  modalOpen = signal(false);
  editingItem = signal<Cubierta | null>(null);
  uploading = signal(false);
  saving = signal(false);
  uploadMode = signal<'url' | 'file'>('url');

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    imageUrl: new FormControl(''),
    available: new FormControl(true),
  });

  openCreate(): void {
    this.form.reset({ available: true, name: '', imageUrl: '' });
    this.editingItem.set(null);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  openEdit(item: Cubierta): void {
    this.form.patchValue(item);
    this.editingItem.set(item);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'cubiertas');
      this.form.patchValue({ imageUrl: url });
    } finally {
      this.uploading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      if (this.editingItem()) {
        await this.fb.update('cubiertas', this.editingItem()!.id, this.form.value);
      } else {
        await this.fb.add('cubiertas', this.form.value);
      }
      this.closeModal();
    } finally {
      this.saving.set(false);
    }
  }

  async delete(item: Cubierta): Promise<void> {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    await this.fb.delete('cubiertas', item.id);
  }
}
