import { Routes } from '@angular/router';
import { PresupuestoPageComponent } from './pages/presupuesto-page/presupuesto-page.component';
import { ReparacionesPageComponent } from './pages/reparaciones-page/reparaciones-page.component';
import { ContactarPageComponent } from './pages/contactar-page/contactar-page.component';
import { PageIndexComponent } from './pages/page-index/page-index.component';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    //TODO: Guards
  },
  {
    path: 'presupuesto',
    component: PresupuestoPageComponent
  },
  {
    path: 'reparaciones',
    component: ReparacionesPageComponent
  },
  {
    path: 'contactar',
    component: ContactarPageComponent
  },
  {
    path: '',
    component: PageIndexComponent
  }

];
