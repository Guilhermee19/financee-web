import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    title: 'financee.me',
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
    ]
  },
];
