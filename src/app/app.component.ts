import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/shared/navbar/navbar.component";
import { PageIndexComponent } from "./pages/page-index/page-index.component";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, RouterLink, PageIndexComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tienda-reparaciones';
}
