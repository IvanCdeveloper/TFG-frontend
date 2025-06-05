import { Routes } from '@angular/router';
import { PresupuestoPageComponent } from './pages/presupuesto-page/presupuesto-page.component';
import { ReparacionesPageComponent } from './repairs/pages/reparaciones-page/reparaciones-page.component';
import { ContactarPageComponent } from './pages/contactar-page/contactar-page.component';
import { PageIndexComponent } from './pages/page-index/page-index.component';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { IsAdminGuard } from './auth/guards/is-admin.guard';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { RepairPageComponent } from './repairs/pages/repair-page/repair-page.component';
import { ProfilePageComponent } from './auth/pages/profile-page/profile-page.component';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard
    ]
  },
  {
    path: 'presupuesto',
    component: PresupuestoPageComponent
  },
  {
    path: 'reparaciones',
    children: [
      {
        path: '',
        component: ReparacionesPageComponent
      },
      {
        path: ':id',
        component: RepairPageComponent
      }
    ],
    canMatch: [
      AuthenticatedGuard
    ]
  },
  {
    path: 'contactar',
    component: ContactarPageComponent
  },
  {
    path: 'profile',
    component: ProfilePageComponent
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canMatch: [
      IsAdminGuard
    ]
  },
  {
    path: '',
    component: PageIndexComponent
  }

];
