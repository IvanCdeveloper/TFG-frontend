import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-contactar-page',
  imports: [ReactiveFormsModule],
  templateUrl: './contactar-page.component.html',
})


export class ContactarPageComponent {

  baseUrl = environment.baseUrl;

  fb = inject(FormBuilder);

  loading = false;

  http = inject(HttpClient)

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.http.post(`${this.baseUrl}/contact`, this.contactForm.value).subscribe({
      next: () => {
        alert('Mensaje enviado correctamente');
        this.contactForm.reset();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al enviar el correo', error);
        alert('Ocurrió un error. Intenta de nuevo.');
      }
    });
  }

}
