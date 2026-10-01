<<<<<<< HEAD
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule],
<<<<<<< HEAD
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-login.component.html',
=======
  templateUrl: './admin-login.component.html'
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
})
export class AdminLoginComponent {
  auth = inject(AuthService);
  fb = inject(FirebaseService);
  loading = signal(false);

  form = new FormGroup({
<<<<<<< HEAD
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
=======
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
<<<<<<< HEAD
    await this.auth.login(this.form.value.email!, this.form.value.password!);
=======
    await this.auth.login(
      this.form.value.email!,
      this.form.value.password!
    );
>>>>>>> 3a0aae9b4751934a996c2ea0e48805d964d9c3ee
    this.loading.set(false);
  }
}
