import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionServiceImpl } from './session.service.impl';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private session: SessionServiceImpl,
    private router: Router,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.session.state.isAuthenticated) {
      await this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    const requiredRole = route.data['role'] as string | undefined;
    if (requiredRole && !this.session.state.roles.includes(requiredRole)) {
      await this.router.navigate(['/access-denied']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class SetupGuard implements CanActivate {
  constructor(
    private session: SessionServiceImpl,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    if (!this.session.state.setupRequired) {
      await this.router.navigate(['/catalog']);
      return false;
    }
    return true;
  }
}
