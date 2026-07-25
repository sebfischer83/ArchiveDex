import {
  HttpClient,
  HttpHeaders,
  Injectable,
  firstValueFrom,
  setClassMetadata,
  switchMap,
  takeWhile,
  timer,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-2IN24IS5.js";

// src/app/features/capture/capture.models.ts
function isActiveCaptureStatus(status) {
  return status === "uploaded" || status === "analyzing";
}

// src/app/features/capture/capture.service.ts
var CaptureService = class _CaptureService {
  constructor(http) {
    this.http = http;
    this.finalizationKeys = /* @__PURE__ */ new Map();
  }
  create(file) {
    const form = new FormData();
    form.append("image", file);
    return firstValueFrom(this.http.post("/api/v1/captures", form, {
      headers: new HttpHeaders({ "Idempotency-Key": crypto.randomUUID() })
    }));
  }
  poll(id) {
    return timer(0, 1e3).pipe(switchMap(() => this.http.get(`/api/v1/captures/${id}`)), takeWhile((capture) => isActiveCaptureStatus(capture.status), true));
  }
  review(capture, request) {
    return firstValueFrom(this.http.put(`/api/v1/captures/${capture.id}/review`, request, {
      headers: new HttpHeaders({ "If-Match": capture.etag })
    }));
  }
  finalize(capture, allowDuplicate) {
    const idempotencyKey = this.finalizationKeys.get(capture.id) ?? crypto.randomUUID();
    this.finalizationKeys.set(capture.id, idempotencyKey);
    return firstValueFrom(this.http.post(`/api/v1/captures/${capture.id}/finalize`, { allowDuplicate }, {
      headers: new HttpHeaders({
        "If-Match": capture.etag,
        "Idempotency-Key": idempotencyKey
      }),
      observe: "response"
    }));
  }
  retry(capture) {
    return firstValueFrom(this.http.post(`/api/v1/captures/${capture.id}/retry`, {}, {
      headers: new HttpHeaders({
        "If-Match": capture.etag,
        "Idempotency-Key": crypto.randomUUID()
      })
    }));
  }
  static {
    this.\u0275fac = function CaptureService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CaptureService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CaptureService, factory: _CaptureService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CaptureService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  CaptureService
};
//# sourceMappingURL=chunk-K3UCMJHQ.js.map
