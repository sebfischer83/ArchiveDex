import {
  TUI_ENGLISH_LANGUAGE
} from "./chunk-7GTUKQLC.js";
import {
  DOCUMENT,
  Injectable,
  InjectionToken,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-HRGKPJ5A.js";
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  of,
  share,
  shareReplay,
  startWith,
  switchAll
} from "./chunk-YB2C65QT.js";

// node_modules/@taiga-ui/i18n/fesm2022/taiga-ui-i18n-tokens.mjs
var TUI_DEFAULT_LANGUAGE = new InjectionToken(ngDevMode ? "TUI_DEFAULT_LANGUAGE" : "", {
  factory: () => TUI_ENGLISH_LANGUAGE
});
var TUI_LANGUAGE = new InjectionToken(ngDevMode ? "TUI_LANGUAGE" : "", {
  factory: () => of(inject(TUI_DEFAULT_LANGUAGE))
});
var TUI_LANGUAGE_LOADER = new InjectionToken(ngDevMode ? "TUI_LANGUAGE_LOADER" : "");
var TUI_LANGUAGE_STORAGE_KEY = new InjectionToken(ngDevMode ? "TUI_LANGUAGE_STORAGE_KEY" : "", {
  factory: () => "tuiLanguage"
});

// node_modules/@ng-web-apis/common/fesm2022/ng-web-apis-common.mjs
var WA_WINDOW = new InjectionToken("[WA_WINDOW]", {
  factory: () => {
    const { defaultView } = inject(DOCUMENT);
    if (!defaultView) {
      throw new Error("Window is not available");
    }
    return defaultView;
  }
});
var WINDOW = WA_WINDOW;
var WA_ANIMATION_FRAME = new InjectionToken("[WA_ANIMATION_FRAME]", {
  factory: () => {
    const { requestAnimationFrame, cancelAnimationFrame } = inject(WINDOW);
    const animationFrame$ = new Observable((subscriber) => {
      let id = NaN;
      const callback = (timestamp) => {
        subscriber.next(timestamp);
        id = requestAnimationFrame(callback);
      };
      id = requestAnimationFrame(callback);
      return () => {
        cancelAnimationFrame(id);
      };
    });
    return animationFrame$.pipe(share());
  }
});
var WA_CACHES = new InjectionToken("[WA_CACHES]", {
  factory: () => inject(WINDOW).caches
});
var WA_CRYPTO = new InjectionToken("[WA_CRYPTO]", {
  factory: () => inject(WINDOW).crypto
});
var WA_CSS = new InjectionToken("[WA_CSS]", {
  factory: () => inject(WINDOW).CSS ?? {
    escape: (v) => v,
    // eslint-disable-next-line no-restricted-syntax
    supports: () => false
  }
});
var WA_HISTORY = new InjectionToken("[WA_HISTORY]", {
  factory: () => inject(WINDOW).history
});
var WA_LOCAL_STORAGE = new InjectionToken("[WA_LOCAL_STORAGE]", {
  factory: () => inject(WINDOW).localStorage
});
var WA_LOCATION = new InjectionToken("[WA_LOCATION]", {
  factory: () => inject(WINDOW).location
});
var WA_NAVIGATOR = new InjectionToken("[WA_NAVIGATOR]", {
  factory: () => inject(WINDOW).navigator
});
var NAVIGATOR = WA_NAVIGATOR;
var WA_MEDIA_DEVICES = new InjectionToken("[WA_MEDIA_DEVICES]", {
  factory: () => inject(NAVIGATOR).mediaDevices
});
var WA_NETWORK_INFORMATION = new InjectionToken("[WA_NETWORK_INFORMATION]", {
  // @ts-ignore
  factory: () => inject(WA_NAVIGATOR).connection || null
});
var WA_PAGE_VISIBILITY = new InjectionToken("[WA_PAGE_VISIBILITY]", {
  factory: () => {
    const documentRef = inject(DOCUMENT);
    return fromEvent(documentRef, "visibilitychange").pipe(startWith(0), map(() => documentRef.visibilityState !== "hidden"), distinctUntilChanged(), shareReplay({ refCount: false, bufferSize: 1 }));
  }
});
var WA_PERFORMANCE = new InjectionToken("[WA_PERFORMANCE]", {
  factory: () => inject(WINDOW).performance
});
var WA_SCREEN = new InjectionToken("[WA_SCREEN]", {
  factory: () => inject(WINDOW).screen
});
var WA_SESSION_STORAGE = new InjectionToken("[WA_SESSION_STORAGE]", {
  factory: () => inject(WINDOW).sessionStorage
});
var WA_SPEECH_RECOGNITION = new InjectionToken("[WA_SPEECH_RECOGNITION]: [SPEECH_RECOGNITION]", {
  factory: () => {
    const windowRef = inject(WINDOW);
    return windowRef.speechRecognition || windowRef.webkitSpeechRecognition || null;
  }
});
var WA_SPEECH_SYNTHESIS = new InjectionToken("[WA_SPEECH_SYNTHESIS]", {
  factory: () => inject(WINDOW).speechSynthesis
});
var WA_USER_AGENT = new InjectionToken("[WA_USER_AGENT]", {
  factory: () => inject(NAVIGATOR).userAgent
});

