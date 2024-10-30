import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/navbar/navbar.component').then(
        (m) => m.NavbarComponent
      ),
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'overview',
        title: 'Overview',
        loadComponent: () =>
          import('./pages/overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'finance',
        title: 'Finance',
        loadComponent: () =>
          import('./pages/finance/finance.component').then((m) => m.FinanceComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
