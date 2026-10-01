<<<<<<< HEAD
import {
  Component,
  inject,
  signal,
  effect,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
=======
import { Component, inject, signal, effect, untracked } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './configuraciones.component.html',
=======
  templateUrl: './configuraciones.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class ConfiguracionesComponent {
  public fb = inject(FirebaseService);

  direccion = signal<string>('');
<<<<<<< HEAD
  telefono = signal<string>('');
  horario = signal<string>('');
  dias = signal<string>('');
  saving = signal<boolean>(false);
=======
  telefono  = signal<string>('');
  horario   = signal<string>('');
  dias      = signal<string>('');
  saving    = signal<boolean>(false);
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  showSuccess = signal<boolean>(false);

  private dataLoaded = false;

  constructor() {
    effect(() => {
      const current = this.fb.contactInfo();
      untracked(() => {
<<<<<<< HEAD
        if (
          !this.dataLoaded &&
          (current.direccion || current.telefono || current.horario || current.dias)
        ) {
          this.direccion.set(current.direccion || '');
          this.telefono.set(current.telefono || '');
          this.horario.set(current.horario || '');
          this.dias.set(current.dias || '');
=======
        if (!this.dataLoaded && (current.direccion || current.telefono || current.horario || current.dias)) {
          this.direccion.set(current.direccion || '');
          this.telefono.set(current.telefono   || '');
          this.horario.set(current.horario     || '');
          this.dias.set(current.dias           || '');
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
          this.dataLoaded = true;
        }
      });
    });
  }

  async save() {
    this.saving.set(true);
    try {
      await this.fb.saveContactInfo({
        direccion: this.direccion(),
<<<<<<< HEAD
        telefono: this.telefono(),
        horario: this.horario(),
        dias: this.dias(),
=======
        telefono:  this.telefono(),
        horario:   this.horario(),
        dias:      this.dias()
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
      });
      this.showSuccess.set(true);
      setTimeout(() => this.showSuccess.set(false), 3000);
    } catch (e) {
      console.error('Error guardando configuraciones', e);
      alert('Error al guardar las configuraciones');
    } finally {
      this.saving.set(false);
    }
  }
}