// node_modules/@taiga-ui/i18n/fesm2022/taiga-ui-i18n-utils.mjs
function tuiExtractI18n(key) {
  return () => inject(TUI_LANGUAGE).pipe(map((lang) => lang[key]));
}
async function normalizeCommonJSImport(importPromise) {
  return importPromise.then((m) => m.default || m);
}
function tuiLoadLanguage(language, loader) {
  return from(normalizeCommonJSImport(loader(language))).pipe(map((module) => module?.[`TUI_${language.toUpperCase()}_LANGUAGE`]));
}
function tuiAsyncLoadLanguage(language, loader, fallback) {
  return language && loader ? tuiLoadLanguage(language, loader) : of(fallback);
}
function tuiLanguageSwitcher(loader) {
  return [{
    provide: TUI_LANGUAGE_LOADER,
    useFactory: () => loader
  }, {
    provide: TUI_LANGUAGE,
    useFactory: () => inject(TuiLanguageSwitcherService).pipe(switchAll())
  }];
}
var TuiLanguageSwitcherService = class _TuiLanguageSwitcherService extends BehaviorSubject {
  constructor() {
    super(tuiAsyncLoadLanguage(inject(WA_LOCAL_STORAGE)?.getItem(inject(TUI_LANGUAGE_STORAGE_KEY)), inject(TUI_LANGUAGE_LOADER, {
      optional: true
    }), inject(TUI_DEFAULT_LANGUAGE)));
    this.fallback = inject(TUI_DEFAULT_LANGUAGE);
    this.key = inject(TUI_LANGUAGE_STORAGE_KEY);
    this.storage = inject(WA_LOCAL_STORAGE);
    this.loader = inject(TUI_LANGUAGE_LOADER, {
      optional: true
    });
  }
  get language() {
    return this.storage?.getItem(this.key) || this.fallback.name;
  }
  setLanguage(language) {
    this.storage?.setItem(this.key, language);
    this.next(tuiAsyncLoadLanguage(language, this.loader, this.fallback));
  }
  clear() {
    this.storage?.removeItem(this.key);
    this.next(of(this.fallback));
  }
  static {
    this.ɵfac = function TuiLanguageSwitcherService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLanguageSwitcherService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiLanguageSwitcherService,
      factory: _TuiLanguageSwitcherService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLanguageSwitcherService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();

export {
  WA_WINDOW,
  WINDOW,
  WA_ANIMATION_FRAME,
  WA_LOCAL_STORAGE,
  WA_NAVIGATOR,
  WA_PAGE_VISIBILITY,
  WA_PERFORMANCE,
  WA_USER_AGENT,
  TUI_DEFAULT_LANGUAGE,
  TUI_LANGUAGE,
  TUI_LANGUAGE_LOADER,
  TUI_LANGUAGE_STORAGE_KEY,
  tuiExtractI18n,
  tuiLoadLanguage,
  tuiAsyncLoadLanguage,
  tuiLanguageSwitcher,
  TuiLanguageSwitcherService
};
//# sourceMappingURL=chunk-A6ZHIR5V.js.map
