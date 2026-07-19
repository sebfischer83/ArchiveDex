import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/capture', pathMatch: 'full' },
  {
    path: 'capture',
    loadComponent: () => import('./features/capture/capture-upload.component').then(m => m.CaptureUploadComponent),
  },
  {
    path: 'sets',
    loadComponent: () => import('./features/sets/set-overview.component').then(m => m.SetOverviewComponent),
  },
  {
    path: 'sets/:setId/cards',
    loadComponent: () => import('./features/cards/card-list.component').then(m => m.CardListComponent),
  },
  {
    path: 'cards/:cardId',
    loadComponent: () => import('./features/cards/card-detail.component').then(m => m.CardDetailComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/auth/sign-in.component').then(m => m.SignInComponent),
  },
  { path: '**', redirectTo: '/capture' },
];
