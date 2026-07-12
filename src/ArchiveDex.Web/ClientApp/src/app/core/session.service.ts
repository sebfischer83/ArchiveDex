export interface SessionState {
  isAuthenticated: boolean;
  displayName: string | null;
  roles: string[];
  setupRequired: boolean;
}

export interface SessionService {
  readonly state: SessionState;
  load(): Promise<void>;
  signIn(username: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
