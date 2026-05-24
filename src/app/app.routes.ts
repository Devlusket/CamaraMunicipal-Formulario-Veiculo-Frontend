import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'formulario',
    pathMatch: 'full',
  },
  {
    path: 'formulario',
    loadComponent: () =>
      import('./features/public/formulario/formulario.component')
        .then(m => m.FormularioComponent),
  },
  {
    path: 'agendamento',
    loadComponent: () =>
      import('./features/public/agendamento/agendamento.component')
        .then(m => m.AgendamentoComponent),
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/admin/login/admin-login.component')
            .then(m => m.AdminLoginComponent),
      },
      {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/admin/layout/admin-layout.component')
            .then(m => m.AdminLayoutComponent),
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./features/admin/dashboard/admin-dashboard.component')
                .then(m => m.AdminDashboardComponent),
          },
          {
            path: 'veiculos',
            loadComponent: () =>
              import('./features/admin/veiculos/admin-veiculos.component')
                .then(m => m.AdminVeiculosComponent),
          },
          {
            path: 'formularios',
            loadComponent: () =>
              import('./features/admin/formularios/admin-formularios.component')
                .then(m => m.AdminFormulariosComponent),
          },
          {
            path: 'agendamentos',
            loadComponent: () =>
              import('./features/admin/agendamentos/admin-agendamentos.component')
                .then(m => m.AdminAgendamentosComponent),
          },
          {
            path: 'relatorios',
            loadComponent: () =>
              import('./features/admin/relatorios/admin-relatorios.component')
                .then(m => m.AdminRelatoriosComponent),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'formulario',
  },
];