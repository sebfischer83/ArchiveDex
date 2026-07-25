import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Injectable,
  InjectionToken,
  Observable,
  Output,
  TUI_VERSION,
  TuiIcons,
  TuiWithAppearance,
  ViewEncapsulation,
  WA_WINDOW,
  afterNextRender,
  computed,
  filter,
  fromEvent,
  inject,
  input,
  merge,
  output,
  outputFromObservable,
  setClassMetadata,
  signal,
  takeUntilDestroyed,
  tuiAppearanceOptionsProvider,
  tuiCreateOptions,
  tuiInjectElement,
  tuiWithStyles,
  tuiZonefree,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-2IN24IS5.js";

// node_modules/@taiga-ui/layout/fesm2022/taiga-ui-layout-components-surface.mjs
var Styles = class _Styles {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Styles)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _Styles,
      selectors: [["ng-component"]],
      exportAs: ["tui-surface-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiSurface]:where(*[data-tui-version="5.16.0"]){transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);--tui-gap: .25rem;position:relative;box-sizing:border-box;background:none no-repeat;background-size:cover;overflow:hidden;isolation:isolate;-webkit-appearance:none;appearance:none;border:0;font-size:inherit;line-height:inherit;text-decoration:none;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform!important}[tuiSurface]:where(*[data-tui-version="5.16.0"]):focus-visible{outline-color:var(--tui-border-focus)}@supports (not (-moz-appearance: none)) and (not (-webkit-hyphens: none)){[tuiSurface]:where(*[data-tui-version="5.16.0"]):before{mix-blend-mode:multiply}}tui-dialog[data-appearance~=taiga] [tuiSurface]:where(*[data-tui-version="5.16.0"]),tui-sheet-dialog [tuiSurface]:where(*[data-tui-version="5.16.0"]){--tui-background-elevation-1: var(--tui-background-elevation-2)}button[tuiSurface]:where(*[data-tui-version="5.16.0"]){cursor:pointer}[tuiSurface]:where(*[data-tui-version="5.16.0"]):before,[tuiSurface]:where(*[data-tui-version="5.16.0"]):after,[data-tui-version="5.16.0"] [tuiSurfaceLayer]:before,[data-tui-version="5.16.0"] [tuiSurfaceLayer]:after{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);content:"";z-index:-1;border-radius:inherit;pointer-events:none;background-size:cover;background-repeat:no-repeat;transition-property:opacity,backdrop-filter,transform}[data-tui-version="5.16.0"] [tuiSurfaceLayer]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;position:absolute!important;z-index:-1;object-fit:cover;border-radius:inherit;box-sizing:border-box;transition-property:box-shadow,filter,padding}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]+[tuiSurfaceLayer]{will-change:padding;background-clip:content-box;overflow:clip;overflow-clip-margin:content-box}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked+[tuiSurfaceLayer]{padding:var(--tui-gap)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:focus-visible+[tuiSurfaceLayer]{padding:var(--tui-gap)}@media(hover:hover)and (pointer:fine){[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]+[tuiSurfaceLayer]{padding:var(--tui-gap)}}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]{color:var(--tui-background-accent-2);-webkit-appearance:none;appearance:none;margin:0;border-radius:inherit;outline:none;box-shadow:inset 0 0,inset 0 0 var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked{box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:focus-visible{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked:focus-visible{filter:brightness(.7);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}@media(hover:hover)and (pointer:fine){[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]:checked{filter:brightness(.9);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}@media(hover:hover)and (pointer:fine){[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"])[data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"])[data-state=active]{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiTheme=dark] [tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]),[tuiTheme=dark][tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]){box-shadow:none!important}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]){background:conic-gradient(var(--tui-background-neutral-1) 0 0),conic-gradient(var(--tui-background-base) 0 0)}[tuiTheme=dark] [tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]),[tuiTheme=dark][tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-elevation-1)}@media(hover:hover)and (pointer:fine){[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){transform:scale(1.15)}}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"])[data-state=hover]{transform:scale(1.15)}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"])[data-state=active]{transform:scale(.95)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-surface-${TUI_VERSION}`,
      styles: ['[tuiSurface]:where(*[data-tui-version="5.16.0"]){transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);--tui-gap: .25rem;position:relative;box-sizing:border-box;background:none no-repeat;background-size:cover;overflow:hidden;isolation:isolate;-webkit-appearance:none;appearance:none;border:0;font-size:inherit;line-height:inherit;text-decoration:none;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform!important}[tuiSurface]:where(*[data-tui-version="5.16.0"]):focus-visible{outline-color:var(--tui-border-focus)}@supports (not (-moz-appearance: none)) and (not (-webkit-hyphens: none)){[tuiSurface]:where(*[data-tui-version="5.16.0"]):before{mix-blend-mode:multiply}}tui-dialog[data-appearance~=taiga] [tuiSurface]:where(*[data-tui-version="5.16.0"]),tui-sheet-dialog [tuiSurface]:where(*[data-tui-version="5.16.0"]){--tui-background-elevation-1: var(--tui-background-elevation-2)}button[tuiSurface]:where(*[data-tui-version="5.16.0"]){cursor:pointer}[tuiSurface]:where(*[data-tui-version="5.16.0"]):before,[tuiSurface]:where(*[data-tui-version="5.16.0"]):after,[data-tui-version="5.16.0"] [tuiSurfaceLayer]:before,[data-tui-version="5.16.0"] [tuiSurfaceLayer]:after{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);content:"";z-index:-1;border-radius:inherit;pointer-events:none;background-size:cover;background-repeat:no-repeat;transition-property:opacity,backdrop-filter,transform}[data-tui-version="5.16.0"] [tuiSurfaceLayer]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;position:absolute!important;z-index:-1;object-fit:cover;border-radius:inherit;box-sizing:border-box;transition-property:box-shadow,filter,padding}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]+[tuiSurfaceLayer]{will-change:padding;background-clip:content-box;overflow:clip;overflow-clip-margin:content-box}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked+[tuiSurfaceLayer]{padding:var(--tui-gap)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:focus-visible+[tuiSurfaceLayer]{padding:var(--tui-gap)}@media(hover:hover)and (pointer:fine){[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]+[tuiSurfaceLayer]{padding:var(--tui-gap)}}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]{color:var(--tui-background-accent-2);-webkit-appearance:none;appearance:none;margin:0;border-radius:inherit;outline:none;box-shadow:inset 0 0,inset 0 0 var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked{box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:focus-visible{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[data-tui-version="5.16.0"] input[tuiSurfaceLayer]:checked:focus-visible{filter:brightness(.7);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}@media(hover:hover)and (pointer:fine){[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[tuiSurface]:where(*[data-tui-version="5.16.0"]):hover input[tuiSurfaceLayer]:checked{filter:brightness(.9);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}@media(hover:hover)and (pointer:fine){[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"])[data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"])[data-state=active]{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiTheme=dark] [tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]),[tuiTheme=dark][tuiSurface][data-appearance=floating]:where(*[data-tui-version="5.16.0"]){box-shadow:none!important}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]){background:conic-gradient(var(--tui-background-neutral-1) 0 0),conic-gradient(var(--tui-background-base) 0 0)}[tuiTheme=dark] [tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]),[tuiTheme=dark][tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-elevation-1)}@media(hover:hover)and (pointer:fine){[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){transform:scale(1.15)}}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"])[data-state=hover]{transform:scale(1.15)}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral]:where(*[data-tui-version="5.16.0"])[data-state=active]{transform:scale(.95)}\n']
    }]
  }], null, null);
})();
var TuiSurface = class _TuiSurface {
  constructor() {
    this.nothing = tuiWithStyles(Styles);
  }
  static {
    this.\u0275fac = function TuiSurface_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSurface)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiSurface,
      selectors: [["", "tuiSurface", ""]],
      hostAttrs: ["data-tui-version", "5.16.0", "tuiSurface", ""]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSurface, [{
    type: Directive,
    args: [{
      selector: "[tuiSurface]",
      host: {
        "data-tui-version": TUI_VERSION,
        tuiSurface: ""
      }
    }]
  }], null, null);
})();

