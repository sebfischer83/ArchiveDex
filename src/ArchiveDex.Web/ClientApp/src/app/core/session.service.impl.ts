import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface SessionState {
  isAuthenticated: boolean;
  displayName: string | null;
  roles: string[];
  setupRequired: boolean;
}

@Injectable({ providedIn: 'root' })
export class SessionServiceImpl {
  private _state: SessionState = {
    isAuthenticated: false,
    displayName: null,
    roles: [],
    setupRequired: false,
  };

  get state(): Readonly<SessionState> {
    return this._state;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  async load(): Promise<void> {
    const dto = await firstValueFrom(this.http.get<SessionState>('/api/session'));
    this._state = dto;
    if (dto.setupRequired && !this.isOnSetupRoute()) {
      await this.router.navigate(['/setup']);
    }
  }

  async signIn(username: string, password: string): Promise<void> {
    await firstValueFrom(this.http.post('/api/session/sign-in', { username, password }));
    await this.load();
  }

  async signOut(): Promise<void> {
    await firstValueFrom(this.http.post('/api/session/sign-out', {}));
    this._state = { isAuthenticated: false, displayName: null, roles: [], setupRequired: this._state.setupRequired };
    await this.router.navigate(['/sign-in']);
  }

  private isOnSetupRoute(): boolean {
    return this.router.url.startsWith('/setup');
  }
}
