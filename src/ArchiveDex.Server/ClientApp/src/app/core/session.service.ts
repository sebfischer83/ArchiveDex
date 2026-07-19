import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SessionState {
  isAuthenticated: boolean;
  displayName: string | null;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _state = signal<SessionState>({ isAuthenticated: false, displayName: null });
  readonly state = this._state.asReadonly();

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    try {
      const s = await firstValueFrom(this.http.get<SessionState>('/api/v1/session'));
      this._state.set(s);
    } catch { /* anonymous */ }
  }

  async signIn(userName: string, password: string): Promise<void> {
    await firstValueFrom(this.http.post('/api/v1/session/sign-in', { userName, password }));
    await this.load();
  }

  async signOut(): Promise<void> {
    await firstValueFrom(this.http.post('/api/v1/session/sign-out', {}));
    this._state.set({ isAuthenticated: false, displayName: null });
  }
}