// node_modules/@ng-web-apis/mutation-observer/fesm2022/ng-web-apis-mutation-observer.mjs
var SafeObserver = typeof MutationObserver === "undefined" ? class {
  observe() {
  }
  disconnect() {
  }
  takeRecords() {
    return [];
  }
} : MutationObserver;
var WA_MUTATION_OBSERVER_INIT = new InjectionToken(ngDevMode ? "[WA_MUTATION_OBSERVER_INIT]" : "");
function booleanAttribute(element, attribute) {
  return element.getAttribute(attribute) !== null || void 0;
}
function mutationObserverInitFactory() {
  const {
    nativeElement
  } = inject(ElementRef);
  const attributeFilter = nativeElement.getAttribute("attributeFilter");
  return {
    attributeFilter: attributeFilter?.split(",").map((attr) => attr.trim()),
    attributeOldValue: booleanAttribute(nativeElement, "attributeOldValue"),
    attributes: booleanAttribute(nativeElement, "attributes"),
    characterData: booleanAttribute(nativeElement, "characterData"),
    characterDataOldValue: booleanAttribute(nativeElement, "characterDataOldValue"),
    childList: booleanAttribute(nativeElement, "childList"),
    subtree: booleanAttribute(nativeElement, "subtree")
  };
}
var WaMutationObserver = class _WaMutationObserver extends SafeObserver {
  nativeElement = inject(ElementRef).nativeElement;
  config = inject(WA_MUTATION_OBSERVER_INIT);
  attributeFilter = "";
  attributeOldValue = "";
  attributes = "";
  characterData = "";
  characterDataOldValue = "";
  childList = "";
  subtree = "";
  waMutationObserver = output();
  constructor() {
    super((records) => {
      this.waMutationObserver.emit(records);
    });
    this.observe(this.nativeElement, this.config);
  }
  ngOnDestroy() {
    this.disconnect();
  }
  static \u0275fac = function WaMutationObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaMutationObserver)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _WaMutationObserver,
    selectors: [["", "waMutationObserver", ""]],
    inputs: {
      attributeFilter: "attributeFilter",
      attributeOldValue: "attributeOldValue",
      attributes: "attributes",
      characterData: "characterData",
      characterDataOldValue: "characterDataOldValue",
      childList: "childList",
      subtree: "subtree"
    },
    outputs: {
      waMutationObserver: "waMutationObserver"
    },
    exportAs: ["MutationObserver"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: WA_MUTATION_OBSERVER_INIT,
      useFactory: mutationObserverInitFactory
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaMutationObserver, [{
    type: Directive,
    args: [{
      selector: "[waMutationObserver]",
      inputs: ["attributeFilter", "attributeOldValue", "attributes", "characterData", "characterDataOldValue", "childList", "subtree"],
      providers: [{
        provide: WA_MUTATION_OBSERVER_INIT,
        useFactory: mutationObserverInitFactory
      }],
      exportAs: "MutationObserver"
    }]
  }], () => [], {
    waMutationObserver: [{
      type: Output,
      args: ["waMutationObserver"]
    }]
  });
})();
var WaMutationObserverService = class _WaMutationObserverService extends Observable {
  constructor() {
    const nativeElement = inject(ElementRef).nativeElement;
    const config = inject(WA_MUTATION_OBSERVER_INIT);
    super((subscriber) => {
      const observer = new SafeObserver((records) => {
        subscriber.next(records);
      });
      observer.observe(nativeElement, config);
      return () => {
        observer.disconnect();
      };
    });
  }
  static \u0275fac = function WaMutationObserverService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaMutationObserverService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _WaMutationObserverService,
    factory: _WaMutationObserverService.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaMutationObserverService, [{
    type: Injectable
  }], () => [], null);
})();

