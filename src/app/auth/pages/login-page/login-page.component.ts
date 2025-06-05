import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  authService = inject(AuthService);
  router = inject(Router);
  generalError = signal<string | null>(null);






  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  })

  onSubmit() {
    if (this.loginForm.invalid) {

      const formErrors: { [key: string]: string } = {};

      if (this.loginForm.get('email')?.errors?.['required']) {
        formErrors['email'] = 'El correo es obligatorio';
      } else if (this.loginForm.get('email')?.errors?.['email']) {
        formErrors['email'] = 'El correo no tiene un formato válido';
      }

      if (this.loginForm.get('password')?.errors?.['required']) {
        formErrors['password'] = 'La contraseña es obligatoria';
      } else if (this.loginForm.get('password')?.errors?.['minlength']) {
        formErrors['password'] = 'Debe tener al menos 4 caracteres';
      }
      this.setFormErrors(formErrors);
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
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


        if (httpError.status === 400 && httpError.error && typeof httpError.error === 'object') {
          this.setFormErrors(httpError.error);
        } else if (httpError.status === 403) {
          this.generalError.set('Credenciales incorrectas');
        } else {
          this.hasError.set(true);
        }
      }
    });
  }




  setFormErrors(errors: { [key: string]: string }) {
    console.log("setFormErrors", errors);
    Object.keys(errors).forEach((field) => {
      const control = this.loginForm.get(field);
      if (control) {
        control.setErrors({ server: errors[field] });
      }
    });
  }





}
