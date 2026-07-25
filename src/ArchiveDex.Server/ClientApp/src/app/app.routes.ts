import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/capture', pathMatch: 'full' },
  {
    path: 'capture',
    canActivate: [authGuard],
    loadComponent: () => import('./features/capture/capture-upload.component').then(m => m.CaptureUploadComponent),
  },
  {
    path: 'capture/batch',
    canActivate: [authGuard],
    loadComponent: () => import('./features/capture/capture-batch-upload.component').then(m => m.CaptureBatchUploadComponent),
  },
  {
    path: 'capture/batch/:batchId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/capture/capture-batch-review.component').then(m => m.CaptureBatchReviewComponent),
  },
  {
    path: 'capture/:captureId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/capture/capture-review.component').then(m => m.CaptureReviewComponent),
  },
  {
    path: 'sets',
    canActivate: [authGuard],
    loadComponent: () => import('./features/sets/set-overview.component').then(m => m.SetOverviewComponent),
  },
  {
    path: 'sets/:setId/cards',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cards/card-list.component').then(m => m.CardListComponent),
  },
  {
    path: 'cards/:cardId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cards/card-detail.component').then(m => m.CardDetailComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/auth/sign-in.component').then(m => m.SignInComponent),
  },
  { path: '**', redirectTo: '/capture' },
];
