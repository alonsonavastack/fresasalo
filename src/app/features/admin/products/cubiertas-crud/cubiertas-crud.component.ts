<<<<<<< HEAD
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Cubierta } from '../../../../core/models/product.model';

@Component({
  selector: 'app-cubiertas-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
<<<<<<< HEAD
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
=======
  templateUrl: './cubiertas-crud.component.html'
})
export class CubiertasCrudComponent {
  private fb      = inject(FirebaseService);
  private storage = inject(StorageService);

  items       = this.fb.allCubiertas;
  modalOpen   = signal(false);
  editingItem = signal<Cubierta | null>(null);
  uploading   = signal(false);
  saving      = signal(false);
  uploadMode  = signal<'url' | 'file'>('url');

  form = new FormGroup({
    name:      new FormControl('', Validators.required),
    imageUrl:  new FormControl(''),
    available: new FormControl(true)
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
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

<<<<<<< HEAD
  closeModal(): void {
    this.modalOpen.set(false);
  }
=======
  closeModal(): void { this.modalOpen.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'cubiertas');
      this.form.patchValue({ imageUrl: url });
<<<<<<< HEAD
    } finally {
      this.uploading.set(false);
    }
=======
    } finally { this.uploading.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
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
<<<<<<< HEAD
    } finally {
      this.saving.set(false);
    }
=======
    } finally { this.saving.set(false); }
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  }

  async delete(item: Cubierta): Promise<void> {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    await this.fb.delete('cubiertas', item.id);
  }
}
