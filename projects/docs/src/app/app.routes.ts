import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Maestral',
    loadComponent: () => import('./pages/home'),
  },
  {
    path: 'components/button',
    title: 'Button · Maestral',
    loadComponent: () => import('./pages/button-page'),
  },
  {
    path: 'components/field',
    title: 'Field and input · Maestral',
    loadComponent: () => import('./pages/field-page'),
  },
  {
    path: 'components/error-summary',
    title: 'Error summary · Maestral',
    loadComponent: () => import('./pages/error-summary-page'),
  },
  {
    path: 'tokens',
    title: 'Design tokens · Maestral',
    loadComponent: () => import('./pages/tokens-page'),
  },
  { path: '**', redirectTo: '' },
];
