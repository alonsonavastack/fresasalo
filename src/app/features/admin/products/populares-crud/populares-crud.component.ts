import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ProductoPopular, PrecioVaso } from '../../../../core/models/product.model';

@Component({
  selector: 'app-populares-crud',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './populares-crud.component.html',
})
export class PopularesCrudComponent {
  private fb = inject(FirebaseService);
  private storage = inject(StorageService);

  items = this.fb.allPopulares;
  allPrecios = this.fb.allPrecios;
  modalOpen = signal(false);
  editingItem = signal<ProductoPopular | null>(null);
  uploading = signal(false);
  saving = signal(false);
  uploadMode = signal<'url' | 'file'>('url');

  // IDs de precios seleccionados en el modal (manejado aparte del FormGroup)
  selectedPreciosIds = signal<string[]>([]);

  // Texto de precios para mostrar en la tabla por cada producto
  preciosTexto(item: ProductoPopular): string {
    const ids = item.preciosIds ?? [];
    if (ids.length === 0) return '—';
    const precios = this.allPrecios()
      .filter((p) => ids.includes(p.id))
      .sort((a, b) => a.precio - b.precio);
    return precios.map((p) => `${p.label} $${p.precio}`).join(' · ');
  }

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    imageUrl: new FormControl(''),
    visible: new FormControl(true),
    orden: new FormControl(1),
  });

  openCreate(): void {
    this.form.reset({ visible: true, nombre: '', descripcion: '', imageUrl: '', orden: 1 });
    this.selectedPreciosIds.set([]);
    this.editingItem.set(null);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  openEdit(item: ProductoPopular): void {
    this.form.patchValue(item);
    this.selectedPreciosIds.set([...(item.preciosIds ?? [])]);
    this.editingItem.set(item);
    this.uploadMode.set('url');
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  togglePrecio(id: string): void {
    const current = this.selectedPreciosIds();
    if (current.includes(id)) {
      this.selectedPreciosIds.set(current.filter((p) => p !== id));
    } else {
      this.selectedPreciosIds.set([...current, id]);
    }
  }

  isPrecioSelected(id: string): boolean {
    return this.selectedPreciosIds().includes(id);
  }

  async onFileChange(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploading.set(true);
    try {
      const url = await this.storage.uploadImage(file, 'populares');
      this.form.patchValue({ imageUrl: url });
    } finally {
      this.uploading.set(false);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid) return;
    this.saving.set(true);
    try {
      const data = { ...this.form.value, preciosIds: this.selectedPreciosIds() };
      if (this.editingItem()) {
        await this.fb.update('populares', this.editingItem()!.id, data);
      } else {
        await this.fb.add('populares', data);
      }
      this.closeModal();
    } finally {
      this.saving.set(false);
    }
  }

  async delete(item: ProductoPopular): Promise<void> {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
    await this.fb.delete('populares', item.id);
  }
}
