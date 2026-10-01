<<<<<<< HEAD
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, signal, computed } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseCoreService } from '../../../core/services/firebase-core.service';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Role, Usuario } from '../../../core/models/product.model';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [ReactiveFormsModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './empleados.component.html',
=======
  templateUrl: './empleados.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class EmpleadosComponent {
  auth = inject(AuthService);
  fbCore = inject(FirebaseCoreService);
  fbBuilder = inject(FormBuilder);

  empleados = signal<Usuario[]>([]);
  loading = signal<boolean>(true);
  error = signal<string>('');

  modalOpen = signal(false);
  saving = signal(false);

  form: FormGroup = this.fbBuilder.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
<<<<<<< HEAD
    password: ['', [Validators.required, Validators.minLength(6)]],
=======
    password: ['', [Validators.required, Validators.minLength(6)]]
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  });

  constructor() {
    this.loadEmpleados();
  }

  async loadEmpleados() {
    this.loading.set(true);
    try {
      const q = query(collection(this.fbCore.db, 'usuarios'));
      const querySnapshot = await getDocs(q);
      const list: Usuario[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
<<<<<<< HEAD
        if (data['role'] !== 'admin') {
          // No mostrar otros admins
=======
        if (data['role'] !== 'admin') { // No mostrar otros admins
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
          list.push({
            id: docSnap.id,
            nombre: data['nombre'],
            email: data['email'],
<<<<<<< HEAD
            role: data['role'] as Role,
=======
            role: data['role'] as Role
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
          });
        }
      });
      this.empleados.set(list);
    } catch (e) {
      console.error('Error cargando empleados:', e);
      this.error.set('No se pudieron cargar los empleados');
    } finally {
      this.loading.set(false);
    }
  }

  openCreate() {
    this.form.reset();
    this.modalOpen.set(true);
    this.error.set('');
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  async save() {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');

    const { email, password, nombre } = this.form.value;
    try {
      await this.auth.createEmployee(email, password, nombre);
      await this.loadEmpleados();
      this.closeModal();
    } catch (e: any) {
      console.error('Error creando empleado:', e);
      if (e.code === 'auth/email-already-in-use') {
        this.error.set('Este correo ya está registrado.');
      } else {
        this.error.set('Ocurrió un error al crear el empleado.');
      }
    } finally {
      this.saving.set(false);
    }
  }

  async toggleActivo(empleado: Usuario) {
<<<<<<< HEAD
    if (
      !confirm(
        `¿Estás seguro de que deseas ${empleado.role === 'inactivo' ? 'activar' : 'desactivar'} a ${empleado.nombre}?`,
      )
    )
      return;
=======
    if (!confirm(`¿Estás seguro de que deseas ${empleado.role === 'inactivo' ? 'activar' : 'desactivar'} a ${empleado.nombre}?`)) return;
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee

    const nuevoRol = empleado.role === 'inactivo' ? 'empleado' : 'inactivo';
    try {
      const docRef = doc(this.fbCore.db, 'usuarios', empleado.id);
      await updateDoc(docRef, { role: nuevoRol });

      // Actualizar localmente
<<<<<<< HEAD
      this.empleados.update((list) =>
        list.map((e) => (e.id === empleado.id ? { ...e, role: nuevoRol } : e)),
      );
=======
      this.empleados.update(list => list.map(e => e.id === empleado.id ? { ...e, role: nuevoRol } : e));
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    } catch (e) {
      console.error('Error actualizando rol:', e);
      alert('Error al actualizar el estado del empleado.');
    }
  }
}
