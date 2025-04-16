import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import type { User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { tap } from 'rxjs';


type AuthStatus = 'checking' | 'authenticated' | 'non-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {


  private _authStatus = signal<AuthStatus>('checking');

  private _user = signal<User | null | string>(null);

  private _token = signal<string | null>(null);



  private http = inject(HttpClient);

  authStatus = computed(() => {
    if (this._authStatus() === 'checking')
      return 'checking';

    if (this._user()) {
      return 'authenticated';

    }

    return 'non-authenticated'
  })

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password,
    }).pipe(
      tap(resp => {

        this._user.set(resp.email);
        this._authStatus.set('authenticated');
        this._token.set(resp.token);
        localStorage.setItem('token', resp.token);
      })
    )
  }


}
