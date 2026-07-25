import {
  HttpClient,
  Injectable,
  firstValueFrom,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-2IN24IS5.js";

// src/app/core/session.service.ts
var SessionService = class _SessionService {
  constructor(http) {
    this.http = http;
    this._state = signal(
      { isAuthenticated: false, displayName: null },
      ...ngDevMode ? [{ debugName: "_state" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.state = this._state.asReadonly();
  }
  async initialize() {
    await this.issueAntiforgeryToken();
    await this.load();
  }
  async load() {
    try {
      const s = await firstValueFrom(this.http.get("/api/v1/session"));
      this._state.set(s);
    } catch {
    }
  }
  async signIn(userName, password) {
    await this.issueAntiforgeryToken();
    await firstValueFrom(this.http.post("/api/v1/session/sign-in", { userName, password }));
    await this.issueAntiforgeryToken();
    await this.load();
  }
  async signOut() {
    await firstValueFrom(this.http.post("/api/v1/session/sign-out", {}));
    await this.issueAntiforgeryToken();
    this._state.set({ isAuthenticated: false, displayName: null });
  }
  async issueAntiforgeryToken() {
    await firstValueFrom(this.http.get("/api/v1/antiforgery", { responseType: "text" }));
  }
  static {
    this.\u0275fac = function SessionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SessionService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SessionService, factory: _SessionService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  SessionService
};
//# sourceMappingURL=chunk-3VVDTR7U.js.map
