import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',

})
export class NavbarComponent {

  authService = inject(AuthService);

  router = inject(Router);

  user = computed(() => this.authService.user())





  openLogoutModal() {
    (document.getElementById('logoutModal') as HTMLDialogElement).showModal();
  }

  cancelLogout() {
    (document.getElementById('logoutModal') as HTMLDialogElement).close;
  }

  confirmLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/")

  }
}
