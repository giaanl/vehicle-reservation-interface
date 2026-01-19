import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/reservations',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent,
          ),
      },
    ],
  },
  {
    path: 'reservations',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/reservations/reservations.component').then(
        (m) => m.ReservationsComponent,
      ),
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/vehicles/vehicles.component').then(
        (m) => m.VehiclesComponent,
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('./features/profile/edit-profile.component').then(
            (m) => m.EditProfileComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/reservations',
  },
];
