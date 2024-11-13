import { Routes } from '@angular/router';
import { unauthGuard } from './guards/unauth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    canActivate: [unauthGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Login',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    title: 'financee.me',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./components/navbar/navbar.component').then(
        (m) => m.NavbarComponent
      ),
    children: [
      {
        path: 'overview',
        title: 'financee.me',
        loadComponent: () =>
          import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'finance',
        title: 'Transações | financee.me',
        loadComponent: () =>
          import('./pages/finance/finance.component').then((m) => m.FinanceComponent),
      },
      {
        path: 'plans',
        title: 'Planos | financee.me',
        loadComponent: () =>
          import('./pages/plans/plans.component').then((m) => m.PlansComponent),
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
