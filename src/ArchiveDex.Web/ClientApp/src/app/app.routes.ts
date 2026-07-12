import { Routes } from '@angular/router';
import { AuthGuard, SetupGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: 'sign-in', loadComponent: () => import('./features/auth/sign-in.component').then(m => m.SignInComponent), title: 'Sign In' },
  { path: 'setup', loadComponent: () => import('./features/setup/setup.component').then(m => m.SetupComponent), canActivate: [SetupGuard], title: 'Setup' },
  { path: 'catalog/card/:id', loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent), canActivate: [AuthGuard], title: 'Catalog: Card Detail' },
  { path: 'catalog', loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent), canActivate: [AuthGuard], title: 'Catalog' },
  { path: 'collection/card/:id', loadComponent: () => import('./features/collection/collection.component').then(m => m.CollectionComponent), canActivate: [AuthGuard], title: 'Collection: Entry Detail' },
  { path: 'collection', loadComponent: () => import('./features/collection/collection.component').then(m => m.CollectionComponent), canActivate: [AuthGuard], title: 'Collection' },
  { path: 'scan', loadComponent: () => import('./features/scan/scan.component').then(m => m.ScanComponent), canActivate: [AuthGuard], title: 'Scan' },
  { path: 'batch-scan/:batchId', loadComponent: () => import('./features/batch-scan/batch-scan.component').then(m => m.BatchScanComponent), canActivate: [AuthGuard], data: { role: 'Administrator' }, title: 'Batch Scan' },
  { path: 'batch-scan', loadComponent: () => import('./features/batch-scan/batch-scan.component').then(m => m.BatchScanComponent), canActivate: [AuthGuard], data: { role: 'Administrator' }, title: 'Batch Scan' },
  { path: 'import', loadComponent: () => import('./features/import/import.component').then(m => m.ImportComponent), canActivate: [AuthGuard], data: { role: 'Administrator' }, title: 'Import' },
  { path: 'transfer', loadComponent: () => import('./features/transfer/transfer.component').then(m => m.TransferComponent), canActivate: [AuthGuard], data: { role: 'Administrator' }, title: 'Transfer' },
  { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent), canActivate: [AuthGuard], data: { role: 'Administrator' }, title: 'Administration' },
  { path: 'account', loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent), canActivate: [AuthGuard], title: 'Account' },
  // Access-denied and not-found states live in shared/states.component.ts
  { path: 'access-denied', loadComponent: () => import('./shared/states.component').then(m => m.AccessDeniedComponent), title: 'Access Denied' },
  { path: '**', loadComponent: () => import('./shared/states.component').then(m => m.NotFoundComponent), title: 'Page Not Found' },
];