// node_modules/@ng-web-apis/resize-observer/fesm2022/ng-web-apis-resize-observer.mjs
var SafeObserver2 = typeof ResizeObserver === "undefined" ? class {
  observe() {
  }
  unobserve() {
  }
  disconnect() {
  }
} : ResizeObserver;
var WA_RESIZE_OPTION_BOX_DEFAULT = "content-box";
var WA_RESIZE_OPTION_BOX = new InjectionToken(ngDevMode ? "[WA_RESIZE_OPTION_BOX]" : "", {
  factory: () => WA_RESIZE_OPTION_BOX_DEFAULT
});
var WaResizeObserverService = class _WaResizeObserverService extends Observable {
  constructor() {
    const nativeElement = inject(ElementRef).nativeElement;
    const box = inject(WA_RESIZE_OPTION_BOX);
    super((subscriber) => {
      const observer = new SafeObserver2((entries) => subscriber.next(entries));
      observer.observe(nativeElement, {
        box
      });
      return () => {
        observer.disconnect();
      };
    });
  }
  static \u0275fac = function WaResizeObserverService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaResizeObserverService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _WaResizeObserverService,
    factory: _WaResizeObserverService.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaResizeObserverService, [{
    type: Injectable
  }], () => [], null);
})();
var WaResizeObserver = class _WaResizeObserver {
  waResizeObserver = outputFromObservable(inject(WaResizeObserverService));
  waResizeBox = WA_RESIZE_OPTION_BOX_DEFAULT;
  static \u0275fac = function WaResizeObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaResizeObserver)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _WaResizeObserver,
    selectors: [["", "waResizeObserver", ""]],
    inputs: {
      waResizeBox: "waResizeBox"
    },
    outputs: {
      waResizeObserver: "waResizeObserver"
    },
    features: [\u0275\u0275ProvidersFeature([WaResizeObserverService, {
      provide: WA_RESIZE_OPTION_BOX,
      useFactory: () => inject(ElementRef).nativeElement.getAttribute("waResizeBox") || WA_RESIZE_OPTION_BOX_DEFAULT
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaResizeObserver, [{
    type: Directive,
    args: [{
      selector: "[waResizeObserver]",
      inputs: ["waResizeBox"],
      providers: [WaResizeObserverService, {
        provide: WA_RESIZE_OPTION_BOX,
        useFactory: () => inject(ElementRef).nativeElement.getAttribute("waResizeBox") || WA_RESIZE_OPTION_BOX_DEFAULT
      }]
    }]
  }], null, {
    waResizeObserver: [{
      type: Output,
      args: ["waResizeObserver"]
    }]
  });
})();
var WA_RESIZE_OBSERVER_SUPPORT = new InjectionToken(ngDevMode ? "[WA_RESIZE_OBSERVER_SUPPORT]" : "", {
  factory: () => !!inject(WA_WINDOW).ResizeObserver
});

// node_modules/@taiga-ui/kit/fesm2022/taiga-ui-kit-directives-fade.mjs
var BUFFER = 1;
var Styles2 = class _Styles {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Styles)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _Styles,
      selectors: [["ng-component"]],
      exportAs: ["tui-fade-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiFade]:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:mask-position;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);overflow:auto;text-overflow:unset!important;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}[tuiFade]:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,[tuiFade]:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical]){overflow-y:hidden;-webkit-mask-image:linear-gradient(to right,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to left,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(#000,#000);mask-image:linear-gradient(to right,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to left,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(#000,#000);-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;-webkit-mask-size:calc(51% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),calc(50% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),100% calc(100% - var(--t-line-height, 100%));mask-size:calc(51% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),calc(50% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),100% calc(100% - var(--t-line-height, 100%))}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start{-webkit-mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._end{-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start._end{-webkit-mask-position:left bottom,right bottom,top;mask-position:left bottom,right bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._end{-webkit-mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start{-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start._end{-webkit-mask-position:left bottom,right bottom,top;mask-position:left bottom,right bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]{overflow-x:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to top,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset)));mask-image:linear-gradient(to bottom,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to top,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset)));-webkit-mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);-webkit-mask-size:100% calc(51% + var(--t-fade-size) + var(--t-fade-offset));mask-size:100% calc(51% + var(--t-fade-size) + var(--t-fade-offset))}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._start{-webkit-mask-position:left top,left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);mask-position:left top,left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px)}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._end{-webkit-mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left bottom;mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left bottom}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._start._end{-webkit-mask-position:left top,left bottom;mask-position:left top,left bottom}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles2, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-fade-${TUI_VERSION}`,
      styles: ['[tuiFade]:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:mask-position;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);overflow:auto;text-overflow:unset!important;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}[tuiFade]:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,[tuiFade]:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical]){overflow-y:hidden;-webkit-mask-image:linear-gradient(to right,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to left,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(#000,#000);mask-image:linear-gradient(to right,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to left,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(#000,#000);-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;-webkit-mask-size:calc(51% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),calc(50% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),100% calc(100% - var(--t-line-height, 100%));mask-size:calc(51% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),calc(50% + var(--t-fade-size) + var(--t-fade-offset)) var(--t-line-height, 100%),100% calc(100% - var(--t-line-height, 100%))}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start{-webkit-mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._end{-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start._end{-webkit-mask-position:left bottom,right bottom,top;mask-position:left bottom,right bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._end{-webkit-mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top;mask-position:left bottom,calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px) bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start{-webkit-mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top;mask-position:calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px) bottom,right bottom,top}[dir=rtl] [tuiFade]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])._start._end{-webkit-mask-position:left bottom,right bottom,top;mask-position:left bottom,right bottom,top}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]{overflow-x:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to top,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset)));mask-image:linear-gradient(to bottom,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset))),linear-gradient(to top,transparent var(--t-fade-offset),#000 calc(var(--t-fade-size) + var(--t-fade-offset)));-webkit-mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);-webkit-mask-size:100% calc(51% + var(--t-fade-size) + var(--t-fade-offset));mask-size:100% calc(51% + var(--t-fade-size) + var(--t-fade-offset))}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._start{-webkit-mask-position:left top,left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px);mask-position:left top,left calc(100% + var(--t-fade-size) + var(--t-fade-offset) - 1px)}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._end{-webkit-mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left bottom;mask-position:left calc(-1 * var(--t-fade-size) - var(--t-fade-offset) + 1px),left bottom}[tuiFade]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]._start._end{-webkit-mask-position:left top,left bottom;mask-position:left top,left bottom}\n']
    }]
  }], null, null);
})();
var TuiFade = class _TuiFade {
  constructor() {
    this.nothing = tuiWithStyles(Styles2);
    this.lineHeight = input(null, {
      alias: "tuiFadeHeight"
    });
    this.size = input("1.5em", {
      alias: "tuiFadeSize"
    });
    this.offset = input("0em", {
      alias: "tuiFadeOffset"
    });
    this.orientation = input("horizontal", {
      alias: "tuiFade"
    });
    const el = tuiInjectElement();
    afterNextRender(() => el.style.setProperty("transition", ""));
    merge(inject(WaResizeObserverService, {
      self: true
    }), inject(WaMutationObserverService, {
      self: true
    }), fromEvent(el, "scroll")).pipe(filter(() => !!el.scrollWidth), tuiZonefree(), takeUntilDestroyed()).subscribe(() => {
      el.classList.toggle("_end", this.isEnd(el));
      el.classList.toggle("_start", !!Math.floor(el.scrollLeft) || !!Math.floor(el.scrollTop));
    });
  }
  isEnd({
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth
  }) {
    return this.orientation() === "vertical" ? Math.round(scrollTop) < scrollHeight - clientHeight - BUFFER : Math.ceil(Math.abs(scrollLeft)) < scrollWidth - clientWidth - BUFFER || // horizontal multiline fade can kick in early due to hanging elements of fonts so using bigger buffer
    scrollHeight > clientHeight + 4 * BUFFER;
  }
  static {
    this.\u0275fac = function TuiFade_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFade)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiFade,
      selectors: [["", "tuiFade", ""]],
      hostAttrs: ["data-tui-version", "5.16.0"],
      hostVars: 11,
      hostBindings: function TuiFade_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-orientation", ctx.orientation());
          \u0275\u0275styleProp("--t-fade-offset", ctx.offset())("--t-fade-size", ctx.size())("--t-line-height", ctx.lineHeight())("line-height", ctx.lineHeight())("transition", "none");
        }
      },
      inputs: {
        lineHeight: [1, "tuiFadeHeight", "lineHeight"],
        size: [1, "tuiFadeSize", "size"],
        offset: [1, "tuiFadeOffset", "offset"],
        orientation: [1, "tuiFade", "orientation"]
      },
      features: [\u0275\u0275ProvidersFeature([WaResizeObserverService, WaMutationObserverService, {
        provide: WA_MUTATION_OBSERVER_INIT,
        useValue: {
          characterData: true,
          subtree: true
        }
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFade, [{
    type: Directive,
    args: [{
      selector: "[tuiFade]",
      providers: [WaResizeObserverService, WaMutationObserverService, {
        provide: WA_MUTATION_OBSERVER_INIT,
        useValue: {
          characterData: true,
          subtree: true
        }
      }],
      host: {
        "data-tui-version": TUI_VERSION,
        "[attr.data-orientation]": "orientation()",
        "[style.--t-fade-offset]": "offset()",
        "[style.--t-fade-size]": "size()",
        "[style.--t-line-height]": "lineHeight()",
        "[style.line-height]": "lineHeight()",
        "[style.transition]": '"none"'
      }
    }]
  }], () => [], null);
})();

// node_modules/@taiga-ui/kit/fesm2022/taiga-ui-kit-components-avatar.mjs
var _c0 = ["*"];
function TuiAvatarLabeled_Conditional_1_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 0);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const word_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(word_r1);
  }
}
function TuiAvatarLabeled_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, TuiAvatarLabeled_Conditional_1_For_1_Template, 2, 1, "span", 0, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.words());
  }
}
var [TUI_AVATAR_OPTIONS, tuiAvatarOptionsProvider] = tuiCreateOptions({
  appearance: "",
  round: true,
  size: "m"
});
var Styles$1 = class Styles3 {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Styles3)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: Styles3,
      selectors: [["ng-component"]],
      exportAs: ["tui-avatar-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiAvatar]:where(*[data-tui-version="5.16.0"]){--t-size: var(--tui-height-l);--t-radius: .75rem;--t-corner-offset: calc((var(--t-radius) * 1.4142 - var(--t-radius)) * 1 / 1.4142);position:relative;display:inline-flex;flex-shrink:0;inline-size:var(--t-size);min-inline-size:var(--t-size);block-size:var(--t-size);align-items:center;justify-content:center;white-space:nowrap;border-radius:var(--t-radius);border:none;background:var(--tui-background-neutral-1);color:var(--tui-text-secondary);vertical-align:middle;box-sizing:border-box;padding:.25rem;font:var(--tui-typography-body-l);font-weight:700;aspect-ratio:1;opacity:.999}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):before{inline-size:auto;block-size:auto}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):not(._initials):before{position:absolute;inset:0;font-size:calc(var(--t-size) * .6)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xs]{--t-size: var(--tui-height-xs);--t-radius: .5rem;font:var(--tui-typography-ui-2xs);font-size:.5625rem}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xs]._initials:before{font:var(--tui-typography-ui-2xs);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-size: var(--tui-height-s);--t-radius: .5rem;font:var(--tui-typography-ui-2xs);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=s]._initials:before{font:var(--tui-typography-body-s);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-size: calc(var(--tui-height-m) - .25rem);--t-radius: .75rem;font:var(--tui-typography-ui-m);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=m]._initials:before{font:var(--tui-typography-body-m);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xl]{--t-size: 5rem;--t-radius: .75rem;font:var(--tui-typography-heading-h4)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xl]._initials:before{font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxl]{--t-size: 6rem;--t-radius: 1rem;font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxl]._initials:before{font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxxl]{--t-size: 8rem;--t-radius: 1.25rem;font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxxl]._initials:before{font:var(--tui-typography-heading-h2)}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):not([data-shape=square]){--t-radius: calc(var(--t-size) / 2) !important}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._initials:before{content:attr(data-icon-start);-webkit-mask-image:none;mask-image:none;background:none;font:var(--tui-typography-heading-h6)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._badge{-webkit-mask-image:radial-gradient(circle at calc(max(var(--tui-inline),0) * 100% - var(--tui-inline) * var(--t-corner-offset)) calc(100% - var(--t-corner-offset)),black .23rem,transparent .25rem,transparent .375rem,black .39rem);mask-image:radial-gradient(circle at calc(max(var(--tui-inline),0) * 100% - var(--tui-inline) * var(--t-corner-offset)) calc(100% - var(--t-corner-offset)),black .23rem,transparent .25rem,transparent .375rem,black .39rem);mask-clip:no-clip}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._badge:after{content:"";position:absolute;display:block;inset-block-start:calc(100% - var(--t-corner-offset));inset-inline-start:calc(100% - var(--t-corner-offset));inline-size:.55rem;block-size:.55rem;border-radius:100%;background:var(--t-badge);transform:translate3d(calc(var(--tui-inline) * -50%),-50%,0);zoom:1}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._fallback img,[tuiAvatar]:where(*[data-tui-version="5.16.0"])._fallback video{display:none}[tuiAvatar]:where(*[data-tui-version="5.16.0"]) img,[tuiAvatar]:where(*[data-tui-version="5.16.0"]) video,[tuiAvatar]:where(*[data-tui-version="5.16.0"]) picture{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;object-fit:cover;box-sizing:border-box;border-radius:inherit}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):has(img,video):not(._fallback){background:none}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles$1, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-avatar-${TUI_VERSION}`,
      styles: ['[tuiAvatar]:where(*[data-tui-version="5.16.0"]){--t-size: var(--tui-height-l);--t-radius: .75rem;--t-corner-offset: calc((var(--t-radius) * 1.4142 - var(--t-radius)) * 1 / 1.4142);position:relative;display:inline-flex;flex-shrink:0;inline-size:var(--t-size);min-inline-size:var(--t-size);block-size:var(--t-size);align-items:center;justify-content:center;white-space:nowrap;border-radius:var(--t-radius);border:none;background:var(--tui-background-neutral-1);color:var(--tui-text-secondary);vertical-align:middle;box-sizing:border-box;padding:.25rem;font:var(--tui-typography-body-l);font-weight:700;aspect-ratio:1;opacity:.999}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):before{inline-size:auto;block-size:auto}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):not(._initials):before{position:absolute;inset:0;font-size:calc(var(--t-size) * .6)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xs]{--t-size: var(--tui-height-xs);--t-radius: .5rem;font:var(--tui-typography-ui-2xs);font-size:.5625rem}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xs]._initials:before{font:var(--tui-typography-ui-2xs);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-size: var(--tui-height-s);--t-radius: .5rem;font:var(--tui-typography-ui-2xs);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=s]._initials:before{font:var(--tui-typography-body-s);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-size: calc(var(--tui-height-m) - .25rem);--t-radius: .75rem;font:var(--tui-typography-ui-m);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=m]._initials:before{font:var(--tui-typography-body-m);font-weight:700}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xl]{--t-size: 5rem;--t-radius: .75rem;font:var(--tui-typography-heading-h4)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xl]._initials:before{font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxl]{--t-size: 6rem;--t-radius: 1rem;font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxl]._initials:before{font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxxl]{--t-size: 8rem;--t-radius: 1.25rem;font:var(--tui-typography-heading-h3)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])[data-size=xxxl]._initials:before{font:var(--tui-typography-heading-h2)}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):not([data-shape=square]){--t-radius: calc(var(--t-size) / 2) !important}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._initials:before{content:attr(data-icon-start);-webkit-mask-image:none;mask-image:none;background:none;font:var(--tui-typography-heading-h6)}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._badge{-webkit-mask-image:radial-gradient(circle at calc(max(var(--tui-inline),0) * 100% - var(--tui-inline) * var(--t-corner-offset)) calc(100% - var(--t-corner-offset)),black .23rem,transparent .25rem,transparent .375rem,black .39rem);mask-image:radial-gradient(circle at calc(max(var(--tui-inline),0) * 100% - var(--tui-inline) * var(--t-corner-offset)) calc(100% - var(--t-corner-offset)),black .23rem,transparent .25rem,transparent .375rem,black .39rem);mask-clip:no-clip}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._badge:after{content:"";position:absolute;display:block;inset-block-start:calc(100% - var(--t-corner-offset));inset-inline-start:calc(100% - var(--t-corner-offset));inline-size:.55rem;block-size:.55rem;border-radius:100%;background:var(--t-badge);transform:translate3d(calc(var(--tui-inline) * -50%),-50%,0);zoom:1}[tuiAvatar]:where(*[data-tui-version="5.16.0"])._fallback img,[tuiAvatar]:where(*[data-tui-version="5.16.0"])._fallback video{display:none}[tuiAvatar]:where(*[data-tui-version="5.16.0"]) img,[tuiAvatar]:where(*[data-tui-version="5.16.0"]) video,[tuiAvatar]:where(*[data-tui-version="5.16.0"]) picture{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;object-fit:cover;box-sizing:border-box;border-radius:inherit}[tuiAvatar]:where(*[data-tui-version="5.16.0"]):has(img,video):not(._fallback){background:none}\n']
    }]
  }], null, null);
})();
var TuiAvatar = class _TuiAvatar {
  constructor() {
    this.options = inject(TUI_AVATAR_OPTIONS);
    this.nothing = tuiWithStyles(Styles$1);
    this.icons = inject(TuiIcons);
    this.fallback = signal(false);
    this.size = input(this.options.size);
    this.round = input(this.options.round);
    this.badge = input("");
  }
  static {
    this.\u0275fac = function TuiAvatar_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAvatar)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiAvatar,
      selectors: [["", "tuiAvatar", ""]],
      hostAttrs: ["tuiAvatar", ""],
      hostVars: 10,
      hostBindings: function TuiAvatar_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("error.capture", function TuiAvatar_error_capture_HostBindingHandler() {
            return ctx.fallback.set(true);
          })("load.capture", function TuiAvatar_load_capture_HostBindingHandler() {
            return ctx.fallback.set(false);
          });
        }
        if (rf & 2) {
          let tmp_5_0;
          \u0275\u0275attribute("data-shape", ctx.round() ? "round" : "square")("data-size", ctx.size());
          \u0275\u0275styleProp("--t-badge", ctx.badge());
          \u0275\u0275classProp("_badge", ctx.badge())("_fallback", ctx.fallback())("_initials", ((tmp_5_0 = ctx.icons.iconStart()) == null ? null : tmp_5_0.length) < 3);
        }
      },
      inputs: {
        size: [1, "size"],
        round: [1, "round"],
        badge: [1, "badge"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAppearanceOptionsProvider(TUI_AVATAR_OPTIONS)]), \u0275\u0275HostDirectivesFeature([TuiWithAppearance, {
        directive: TuiIcons,
        inputs: ["iconStart", "tuiAvatar"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAvatar, [{
    type: Directive,
    args: [{
      selector: "[tuiAvatar]",
      providers: [tuiAppearanceOptionsProvider(TUI_AVATAR_OPTIONS)],
      hostDirectives: [TuiWithAppearance, {
        directive: TuiIcons,
        inputs: ["iconStart: tuiAvatar"]
      }],
      host: {
        tuiAvatar: "",
        "[attr.data-shape]": 'round() ? "round" : "square"',
        "[attr.data-size]": "size()",
        "[class._badge]": "badge()",
        "[class._fallback]": "fallback()",
        "[class._initials]": "icons.iconStart()?.length < 3",
        "[style.--t-badge]": "badge()",
        "(error.capture)": "fallback.set(true)",
        "(load.capture)": "fallback.set(false)"
      }
    }]
  }], null, null);
})();
var TuiAvatarLabeled = class _TuiAvatarLabeled {
  constructor() {
    this.label = input("");
    this.words = computed(() => this.label().split(" "));
  }
  static {
    this.\u0275fac = function TuiAvatarLabeled_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAvatarLabeled)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiAvatarLabeled,
      selectors: [["tui-avatar-labeled"]],
      hostAttrs: ["data-tui-version", "5.16.0"],
      inputs: {
        label: [1, "label"]
      },
      ngContentSelectors: _c0,
      decls: 2,
      vars: 1,
      consts: [["tuiFade", ""]],
      template: function TuiAvatarLabeled_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275conditionalCreate(1, TuiAvatarLabeled_Conditional_1_Template, 2, 0);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.label().length ? 1 : -1);
        }
      },
      dependencies: [TuiFade],
      styles: ['tui-avatar-labeled:where(*[data-tui-version="5.16.0"]){display:flex;inline-size:3.5rem;box-sizing:content-box;flex-direction:column;text-align:center;align-items:center;font:var(--tui-typography-ui-xs);padding:0 .5rem;white-space:nowrap}tui-avatar-labeled:where(*[data-tui-version="5.16.0"]) [tuiAvatar]{margin-block-end:.375rem}tui-avatar-labeled:where(*[data-tui-version="5.16.0"]) [tuiFade]{inline-size:calc(100% + 1rem)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAvatarLabeled, [{
    type: Component,
    args: [{
      selector: "tui-avatar-labeled",
      imports: [TuiFade],
      template: `
        <ng-content />
        @if (label().length) {
            @for (word of words(); track $index) {
                <span tuiFade>{{ word }}</span>
            }
        }
    `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "data-tui-version": TUI_VERSION
      },
      styles: ['tui-avatar-labeled:where(*[data-tui-version="5.16.0"]){display:flex;inline-size:3.5rem;box-sizing:content-box;flex-direction:column;text-align:center;align-items:center;font:var(--tui-typography-ui-xs);padding:0 .5rem;white-space:nowrap}tui-avatar-labeled:where(*[data-tui-version="5.16.0"]) [tuiAvatar]{margin-block-end:.375rem}tui-avatar-labeled:where(*[data-tui-version="5.16.0"]) [tuiFade]{inline-size:calc(100% + 1rem)}\n']
    }]
  }], null, null);
})();
var Styles4 = class _Styles {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Styles)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _Styles,
      selectors: [["ng-component"]],
      exportAs: ["tui-avatar-outline-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template1(rf, ctx) {
      },
      styles: ['[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"]){--t-outline: .1875rem;--t-gap: .125rem}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=xs],[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=s],[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-outline: .125rem;--t-gap: .0625rem}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])._outline{-webkit-mask-image:radial-gradient(closest-side,#000,#000 calc(100% - var(--t-gap) - var(--t-outline) - .5px),transparent calc(100% - var(--t-gap) - var(--t-outline)),transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)));mask-image:radial-gradient(closest-side,#000,#000 calc(100% - var(--t-gap) - var(--t-outline) - .5px),transparent calc(100% - var(--t-gap) - var(--t-outline)),transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)))}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])._outline:after{content:"";position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;background:var(--t-fill);-webkit-mask-image:radial-gradient(closest-side,transparent,transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)));mask-image:radial-gradient(closest-side,transparent,transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)))}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles4, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-avatar-outline-${TUI_VERSION}`,
      styles: ['[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"]){--t-outline: .1875rem;--t-gap: .125rem}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=xs],[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=s],[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-outline: .125rem;--t-gap: .0625rem}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])._outline{-webkit-mask-image:radial-gradient(closest-side,#000,#000 calc(100% - var(--t-gap) - var(--t-outline) - .5px),transparent calc(100% - var(--t-gap) - var(--t-outline)),transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)));mask-image:radial-gradient(closest-side,#000,#000 calc(100% - var(--t-gap) - var(--t-outline) - .5px),transparent calc(100% - var(--t-gap) - var(--t-outline)),transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)))}[tuiAvatarOutline]:where(*[data-tui-version="5.16.0"])._outline:after{content:"";position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;background:var(--t-fill);-webkit-mask-image:radial-gradient(closest-side,transparent,transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)));mask-image:radial-gradient(closest-side,transparent,transparent calc(100% - var(--t-outline) - .5px),#000 calc(100% - var(--t-outline)))}\n']
    }]
  }], null, null);
})();
var TuiAvatarOutline = class _TuiAvatarOutline {
  constructor() {
    this.nothing = tuiWithStyles(Styles4);
    this.value = computed((value = this.tuiAvatarOutline()) => value === "" ? "var(--tui-background-accent-1)" : value);
    this.tuiAvatarOutline = input("");
  }
  static {
    this.\u0275fac = function TuiAvatarOutline_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAvatarOutline)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiAvatarOutline,
      selectors: [["", "tuiAvatarOutline", ""]],
      hostVars: 4,
      hostBindings: function TuiAvatarOutline_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("--t-fill", ctx.value());
          \u0275\u0275classProp("_outline", ctx.value());
        }
      },
      inputs: {
        tuiAvatarOutline: [1, "tuiAvatarOutline"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAvatarOutline, [{
    type: Directive,
    args: [{
      selector: "[tuiAvatarOutline]",
      host: {
        "[class._outline]": "value()",
        "[style.--t-fill]": "value()"
      }
    }]
  }], null, null);
})();
var TuiAvatarStack = class _TuiAvatarStack {
  constructor() {
    this.direction = input("end");
  }
  static {
    this.\u0275fac = function TuiAvatarStack_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAvatarStack)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiAvatarStack,
      selectors: [["tui-avatar-stack"]],
      hostAttrs: ["data-tui-version", "5.16.0"],
      hostVars: 1,
      hostBindings: function TuiAvatarStack_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-direction", ctx.direction());
        }
      },
      inputs: {
        direction: [1, "direction"]
      },
      ngContentSelectors: _c0,
      decls: 1,
      vars: 0,
      template: function TuiAvatarStack_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
        }
      },
      styles: ['tui-avatar-stack:where(*[data-tui-version="5.16.0"]){display:flex;--t-gap: .125rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]{--t-offset: 2.5rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=xl]{--t-offset: 2.125rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=l]{--t-offset: 1.5rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=m]{--t-offset: .75rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=s]{--t-offset: .575rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=xs]{--t-offset: .375rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]._round{-webkit-mask-image:radial-gradient(circle at calc(50% - calc(var(--tui-inline) * (var(--t-size) - var(--t-offset)))) 50%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px));mask-image:radial-gradient(circle at calc(50% - calc(var(--tui-inline) * (var(--t-size) - var(--t-offset)))) 50%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px))}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round{--tui-inline: -1}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round{--tui-inline: 1}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round:last-child{-webkit-mask-image:none;mask-image:none}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]._round:first-child{-webkit-mask-image:none;mask-image:none}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round):not(:first-child),[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round):not(:last-child){-webkit-mask-image:radial-gradient(circle at 0% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 0% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to right,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));mask-image:radial-gradient(circle at 0% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 0% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to right,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));-webkit-mask-position:calc(var(--t-offset) - var(--t-radius)) calc(-1 * (var(--t-size) - var(--t-radius))),calc(var(--t-offset) - var(--t-radius)) calc(var(--t-size) - var(--t-radius)),bottom;mask-position:calc(var(--t-offset) - var(--t-radius)) calc(-1 * (var(--t-size) - var(--t-radius))),calc(var(--t-offset) - var(--t-radius)) calc(var(--t-size) - var(--t-radius)),bottom}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round):not(:last-child),[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round):not(:first-child){-webkit-mask-image:radial-gradient(circle at 150% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 150% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to left,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));mask-image:radial-gradient(circle at 150% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 150% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to left,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));-webkit-mask-position:calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(-1 * var(--t-gap)),calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(100% + var(--t-gap)),bottom;mask-position:calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(-1 * var(--t-gap)),calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(100% + var(--t-gap)),bottom}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]:not(._round){-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round),tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round){-webkit-mask-size:calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),100%;mask-size:calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),100%}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round){-webkit-mask-size:unset;mask-size:unset}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]:not(:last-child){margin-inline-end:calc(-1 * var(--t-offset))}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAvatarStack, [{
    type: Component,
    args: [{
      selector: "tui-avatar-stack",
      template: "<ng-content />",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "data-tui-version": TUI_VERSION,
        "[attr.data-direction]": "direction()"
      },
      styles: ['tui-avatar-stack:where(*[data-tui-version="5.16.0"]){display:flex;--t-gap: .125rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]{--t-offset: 2.5rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=xl]{--t-offset: 2.125rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=l]{--t-offset: 1.5rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=m]{--t-offset: .75rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=s]{--t-offset: .575rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar][data-size=xs]{--t-offset: .375rem}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]._round{-webkit-mask-image:radial-gradient(circle at calc(50% - calc(var(--tui-inline) * (var(--t-size) - var(--t-offset)))) 50%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px));mask-image:radial-gradient(circle at calc(50% - calc(var(--tui-inline) * (var(--t-size) - var(--t-offset)))) 50%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px))}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round{--tui-inline: -1}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round{--tui-inline: 1}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]._round:last-child{-webkit-mask-image:none;mask-image:none}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]._round:first-child{-webkit-mask-image:none;mask-image:none}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round):not(:first-child),[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round):not(:last-child){-webkit-mask-image:radial-gradient(circle at 0% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 0% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to right,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));mask-image:radial-gradient(circle at 0% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 0% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to right,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));-webkit-mask-position:calc(var(--t-offset) - var(--t-radius)) calc(-1 * (var(--t-size) - var(--t-radius))),calc(var(--t-offset) - var(--t-radius)) calc(var(--t-size) - var(--t-radius)),bottom;mask-position:calc(var(--t-offset) - var(--t-radius)) calc(-1 * (var(--t-size) - var(--t-radius))),calc(var(--t-offset) - var(--t-radius)) calc(var(--t-size) - var(--t-radius)),bottom}tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round):not(:last-child),[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round):not(:first-child){-webkit-mask-image:radial-gradient(circle at 150% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 150% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to left,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));mask-image:radial-gradient(circle at 150% 100%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),radial-gradient(circle at 150% 0%,transparent calc(var(--t-radius) + var(--t-gap)),#000 calc(var(--t-radius) + var(--t-gap) + .2px)),linear-gradient(to left,transparent calc(var(--t-offset) + var(--t-gap)),#000 calc(var(--t-offset) + var(--t-gap)));-webkit-mask-position:calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(-1 * var(--t-gap)),calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(100% + var(--t-gap)),bottom;mask-position:calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(-1 * var(--t-gap)),calc((var(--t-offset) - var(--t-size) + var(--t-radius) / 2 + var(--t-gap) + 1px) * -1) calc(100% + var(--t-gap)),bottom}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]:not(._round){-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=start] [tuiAvatar]:not(._round),tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round){-webkit-mask-size:calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),100%;mask-size:calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),calc(var(--t-radius) + var(--t-gap)) calc(var(--t-radius) + var(--t-gap)),100%}[dir=rtl] tui-avatar-stack:where(*[data-tui-version="5.16.0"])[data-direction=end] [tuiAvatar]:not(._round){-webkit-mask-size:unset;mask-size:unset}tui-avatar-stack:where(*[data-tui-version="5.16.0"]) [tuiAvatar]:not(:last-child){margin-inline-end:calc(-1 * var(--t-offset))}\n']
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/layout/fesm2022/taiga-ui-layout-components-card.mjs
var _c02 = "[tuiCardMedium],[tuiCardLarge]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:flex;align-items:flex-start;flex-shrink:0;text-decoration:none;overflow:hidden;background:var(--tui-background-elevation-2)}[tuiCardMedium] [tuiTitle],[tuiCardLarge] [tuiTitle],[tuiCardMedium] [tuiSubtitle],[tuiCardLarge] [tuiSubtitle]{max-inline-size:100%}[tuiCardMedium]>*,[tuiCardLarge]>*{scrollbar-width:none;-ms-overflow-style:none}[tuiCardMedium]>*::-webkit-scrollbar,[tuiCardLarge]>*::-webkit-scrollbar,[tuiCardMedium]>*::-webkit-scrollbar-thumb,[tuiCardLarge]>*::-webkit-scrollbar-thumb{display:none}\n";
var Styles$3 = class Styles5 {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Styles5)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: Styles5,
      selectors: [["ng-component"]],
      exportAs: ["tui-card-collapsed-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"]){transition-property:clip-path,margin!important;border-image:radial-gradient(at top,var(--tui-background-neutral-2) 26.5%,transparent 27%) 100% 49% / 0 2rem 2rem / 0 0 2rem}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand{transition-property:grid-template-rows,padding,margin;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);background:var(--tui-background-neutral-1);border-radius:var(--tui-radius-s);padding:0 1rem;margin:-.25rem 0 calc(-1 * var(--t-space))!important}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand._expanded{padding:.5rem 1rem;margin:0!important}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable]{inline-size:100%}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] th,[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] td{background:none;padding-inline-start:0;padding-inline-end:0;border-inline-start:0;border-inline-end:0}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] thead th{border:none;block-size:1.75rem}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] tr:last-child td{border-block-end:0}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles$3, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-card-collapsed-${TUI_VERSION}`,
      styles: ['[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"]){transition-property:clip-path,margin!important;border-image:radial-gradient(at top,var(--tui-background-neutral-2) 26.5%,transparent 27%) 100% 49% / 0 2rem 2rem / 0 0 2rem}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand{transition-property:grid-template-rows,padding,margin;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);background:var(--tui-background-neutral-1);border-radius:var(--tui-radius-s);padding:0 1rem;margin:-.25rem 0 calc(-1 * var(--t-space))!important}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand._expanded{padding:.5rem 1rem;margin:0!important}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable]{inline-size:100%}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] th,[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] td{background:none;padding-inline-start:0;padding-inline-end:0;border-inline-start:0;border-inline-end:0}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] thead th{border:none;block-size:1.75rem}[tuiCardCollapsed]:where(*[data-tui-version="5.16.0"])>tui-expand [tuiTable] tr:last-child td{border-block-end:0}\n']
    }]
  }], null, null);
})();
var TuiCardCollapsed = class _TuiCardCollapsed {
  constructor() {
    this.nothing = tuiWithStyles(Styles$3);
    this.collapsed = input(false, {
      alias: "tuiCardCollapsed"
    });
  }
  static {
    this.\u0275fac = function TuiCardCollapsed_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCardCollapsed)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCardCollapsed,
      selectors: [["", "tuiCardCollapsed", ""]],
      hostAttrs: ["data-tui-version", "5.16.0", "tuiCardCollapsed", ""],
      hostVars: 4,
      hostBindings: function TuiCardCollapsed_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("clip-path", ctx.collapsed() ? "inset(-0.75rem)" : "inset(0)")("margin-block-end", ctx.collapsed() ? 0.75 : 0, "rem");
        }
      },
      inputs: {
        collapsed: [1, "tuiCardCollapsed", "collapsed"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCardCollapsed, [{
    type: Directive,
    args: [{
      selector: "[tuiCardCollapsed]",
      host: {
        "data-tui-version": TUI_VERSION,
        tuiCardCollapsed: "",
        "[style.clip-path]": 'collapsed() ? "inset(-0.75rem)" : "inset(0)"',
        "[style.margin-block-end.rem]": "collapsed() ? 0.75 : 0"
      }
    }]
  }], null, null);
})();
var TUI_CARD_DEFAULT_OPTIONS = {
  appearance: "",
  space: "normal"
};
var [TUI_CARD_OPTIONS, tuiCardOptionsProvider] = tuiCreateOptions(TUI_CARD_DEFAULT_OPTIONS);
var Styles$2 = class Styles6 {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Styles6)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: Styles6,
      selectors: [["ng-component"]],
      exportAs: ["tui-card-large-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template1(rf, ctx) {
      },
      styles: ["[tuiCardMedium],[tuiCardLarge]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:flex;align-items:flex-start;flex-shrink:0;text-decoration:none;overflow:hidden;background:var(--tui-background-elevation-2)}[tuiCardMedium] [tuiTitle],[tuiCardLarge] [tuiTitle],[tuiCardMedium] [tuiSubtitle],[tuiCardLarge] [tuiSubtitle]{max-inline-size:100%}[tuiCardMedium]>*,[tuiCardLarge]>*{scrollbar-width:none;-ms-overflow-style:none}[tuiCardMedium]>*::-webkit-scrollbar,[tuiCardLarge]>*::-webkit-scrollbar,[tuiCardMedium]>*::-webkit-scrollbar-thumb,[tuiCardLarge]>*::-webkit-scrollbar-thumb{display:none}\n", '[tuiCardLarge]:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-body-m)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]){--t-space: .75rem;--t-radius: var(--tui-radius-l);--t-comp: -.25rem;--t-padding: .75rem;--t-dim: calc(var(--t-padding) + var(--t-comp));padding:var(--t-padding);border-radius:var(--t-radius);box-sizing:border-box;text-align:start}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[data-space=normal]{--t-radius: 1.5rem;--t-padding: 1.5rem;--t-space: 1.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[data-space=compact]{--t-radius: 1rem;--t-padding: 1.25rem;--t-space: 1.25rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]):not([tuiCell],[tuiHeader],[tuiForm]){flex-direction:column;gap:var(--t-space);align-items:stretch}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]):not([tuiCell],[tuiHeader],[tuiForm])>:last-child:not([tuiCell]){margin-block-start:auto}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader]{padding:var(--t-dim) var(--t-padding)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiButton]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiAvatar]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiSwitch]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] tui-segmented:last-child{margin-inline-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader]{margin:var(--t-comp) 0 calc(2 * var(--t-comp))}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiButton]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiAvatar]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiSwitch]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] tui-segmented:last-child{margin-inline-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiCell]:not(:where(tui-textfield *)){inline-size:100%;margin:-.5rem -.5rem -.75rem;border-radius:var(--tui-radius-l);--t-pad: .5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiCell]:not(:where(tui-textfield *)):last-of-type{margin-block-end:-.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiHeader]+[tuiDescription]{margin-block:-.5rem -.25rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiHeader]+[tuiCell]{margin-block-start:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiAccessories]>[tuiButtonX]{align-self:flex-start;--t-size: 1.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer{margin-block-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer>[tuiButton],[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer>[tuiBlock]{margin-block-end:calc(-1 * var(--t-comp))}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles$2, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-card-large-${TUI_VERSION}`,
      styles: ["[tuiCardMedium],[tuiCardLarge]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:flex;align-items:flex-start;flex-shrink:0;text-decoration:none;overflow:hidden;background:var(--tui-background-elevation-2)}[tuiCardMedium] [tuiTitle],[tuiCardLarge] [tuiTitle],[tuiCardMedium] [tuiSubtitle],[tuiCardLarge] [tuiSubtitle]{max-inline-size:100%}[tuiCardMedium]>*,[tuiCardLarge]>*{scrollbar-width:none;-ms-overflow-style:none}[tuiCardMedium]>*::-webkit-scrollbar,[tuiCardLarge]>*::-webkit-scrollbar,[tuiCardMedium]>*::-webkit-scrollbar-thumb,[tuiCardLarge]>*::-webkit-scrollbar-thumb{display:none}\n", '[tuiCardLarge]:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-body-m)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]){--t-space: .75rem;--t-radius: var(--tui-radius-l);--t-comp: -.25rem;--t-padding: .75rem;--t-dim: calc(var(--t-padding) + var(--t-comp));padding:var(--t-padding);border-radius:var(--t-radius);box-sizing:border-box;text-align:start}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[data-space=normal]{--t-radius: 1.5rem;--t-padding: 1.5rem;--t-space: 1.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[data-space=compact]{--t-radius: 1rem;--t-padding: 1.25rem;--t-space: 1.25rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]):not([tuiCell],[tuiHeader],[tuiForm]){flex-direction:column;gap:var(--t-space);align-items:stretch}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]):not([tuiCell],[tuiHeader],[tuiForm])>:last-child:not([tuiCell]){margin-block-start:auto}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader]{padding:var(--t-dim) var(--t-padding)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiButton]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiAvatar]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] [tuiSwitch]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])[tuiHeader] tui-segmented:last-child{margin-inline-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader]{margin:var(--t-comp) 0 calc(2 * var(--t-comp))}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiButton]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiAvatar]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] [tuiSwitch]:last-child,[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>[tuiHeader] tui-segmented:last-child{margin-inline-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiCell]:not(:where(tui-textfield *)){inline-size:100%;margin:-.5rem -.5rem -.75rem;border-radius:var(--tui-radius-l);--t-pad: .5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiCell]:not(:where(tui-textfield *)):last-of-type{margin-block-end:-.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiHeader]+[tuiDescription]{margin-block:-.5rem -.25rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiHeader]+[tuiCell]{margin-block-start:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"]) [tuiAccessories]>[tuiButtonX]{align-self:flex-start;--t-size: 1.5rem}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer{margin-block-end:var(--t-comp)}[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer>[tuiButton],[tuiCardLarge][data-space]:where(*[data-tui-version="5.16.0"])>footer>[tuiBlock]{margin-block-end:calc(-1 * var(--t-comp))}\n']
    }]
  }], null, null);
})();
var TuiCardLarge = class _TuiCardLarge {
  constructor() {
    this.options = inject(TUI_CARD_OPTIONS);
    this.nothing = tuiWithStyles(Styles$2);
    this.tuiCardLarge = input(this.options.space);
  }
  static {
    this.\u0275fac = function TuiCardLarge_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCardLarge)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCardLarge,
      selectors: [["", "tuiCardLarge", ""]],
      hostAttrs: ["tuiCardLarge", ""],
      hostVars: 1,
      hostBindings: function TuiCardLarge_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-space", ctx.tuiCardLarge() || ctx.options.space);
        }
      },
      inputs: {
        tuiCardLarge: [1, "tuiCardLarge"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAppearanceOptionsProvider(TUI_CARD_OPTIONS)]), \u0275\u0275HostDirectivesFeature([TuiWithAppearance, TuiSurface])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCardLarge, [{
    type: Directive,
    args: [{
      selector: "[tuiCardLarge]",
      providers: [tuiAppearanceOptionsProvider(TUI_CARD_OPTIONS)],
      hostDirectives: [TuiWithAppearance, TuiSurface],
      host: {
        tuiCardLarge: "",
        "[attr.data-space]": "tuiCardLarge() || this.options.space"
      }
    }]
  }], null, null);
})();
var Styles$12 = class Styles7 {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || Styles7)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: Styles7,
      selectors: [["ng-component"]],
      exportAs: ["tui-card-medium-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template2(rf, ctx) {
      },
      styles: [_c02, '[tuiCardMedium]:where(*[data-tui-version="5.16.0"]){inline-size:calc(8.75rem * var(--tui-font-scale));block-size:calc(8.75rem * var(--tui-font-scale));flex-direction:column;justify-content:space-between;padding:.75rem;border-radius:var(--tui-radius-l);box-sizing:border-box}[tuiCardMedium]:where(*[data-tui-version="5.16.0"])[tuiTitle]{padding:.625rem .75rem}[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{margin:-.125rem 0}[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-primary)}[tuiCardMedium]:where(*[data-tui-version="5.16.0"])[tuiTitle],[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiTitle]:not([tuiCell] *):not([tuiLabel] *){font-weight:700}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles$12, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-card-medium-${TUI_VERSION}`,
      styles: ["[tuiCardMedium],[tuiCardLarge]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:flex;align-items:flex-start;flex-shrink:0;text-decoration:none;overflow:hidden;background:var(--tui-background-elevation-2)}[tuiCardMedium] [tuiTitle],[tuiCardLarge] [tuiTitle],[tuiCardMedium] [tuiSubtitle],[tuiCardLarge] [tuiSubtitle]{max-inline-size:100%}[tuiCardMedium]>*,[tuiCardLarge]>*{scrollbar-width:none;-ms-overflow-style:none}[tuiCardMedium]>*::-webkit-scrollbar,[tuiCardLarge]>*::-webkit-scrollbar,[tuiCardMedium]>*::-webkit-scrollbar-thumb,[tuiCardLarge]>*::-webkit-scrollbar-thumb{display:none}\n", '[tuiCardMedium]:where(*[data-tui-version="5.16.0"]){inline-size:calc(8.75rem * var(--tui-font-scale));block-size:calc(8.75rem * var(--tui-font-scale));flex-direction:column;justify-content:space-between;padding:.75rem;border-radius:var(--tui-radius-l);box-sizing:border-box}[tuiCardMedium]:where(*[data-tui-version="5.16.0"])[tuiTitle]{padding:.625rem .75rem}[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{margin:-.125rem 0}[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-primary)}[tuiCardMedium]:where(*[data-tui-version="5.16.0"])[tuiTitle],[tuiCardMedium]:where(*[data-tui-version="5.16.0"]) [tuiTitle]:not([tuiCell] *):not([tuiLabel] *){font-weight:700}\n']
    }]
  }], null, null);
})();
var TuiCardMedium = class _TuiCardMedium {
  constructor() {
    this.nothing = tuiWithStyles(Styles$12);
  }
  static {
    this.\u0275fac = function TuiCardMedium_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCardMedium)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCardMedium,
      selectors: [["", "tuiCardMedium", ""]],
      features: [\u0275\u0275ProvidersFeature([tuiAvatarOptionsProvider({
        size: "l"
      })]), \u0275\u0275HostDirectivesFeature([TuiWithAppearance, TuiSurface])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCardMedium, [{
    type: Directive,
    args: [{
      selector: "[tuiCardMedium]",
      providers: [tuiAvatarOptionsProvider({
        size: "l"
      })],
      hostDirectives: [TuiWithAppearance, TuiSurface]
    }]
  }], null, null);
})();
var Styles8 = class _Styles {
  static {
    this.\u0275fac = function Styles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Styles)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _Styles,
      selectors: [["ng-component"]],
      exportAs: ["tui-card-row-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template3(rf, ctx) {
      },
      styles: ['[tuiCardRow]:where(*[data-tui-version="5.16.0"]){display:flex;align-items:center;gap:3rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) tui-icon{font-size:1rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{font:var(--tui-typography-body-s)}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiTitle]>:not([tuiSubtitle]){display:flex;align-items:center;gap:.25rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-secondary);font:var(--tui-typography-body-xs)}[tuiCardRow]:where(*[data-tui-version="5.16.0"])>[tuiButton],[tuiCardRow]:where(*[data-tui-version="5.16.0"])>[tuiIconButton]{margin-inline-start:auto}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Styles8, [{
    type: Component,
    args: [{
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-card-row-${TUI_VERSION}`,
      styles: ['[tuiCardRow]:where(*[data-tui-version="5.16.0"]){display:flex;align-items:center;gap:3rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) tui-icon{font-size:1rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{font:var(--tui-typography-body-s)}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiTitle]>:not([tuiSubtitle]){display:flex;align-items:center;gap:.25rem}[tuiCardRow]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-secondary);font:var(--tui-typography-body-xs)}[tuiCardRow]:where(*[data-tui-version="5.16.0"])>[tuiButton],[tuiCardRow]:where(*[data-tui-version="5.16.0"])>[tuiIconButton]{margin-inline-start:auto}\n']
    }]
  }], null, null);
})();
var TuiCardRow = class _TuiCardRow {
  constructor() {
    this.nothing = tuiWithStyles(Styles8);
  }
  static {
    this.\u0275fac = function TuiCardRow_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCardRow)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCardRow,
      selectors: [["", "tuiCardRow", ""]],
      hostAttrs: ["data-tui-version", "5.16.0"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCardRow, [{
    type: Directive,
    args: [{
      selector: "[tuiCardRow]",
      host: {
        "data-tui-version": TUI_VERSION
      }
    }]
  }], null, null);
})();

export {
  TuiCardLarge
};
//# sourceMappingURL=chunk-I4HQXK6G.js.map
