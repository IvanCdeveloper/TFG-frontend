import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  authService = inject(AuthService);
  router = inject(Router);






  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    password2: ['', [Validators.required, Validators.minLength(4)]]
  })

  onSubmit() {
    if (this.registerForm.invalid) {
      const formErrors: { [key: string]: string } = {};

      if (this.registerForm.get('username')?.errors?.['required']) {
        formErrors['username'] = 'El nombre de usuario es obligatorio';
      }

      if (this.registerForm.get('email')?.errors?.['required']) {
        formErrors['email'] = 'El correo es obligatorio';
      } else if (this.registerForm.get('email')?.errors?.['email']) {
        formErrors['email'] = 'El correo no tiene un formato válido';
      }

      if (this.registerForm.get('password')?.errors?.['required']) {
        formErrors['password'] = 'La contraseña es obligatoria';
      } else if (this.registerForm.get('password')?.errors?.['minlength']) {
        formErrors['password'] = 'Debe tener al menos 4 caracteres';
      }

      if (this.registerForm.get('password2')?.errors?.['required']) {
        formErrors['password2'] = 'Confirma tu contraseña';
      } else if (this.registerForm.get('password2')?.errors?.['minlength']) {
        formErrors['password2'] = 'Debe tener al menos 4 caracteres';
      }

      this.setFormErrors(formErrors);
      return;
    }




    const { username, email, password, password2 } = this.registerForm.value;
    this.authService.register(username!, email!, password!, password2!).subscribe({
      next: (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
        }

        setTimeout(() => {
          this.hasError.set(false);
        }, 3000);

      },
      error: (httpError) => {
        console.log('HTTP Error:', httpError);
        console.log('Body:', httpError.error);

        // httpError.error debe ser tu objeto { email: "..." }
        if (httpError.status === 400 && httpError.error && typeof httpError.error === 'object') {
          this.setFormErrors(httpError.error);
        } else {
          this.hasError.set(true);
        }
      }
    })
  }

  setFormErrors(errors: { [key: string]: string }) {
    console.log("setFormErrors", errors);
    Object.keys(errors).forEach((field) => {
      const control = this.registerForm.get(field);
      if (control) {
        control.setErrors({ server: errors[field] });
      }
    });
  }
}
