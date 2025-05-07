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


  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  })

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true)
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
      }

      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
    })
  }



}
