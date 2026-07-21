import {
  TuiItem
} from "./chunk-PL64HQKK.js";
import {
  DAYS_IN_WEEK,
  EMPTY_CLIENT_RECT,
  EMPTY_FUNCTION,
  EMPTY_QUERY,
  MAX_YEAR,
  MIN_YEAR,
  POLYMORPHEUS_CONTEXT,
  PolymorpheusComponent,
  PolymorpheusOutlet,
  PolymorpheusTemplate,
  TUI_ALLOW_SIGNAL_WRITES,
  TUI_ANIMATIONS_SPEED,
  TUI_ASSETS_PATH,
  TUI_AUXILIARY,
  TUI_CLEAR_WORD,
  TUI_CLOSE_WORD,
  TUI_COMMON_ICONS,
  TUI_DATE_FORMAT,
  TUI_DAY_TYPE_HANDLER,
  TUI_DEFAULT_ERROR_MESSAGE,
  TUI_DEFAULT_IDENTITY_MATCHER,
  TUI_FALSE_HANDLER,
  TUI_FIRST_DAY,
  TUI_FIRST_DAY_OF_WEEK,
  TUI_ICON_END,
  TUI_ICON_START,
  TUI_IS_ANDROID,
  TUI_IS_IOS,
  TUI_IS_MOBILE,
  TUI_LAST_DAY,
  TUI_LAST_DISPLAYED_DAY,
  TUI_MONTHS,
  TUI_NUMBER_FORMAT,
  TUI_PLATFORM,
  TUI_REDUCED_MOTION,
  TUI_SCROLLBAR_OPTIONS,
  TUI_SCROLL_REF,
  TUI_SHORT_WEEK_DAYS,
  TUI_SPIN_ICONS,
  TUI_SPIN_TEXTS,
  TUI_THEME,
  TUI_TRUE_HANDLER,
  TUI_VERSION,
  TUI_VIEWPORT,
  TuiActiveZone,
  TuiAnimated,
  TuiAnimatedParent,
  TuiBreakpointService,
  TuiControl,
  TuiDay,
  TuiDayRange,
  TuiDriver,
  TuiDriverDirective,
  TuiDropdownA11y,
  TuiDropdownDirective,
  TuiDropdownFixed,
  TuiDropdownOpen,
  TuiDropdowns,
  TuiFontSize,
  TuiFormatDateService,
  TuiIcons,
  TuiLabel,
  TuiMonth,
  TuiMonthRange,
  TuiPopoverService,
  TuiPortalService,
  TuiPortals,
  TuiPositionAccessor,
  TuiPositionService,
  TuiRectAccessor,
  TuiScrollControls,
  TuiScrollIntoView,
  TuiScrollRef,
  TuiScrollbar,
  TuiValidationError,
  TuiVisualViewportService,
  TuiWithDropdownOpen,
  TuiWithIcons,
  TuiWithOptionContent,
  TuiYear,
  coerceBooleanProperty,
  injectContext,
  takeUntilDestroyed,
  toSignal,
  tuiArrayToggle,
  tuiAsAuxiliary,
  tuiAsDataListHost,
  tuiAsDriver,
  tuiAsPopover,
  tuiAsPortal,
  tuiAsRectAccessor,
  tuiAsVehicle,
  tuiClamp,
  tuiCloseWatcher,
  tuiContainsOrAfter,
  tuiCreateOptions,
  tuiDirectiveBinding,
  tuiDropdownOpen,
  tuiFallbackAccessor,
  tuiFocusedIn,
  tuiFormatNumber,
  tuiGetActualTarget,
  tuiGetClosestFocusable,
  tuiGetDuration,
  tuiGetFocused,
  tuiGetIconMode,
  tuiGetViewportWidth,
  tuiIfMap,
  tuiInRange,
  tuiInjectElement,
  tuiInjectIconResolver,
  tuiInjectId,
  tuiIsElement,
  tuiIsFocused,
  tuiIsHTMLElement,
  tuiIsNumber,
  tuiIsObscured,
  tuiIsPresent,
  tuiIsSafari,
  tuiIsString,
  tuiNullableSame,
  tuiOverrideOptions,
  tuiPointToClientRect,
  tuiPositionAccessorFor,
  tuiProvide,
  tuiProvideOptions,
  tuiPure,
  tuiPx,
  tuiQueryListChanges,
  tuiRectAccessorFor,
  tuiSizeBigger,
  tuiStringHashToHsl,
  tuiTakeUntilDestroyed,
  tuiToAnimationOptions,
  tuiTypedFromEvent,
  tuiValue,
  tuiWatch,
  tuiWithStyles,
  tuiZoneOptimized,
  tuiZonefree,
  tuiZonefreeScheduler,
  tuiZonefull
} from "./chunk-LOZSPQWC.js";
import {
  WA_ANIMATION_FRAME,
  WA_NAVIGATOR,
  WA_WINDOW,
  WINDOW
} from "./chunk-A6ZHIR5V.js";
import {
  animate,
  animateChild,
  query,
  sequence,
  stagger,
  style,
  transition,
  trigger
} from "./chunk-NGWXDF6P.js";
import {
  EVENT_MANAGER_PLUGINS
} from "./chunk-R5ZDATPG.js";
import {
  NG_VALIDATORS,
  NgControl,
  Validators
} from "./chunk-N4D5YFQF.js";
import {
  AsyncPipe,
  NgComponentOutlet,
  NgForOf,
  NgIf,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-BFMOBU5G.js";
import {
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  INJECTOR$1,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  Optional,
  Output,
  PLATFORM_ID,
  Pipe,
  Renderer2,
  RendererFactory2,
  RuntimeError,
  Self,
  Service,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  assertInInjectionContext,
  computed,
  effect,
  forwardRef,
  inject,
  setClassMetadata,
  signal,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵdefineService,
  ɵɵdomElementContainer,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵpipeBindV,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction5,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-HRGKPJ5A.js";
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  __decorate,
  combineLatest,
  debounce,
  delay,
  distinctUntilChanged,
  endWith,
  exhaustMap,
  filter,
  fromEvent,
  identity,
  ignoreElements,
  isObservable,
  map,
  merge,
  of,
  race,
  repeat,
  share,
  shareReplay,
  skip,
  skipWhile,
  startWith,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  throttleTime,
  timer
} from "./chunk-YB2C65QT.js";
import {
  __objRest,
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@angular/animations/fesm2022/animations.mjs
var AnimationBuilder = class _AnimationBuilder {
  static ɵfac = function AnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AnimationBuilder)();
  };
  static ɵprov = ɵɵdefineService({
    token: _AnimationBuilder,
    factory: () => (() => inject(BrowserAnimationBuilder))()
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Service,
    args: [{
      factory: () => inject(BrowserAnimationBuilder)
    }]
  }], null, null);
})();
var AnimationFactory = class {
};
var BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  animationModuleType = inject(ANIMATION_MODULE_TYPE, {
    optional: true
  });
  _nextAnimationId = 0;
  _renderer;
  constructor(rootRenderer, doc) {
    super();
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
  static ɵfac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BrowserAnimationBuilder)(ɵɵinject(RendererFactory2), ɵɵinject(DOCUMENT));
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BrowserAnimationBuilder,
    factory: _BrowserAnimationBuilder.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
  _id;
  _renderer;
  constructor(_id, _renderer) {
    super();
    this._id = _id;
    this._renderer = _renderer;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
var RendererAnimationPlayer = class {
  id;
  element;
  _renderer;
  parentPlayer = null;
  _started = false;
  constructor(id, element, options, _renderer) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn) {
    this._listen("done", fn);
  }
  onStart(fn) {
    this._listen("start", fn);
  }
  onDestroy(fn) {
    this._listen("destroy", fn);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
  totalTime = 0;
};
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  return type === 0 || type === 1;
}

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-animations.mjs
var TRANSITION = "{{duration}}ms ease-in-out";
var DURATION = { params: { duration: 300 } };
var STAGGER = 300;
var tuiParentAnimation = trigger("tuiParentAnimation", [
  transition(":leave", [query(":scope > *", [animateChild()], { optional: true })])
]);
var tuiParentStop = trigger("tuiParentStop", [transition(":enter", [])]);
var tuiHost = trigger("tuiHost", [
  transition(":enter", [
    style({ overflow: "clip" }),
    query(":scope > *", [animateChild()], { optional: true })
  ]),
  transition(":leave", [query(":scope > *", [animateChild()], { optional: true })])
]);
var tuiHeightCollapse = trigger("tuiHeightCollapse", [
  transition(":enter", [style({ height: 0 }), animate(TRANSITION, style({ height: "*" }))], DURATION),
  transition(":leave", [style({ height: "*" }), animate(TRANSITION, style({ height: 0 }))], DURATION)
]);
var tuiHeightCollapseList = trigger("tuiHeightCollapseList", [
  transition("* => *", [
    query(":enter", [
      style({ height: 0 }),
      stagger(STAGGER, [animate(TRANSITION, style({ height: "*" }))])
    ], {
      optional: true
    }),
    query(":leave", [
      style({ height: "*" }),
      stagger(STAGGER, [animate(TRANSITION, style({ height: 0 }))])
    ], {
      optional: true
    })
  ], DURATION)
]);
var tuiWidthCollapse = trigger("tuiWidthCollapse", [
  transition(":enter", [style({ width: 0 }), animate(TRANSITION, style({ width: "*" }))], DURATION),
  transition(":leave", [style({ width: "*" }), animate(TRANSITION, style({ width: 0 }))], DURATION)
]);
var tuiWidthCollapseList = trigger("tuiWidthCollapseList", [
  transition("* => *", [
    query(":enter", [
      style({ width: 0 }),
      stagger(STAGGER, [animate(TRANSITION, style({ width: "*" }))])
    ], {
      optional: true
    }),
    query(":leave", [
      style({ width: "*" }),
      stagger(STAGGER, [animate(TRANSITION, style({ width: 0 }))])
    ], {
      optional: true
    })
  ], DURATION)
]);
var tuiCrossFade = trigger("tuiCrossFade", [
  transition(":enter", [style({ opacity: 0 }), animate(TRANSITION, style({ opacity: 1 }))], { params: { duration: 300 } }),
  transition(":leave", [
    style({
      opacity: 1,
      position: "absolute",
      left: "{{left}}",
      right: "{{right}}",
      bottom: "{{bottom}}",
      top: "{{top}}"
    }),
    animate(TRANSITION, style({ opacity: 0 }))
  ], {
    params: {
      duration: 300,
      left: "auto",
      right: "auto",
      bottom: "auto",
      top: "auto"
    }
  })
]);
var tuiFadeIn = trigger("tuiFadeIn", [
  transition(":enter", [style({ opacity: 0 }), animate(TRANSITION, style({ opacity: 1 }))], DURATION),
  transition(":leave", [style({ opacity: 1 }), animate(TRANSITION, style({ opacity: 0 }))], DURATION)
]);
var tuiFadeInList = trigger("tuiFadeInList", [
  transition("* => *", [
    query(":enter", [
      style({ opacity: 0 }),
      stagger(STAGGER, [animate(TRANSITION, style({ opacity: 1 }))])
    ], {
      optional: true
    }),
    query(":leave", [
      style({ opacity: 1 }),
      stagger(STAGGER, [animate(TRANSITION, style({ opacity: 0 }))])
    ], {
      optional: true
    })
  ], DURATION)
]);
var tuiFadeInTop = trigger("tuiFadeInTop", [
  transition(":enter", [
    style({ transform: "translateY(-{{start}}px)", opacity: 0 }),
    animate(TRANSITION, style({ transform: "translateY({{end}})", opacity: 1 }))
  ], { params: { end: 0, start: 10, duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateY({{end}})", opacity: 1 }),
    animate(TRANSITION, style({ transform: "translateY(-{{start}}px)", opacity: 0 }))
  ], { params: { end: 0, start: 10, duration: 300 } })
]);
var tuiFadeInBottom = trigger("tuiFadeInBottom", [
  transition(":enter", [
    style({ transform: "translateY({{start}}px)", opacity: 0 }),
    animate(TRANSITION, style({ transform: "translateY({{end}})", opacity: 1 }))
  ], { params: { end: 0, start: 10, duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateY({{end}})", opacity: 1 }),
    animate(TRANSITION, style({ transform: "translateY({{start}}px)", opacity: 0 }))
  ], { params: { end: 0, start: 10, duration: 300 } })
]);
var tuiDropdownAnimation = trigger("tuiDropdownAnimation", [
  transition(":enter", [
    style({ transform: "translateY(-{{start}}px)", opacity: 0 }),
    animate(TRANSITION, style({ transform: "translateY({{end}})", opacity: 1 }))
  ], { params: { end: 0, start: 10, duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateY({{end}})", opacity: 1 }),
    animate(TRANSITION, style({ transform: "translateY(-{{start}}px)", opacity: 0 }))
  ], { params: { end: 0, start: 10, duration: 300 } })
]);
var tuiScaleIn = trigger("tuiScaleIn", [
  transition(":enter", [
    style({ transform: "scale({{start}})" }),
    animate("{{duration}}ms {{easing}}", style({ transform: "scale({{end}})" }))
  ], { params: { end: 1, start: 0, duration: 300, easing: "ease-in-out" } }),
  transition(":leave", [
    style({ transform: "scale({{end}})" }),
    animate(TRANSITION, style({ transform: "scale({{start}})" }))
  ], { params: { end: 1, start: 0, duration: 300 } })
]);
var tuiPop = trigger("tuiPop", [
  transition(":enter", [
    style({ transform: "scale({{start}})" }),
    animate(TRANSITION, style({ transform: "scale({{middle}})" })),
    animate(TRANSITION, style({ transform: "scale({{end}})" }))
  ], { params: { end: 1, middle: 1.1, start: 0, duration: 300 } }),
  transition(":leave", [
    style({ transform: "scale({{end}})" }),
    animate(TRANSITION, style({ transform: "scale({{middle}})" })),
    animate(TRANSITION, style({ transform: "scale({{start}})" }))
  ], { params: { end: 1, middle: 1.1, start: 0, duration: 300 } })
]);
var tuiScaleInList = trigger("tuiScaleInList", [
  transition("* => *", [
    query(":enter", [
      style({ transform: "scale({{start}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "scale({{end}})" }))
      ])
    ], { optional: true }),
    query(":leave", [
      style({ transform: "scale({{end}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "scale({{start}})" }))
      ])
    ], { optional: true })
  ], { params: { end: 1, start: 0, duration: 300 } })
]);
var tuiSlideIn = trigger("tuiSlideIn", [
  transition("* => left", [
    style({ transform: "translateX(-{{start}})" }),
    animate(TRANSITION, style({ transform: "translateX({{end}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition("left => *", [
    style({ transform: "translateX({{end}})" }),
    animate(TRANSITION, style({ transform: "translateX(-{{start}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition("* => right", [
    style({ transform: "translateX({{start}})" }),
    animate(TRANSITION, style({ transform: "translateX({{end}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition("right => *", [
    style({ transform: "translateX({{end}})" }),
    animate(TRANSITION, style({ transform: "translateX({{start}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInLeft = trigger("tuiSlideInLeft", [
  transition(":enter", [
    style({ transform: "translateX(-{{start}})" }),
    animate(TRANSITION, style({ transform: "translateX({{end}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateX({{end}})" }),
    animate(TRANSITION, style({ transform: "translateX(-{{start}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInLeftList = trigger("tuiSlideInLeftList", [
  transition("* => *", [
    query(":enter", [
      style({ transform: "translateX(-{{start}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateX({{end}})" }))
      ])
    ], { optional: true }),
    query(":leave", [
      style({ transform: "translateX({{end}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateX(-{{start}})" }))
      ])
    ], { optional: true })
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInRight = trigger("tuiSlideInRight", [
  transition(":enter", [
    style({ transform: "translateX({{start}})" }),
    animate(TRANSITION, style({ transform: "translateX({{end}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateX({{end}})" }),
    animate(TRANSITION, style({ transform: "translateX({{start}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInRightList = trigger("tuiSlideInRightList", [
  transition("* => *", [
    query(":enter", [
      style({ transform: "translateX({{start}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateX({{end}})" }))
      ])
    ], { optional: true }),
    query(":leave", [
      style({ transform: "translateX({{end}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateX({{start}})" }))
      ])
    ], { optional: true })
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInTop = trigger("tuiSlideInTop", [
  transition(":enter", [
    style({ transform: "translate3d(0,{{start}},0)", pointerEvents: "none" }),
    animate(TRANSITION, style({ transform: "translate3d(0,{{end}},0)" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition(":leave", [
    style({ transform: "translate3d(0,{{end}},0)" }),
    animate(TRANSITION, style({ transform: "translate3d(0,{{start}},0)" }))
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInTopList = trigger("tuiSlideInTopList", [
  transition("* => *", [
    query(":enter", [
      style({ transform: "translateY({{start}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateY({{end}})" }))
      ])
    ], { optional: true }),
    query(":leave", [
      style({ transform: "translateY({{end}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateY({{start}})" }))
      ])
    ], { optional: true })
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInBottom = trigger("tuiSlideInBottom", [
  transition(":enter", [
    style({ transform: "translateY(-{{start}})" }),
    animate(TRANSITION, style({ transform: "translateY({{end}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } }),
  transition(":leave", [
    style({ transform: "translateY({{end}})" }),
    animate(TRANSITION, style({ transform: "translateY(-{{start}})" }))
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);
var tuiSlideInBottomList = trigger("tuiSlideInBottomList", [
  transition("* => *", [
    query(":enter", [
      style({ transform: "translateY(-{{start}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateY({{end}})" }))
      ])
    ], { optional: true }),
    query(":leave", [
      style({ transform: "translateY({{end}})" }),
      stagger(STAGGER, [
        animate(TRANSITION, style({ transform: "translateY(-{{start}})" }))
      ])
    ], { optional: true })
  ], { params: { end: 0, start: "100%", duration: 300 } })
]);

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-transitioned.mjs
var TuiTransitioned = class _TuiTransitioned {
  constructor() {
    const el = tuiInjectElement();
    inject(NgZone).runOutsideAngular(() => {
      setTimeout(() => {
        el.style.transition = "";
      });
    });
  }
  static {
    this.ɵfac = function TuiTransitioned_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTransitioned)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTransitioned,
      selectors: [["", "tuiTransitioned", ""]],
      hostVars: 2,
      hostBindings: function TuiTransitioned_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵstyleProp("transition", "none");
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTransitioned, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiTransitioned]",
      host: {
        "[style.transition]": '"none"'
      }
    }]
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-appearance.mjs
var TUI_APPEARANCE_DEFAULT_OPTIONS = {
  appearance: ""
};
var TUI_APPEARANCE_OPTIONS = new InjectionToken(ngDevMode ? "TUI_APPEARANCE_OPTIONS" : "", {
  factory: () => TUI_APPEARANCE_DEFAULT_OPTIONS
});
function tuiAppearanceOptionsProvider(token) {
  return tuiProvide(TUI_APPEARANCE_OPTIONS, token);
}
var TuiAppearanceStyles = class _TuiAppearanceStyles {
  static {
    this.ɵfac = function TuiAppearanceStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAppearanceStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiAppearanceStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-appearance-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiAppearanceStyles_Template(rf, ctx) {
      },
      styles: ['[tuiAppearanceV="4.90.0"]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:relative;-webkit-appearance:none;appearance:none;outline:.125rem solid transparent;outline-offset:-.125rem;transition-property:color,background-color,opacity,box-shadow,border-color,border-radius,filter}[tuiAppearanceV="4.90.0"]:before,[tuiAppearanceV="4.90.0"]:after{transition-duration:inherit;transition-timing-function:ease-in-out}[tuiAppearanceV="4.90.0"]:focus-visible:not([data-focus=false]){outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][data-focus=true]{outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][tuiWrapper]:not(._focused):has(:focus-visible){outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][tuiWrapper]._focused._focused{outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"]:disabled:not([data-state]),[tuiAppearanceV="4.90.0"][data-state=disabled]{cursor:initial;opacity:var(--tui-disabled-opacity)}[tuiAppearanceV="4.90.0"][tuiWrapper]:disabled:not([data-state]),[tuiAppearanceV="4.90.0"][tuiWrapper][data-state=disabled]{cursor:initial;opacity:var(--tui-disabled-opacity)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAppearanceStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-appearance-${TUI_VERSION}`,
      styles: ['[tuiAppearanceV="4.90.0"]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:relative;-webkit-appearance:none;appearance:none;outline:.125rem solid transparent;outline-offset:-.125rem;transition-property:color,background-color,opacity,box-shadow,border-color,border-radius,filter}[tuiAppearanceV="4.90.0"]:before,[tuiAppearanceV="4.90.0"]:after{transition-duration:inherit;transition-timing-function:ease-in-out}[tuiAppearanceV="4.90.0"]:focus-visible:not([data-focus=false]){outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][data-focus=true]{outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][tuiWrapper]:not(._focused):has(:focus-visible){outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"][tuiWrapper]._focused._focused{outline-color:var(--tui-border-focus)}[tuiAppearanceV="4.90.0"]:disabled:not([data-state]),[tuiAppearanceV="4.90.0"][data-state=disabled]{cursor:initial;opacity:var(--tui-disabled-opacity)}[tuiAppearanceV="4.90.0"][tuiWrapper]:disabled:not([data-state]),[tuiAppearanceV="4.90.0"][tuiWrapper][data-state=disabled]{cursor:initial;opacity:var(--tui-disabled-opacity)}\n']
    }]
  }], null, null);
})();
var TuiAppearance = class _TuiAppearance {
  constructor() {
    this.cdr = inject(ChangeDetectorRef, {
      skipSelf: true
    });
    this.el = tuiInjectElement();
    this.nothing = tuiWithStyles(TuiAppearanceStyles);
    this.modes = computed((mode = this.mode()) => !mode || tuiIsString(mode) ? mode : mode.join(" "));
    this.appearance = signal(inject(TUI_APPEARANCE_OPTIONS).appearance);
    this.state = signal(null);
    this.focus = signal(null);
    this.mode = signal(null);
    this.update = effect(() => {
      this.mode();
      this.state();
      this.focus();
      if (this.el.matches("tui-textfield[multi]")) {
        this.cdr.detectChanges();
      }
    }, TUI_ALLOW_SIGNAL_WRITES);
  }
  set tuiAppearance(appearance) {
    this.appearance.set(appearance);
  }
  set tuiAppearanceState(state2) {
    this.state.set(state2);
  }
  set tuiAppearanceFocus(focus) {
    this.focus.set(focus);
  }
  set tuiAppearanceMode(mode) {
    this.mode.set(mode);
  }
  static {
    this.ɵfac = function TuiAppearance_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAppearance)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiAppearance,
      selectors: [["", "tuiAppearance", ""]],
      hostAttrs: ["tuiAppearance", "", "tuiAppearanceV", "4.90.0"],
      hostVars: 4,
      hostBindings: function TuiAppearance_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-appearance", ctx.appearance())("data-state", ctx.state())("data-focus", ctx.focus())("data-mode", ctx.modes());
        }
      },
      inputs: {
        tuiAppearance: "tuiAppearance",
        tuiAppearanceState: "tuiAppearanceState",
        tuiAppearanceFocus: "tuiAppearanceFocus",
        tuiAppearanceMode: "tuiAppearanceMode"
      },
      features: [ɵɵHostDirectivesFeature([TuiTransitioned])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAppearance, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiAppearance]",
      hostDirectives: [TuiTransitioned],
      host: {
        tuiAppearance: "",
        tuiAppearanceV: TUI_VERSION,
        "[attr.data-appearance]": "appearance()",
        "[attr.data-state]": "state()",
        "[attr.data-focus]": "focus()",
        "[attr.data-mode]": "modes()"
      }
    }]
  }], null, {
    tuiAppearance: [{
      type: Input
    }],
    tuiAppearanceState: [{
      type: Input
    }],
    tuiAppearanceFocus: [{
      type: Input
    }],
    tuiAppearanceMode: [{
      type: Input
    }]
  });
})();
function tuiAppearance(value, options) {
  return tuiDirectiveBinding(TuiAppearance, "appearance", value, options);
}
function tuiAppearanceState(value, options) {
  return tuiDirectiveBinding(TuiAppearance, "state", value, options);
}
function tuiAppearanceFocus(value, options) {
  return tuiDirectiveBinding(TuiAppearance, "focus", value, options);
}
function tuiAppearanceMode(value, options) {
  return tuiDirectiveBinding(TuiAppearance, "mode", value, options);
}
var TuiWithAppearance = class _TuiWithAppearance {
  static {
    this.ɵfac = function TuiWithAppearance_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithAppearance)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithAppearance,
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiAppearance,
        inputs: ["tuiAppearance", "appearance", "tuiAppearanceState", "tuiAppearanceState", "tuiAppearanceFocus", "tuiAppearanceFocus", "tuiAppearanceMode", "tuiAppearanceMode"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithAppearance, [{
    type: Directive,
    args: [{
      standalone: true,
      hostDirectives: [{
        directive: TuiAppearance,
        inputs: ["tuiAppearance: appearance", "tuiAppearanceState", "tuiAppearanceFocus", "tuiAppearanceMode"]
      }]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-button.mjs
var TUI_BUTTON_DEFAULT_OPTIONS = {
  appearance: "primary",
  size: "l"
};
var [TUI_BUTTON_OPTIONS, tuiButtonOptionsProvider] = tuiCreateOptions(TUI_BUTTON_DEFAULT_OPTIONS);
var TuiButtonStyles = class _TuiButtonStyles {
  static {
    this.ɵfac = function TuiButtonStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiButtonStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiButtonStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-button-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiButtonStyles_Template(rf, ctx) {
      },
      styles: ['[tuiButtonV="4.90.0"],[tuiIconButtonV="4.90.0"]{--t-size: var(--tui-height-l);--t-radius: var(--tui-radius-l);--t-gap: .25rem;--t-padding: 0 1.25rem;--t-margin: -.25rem;-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:inline-flex;align-items:center;flex-shrink:0;box-sizing:border-box;white-space:nowrap;overflow:hidden;vertical-align:middle;max-inline-size:100%;gap:calc(var(--t-gap, 0rem) - 2 * var(--t-margin, 0rem));block-size:var(--t-size);justify-content:center;border-radius:var(--t-radius);padding:var(--t-padding);-webkit-user-select:none;user-select:none;cursor:pointer;font:var(--tui-font-text-m);font-weight:700}[tuiButtonV="4.90.0"]>img,[tuiIconButtonV="4.90.0"]>img,[tuiButtonV="4.90.0"]>tui-svg,[tuiIconButtonV="4.90.0"]>tui-svg,[tuiButtonV="4.90.0"]>tui-icon,[tuiIconButtonV="4.90.0"]>tui-icon,[tuiButtonV="4.90.0"]>tui-avatar,[tuiIconButtonV="4.90.0"]>tui-avatar,[tuiButtonV="4.90.0"]>tui-badge,[tuiIconButtonV="4.90.0"]>tui-badge,[tuiButtonV="4.90.0"]>[tuiBadge],[tuiIconButtonV="4.90.0"]>[tuiBadge],[tuiButtonV="4.90.0"]>[tuiRadio],[tuiIconButtonV="4.90.0"]>[tuiRadio],[tuiButtonV="4.90.0"]>[tuiSwitch],[tuiIconButtonV="4.90.0"]>[tuiSwitch],[tuiButtonV="4.90.0"]>[tuiCheckbox],[tuiIconButtonV="4.90.0"]>[tuiCheckbox],[tuiButtonV="4.90.0"][tuiIcons]:before,[tuiIconButtonV="4.90.0"][tuiIcons]:before,[tuiButtonV="4.90.0"][tuiIcons]:after,[tuiIconButtonV="4.90.0"][tuiIcons]:after{margin:var(--t-margin)}[tuiButtonV="4.90.0"]>.t-loader,[tuiIconButtonV="4.90.0"]>.t-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}[tuiButtonV="4.90.0"]>.t-loader .t-text,[tuiIconButtonV="4.90.0"]>.t-loader .t-text{position:absolute}[tuiButtonV="4.90.0"][data-size=xs],[tuiIconButtonV="4.90.0"][data-size=xs]{--t-size: var(--tui-height-xs);--t-radius: var(--tui-radius-xs);--t-gap: .125rem;--t-padding: 0 .375rem;--t-margin: -.125rem;font:var(--tui-font-text-s)}[tuiButtonV="4.90.0"][data-size=xs] tui-svg,[tuiIconButtonV="4.90.0"][data-size=xs] tui-svg,[tuiButtonV="4.90.0"][data-size=xs] tui-icon,[tuiIconButtonV="4.90.0"][data-size=xs] tui-icon,[tuiButtonV="4.90.0"][data-size=xs]:before,[tuiIconButtonV="4.90.0"][data-size=xs]:before{font-size:1rem}[tuiButtonV="4.90.0"][data-size=s],[tuiIconButtonV="4.90.0"][data-size=s]{--t-size: var(--tui-height-s);--t-radius: var(--tui-radius-m);--t-gap: .125rem;--t-padding: 0 .625rem;--t-margin: -.125rem;font:var(--tui-font-text-s)}[tuiButtonV="4.90.0"][data-size=s] tui-svg,[tuiIconButtonV="4.90.0"][data-size=s] tui-svg,[tuiButtonV="4.90.0"][data-size=s] tui-icon,[tuiIconButtonV="4.90.0"][data-size=s] tui-icon,[tuiButtonV="4.90.0"][data-size=s]:not([tuiIconButton][data-appearance=icon]):not([tuiIconButton][data-appearance=link]):before,[tuiIconButtonV="4.90.0"][data-size=s]:not([tuiIconButton][data-appearance=icon]):not([tuiIconButton][data-appearance=link]):before{font-size:1rem}[tuiButtonV="4.90.0"][data-size=m],[tuiIconButtonV="4.90.0"][data-size=m]{--t-size: var(--tui-height-m);--t-radius: var(--tui-radius-m);--t-gap: .125rem;--t-padding: 0 1rem;--t-margin: -.375rem;font:var(--tui-font-text-m);font-weight:700}[tuiButtonV="4.90.0"][data-size=m]:after,[tuiIconButtonV="4.90.0"][data-size=m]:after{margin-inline-end:-.125rem}[tuiButtonV="4.90.0"]._loading,[tuiIconButtonV="4.90.0"]._loading{--tui-disabled-opacity: 1;-webkit-text-fill-color:transparent}[tuiButtonV="4.90.0"]._loading>*,[tuiIconButtonV="4.90.0"]._loading>*,[tuiButtonV="4.90.0"]._loading:before,[tuiIconButtonV="4.90.0"]._loading:before,[tuiButtonV="4.90.0"]._loading:after,[tuiIconButtonV="4.90.0"]._loading:after{opacity:0}[tuiButtonV="4.90.0"]._loading>.t-loader,[tuiIconButtonV="4.90.0"]._loading>.t-loader{opacity:1}[tuiButtonV="4.90.0"][tuiIcons]:after,[tuiIconButtonV="4.90.0"][tuiIcons]:after{font-size:1rem}[tuiButtonV="4.90.0"][tuiButtonVertical],[tuiIconButtonV="4.90.0"][tuiButtonVertical]{--t-margin: 0rem !important;--t-line-height: 1rem;flex-direction:column;flex-shrink:1;block-size:auto;padding:.75rem;gap:.375rem;min-inline-size:5rem;white-space:pre-line;font:var(--tui-font-text-ui-s)}[tuiButtonV="4.90.0"][tuiButtonVertical]>*,[tuiIconButtonV="4.90.0"][tuiButtonVertical]>*{max-block-size:calc(var(--t-line-height) * 2)}[tuiIconButtonV="4.90.0"]{gap:0;inline-size:var(--t-size);font-size:0!important;font-variant-ligatures:none!important;padding:0}[tuiIconButtonV="4.90.0"][data-size=l]:after{margin:0}[tuiIconButtonV="4.90.0"][tuiIconButtonV="4.90.0"][style*="--t-icon-start:"]:after{display:none}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiButtonStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-button-${TUI_VERSION}`,
      styles: ['[tuiButtonV="4.90.0"],[tuiIconButtonV="4.90.0"]{--t-size: var(--tui-height-l);--t-radius: var(--tui-radius-l);--t-gap: .25rem;--t-padding: 0 1.25rem;--t-margin: -.25rem;-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:inline-flex;align-items:center;flex-shrink:0;box-sizing:border-box;white-space:nowrap;overflow:hidden;vertical-align:middle;max-inline-size:100%;gap:calc(var(--t-gap, 0rem) - 2 * var(--t-margin, 0rem));block-size:var(--t-size);justify-content:center;border-radius:var(--t-radius);padding:var(--t-padding);-webkit-user-select:none;user-select:none;cursor:pointer;font:var(--tui-font-text-m);font-weight:700}[tuiButtonV="4.90.0"]>img,[tuiIconButtonV="4.90.0"]>img,[tuiButtonV="4.90.0"]>tui-svg,[tuiIconButtonV="4.90.0"]>tui-svg,[tuiButtonV="4.90.0"]>tui-icon,[tuiIconButtonV="4.90.0"]>tui-icon,[tuiButtonV="4.90.0"]>tui-avatar,[tuiIconButtonV="4.90.0"]>tui-avatar,[tuiButtonV="4.90.0"]>tui-badge,[tuiIconButtonV="4.90.0"]>tui-badge,[tuiButtonV="4.90.0"]>[tuiBadge],[tuiIconButtonV="4.90.0"]>[tuiBadge],[tuiButtonV="4.90.0"]>[tuiRadio],[tuiIconButtonV="4.90.0"]>[tuiRadio],[tuiButtonV="4.90.0"]>[tuiSwitch],[tuiIconButtonV="4.90.0"]>[tuiSwitch],[tuiButtonV="4.90.0"]>[tuiCheckbox],[tuiIconButtonV="4.90.0"]>[tuiCheckbox],[tuiButtonV="4.90.0"][tuiIcons]:before,[tuiIconButtonV="4.90.0"][tuiIcons]:before,[tuiButtonV="4.90.0"][tuiIcons]:after,[tuiIconButtonV="4.90.0"][tuiIcons]:after{margin:var(--t-margin)}[tuiButtonV="4.90.0"]>.t-loader,[tuiIconButtonV="4.90.0"]>.t-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}[tuiButtonV="4.90.0"]>.t-loader .t-text,[tuiIconButtonV="4.90.0"]>.t-loader .t-text{position:absolute}[tuiButtonV="4.90.0"][data-size=xs],[tuiIconButtonV="4.90.0"][data-size=xs]{--t-size: var(--tui-height-xs);--t-radius: var(--tui-radius-xs);--t-gap: .125rem;--t-padding: 0 .375rem;--t-margin: -.125rem;font:var(--tui-font-text-s)}[tuiButtonV="4.90.0"][data-size=xs] tui-svg,[tuiIconButtonV="4.90.0"][data-size=xs] tui-svg,[tuiButtonV="4.90.0"][data-size=xs] tui-icon,[tuiIconButtonV="4.90.0"][data-size=xs] tui-icon,[tuiButtonV="4.90.0"][data-size=xs]:before,[tuiIconButtonV="4.90.0"][data-size=xs]:before{font-size:1rem}[tuiButtonV="4.90.0"][data-size=s],[tuiIconButtonV="4.90.0"][data-size=s]{--t-size: var(--tui-height-s);--t-radius: var(--tui-radius-m);--t-gap: .125rem;--t-padding: 0 .625rem;--t-margin: -.125rem;font:var(--tui-font-text-s)}[tuiButtonV="4.90.0"][data-size=s] tui-svg,[tuiIconButtonV="4.90.0"][data-size=s] tui-svg,[tuiButtonV="4.90.0"][data-size=s] tui-icon,[tuiIconButtonV="4.90.0"][data-size=s] tui-icon,[tuiButtonV="4.90.0"][data-size=s]:not([tuiIconButton][data-appearance=icon]):not([tuiIconButton][data-appearance=link]):before,[tuiIconButtonV="4.90.0"][data-size=s]:not([tuiIconButton][data-appearance=icon]):not([tuiIconButton][data-appearance=link]):before{font-size:1rem}[tuiButtonV="4.90.0"][data-size=m],[tuiIconButtonV="4.90.0"][data-size=m]{--t-size: var(--tui-height-m);--t-radius: var(--tui-radius-m);--t-gap: .125rem;--t-padding: 0 1rem;--t-margin: -.375rem;font:var(--tui-font-text-m);font-weight:700}[tuiButtonV="4.90.0"][data-size=m]:after,[tuiIconButtonV="4.90.0"][data-size=m]:after{margin-inline-end:-.125rem}[tuiButtonV="4.90.0"]._loading,[tuiIconButtonV="4.90.0"]._loading{--tui-disabled-opacity: 1;-webkit-text-fill-color:transparent}[tuiButtonV="4.90.0"]._loading>*,[tuiIconButtonV="4.90.0"]._loading>*,[tuiButtonV="4.90.0"]._loading:before,[tuiIconButtonV="4.90.0"]._loading:before,[tuiButtonV="4.90.0"]._loading:after,[tuiIconButtonV="4.90.0"]._loading:after{opacity:0}[tuiButtonV="4.90.0"]._loading>.t-loader,[tuiIconButtonV="4.90.0"]._loading>.t-loader{opacity:1}[tuiButtonV="4.90.0"][tuiIcons]:after,[tuiIconButtonV="4.90.0"][tuiIcons]:after{font-size:1rem}[tuiButtonV="4.90.0"][tuiButtonVertical],[tuiIconButtonV="4.90.0"][tuiButtonVertical]{--t-margin: 0rem !important;--t-line-height: 1rem;flex-direction:column;flex-shrink:1;block-size:auto;padding:.75rem;gap:.375rem;min-inline-size:5rem;white-space:pre-line;font:var(--tui-font-text-ui-s)}[tuiButtonV="4.90.0"][tuiButtonVertical]>*,[tuiIconButtonV="4.90.0"][tuiButtonVertical]>*{max-block-size:calc(var(--t-line-height) * 2)}[tuiIconButtonV="4.90.0"]{gap:0;inline-size:var(--t-size);font-size:0!important;font-variant-ligatures:none!important;padding:0}[tuiIconButtonV="4.90.0"][data-size=l]:after{margin:0}[tuiIconButtonV="4.90.0"][tuiIconButtonV="4.90.0"][style*="--t-icon-start:"]:after{display:none}\n']
    }]
  }], null, null);
})();
var TuiButton = class _TuiButton {
  constructor() {
    this.options = inject(TUI_BUTTON_OPTIONS);
    this.nothing = tuiWithStyles(TuiButtonStyles);
    this.version = TUI_VERSION;
    this.el = tuiInjectElement();
    this.size = this.options.size;
  }
  static {
    this.ɵfac = function TuiButton_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiButton)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiButton,
      selectors: [["a", "tuiButton", ""], ["button", "tuiButton", ""], ["a", "tuiIconButton", ""], ["button", "tuiIconButton", ""]],
      hostVars: 3,
      hostBindings: function TuiButton_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-size", ctx.size)("tuiButtonV", ctx.el.hasAttribute("tuiButton") ? ctx.version : null)("tuiIconButtonV", ctx.el.hasAttribute("tuiIconButton") ? ctx.version : null);
        }
      },
      inputs: {
        size: "size"
      },
      features: [ɵɵProvidersFeature([tuiAppearanceOptionsProvider(TUI_BUTTON_OPTIONS)]), ɵɵHostDirectivesFeature([TuiWithAppearance, TuiWithIcons])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiButton, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "a[tuiButton],button[tuiButton],a[tuiIconButton],button[tuiIconButton]",
      providers: [tuiAppearanceOptionsProvider(TUI_BUTTON_OPTIONS)],
      hostDirectives: [TuiWithAppearance, TuiWithIcons],
      host: {
        "[attr.data-size]": "size",
        "[attr.tuiButtonV]": "el.hasAttribute('tuiButton') ? version : null",
        "[attr.tuiIconButtonV]": "el.hasAttribute('tuiIconButton') ? version : null"
      }
    }]
  }], null, {
    size: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-link.mjs
var TUI_LINK_DEFAULT_OPTIONS = {
  appearance: "action",
  pseudo: false
};
var TUI_LINK_OPTIONS = new InjectionToken(ngDevMode ? "TUI_LINK_OPTIONS" : "", {
  factory: () => TUI_LINK_DEFAULT_OPTIONS
});
function tuiLinkOptionsProvider(options) {
  return tuiProvideOptions(TUI_LINK_OPTIONS, options, TUI_LINK_DEFAULT_OPTIONS);
}
var TuiLinkStyles = class _TuiLinkStyles {
  static {
    this.ɵfac = function TuiLinkStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLinkStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiLinkStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-link-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiLinkStyles_Template(rf, ctx) {
      },
      styles: ['[tuiLinkV="4.90.0"]{--tui-text-tertiary: var(--tui-text-secondary);transition-property:color,opacity,-webkit-text-decoration;transition-property:color,text-decoration,opacity;transition-property:color,text-decoration,opacity,-webkit-text-decoration;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;padding:0;background:transparent;border:none;cursor:pointer;font:inherit;color:var(--tui-text-primary);-webkit-text-decoration:none dashed currentColor;text-decoration:none dashed currentColor;text-underline-offset:.2em;text-decoration-thickness:.7px;text-decoration-color:color-mix(in lch,currentColor,transparent)}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:hover{--tui-text-secondary: var(--tui-text-primary)}}[tuiLinkV="4.90.0"]:before{margin-inline-end:.25rem}[tuiLinkV="4.90.0"]:after{margin-inline-start:.25rem}[tuiLinkV="4.90.0"][tuiIcons]:before,[tuiLinkV="4.90.0"][tuiIcons]:after{content:"\\2060";padding:calc(var(--tui-icon-size, 1rem) / 2);vertical-align:super;font-size:0;line-height:0;box-sizing:border-box;transition:none}[tuiLinkV="4.90.0"][tuiChevron]:after{display:inline-block}[tuiLinkV="4.90.0"]:focus-visible:not([data-focus=false]){outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][data-focus=true]{outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][tuiWrapper]:not(._focused):has(:focus-visible){outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][tuiWrapper]._focused._focused{outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){text-decoration-color:currentColor}}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){text-decoration-color:currentColor}}[tuiLinkV="4.90.0"][data-state=hover]{text-decoration-color:currentColor}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"][tuiWrapper]:hover:not(._no-hover),[tuiLinkV="4.90.0"][tuiWrapper][data-state=hover]{text-decoration-color:currentColor}}[tuiLinkV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){text-decoration-color:currentColor}[tuiLinkV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){text-decoration-color:currentColor}[tuiLinkV="4.90.0"][data-state=active]{text-decoration-color:currentColor}[tuiLinkV="4.90.0"][tuiWrapper]:active:not(._no-active),[tuiLinkV="4.90.0"][tuiWrapper][data-state=active],[tuiLinkV="4.90.0"][tuiWrapper][data-state=active]:hover{text-decoration-color:currentColor}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"][data-appearance=""]:hover{opacity:.7}}[tuiLinkV="4.90.0"][data-appearance=""]:active{opacity:.7}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLinkStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-link-${TUI_VERSION}`,
      styles: ['[tuiLinkV="4.90.0"]{--tui-text-tertiary: var(--tui-text-secondary);transition-property:color,opacity,-webkit-text-decoration;transition-property:color,text-decoration,opacity;transition-property:color,text-decoration,opacity,-webkit-text-decoration;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;padding:0;background:transparent;border:none;cursor:pointer;font:inherit;color:var(--tui-text-primary);-webkit-text-decoration:none dashed currentColor;text-decoration:none dashed currentColor;text-underline-offset:.2em;text-decoration-thickness:.7px;text-decoration-color:color-mix(in lch,currentColor,transparent)}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:hover{--tui-text-secondary: var(--tui-text-primary)}}[tuiLinkV="4.90.0"]:before{margin-inline-end:.25rem}[tuiLinkV="4.90.0"]:after{margin-inline-start:.25rem}[tuiLinkV="4.90.0"][tuiIcons]:before,[tuiLinkV="4.90.0"][tuiIcons]:after{content:"\\2060";padding:calc(var(--tui-icon-size, 1rem) / 2);vertical-align:super;font-size:0;line-height:0;box-sizing:border-box;transition:none}[tuiLinkV="4.90.0"][tuiChevron]:after{display:inline-block}[tuiLinkV="4.90.0"]:focus-visible:not([data-focus=false]){outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][data-focus=true]{outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][tuiWrapper]:not(._focused):has(:focus-visible){outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}[tuiLinkV="4.90.0"][tuiWrapper]._focused._focused{outline:none;background:var(--tui-service-selection-background);background:color-mix(in lch,currentColor 12%,transparent)}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){text-decoration-color:currentColor}}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){text-decoration-color:currentColor}}[tuiLinkV="4.90.0"][data-state=hover]{text-decoration-color:currentColor}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"][tuiWrapper]:hover:not(._no-hover),[tuiLinkV="4.90.0"][tuiWrapper][data-state=hover]{text-decoration-color:currentColor}}[tuiLinkV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){text-decoration-color:currentColor}[tuiLinkV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){text-decoration-color:currentColor}[tuiLinkV="4.90.0"][data-state=active]{text-decoration-color:currentColor}[tuiLinkV="4.90.0"][tuiWrapper]:active:not(._no-active),[tuiLinkV="4.90.0"][tuiWrapper][data-state=active],[tuiLinkV="4.90.0"][tuiWrapper][data-state=active]:hover{text-decoration-color:currentColor}@media (hover: hover) and (pointer: fine){[tuiLinkV="4.90.0"][data-appearance=""]:hover{opacity:.7}}[tuiLinkV="4.90.0"][data-appearance=""]:active{opacity:.7}\n']
    }]
  }], null, null);
})();
var TuiLink = class _TuiLink {
  constructor() {
    this.nothing = tuiWithStyles(TuiLinkStyles);
    this.pseudo = inject(TUI_LINK_OPTIONS).pseudo;
  }
  static {
    this.ɵfac = function TuiLink_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLink)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiLink,
      selectors: [["a", "tuiLink", ""], ["button", "tuiLink", ""]],
      hostAttrs: ["tuiLink", "", "tuiLinkV", "4.90.0"],
      hostVars: 2,
      hostBindings: function TuiLink_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵstyleProp("text-decoration-line", ctx.pseudo ? "underline" : null);
        }
      },
      inputs: {
        pseudo: "pseudo"
      },
      features: [ɵɵProvidersFeature([tuiAppearanceOptionsProvider(TUI_LINK_OPTIONS)]), ɵɵHostDirectivesFeature([TuiWithAppearance, TuiWithIcons])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLink, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "a[tuiLink], button[tuiLink]",
      providers: [tuiAppearanceOptionsProvider(TUI_LINK_OPTIONS)],
      hostDirectives: [TuiWithAppearance, TuiWithIcons],
      host: {
        tuiLink: "",
        tuiLinkV: TUI_VERSION,
        "[style.text-decoration-line]": 'pseudo ? "underline" : null'
      }
    }]
  }], null, {
    pseudo: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-notification.mjs
var ICONS = {
  info: "@tui.info",
  positive: "@tui.circle-check",
  negative: "@tui.circle-x",
  warning: "@tui.circle-alert",
  neutral: "@tui.info",
  /* TODO @deprecated remove in v5 */
  success: "@tui.circle-check",
  /* TODO @deprecated remove in v5 */
  error: "@tui.circle-x"
};
var TUI_NOTIFICATION_DEFAULT_OPTIONS = {
  appearance: "info",
  icon: (appearance) => ICONS[appearance] ?? "",
  size: "l"
};
var [TUI_NOTIFICATION_OPTIONS, tuiNotificationOptionsProvider] = tuiCreateOptions(TUI_NOTIFICATION_DEFAULT_OPTIONS);
var TuiNotificationStyles = class _TuiNotificationStyles {
  static {
    this.ɵfac = function TuiNotificationStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiNotificationStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiNotificationStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-notification-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiNotificationStyles_Template(rf, ctx) {
      },
      styles: ['tui-notification,[tuiNotificationV="4.90.0"]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:block;max-block-size:100%;color:var(--tui-text-primary);font:var(--tui-font-text-m);padding:var(--t-offset) var(--tui-padding-l);line-height:1.5rem;border-radius:var(--tui-radius-l);box-sizing:border-box;text-align:start;text-decoration:none;border-inline-start:var(--t-start) solid transparent;border-inline-end:var(--t-end) solid transparent;--t-offset: calc((var(--t-height) - var(--tui-lh)) / 2);--t-height: var(--tui-height-l);--t-start: 0;--t-end: 0}tui-notification[style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2rem}tui-notification[style*="--t-icon-end:"],[tuiNotificationV="4.90.0"][style*="--t-icon-end:"]{--t-end: 1.5rem}tui-notification:before,[tuiNotificationV="4.90.0"]:before{position:absolute;top:calc(var(--t-offset) + var(--tui-lh));left:-1rem;inset-inline-start:-1rem;transform:translateY(-100%)}tui-notification:after,[tuiNotificationV="4.90.0"]:after{position:absolute;top:50%;transform:translateY(-50%);right:-.5rem;font-size:1rem;margin:0;margin-inline-end:-.25rem;margin-inline-start:auto;color:var(--tui-text-tertiary)!important}@supports (inset-inline-end: 0){tui-notification:after,[tuiNotificationV="4.90.0"]:after{right:unset;inset-inline-end:-.5rem}}tui-notification[data-size=s],[tuiNotificationV="4.90.0"][data-size=s]{padding:var(--t-offset) .5rem;font:var(--tui-font-text-s);line-height:1.25rem;border-radius:var(--tui-radius-m);--t-height: var(--tui-height-s)}tui-notification[data-size=s][style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.5rem}tui-notification[data-size=s]:before,[tuiNotificationV="4.90.0"][data-size=s]:before{left:-1rem;inset-inline-start:-.875rem;font-size:1rem}tui-notification[data-size=s]:after,[tuiNotificationV="4.90.0"][data-size=s]:after{right:-.875rem}@supports (inset-inline-end: 0){tui-notification[data-size=s]:after,[tuiNotificationV="4.90.0"][data-size=s]:after{right:unset;inset-inline-end:-.875rem}}tui-notification[data-size=s] tui-icon,[tuiNotificationV="4.90.0"][data-size=s] tui-icon{font-size:1rem}tui-notification[data-size=s] [tuiTitle],[tuiNotificationV="4.90.0"][data-size=s] [tuiTitle]{font:var(--tui-font-text-s);font-weight:700}tui-notification[data-size=s] [tuiSubtitle],[tuiNotificationV="4.90.0"][data-size=s] [tuiSubtitle]{font:var(--tui-font-text-s)}tui-notification[data-size=s] [tuiSubtitle]+*,[tuiNotificationV="4.90.0"][data-size=s] [tuiSubtitle]+*{gap:1rem;margin:.375rem 0 .25rem}tui-notification[data-size=s]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=s]>[tuiIconButton]{top:0;right:0}@supports (inset-inline-end: 0){tui-notification[data-size=s]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=s]>[tuiIconButton]{right:unset;inset-inline-end:0}}tui-notification[data-size=m],[tuiNotificationV="4.90.0"][data-size=m]{padding:var(--t-offset) var(--tui-padding-m);font:var(--tui-font-text-s);line-height:1.25rem;border-radius:var(--tui-radius-m);--t-height: var(--tui-height-m)}tui-notification[data-size=m][style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.625rem}tui-notification[data-size=m]:before,[tuiNotificationV="4.90.0"][data-size=m]:before{left:-.875rem;inset-inline-start:-.875rem;font-size:1.25rem}tui-notification[data-size=m]:after,[tuiNotificationV="4.90.0"][data-size=m]:after{right:-.75rem}@supports (inset-inline-end: 0){tui-notification[data-size=m]:after,[tuiNotificationV="4.90.0"][data-size=m]:after{right:unset;inset-inline-end:-.75rem}}tui-notification[data-size=m] tui-icon,[tuiNotificationV="4.90.0"][data-size=m] tui-icon{font-size:1.25rem}tui-notification[data-size=m] [tuiTitle],[tuiNotificationV="4.90.0"][data-size=m] [tuiTitle]{font:var(--tui-font-text-ui-m);font-weight:700}tui-notification[data-size=m] [tuiSubtitle],[tuiNotificationV="4.90.0"][data-size=m] [tuiSubtitle]{font:var(--tui-font-text-s)}tui-notification[data-size=m] [tuiSubtitle]+*,[tuiNotificationV="4.90.0"][data-size=m] [tuiSubtitle]+*{gap:1rem;margin:.625rem 0 .25rem}tui-notification[data-size=m]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=m]>[tuiIconButton]{top:.375rem;right:.5rem}@supports (inset-inline-end: 0){tui-notification[data-size=m]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=m]>[tuiIconButton]{right:unset;inset-inline-end:.5rem}}tui-notification [tuiTitle],[tuiNotificationV="4.90.0"] [tuiTitle]{gap:.125rem;font:var(--tui-font-text-ui-l);font-weight:700}tui-notification [tuiSubtitle],[tuiNotificationV="4.90.0"] [tuiSubtitle]{font:var(--tui-font-text-m)}tui-notification [tuiSubtitle]+*,[tuiNotificationV="4.90.0"] [tuiSubtitle]+*{display:flex;align-items:center;gap:1.25rem;margin-block-start:.625rem;font:var(--tui-font-text-s)}tui-notification>[tuiIconButton],[tuiNotificationV="4.90.0"]>[tuiIconButton]{position:absolute;top:.75rem;right:.75rem;box-shadow:none!important;background:transparent!important}@supports (inset-inline-end: 0){tui-notification>[tuiIconButton],[tuiNotificationV="4.90.0"]>[tuiIconButton]{right:unset;inset-inline-end:.75rem}}tui-notification:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled),[tuiNotificationV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}tui-notification:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled),[tuiNotificationV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiNotificationStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-notification-${TUI_VERSION}`,
      styles: ['tui-notification,[tuiNotificationV="4.90.0"]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;position:relative;display:block;max-block-size:100%;color:var(--tui-text-primary);font:var(--tui-font-text-m);padding:var(--t-offset) var(--tui-padding-l);line-height:1.5rem;border-radius:var(--tui-radius-l);box-sizing:border-box;text-align:start;text-decoration:none;border-inline-start:var(--t-start) solid transparent;border-inline-end:var(--t-end) solid transparent;--t-offset: calc((var(--t-height) - var(--tui-lh)) / 2);--t-height: var(--tui-height-l);--t-start: 0;--t-end: 0}tui-notification[style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2rem}tui-notification[style*="--t-icon-end:"],[tuiNotificationV="4.90.0"][style*="--t-icon-end:"]{--t-end: 1.5rem}tui-notification:before,[tuiNotificationV="4.90.0"]:before{position:absolute;top:calc(var(--t-offset) + var(--tui-lh));left:-1rem;inset-inline-start:-1rem;transform:translateY(-100%)}tui-notification:after,[tuiNotificationV="4.90.0"]:after{position:absolute;top:50%;transform:translateY(-50%);right:-.5rem;font-size:1rem;margin:0;margin-inline-end:-.25rem;margin-inline-start:auto;color:var(--tui-text-tertiary)!important}@supports (inset-inline-end: 0){tui-notification:after,[tuiNotificationV="4.90.0"]:after{right:unset;inset-inline-end:-.5rem}}tui-notification[data-size=s],[tuiNotificationV="4.90.0"][data-size=s]{padding:var(--t-offset) .5rem;font:var(--tui-font-text-s);line-height:1.25rem;border-radius:var(--tui-radius-m);--t-height: var(--tui-height-s)}tui-notification[data-size=s][style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.5rem}tui-notification[data-size=s]:before,[tuiNotificationV="4.90.0"][data-size=s]:before{left:-1rem;inset-inline-start:-.875rem;font-size:1rem}tui-notification[data-size=s]:after,[tuiNotificationV="4.90.0"][data-size=s]:after{right:-.875rem}@supports (inset-inline-end: 0){tui-notification[data-size=s]:after,[tuiNotificationV="4.90.0"][data-size=s]:after{right:unset;inset-inline-end:-.875rem}}tui-notification[data-size=s] tui-icon,[tuiNotificationV="4.90.0"][data-size=s] tui-icon{font-size:1rem}tui-notification[data-size=s] [tuiTitle],[tuiNotificationV="4.90.0"][data-size=s] [tuiTitle]{font:var(--tui-font-text-s);font-weight:700}tui-notification[data-size=s] [tuiSubtitle],[tuiNotificationV="4.90.0"][data-size=s] [tuiSubtitle]{font:var(--tui-font-text-s)}tui-notification[data-size=s] [tuiSubtitle]+*,[tuiNotificationV="4.90.0"][data-size=s] [tuiSubtitle]+*{gap:1rem;margin:.375rem 0 .25rem}tui-notification[data-size=s]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=s]>[tuiIconButton]{top:0;right:0}@supports (inset-inline-end: 0){tui-notification[data-size=s]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=s]>[tuiIconButton]{right:unset;inset-inline-end:0}}tui-notification[data-size=m],[tuiNotificationV="4.90.0"][data-size=m]{padding:var(--t-offset) var(--tui-padding-m);font:var(--tui-font-text-s);line-height:1.25rem;border-radius:var(--tui-radius-m);--t-height: var(--tui-height-m)}tui-notification[data-size=m][style*="--t-icon-start:"],[tuiNotificationV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.625rem}tui-notification[data-size=m]:before,[tuiNotificationV="4.90.0"][data-size=m]:before{left:-.875rem;inset-inline-start:-.875rem;font-size:1.25rem}tui-notification[data-size=m]:after,[tuiNotificationV="4.90.0"][data-size=m]:after{right:-.75rem}@supports (inset-inline-end: 0){tui-notification[data-size=m]:after,[tuiNotificationV="4.90.0"][data-size=m]:after{right:unset;inset-inline-end:-.75rem}}tui-notification[data-size=m] tui-icon,[tuiNotificationV="4.90.0"][data-size=m] tui-icon{font-size:1.25rem}tui-notification[data-size=m] [tuiTitle],[tuiNotificationV="4.90.0"][data-size=m] [tuiTitle]{font:var(--tui-font-text-ui-m);font-weight:700}tui-notification[data-size=m] [tuiSubtitle],[tuiNotificationV="4.90.0"][data-size=m] [tuiSubtitle]{font:var(--tui-font-text-s)}tui-notification[data-size=m] [tuiSubtitle]+*,[tuiNotificationV="4.90.0"][data-size=m] [tuiSubtitle]+*{gap:1rem;margin:.625rem 0 .25rem}tui-notification[data-size=m]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=m]>[tuiIconButton]{top:.375rem;right:.5rem}@supports (inset-inline-end: 0){tui-notification[data-size=m]>[tuiIconButton],[tuiNotificationV="4.90.0"][data-size=m]>[tuiIconButton]{right:unset;inset-inline-end:.5rem}}tui-notification [tuiTitle],[tuiNotificationV="4.90.0"] [tuiTitle]{gap:.125rem;font:var(--tui-font-text-ui-l);font-weight:700}tui-notification [tuiSubtitle],[tuiNotificationV="4.90.0"] [tuiSubtitle]{font:var(--tui-font-text-m)}tui-notification [tuiSubtitle]+*,[tuiNotificationV="4.90.0"] [tuiSubtitle]+*{display:flex;align-items:center;gap:1.25rem;margin-block-start:.625rem;font:var(--tui-font-text-s)}tui-notification>[tuiIconButton],[tuiNotificationV="4.90.0"]>[tuiIconButton]{position:absolute;top:.75rem;right:.75rem;box-shadow:none!important;background:transparent!important}@supports (inset-inline-end: 0){tui-notification>[tuiIconButton],[tuiNotificationV="4.90.0"]>[tuiIconButton]{right:unset;inset-inline-end:.75rem}}tui-notification:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled),[tuiNotificationV="4.90.0"]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}tui-notification:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled),[tuiNotificationV="4.90.0"]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled){cursor:pointer}\n']
    }]
  }], null, null);
})();
var TuiNotification = class _TuiNotification {
  constructor() {
    this.options = inject(TUI_NOTIFICATION_OPTIONS);
    this.nothing = tuiWithStyles(TuiNotificationStyles);
    this.icons = inject(TuiIcons);
    this.appearance = this.options.appearance;
    this.icon = this.options.icon;
    this.size = this.options.size;
  }
  ngOnInit() {
    this.refresh();
  }
  ngOnChanges() {
    this.refresh();
  }
  refresh() {
    this.icons.iconStart.set(tuiIsString(this.icon) ? this.icon : this.icon(this.appearance));
  }
  static {
    this.ɵfac = function TuiNotification_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiNotification)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiNotification,
      selectors: [["tui-notification"], ["a", "tuiNotification", ""], ["button", "tuiNotification", ""]],
      hostAttrs: ["tuiNotificationV", "4.90.0"],
      hostVars: 1,
      hostBindings: function TuiNotification_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-size", ctx.size);
        }
      },
      inputs: {
        appearance: "appearance",
        icon: "icon",
        size: "size"
      },
      features: [ɵɵProvidersFeature([tuiAppearanceOptionsProvider(TUI_NOTIFICATION_OPTIONS), tuiLinkOptionsProvider({
        appearance: "",
        pseudo: true
      }), tuiButtonOptionsProvider({
        appearance: "outline-grayscale",
        size: "s"
      })]), ɵɵHostDirectivesFeature([TuiWithIcons, TuiWithAppearance]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiNotification, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "tui-notification,a[tuiNotification],button[tuiNotification]",
      providers: [tuiAppearanceOptionsProvider(TUI_NOTIFICATION_OPTIONS), tuiLinkOptionsProvider({
        appearance: "",
        pseudo: true
      }), tuiButtonOptionsProvider({
        appearance: "outline-grayscale",
        size: "s"
      })],
      hostDirectives: [TuiWithIcons, TuiWithAppearance],
      host: {
        tuiNotificationV: TUI_VERSION,
        "[attr.data-size]": "size"
      }
    }]
  }], null, {
    appearance: [{
      type: Input
    }],
    icon: [{
      type: Input
    }],
    size: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-title.mjs
var TuiTitleStyles = class _TuiTitleStyles {
  static {
    this.ɵfac = function TuiTitleStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTitleStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiTitleStyles,
      selectors: [["ng-component"]],
      hostAttrs: [1, "tui-title"],
      decls: 0,
      vars: 0,
      template: function TuiTitleStyles_Template(rf, ctx) {
      },
      styles: ['[tuiTitleV="4.90.0"]{position:relative;display:flex;min-inline-size:0;flex-direction:column;text-align:start;gap:.25rem;margin:0;font:var(--tui-font-text-ui-m)}[tuiTitleV="4.90.0"][data-size=s]{gap:.125rem;font:var(--tui-font-text-s)}[tuiTitleV="4.90.0"][data-size=s] [tuiSubtitle]{font:var(--tui-font-text-xs)}[tuiTitleV="4.90.0"][data-size=m]{gap:.125rem;font:var(--tui-font-heading-5)}[tuiTitleV="4.90.0"][data-size=m] [tuiSubtitle]{font:var(--tui-font-text-m)}[tuiTitleV="4.90.0"][data-size=l]{gap:.5rem;font:var(--tui-font-heading-3)}[tuiTitleV="4.90.0"][data-size=l] [tuiSubtitle]{font:var(--tui-font-text-m)}[tuiTitleV="4.90.0"] h1,[tuiTitleV="4.90.0"] h2,[tuiTitleV="4.90.0"] h3,[tuiTitleV="4.90.0"] h4,[tuiTitleV="4.90.0"] h5,[tuiTitleV="4.90.0"] h6{margin:0;font:inherit}[tuiSubtitle]{font:var(--tui-font-text-ui-s);margin:0}[tuiButton] [tuiTitleV="4.90.0"]{margin-inline-end:auto}[tuiButton] [tuiTitleV="4.90.0"] [tuiSubtitle]{color:var(--tui-text-secondary)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTitleStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "tui-title"
      },
      styles: ['[tuiTitleV="4.90.0"]{position:relative;display:flex;min-inline-size:0;flex-direction:column;text-align:start;gap:.25rem;margin:0;font:var(--tui-font-text-ui-m)}[tuiTitleV="4.90.0"][data-size=s]{gap:.125rem;font:var(--tui-font-text-s)}[tuiTitleV="4.90.0"][data-size=s] [tuiSubtitle]{font:var(--tui-font-text-xs)}[tuiTitleV="4.90.0"][data-size=m]{gap:.125rem;font:var(--tui-font-heading-5)}[tuiTitleV="4.90.0"][data-size=m] [tuiSubtitle]{font:var(--tui-font-text-m)}[tuiTitleV="4.90.0"][data-size=l]{gap:.5rem;font:var(--tui-font-heading-3)}[tuiTitleV="4.90.0"][data-size=l] [tuiSubtitle]{font:var(--tui-font-text-m)}[tuiTitleV="4.90.0"] h1,[tuiTitleV="4.90.0"] h2,[tuiTitleV="4.90.0"] h3,[tuiTitleV="4.90.0"] h4,[tuiTitleV="4.90.0"] h5,[tuiTitleV="4.90.0"] h6{margin:0;font:inherit}[tuiSubtitle]{font:var(--tui-font-text-ui-s);margin:0}[tuiButton] [tuiTitleV="4.90.0"]{margin-inline-end:auto}[tuiButton] [tuiTitleV="4.90.0"] [tuiSubtitle]{color:var(--tui-text-secondary)}\n']
    }]
  }], null, null);
})();
var TuiTitle = class _TuiTitle {
  constructor() {
    this.nothing = tuiWithStyles(TuiTitleStyles);
    this.size = "";
  }
  static {
    this.ɵfac = function TuiTitle_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTitle)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTitle,
      selectors: [["", "tuiTitle", ""]],
      hostAttrs: ["tuiTitle", "", "tuiTitleV", "4.90.0"],
      hostVars: 1,
      hostBindings: function TuiTitle_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-size", ctx.size || null);
        }
      },
      inputs: {
        size: [0, "tuiTitle", "size"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTitle, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiTitle]",
      host: {
        tuiTitle: "",
        tuiTitleV: TUI_VERSION,
        "[attr.data-size]": "size || null"
      }
    }]
  }], null, {
    size: [{
      type: Input,
      args: ["tuiTitle"]
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-popover.mjs
var TuiPopoverDirective = class _TuiPopoverDirective extends PolymorpheusTemplate {
  constructor() {
    super(...arguments);
    this.service = inject(TuiPopoverService);
    this.open$ = new Subject();
    this.options = {};
    this.open = false;
    this.openChange = this.open$.pipe(distinctUntilChanged(), tuiIfMap(() => this.service.open(this, this.options).pipe(ignoreElements(), endWith(false))), share());
  }
  ngOnChanges() {
    this.open$.next(this.open);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiPopoverDirective_BaseFactory;
      return function TuiPopoverDirective_Factory(__ngFactoryType__) {
        return (ɵTuiPopoverDirective_BaseFactory || (ɵTuiPopoverDirective_BaseFactory = ɵɵgetInheritedFactory(_TuiPopoverDirective)))(__ngFactoryType__ || _TuiPopoverDirective);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiPopoverDirective,
      standalone: false,
      features: [ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPopoverDirective, [{
    type: Directive
  }], null, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-pipes-mapper.mjs
var TuiMapperPipe = class _TuiMapperPipe {
  /**
   * Maps object to an arbitrary result through a mapper function
   *
   * @param value an item to transform
   * @param mapper a mapping function
   * @param args arbitrary number of additional arguments
   */
  transform(value, mapper, ...args) {
    return mapper(value, ...args);
  }
  static {
    this.ɵfac = function TuiMapperPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiMapperPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiMapper",
      type: _TuiMapperPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiMapperPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiMapper"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-alert.mjs
function TuiAlertComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r1, " ");
  }
}
function TuiAlertComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 7);
  }
  if (rf & 2) {
    const text_r2 = ctx.polymorpheusOutlet;
    ɵɵproperty("innerHTML", text_r2, ɵɵsanitizeHtml);
  }
}
function TuiAlertComponent_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 8);
    ɵɵlistener("click", function TuiAlertComponent_button_6_Template_button_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r3 = ɵɵnextContext();
      return ɵɵresetView(ctx_r3.item.$implicit.complete());
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = ɵɵnextContext();
    ɵɵproperty("iconStart", ctx_r3.icons.close);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r3.close(), " ");
  }
}
function TuiAlerts_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0, 3);
    ɵɵpipe(1, "tuiMapper");
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngComponentOutlet", item_r1.component.component)("ngComponentOutletInjector", ɵɵpipeBind2(1, 2, item_r1, ctx_r1.mapper));
  }
}
function TuiAlerts_div_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, TuiAlerts_div_0_ng_container_1_Template, 2, 5, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const group_r3 = ctx.$implicit;
    ɵɵadvance();
    ɵɵproperty("ngForOf", group_r3);
  }
}
var TUI_ALERT_DEFAULT_OPTIONS = {
  autoClose: 3e3,
  label: "",
  closeable: true,
  data: void 0
};
var TUI_ALERT_OPTIONS = new InjectionToken(ngDevMode ? "TUI_ALERT_OPTIONS" : "", {
  factory: () => __spreadValues(__spreadValues({}, TUI_ALERT_DEFAULT_OPTIONS), inject(TUI_NOTIFICATION_OPTIONS))
});
var TUI_ALERT_POSITION = new InjectionToken(ngDevMode ? "TUI_ALERT_POSITION" : "", {
  factory: () => inject(TUI_IS_MOBILE) ? "1rem 1rem 0 auto" : "2rem 3rem 0 auto"
});
var TUI_ALERTS = new InjectionToken(ngDevMode ? "TUI_ALERTS" : "", {
  factory: () => new BehaviorSubject([])
});
var TUI_ALERTS_GROUPED = new InjectionToken(ngDevMode ? "TUI_ALERTS_GROUPED" : "");
function tuiAlertOptionsProvider(options) {
  return {
    provide: TUI_ALERT_OPTIONS,
    useFactory: () => __spreadValues(__spreadValues(__spreadValues({}, TUI_ALERT_DEFAULT_OPTIONS), inject(TUI_ALERT_OPTIONS, {
      optional: true,
      skipSelf: true
    }) || inject(TUI_NOTIFICATION_OPTIONS)), options)
  };
}
var TuiAlertComponent = class _TuiAlertComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.icons = inject(TUI_COMMON_ICONS);
    this.close = toSignal(inject(TUI_CLOSE_WORD));
    this.position = inject(TUI_ALERT_POSITION);
    this.item = injectContext();
    this.sub = of(typeof this.item.autoClose === "function" ? this.item.autoClose(this.item.appearance) : this.item.autoClose).pipe(switchMap((autoClose) => autoClose ? timer(autoClose) : EMPTY), takeUntil(fromEvent(this.el, "mouseenter")), repeat({
      delay: () => fromEvent(this.el, "mouseleave")
    }), takeUntilDestroyed()).subscribe(() => this.item.$implicit.complete());
  }
  get from() {
    return this.position.endsWith("auto") ? "translateX(100%)" : "translateX(-100%)";
  }
  static {
    this.ɵfac = function TuiAlertComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAlertComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiAlertComponent,
      selectors: [["tui-alert"]],
      hostAttrs: ["role", "alert"],
      hostVars: 4,
      hostBindings: function TuiAlertComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵstyleProp("margin", ctx.position)("--tui-from", ctx.from);
        }
      },
      features: [ɵɵHostDirectivesFeature([TuiAnimated])],
      decls: 7,
      vars: 9,
      consts: [[1, "t-wrapper"], ["size", "m", 3, "appearance", "icon"], ["tuiTitle", ""], [4, "polymorpheusOutlet", "polymorpheusOutletContext"], ["tuiSubtitle", ""], [3, "innerHTML", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], ["tuiIconButton", "", "type", "button", 3, "iconStart", "click", 4, "ngIf"], [3, "innerHTML"], ["tuiIconButton", "", "type", "button", 3, "click", "iconStart"]],
      template: function TuiAlertComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelementStart(0, "div", 0)(1, "tui-notification", 1)(2, "span", 2);
          ɵɵtemplate(3, TuiAlertComponent_ng_container_3_Template, 2, 1, "ng-container", 3);
          ɵɵelementStart(4, "span", 4);
          ɵɵtemplate(5, TuiAlertComponent_span_5_Template, 1, 1, "span", 5);
          ɵɵelementEnd()();
          ɵɵtemplate(6, TuiAlertComponent_button_6_Template, 2, 2, "button", 6);
          ɵɵelementEnd()();
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵclassProp("t-closeable", ctx.item.closeable);
          ɵɵproperty("appearance", ctx.item.appearance)("icon", ctx.item.icon);
          ɵɵadvance(2);
          ɵɵproperty("polymorpheusOutlet", ctx.item.label)("polymorpheusOutletContext", ctx.item);
          ɵɵadvance(2);
          ɵɵproperty("polymorpheusOutlet", ctx.item.content)("polymorpheusOutletContext", ctx.item);
          ɵɵadvance();
          ɵɵproperty("ngIf", ctx.item.closeable);
        }
      },
      dependencies: [NgIf, PolymorpheusOutlet, TuiButton, TuiNotification, TuiTitle],
      styles: ["[_nghost-%COMP%]{display:grid;inline-size:18rem;flex-shrink:0;word-break:break-word}.tui-enter[_nghost-%COMP%], .tui-leave[_nghost-%COMP%]{animation-name:tuiFade,tuiSlide,tuiCollapse}[_nghost-%COMP%]:not(:first-child){margin-block-start:0!important}[_nghost-%COMP%]:not(:last-child){margin-block-end:0!important}.t-wrapper[_ngcontent-%COMP%]{transition-property:margin;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;grid-row:1 / span 2;overflow:hidden;margin-block-end:.75rem;background:var(--tui-background-base);border-radius:var(--tui-radius-m);box-shadow:var(--tui-shadow-medium)}.tui-leave[_nghost-%COMP%]   .t-wrapper[_ngcontent-%COMP%]{margin:0}.t-closeable[data-size][_ngcontent-%COMP%]{padding-inline-end:2.5rem}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAlertComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-alert",
      imports: [NgIf, PolymorpheusOutlet, TuiButton, TuiNotification, TuiTitle],
      changeDetection: ChangeDetectionStrategy.OnPush,
      hostDirectives: [TuiAnimated],
      host: {
        role: "alert",
        "[style.margin]": "position",
        "[style.--tui-from]": "from"
      },
      template: '<div class="t-wrapper">\n    <tui-notification\n        size="m"\n        [appearance]="item.appearance"\n        [class.t-closeable]="item.closeable"\n        [icon]="item.icon"\n    >\n        <span tuiTitle>\n            <ng-container *polymorpheusOutlet="item.label as text; context: item">\n                {{ text }}\n            </ng-container>\n            <span tuiSubtitle>\n                <span\n                    *polymorpheusOutlet="item.content as text; context: item"\n                    [innerHTML]="text"\n                ></span>\n            </span>\n        </span>\n        <button\n            *ngIf="item.closeable"\n            tuiIconButton\n            type="button"\n            [iconStart]="icons.close"\n            (click)="item.$implicit.complete()"\n        >\n            {{ close() }}\n        </button>\n    </tui-notification>\n</div>\n',
      styles: [":host{display:grid;inline-size:18rem;flex-shrink:0;word-break:break-word}:host.tui-enter,:host.tui-leave{animation-name:tuiFade,tuiSlide,tuiCollapse}:host:not(:first-child){margin-block-start:0!important}:host:not(:last-child){margin-block-end:0!important}.t-wrapper{transition-property:margin;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;grid-row:1 / span 2;overflow:hidden;margin-block-end:.75rem;background:var(--tui-background-base);border-radius:var(--tui-radius-m);box-shadow:var(--tui-shadow-medium)}:host.tui-leave .t-wrapper{margin:0}.t-closeable[data-size]{padding-inline-end:2.5rem}\n"]
    }]
  }], null, null);
})();
var TuiAlertService = class _TuiAlertService extends TuiPopoverService {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiAlertService_BaseFactory;
      return function TuiAlertService_Factory(__ngFactoryType__) {
        return (ɵTuiAlertService_BaseFactory || (ɵTuiAlertService_BaseFactory = ɵɵgetInheritedFactory(_TuiAlertService)))(__ngFactoryType__ || _TuiAlertService);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiAlertService,
      factory: () => (() => new _TuiAlertService(TUI_ALERTS, TuiAlertComponent, inject(TUI_ALERT_OPTIONS)))(),
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAlertService, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => new TuiAlertService(TUI_ALERTS, TuiAlertComponent, inject(TUI_ALERT_OPTIONS))
    }]
  }], null, null);
})();
var TuiAlert = class _TuiAlert extends TuiPopoverDirective {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiAlert_BaseFactory;
      return function TuiAlert_Factory(__ngFactoryType__) {
        return (ɵTuiAlert_BaseFactory || (ɵTuiAlert_BaseFactory = ɵɵgetInheritedFactory(_TuiAlert)))(__ngFactoryType__ || _TuiAlert);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiAlert,
      selectors: [["ng-template", "tuiAlert", ""]],
      inputs: {
        options: [0, "tuiAlertOptions", "options"],
        open: [0, "tuiAlert", "open"]
      },
      outputs: {
        openChange: "tuiAlertChange"
      },
      features: [ɵɵProvidersFeature([tuiAsPopover(TuiAlertService)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAlert, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiAlert]",
      inputs: ["options: tuiAlertOptions", "open: tuiAlert"],
      outputs: ["openChange: tuiAlertChange"],
      providers: [tuiAsPopover(TuiAlertService)]
    }]
  }], null, null);
})();
var TuiAlerts = class _TuiAlerts {
  constructor() {
    this.injector = inject(INJECTOR$1);
    this.alerts$ = inject(TUI_ALERTS_GROUPED);
    this.trackBy = identity;
    this.mapper = (useValue) => Injector.create({
      providers: [{
        provide: POLYMORPHEUS_CONTEXT,
        useValue
      }],
      parent: this.injector
    });
  }
  static {
    this.ɵfac = function TuiAlerts_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAlerts)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiAlerts,
      selectors: [["tui-alerts"]],
      features: [ɵɵProvidersFeature([{
        provide: TUI_ALERTS_GROUPED,
        useFactory: () => combineLatest([of(/* @__PURE__ */ new Map()), inject(TUI_ALERTS)]).pipe(map(([map2, alerts]) => {
          map2.forEach((_, key) => map2.set(key, []));
          alerts.forEach((alert) => {
            const key = alert.component.component;
            const value = map2.get(key) || [];
            map2.set(key, [...value, alert]);
          });
          return Array.from(map2.values());
        }))
      }])],
      decls: 2,
      vars: 4,
      consts: [["tuiAnimatedParent", "", "class", "t-wrapper", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["tuiAnimatedParent", "", 1, "t-wrapper"], [3, "ngComponentOutlet", "ngComponentOutletInjector", 4, "ngFor", "ngForOf"], [3, "ngComponentOutlet", "ngComponentOutletInjector"]],
      template: function TuiAlerts_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiAlerts_div_0_Template, 2, 1, "div", 0);
          ɵɵpipe(1, "async");
        }
        if (rf & 2) {
          ɵɵproperty("ngForOf", ɵɵpipeBind1(1, 2, ctx.alerts$))("ngForTrackBy", ctx.trackBy);
        }
      },
      dependencies: [AsyncPipe, NgComponentOutlet, NgForOf, TuiAnimatedParent, TuiMapperPipe],
      styles: ["tui-alerts>.t-wrapper{position:fixed;top:0;left:0;inline-size:100%;display:flex;flex-direction:column;pointer-events:none;box-sizing:border-box;block-size:100%;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}tui-alerts>.t-wrapper>*{pointer-events:auto}\n"],
      encapsulation: 2,
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAlerts, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-alerts",
      imports: [AsyncPipe, NgComponentOutlet, NgForOf, TuiAnimatedParent, TuiMapperPipe],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [{
        provide: TUI_ALERTS_GROUPED,
        useFactory: () => combineLatest([of(/* @__PURE__ */ new Map()), inject(TUI_ALERTS)]).pipe(map(([map2, alerts]) => {
          map2.forEach((_, key) => map2.set(key, []));
          alerts.forEach((alert) => {
            const key = alert.component.component;
            const value = map2.get(key) || [];
            map2.set(key, [...value, alert]);
          });
          return Array.from(map2.values());
        }))
      }],
      template: '<div\n    *ngFor="let group of alerts$ | async; trackBy: trackBy"\n    tuiAnimatedParent\n    class="t-wrapper"\n>\n    <ng-container\n        *ngFor="let item of group"\n        [ngComponentOutlet]="item.component.component"\n        [ngComponentOutletInjector]="item | tuiMapper: mapper"\n    />\n</div>\n',
      styles: ["tui-alerts>.t-wrapper{position:fixed;top:0;left:0;inline-size:100%;display:flex;flex-direction:column;pointer-events:none;box-sizing:border-box;block-size:100%;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}tui-alerts>.t-wrapper>*{pointer-events:auto}\n"]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-date-format.mjs
var TuiDateFormat = class _TuiDateFormat extends Observable {
  constructor() {
    super((subscriber) => combineLatest([this.parent, this.settings]).pipe(map(([parent, settings]) => __spreadValues(__spreadValues({}, parent), settings))).subscribe(subscriber));
    this.settings = new ReplaySubject(1);
    this.parent = inject(TUI_DATE_FORMAT, {
      skipSelf: true
    });
  }
  set tuiDateFormat(format) {
    this.settings.next(format);
  }
  static {
    this.ɵfac = function TuiDateFormat_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDateFormat)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDateFormat,
      selectors: [["", "tuiDateFormat", ""]],
      inputs: {
        tuiDateFormat: "tuiDateFormat"
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_DATE_FORMAT, _TuiDateFormat)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDateFormat, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDateFormat]",
      providers: [tuiProvide(TUI_DATE_FORMAT, TuiDateFormat)]
    }]
  }], function() {
    return [];
  }, {
    tuiDateFormat: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-group.mjs
var TUI_GROUP_DEFAULT_OPTIONS = {
  size: "l",
  collapsed: false,
  rounded: true,
  orientation: "horizontal"
};
var TUI_GROUP_OPTIONS = new InjectionToken(ngDevMode ? "TUI_GROUP_OPTIONS" : "", {
  factory: () => TUI_GROUP_DEFAULT_OPTIONS
});
function tuiGroupOptionsProvider(options) {
  return tuiProvideOptions(TUI_GROUP_OPTIONS, options, TUI_GROUP_DEFAULT_OPTIONS);
}
var TuiGroupStyles = class _TuiGroupStyles {
  static {
    this.ɵfac = function TuiGroupStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiGroupStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiGroupStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-group-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiGroupStyles_Template(rf, ctx) {
      },
      styles: ['[tuiGroupV="4.90.0"]{position:relative;display:flex;transform:translateZ(0);--t-group-radius: var(--tui-radius-l);--t-group-margin: -1px;--t-group-mask: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-end: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px);--t-group-mask-start: linear-gradient(to right, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) )}[tuiGroupV="4.90.0"]>*{z-index:1;flex:1 1 0;min-inline-size:0;-webkit-mask:var(--t-group-mask);mask:var(--t-group-mask);-webkit-mask-clip:no-clip;mask-clip:no-clip}[tuiGroupV="4.90.0"]>*:disabled,[tuiGroupV="4.90.0"]>*._disabled{z-index:0}[tuiGroupV="4.90.0"]>*:invalid:not([data-mode]),[tuiGroupV="4.90.0"]>*[data-mode~=invalid]{z-index:2;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has(:invalid:not([data-mode])),[tuiGroupV="4.90.0"]>*:has([data-mode~=invalid]){z-index:2;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has(:focus-visible){z-index:3;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has([data-focus=true]){z-index:3;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:checked:not([data-mode]),[tuiGroupV="4.90.0"]>*[data-mode~=checked]{z-index:4;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has([tuiBlock]:checked){z-index:4;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:not(:last-child){margin-inline-end:var(--t-group-margin)}[tuiGroupV="4.90.0"]>*:nth-child(n){border-radius:0}[tuiGroupV="4.90.0"]>*:first-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[tuiGroupV="4.90.0"]>*:last-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[tuiGroupV="4.90.0"]>*:only-child{border-radius:var(--t-group-radius);-webkit-mask:none;mask:none}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:first-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:last-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask:none;mask:none}[tuiGroupV="4.90.0"][data-size=s],[tuiGroupV="4.90.0"][data-size=m]{--t-group-radius: var(--tui-radius-m)}[tuiGroupV="4.90.0"][data-orientation=vertical]{display:inline-flex;flex-direction:column;--t-group-mask: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-start: linear-gradient(to bottom, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) );--t-group-mask-end: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*{min-block-size:auto;flex:0 0 auto}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:not(:last-child){margin-inline-end:0;margin-block-end:var(--t-group-margin)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:first-child{border-radius:var(--t-group-radius) var(--t-group-radius) 0 0}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:last-child{border-radius:0 0 var(--t-group-radius) var(--t-group-radius)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:only-child{border-radius:var(--t-group-radius)}.tui-group{position:relative;display:flex;isolation:isolate;--t-group-radius: var(--tui-radius-m)}.tui-group>*{flex:1 1 0;min-inline-size:0}.tui-group>*:not(:last-child){margin-inline-end:.125rem}.tui-group.tui-group>*:nth-child(n){border-radius:0}.tui-group_radius_large{--t-group-radius: var(--tui-radius-l)}.tui-group_collapsed>*{z-index:1}.tui-group_collapsed>*:not(:last-child){margin:0 -1px 0 0}.tui-group_collapsed>*._readonly,.tui-group_collapsed>*._disabled,.tui-group_collapsed>*._readonly:hover,.tui-group_collapsed>*._disabled:hover{z-index:0}.tui-group_collapsed>*._invalid{z-index:2}.tui-group_collapsed>*._invalid:hover,.tui-group_collapsed>*._invalid._hovered,.tui-group_collapsed>*._invalid._pressed{z-index:4}.tui-group_collapsed>*:hover,.tui-group_collapsed>*._hovered,.tui-group_collapsed>*._pressed{z-index:3}.tui-group_collapsed>*._hosted_dropdown_focused,.tui-group_collapsed>*._focus-visible,.tui-group_collapsed>*._focused.ng-touched,.tui-group_collapsed>*._focused.ng-untouched{z-index:5}.tui-group_collapsed>*._active,.tui-group_collapsed>*[data-appearance=whiteblock-active]{z-index:6}.tui-group_collapsed>*:has([tuiBlock]:checked){z-index:6}.tui-group_collapsed>*._focus-visible._focused,.tui-group_collapsed>*._focus-visible._active,.tui-group_collapsed>*._focus-visible[data-appearance=whiteblock-active]{z-index:7}.tui-group_orientation_vertical{display:inline-flex;flex-direction:column}.tui-group_orientation_vertical>*{min-block-size:auto;flex:0 0 auto}.tui-group_orientation_vertical>*:not(:last-child){margin-inline-end:0;margin-block-end:.125rem}.tui-group_orientation_vertical.tui-group_collapsed>*:not(:last-child){margin:0 0 -1px}.tui-group_rounded.tui-group_orientation_horizontal>*:first-child{border-top-left-radius:var(--t-group-radius);border-bottom-left-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_horizontal>*:last-child{border-top-right-radius:var(--t-group-radius);border-bottom-right-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_vertical>*:first-child{border-top-left-radius:var(--t-group-radius);border-top-right-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_vertical>*:last-child{border-bottom-left-radius:var(--t-group-radius);border-bottom-right-radius:var(--t-group-radius)}.tui-group__auto-width-item{min-inline-size:auto;flex:0 0 auto}.tui-group__inherit-item{border-radius:inherit!important}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiGroupStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-group-${TUI_VERSION}`,
      styles: ['[tuiGroupV="4.90.0"]{position:relative;display:flex;transform:translateZ(0);--t-group-radius: var(--tui-radius-l);--t-group-margin: -1px;--t-group-mask: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-end: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px);--t-group-mask-start: linear-gradient(to right, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) )}[tuiGroupV="4.90.0"]>*{z-index:1;flex:1 1 0;min-inline-size:0;-webkit-mask:var(--t-group-mask);mask:var(--t-group-mask);-webkit-mask-clip:no-clip;mask-clip:no-clip}[tuiGroupV="4.90.0"]>*:disabled,[tuiGroupV="4.90.0"]>*._disabled{z-index:0}[tuiGroupV="4.90.0"]>*:invalid:not([data-mode]),[tuiGroupV="4.90.0"]>*[data-mode~=invalid]{z-index:2;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has(:invalid:not([data-mode])),[tuiGroupV="4.90.0"]>*:has([data-mode~=invalid]){z-index:2;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has(:focus-visible){z-index:3;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has([data-focus=true]){z-index:3;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:checked:not([data-mode]),[tuiGroupV="4.90.0"]>*[data-mode~=checked]{z-index:4;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:has([tuiBlock]:checked){z-index:4;--t-group-mask: none}[tuiGroupV="4.90.0"]>*:not(:last-child){margin-inline-end:var(--t-group-margin)}[tuiGroupV="4.90.0"]>*:nth-child(n){border-radius:0}[tuiGroupV="4.90.0"]>*:first-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[tuiGroupV="4.90.0"]>*:last-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[tuiGroupV="4.90.0"]>*:only-child{border-radius:var(--t-group-radius);-webkit-mask:none;mask:none}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:first-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:last-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[dir=rtl] [tuiGroupV="4.90.0"]:not([data-orientation=vertical])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask:none;mask:none}[tuiGroupV="4.90.0"][data-size=s],[tuiGroupV="4.90.0"][data-size=m]{--t-group-radius: var(--tui-radius-m)}[tuiGroupV="4.90.0"][data-orientation=vertical]{display:inline-flex;flex-direction:column;--t-group-mask: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-start: linear-gradient(to bottom, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) );--t-group-mask-end: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*{min-block-size:auto;flex:0 0 auto}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:not(:last-child){margin-inline-end:0;margin-block-end:var(--t-group-margin)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:first-child{border-radius:var(--t-group-radius) var(--t-group-radius) 0 0}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:last-child{border-radius:0 0 var(--t-group-radius) var(--t-group-radius)}[tuiGroupV="4.90.0"][data-orientation=vertical]>*:only-child{border-radius:var(--t-group-radius)}.tui-group{position:relative;display:flex;isolation:isolate;--t-group-radius: var(--tui-radius-m)}.tui-group>*{flex:1 1 0;min-inline-size:0}.tui-group>*:not(:last-child){margin-inline-end:.125rem}.tui-group.tui-group>*:nth-child(n){border-radius:0}.tui-group_radius_large{--t-group-radius: var(--tui-radius-l)}.tui-group_collapsed>*{z-index:1}.tui-group_collapsed>*:not(:last-child){margin:0 -1px 0 0}.tui-group_collapsed>*._readonly,.tui-group_collapsed>*._disabled,.tui-group_collapsed>*._readonly:hover,.tui-group_collapsed>*._disabled:hover{z-index:0}.tui-group_collapsed>*._invalid{z-index:2}.tui-group_collapsed>*._invalid:hover,.tui-group_collapsed>*._invalid._hovered,.tui-group_collapsed>*._invalid._pressed{z-index:4}.tui-group_collapsed>*:hover,.tui-group_collapsed>*._hovered,.tui-group_collapsed>*._pressed{z-index:3}.tui-group_collapsed>*._hosted_dropdown_focused,.tui-group_collapsed>*._focus-visible,.tui-group_collapsed>*._focused.ng-touched,.tui-group_collapsed>*._focused.ng-untouched{z-index:5}.tui-group_collapsed>*._active,.tui-group_collapsed>*[data-appearance=whiteblock-active]{z-index:6}.tui-group_collapsed>*:has([tuiBlock]:checked){z-index:6}.tui-group_collapsed>*._focus-visible._focused,.tui-group_collapsed>*._focus-visible._active,.tui-group_collapsed>*._focus-visible[data-appearance=whiteblock-active]{z-index:7}.tui-group_orientation_vertical{display:inline-flex;flex-direction:column}.tui-group_orientation_vertical>*{min-block-size:auto;flex:0 0 auto}.tui-group_orientation_vertical>*:not(:last-child){margin-inline-end:0;margin-block-end:.125rem}.tui-group_orientation_vertical.tui-group_collapsed>*:not(:last-child){margin:0 0 -1px}.tui-group_rounded.tui-group_orientation_horizontal>*:first-child{border-top-left-radius:var(--t-group-radius);border-bottom-left-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_horizontal>*:last-child{border-top-right-radius:var(--t-group-radius);border-bottom-right-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_vertical>*:first-child{border-top-left-radius:var(--t-group-radius);border-top-right-radius:var(--t-group-radius)}.tui-group_rounded.tui-group_orientation_vertical>*:last-child{border-bottom-left-radius:var(--t-group-radius);border-bottom-right-radius:var(--t-group-radius)}.tui-group__auto-width-item{min-inline-size:auto;flex:0 0 auto}.tui-group__inherit-item{border-radius:inherit!important}\n']
    }]
  }], null, null);
})();
var TuiGroup = class _TuiGroup {
  constructor() {
    this.options = inject(TUI_GROUP_OPTIONS);
    this.nothing = tuiWithStyles(TuiGroupStyles);
    this.orientation = this.options.orientation;
    this.collapsed = this.options.collapsed;
    this.rounded = this.options.rounded;
    this.size = this.options.size;
  }
  static {
    this.ɵfac = function TuiGroup_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiGroup)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiGroup,
      selectors: [["", "tuiGroup", "", 5, "ng-container"]],
      hostAttrs: ["tuiGroup", "", "tuiGroupV", "4.90.0"],
      hostVars: 12,
      hostBindings: function TuiGroup_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-orientation", ctx.orientation)("data-size", ctx.size);
          ɵɵstyleProp("--t-group-radius", ctx.rounded ? null : 0)("--t-group-margin", ctx.collapsed ? null : 0.125, "rem")("--t-group-mask", ctx.collapsed ? null : "none")("--t-group-mask-start", ctx.collapsed ? null : "none")("--t-group-mask-end", ctx.collapsed ? null : "none");
        }
      },
      inputs: {
        orientation: "orientation",
        collapsed: "collapsed",
        rounded: "rounded",
        size: "size"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiGroup, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiGroup]:not(ng-container)",
      host: {
        tuiGroup: "",
        tuiGroupV: TUI_VERSION,
        "[attr.data-orientation]": "orientation",
        "[attr.data-size]": "size",
        "[style.--t-group-radius]": "rounded ? null : 0",
        "[style.--t-group-margin.rem]": "collapsed ? null : 0.125",
        "[style.--t-group-mask]": 'collapsed ? null : "none"',
        "[style.--t-group-mask-start]": 'collapsed ? null : "none"',
        "[style.--t-group-mask-end]": 'collapsed ? null : "none"'
      }
    }]
  }], null, {
    orientation: [{
      type: Input
    }],
    collapsed: [{
      type: Input
    }],
    rounded: [{
      type: Input
    }],
    size: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-hovered.mjs
function movedOut({
  currentTarget,
  relatedTarget
}) {
  return !tuiIsElement(relatedTarget) || !tuiIsElement(currentTarget) || !currentTarget.contains(relatedTarget);
}
var TuiHoveredService = class _TuiHoveredService extends Observable {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.el = tuiInjectElement();
    this.zone = inject(NgZone);
    this.stream$ = merge(
      tuiTypedFromEvent(this.el, "mouseenter").pipe(map(TUI_TRUE_HANDLER)),
      tuiTypedFromEvent(this.el, "mouseleave").pipe(map(TUI_FALSE_HANDLER)),
      // Hello, Safari
      tuiTypedFromEvent(this.el, "mouseout").pipe(filter(movedOut), map(TUI_FALSE_HANDLER))
    ).pipe(distinctUntilChanged(), tuiZoneOptimized(this.zone));
  }
  static {
    this.ɵfac = function TuiHoveredService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHoveredService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiHoveredService,
      factory: _TuiHoveredService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHoveredService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var TuiHovered = class _TuiHovered {
  constructor() {
    this.tuiHoveredChange = inject(TuiHoveredService);
  }
  static {
    this.ɵfac = function TuiHovered_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHovered)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHovered,
      selectors: [["", "tuiHoveredChange", ""]],
      outputs: {
        tuiHoveredChange: "tuiHoveredChange"
      },
      features: [ɵɵProvidersFeature([TuiHoveredService])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHovered, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHoveredChange]",
      providers: [TuiHoveredService]
    }]
  }], null, {
    tuiHoveredChange: [{
      type: Output
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-hint.mjs
function TuiHintUnstyledComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
var _c0 = ["*"];
function TuiHintComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 1);
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵproperty("innerHTML", text_r1, ɵɵsanitizeHtml);
  }
}
var _c1 = (a0) => ({
  $implicit: a0
});
function TuiHints_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TuiHints_div_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, TuiHints_div_0_ng_container_1_Template, 1, 0, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const hint_r1 = ctx.$implicit;
    ɵɵproperty("tuiActiveZoneParent", hint_r1.activeZone || null);
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", hint_r1.component)("polymorpheusOutletContext", ɵɵpureFunction1(3, _c1, hint_r1));
  }
}
var TUI_HINT_COMPONENT = new InjectionToken(ngDevMode ? "TUI_HINT_COMPONENT" : "", {
  factory: () => TuiHintComponent
});
var TuiHintService = class _TuiHintService extends BehaviorSubject {
  constructor() {
    super([]);
  }
  add(directive) {
    this.next(this.value.concat(directive));
  }
  remove(directive) {
    if (this.value.includes(directive)) {
      this.next(this.value.filter((hint) => hint !== directive));
    }
  }
  static {
    this.ɵfac = function TuiHintService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiHintService,
      factory: _TuiHintService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiHintDriver = class _TuiHintDriver extends TuiDriverDirective {
  constructor() {
    super(...arguments);
    this.type = "hint";
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiHintDriver_BaseFactory;
      return function TuiHintDriver_Factory(__ngFactoryType__) {
        return (ɵTuiHintDriver_BaseFactory || (ɵTuiHintDriver_BaseFactory = ɵɵgetInheritedFactory(_TuiHintDriver)))(__ngFactoryType__ || _TuiHintDriver);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintDriver,
      features: [ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDriver, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, null);
})();
var TUI_HINT_DIRECTIONS = ["bottom-left", "bottom", "bottom-right", "top-left", "top", "top-right", "left-top", "left", "left-bottom", "right-top", "right", "right-bottom"];
var TUI_HINT_DEFAULT_OPTIONS = {
  direction: "bottom-left",
  showDelay: 500,
  hideDelay: 200,
  appearance: "",
  /** TODO @deprecated use {@link TUI_TOOLTIP_OPTIONS} instead **/
  icon: "@tui.circle-help"
};
var TUI_HINT_OPTIONS = new InjectionToken(ngDevMode ? "TUI_HINT_OPTIONS" : "", {
  factory: () => TUI_HINT_DEFAULT_OPTIONS
});
var tuiHintOptionsProvider = (override) => ({
  provide: TUI_HINT_OPTIONS,
  deps: [[new Optional(), new Self(), TuiHintOptionsDirective], [new Optional(), new SkipSelf(), TUI_HINT_OPTIONS]],
  useFactory: tuiOverrideOptions(override, TUI_HINT_DEFAULT_OPTIONS)
});
var TuiHintOptionsDirective = class _TuiHintOptionsDirective {
  constructor() {
    this.options = inject(TUI_HINT_OPTIONS, {
      skipSelf: true
    });
    this.direction = this.options.direction;
    this.appearance = this.options.appearance;
    this.showDelay = this.options.showDelay;
    this.hideDelay = this.options.hideDelay;
    this.icon = this.options.icon;
    this.change$ = new Subject();
  }
  ngOnChanges() {
    this.change$.next();
  }
  static {
    this.ɵfac = function TuiHintOptionsDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintOptionsDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintOptionsDirective,
      selectors: [["", "tuiHintContent", ""]],
      inputs: {
        content: [0, "tuiHintContent", "content"],
        direction: [0, "tuiHintDirection", "direction"],
        appearance: [0, "tuiHintAppearance", "appearance"],
        showDelay: [0, "tuiHintShowDelay", "showDelay"],
        hideDelay: [0, "tuiHintHideDelay", "hideDelay"]
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_HINT_OPTIONS, _TuiHintOptionsDirective)]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintOptionsDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHintContent]",
      providers: [tuiProvide(TUI_HINT_OPTIONS, TuiHintOptionsDirective)]
    }]
  }], null, {
    content: [{
      type: Input,
      args: ["tuiHintContent"]
    }],
    direction: [{
      type: Input,
      args: ["tuiHintDirection"]
    }],
    appearance: [{
      type: Input,
      args: ["tuiHintAppearance"]
    }],
    showDelay: [{
      type: Input,
      args: ["tuiHintShowDelay"]
    }],
    hideDelay: [{
      type: Input,
      args: ["tuiHintHideDelay"]
    }]
  });
})();
var TuiHintHover = class _TuiHintHover extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.isMobile = inject(TUI_IS_MOBILE);
    this.el = tuiInjectElement();
    this.hovered$ = inject(TuiHoveredService);
    this.options = inject(TUI_HINT_OPTIONS);
    this.visible = false;
    this.toggle$ = new Subject();
    this.stream$ = merge(this.toggle$.pipe(switchMap((visible) => this.isMobile ? of(visible).pipe(delay(0)) : of(visible).pipe(delay(visible ? 0 : this.tuiHintHideDelay))), takeUntil(this.hovered$), repeat()), this.hovered$.pipe(switchMap((visible) => this.isMobile ? of(visible).pipe(delay(0)) : of(visible).pipe(delay(visible ? this.tuiHintShowDelay : this.tuiHintHideDelay))), takeUntil(this.toggle$), repeat())).pipe(filter(() => this.enabled), map((value) => value && (this.el.hasAttribute("tuiHintPointer") || !tuiIsObscured(this.el))), tap((visible) => {
      this.visible = visible;
    }));
    this.parent = inject(_TuiHintHover, {
      optional: true,
      skipSelf: true
    });
    this.tuiHintShowDelay = this.options.showDelay;
    this.tuiHintHideDelay = this.options.hideDelay;
    this.type = "hint";
    this.enabled = true;
  }
  toggle(visible = !this.visible) {
    this.toggle$.next(visible);
    this.parent?.toggle(visible);
  }
  close() {
    this.toggle$.next(false);
  }
  static {
    this.ɵfac = function TuiHintHover_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintHover)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintHover,
      inputs: {
        tuiHintShowDelay: "tuiHintShowDelay",
        tuiHintHideDelay: "tuiHintHideDelay"
      },
      exportAs: ["tuiHintHover"],
      features: [ɵɵProvidersFeature([tuiAsDriver(_TuiHintHover), TuiHoveredService]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintHover, [{
    type: Directive,
    args: [{
      standalone: true,
      providers: [tuiAsDriver(TuiHintHover), TuiHoveredService],
      exportAs: "tuiHintHover"
    }]
  }], function() {
    return [];
  }, {
    tuiHintShowDelay: [{
      type: Input
    }],
    tuiHintHideDelay: [{
      type: Input
    }]
  });
})();
var GAP$1 = 8;
var ARROW_OFFSET = 24;
var TOP = 0;
var LEFT = 1;
var TuiHintPosition = class _TuiHintPosition extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.el = tuiInjectElement();
    this.viewport = inject(TUI_VIEWPORT);
    this.accessor = tuiFallbackAccessor("hint")(inject(TuiRectAccessor), inject(TuiHintDirective));
    this.points = TUI_HINT_DIRECTIONS.reduce((acc, direction) => __spreadProps(__spreadValues({}, acc), {
      [direction]: [0, 0]
    }), {});
    this.direction = inject(TUI_HINT_OPTIONS).direction;
    this.offset = inject(TUI_IS_MOBILE) ? 16 : 8;
    this.directionChange = new EventEmitter();
    this.type = "hint";
  }
  emitDirection(direction) {
    this.directionChange.emit(direction);
  }
  getPosition(rect, el) {
    const width = el?.clientWidth ?? rect.width;
    const height = el?.clientHeight ?? rect.height;
    const hostRect = this.accessor.getClientRect() ?? EMPTY_CLIENT_RECT;
    const leftCenter = hostRect.left + hostRect.width / 2;
    const topCenter = hostRect.top + hostRect.height / 2;
    const rtl = this.el.matches('[dir="rtl"] :scope');
    this.points["top-left"][TOP] = hostRect.top - height - this.offset;
    this.points["top-left"][LEFT] = leftCenter - width + ARROW_OFFSET;
    this.points.top[TOP] = this.points["top-left"][TOP];
    this.points.top[LEFT] = leftCenter - width / 2;
    this.points["top-right"][TOP] = this.points["top-left"][TOP];
    this.points["top-right"][LEFT] = leftCenter - ARROW_OFFSET;
    this.points["bottom-left"][TOP] = hostRect.bottom + this.offset;
    this.points["bottom-left"][LEFT] = this.points["top-left"][LEFT];
    this.points.bottom[TOP] = this.points["bottom-left"][TOP];
    this.points.bottom[LEFT] = this.points.top[LEFT];
    this.points["bottom-right"][TOP] = this.points["bottom-left"][TOP];
    this.points["bottom-right"][LEFT] = this.points["top-right"][LEFT];
    this.points["left-top"][TOP] = topCenter - height + ARROW_OFFSET;
    this.points["left-top"][LEFT] = hostRect.left - width - this.offset;
    this.points.left[TOP] = topCenter - height / 2;
    this.points.left[LEFT] = this.points["left-top"][LEFT];
    this.points["left-bottom"][TOP] = topCenter - ARROW_OFFSET;
    this.points["left-bottom"][LEFT] = this.points["left-top"][LEFT];
    this.points["right-top"][TOP] = this.points["left-top"][TOP];
    this.points["right-top"][LEFT] = hostRect.right + this.offset;
    this.points.right[TOP] = this.points.left[TOP];
    this.points.right[LEFT] = this.points["right-top"][LEFT];
    this.points["right-bottom"][TOP] = this.points["left-bottom"][TOP];
    this.points["right-bottom"][LEFT] = this.points["right-top"][LEFT];
    const array = Array.isArray(this.direction) ? this.direction : [this.direction];
    const priority = array.map((direction2) => adjust(direction2, rtl));
    const direction = priority.concat(TUI_HINT_DIRECTIONS).find((dir) => this.checkPosition(this.points[dir], width, height)) || this.fallback;
    this.emitDirection(adjust(direction, rtl));
    return this.points[direction];
  }
  get fallback() {
    return this.points.top[TOP] > this.viewport.getClientRect().bottom - this.points.bottom[TOP] ? "top" : "bottom";
  }
  checkPosition([top, left], width, height) {
    const viewport = this.viewport.getClientRect();
    return top > viewport.top + GAP$1 && left > viewport.left + GAP$1 && top + height < viewport.bottom - GAP$1 && left + width < viewport.right - GAP$1;
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiHintPosition_BaseFactory;
      return function TuiHintPosition_Factory(__ngFactoryType__) {
        return (ɵTuiHintPosition_BaseFactory || (ɵTuiHintPosition_BaseFactory = ɵɵgetInheritedFactory(_TuiHintPosition)))(__ngFactoryType__ || _TuiHintPosition);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintPosition,
      inputs: {
        direction: [0, "tuiHintDirection", "direction"],
        offset: [0, "tuiHintOffset", "offset"]
      },
      outputs: {
        directionChange: "tuiHintDirectionChange"
      },
      features: [ɵɵInheritDefinitionFeature]
    });
  }
};
__decorate([tuiPure], TuiHintPosition.prototype, "emitDirection", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintPosition, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, {
    direction: [{
      type: Input,
      args: ["tuiHintDirection"]
    }],
    offset: [{
      type: Input,
      args: ["tuiHintOffset"]
    }],
    directionChange: [{
      type: Output,
      args: ["tuiHintDirectionChange"]
    }],
    emitDirection: []
  });
})();
function adjust(direction, rtl) {
  if (rtl && direction.includes("left")) {
    return direction.replace("left", "right");
  }
  if (rtl && direction.includes("right")) {
    return direction.replace("right", "left");
  }
  return direction;
}
var TuiHintDirective = class _TuiHintDirective {
  constructor() {
    this.service = inject(TuiHintService);
    this.appearance = inject(TUI_HINT_OPTIONS).appearance;
    this.visible = new EventEmitter();
    this.content = signal(null);
    this.component = inject(PolymorpheusComponent);
    this.el = tuiInjectElement();
    this.activeZone = inject(TuiActiveZone, {
      optional: true
    });
    this.type = "hint";
  }
  set tuiHint(content) {
    this.content.set(content);
    if (!content) {
      this.toggle(false);
    }
  }
  ngOnDestroy() {
    this.toggle(false);
  }
  getClientRect() {
    return this.el.getBoundingClientRect();
  }
  toggle(show) {
    if (show && this.content()) {
      this.service.add(this);
    } else {
      this.service.remove(this);
    }
    this.visible.emit(show);
  }
  static {
    this.ɵfac = function TuiHintDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintDirective,
      selectors: [["", "tuiHint", "", 5, "ng-container", 5, "ng-template"]],
      inputs: {
        context: [0, "tuiHintContext", "context"],
        appearance: [0, "tuiHintAppearance", "appearance"],
        tuiHint: "tuiHint"
      },
      outputs: {
        visible: "tuiHintVisible"
      },
      features: [ɵɵProvidersFeature([tuiAsRectAccessor(_TuiHintDirective), tuiAsVehicle(_TuiHintDirective), {
        provide: PolymorpheusComponent,
        deps: [TUI_HINT_COMPONENT, INJECTOR$1],
        useClass: PolymorpheusComponent
      }]), ɵɵHostDirectivesFeature([TuiHintDriver, {
        directive: TuiHintHover,
        inputs: ["tuiHintHideDelay", "tuiHintHideDelay", "tuiHintShowDelay", "tuiHintShowDelay"]
      }, {
        directive: TuiHintPosition,
        inputs: ["tuiHintDirection", "tuiHintDirection", "tuiHintOffset", "tuiHintOffset"],
        outputs: ["tuiHintDirectionChange", "tuiHintDirectionChange"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHint]:not(ng-container):not(ng-template)",
      providers: [tuiAsRectAccessor(TuiHintDirective), tuiAsVehicle(TuiHintDirective), {
        provide: PolymorpheusComponent,
        deps: [TUI_HINT_COMPONENT, INJECTOR$1],
        useClass: PolymorpheusComponent
      }],
      hostDirectives: [TuiHintDriver, {
        directive: TuiHintHover,
        inputs: ["tuiHintHideDelay", "tuiHintShowDelay"]
      }, {
        directive: TuiHintPosition,
        inputs: ["tuiHintDirection", "tuiHintOffset"],
        outputs: ["tuiHintDirectionChange"]
      }]
    }]
  }], null, {
    context: [{
      type: Input,
      args: ["tuiHintContext"]
    }],
    appearance: [{
      type: Input,
      args: ["tuiHintAppearance"]
    }],
    visible: [{
      type: Output,
      args: ["tuiHintVisible"]
    }],
    tuiHint: [{
      type: Input
    }]
  });
})();
var TuiHintPointer = class _TuiHintPointer extends TuiHintHover {
  constructor() {
    super(...arguments);
    this.currentRect = EMPTY_CLIENT_RECT;
  }
  getClientRect() {
    return this.currentRect;
  }
  onMove({
    clientX,
    clientY
  }) {
    this.currentRect = tuiPointToClientRect(clientX, clientY);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiHintPointer_BaseFactory;
      return function TuiHintPointer_Factory(__ngFactoryType__) {
        return (ɵTuiHintPointer_BaseFactory || (ɵTuiHintPointer_BaseFactory = ɵɵgetInheritedFactory(_TuiHintPointer)))(__ngFactoryType__ || _TuiHintPointer);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintPointer,
      selectors: [["", "tuiHint", "", "tuiHintPointer", ""]],
      hostBindings: function TuiHintPointer_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("mousemove.zoneless", function TuiHintPointer_mousemove_zoneless_HostBindingHandler($event) {
            return ctx.onMove($event);
          });
        }
      },
      features: [ɵɵProvidersFeature([tuiAsRectAccessor(_TuiHintPointer), tuiAsDriver(_TuiHintPointer)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintPointer, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHint][tuiHintPointer]",
      providers: [tuiAsRectAccessor(TuiHintPointer), tuiAsDriver(TuiHintPointer)],
      host: {
        "(mousemove.zoneless)": "onMove($event)"
      }
    }]
  }], null, null);
})();
var TuiHintUnstyledComponent = class _TuiHintUnstyledComponent {
  constructor() {
    this.context = injectContext();
  }
  static {
    this.ɵfac = function TuiHintUnstyledComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintUnstyledComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiHintUnstyledComponent,
      selectors: [["ng-component"]],
      decls: 1,
      vars: 1,
      consts: [[4, "polymorpheusOutlet"]],
      template: function TuiHintUnstyledComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiHintUnstyledComponent_ng_container_0_Template, 1, 0, "ng-container", 0);
        }
        if (rf & 2) {
          ɵɵproperty("polymorpheusOutlet", ctx.context.$implicit.content());
        }
      },
      dependencies: [PolymorpheusOutlet],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintUnstyledComponent, [{
    type: Component,
    args: [{
      standalone: true,
      imports: [PolymorpheusOutlet],
      template: '<ng-container *polymorpheusOutlet="context.$implicit.content()" />',
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var TuiHintUnstyled = class _TuiHintUnstyled {
  constructor() {
    const hint = inject(TuiHintDirective);
    hint.component = new PolymorpheusComponent(TuiHintUnstyledComponent);
    hint.content.set(inject(TemplateRef));
  }
  static {
    this.ɵfac = function TuiHintUnstyled_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintUnstyled)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintUnstyled,
      selectors: [["ng-template", "tuiHint", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintUnstyled, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiHint]"
    }]
  }], function() {
    return [];
  }, null);
})();
var TUI_HINT_PROVIDERS = [TuiPositionService, TuiHoveredService, tuiPositionAccessorFor("hint", TuiHintPosition), tuiRectAccessorFor("hint", TuiHintDirective)];
var GAP = 8;
var TuiHintBaseComponent = class _TuiHintBaseComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.hover = inject(TuiHintHover);
    this.vvs = inject(TuiVisualViewportService);
    this.viewport = inject(TUI_VIEWPORT);
    this.pointer = inject(TuiHintPointer, {
      optional: true
    });
    this.accessor = inject(TuiRectAccessor);
    this.hint = injectContext().$implicit;
    this.isMobile = inject(TUI_IS_MOBILE);
    this.content = this.hint.component.component === TuiHintUnstyledComponent ? signal("") : this.hint.content;
    this.appearance = this.hint.appearance || this.hint.el.closest("[tuiTheme]")?.getAttribute("tuiTheme");
    inject(TuiPositionService).pipe(takeWhile(() => this.hint.el.isConnected), map((point) => this.vvs.correct(point)), takeUntilDestroyed()).subscribe({
      next: ([top, left]) => this.update(top, left),
      complete: () => this.hover.close()
    });
    inject(TuiHoveredService).pipe(takeUntilDestroyed()).subscribe((hover) => this.hover.toggle(hover));
  }
  onClick(target) {
    if (!target.closest(this.el.tagName) && !this.hint.el.contains(target) || tuiIsObscured(this.hint.el)) {
      this.hover.toggle(false);
    }
  }
  apply(top, left, beakTop, beakLeft) {
    this.el.style.top = top;
    this.el.style.left = left;
    this.el.style.setProperty("--t-top", `${beakTop}%`);
    this.el.style.setProperty("--t-left", `${beakLeft}%`);
    this.el.style.setProperty("--t-rotate", !beakLeft || Math.ceil(beakLeft) === 100 ? "90deg" : "0deg");
  }
  update(top, left) {
    const {
      clientHeight,
      clientWidth
    } = this.el;
    const rect = this.accessor.getClientRect();
    if (rect === EMPTY_CLIENT_RECT || !clientHeight || !clientWidth) {
      return;
    }
    const viewport = this.viewport.getClientRect();
    const safeLeft = tuiClamp(Math.max(GAP, left), viewport.left + GAP, Math.max(GAP, viewport.width + viewport.left - clientWidth - GAP));
    const [beakTop, beakLeft] = this.vvs.correct([rect.top + rect.height / 2 - top, rect.left + rect.width / 2 - safeLeft]);
    this.apply(tuiPx(Math.round(top)), tuiPx(Math.round(safeLeft)), Math.round(tuiClamp(beakTop, 0, clientHeight) / clientHeight * 100), Math.round(tuiClamp(beakLeft, 0, clientWidth) / clientWidth * 100));
  }
  static {
    this.ɵfac = function TuiHintBaseComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintBaseComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiHintBaseComponent,
      selectors: [["ng-component"]],
      hostVars: 6,
      hostBindings: function TuiHintBaseComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click", function TuiHintBaseComponent_click_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          }, ɵɵresolveDocument);
        }
        if (rf & 2) {
          ɵɵattribute("data-appearance", ctx.appearance)("tuiTheme", ctx.appearance === "dark" ? "light" : null);
          ɵɵclassProp("_untouchable", ctx.pointer)("_mobile", ctx.isMobile);
        }
      },
      decls: 0,
      vars: 0,
      template: function TuiHintBaseComponent_Template(rf, ctx) {
      },
      encapsulation: 2
    });
  }
};
__decorate([tuiPure], TuiHintBaseComponent.prototype, "apply", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintBaseComponent, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._untouchable]": "pointer",
        "[class._mobile]": "isMobile",
        "[attr.data-appearance]": "appearance",
        "[attr.tuiTheme]": 'appearance === "dark" ? "light" : null',
        "(document:click)": "onClick($event.target)"
      }
    }]
  }], function() {
    return [];
  }, {
    apply: []
  });
})();
var TuiHintComponent = class _TuiHintComponent extends TuiHintBaseComponent {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiHintComponent_BaseFactory;
      return function TuiHintComponent_Factory(__ngFactoryType__) {
        return (ɵTuiHintComponent_BaseFactory || (ɵTuiHintComponent_BaseFactory = ɵɵgetInheritedFactory(_TuiHintComponent)))(__ngFactoryType__ || _TuiHintComponent);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiHintComponent,
      selectors: [["tui-hint"]],
      features: [ɵɵProvidersFeature(TUI_HINT_PROVIDERS), ɵɵHostDirectivesFeature([TuiAnimated]), ɵɵInheritDefinitionFeature],
      ngContentSelectors: _c0,
      decls: 2,
      vars: 2,
      consts: [[3, "innerHTML", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], [3, "innerHTML"]],
      template: function TuiHintComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵprojection(0);
          ɵɵtemplate(1, TuiHintComponent_span_1_Template, 1, 1, "span", 0);
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵproperty("polymorpheusOutlet", ctx.content())("polymorpheusOutletContext", ctx.hint.context);
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: [`[_nghost-%COMP%]{position:absolute;max-inline-size:min(18rem,calc(100% - 1rem));padding:.75rem 1rem;background:var(--tui-background-accent-1);border-radius:var(--tui-radius-l);color:var(--tui-text-primary-on-accent-1);box-sizing:border-box;font:var(--tui-font-text-s);white-space:pre-line;overflow-wrap:break-word;transform-origin:var(--t-left) var(--t-top);--tui-background-elevation-2: var(--tui-background-elevation-3)}.tui-enter[_nghost-%COMP%], .tui-leave[_nghost-%COMP%]{animation-name:tuiFade}[_nghost-%COMP%]   tui-root._mobile.tui-enter[_nghost-%COMP%], tui-root._mobile   .tui-enter[_nghost-%COMP%]{animation:tuiFade var(--tui-duration) ease-in-out,tuiScale var(--tui-duration) cubic-bezier(.34,1.56,.64,1)}[_nghost-%COMP%]   tui-root._mobile.tui-leave[_nghost-%COMP%], tui-root._mobile   .tui-leave[_nghost-%COMP%]{animation:tuiFade var(--tui-duration) ease-in-out reverse,tuiScale var(--tui-duration) ease-in-out reverse}[_nghost-%COMP%]:before{content:"";position:absolute;top:var(--t-top);left:var(--t-left);inline-size:.75rem;block-size:.5rem;background:inherit;-webkit-mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');transform:translate(-50%,-50%) rotate(var(--t-rotate))}._mobile[_nghost-%COMP%]{font:var(--tui-font-text-m)}._mobile[_nghost-%COMP%]:before{inline-size:1.5rem;block-size:1.125rem;-webkit-mask-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18"><path d="M7.22854 3.81615L4.89971 6.6711C3.69732 8.14514 1.8988 9 0 9C1.8988 9 3.69732 9.85486 4.89971 11.3289L7.22854 14.1839L7.22854 14.1839C9.12123 16.5041 10.0676 17.6643 11.2665 17.922C11.75 18.026 12.25 18.026 12.7335 17.922C13.9324 17.6643 14.8788 16.5041 16.7715 14.1839L19.1003 11.3289C20.3027 9.85486 22.1012 9 24 9C22.1012 9 20.3027 8.14514 19.1003 6.6711L16.7715 3.81614C14.8788 1.49586 13.9324 0.335716 12.7335 0.0779663C12.25 -0.0259888 11.75 -0.0259888 11.2665 0.0779663C10.0676 0.335716 9.12123 1.49586 7.22854 3.81614L7.22854 3.81615Z" /></svg>');mask-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18"><path d="M7.22854 3.81615L4.89971 6.6711C3.69732 8.14514 1.8988 9 0 9C1.8988 9 3.69732 9.85486 4.89971 11.3289L7.22854 14.1839L7.22854 14.1839C9.12123 16.5041 10.0676 17.6643 11.2665 17.922C11.75 18.026 12.25 18.026 12.7335 17.922C13.9324 17.6643 14.8788 16.5041 16.7715 14.1839L19.1003 11.3289C20.3027 9.85486 22.1012 9 24 9C22.1012 9 20.3027 8.14514 19.1003 6.6711L16.7715 3.81614C14.8788 1.49586 13.9324 0.335716 12.7335 0.0779663C12.25 -0.0259888 11.75 -0.0259888 11.2665 0.0779663C10.0676 0.335716 9.12123 1.49586 7.22854 3.81614L7.22854 3.81615Z" /></svg>')}[data-appearance=error][_nghost-%COMP%]{background:var(--tui-status-negative)}[data-appearance=dark][_nghost-%COMP%]{background:var(--tui-background-elevation-1);color:var(--tui-text-primary);box-shadow:var(--tui-shadow-small)}[_nghost-%COMP%]:not([style*=top]){visibility:hidden}._untouchable[_nghost-%COMP%]{pointer-events:none}`]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-hint",
      imports: [PolymorpheusOutlet],
      template: `
        <ng-content />
        <span
            *polymorpheusOutlet="content() as text; context: hint.context"
            [innerHTML]="text"
        ></span>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: TUI_HINT_PROVIDERS,
      hostDirectives: [TuiAnimated],
      styles: [`:host{position:absolute;max-inline-size:min(18rem,calc(100% - 1rem));padding:.75rem 1rem;background:var(--tui-background-accent-1);border-radius:var(--tui-radius-l);color:var(--tui-text-primary-on-accent-1);box-sizing:border-box;font:var(--tui-font-text-s);white-space:pre-line;overflow-wrap:break-word;transform-origin:var(--t-left) var(--t-top);--tui-background-elevation-2: var(--tui-background-elevation-3)}:host.tui-enter,:host.tui-leave{animation-name:tuiFade}:host :host-context(tui-root._mobile).tui-enter{animation:tuiFade var(--tui-duration) ease-in-out,tuiScale var(--tui-duration) cubic-bezier(.34,1.56,.64,1)}:host :host-context(tui-root._mobile).tui-leave{animation:tuiFade var(--tui-duration) ease-in-out reverse,tuiScale var(--tui-duration) ease-in-out reverse}:host:before{content:"";position:absolute;top:var(--t-top);left:var(--t-left);inline-size:.75rem;block-size:.5rem;background:inherit;-webkit-mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');transform:translate(-50%,-50%) rotate(var(--t-rotate))}:host._mobile{font:var(--tui-font-text-m)}:host._mobile:before{inline-size:1.5rem;block-size:1.125rem;-webkit-mask-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18"><path d="M7.22854 3.81615L4.89971 6.6711C3.69732 8.14514 1.8988 9 0 9C1.8988 9 3.69732 9.85486 4.89971 11.3289L7.22854 14.1839L7.22854 14.1839C9.12123 16.5041 10.0676 17.6643 11.2665 17.922C11.75 18.026 12.25 18.026 12.7335 17.922C13.9324 17.6643 14.8788 16.5041 16.7715 14.1839L19.1003 11.3289C20.3027 9.85486 22.1012 9 24 9C22.1012 9 20.3027 8.14514 19.1003 6.6711L16.7715 3.81614C14.8788 1.49586 13.9324 0.335716 12.7335 0.0779663C12.25 -0.0259888 11.75 -0.0259888 11.2665 0.0779663C10.0676 0.335716 9.12123 1.49586 7.22854 3.81614L7.22854 3.81615Z" /></svg>');mask-image:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18"><path d="M7.22854 3.81615L4.89971 6.6711C3.69732 8.14514 1.8988 9 0 9C1.8988 9 3.69732 9.85486 4.89971 11.3289L7.22854 14.1839L7.22854 14.1839C9.12123 16.5041 10.0676 17.6643 11.2665 17.922C11.75 18.026 12.25 18.026 12.7335 17.922C13.9324 17.6643 14.8788 16.5041 16.7715 14.1839L19.1003 11.3289C20.3027 9.85486 22.1012 9 24 9C22.1012 9 20.3027 8.14514 19.1003 6.6711L16.7715 3.81614C14.8788 1.49586 13.9324 0.335716 12.7335 0.0779663C12.25 -0.0259888 11.75 -0.0259888 11.2665 0.0779663C10.0676 0.335716 9.12123 1.49586 7.22854 3.81614L7.22854 3.81615Z" /></svg>')}:host[data-appearance=error]{background:var(--tui-status-negative)}:host[data-appearance=dark]{background:var(--tui-background-elevation-1);color:var(--tui-text-primary);box-shadow:var(--tui-shadow-small)}:host:not([style*=top]){visibility:hidden}:host._untouchable{pointer-events:none}
`]
    }]
  }], null, null);
})();
var TuiHintDescribe = class _TuiHintDescribe extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.doc = inject(DOCUMENT);
    this.el = tuiInjectElement();
    this.zone = inject(NgZone);
    this.id$ = new BehaviorSubject("");
    this.stream$ = this.id$.pipe(distinctUntilChanged(), tuiIfMap(() => fromEvent(this.doc, "keydown", {
      capture: true
    }), tuiIsPresent), switchMap(() => this.focused ? of(false) : merge(tuiTypedFromEvent(this.doc, "keyup"), tuiTypedFromEvent(this.element, "blur")).pipe(map(() => this.focused))), debounce((visible) => visible ? timer(1e3, tuiZonefreeScheduler(this.zone)) : of(null)), startWith(false), distinctUntilChanged(), skip(1), tuiZoneOptimized());
    this.type = "hint";
  }
  set tuiHintDescribe(id) {
    this.id$.next(id || "");
  }
  get element() {
    const id = this.id$.value;
    return id ? this.doc.querySelector(`#${id}`) || this.el : this.el;
  }
  get focused() {
    return tuiIsFocused(this.element);
  }
  static {
    this.ɵfac = function TuiHintDescribe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintDescribe)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintDescribe,
      selectors: [["", "tuiHintDescribe", ""]],
      inputs: {
        tuiHintDescribe: "tuiHintDescribe"
      },
      features: [ɵɵProvidersFeature([tuiAsDriver(_TuiHintDescribe)]), ɵɵInheritDefinitionFeature]
    });
  }
};
__decorate([tuiPure], TuiHintDescribe.prototype, "element", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDescribe, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHintDescribe]",
      providers: [tuiAsDriver(TuiHintDescribe)]
    }]
  }], function() {
    return [];
  }, {
    tuiHintDescribe: [{
      type: Input
    }],
    element: []
  });
})();
var TuiHintHost = class _TuiHintHost extends TuiRectAccessor {
  constructor() {
    super(...arguments);
    this.type = "hint";
  }
  getClientRect() {
    return this.tuiHintHost?.getBoundingClientRect() || EMPTY_CLIENT_RECT;
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiHintHost_BaseFactory;
      return function TuiHintHost_Factory(__ngFactoryType__) {
        return (ɵTuiHintHost_BaseFactory || (ɵTuiHintHost_BaseFactory = ɵɵgetInheritedFactory(_TuiHintHost)))(__ngFactoryType__ || _TuiHintHost);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintHost,
      selectors: [["", "tuiHint", "", "tuiHintHost", ""]],
      inputs: {
        tuiHintHost: "tuiHintHost"
      },
      features: [ɵɵProvidersFeature([tuiAsRectAccessor(_TuiHintHost)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintHost, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHint][tuiHintHost]",
      providers: [tuiAsRectAccessor(TuiHintHost)]
    }]
  }], null, {
    tuiHintHost: [{
      type: Input
    }]
  });
})();
var TuiHintManual = class _TuiHintManual extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.hover = inject(TuiHintHover);
    this.stream$ = new BehaviorSubject(false);
    this.tuiHintManual = false;
    this.type = "hint";
    this.hover.enabled = false;
  }
  ngOnChanges() {
    this.stream$.next(!!this.tuiHintManual);
    this.hover.enabled = this.tuiHintManual === null;
  }
  static {
    this.ɵfac = function TuiHintManual_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintManual)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintManual,
      selectors: [["", "tuiHint", "", "tuiHintManual", ""]],
      inputs: {
        tuiHintManual: "tuiHintManual"
      },
      features: [ɵɵProvidersFeature([tuiAsDriver(_TuiHintManual)]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintManual, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHint][tuiHintManual]",
      providers: [tuiAsDriver(TuiHintManual)]
    }]
  }], function() {
    return [];
  }, {
    tuiHintManual: [{
      type: Input
    }]
  });
})();
var TuiHintOverflow = class _TuiHintOverflow {
  constructor() {
    this.hint = inject(TuiHintDirective);
    this.tuiHintOverflow = "";
  }
  onMouseEnter({
    scrollWidth,
    clientWidth,
    textContent
  }) {
    this.hint.tuiHint = scrollWidth > clientWidth && this.tuiHintOverflow !== null ? this.tuiHintOverflow || textContent : "";
  }
  static {
    this.ɵfac = function TuiHintOverflow_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintOverflow)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiHintOverflow,
      selectors: [["", "tuiHintOverflow", ""]],
      hostBindings: function TuiHintOverflow_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("mouseenter", function TuiHintOverflow_mouseenter_HostBindingHandler($event) {
            return ctx.onMouseEnter($event.currentTarget);
          });
        }
      },
      inputs: {
        tuiHintOverflow: "tuiHintOverflow"
      },
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiHintDirective,
        inputs: ["tuiHintAppearance", "tuiHintAppearance"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintOverflow, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiHintOverflow]",
      hostDirectives: [{
        directive: TuiHintDirective,
        inputs: ["tuiHintAppearance"]
      }],
      host: {
        "(mouseenter)": "onMouseEnter($event.currentTarget)"
      }
    }]
  }], null, {
    tuiHintOverflow: [{
      type: Input
    }]
  });
})();
var TuiHint = [TuiHintComponent, TuiHintDirective, TuiHintOptionsDirective, TuiHintUnstyled, TuiHintDriver, TuiHintPosition, TuiHintHover, TuiHintOverflow, TuiHintDescribe, TuiHintHost, TuiHintManual, TuiHintPointer];
var TuiHints = class _TuiHints {
  constructor() {
    this.hints$ = inject(TuiHintService);
    this.destroyRef = inject(DestroyRef);
    this.cdr = inject(ChangeDetectorRef);
    this.hints = [];
  }
  ngOnInit() {
    this.hints$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((hints) => {
      this.hints = hints;
      this.cdr.detectChanges();
    });
  }
  static {
    this.ɵfac = function TuiHints_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHints)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiHints,
      selectors: [["tui-hints"]],
      hostAttrs: ["aria-live", "polite"],
      decls: 1,
      vars: 1,
      consts: [["role", "tooltip", "tuiAnimatedParent", "", 3, "tuiActiveZoneParent", 4, "ngFor", "ngForOf"], ["role", "tooltip", "tuiAnimatedParent", "", 3, "tuiActiveZoneParent"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiHints_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiHints_div_0_Template, 2, 5, "div", 0);
        }
        if (rf & 2) {
          ɵɵproperty("ngForOf", ctx.hints);
        }
      },
      dependencies: [NgForOf, PolymorpheusOutlet, TuiActiveZone, TuiAnimatedParent],
      styles: ["[_nghost-%COMP%]{position:fixed;top:0;left:0;inline-size:100%;block-size:100%;block-size:0}"],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHints, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-hints",
      imports: [NgForOf, PolymorpheusOutlet, TuiActiveZone, TuiAnimatedParent],
      changeDetection: ChangeDetectionStrategy.Default,
      host: {
        "aria-live": "polite"
      },
      template: '<div\n    *ngFor="let hint of hints"\n    role="tooltip"\n    tuiAnimatedParent\n    [tuiActiveZoneParent]="hint.activeZone || null"\n>\n    <ng-container *polymorpheusOutlet="hint.component; context: {$implicit: hint}" />\n</div>\n',
      styles: [":host{position:fixed;top:0;left:0;inline-size:100%;block-size:100%;block-size:0}\n"]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-validator.mjs
var TuiValidator = class _TuiValidator {
  constructor() {
    this.onChange = EMPTY_FUNCTION;
    this.validate = Validators.nullValidator;
  }
  registerOnValidatorChange(onChange) {
    this.onChange = onChange;
  }
  ngOnChanges() {
    this.onChange();
  }
  static {
    this.ɵfac = function TuiValidator_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiValidator)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiValidator,
      selectors: [["", "tuiValidator", ""]],
      inputs: {
        validate: [0, "tuiValidator", "validate"]
      },
      features: [ɵɵProvidersFeature([tuiProvide(NG_VALIDATORS, _TuiValidator, true)]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiValidator, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiValidator]",
      inputs: ["validate: tuiValidator"],
      providers: [tuiProvide(NG_VALIDATORS, TuiValidator, true)]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-items-handlers.mjs
var TUI_DEFAULT_ITEMS_HANDLERS = {
  stringify: signal(String),
  identityMatcher: signal(TUI_DEFAULT_IDENTITY_MATCHER),
  disabledItemHandler: signal(TUI_FALSE_HANDLER)
};
var TUI_ITEMS_HANDLERS = new InjectionToken(ngDevMode ? "TUI_ITEMS_HANDLERS" : "", {
  factory: () => TUI_DEFAULT_ITEMS_HANDLERS
});
function tuiItemsHandlersProvider(options) {
  return {
    provide: TUI_ITEMS_HANDLERS,
    deps: [[new Optional(), new SkipSelf(), TUI_ITEMS_HANDLERS]],
    useFactory: (parent) => __spreadValues({
      stringify: signal(parent?.stringify() ?? TUI_DEFAULT_ITEMS_HANDLERS.stringify()),
      identityMatcher: signal(parent?.identityMatcher() ?? TUI_DEFAULT_ITEMS_HANDLERS.identityMatcher()),
      disabledItemHandler: signal(parent?.disabledItemHandler() ?? TUI_DEFAULT_ITEMS_HANDLERS.disabledItemHandler())
    }, options)
  };
}
var TuiItemsHandlersDirective = class _TuiItemsHandlersDirective {
  constructor() {
    this.defaultHandlers = inject(TUI_ITEMS_HANDLERS, {
      skipSelf: true
    });
    this.stringify = signal(this.defaultHandlers.stringify());
    this.identityMatcher = signal(this.defaultHandlers.identityMatcher());
    this.disabledItemHandler = signal(this.defaultHandlers.disabledItemHandler());
  }
  // TODO(v5): use signal inputs
  set stringifySetter(x) {
    this.stringify.set(x);
  }
  // TODO(v5): use signal inputs
  set identityMatcherSetter(x) {
    this.identityMatcher.set(x);
  }
  // TODO(v5): use signal inputs
  set disabledItemHandlerSetter(x) {
    this.disabledItemHandler.set(x);
  }
  static {
    this.ɵfac = function TuiItemsHandlersDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiItemsHandlersDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiItemsHandlersDirective,
      inputs: {
        stringifySetter: [0, "stringify", "stringifySetter"],
        identityMatcherSetter: [0, "identityMatcher", "identityMatcherSetter"],
        disabledItemHandlerSetter: [0, "disabledItemHandler", "disabledItemHandlerSetter"]
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_ITEMS_HANDLERS, _TuiItemsHandlersDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiItemsHandlersDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      providers: [tuiProvide(TUI_ITEMS_HANDLERS, TuiItemsHandlersDirective)]
    }]
  }], null, {
    stringifySetter: [{
      type: Input,
      args: ["stringify"]
    }],
    identityMatcherSetter: [{
      type: Input,
      args: ["identityMatcher"]
    }],
    disabledItemHandlerSetter: [{
      type: Input,
      args: ["disabledItemHandler"]
    }]
  });
})();
var TuiWithItemsHandlers = class _TuiWithItemsHandlers {
  static {
    this.ɵfac = function TuiWithItemsHandlers_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithItemsHandlers)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithItemsHandlers,
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiItemsHandlersDirective,
        inputs: ["stringify", "stringify", "identityMatcher", "identityMatcher", "disabledItemHandler", "disabledItemHandler"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithItemsHandlers, [{
    type: Directive,
    args: [{
      standalone: true,
      hostDirectives: [{
        directive: TuiItemsHandlersDirective,
        inputs: ["stringify", "identityMatcher", "disabledItemHandler"]
      }]
    }]
  }], null, null);
})();
var TuiItemsHandlersValidator = class _TuiItemsHandlersValidator extends TuiValidator {
  constructor() {
    super(...arguments);
    this.handlers = inject(TuiItemsHandlersDirective);
    this.initialized = false;
    this.update = effect(() => {
      this.handlers.disabledItemHandler();
      if (this.initialized) {
        this.onChange();
      } else {
        this.initialized = true;
      }
    }, TUI_ALLOW_SIGNAL_WRITES);
    this.disabledItemHandler = (value) => Array.isArray(value) ? value.some((item) => this.handlers.disabledItemHandler()(item)) : Boolean(value) && this.handlers.disabledItemHandler()(value);
    this.validate = ({
      value
    }) => this.disabledItemHandler(value) ? {
      tuiDisabledItem: value
    } : null;
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiItemsHandlersValidator_BaseFactory;
      return function TuiItemsHandlersValidator_Factory(__ngFactoryType__) {
        return (ɵTuiItemsHandlersValidator_BaseFactory || (ɵTuiItemsHandlersValidator_BaseFactory = ɵɵgetInheritedFactory(_TuiItemsHandlersValidator)))(__ngFactoryType__ || _TuiItemsHandlersValidator);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiItemsHandlersValidator,
      features: [ɵɵProvidersFeature([tuiProvide(NG_VALIDATORS, _TuiItemsHandlersValidator, true)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiItemsHandlersValidator, [{
    type: Directive,
    args: [{
      standalone: true,
      providers: [tuiProvide(NG_VALIDATORS, TuiItemsHandlersValidator, true)]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-number-format.mjs
var TuiNumberFormat = class _TuiNumberFormat extends Observable {
  constructor() {
    super((subscriber) => combineLatest([this.parent, this.settings]).pipe(map(([parent, settings]) => __spreadValues(__spreadValues({}, parent), settings))).subscribe(subscriber));
    this.settings = new ReplaySubject(1);
    this.parent = inject(TUI_NUMBER_FORMAT, {
      skipSelf: true
    });
  }
  set tuiNumberFormat(format) {
    this.settings.next(format);
  }
  static {
    this.ɵfac = function TuiNumberFormat_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiNumberFormat)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiNumberFormat,
      selectors: [["", "tuiNumberFormat", ""]],
      inputs: {
        tuiNumberFormat: "tuiNumberFormat"
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_NUMBER_FORMAT, _TuiNumberFormat)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiNumberFormat, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiNumberFormat]",
      providers: [tuiProvide(TUI_NUMBER_FORMAT, TuiNumberFormat)]
    }]
  }], function() {
    return [];
  }, {
    tuiNumberFormat: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-popup.mjs
var TuiPopupService = class _TuiPopupService extends TuiPortalService {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiPopupService_BaseFactory;
      return function TuiPopupService_Factory(__ngFactoryType__) {
        return (ɵTuiPopupService_BaseFactory || (ɵTuiPopupService_BaseFactory = ɵɵgetInheritedFactory(_TuiPopupService)))(__ngFactoryType__ || _TuiPopupService);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiPopupService,
      factory: _TuiPopupService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPopupService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var TuiPopup = class _TuiPopup {
  constructor() {
    this.template = inject(TemplateRef);
    this.service = inject(TuiPopupService);
  }
  set tuiPopup(show) {
    this.viewRef?.destroy();
    if (show) {
      this.viewRef = this.service.addTemplate(this.template);
    }
  }
  ngOnDestroy() {
    this.viewRef?.destroy();
  }
  static {
    this.ɵfac = function TuiPopup_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiPopup)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiPopup,
      selectors: [["ng-template", "tuiPopup", ""]],
      inputs: {
        tuiPopup: "tuiPopup"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPopup, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiPopup]"
    }]
  }], null, {
    tuiPopup: [{
      type: Input
    }]
  });
})();
var TuiPopups = class _TuiPopups extends TuiPortals {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiPopups_BaseFactory;
      return function TuiPopups_Factory(__ngFactoryType__) {
        return (ɵTuiPopups_BaseFactory || (ɵTuiPopups_BaseFactory = ɵɵgetInheritedFactory(_TuiPopups)))(__ngFactoryType__ || _TuiPopups);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiPopups,
      selectors: [["tui-popups"]],
      features: [ɵɵProvidersFeature([tuiAsPortal(TuiPopupService)]), ɵɵInheritDefinitionFeature],
      decls: 2,
      vars: 0,
      consts: [["viewContainer", ""]],
      template: function TuiPopups_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵdomElementContainer(0, null, 0);
        }
      },
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPopups, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-popups",
      template: "<ng-container #viewContainer />",
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAsPortal(TuiPopupService)]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-surface.mjs
var TuiSurfaceStyles = class _TuiSurfaceStyles {
  static {
    this.ɵfac = function TuiSurfaceStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSurfaceStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiSurfaceStyles,
      selectors: [["ng-component"]],
      hostAttrs: [1, "tui-surface-styles"],
      decls: 0,
      vars: 0,
      template: function TuiSurfaceStyles_Template(rf, ctx) {
      },
      styles: ['[data-surface]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--tui-gap: .25rem;position:relative;box-sizing:border-box;background:none no-repeat;background-size:cover;overflow:hidden;isolation:isolate;-webkit-appearance:none;appearance:none;border:0;text-decoration:none;transition-property:background,border-radius,box-shadow,transform,-webkit-backdrop-filter,-webkit-mask!important;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform!important;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform,-webkit-backdrop-filter,-webkit-mask!important}[data-surface]:not([tuiCardLarge]){font-size:inherit;line-height:inherit}[data-surface]:focus-visible{outline-color:var(--tui-border-focus)}@supports (not (-moz-appearance: none)) and (not (-webkit-hyphens: none)){[data-surface]:before{mix-blend-mode:multiply}}tui-dialog:not([data-size=fullscreen],[data-size=page]) [data-surface],tui-sheet-dialog [data-surface]{--tui-background-elevation-1: var(--tui-background-elevation-2)}button[data-surface]{cursor:pointer}[data-surface]:before,[data-surface]:after,[tuiSurfaceLayer]:before,[tuiSurfaceLayer]:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;content:"";z-index:-1;border-radius:inherit;pointer-events:none;background-size:cover;background-repeat:no-repeat;transition-property:opacity,transform,-webkit-backdrop-filter;transition-property:opacity,backdrop-filter,transform;transition-property:opacity,backdrop-filter,transform,-webkit-backdrop-filter}[tuiSurfaceLayer]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:absolute;top:0;left:0;inline-size:100%;block-size:100%;position:absolute!important;z-index:-1;object-fit:cover;border-radius:inherit;box-sizing:border-box;transition-property:box-shadow,filter,padding}input[tuiSurfaceLayer]+[tuiSurfaceLayer]{will-change:padding;background-clip:content-box;overflow:clip;overflow-clip-margin:content-box}input[tuiSurfaceLayer]:checked+[tuiSurfaceLayer]{padding:var(--tui-gap)}input[tuiSurfaceLayer]:focus-visible+[tuiSurfaceLayer]{padding:var(--tui-gap)}@media (hover: hover) and (pointer: fine){[data-surface]:hover input[tuiSurfaceLayer]+[tuiSurfaceLayer]{padding:var(--tui-gap)}}input[tuiSurfaceLayer]{color:var(--tui-background-accent-2);-webkit-appearance:none;appearance:none;margin:0;border-radius:inherit;outline:none;box-shadow:inset 0 0,inset 0 0 var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:checked{box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:focus-visible{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:checked:focus-visible{filter:brightness(.7);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}@media (hover: hover) and (pointer: fine){[data-surface]:hover input[tuiSurfaceLayer]{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[data-surface]:hover input[tuiSurfaceLayer]:checked{filter:brightness(.9);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}}[tuiSurface][data-surface=elevated]{box-shadow:var(--tui-shadow-medium);background-color:var(--tui-background-elevation-2)}[tuiSurface][data-surface=elevated]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{box-shadow:var(--tui-shadow-medium);transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=elevated]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{box-shadow:var(--tui-shadow-medium-hover);transform:translate3d(0,-.25rem,0);background:var(--tui-background-elevation-2)}}[tuiSurface][data-surface=elevated]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{box-shadow:var(--tui-shadow-medium);transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=elevated]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{box-shadow:var(--tui-shadow-medium-hover);transform:translate3d(0,-.25rem,0);background:var(--tui-background-elevation-2)}}[tuiSurface][data-surface=flat]{background-color:var(--tui-background-neutral-1)}[tuiSurface][data-surface=flat]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=flat]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{transform:scale(1.15)}}[tuiSurface][data-surface=flat]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=flat]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{transform:scale(1.15)}}[tuiSurface][data-appearance=floating]{background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating][data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating][tuiWrapper]:hover:not(._no-hover),[tuiSurface][data-appearance=floating][tuiWrapper][data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating][data-state=active]{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating][tuiWrapper]:active:not(._no-active),[tuiSurface][data-appearance=floating][tuiWrapper][data-state=active],[tuiSurface][data-appearance=floating][tuiWrapper][data-state=active]:hover{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=neutral]{background:conic-gradient(var(--tui-background-neutral-1) 0 0),conic-gradient(var(--tui-background-base) 0 0)}[tuiTheme=dark] [tuiSurface][data-appearance=neutral],[tuiTheme=dark][tuiSurface][data-appearance=neutral]{background:var(--tui-background-elevation-1)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:scale(1.15)}}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:scale(1.15)}}[tuiSurface][data-appearance=neutral][data-state=hover]{transform:scale(1.15)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral][tuiWrapper]:hover:not(._no-hover),[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=hover]{transform:scale(1.15)}}[tuiSurface][data-appearance=neutral]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral][data-state=active]{transform:scale(.95)}[tuiSurface][data-appearance=neutral][tuiWrapper]:active:not(._no-active),[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=active],[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=active]:hover{transform:scale(.95)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSurfaceStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "tui-surface-styles"
      },
      styles: ['[data-surface]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--tui-gap: .25rem;position:relative;box-sizing:border-box;background:none no-repeat;background-size:cover;overflow:hidden;isolation:isolate;-webkit-appearance:none;appearance:none;border:0;text-decoration:none;transition-property:background,border-radius,box-shadow,transform,-webkit-backdrop-filter,-webkit-mask!important;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform!important;transition-property:backdrop-filter,background,border-radius,box-shadow,mask,transform,-webkit-backdrop-filter,-webkit-mask!important}[data-surface]:not([tuiCardLarge]){font-size:inherit;line-height:inherit}[data-surface]:focus-visible{outline-color:var(--tui-border-focus)}@supports (not (-moz-appearance: none)) and (not (-webkit-hyphens: none)){[data-surface]:before{mix-blend-mode:multiply}}tui-dialog:not([data-size=fullscreen],[data-size=page]) [data-surface],tui-sheet-dialog [data-surface]{--tui-background-elevation-1: var(--tui-background-elevation-2)}button[data-surface]{cursor:pointer}[data-surface]:before,[data-surface]:after,[tuiSurfaceLayer]:before,[tuiSurfaceLayer]:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;content:"";z-index:-1;border-radius:inherit;pointer-events:none;background-size:cover;background-repeat:no-repeat;transition-property:opacity,transform,-webkit-backdrop-filter;transition-property:opacity,backdrop-filter,transform;transition-property:opacity,backdrop-filter,transform,-webkit-backdrop-filter}[tuiSurfaceLayer]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:absolute;top:0;left:0;inline-size:100%;block-size:100%;position:absolute!important;z-index:-1;object-fit:cover;border-radius:inherit;box-sizing:border-box;transition-property:box-shadow,filter,padding}input[tuiSurfaceLayer]+[tuiSurfaceLayer]{will-change:padding;background-clip:content-box;overflow:clip;overflow-clip-margin:content-box}input[tuiSurfaceLayer]:checked+[tuiSurfaceLayer]{padding:var(--tui-gap)}input[tuiSurfaceLayer]:focus-visible+[tuiSurfaceLayer]{padding:var(--tui-gap)}@media (hover: hover) and (pointer: fine){[data-surface]:hover input[tuiSurfaceLayer]+[tuiSurfaceLayer]{padding:var(--tui-gap)}}input[tuiSurfaceLayer]{color:var(--tui-background-accent-2);-webkit-appearance:none;appearance:none;margin:0;border-radius:inherit;outline:none;box-shadow:inset 0 0,inset 0 0 var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:checked{box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:focus-visible{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}input[tuiSurfaceLayer]:checked:focus-visible{filter:brightness(.7);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}@media (hover: hover) and (pointer: fine){[data-surface]:hover input[tuiSurfaceLayer]{box-shadow:inset 0 0,inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}[data-surface]:hover input[tuiSurfaceLayer]:checked{filter:brightness(.9);box-shadow:inset 0 0 0 calc(var(--tui-gap) / 2),inset 0 0 0 calc(var(--tui-gap) / 2) var(--tui-background-neutral-1)}}[tuiSurface][data-surface=elevated]{box-shadow:var(--tui-shadow-medium);background-color:var(--tui-background-elevation-2)}[tuiSurface][data-surface=elevated]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{box-shadow:var(--tui-shadow-medium);transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=elevated]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{box-shadow:var(--tui-shadow-medium-hover);transform:translate3d(0,-.25rem,0);background:var(--tui-background-elevation-2)}}[tuiSurface][data-surface=elevated]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{box-shadow:var(--tui-shadow-medium);transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=elevated]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{box-shadow:var(--tui-shadow-medium-hover);transform:translate3d(0,-.25rem,0);background:var(--tui-background-elevation-2)}}[tuiSurface][data-surface=flat]{background-color:var(--tui-background-neutral-1)}[tuiSurface][data-surface=flat]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=flat]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{transform:scale(1.15)}}[tuiSurface][data-surface=flat]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active{transform:scale(.95)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-surface=flat]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover{transform:scale(1.15)}}[tuiSurface][data-appearance=floating]{background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating][data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=floating][tuiWrapper]:hover:not(._no-hover),[tuiSurface][data-appearance=floating][tuiWrapper][data-state=hover]{transform:translate3d(0,-.25rem,0);box-shadow:var(--tui-shadow-medium-hover)}}[tuiSurface][data-appearance=floating]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating][data-state=active]{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=floating][tuiWrapper]:active:not(._no-active),[tuiSurface][data-appearance=floating][tuiWrapper][data-state=active],[tuiSurface][data-appearance=floating][tuiWrapper][data-state=active]:hover{transform:scale(.95);background:var(--tui-background-elevation-1);box-shadow:var(--tui-shadow-medium)}[tuiSurface][data-appearance=neutral]{background:conic-gradient(var(--tui-background-neutral-1) 0 0),conic-gradient(var(--tui-background-base) 0 0)}[tuiTheme=dark] [tuiSurface][data-appearance=neutral],[tuiTheme=dark][tuiSurface][data-appearance=neutral]{background:var(--tui-background-elevation-1)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:scale(1.15)}}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not(:disabled):not([data-state]){transform:scale(1.15)}}[tuiSurface][data-appearance=neutral][data-state=hover]{transform:scale(1.15)}@media (hover: hover) and (pointer: fine){[tuiSurface][data-appearance=neutral][tuiWrapper]:hover:not(._no-hover),[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=hover]{transform:scale(1.15)}}[tuiSurface][data-appearance=neutral]:matches(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral]:is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not(:disabled):not([data-state]){transform:scale(.95)}[tuiSurface][data-appearance=neutral][data-state=active]{transform:scale(.95)}[tuiSurface][data-appearance=neutral][tuiWrapper]:active:not(._no-active),[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=active],[tuiSurface][data-appearance=neutral][tuiWrapper][data-state=active]:hover{transform:scale(.95)}\n']
    }]
  }], null, null);
})();
var TuiSurface = class _TuiSurface {
  constructor() {
    this.nothing = tuiWithStyles(TuiSurfaceStyles);
    this.tuiSurface = "";
  }
  static {
    this.ɵfac = function TuiSurface_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSurface)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiSurface,
      selectors: [["", "tuiSurface", ""]],
      hostAttrs: ["tuiSurface", ""],
      hostVars: 1,
      hostBindings: function TuiSurface_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-surface", ctx.tuiSurface);
        }
      },
      inputs: {
        tuiSurface: "tuiSurface"
      },
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiAppearance,
        inputs: ["tuiAppearance", "tuiSurface"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSurface, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiSurface]",
      hostDirectives: [{
        directive: TuiAppearance,
        inputs: ["tuiAppearance: tuiSurface"]
      }],
      host: {
        tuiSurface: "",
        "[attr.data-surface]": "tuiSurface"
      }
    }]
  }], null, {
    tuiSurface: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-auto-color.mjs
var TuiAutoColorPipe = class _TuiAutoColorPipe {
  transform(text) {
    return tuiStringHashToHsl(text);
  }
  static {
    this.ɵfac = function TuiAutoColorPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAutoColorPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiAutoColor",
      type: _TuiAutoColorPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAutoColorPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiAutoColor"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-calendar-sheet.mjs
var getMonthStartDaysOffset = (month, firstDayOfWeek) => {
  const startMonthOffsetFromSunday = new Date(month.year, month.month, 1).getDay();
  return startMonthOffsetFromSunday >= firstDayOfWeek ? startMonthOffsetFromSunday - firstDayOfWeek : DAYS_IN_WEEK - (firstDayOfWeek - startMonthOffsetFromSunday);
};
var getDayFromMonthRowCol = ({
  month,
  rowIndex,
  colIndex,
  firstDayOfWeek
}) => {
  ngDevMode && console.assert(Number.isInteger(rowIndex));
  ngDevMode && console.assert(tuiInRange(rowIndex, 0, 6));
  ngDevMode && console.assert(Number.isInteger(colIndex));
  ngDevMode && console.assert(tuiInRange(colIndex, 0, DAYS_IN_WEEK));
  let day = rowIndex * DAYS_IN_WEEK + colIndex - getMonthStartDaysOffset(month, firstDayOfWeek) + 1;
  if (day > month.daysCount) {
    day -= month.daysCount;
    month = month.append({
      month: 1
    });
  }
  if (day <= 0) {
    month = month.append({
      month: -1
    });
    day = month.daysCount + day;
  }
  return new TuiDay(month.year, month.month, day);
};
var CALENDAR_ROWS_COUNT = 6;
var TuiCalendarSheetPipe = class _TuiCalendarSheetPipe {
  constructor() {
    this.firstDayOfWeek = inject(TUI_FIRST_DAY_OF_WEEK);
    this.currentMonth = null;
    this.currentSheet = [];
  }
  transform(month, showAdjacentDays = false) {
    if (this.currentMonth?.monthSame(month)) {
      return this.currentSheet;
    }
    const sheet = [];
    for (let rowIndex = 0; rowIndex < CALENDAR_ROWS_COUNT; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < DAYS_IN_WEEK; colIndex++) {
        const day = getDayFromMonthRowCol({
          month,
          rowIndex,
          colIndex,
          firstDayOfWeek: this.firstDayOfWeek
        });
        const isPrevMonthDay = (day2, relativeToMonth = month) => day2.year < relativeToMonth.year || day2.month < relativeToMonth.month;
        const isNextMonthDay = (day2, relativeToMonth = month) => day2.year > relativeToMonth.year || day2.month > relativeToMonth.month;
        if (isPrevMonthDay(day) && !showAdjacentDays) {
          continue;
        }
        if (isNextMonthDay(day) && !showAdjacentDays) {
          break;
        }
        row.push(day);
      }
      sheet.push(row);
    }
    this.currentSheet = sheet.filter((row) => row.length);
    this.currentMonth = month;
    return this.currentSheet;
  }
  static {
    this.ɵfac = function TuiCalendarSheetPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCalendarSheetPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiCalendarSheet",
      type: _TuiCalendarSheetPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCalendarSheetPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiCalendarSheet"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-fallback-src.mjs
var TuiFallbackSrcPipe = class _TuiFallbackSrcPipe {
  constructor() {
    this.el = tuiInjectElement();
  }
  transform(src, fallback) {
    return fromEvent(this.el, "error", {
      capture: true
    }).pipe(map(() => fallback), startWith(src || fallback));
  }
  static {
    this.ɵfac = function TuiFallbackSrcPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFallbackSrcPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiFallbackSrc",
      type: _TuiFallbackSrcPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFallbackSrcPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiFallbackSrc"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-flag.mjs
var TuiFlagPipe = class _TuiFlagPipe {
  constructor() {
    this.staticPath = inject(TUI_ASSETS_PATH);
  }
  transform(countryIsoCode) {
    if (!countryIsoCode) {
      return null;
    }
    return `${this.staticPath}/flags/${countryIsoCode.toLowerCase()}.svg`;
  }
  static {
    this.ɵfac = function TuiFlagPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFlagPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiFlag",
      type: _TuiFlagPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFlagPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiFlag"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-format-date.mjs
var TuiFormatDatePipe = class _TuiFormatDatePipe {
  constructor() {
    this.service = inject(TuiFormatDateService);
  }
  transform(timestampOrDate) {
    return this.service.format(timestampOrDate.valueOf());
  }
  static {
    this.ɵfac = function TuiFormatDatePipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFormatDatePipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiFormatDate",
      type: _TuiFormatDatePipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFormatDatePipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiFormatDate"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-format-number.mjs
var TuiFormatNumberPipe = class _TuiFormatNumberPipe {
  constructor() {
    this.numberFormat = inject(TUI_NUMBER_FORMAT);
  }
  /**
   * Formats number adding thousand separators and correct decimal separator
   * padding decimal part with zeroes to given length
   * @param value number
   * @param settings See {@link TuiNumberFormatSettings}
   */
  transform(value, settings = {}) {
    return this.numberFormat.pipe(map((format) => tuiFormatNumber(value, __spreadValues(__spreadProps(__spreadValues({}, format), {
      precision: Number.isNaN(format.precision) ? Infinity : format.precision
    }), settings))));
  }
  static {
    this.ɵfac = function TuiFormatNumberPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFormatNumberPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiFormatNumber",
      type: _TuiFormatNumberPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFormatNumberPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiFormatNumber"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-initials.mjs
var TuiInitialsPipe = class _TuiInitialsPipe {
  transform(text) {
    return text.toUpperCase().split(" ").map(([char]) => char).join("").slice(0, 2);
  }
  static {
    this.ɵfac = function TuiInitialsPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiInitialsPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiInitials",
      type: _TuiInitialsPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInitialsPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiInitials"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-month.mjs
var TuiMonthPipe = class _TuiMonthPipe {
  constructor() {
    this.months$ = inject(TUI_MONTHS);
  }
  transform({
    month
  }) {
    return this.months$.pipe(map((months) => months[month] || months[0]));
  }
  static {
    this.ɵfac = function TuiMonthPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiMonthPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiMonth",
      type: _TuiMonthPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiMonthPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiMonth"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-order-week-days.mjs
function convertToSundayFirstWeekFormat(weekDaysNames) {
  const sundayIndex = weekDaysNames.length - 1;
  return [weekDaysNames[sundayIndex] || "", ...weekDaysNames.slice(0, sundayIndex)];
}
var TuiOrderWeekDaysPipe = class _TuiOrderWeekDaysPipe {
  constructor() {
    this.firstDayOfWeekIndex = inject(TUI_FIRST_DAY_OF_WEEK);
  }
  transform(mondayFirstWeekDays$) {
    return mondayFirstWeekDays$.pipe(map(convertToSundayFirstWeekFormat), map((weekDays) => [...weekDays.slice(this.firstDayOfWeekIndex), ...weekDays.slice(0, this.firstDayOfWeekIndex)]));
  }
  static {
    this.ɵfac = function TuiOrderWeekDaysPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOrderWeekDaysPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiOrderWeekDays",
      type: _TuiOrderWeekDaysPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOrderWeekDaysPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiOrderWeekDays"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-spin-button.mjs
var _c02 = ["*"];
function TuiSpinButton_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementContainerStart(0);
    ɵɵelementStart(1, "button", 1);
    ɵɵlistener("click", function TuiSpinButton_ng_container_0_Template_button_click_1_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onLeftClick());
    });
    ɵɵtext(2);
    ɵɵelementEnd();
    ɵɵelementStart(3, "span", 2);
    ɵɵprojection(4);
    ɵɵelementEnd();
    ɵɵelementStart(5, "button", 3);
    ɵɵlistener("click", function TuiSpinButton_ng_container_0_Template_button_click_5_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onRightClick());
    });
    ɵɵtext(6);
    ɵɵelementEnd();
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const texts_r3 = ctx.ngIf;
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵclassProp("t-button_hidden", ctx_r1.disabled || ctx_r1.leftDisabled);
    ɵɵproperty("iconStart", ctx_r1.icons.decrement)("tabIndex", ctx_r1.focusable ? 0 : -1);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", texts_r3[0], " ");
    ɵɵadvance(3);
    ɵɵclassProp("t-button_hidden", ctx_r1.disabled || ctx_r1.rightDisabled);
    ɵɵproperty("iconStart", ctx_r1.icons.increment)("tabIndex", ctx_r1.focusable ? 0 : -1);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", texts_r3[1], " ");
  }
}
var TuiSpinButton = class _TuiSpinButton {
  constructor() {
    this.icons = inject(TUI_SPIN_ICONS);
    this.spinTexts$ = inject(TUI_SPIN_TEXTS);
    this.focusable = true;
    this.disabled = false;
    this.leftDisabled = false;
    this.rightDisabled = false;
    this.leftClick = new EventEmitter();
    this.rightClick = new EventEmitter();
  }
  onLeftClick() {
    if (!this.disabled && !this.leftDisabled) {
      this.leftClick.emit();
    }
  }
  onRightClick() {
    if (!this.disabled && !this.rightDisabled) {
      this.rightClick.emit();
    }
  }
  static {
    this.ɵfac = function TuiSpinButton_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSpinButton)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiSpinButton,
      selectors: [["tui-spin-button"]],
      hostBindings: function TuiSpinButton_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("mousedown.zoneless.prevent", function TuiSpinButton_mousedown_zoneless_prevent_HostBindingHandler() {
            return 0;
          })("keydown.arrowLeft.prevent", function TuiSpinButton_keydown_arrowLeft_prevent_HostBindingHandler() {
            return ctx.onLeftClick();
          })("keydown.arrowRight.prevent", function TuiSpinButton_keydown_arrowRight_prevent_HostBindingHandler() {
            return ctx.onRightClick();
          });
        }
      },
      inputs: {
        focusable: "focusable",
        disabled: "disabled",
        leftDisabled: "leftDisabled",
        rightDisabled: "rightDisabled"
      },
      outputs: {
        leftClick: "leftClick",
        rightClick: "rightClick"
      },
      ngContentSelectors: _c02,
      decls: 2,
      vars: 3,
      consts: [[4, "ngIf"], ["appearance", "flat", "automation-id", "tui-spin-button__left", "size", "xs", "tuiIconButton", "", "type", "button", 1, "t-button", 3, "click", "iconStart", "tabIndex"], [1, "t-content", "t-calendar-title"], ["appearance", "flat", "automation-id", "tui-spin-button__right", "size", "xs", "tuiIconButton", "", "type", "button", 1, "t-button", 3, "click", "iconStart", "tabIndex"]],
      template: function TuiSpinButton_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵtemplate(0, TuiSpinButton_ng_container_0_Template, 7, 10, "ng-container", 0);
          ɵɵpipe(1, "async");
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", ɵɵpipeBind1(1, 1, ctx.spinTexts$));
        }
      },
      dependencies: [AsyncPipe, NgIf, TuiButton],
      styles: ["[_nghost-%COMP%]{display:flex;align-items:center;justify-content:space-between;font:var(--tui-font-text-l);text-align:center;font-weight:700}.t-button[_ngcontent-%COMP%]{transform:scaleX(var(--tui-inline))}.t-button_hidden[_ngcontent-%COMP%]{visibility:hidden}.t-content[_ngcontent-%COMP%]{padding:0 .5rem}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSpinButton, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-spin-button",
      imports: [AsyncPipe, NgIf, TuiButton],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "(mousedown.zoneless.prevent)": "(0)",
        "(keydown.arrowLeft.prevent)": "onLeftClick()",
        "(keydown.arrowRight.prevent)": "onRightClick()"
      },
      template: '<ng-container *ngIf="spinTexts$ | async as texts">\n    <button\n        appearance="flat"\n        automation-id="tui-spin-button__left"\n        size="xs"\n        tuiIconButton\n        type="button"\n        class="t-button"\n        [class.t-button_hidden]="disabled || leftDisabled"\n        [iconStart]="icons.decrement"\n        [tabIndex]="focusable ? 0 : -1"\n        (click)="onLeftClick()"\n    >\n        {{ texts[0] }}\n    </button>\n    <span class="t-content t-calendar-title">\n        <ng-content />\n    </span>\n    <button\n        appearance="flat"\n        automation-id="tui-spin-button__right"\n        size="xs"\n        tuiIconButton\n        type="button"\n        class="t-button"\n        [class.t-button_hidden]="disabled || rightDisabled"\n        [iconStart]="icons.increment"\n        [tabIndex]="focusable ? 0 : -1"\n        (click)="onRightClick()"\n    >\n        {{ texts[1] }}\n    </button>\n</ng-container>\n',
      styles: [":host{display:flex;align-items:center;justify-content:space-between;font:var(--tui-font-text-l);text-align:center;font-weight:700}.t-button{transform:scaleX(var(--tui-inline))}.t-button_hidden{visibility:hidden}.t-content{padding:0 .5rem}\n"]
    }]
  }], null, {
    focusable: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    leftDisabled: [{
      type: Input
    }],
    rightDisabled: [{
      type: Input
    }],
    leftClick: [{
      type: Output
    }],
    rightClick: [{
      type: Output
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-let.mjs
var TuiLetContext = class {
  constructor(internalDirectiveInstance) {
    this.internalDirectiveInstance = internalDirectiveInstance;
  }
  get $implicit() {
    return this.internalDirectiveInstance.tuiLet;
  }
  get tuiLet() {
    return this.internalDirectiveInstance.tuiLet;
  }
};
var TuiLet = class _TuiLet {
  constructor() {
    inject(ViewContainerRef).createEmbeddedView(inject(TemplateRef), new TuiLetContext(this));
  }
  /**
   * Asserts the correct type of the context for the template that `TuiLet` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `TuiLet` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  static {
    this.ɵfac = function TuiLet_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLet)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiLet,
      selectors: [["", "tuiLet", ""]],
      inputs: {
        tuiLet: "tuiLet"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLet, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiLet]"
    }]
  }], function() {
    return [];
  }, {
    tuiLet: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-repeat-times.mjs
var MAX_VALUE = 65536;
var TuiRepeatTimesContext = class {
  constructor($implicit) {
    this.$implicit = $implicit;
  }
};
var TuiRepeatTimes = class _TuiRepeatTimes {
  constructor() {
    this.viewContainer = inject(ViewContainerRef);
    this.templateRef = inject(TemplateRef);
  }
  set tuiRepeatTimesOf(count) {
    const safeCount = Math.floor(tuiClamp(count, 0, MAX_VALUE));
    const {
      length
    } = this.viewContainer;
    if (count < length) {
      this.removeContainers(length - count);
    } else {
      this.addContainers(safeCount);
    }
  }
  addContainers(count) {
    for (let index = this.viewContainer.length; index < count; index++) {
      this.viewContainer.createEmbeddedView(this.templateRef, new TuiRepeatTimesContext(index));
    }
  }
  removeContainers(amount) {
    for (let index = 0; index < amount; index++) {
      this.viewContainer.remove();
    }
  }
  static {
    this.ɵfac = function TuiRepeatTimes_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiRepeatTimes)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiRepeatTimes,
      selectors: [["", "tuiRepeatTimes", "", "tuiRepeatTimesOf", ""]],
      inputs: {
        tuiRepeatTimesOf: "tuiRepeatTimesOf"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiRepeatTimes, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiRepeatTimes][tuiRepeatTimesOf]"
    }]
  }], null, {
    tuiRepeatTimesOf: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-calendar.mjs
var _c03 = (a0, a1, a2, a3, a4) => [a0, a1, a2, a3, a4];
function TuiCalendarSheet_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 3);
  }
  if (rf & 2) {
    const day_r1 = ctx.$implicit;
    ɵɵproperty("textContent", day_r1);
  }
}
function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 11);
  }
  if (rf & 2) {
    const markers_r5 = ɵɵnextContext().ngIf;
    ɵɵstyleProp("background", (markers_r5 == null ? null : markers_r5[1]) || "");
  }
}
function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 10);
    ɵɵelement(1, "div", 11);
    ɵɵtemplate(2, TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_div_3_div_2_Template, 1, 2, "div", 12);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const markers_r5 = ctx.ngIf;
    ɵɵadvance();
    ɵɵstyleProp("background", markers_r5 == null ? null : markers_r5[0]);
    ɵɵadvance();
    ɵɵproperty("ngIf", markers_r5.length > 1);
  }
}
function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 8);
    ɵɵpipe(1, "tuiMapper");
    ɵɵlistener("click", function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_Template_div_click_0_listener() {
      ɵɵrestoreView(_r2);
      const item_r3 = ɵɵnextContext().tuiLet;
      const ctx_r3 = ɵɵnextContext(4);
      return ɵɵresetView(ctx_r3.onItemClick(item_r3));
    })("tuiHoveredChange", function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_Template_div_tuiHoveredChange_0_listener($event) {
      ɵɵrestoreView(_r2);
      const item_r3 = ɵɵnextContext().tuiLet;
      const ctx_r3 = ɵɵnextContext(4);
      return ɵɵresetView(ctx_r3.onItemHovered($event && item_r3));
    });
    ɵɵtext(2);
    ɵɵtemplate(3, TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_div_3_Template, 3, 3, "div", 9);
    ɵɵpipe(4, "tuiMapper");
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext().tuiLet;
    const ctx_r3 = ɵɵnextContext(4);
    ɵɵclassProp("t-cell_disabled", ctx_r3.disabledItemHandler(item_r3))("t-cell_today", ctx_r3.itemIsToday(item_r3))("t-cell_unavailable", ctx_r3.itemIsUnavailable(item_r3));
    ɵɵattribute("data-range", ctx_r3.getItemRange(item_r3))("data-type", ɵɵpipeBind2(1, 10, item_r3, ctx_r3.dayTypeHandler));
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", item_r3.day, " ");
    ɵɵadvance();
    ɵɵproperty("ngIf", ɵɵpipeBindV(4, 13, ɵɵpureFunction5(19, _c03, item_r3, ctx_r3.toMarkers, ctx_r3.itemIsToday(item_r3), ctx_r3.getItemRange(item_r3), ctx_r3.markerHandler)));
  }
}
function TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_div_1_Template, 5, 25, "div", 7);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const item_r3 = ctx.tuiLet;
    const ctx_r3 = ɵɵnextContext(4);
    ɵɵadvance();
    ɵɵproperty("ngIf", item_r3 && (!ctx_r3.itemIsUnavailable(item_r3) || ctx_r3.showAdjacent));
  }
}
function TuiCalendarSheet_div_4_div_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TuiCalendarSheet_div_4_div_1_ng_container_1_ng_container_1_Template, 2, 1, "ng-container", 2);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const colIndex_r6 = ctx.$implicit;
    const rowIndex_r7 = ɵɵnextContext().$implicit;
    const sheet_r8 = ɵɵnextContext().tuiLet;
    ɵɵadvance();
    ɵɵproperty("tuiLet", sheet_r8[rowIndex_r7] == null ? null : sheet_r8[rowIndex_r7][colIndex_r6]);
  }
}
function TuiCalendarSheet_div_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5);
    ɵɵtemplate(1, TuiCalendarSheet_div_4_div_1_ng_container_1_Template, 2, 1, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const rowIndex_r7 = ctx.$implicit;
    const sheet_r8 = ɵɵnextContext().tuiLet;
    ɵɵadvance();
    ɵɵproperty("tuiRepeatTimesOf", (sheet_r8[rowIndex_r7] == null ? null : sheet_r8[rowIndex_r7].length) || 0);
  }
}
function TuiCalendarSheet_div_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵtemplate(1, TuiCalendarSheet_div_4_div_1_Template, 2, 1, "div", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const sheet_r8 = ctx.tuiLet;
    ɵɵadvance();
    ɵɵproperty("tuiRepeatTimesOf", sheet_r8.length);
  }
}
function TuiCalendarSpin_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.value.formattedYear, " ");
  }
}
function TuiCalendarSpin_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 3);
    ɵɵlistener("click", function TuiCalendarSpin_ng_template_5_Template_button_click_0_listener() {
      ɵɵrestoreView(_r2);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.onYearClick());
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.value.formattedYear, " ");
  }
}
function TuiCalendarYear_div_0_ng_container_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 4);
    ɵɵlistener("click", function TuiCalendarYear_div_0_ng_container_1_div_1_Template_div_click_0_listener() {
      const item_r2 = ɵɵrestoreView(_r1).tuiLet;
      const ctx_r2 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r2.yearClick.emit(item_r2));
    })("tuiHoveredChange", function TuiCalendarYear_div_0_ng_container_1_div_1_Template_div_tuiHoveredChange_0_listener($event) {
      const item_r2 = ɵɵrestoreView(_r1).tuiLet;
      const ctx_r2 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r2.onItemHovered($event, item_r2));
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.tuiLet;
    const ctx_r2 = ɵɵnextContext(3);
    ɵɵclassProp("t-cell_disabled", ctx_r2.isDisabled(item_r2))("t-cell_today", ctx_r2.itemIsToday(item_r2));
    ɵɵproperty("tuiScrollIntoView", ctx_r2.scrollItemIntoView(item_r2));
    ɵɵattribute("data-range", ctx_r2.getItemRange(item_r2));
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r2, " ");
  }
}
function TuiCalendarYear_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TuiCalendarYear_div_0_ng_container_1_div_1_Template, 2, 7, "div", 3);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const colIndex_r4 = ctx.$implicit;
    const rowIndex_r5 = ɵɵnextContext().$implicit;
    const ctx_r2 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("tuiLet", ctx_r2.getItem(rowIndex_r5, colIndex_r4));
  }
}
function TuiCalendarYear_div_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, TuiCalendarYear_div_0_ng_container_1_Template, 2, 1, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    ɵɵadvance();
    ɵɵproperty("tuiRepeatTimesOf", 4);
  }
}
function TuiCalendar_tui_scrollbar_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "tui-scrollbar", 2)(1, "tui-calendar-year", 3);
    ɵɵlistener("yearClick", function TuiCalendar_tui_scrollbar_0_Template_tui_calendar_year_yearClick_1_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onPickerYearClick($event));
    });
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("initialItem", ctx_r1.month.year)("max", ctx_r1.computedMax.year)("min", ctx_r1.computedMin.year)("rangeMode", ctx_r1.options.rangeMode)("value", ctx_r1.value);
  }
}
function TuiCalendar_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "tui-calendar-spin", 4);
    ɵɵlistener("valueChange", function TuiCalendar_ng_template_1_Template_tui_calendar_spin_valueChange_0_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onPaginationValueChange($event));
    })("yearClick", function TuiCalendar_ng_template_1_Template_tui_calendar_spin_yearClick_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onPaginationYearClick());
    });
    ɵɵelementEnd();
    ɵɵelementStart(1, "tui-calendar-sheet", 5);
    ɵɵpipe(2, "tuiMapper");
    ɵɵlistener("dayClick", function TuiCalendar_ng_template_1_Template_tui_calendar_sheet_dayClick_1_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onDayClick($event));
    })("hoveredItemChange", function TuiCalendar_ng_template_1_Template_tui_calendar_sheet_hoveredItemChange_1_listener($event) {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onHoveredItemChange($event));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("max", ctx_r1.computedMaxViewedMonth)("min", ctx_r1.computedMinViewedMonth)("value", ctx_r1.month);
    ɵɵadvance();
    ɵɵproperty("disabledItemHandler", ɵɵpipeBind4(2, 9, ctx_r1.disabledItemHandler, ctx_r1.disabledItemHandlerMapper, ctx_r1.computedMin, ctx_r1.computedMax))("hoveredItem", ctx_r1.hoveredItem)("markerHandler", ctx_r1.markerHandler)("month", ctx_r1.month)("showAdjacent", ctx_r1.showAdjacent)("value", ctx_r1.value);
  }
}
var TUI_CALENDAR_SHEET_DEFAULT_OPTIONS = {
  rangeMode: false
};
var TUI_CALENDAR_SHEET_OPTIONS = new InjectionToken(ngDevMode ? "TUI_CALENDAR_SHEET_OPTIONS" : "", {
  factory: () => TUI_CALENDAR_SHEET_DEFAULT_OPTIONS
});
function tuiCalendarSheetOptionsProvider(options) {
  return tuiProvideOptions(TUI_CALENDAR_SHEET_OPTIONS, options, TUI_CALENDAR_SHEET_DEFAULT_OPTIONS);
}
var TuiCalendarSheet = class _TuiCalendarSheet {
  constructor() {
    this.options = inject(TUI_CALENDAR_SHEET_OPTIONS);
    this.today = TuiDay.currentLocal();
    this.unorderedWeekDays$ = inject(TUI_SHORT_WEEK_DAYS);
    this.dayTypeHandler = inject(TUI_DAY_TYPE_HANDLER);
    this.month = TuiMonth.currentLocal();
    this.disabledItemHandler = TUI_FALSE_HANDLER;
    this.markerHandler = null;
    this.value = null;
    this.hoveredItem = null;
    this.showAdjacent = true;
    this.single = true;
    this.hoveredItemChange = new EventEmitter();
    this.dayClick = new EventEmitter();
    this.toMarkers = (day, today, range, markerHandler) => {
      if (today || ["active", "end", "start"].includes(range || "")) {
        return null;
      }
      const markers = markerHandler?.(day);
      return markers?.length ? markers : null;
    };
  }
  /**
   * @deprecated TODO(v5): delete it. It is used nowhere except unit tests
   */
  itemIsInterval(day) {
    const {
      value,
      hoveredItem
    } = this;
    if (!(value instanceof TuiDayRange)) {
      return false;
    }
    if (!value.isSingleDay) {
      return value.from.daySameOrBefore(day) && value.to.dayAfter(day);
    }
    if (hoveredItem === null) {
      return false;
    }
    const range = TuiDayRange.sort(value.from, hoveredItem);
    return range.from.daySameOrBefore(day) && range.to.dayAfter(day);
  }
  onItemHovered(item) {
    this.updateHoveredItem(item || null);
  }
  getItemRange(item) {
    const {
      value,
      hoveredItem
    } = this;
    if (!value) {
      return null;
    }
    if (value instanceof TuiDay && !this.computedRangeMode) {
      return value.daySame(item) ? "active" : null;
    }
    if (value instanceof TuiDayRange && value.isSingleDay) {
      return value.from.daySame(item) ? "active" : null;
    }
    if (!(value instanceof TuiDay) && !(value instanceof TuiDayRange)) {
      return value.find((day) => day.daySame(item)) ? "active" : null;
    }
    const range = this.getRange(value, hoveredItem);
    if (range.isSingleDay && range.from.daySame(item)) {
      return "active";
    }
    if (range.from.daySame(item)) {
      return "start";
    }
    if (range.to.daySame(item)) {
      return "end";
    }
    return range.from.dayBefore(item) && range.to.dayAfter(item) ? "middle" : null;
  }
  get computedRangeMode() {
    return !this.single || this.options.rangeMode;
  }
  get isRangePicking() {
    return this.computedRangeMode ? this.value instanceof TuiDay : (
      /**
       * Only for backward compatibility!
       * TODO(v5): replace with `this.options.rangeMode && this.value instanceof TuiDay`
       */
      this.value instanceof TuiDayRange && this.value.isSingleDay
    );
  }
  itemIsToday(item) {
    return this.today.daySame(item);
  }
  itemIsUnavailable(item) {
    return !this.month.monthSame(item);
  }
  onItemClick(item) {
    this.dayClick.emit(item);
  }
  getRange(value, hoveredItem) {
    if (value instanceof TuiDay) {
      return TuiDayRange.sort(value, hoveredItem ?? value);
    }
    return value.isSingleDay ? TuiDayRange.sort(value.from, hoveredItem ?? value.to) : value;
  }
  updateHoveredItem(day) {
    if (tuiNullableSame(this.hoveredItem, day, (a, b) => a.daySame(b))) {
      return;
    }
    this.hoveredItem = day;
    this.hoveredItemChange.emit(day);
  }
  static {
    this.ɵfac = function TuiCalendarSheet_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCalendarSheet)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiCalendarSheet,
      selectors: [["tui-calendar-sheet"]],
      hostVars: 2,
      hostBindings: function TuiCalendarSheet_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("_picking", ctx.isRangePicking);
        }
      },
      inputs: {
        month: "month",
        disabledItemHandler: "disabledItemHandler",
        markerHandler: "markerHandler",
        value: "value",
        hoveredItem: "hoveredItem",
        showAdjacent: "showAdjacent",
        single: "single"
      },
      outputs: {
        hoveredItemChange: "hoveredItemChange",
        dayClick: "dayClick"
      },
      decls: 6,
      vars: 9,
      consts: [[1, "t-row", "t-row_weekday"], ["class", "t-cell", 3, "textContent", 4, "ngFor", "ngForOf"], [4, "tuiLet"], [1, "t-cell", 3, "textContent"], ["automation-id", "tui-calendar-sheet__row", "class", "t-row", 4, "tuiRepeatTimes", "tuiRepeatTimesOf"], ["automation-id", "tui-calendar-sheet__row", 1, "t-row"], [4, "tuiRepeatTimes", "tuiRepeatTimesOf"], ["automation-id", "tui-calendar-sheet__cell", "class", "t-cell", 3, "t-cell_disabled", "t-cell_today", "t-cell_unavailable", "click", "tuiHoveredChange", 4, "ngIf"], ["automation-id", "tui-calendar-sheet__cell", 1, "t-cell", 3, "click", "tuiHoveredChange"], ["class", "t-dots", 4, "ngIf"], [1, "t-dots"], [1, "t-dot"], ["class", "t-dot", 3, "background", 4, "ngIf"]],
      template: function TuiCalendarSheet_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelementStart(0, "div", 0);
          ɵɵtemplate(1, TuiCalendarSheet_div_1_Template, 1, 1, "div", 1);
          ɵɵpipe(2, "tuiOrderWeekDays");
          ɵɵpipe(3, "async");
          ɵɵelementEnd();
          ɵɵtemplate(4, TuiCalendarSheet_div_4_Template, 2, 1, "div", 2);
          ɵɵpipe(5, "tuiCalendarSheet");
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵproperty("ngForOf", ɵɵpipeBind1(3, 4, ɵɵpipeBind1(2, 2, ctx.unorderedWeekDays$)));
          ɵɵadvance(3);
          ɵɵproperty("tuiLet", ɵɵpipeBind2(5, 6, ctx.month, true));
        }
      },
      dependencies: [AsyncPipe, NgForOf, NgIf, TuiCalendarSheetPipe, TuiHovered, TuiLet, TuiMapperPipe, TuiOrderWeekDaysPipe, TuiRepeatTimes],
      styles: [`.t-row[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;font:var(--tui-font-text-m)}.t-row[_ngcontent-%COMP%]:last-child{justify-content:flex-start}.t-cell[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center;line-height:2rem;isolation:isolate;cursor:pointer;overflow:hidden;border:.125rem solid transparent;box-sizing:border-box;-webkit-mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem));mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem))}.t-cell[_ngcontent-%COMP%]:first-child{border-inline-start-color:transparent!important}.t-cell[_ngcontent-%COMP%]:last-child{border-inline-end-color:transparent!important}.t-cell[_ngcontent-%COMP%]:before, .t-cell[_ngcontent-%COMP%]:after{position:absolute;top:0;left:0;bottom:0;right:0;content:"";z-index:-1;border-radius:var(--tui-radius-m)}.t-cell[_ngcontent-%COMP%]:after{-webkit-mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat;mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat}.t-cell[data-range][_ngcontent-%COMP%]:before{background:var(--tui-background-neutral-1)}._picking[_nghost-%COMP%]   .t-cell[data-range][_ngcontent-%COMP%]:before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle][_ngcontent-%COMP%]{border-color:var(--tui-background-neutral-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=middle][_ngcontent-%COMP%]{border-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle][_ngcontent-%COMP%]:not(:first-child):before{border-top-left-radius:0;border-bottom-left-radius:0}.t-cell[data-range=middle][_ngcontent-%COMP%]:not(:last-child):before{border-top-right-radius:0;border-bottom-right-radius:0}.t-cell[data-range=start][_ngcontent-%COMP%]{border-inline-end-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=start][_ngcontent-%COMP%]{border-inline-end-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start][_ngcontent-%COMP%]:not(:last-child):before{right:-1rem}.t-cell[data-range=start][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1)}.t-cell[data-range=end][_ngcontent-%COMP%]{border-inline-start-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=end][_ngcontent-%COMP%]{border-inline-start-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=end][_ngcontent-%COMP%]:not(:first-child):before{left:-1rem}.t-cell[data-range=end][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1);transform:scaleX(-1)}.t-cell[data-range=active][_ngcontent-%COMP%]{color:var(--tui-text-primary-on-accent-1)}.t-cell[data-range=active][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1);-webkit-mask:none;mask:none}.t-cell_disabled[_ngcontent-%COMP%]{opacity:var(--tui-disabled-opacity);pointer-events:none}.t-cell_today[_ngcontent-%COMP%]{text-decoration:underline;text-underline-offset:.25rem}@media (hover: hover) and (pointer: fine){.t-cell[_ngcontent-%COMP%]:hover:not([data-range=start]):not([data-range=end]):before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start][_ngcontent-%COMP%]:hover:after, .t-cell[data-range=end][_ngcontent-%COMP%]:hover:after, .t-cell[data-range=active][_ngcontent-%COMP%]:hover:after{background:var(--tui-background-accent-1-hover)}}.t-cell[_ngcontent-%COMP%]{inline-size:calc(100% / 7)}[data-type=weekday][_ngcontent-%COMP%]{color:var(--tui-text-primary)}[data-type=weekend][_ngcontent-%COMP%]{color:var(--tui-text-negative)}.t-row[_ngcontent-%COMP%]{justify-content:flex-start}.t-row[_ngcontent-%COMP%]:first-child{justify-content:flex-end}.t-row_weekday[_ngcontent-%COMP%]{font:var(--tui-font-text-s);color:var(--tui-text-secondary);pointer-events:none}.t-cell_unavailable[_ngcontent-%COMP%]{opacity:var(--tui-disabled-opacity)}.t-dots[_ngcontent-%COMP%]{position:absolute;bottom:0;display:flex;justify-content:center;margin-block-start:-.5rem;padding-block-end:.25rem}.t-dot[_ngcontent-%COMP%]{display:inline-block;inline-size:.25rem;block-size:.25rem;border-radius:100%;margin:0 .0625rem}`]
    });
  }
};
__decorate([tuiPure], TuiCalendarSheet.prototype, "getRange", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCalendarSheet, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-calendar-sheet",
      imports: [AsyncPipe, NgForOf, NgIf, TuiCalendarSheetPipe, TuiHovered, TuiLet, TuiMapperPipe, TuiOrderWeekDaysPipe, TuiRepeatTimes],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._picking]": "isRangePicking"
      },
      template: `<div class="t-row t-row_weekday">
    <div
        *ngFor="let day of unorderedWeekDays$ | tuiOrderWeekDays | async"
        class="t-cell"
        [textContent]="day"
    ></div>
</div>
<div *tuiLet="month | tuiCalendarSheet: true as sheet">
    <div
        *tuiRepeatTimes="let rowIndex of sheet.length"
        automation-id="tui-calendar-sheet__row"
        class="t-row"
    >
        <ng-container *tuiRepeatTimes="let colIndex of sheet[rowIndex]?.length || 0">
            <ng-container *tuiLet="sheet[rowIndex]?.[colIndex] as item">
                <div
                    *ngIf="item && (!itemIsUnavailable(item) || showAdjacent)"
                    automation-id="tui-calendar-sheet__cell"
                    class="t-cell"
                    [attr.data-range]="getItemRange(item)"
                    [attr.data-type]="item | tuiMapper: dayTypeHandler"
                    [class.t-cell_disabled]="disabledItemHandler(item)"
                    [class.t-cell_today]="itemIsToday(item)"
                    [class.t-cell_unavailable]="itemIsUnavailable(item)"
                    (click)="onItemClick(item)"
                    (tuiHoveredChange)="onItemHovered($event && item)"
                >
                    {{ item.day }}
                    <div
                        *ngIf="
                            item
                                | tuiMapper
                                    : toMarkers
                                    : itemIsToday(item)
                                    : getItemRange(item)
                                    : markerHandler as markers
                        "
                        class="t-dots"
                    >
                        <div
                            class="t-dot"
                            [style.background]="markers?.[0]"
                        ></div>
                        <div
                            *ngIf="markers.length > 1"
                            class="t-dot"
                            [style.background]="markers?.[1] || ''"
                        ></div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    </div>
</div>
`,
      styles: [`.t-row{display:flex;justify-content:flex-start;font:var(--tui-font-text-m)}.t-row:last-child{justify-content:flex-start}.t-cell{position:relative;display:flex;align-items:center;justify-content:center;line-height:2rem;isolation:isolate;cursor:pointer;overflow:hidden;border:.125rem solid transparent;box-sizing:border-box;-webkit-mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem));mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem))}.t-cell:first-child{border-inline-start-color:transparent!important}.t-cell:last-child{border-inline-end-color:transparent!important}.t-cell:before,.t-cell:after{position:absolute;top:0;left:0;bottom:0;right:0;content:"";z-index:-1;border-radius:var(--tui-radius-m)}.t-cell:after{-webkit-mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat;mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat}.t-cell[data-range]:before{background:var(--tui-background-neutral-1)}:host._picking .t-cell[data-range]:before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle]{border-color:var(--tui-background-neutral-1)}:host._picking .t-cell[data-range=middle]{border-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle]:not(:first-child):before{border-top-left-radius:0;border-bottom-left-radius:0}.t-cell[data-range=middle]:not(:last-child):before{border-top-right-radius:0;border-bottom-right-radius:0}.t-cell[data-range=start]{border-inline-end-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}:host._picking .t-cell[data-range=start]{border-inline-end-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start]:not(:last-child):before{right:-1rem}.t-cell[data-range=start]:after{background:var(--tui-background-accent-1)}.t-cell[data-range=end]{border-inline-start-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}:host._picking .t-cell[data-range=end]{border-inline-start-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=end]:not(:first-child):before{left:-1rem}.t-cell[data-range=end]:after{background:var(--tui-background-accent-1);transform:scaleX(-1)}.t-cell[data-range=active]{color:var(--tui-text-primary-on-accent-1)}.t-cell[data-range=active]:after{background:var(--tui-background-accent-1);-webkit-mask:none;mask:none}.t-cell_disabled{opacity:var(--tui-disabled-opacity);pointer-events:none}.t-cell_today{text-decoration:underline;text-underline-offset:.25rem}@media (hover: hover) and (pointer: fine){.t-cell:hover:not([data-range=start]):not([data-range=end]):before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start]:hover:after,.t-cell[data-range=end]:hover:after,.t-cell[data-range=active]:hover:after{background:var(--tui-background-accent-1-hover)}}.t-cell{inline-size:calc(100% / 7)}[data-type=weekday]{color:var(--tui-text-primary)}[data-type=weekend]{color:var(--tui-text-negative)}.t-row{justify-content:flex-start}.t-row:first-child{justify-content:flex-end}.t-row_weekday{font:var(--tui-font-text-s);color:var(--tui-text-secondary);pointer-events:none}.t-cell_unavailable{opacity:var(--tui-disabled-opacity)}.t-dots{position:absolute;bottom:0;display:flex;justify-content:center;margin-block-start:-.5rem;padding-block-end:.25rem}.t-dot{display:inline-block;inline-size:.25rem;block-size:.25rem;border-radius:100%;margin:0 .0625rem}
`]
    }]
  }], null, {
    month: [{
      type: Input
    }],
    disabledItemHandler: [{
      type: Input
    }],
    markerHandler: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    hoveredItem: [{
      type: Input
    }],
    showAdjacent: [{
      type: Input
    }],
    single: [{
      type: Input
    }],
    hoveredItemChange: [{
      type: Output
    }],
    dayClick: [{
      type: Output
    }],
    getRange: []
  });
})();
var TuiCalendarSpin = class _TuiCalendarSpin {
  constructor() {
    this.value = TuiMonth.currentLocal();
    this.min = TUI_FIRST_DAY;
    this.max = TUI_LAST_DAY;
    this.valueChange = new EventEmitter();
    this.yearClick = new EventEmitter();
  }
  onYearClick() {
    this.yearClick.next(this.value);
  }
  append(date) {
    const value = this.value.append(date);
    if (this.min.monthSameOrAfter(value)) {
      this.updateValue(this.min);
    } else {
      this.updateValue(this.max.monthSameOrBefore(value) ? this.max : value);
    }
  }
  updateValue(value) {
    if (this.value.monthSame(value)) {
      return;
    }
    this.value = value;
    this.valueChange.emit(value);
  }
  static {
    this.ɵfac = function TuiCalendarSpin_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCalendarSpin)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiCalendarSpin,
      selectors: [["tui-calendar-spin"]],
      inputs: {
        value: "value",
        min: "min",
        max: "max"
      },
      outputs: {
        valueChange: "valueChange",
        yearClick: "yearClick"
      },
      decls: 7,
      vars: 10,
      consts: [["button", ""], [3, "leftClick", "rightClick", "focusable", "leftDisabled", "rightDisabled"], [4, "ngIf", "ngIfElse"], ["id", "year-btn", "automation-id", "tui-primitive-year-month-pagination__year-button", "tabIndex", "-1", "tuiLink", "", "type", "button", 3, "click"]],
      template: function TuiCalendarSpin_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelementStart(0, "tui-spin-button", 1);
          ɵɵlistener("leftClick", function TuiCalendarSpin_Template_tui_spin_button_leftClick_0_listener() {
            return ctx.append({
              month: -1
            });
          })("rightClick", function TuiCalendarSpin_Template_tui_spin_button_rightClick_0_listener() {
            return ctx.append({
              month: 1
            });
          });
          ɵɵtext(1);
          ɵɵpipe(2, "tuiMonth");
          ɵɵpipe(3, "async");
          ɵɵtemplate(4, TuiCalendarSpin_ng_container_4_Template, 2, 1, "ng-container", 2)(5, TuiCalendarSpin_ng_template_5_Template, 2, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor);
          ɵɵelementEnd();
        }
        if (rf & 2) {
          const button_r3 = ɵɵreference(6);
          ɵɵproperty("focusable", false)("leftDisabled", ctx.value.monthSameOrBefore(ctx.min))("rightDisabled", ctx.value.monthSameOrAfter(ctx.max));
          ɵɵadvance();
          ɵɵtextInterpolate1(" ", ɵɵpipeBind1(3, 8, ɵɵpipeBind1(2, 6, ctx.value)), " ");
          ɵɵadvance(3);
          ɵɵproperty("ngIf", ctx.min.year === ctx.max.year)("ngIfElse", button_r3);
        }
      },
      dependencies: [AsyncPipe, NgIf, TuiLink, TuiMonthPipe, TuiSpinButton],
      styles: ["[_nghost-%COMP%]{display:block}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCalendarSpin, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-calendar-spin",
      imports: [AsyncPipe, NgIf, TuiLink, TuiMonthPipe, TuiSpinButton],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<tui-spin-button\n    [focusable]="false"\n    [leftDisabled]="value.monthSameOrBefore(min)"\n    [rightDisabled]="value.monthSameOrAfter(max)"\n    (leftClick)="append({month: -1})"\n    (rightClick)="append({month: 1})"\n>\n    {{ value | tuiMonth | async }}\n    <ng-container *ngIf="min.year === max.year; else button">\n        {{ value.formattedYear }}\n    </ng-container>\n    <ng-template #button>\n        <button\n            id="year-btn"\n            automation-id="tui-primitive-year-month-pagination__year-button"\n            tabIndex="-1"\n            tuiLink\n            type="button"\n            (click)="onYearClick()"\n        >\n            {{ value.formattedYear }}\n        </button>\n    </ng-template>\n</tui-spin-button>\n',
      styles: [":host{display:block}\n"]
    }]
  }], null, {
    value: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    valueChange: [{
      type: Output
    }],
    yearClick: [{
      type: Output
    }]
  });
})();
var LIMIT = 100;
var ITEMS_IN_ROW = 4;
var CURRENT_YEAR = TuiMonth.currentLocal().year;
var TuiCalendarYear = class _TuiCalendarYear {
  constructor() {
    this.hoveredItem = signal(null);
    this.isRangePicking = computed((x = this.value()) => this.rangeMode && (x instanceof TuiDay || x instanceof TuiMonth));
    this.rangeMode = false;
    this.disabledItemHandler = inject(TUI_ITEMS_HANDLERS).disabledItemHandler();
    this.yearClick = new EventEmitter();
    this.initialItem = signal(CURRENT_YEAR);
    this.min = signal(MIN_YEAR);
    this.max = signal(MAX_YEAR);
    this.value = signal(null);
  }
  // TODO(v5): use signal inputs
  set initialItemSetter(x) {
    this.initialItem.set(x ?? CURRENT_YEAR);
  }
  // TODO(v5): use signal inputs
  set minSetter(x) {
    this.min.set(x);
  }
  // TODO(v5): use signal inputs
  set maxSetter(x) {
    this.max.set(x);
  }
  // TODO(v5): use signal inputs
  set valueSetter(x) {
    this.value.set(x);
  }
  isDisabled(item) {
    return this.max() && this.max() < item || this.min() && this.min() > item || this.disabledItemHandler(item);
  }
  getItemRange(item) {
    const value = this.value();
    const hoveredItem = this.hoveredItem();
    if (value instanceof TuiYear && value.year === item) {
      return "active";
    }
    if (tuiIsNumber(value)) {
      return value === item ? "active" : null;
    }
    if (!(value instanceof TuiMonthRange) && !(value instanceof TuiYear)) {
      return value?.find((day) => day.year === item) ? "active" : null;
    }
    const hovered = this.isRangePicking() ? hoveredItem : null;
    const from = "from" in value ? value.from?.year : value.year;
    const to = "from" in value ? value.to.year : value.year;
    const min = Math.min(from, hovered ?? to);
    const max = Math.max(from, hovered ?? to);
    if (min === max && from === to && from === item) {
      return "active";
    }
    if (min === item) {
      return "start";
    }
    if (max === item) {
      return "end";
    }
    return min < item && item < max ? "middle" : null;
  }
  onItemHovered(hovered, item) {
    this.hoveredItem.set(hovered ? item : null);
  }
  get rows() {
    return Math.ceil((this.calculatedMax - this.calculatedMin) / ITEMS_IN_ROW);
  }
  scrollItemIntoView(item) {
    return this.initialItem() === item;
  }
  getItem(rowIndex, colIndex) {
    return rowIndex * ITEMS_IN_ROW + colIndex + this.calculatedMin;
  }
  itemIsToday(item) {
    return CURRENT_YEAR === item;
  }
  get calculatedMin() {
    const initial = this.initialItem() - LIMIT;
    const min = this.min() ?? MIN_YEAR;
    return min > initial ? min : initial;
  }
  get calculatedMax() {
    const initial = this.initialItem() + LIMIT;
    const max = this.max() ?? MAX_YEAR;
    return max < initial ? max + 1 : initial;
  }
  static {
    this.ɵfac = function TuiCalendarYear_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCalendarYear)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiCalendarYear,
      selectors: [["tui-calendar-year"]],
      hostVars: 2,
      hostBindings: function TuiCalendarYear_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("_picking", ctx.isRangePicking());
        }
      },
      inputs: {
        rangeMode: "rangeMode",
        disabledItemHandler: "disabledItemHandler",
        initialItemSetter: [2, "initialItem", "initialItemSetter", (x) => x ?? CURRENT_YEAR],
        minSetter: [2, "min", "minSetter", (x) => x ?? MIN_YEAR],
        maxSetter: [2, "max", "maxSetter", (x) => x ?? MAX_YEAR],
        valueSetter: [0, "value", "valueSetter"]
      },
      outputs: {
        yearClick: "yearClick"
      },
      features: [ɵɵProvidersFeature([tuiAsAuxiliary(_TuiCalendarYear)])],
      decls: 1,
      vars: 1,
      consts: [["automation-id", "tui-calendar-year__row", "class", "t-row", 4, "tuiRepeatTimes", "tuiRepeatTimesOf"], ["automation-id", "tui-calendar-year__row", 1, "t-row"], [4, "tuiRepeatTimes", "tuiRepeatTimesOf"], ["automation-id", "tui-calendar-year__cell", "class", "t-cell", 3, "t-cell_disabled", "t-cell_today", "tuiScrollIntoView", "click", "tuiHoveredChange", 4, "tuiLet"], ["automation-id", "tui-calendar-year__cell", 1, "t-cell", 3, "click", "tuiHoveredChange", "tuiScrollIntoView"]],
      template: function TuiCalendarYear_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiCalendarYear_div_0_Template, 2, 1, "div", 0);
        }
        if (rf & 2) {
          ɵɵproperty("tuiRepeatTimesOf", ctx.rows);
        }
      },
      dependencies: [TuiHovered, TuiLet, TuiRepeatTimes, TuiScrollIntoView],
      styles: [`.t-row[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;font:var(--tui-font-text-m)}.t-row[_ngcontent-%COMP%]:first-child{justify-content:flex-end}.t-row[_ngcontent-%COMP%]:last-child{justify-content:flex-start}.t-cell[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center;line-height:2rem;isolation:isolate;cursor:pointer;overflow:hidden;border:.125rem solid transparent;box-sizing:border-box;-webkit-mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem));mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem))}.t-cell[_ngcontent-%COMP%]:first-child{border-inline-start-color:transparent!important}.t-cell[_ngcontent-%COMP%]:last-child{border-inline-end-color:transparent!important}.t-cell[_ngcontent-%COMP%]:before, .t-cell[_ngcontent-%COMP%]:after{position:absolute;top:0;left:0;bottom:0;right:0;content:"";z-index:-1;border-radius:var(--tui-radius-m)}.t-cell[_ngcontent-%COMP%]:after{-webkit-mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat;mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat}.t-cell[data-range][_ngcontent-%COMP%]:before{background:var(--tui-background-neutral-1)}._picking[_nghost-%COMP%]   .t-cell[data-range][_ngcontent-%COMP%]:before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle][_ngcontent-%COMP%]{border-color:var(--tui-background-neutral-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=middle][_ngcontent-%COMP%]{border-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle][_ngcontent-%COMP%]:not(:first-child):before{border-top-left-radius:0;border-bottom-left-radius:0}.t-cell[data-range=middle][_ngcontent-%COMP%]:not(:last-child):before{border-top-right-radius:0;border-bottom-right-radius:0}.t-cell[data-range=start][_ngcontent-%COMP%]{border-inline-end-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=start][_ngcontent-%COMP%]{border-inline-end-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start][_ngcontent-%COMP%]:not(:last-child):before{right:-1rem}.t-cell[data-range=start][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1)}.t-cell[data-range=end][_ngcontent-%COMP%]{border-inline-start-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}._picking[_nghost-%COMP%]   .t-cell[data-range=end][_ngcontent-%COMP%]{border-inline-start-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=end][_ngcontent-%COMP%]:not(:first-child):before{left:-1rem}.t-cell[data-range=end][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1);transform:scaleX(-1)}.t-cell[data-range=active][_ngcontent-%COMP%]{color:var(--tui-text-primary-on-accent-1)}.t-cell[data-range=active][_ngcontent-%COMP%]:after{background:var(--tui-background-accent-1);-webkit-mask:none;mask:none}.t-cell_disabled[_ngcontent-%COMP%]{opacity:var(--tui-disabled-opacity);pointer-events:none}.t-cell_today[_ngcontent-%COMP%]{text-decoration:underline;text-underline-offset:.25rem}@media (hover: hover) and (pointer: fine){.t-cell[_ngcontent-%COMP%]:hover:not([data-range=start]):not([data-range=end]):before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start][_ngcontent-%COMP%]:hover:after, .t-cell[data-range=end][_ngcontent-%COMP%]:hover:after, .t-cell[data-range=active][_ngcontent-%COMP%]:hover:after{background:var(--tui-background-accent-1-hover)}}[_nghost-%COMP%]{display:block;padding-inline-end:1rem;inline-size:15.75rem;padding:0 1.125rem}.t-cell[_ngcontent-%COMP%]{flex:1;border-block-start-width:.5rem;border-block-end-width:.5rem}`]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCalendarYear, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-calendar-year",
      imports: [TuiHovered, TuiLet, TuiRepeatTimes, TuiScrollIntoView],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAsAuxiliary(TuiCalendarYear)],
      host: {
        "[class._picking]": "isRangePicking()"
      },
      template: '<div\n    *tuiRepeatTimes="let rowIndex of rows"\n    automation-id="tui-calendar-year__row"\n    class="t-row"\n>\n    <ng-container *tuiRepeatTimes="let colIndex of 4">\n        <div\n            *tuiLet="getItem(rowIndex, colIndex) as item"\n            automation-id="tui-calendar-year__cell"\n            class="t-cell"\n            [attr.data-range]="getItemRange(item)"\n            [class.t-cell_disabled]="isDisabled(item)"\n            [class.t-cell_today]="itemIsToday(item)"\n            [tuiScrollIntoView]="scrollItemIntoView(item)"\n            (click)="yearClick.emit(item)"\n            (tuiHoveredChange)="onItemHovered($event, item)"\n        >\n            {{ item }}\n        </div>\n    </ng-container>\n</div>\n',
      styles: [`.t-row{display:flex;justify-content:flex-start;font:var(--tui-font-text-m)}.t-row:first-child{justify-content:flex-end}.t-row:last-child{justify-content:flex-start}.t-cell{position:relative;display:flex;align-items:center;justify-content:center;line-height:2rem;isolation:isolate;cursor:pointer;overflow:hidden;border:.125rem solid transparent;box-sizing:border-box;-webkit-mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem));mask:linear-gradient(transparent calc(50% - 1rem),#000 calc(50% - 1rem),#000 calc(50% + 1rem),transparent calc(50% + 1rem))}.t-cell:first-child{border-inline-start-color:transparent!important}.t-cell:last-child{border-inline-end-color:transparent!important}.t-cell:before,.t-cell:after{position:absolute;top:0;left:0;bottom:0;right:0;content:"";z-index:-1;border-radius:var(--tui-radius-m)}.t-cell:after{-webkit-mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat;mask:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 32"><path d="M0.2856 0L0.6763 0C2.9265 0 4.9876 1.259 6.0147 3.2611L10.2442 11.5048C11.5301 14.0113 11.5683 16.9754 10.3472 19.5141L5.9766 28.6007C4.9772 30.6786 2.8754 32 0.5696 32H0.285645V0Z"></path></svg>') right / .75rem 100% no-repeat,linear-gradient(#000,#000) left / calc(100% - .7rem) 100% no-repeat}.t-cell[data-range]:before{background:var(--tui-background-neutral-1)}:host._picking .t-cell[data-range]:before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle]{border-color:var(--tui-background-neutral-1)}:host._picking .t-cell[data-range=middle]{border-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=middle]:not(:first-child):before{border-top-left-radius:0;border-bottom-left-radius:0}.t-cell[data-range=middle]:not(:last-child):before{border-top-right-radius:0;border-bottom-right-radius:0}.t-cell[data-range=start]{border-inline-end-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}:host._picking .t-cell[data-range=start]{border-inline-end-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start]:not(:last-child):before{right:-1rem}.t-cell[data-range=start]:after{background:var(--tui-background-accent-1)}.t-cell[data-range=end]{border-inline-start-color:var(--tui-background-neutral-1);color:var(--tui-text-primary-on-accent-1)}:host._picking .t-cell[data-range=end]{border-inline-start-color:var(--tui-background-neutral-1-hover)}.t-cell[data-range=end]:not(:first-child):before{left:-1rem}.t-cell[data-range=end]:after{background:var(--tui-background-accent-1);transform:scaleX(-1)}.t-cell[data-range=active]{color:var(--tui-text-primary-on-accent-1)}.t-cell[data-range=active]:after{background:var(--tui-background-accent-1);-webkit-mask:none;mask:none}.t-cell_disabled{opacity:var(--tui-disabled-opacity);pointer-events:none}.t-cell_today{text-decoration:underline;text-underline-offset:.25rem}@media (hover: hover) and (pointer: fine){.t-cell:hover:not([data-range=start]):not([data-range=end]):before{background:var(--tui-background-neutral-1-hover)}.t-cell[data-range=start]:hover:after,.t-cell[data-range=end]:hover:after,.t-cell[data-range=active]:hover:after{background:var(--tui-background-accent-1-hover)}}:host{display:block;padding-inline-end:1rem;inline-size:15.75rem;padding:0 1.125rem}.t-cell{flex:1;border-block-start-width:.5rem;border-block-end-width:.5rem}
`]
    }]
  }], null, {
    rangeMode: [{
      type: Input
    }],
    disabledItemHandler: [{
      type: Input
    }],
    yearClick: [{
      type: Output
    }],
    initialItemSetter: [{
      type: Input,
      args: [{
        alias: "initialItem",
        transform: (x) => x ?? CURRENT_YEAR
      }]
    }],
    minSetter: [{
      type: Input,
      args: [{
        alias: "min",
        transform: (x) => x ?? MIN_YEAR
      }]
    }],
    maxSetter: [{
      type: Input,
      args: [{
        alias: "max",
        transform: (x) => x ?? MAX_YEAR
      }]
    }],
    valueSetter: [{
      type: Input,
      args: ["value"]
    }]
  });
})();
var TuiCalendar = class _TuiCalendar {
  constructor() {
    this.cdr = inject(ChangeDetectorRef);
    this.day = null;
    this.view = "month";
    this.options = inject(TUI_CALENDAR_SHEET_OPTIONS);
    this.month = TuiMonth.currentLocal();
    this.disabledItemHandler = inject(TUI_ITEMS_HANDLERS).disabledItemHandler();
    this.min = TUI_FIRST_DAY;
    this.max = TUI_LAST_DAY;
    this.minViewedMonth = TUI_FIRST_DAY;
    this.maxViewedMonth = TUI_LAST_DAY;
    this.hoveredItem = null;
    this.showAdjacent = true;
    this.markerHandler = null;
    this.dayClick = new EventEmitter();
    this.monthChange = new EventEmitter();
    this.hoveredItemChange = new EventEmitter();
    this.valueChange = new Subject();
    this.disabledItemHandlerMapper = (disabledItemHandler, min, max) => (item) => item.dayBefore(min) || item.dayAfter(max) || disabledItemHandler(item);
  }
  set value(value) {
    this.cdr.markForCheck();
    this.day = value;
    if (this.showAdjacent && value instanceof TuiDay && value.daySameOrBefore(TUI_LAST_DISPLAYED_DAY)) {
      this.month = value;
    }
  }
  set initialView(view) {
    this.view = view;
  }
  get value() {
    return this.day;
  }
  onPaginationValueChange(month) {
    this.updateViewedMonth(month);
  }
  onDayClick(day) {
    this.dayClick.emit(day);
    this.valueChange.next(day);
  }
  onHoveredItemChange(day) {
    this.updateHoveredDay(day);
  }
  get computedMin() {
    return this.min ?? TUI_FIRST_DAY;
  }
  get computedMax() {
    return this.max ?? TUI_LAST_DAY;
  }
  get computedMinViewedMonth() {
    const min = this.computedMin;
    const minViewed = this.minViewedMonth ?? TUI_FIRST_DAY;
    return minViewed.monthSameOrAfter(min) ? minViewed : min;
  }
  get computedMaxViewedMonth() {
    const max = this.computedMax;
    const maxViewed = this.maxViewedMonth ?? TUI_LAST_DAY;
    return maxViewed.monthSameOrBefore(max) ? maxViewed : max;
  }
  get isInYearView() {
    return this.view === "year";
  }
  onPaginationYearClick() {
    this.view = "year";
  }
  onPickerYearClick(year) {
    this.view = "month";
    this.updateViewedMonth(new TuiMonth(year, this.month.month));
  }
  updateViewedMonth(month) {
    if (this.month.monthSame(month)) {
      return;
    }
    this.month = month;
    this.monthChange.emit(month);
  }
  updateHoveredDay(day) {
    if (tuiNullableSame(this.hoveredItem, day, (a, b) => a.daySame(b))) {
      return;
    }
    this.hoveredItem = day;
    this.hoveredItemChange.emit(day);
  }
  static {
    this.ɵfac = function TuiCalendar_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCalendar)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiCalendar,
      selectors: [["tui-calendar"]],
      hostBindings: function TuiCalendar_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("pointerdown.prevent.zoneless", function TuiCalendar_pointerdown_prevent_zoneless_HostBindingHandler() {
            return 0;
          });
        }
      },
      inputs: {
        month: "month",
        disabledItemHandler: "disabledItemHandler",
        min: "min",
        max: "max",
        minViewedMonth: "minViewedMonth",
        maxViewedMonth: "maxViewedMonth",
        hoveredItem: "hoveredItem",
        showAdjacent: "showAdjacent",
        markerHandler: "markerHandler",
        value: "value",
        initialView: "initialView"
      },
      outputs: {
        dayClick: "dayClick",
        monthChange: "monthChange",
        hoveredItemChange: "hoveredItemChange"
      },
      features: [ɵɵProvidersFeature([tuiAsAuxiliary(_TuiCalendar)])],
      decls: 3,
      vars: 2,
      consts: [["calendar", ""], ["automation-id", "tui-calendar__scrollbar", "class", "t-scrollbar", 4, "ngIf", "ngIfElse"], ["automation-id", "tui-calendar__scrollbar", 1, "t-scrollbar"], ["automation-id", "tui-calendar__year", 3, "yearClick", "initialItem", "max", "min", "rangeMode", "value"], ["automation-id", "tui-calendar__pagination", 1, "t-pagination", 3, "valueChange", "yearClick", "max", "min", "value"], ["automation-id", "tui-calendar__calendar", 3, "dayClick", "hoveredItemChange", "disabledItemHandler", "hoveredItem", "markerHandler", "month", "showAdjacent", "value"]],
      template: function TuiCalendar_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiCalendar_tui_scrollbar_0_Template, 2, 5, "tui-scrollbar", 1)(1, TuiCalendar_ng_template_1_Template, 3, 14, "ng-template", null, 0, ɵɵtemplateRefExtractor);
        }
        if (rf & 2) {
          const calendar_r4 = ɵɵreference(2);
          ɵɵproperty("ngIf", ctx.isInYearView)("ngIfElse", calendar_r4);
        }
      },
      dependencies: [NgIf, TuiCalendarSheet, TuiCalendarSpin, TuiCalendarYear, TuiMapperPipe, TuiScrollbar],
      styles: ["[_nghost-%COMP%]{display:block;min-block-size:20.25rem;inline-size:18rem;padding:1rem 1.125rem;box-sizing:border-box;flex-shrink:0}tui-dropdown-mobile[_nghost-%COMP%], tui-dropdown-mobile   [_nghost-%COMP%]{inline-size:100%}tui-calendar-year[_ngcontent-%COMP%]{padding:0}.t-scrollbar[_ngcontent-%COMP%]{block-size:18.25rem;inline-size:calc(100% + 1rem)}.t-pagination[_ngcontent-%COMP%]{margin-block-end:1rem}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCalendar, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-calendar",
      imports: [NgIf, TuiCalendarSheet, TuiCalendarSpin, TuiCalendarYear, TuiMapperPipe, TuiScrollbar],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAsAuxiliary(TuiCalendar)],
      host: {
        "(pointerdown.prevent.zoneless)": "0"
      },
      template: '<tui-scrollbar\n    *ngIf="isInYearView; else calendar"\n    automation-id="tui-calendar__scrollbar"\n    class="t-scrollbar"\n>\n    <tui-calendar-year\n        automation-id="tui-calendar__year"\n        [initialItem]="month.year"\n        [max]="computedMax.year"\n        [min]="computedMin.year"\n        [rangeMode]="options.rangeMode"\n        [value]="value"\n        (yearClick)="onPickerYearClick($event)"\n    />\n</tui-scrollbar>\n<ng-template #calendar>\n    <tui-calendar-spin\n        automation-id="tui-calendar__pagination"\n        class="t-pagination"\n        [max]="computedMaxViewedMonth"\n        [min]="computedMinViewedMonth"\n        [value]="month"\n        (valueChange)="onPaginationValueChange($event)"\n        (yearClick)="onPaginationYearClick()"\n    />\n    <tui-calendar-sheet\n        automation-id="tui-calendar__calendar"\n        [disabledItemHandler]="disabledItemHandler | tuiMapper: disabledItemHandlerMapper : computedMin : computedMax"\n        [hoveredItem]="hoveredItem"\n        [markerHandler]="markerHandler"\n        [month]="month"\n        [showAdjacent]="showAdjacent"\n        [value]="value"\n        (dayClick)="onDayClick($event)"\n        (hoveredItemChange)="onHoveredItemChange($event)"\n    />\n</ng-template>\n',
      styles: [":host{display:block;min-block-size:20.25rem;inline-size:18rem;padding:1rem 1.125rem;box-sizing:border-box;flex-shrink:0}:host-context(tui-dropdown-mobile){inline-size:100%}tui-calendar-year{padding:0}.t-scrollbar{block-size:18.25rem;inline-size:calc(100% + 1rem)}.t-pagination{margin-block-end:1rem}\n"]
    }]
  }], null, {
    month: [{
      type: Input
    }],
    disabledItemHandler: [{
      type: Input
    }],
    min: [{
      type: Input
    }],
    max: [{
      type: Input
    }],
    minViewedMonth: [{
      type: Input
    }],
    maxViewedMonth: [{
      type: Input
    }],
    hoveredItem: [{
      type: Input
    }],
    showAdjacent: [{
      type: Input
    }],
    markerHandler: [{
      type: Input
    }],
    dayClick: [{
      type: Output
    }],
    monthChange: [{
      type: Output
    }],
    hoveredItemChange: [{
      type: Output
    }],
    value: [{
      type: Input
    }],
    initialView: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-auto-focus.mjs
var AbstractTuiAutofocusHandler = class {
  constructor(el, options) {
    this.el = el;
    this.options = options;
  }
  get element() {
    const el = this.el.nativeElement.tagName.includes("-") ? this.el.nativeElement.querySelector(this.options.query) : this.el.nativeElement;
    return el || this.el.nativeElement;
  }
  get isTextFieldElement() {
    return this.element.matches(this.options.query);
  }
};
var TIMEOUT = 1e3;
var NG_ANIMATION_SELECTOR = ".ng-animating";
var TuiDefaultAutofocusHandler = class extends AbstractTuiAutofocusHandler {
  constructor(el, animationFrame$, zone, options) {
    super(el, options);
    this.animationFrame$ = animationFrame$;
    this.zone = zone;
  }
  setFocus() {
    if (this.isTextFieldElement) {
      race(timer(this.options.delay || TIMEOUT), this.animationFrame$.pipe(throttleTime(100, tuiZonefreeScheduler(this.zone)), map(() => this.element.closest(NG_ANIMATION_SELECTOR)), skipWhile(Boolean), take(1))).subscribe(() => this.element.focus({
        preventScroll: this.options.preventScroll
      }));
    } else {
      this.element.focus({
        preventScroll: true
      });
    }
  }
};
var TEXTFIELD_ATTRS = ["type", "inputMode", "autocomplete", "accept", "min", "max", "step", "pattern", "size", "maxlength"];
var TuiIosAutofocusHandler = class extends AbstractTuiAutofocusHandler {
  constructor(el, renderer, zone, win, options) {
    super(el, options);
    this.renderer = renderer;
    this.zone = zone;
    this.win = win;
  }
  setFocus() {
    if (this.isTextFieldElement) {
      this.zone.runOutsideAngular(() => this.iosWebkitAutofocus());
    } else {
      this.element.focus({
        preventScroll: true
      });
    }
  }
  iosWebkitAutofocus() {
    const fakeInput = this.makeFakeInput();
    const duration = this.getDurationTimeBeforeFocus();
    let fakeFocusTimeoutId = 0;
    let elementFocusTimeoutId = 0;
    const blurHandler = () => fakeInput.focus({
      preventScroll: true
    });
    const focusHandler = () => {
      clearTimeout(fakeFocusTimeoutId);
      fakeFocusTimeoutId = this.win.setTimeout(() => {
        clearTimeout(elementFocusTimeoutId);
        fakeInput.removeEventListener("blur", blurHandler);
        fakeInput.removeEventListener("focus", focusHandler);
        elementFocusTimeoutId = this.win.setTimeout(() => {
          this.element.focus({
            preventScroll: this.options.preventScroll
          });
          fakeInput.remove();
        }, duration);
      });
    };
    fakeInput.addEventListener("blur", blurHandler, {
      once: true
    });
    fakeInput.addEventListener("focus", focusHandler);
    if (this.insideDialog()) {
      this.win.document.body.appendChild(fakeInput);
    } else {
      this.element.parentElement?.appendChild(fakeInput);
    }
    fakeInput.focus({
      preventScroll: true
    });
  }
  /**
   * @note:
   * emulate textfield position in layout with cursor
   * before focus to real textfield element
   *
   * required note:
   * [fakeInput.readOnly = true] ~
   * don't use {readOnly: true} value, it's doesn't work for emulate autofill
   *
   * [fakeInput.style.opacity = 0] ~
   * don't use {opacity: 0}, sometimes it's doesn't work for emulate real input
   *
   * [fakeInput.style.fontSize = 16px] ~
   * disable possible auto zoom
   *
   * [fakeInput.style.top/left] ~
   * emulate position cursor before focus to real textfield element
   */
  makeFakeInput() {
    const fakeInput = this.renderer.createElement("input");
    const rect = this.element.getBoundingClientRect();
    this.patchFakeInputFromFocusableElement(fakeInput);
    fakeInput.style.height = tuiPx(rect.height);
    fakeInput.style.width = tuiPx(rect.width / 2);
    fakeInput.style.position = "fixed";
    fakeInput.style.zIndex = "-99999999";
    fakeInput.style.caretColor = "transparent";
    fakeInput.style.border = "none";
    fakeInput.style.outline = "none";
    fakeInput.style.color = "transparent";
    fakeInput.style.background = "transparent";
    fakeInput.style.cursor = "none";
    fakeInput.style.fontSize = tuiPx(16);
    fakeInput.style.top = tuiPx(rect.top);
    fakeInput.style.left = tuiPx(rect.left);
    return fakeInput;
  }
  getDurationTimeBeforeFocus() {
    return parseFloat(this.win.getComputedStyle(this.element).getPropertyValue("--tui-duration")) || 0;
  }
  /**
   * @note:
   * unfortunately, in older versions of iOS
   * there is a bug that the fake input cursor
   * will move along with the dialog animation
   * and then that dialog will be shaking
   */
  insideDialog() {
    return !!this.element.closest("tui-dialog");
  }
  /**
   * @note:
   * inherit basic attributes values from real input
   * for help iOS detect what do you want see on keyboard,
   * for example [inputMode=numeric, autocomplete=cc-number]
   */
  patchFakeInputFromFocusableElement(fakeInput) {
    TEXTFIELD_ATTRS.forEach((attr) => {
      const value = this.element.getAttribute(attr);
      if (tuiIsPresent(value)) {
        fakeInput.setAttribute(attr, value);
      }
    });
  }
};
var [TUI_AUTOFOCUS_OPTIONS, tuiAutoFocusOptionsProvider] = tuiCreateOptions({
  delay: NaN,
  query: "input, textarea, select, [contenteditable]",
  preventScroll: false
});
var TUI_AUTOFOCUS_HANDLER = new InjectionToken(ngDevMode ? "TUI_AUTOFOCUS_HANDLER" : "");
var TUI_AUTOFOCUS_PROVIDERS = [{
  provide: TUI_AUTOFOCUS_HANDLER,
  deps: [ElementRef, WA_ANIMATION_FRAME, Renderer2, NgZone, WA_WINDOW, TUI_IS_IOS, TUI_AUTOFOCUS_OPTIONS],
  // eslint-disable-next-line @typescript-eslint/max-params,max-params
  useFactory: (el, animationFrame$, renderer, zone, win, isIos2, options) => isIos2 ? new TuiIosAutofocusHandler(el, renderer, zone, win, options) : new TuiDefaultAutofocusHandler(el, animationFrame$, zone, options)
}];
var TuiAutoFocus = class _TuiAutoFocus {
  constructor() {
    this.handler = inject(TUI_AUTOFOCUS_HANDLER);
    this.options = inject(TUI_AUTOFOCUS_OPTIONS);
    this.destroyRef = inject(DestroyRef);
  }
  ngAfterViewInit() {
    if (this.autoFocus) {
      this.focus();
    }
  }
  focus() {
    if (Number.isNaN(this.options.delay)) {
      void Promise.resolve().then(() => this.handler.setFocus());
    } else {
      timer(this.options.delay).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.handler.setFocus());
    }
  }
  static {
    this.ɵfac = function TuiAutoFocus_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAutoFocus)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiAutoFocus,
      selectors: [["", "tuiAutoFocus", ""]],
      inputs: {
        autoFocus: [2, "tuiAutoFocus", "autoFocus", coerceBooleanProperty]
      },
      features: [ɵɵProvidersFeature(TUI_AUTOFOCUS_PROVIDERS)]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAutoFocus, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiAutoFocus]",
      providers: TUI_AUTOFOCUS_PROVIDERS
    }]
  }], null, {
    autoFocus: [{
      type: Input,
      args: [{
        alias: "tuiAutoFocus",
        transform: coerceBooleanProperty
      }]
    }]
  });
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-focus-trap.mjs
var TuiFocusTrap = class _TuiFocusTrap {
  constructor() {
    this.doc = inject(DOCUMENT);
    this.el = tuiInjectElement();
    this.activeElement = null;
    this.initialized = false;
    Promise.resolve().then(() => {
      this.initialized = true;
      this.activeElement = tuiGetFocused(this.doc);
      this.el.focus();
    });
  }
  ngOnDestroy() {
    this.initialized = false;
    if (tuiIsHTMLElement(this.activeElement)) {
      this.activeElement.focus();
    }
  }
  onFocusIn(node) {
    const {
      firstElementChild
    } = this.el;
    if (!tuiContainsOrAfter(this.el, node) && firstElementChild) {
      tuiGetClosestFocusable({
        initial: firstElementChild,
        root: this.el
      })?.focus();
    }
  }
  static {
    this.ɵfac = function TuiFocusTrap_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFocusTrap)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiFocusTrap,
      selectors: [["", "tuiFocusTrap", ""]],
      hostAttrs: ["tabIndex", "0"],
      hostBindings: function TuiFocusTrap_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("focusin.zoneless", function TuiFocusTrap_focusin_zoneless_HostBindingHandler($event) {
            return ctx.initialized && ctx.onFocusIn($event.target);
          }, ɵɵresolveWindow)("pointerdown", function TuiFocusTrap_pointerdown_HostBindingHandler($event) {
            return $event.currentTarget == null ? null : $event.currentTarget.removeAttribute("tabindex");
          });
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFocusTrap, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiFocusTrap]",
      host: {
        tabIndex: "0",
        "(window:focusin.zoneless)": "initialized && onFocusIn($event.target)",
        // https://bugs.webkit.org/show_bug.cgi?id=303022
        "(pointerdown)": '$event.currentTarget?.removeAttribute("tabindex")'
      }
    }]
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-dialog.mjs
function TuiDialogComponent_header_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r1, " ");
  }
}
function TuiDialogComponent_header_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "header", 6);
    ɵɵtemplate(1, TuiDialogComponent_header_0_ng_container_1_Template, 2, 1, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r1.header)("polymorpheusOutletContext", ctx_r1.context);
  }
}
function TuiDialogComponent_ng_container_4_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 9)(1, "button", 10);
    ɵɵlistener("click", function TuiDialogComponent_ng_container_4_div_2_Template_button_click_1_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.context.$implicit.complete());
    });
    ɵɵtext(2);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵadvance(2);
    ɵɵtextInterpolate1(" ", (ctx_r1.context.data == null ? null : ctx_r1.context.data.button) || "OK", " ");
  }
}
function TuiDialogComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵelement(1, "div", 7);
    ɵɵtemplate(2, TuiDialogComponent_ng_container_4_div_2_Template, 3, 1, "div", 8);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r4 = ctx.polymorpheusOutlet;
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("innerHTML", text_r4, ɵɵsanitizeHtml);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.context.closeable || ctx_r1.context.dismissible);
  }
}
function TuiDialogComponent_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 11);
    ɵɵlistener("click", function TuiDialogComponent_button_6_Template_button_click_0_listener() {
      ɵɵrestoreView(_r5);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.close$.next());
    })("mousedown.prevent.zoneless", function TuiDialogComponent_button_6_Template_button_mousedown_prevent_zoneless_0_listener() {
      return 0;
    });
    ɵɵtext(1);
    ɵɵpipe(2, "async");
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵstyleProp("border-radius", 100, "%");
    ɵɵproperty("appearance", ctx_r1.isMobile() ? "icon" : "neutral")("iconStart", ctx_r1.icons.close)("size", ctx_r1.isMobile() ? "xs" : "s");
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ɵɵpipeBind1(2, 6, ctx_r1.closeWord$), "\n");
  }
}
function TuiDialogs_section_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TuiDialogs_section_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "section", 2);
    ɵɵtemplate(1, TuiDialogs_section_1_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelement(2, "tui-scroll-controls", 4);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    ɵɵattribute("aria-labelledby", item_r1.id);
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", item_r1.component)("polymorpheusOutletContext", item_r1);
  }
}
var TUI_DIALOGS = new InjectionToken(ngDevMode ? "TUI_DIALOGS" : "", {
  factory: () => new BehaviorSubject([])
});
var TUI_DIALOG_DEFAULT_OPTIONS = {
  appearance: "",
  size: "m",
  required: false,
  closeable: true,
  dismissible: true,
  label: "",
  header: "",
  data: void 0
};
var TUI_DIALOGS_CLOSE = new InjectionToken(ngDevMode ? "TUI_DIALOGS_CLOSE" : "", {
  factory: () => EMPTY
});
var TUI_DIALOG_OPTIONS = new InjectionToken(ngDevMode ? "TUI_DIALOG_OPTIONS" : "", {
  factory: () => TUI_DIALOG_DEFAULT_OPTIONS
});
function tuiDialogOptionsProvider(options) {
  return tuiProvideOptions(TUI_DIALOG_OPTIONS, options, TUI_DIALOG_DEFAULT_OPTIONS);
}
var SCROLLBAR_PLACEHOLDER = 17;
var TuiDialogCloseService = class _TuiDialogCloseService extends Observable {
  constructor() {
    super((subscriber) => merge(this.esc$, this.mousedown$, tuiCloseWatcher().pipe(tuiZonefull())).subscribe(subscriber));
    this.win = inject(WA_WINDOW);
    this.doc = inject(DOCUMENT);
    this.el = tuiInjectElement();
    this.esc$ = tuiTypedFromEvent(this.doc, "keydown").pipe(filter((event) => {
      const target = tuiGetActualTarget(event);
      return (
        // @ts-ignore
        typeof CloseWatcher === "undefined" && event.key?.toLowerCase() === "escape" && !event.defaultPrevented && (this.el.contains(target) || this.isOutside(target))
      );
    }));
    this.mousedown$ = tuiTypedFromEvent(this.doc, "mousedown").pipe(filter((event) => tuiGetViewportWidth(this.win) - event.clientX > SCROLLBAR_PLACEHOLDER && this.isOutside(tuiGetActualTarget(event))), switchMap(() => tuiTypedFromEvent(this.doc, "mouseup").pipe(take(1), map(tuiGetActualTarget), filter((target) => this.isOutside(target)))));
  }
  isOutside(target) {
    return tuiIsElement(target) && (!tuiContainsOrAfter(this.el, target) || // TODO: Drop 'new' attribute in v5
    target === this.el && !this.el.hasAttribute("new"));
  }
  static {
    this.ɵfac = function TuiDialogCloseService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDialogCloseService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiDialogCloseService,
      factory: _TuiDialogCloseService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDialogCloseService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var REQUIRED_ERROR = new Error("Required dialog was dismissed");
function toObservable(valueOrStream) {
  return isObservable(valueOrStream) ? valueOrStream : of(valueOrStream);
}
var TuiDialogComponent = class _TuiDialogComponent {
  constructor() {
    this.close$ = new Subject();
    this.context = injectContext();
    this.closeWord$ = inject(TUI_CLOSE_WORD);
    this.icons = inject(TUI_COMMON_ICONS);
    this.from = computed(() => this.size === "fullscreen" || this.size === "page" || this.isMobile() ? "translateY(100vh)" : "translateY(2.5rem)");
    this.isMobile = toSignal(inject(TuiBreakpointService).pipe(map((breakpoint) => breakpoint === "mobile")));
    merge(this.close$.pipe(switchMap(() => toObservable(this.context.closeable))), inject(TuiDialogCloseService).pipe(exhaustMap(() => toObservable(this.context.dismissible).pipe(take(1)))), inject(TUI_DIALOGS_CLOSE).pipe(map(TUI_TRUE_HANDLER))).pipe(filter(Boolean), takeUntilDestroyed()).subscribe(() => {
      this.close();
    });
  }
  get size() {
    return this.context.size;
  }
  get header() {
    return this.context.header;
  }
  close() {
    if (this.context.required) {
      this.context.$implicit.error(REQUIRED_ERROR);
    } else {
      this.context.$implicit.complete();
    }
  }
  static {
    this.ɵfac = function TuiDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDialogComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiDialogComponent,
      selectors: [["tui-dialog"]],
      hostVars: 6,
      hostBindings: function TuiDialogComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-appearance", ctx.context.appearance)("data-size", ctx.size);
          ɵɵstyleProp("--tui-from", ctx.from());
          ɵɵclassProp("_centered", ctx.header);
        }
      },
      features: [ɵɵProvidersFeature([TuiDialogCloseService]), ɵɵHostDirectivesFeature([TuiAnimated])],
      decls: 7,
      vars: 8,
      consts: [["class", "t-header", 4, "ngIf"], [1, "t-content"], [1, "t-heading", 3, "id", "textContent"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-filler"], ["automation-id", "tui-dialog__close", "tuiIconButton", "", "type", "button", "class", "t-close", 3, "appearance", "iconStart", "size", "border-radius", "click", "mousedown.prevent.zoneless", 4, "ngIf"], [1, "t-header"], [3, "innerHTML"], ["class", "t-buttons", 4, "ngIf"], [1, "t-buttons"], ["size", "m", "tuiAutoFocus", "", "tuiButton", "", "type", "button", 3, "click"], ["automation-id", "tui-dialog__close", "tuiIconButton", "", "type", "button", 1, "t-close", 3, "click", "mousedown.prevent.zoneless", "appearance", "iconStart", "size"]],
      template: function TuiDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiDialogComponent_header_0_Template, 2, 2, "header", 0);
          ɵɵelementStart(1, "div", 1);
          ɵɵelement(2, "h2", 2);
          ɵɵelementStart(3, "section");
          ɵɵtemplate(4, TuiDialogComponent_ng_container_4_Template, 3, 2, "ng-container", 3);
          ɵɵelementEnd()();
          ɵɵelement(5, "div", 4);
          ɵɵtemplate(6, TuiDialogComponent_button_6_Template, 3, 8, "button", 5);
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", ctx.header);
          ɵɵadvance(2);
          ɵɵclassProp("t-heading_closable", ctx.context.closeable && !ctx.header);
          ɵɵproperty("id", ctx.context.id)("textContent", ctx.context.label);
          ɵɵadvance(2);
          ɵɵproperty("polymorpheusOutlet", ctx.context.content)("polymorpheusOutletContext", ctx.context);
          ɵɵadvance(2);
          ɵɵproperty("ngIf", ctx.context.closeable);
        }
      },
      dependencies: [AsyncPipe, NgIf, PolymorpheusOutlet, TuiAutoFocus, TuiButton],
      styles: ['[_nghost-%COMP%]{position:relative;display:flex;font:var(--tui-font-text-m);flex-direction:column;box-sizing:border-box;margin:auto;border-radius:1.5rem;border:2.5rem solid transparent}.tui-enter[_nghost-%COMP%], .tui-leave[_nghost-%COMP%]{animation-name:tuiFade,tuiSlide}[_nghost-%COMP%]:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;content:"";border-radius:inherit;pointer-events:none;box-shadow:var(--tui-shadow-popup)}[data-size=auto][_nghost-%COMP%]{inline-size:auto}[data-size=s][_nghost-%COMP%]{inline-size:30rem}[data-size=s][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%]{padding:1.5rem}[data-size=s][_nghost-%COMP%]   .t-heading[_ngcontent-%COMP%]{font:var(--tui-font-heading-5)}[data-size=m][_nghost-%COMP%]{inline-size:42.5rem}[data-size=l][_nghost-%COMP%]{inline-size:55rem}[data-size=fullscreen][_nghost-%COMP%], [data-size=page][_nghost-%COMP%]{min-inline-size:100vw;min-block-size:100%;border-radius:0;border:none;background:var(--tui-background-elevation-1);box-shadow:0 4rem var(--tui-background-elevation-1)}[data-size=fullscreen][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%], [data-size=page][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%]{padding:3rem calc(50vw - 22.5rem)}[data-size=fullscreen][_nghost-%COMP%]   .t-heading[_ngcontent-%COMP%], [data-size=page][_nghost-%COMP%]   .t-heading[_ngcontent-%COMP%]{font:var(--tui-font-heading-3)}._centered[_nghost-%COMP%]{text-align:center}[_nghost-%COMP%]   tui-root._mobile[data-size][_nghost-%COMP%], tui-root._mobile   [data-size][_nghost-%COMP%]{min-inline-size:100%;inline-size:100%;max-inline-size:100%;border-radius:0;border:none;margin:auto 0 0;background:var(--tui-background-elevation-1);padding-block-end:env(safe-area-inset-bottom)}[_nghost-%COMP%]   tui-root._mobile[data-size][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%], tui-root._mobile   [data-size][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%]{padding:1rem}[_nghost-%COMP%]   tui-root._mobile[data-size][_nghost-%COMP%]   .t-heading[_ngcontent-%COMP%], tui-root._mobile   [data-size][_nghost-%COMP%]   .t-heading[_ngcontent-%COMP%]{font:var(--tui-font-heading-5)}[_nghost-%COMP%]   tui-root._mobile[data-size=fullscreen][_nghost-%COMP%], tui-root._mobile   [data-size=fullscreen][_nghost-%COMP%], [_nghost-%COMP%]   tui-root._mobile[data-size=page][_nghost-%COMP%], tui-root._mobile   [data-size=page][_nghost-%COMP%]{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}[_nghost-%COMP%]   tui-root._mobile[data-size=fullscreen][_nghost-%COMP%]   .t-close[_ngcontent-%COMP%], tui-root._mobile   [data-size=fullscreen][_nghost-%COMP%]   .t-close[_ngcontent-%COMP%], [_nghost-%COMP%]   tui-root._mobile[data-size=page][_nghost-%COMP%]   .t-close[_ngcontent-%COMP%], tui-root._mobile   [data-size=page][_nghost-%COMP%]   .t-close[_ngcontent-%COMP%]{top:max(1rem,env(safe-area-inset-top))}[data-size=page][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%], tui-root._mobile   [data-size=page][_nghost-%COMP%]   .t-content[_ngcontent-%COMP%]{padding:0}.t-heading[_ngcontent-%COMP%]{margin:0 0 .5rem;overflow-wrap:break-word;font:var(--tui-font-heading-4)}.t-heading_closable[_ngcontent-%COMP%]{padding-inline-end:2rem}.t-heading[_ngcontent-%COMP%]:empty{display:none}.t-header[_ngcontent-%COMP%]{display:flex;border-top-left-radius:inherit;border-top-right-radius:inherit;overflow:hidden}[data-size=fullscreen][_nghost-%COMP%]   tui-root._mobile[_nghost-%COMP%]   .t-header[_ngcontent-%COMP%], tui-root._mobile   [_nghost-%COMP%]   .t-header[_ngcontent-%COMP%]{flex:1}.t-content[_ngcontent-%COMP%]{border-radius:inherit;padding:1.75rem;background:var(--tui-background-elevation-1)}.t-content[_ngcontent-%COMP%]:not(:first-child){border-top-left-radius:0;border-top-right-radius:0}.t-content[_ngcontent-%COMP%] > section[_ngcontent-%COMP%]{border-radius:inherit}.t-filler[_ngcontent-%COMP%]{flex-grow:1}.t-close[_ngcontent-%COMP%]{transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:absolute;top:1rem;right:1rem}@supports (inset-inline-end: 0){.t-close[_ngcontent-%COMP%]{right:unset;inset-inline-end:1rem}}.t-buttons[_ngcontent-%COMP%]{margin-block-start:1.25rem;text-align:end}'],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDialogComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-dialog",
      imports: [AsyncPipe, NgIf, PolymorpheusOutlet, TuiAutoFocus, TuiButton],
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [TuiDialogCloseService],
      hostDirectives: [TuiAnimated],
      host: {
        "[attr.data-appearance]": "context.appearance",
        "[attr.data-size]": "size",
        "[class._centered]": "header",
        "[style.--tui-from]": "from()"
      },
      template: `<header
    *ngIf="header"
    class="t-header"
>
    <ng-container *polymorpheusOutlet="header as text; context: context">
        {{ text }}
    </ng-container>
</header>
<div class="t-content">
    <h2
        class="t-heading"
        [class.t-heading_closable]="context.closeable && !header"
        [id]="context.id"
        [textContent]="context.label"
    ></h2>
    <section>
        <ng-container *polymorpheusOutlet="context.content as text; context: context">
            <div [innerHTML]="text"></div>
            <div
                *ngIf="context.closeable || context.dismissible"
                class="t-buttons"
            >
                <button
                    size="m"
                    tuiAutoFocus
                    tuiButton
                    type="button"
                    (click)="context.$implicit.complete()"
                >
                    {{ context.data?.button || 'OK' }}
                </button>
            </div>
        </ng-container>
    </section>
</div>
<div class="t-filler"></div>

<!-- Close button is insensitive to \`context.closeable === Observable<false>\` by design -->
<button
    *ngIf="context.closeable"
    automation-id="tui-dialog__close"
    tuiIconButton
    type="button"
    class="t-close"
    [appearance]="isMobile() ? 'icon' : 'neutral'"
    [iconStart]="icons.close"
    [size]="isMobile() ? 'xs' : 's'"
    [style.border-radius.%]="100"
    (click)="close$.next()"
    (mousedown.prevent.zoneless)="(0)"
>
    {{ closeWord$ | async }}
</button>
`,
      styles: [':host{position:relative;display:flex;font:var(--tui-font-text-m);flex-direction:column;box-sizing:border-box;margin:auto;border-radius:1.5rem;border:2.5rem solid transparent}:host.tui-enter,:host.tui-leave{animation-name:tuiFade,tuiSlide}:host:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;content:"";border-radius:inherit;pointer-events:none;box-shadow:var(--tui-shadow-popup)}:host[data-size=auto]{inline-size:auto}:host[data-size=s]{inline-size:30rem}:host[data-size=s] .t-content{padding:1.5rem}:host[data-size=s] .t-heading{font:var(--tui-font-heading-5)}:host[data-size=m]{inline-size:42.5rem}:host[data-size=l]{inline-size:55rem}:host[data-size=fullscreen],:host[data-size=page]{min-inline-size:100vw;min-block-size:100%;border-radius:0;border:none;background:var(--tui-background-elevation-1);box-shadow:0 4rem var(--tui-background-elevation-1)}:host[data-size=fullscreen] .t-content,:host[data-size=page] .t-content{padding:3rem calc(50vw - 22.5rem)}:host[data-size=fullscreen] .t-heading,:host[data-size=page] .t-heading{font:var(--tui-font-heading-3)}:host._centered{text-align:center}:host :host-context(tui-root._mobile)[data-size]{min-inline-size:100%;inline-size:100%;max-inline-size:100%;border-radius:0;border:none;margin:auto 0 0;background:var(--tui-background-elevation-1);padding-block-end:env(safe-area-inset-bottom)}:host :host-context(tui-root._mobile)[data-size] .t-content{padding:1rem}:host :host-context(tui-root._mobile)[data-size] .t-heading{font:var(--tui-font-heading-5)}:host :host-context(tui-root._mobile)[data-size=fullscreen],:host :host-context(tui-root._mobile)[data-size=page]{padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}:host :host-context(tui-root._mobile)[data-size=fullscreen] .t-close,:host :host-context(tui-root._mobile)[data-size=page] .t-close{top:max(1rem,env(safe-area-inset-top))}:host[data-size=page] .t-content,:host-context(tui-root._mobile) :host[data-size=page] .t-content{padding:0}.t-heading{margin:0 0 .5rem;overflow-wrap:break-word;font:var(--tui-font-heading-4)}.t-heading_closable{padding-inline-end:2rem}.t-heading:empty{display:none}.t-header{display:flex;border-top-left-radius:inherit;border-top-right-radius:inherit;overflow:hidden}:host[data-size=fullscreen] :host-context(tui-root._mobile) .t-header{flex:1}.t-content{border-radius:inherit;padding:1.75rem;background:var(--tui-background-elevation-1)}.t-content:not(:first-child){border-top-left-radius:0;border-top-right-radius:0}.t-content>section{border-radius:inherit}.t-filler{flex-grow:1}.t-close{transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;position:absolute;top:1rem;right:1rem}@supports (inset-inline-end: 0){.t-close{right:unset;inset-inline-end:1rem}}.t-buttons{margin-block-start:1.25rem;text-align:end}\n']
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiDialogService = class _TuiDialogService extends TuiPopoverService {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDialogService_BaseFactory;
      return function TuiDialogService_Factory(__ngFactoryType__) {
        return (ɵTuiDialogService_BaseFactory || (ɵTuiDialogService_BaseFactory = ɵɵgetInheritedFactory(_TuiDialogService)))(__ngFactoryType__ || _TuiDialogService);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiDialogService,
      factory: () => (() => new _TuiDialogService(TUI_DIALOGS, TuiDialogComponent, inject(TUI_DIALOG_OPTIONS)))(),
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDialogService, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => new TuiDialogService(TUI_DIALOGS, TuiDialogComponent, inject(TUI_DIALOG_OPTIONS))
    }]
  }], null, null);
})();
var TuiDialog = class _TuiDialog extends TuiPopoverDirective {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDialog_BaseFactory;
      return function TuiDialog_Factory(__ngFactoryType__) {
        return (ɵTuiDialog_BaseFactory || (ɵTuiDialog_BaseFactory = ɵɵgetInheritedFactory(_TuiDialog)))(__ngFactoryType__ || _TuiDialog);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDialog,
      selectors: [["ng-template", "tuiDialog", ""]],
      inputs: {
        options: [0, "tuiDialogOptions", "options"],
        open: [0, "tuiDialog", "open"]
      },
      outputs: {
        openChange: "tuiDialogChange"
      },
      features: [ɵɵProvidersFeature([tuiAsPopover(TuiDialogService)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDialog, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiDialog]",
      inputs: ["options: tuiDialogOptions", "open: tuiDialog"],
      outputs: ["openChange: tuiDialogChange"],
      providers: [tuiAsPopover(TuiDialogService)]
    }]
  }], null, null);
})();
function tuiDialog(component, _a = {}) {
  var _b = _a, {
    injector
  } = _b, options = __objRest(_b, [
    "injector"
  ]);
  if (!injector) {
    assertInInjectionContext(tuiDialog);
    injector = inject(INJECTOR$1);
  }
  const dialogService = injector.get(TuiDialogService);
  return (data) => dialogService.open(new PolymorpheusComponent(component, injector), __spreadProps(__spreadValues({}, options), {
    data
  }));
}
var TuiActiveZoneAdapter = class _TuiActiveZoneAdapter {
  constructor() {
    this.current = inject(TuiActiveZone);
    this.parent = findActive(inject(TuiActiveZone, {
      skipSelf: true
    }), tuiGetFocused(inject(DOCUMENT)));
  }
  ngOnInit() {
    this.current.tuiActiveZoneParentSetter = this.parent;
  }
  ngOnDestroy() {
    this.current.tuiActiveZoneParentSetter = null;
  }
  static {
    this.ɵfac = function TuiActiveZoneAdapter_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiActiveZoneAdapter)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiActiveZoneAdapter,
      selectors: [["", "tuiActiveZoneAdapter", ""]],
      features: [ɵɵHostDirectivesFeature([TuiActiveZone])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiActiveZoneAdapter, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiActiveZoneAdapter]",
      hostDirectives: [TuiActiveZone]
    }]
  }], null, null);
})();
function findActive(zone, element) {
  if (!element || !zone.contains(element)) {
    return null;
  }
  const active = zone.children.find((child) => child.contains(element));
  return active ? findActive(active, element) : zone;
}
var TuiDialogs = class _TuiDialogs {
  constructor() {
    this.dialogs = toSignal(inject(TUI_DIALOGS), {
      initialValue: []
    });
  }
  static {
    this.ɵfac = function TuiDialogs_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDialogs)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiDialogs,
      selectors: [["tui-dialogs"]],
      decls: 2,
      vars: 3,
      consts: [[1, "t-overlay"], ["aria-modal", "true", "role", "dialog", "tuiActiveZoneAdapter", "", "tuiAnimatedParent", "", "tuiFocusTrap", "", "tuiScrollRef", "", "class", "t-dialog", 4, "ngFor", "ngForOf"], ["aria-modal", "true", "role", "dialog", "tuiActiveZoneAdapter", "", "tuiAnimatedParent", "", "tuiFocusTrap", "", "tuiScrollRef", "", 1, "t-dialog"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-scrollbars"]],
      template: function TuiDialogs_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelement(0, "div", 0);
          ɵɵtemplate(1, TuiDialogs_section_1_Template, 3, 3, "section", 1);
        }
        if (rf & 2) {
          ɵɵclassProp("t-overlay_visible", ctx.dialogs().length);
          ɵɵadvance();
          ɵɵproperty("ngForOf", ctx.dialogs());
        }
      },
      dependencies: [NgForOf, PolymorpheusOutlet, TuiActiveZoneAdapter, TuiAnimatedParent, TuiFocusTrap, TuiScrollControls, TuiScrollRef],
      styles: ['[_nghost-%COMP%]{position:fixed;top:0;left:0;inline-size:100%;block-size:100%;scrollbar-width:none;-ms-overflow-style:none;pointer-events:none;overflow:hidden;overscroll-behavior:none;overflow-wrap:break-word;margin-block-start:var(--t-root-top)}[_nghost-%COMP%]::-webkit-scrollbar, [_nghost-%COMP%]::-webkit-scrollbar-thumb{display:none}[_nghost-%COMP%]:has(section){pointer-events:auto;overflow:auto}[_nghost-%COMP%]:has(section:only-of-type     tui-dialog[new][data-appearance~=fullscreen])>.t-overlay, [_nghost-%COMP%]:has(section:only-of-type     tui-notification-middle)>.t-overlay{opacity:0}[_nghost-%COMP%]:before{content:"";display:block;block-size:200%}.t-overlay[_ngcontent-%COMP%], .t-dialog[_ngcontent-%COMP%]{transition-property:filter;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;scrollbar-width:none;-ms-overflow-style:none;position:fixed;top:0;left:0;bottom:0;right:0;display:flex;block-size:100%;align-items:flex-start;outline:none;overflow:auto}.t-overlay[_ngcontent-%COMP%]::-webkit-scrollbar, .t-dialog[_ngcontent-%COMP%]::-webkit-scrollbar, .t-overlay[_ngcontent-%COMP%]::-webkit-scrollbar-thumb, .t-dialog[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{display:none}.t-dialog[_ngcontent-%COMP%]{position:sticky;overscroll-behavior:none;filter:brightness(.25)}.t-dialog[_ngcontent-%COMP%]:has(tui-dialog[new]){display:grid;place-items:center}.t-dialog[_ngcontent-%COMP%]    >.tui-enter+.t-scrollbars .t-bar_vertical, .t-dialog[_ngcontent-%COMP%]    >.tui-leave+.t-scrollbars .t-bar_vertical{display:none}.t-overlay[_ngcontent-%COMP%]{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;background:var(--tui-service-backdrop);-webkit-backdrop-filter:var(--tui-backdrop, none);backdrop-filter:var(--tui-backdrop, none);opacity:0;transition-timing-function:ease-in}.t-overlay_visible[_ngcontent-%COMP%]{opacity:1;transition-timing-function:ease-out}.t-dialog[_ngcontent-%COMP%]:last-child{pointer-events:auto;filter:none}tui-root:has(tui-dropdown-mobile._sheet)[_nghost-%COMP%]   .t-dialog[_ngcontent-%COMP%]:last-child, tui-root:has(tui-dropdown-mobile._sheet)   [_nghost-%COMP%]   .t-dialog[_ngcontent-%COMP%]:last-child{filter:brightness(.5)}.t-scrollbars[_ngcontent-%COMP%]{position:fixed;top:0;left:0;bottom:0;right:0;margin:0;color:#747474}.t-scrollbars[_ngcontent-%COMP%]     .t-bar_horizontal, .t-scrollbars[_ngcontent-%COMP%]     .t-bar_vertical .t-thumb[style*="height: 100%"]{display:none}'],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDialogs, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-dialogs",
      imports: [NgForOf, PolymorpheusOutlet, TuiActiveZoneAdapter, TuiAnimatedParent, TuiFocusTrap, TuiScrollControls, TuiScrollRef],
      changeDetection: ChangeDetectionStrategy.Default,
      template: '<div\n    class="t-overlay"\n    [class.t-overlay_visible]="dialogs().length"\n></div>\n<!--TODO: Rename to <article> in v5-->\n<section\n    *ngFor="let item of dialogs()"\n    aria-modal="true"\n    role="dialog"\n    tuiActiveZoneAdapter\n    tuiAnimatedParent\n    tuiFocusTrap\n    tuiScrollRef\n    class="t-dialog"\n    [attr.aria-labelledby]="item.id"\n>\n    <ng-container *polymorpheusOutlet="item.component; context: item" />\n    <tui-scroll-controls class="t-scrollbars" />\n</section>\n',
      styles: [':host{position:fixed;top:0;left:0;inline-size:100%;block-size:100%;scrollbar-width:none;-ms-overflow-style:none;pointer-events:none;overflow:hidden;overscroll-behavior:none;overflow-wrap:break-word;margin-block-start:var(--t-root-top)}:host::-webkit-scrollbar,:host::-webkit-scrollbar-thumb{display:none}:host:has(section){pointer-events:auto;overflow:auto}:host:has(section:only-of-type ::ng-deep tui-dialog[new][data-appearance~=fullscreen])>.t-overlay,:host:has(section:only-of-type ::ng-deep tui-notification-middle)>.t-overlay{opacity:0}:host:before{content:"";display:block;block-size:200%}.t-overlay,.t-dialog{transition-property:filter;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;scrollbar-width:none;-ms-overflow-style:none;position:fixed;top:0;left:0;bottom:0;right:0;display:flex;block-size:100%;align-items:flex-start;outline:none;overflow:auto}.t-overlay::-webkit-scrollbar,.t-dialog::-webkit-scrollbar,.t-overlay::-webkit-scrollbar-thumb,.t-dialog::-webkit-scrollbar-thumb{display:none}.t-dialog{position:sticky;overscroll-behavior:none;filter:brightness(.25)}.t-dialog:has(tui-dialog[new]){display:grid;place-items:center}.t-dialog ::ng-deep>.tui-enter+.t-scrollbars .t-bar_vertical,.t-dialog ::ng-deep>.tui-leave+.t-scrollbars .t-bar_vertical{display:none}.t-overlay{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;background:var(--tui-service-backdrop);-webkit-backdrop-filter:var(--tui-backdrop, none);backdrop-filter:var(--tui-backdrop, none);opacity:0;transition-timing-function:ease-in}.t-overlay_visible{opacity:1;transition-timing-function:ease-out}.t-dialog:last-child{pointer-events:auto;filter:none}:host-context(tui-root:has(tui-dropdown-mobile._sheet)) .t-dialog:last-child{filter:brightness(.5)}.t-scrollbars{position:fixed;top:0;left:0;bottom:0;right:0;margin:0;color:#747474}.t-scrollbars ::ng-deep .t-bar_horizontal,.t-scrollbars ::ng-deep .t-bar_vertical .t-thumb[style*="height: 100%"]{display:none}\n']
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-error.mjs
var _c04 = () => ({});
function TuiError_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r1, " ");
  }
}
function TuiError_div_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, TuiError_div_0_ng_container_1_Template, 2, 1, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r1.error.message || ctx_r1.default())("polymorpheusOutletContext", ctx_r1.error.context || ɵɵpureFunction0(2, _c04));
  }
}
var TuiError = class _TuiError {
  constructor() {
    this.options = tuiToAnimationOptions(inject(TUI_ANIMATIONS_SPEED));
    this.error = null;
    this.visible = true;
    this.default = toSignal(inject(TUI_DEFAULT_ERROR_MESSAGE));
  }
  set errorSetter(error) {
    this.error = tuiIsString(error) ? new TuiValidationError(error) : error;
  }
  static {
    this.ɵfac = function TuiError_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiError)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiError,
      selectors: [["tui-error"]],
      hostVars: 2,
      hostBindings: function TuiError_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("_error", ctx.error);
        }
      },
      inputs: {
        errorSetter: [0, "error", "errorSetter"]
      },
      decls: 1,
      vars: 1,
      consts: [["automation-id", "tui-error__text", "tuiAnimated", "", "class", "t-message-text", 4, "ngIf"], ["automation-id", "tui-error__text", "tuiAnimated", "", 1, "t-message-text"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiError_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiError_div_0_Template, 2, 3, "div", 0);
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", ctx.error);
        }
      },
      dependencies: [NgIf, PolymorpheusOutlet, TuiAnimated],
      styles: ['[_nghost-%COMP%]{transition-property:grid-template-rows;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:grid;font:var(--tui-font-text-s);color:var(--tui-text-negative);overflow-wrap:break-word;grid-template-rows:0fr}._error[_nghost-%COMP%]{grid-template-rows:1fr}.t-message-text[_ngcontent-%COMP%]{white-space:pre-line;grid-row:1 / span 2;overflow:hidden}.t-message-text.tui-enter[_ngcontent-%COMP%], .t-message-text.tui-leave[_ngcontent-%COMP%]{animation-name:tuiFade}.t-message-text[_ngcontent-%COMP%]:before{content:"";line-height:1.5rem;vertical-align:bottom}']
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiError, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-error",
      imports: [NgIf, PolymorpheusOutlet, TuiAnimated],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._error]": "error"
      },
      template: '<div\n    *ngIf="error"\n    automation-id="tui-error__text"\n    tuiAnimated\n    class="t-message-text"\n>\n    <ng-container *polymorpheusOutlet="error.message || default() as text; context: error.context || {}">\n        {{ text }}\n    </ng-container>\n</div>\n',
      styles: [':host{transition-property:grid-template-rows;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:grid;font:var(--tui-font-text-s);color:var(--tui-text-negative);overflow-wrap:break-word;grid-template-rows:0fr}:host._error{grid-template-rows:1fr}.t-message-text{white-space:pre-line;grid-row:1 / span 2;overflow:hidden}.t-message-text.tui-enter,.t-message-text.tui-leave{animation-name:tuiFade}.t-message-text:before{content:"";line-height:1.5rem;vertical-align:bottom}\n']
    }]
  }], null, {
    errorSetter: [{
      type: Input,
      args: ["error"]
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-loader.mjs
var _c05 = ["*"];
function TuiLoader_div_2_div_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r1, " ");
  }
}
function TuiLoader_div_2_div_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 6);
    ɵɵtemplate(1, TuiLoader_div_2_div_3_ng_container_1_Template, 2, 1, "ng-container", 7);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassProp("t-text_horizontal", ctx_r1.isHorizontal);
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r1.textContent);
  }
}
function TuiLoader_div_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵnamespaceSVG();
    ɵɵelementStart(1, "svg", 3);
    ɵɵelement(2, "circle", 4);
    ɵɵelementEnd();
    ɵɵtemplate(3, TuiLoader_div_2_div_3_Template, 2, 3, "div", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵclassProp("t-loader_horizontal", ctx_r1.isHorizontal)("t-loader_inherit-color", ctx_r1.inheritColor);
    ɵɵadvance(3);
    ɵɵproperty("ngIf", ctx_r1.textContent);
  }
}
var TUI_LOADER_DEFAULT_OPTIONS = {
  size: "m",
  inheritColor: false,
  overlay: false
};
var TUI_LOADER_OPTIONS = new InjectionToken(ngDevMode ? "TUI_LOADER_OPTIONS" : "", {
  factory: () => TUI_LOADER_DEFAULT_OPTIONS
});
function tuiLoaderOptionsProvider(options) {
  return tuiProvideOptions(TUI_LOADER_OPTIONS, options, TUI_LOADER_DEFAULT_OPTIONS);
}
var TuiLoader = class _TuiLoader {
  constructor() {
    this.isIOS = inject(TUI_IS_IOS);
    this.options = inject(TUI_LOADER_OPTIONS);
    this.isApple = tuiIsSafari(tuiInjectElement()) || this.isIOS;
    this.size = this.options.size;
    this.inheritColor = this.options.inheritColor;
    this.overlay = this.options.overlay;
    this.loading = true;
  }
  get isHorizontal() {
    return !tuiSizeBigger(this.size);
  }
  static {
    this.ɵfac = function TuiLoader_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLoader)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiLoader,
      selectors: [["tui-loader"]],
      hostVars: 3,
      hostBindings: function TuiLoader_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-size", ctx.size);
          ɵɵclassProp("_loading", ctx.loading);
        }
      },
      inputs: {
        size: "size",
        inheritColor: "inheritColor",
        overlay: "overlay",
        textContent: "textContent",
        loading: [0, "showLoader", "loading"]
      },
      ngContentSelectors: _c05,
      decls: 3,
      vars: 7,
      consts: [[1, "t-content", 3, "disabled"], ["class", "t-loader", 3, "t-loader_horizontal", "t-loader_inherit-color", 4, "ngIf"], [1, "t-loader"], ["automation-id", "tui-loader__loader", "focusable", "false", "height", "100%", "width", "100%", 1, "t-icon"], ["cx", "50%", "cy", "50%", 1, "t-circle"], ["automation-id", "tui-loader__text", "class", "t-text", 3, "t-text_horizontal", 4, "ngIf"], ["automation-id", "tui-loader__text", 1, "t-text"], [4, "polymorpheusOutlet"]],
      template: function TuiLoader_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵelementStart(0, "fieldset", 0);
          ɵɵprojection(1);
          ɵɵelementEnd();
          ɵɵtemplate(2, TuiLoader_div_2_Template, 4, 5, "div", 1);
        }
        if (rf & 2) {
          ɵɵclassProp("t-content_has-overlay", ctx.overlay && ctx.loading)("t-content_loading", ctx.loading);
          ɵɵproperty("disabled", ctx.loading && !ctx.isApple);
          ɵɵattribute("inert", ctx.loading || null);
          ɵɵadvance(2);
          ɵɵproperty("ngIf", ctx.loading);
        }
      },
      dependencies: [NgIf, PolymorpheusOutlet],
      styles: ["[_nghost-%COMP%]{position:relative;display:flex;min-inline-size:1.5rem;--tui-thickness: calc(var(--t-diameter) / 12)}._loading[_nghost-%COMP%]{overflow:hidden}[data-size=xs][_nghost-%COMP%]{--t-diameter: .75em}[data-size=s][_nghost-%COMP%]{--t-diameter: 1em}[data-size=m][_nghost-%COMP%]{--t-diameter: 1.5em}[data-size=l][_nghost-%COMP%]{--t-diameter: 2.5em}[data-size=xl][_nghost-%COMP%]{--t-diameter: 3.5em}[data-size=xxl][_nghost-%COMP%]{--t-diameter: 5em}.t-content[_ngcontent-%COMP%]{z-index:0;min-inline-size:100%;block-size:100%;padding:0;margin:0;border:none}.t-content_has-overlay[_ngcontent-%COMP%]{opacity:.3}.t-content_loading[_ngcontent-%COMP%]{pointer-events:none}.t-loader[_ngcontent-%COMP%]{position:relative;left:-100%;display:flex;inset-inline-start:-100%;flex-direction:column;align-items:center;justify-content:center;min-inline-size:100%;min-block-size:var(--t-diameter);flex-shrink:0;align-self:center;color:var(--tui-text-primary);stroke:var(--tui-background-accent-1);animation:tuiFadeIn var(--tui-duration);font-size:1rem}.t-loader.t-loader_horizontal[_ngcontent-%COMP%]{flex-direction:row}.t-loader.t-loader_inherit-color[_ngcontent-%COMP%]{color:inherit;stroke:currentColor}.t-text[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:var(--tui-font-text-s);margin-block-start:1rem;color:inherit;max-inline-size:100%;text-align:center;stroke-width:0}.t-text_horizontal[_ngcontent-%COMP%]{margin:0;margin-inline-start:1rem}@keyframes _ngcontent-%COMP%_tuiLoaderRotate{0%{transform:rotate(-90deg)}50%{transform:rotate(-90deg) rotate(1turn)}to{transform:rotate(-90deg) rotate(3turn)}}.t-icon[_ngcontent-%COMP%]{display:block;inline-size:var(--t-diameter);block-size:var(--t-diameter);margin:0 calc(var(--t-diameter) / -2);border-radius:100%;overflow:hidden;animation:_ngcontent-%COMP%_tuiLoaderRotate 4s linear infinite}@supports (-webkit-hyphens: none){.t-icon[_ngcontent-%COMP%]{overflow:visible}}@keyframes _ngcontent-%COMP%_tuiLoaderDashOffset{0%{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}50%{stroke-dashoffset:calc(.05 * calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness))))}to{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}}.t-circle[_ngcontent-%COMP%]{r:calc(var(--t-diameter) / 2 - var(--tui-thickness));stroke-dasharray:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)));fill:none;stroke:inherit;stroke-width:max(var(--tui-thickness),1.5px);animation:_ngcontent-%COMP%_tuiLoaderDashOffset 4s linear infinite}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLoader, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-loader",
      imports: [NgIf, PolymorpheusOutlet],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._loading]": "loading",
        "[attr.data-size]": "size"
      },
      template: '<fieldset\n    class="t-content"\n    [attr.inert]="loading || null"\n    [class.t-content_has-overlay]="overlay && loading"\n    [class.t-content_loading]="loading"\n    [disabled]="loading && !isApple"\n>\n    <ng-content />\n</fieldset>\n\n<div\n    *ngIf="loading"\n    class="t-loader"\n    [class.t-loader_horizontal]="isHorizontal"\n    [class.t-loader_inherit-color]="inheritColor"\n>\n    <svg\n        automation-id="tui-loader__loader"\n        focusable="false"\n        height="100%"\n        width="100%"\n        class="t-icon"\n    >\n        <circle\n            cx="50%"\n            cy="50%"\n            class="t-circle"\n        />\n    </svg>\n\n    <div\n        *ngIf="textContent"\n        automation-id="tui-loader__text"\n        class="t-text"\n        [class.t-text_horizontal]="isHorizontal"\n    >\n        <ng-container *polymorpheusOutlet="textContent as text">\n            {{ text }}\n        </ng-container>\n    </div>\n</div>\n',
      styles: [":host{position:relative;display:flex;min-inline-size:1.5rem;--tui-thickness: calc(var(--t-diameter) / 12)}:host._loading{overflow:hidden}:host[data-size=xs]{--t-diameter: .75em}:host[data-size=s]{--t-diameter: 1em}:host[data-size=m]{--t-diameter: 1.5em}:host[data-size=l]{--t-diameter: 2.5em}:host[data-size=xl]{--t-diameter: 3.5em}:host[data-size=xxl]{--t-diameter: 5em}.t-content{z-index:0;min-inline-size:100%;block-size:100%;padding:0;margin:0;border:none}.t-content_has-overlay{opacity:.3}.t-content_loading{pointer-events:none}.t-loader{position:relative;left:-100%;display:flex;inset-inline-start:-100%;flex-direction:column;align-items:center;justify-content:center;min-inline-size:100%;min-block-size:var(--t-diameter);flex-shrink:0;align-self:center;color:var(--tui-text-primary);stroke:var(--tui-background-accent-1);animation:tuiFadeIn var(--tui-duration);font-size:1rem}.t-loader.t-loader_horizontal{flex-direction:row}.t-loader.t-loader_inherit-color{color:inherit;stroke:currentColor}.t-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:var(--tui-font-text-s);margin-block-start:1rem;color:inherit;max-inline-size:100%;text-align:center;stroke-width:0}.t-text_horizontal{margin:0;margin-inline-start:1rem}@keyframes tuiLoaderRotate{0%{transform:rotate(-90deg)}50%{transform:rotate(-90deg) rotate(1turn)}to{transform:rotate(-90deg) rotate(3turn)}}.t-icon{display:block;inline-size:var(--t-diameter);block-size:var(--t-diameter);margin:0 calc(var(--t-diameter) / -2);border-radius:100%;overflow:hidden;animation:tuiLoaderRotate 4s linear infinite}@supports (-webkit-hyphens: none){.t-icon{overflow:visible}}@keyframes tuiLoaderDashOffset{0%{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}50%{stroke-dashoffset:calc(.05 * calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness))))}to{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}}.t-circle{r:calc(var(--t-diameter) / 2 - var(--tui-thickness));stroke-dasharray:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)));fill:none;stroke:inherit;stroke-width:max(var(--tui-thickness),1.5px);animation:tuiLoaderDashOffset 4s linear infinite}\n"]
    }]
  }], null, {
    size: [{
      type: Input
    }],
    inheritColor: [{
      type: Input
    }],
    overlay: [{
      type: Input
    }],
    textContent: [{
      type: Input
    }],
    loading: [{
      type: Input,
      args: ["showLoader"]
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-expand.mjs
var _c06 = ["wrapper"];
var _c12 = ["*"];
function TuiExpandComponent_ng_container_2_tui_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "tui-loader", 4);
    ɵɵelementContainer(1, 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("overlay", true)("showLoader", ctx_r0.loading);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r0.content);
  }
}
function TuiExpandComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵprojection(1);
    ɵɵtemplate(2, TuiExpandComponent_ng_container_2_tui_loader_2_Template, 2, 3, "tui-loader", 3);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r0.async)("ngIfElse", ctx_r0.content);
  }
}
var TuiExpandContent = class _TuiExpandContent {
  static {
    this.ɵfac = function TuiExpandContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiExpandContent)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiExpandContent,
      selectors: [["", "tuiExpandContent", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiExpandContent, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiExpandContent]"
    }]
  }], null, null);
})();
var State = {
  Idle: 0,
  Loading: 1,
  Prepared: 2,
  Animated: 3
};
var LOADER_HEIGHT = 48;
var TUI_EXPAND_LOADED = "tui-expand-loaded";
var TuiExpandComponent = class _TuiExpandComponent {
  constructor() {
    this.cdr = inject(ChangeDetectorRef);
    this.destroyRef = inject(DestroyRef);
    this.state = State.Idle;
    this.content = null;
    this.expanded = null;
    this.async = false;
  }
  set expandedSetter(expanded) {
    if (this.expanded === null) {
      this.expanded = expanded;
      return;
    }
    if (this.state !== State.Idle) {
      this.expanded = expanded;
      this.state = State.Animated;
      return;
    }
    this.expanded = expanded;
    this.retrigger(this.async && expanded ? State.Loading : State.Animated);
  }
  get contentVisible() {
    return this.expanded || this.state !== State.Idle;
  }
  get overflow() {
    return this.state !== State.Idle;
  }
  get loading() {
    return !!this.expanded && this.async && this.state === State.Loading;
  }
  get height() {
    const {
      expanded,
      state: state2,
      contentWrapper
    } = this;
    if (expanded && state2 === State.Prepared || !expanded && state2 === State.Animated) {
      return 0;
    }
    if (contentWrapper && (!expanded && state2 === State.Prepared || expanded && state2 === State.Animated)) {
      return contentWrapper.nativeElement.offsetHeight;
    }
    if (contentWrapper && expanded && state2 === State.Loading) {
      return Math.max(contentWrapper.nativeElement.offsetHeight, LOADER_HEIGHT);
    }
    return null;
  }
  onTransitionEnd({
    propertyName,
    pseudoElement
  }) {
    if (propertyName === "opacity" && !pseudoElement && this.state === State.Animated) {
      this.state = State.Idle;
    }
  }
  onExpandLoaded(event) {
    event.stopPropagation();
    if (this.state === State.Loading) {
      this.retrigger(State.Animated);
    }
  }
  retrigger(state2) {
    this.state = State.Prepared;
    timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.state !== State.Prepared) {
        return;
      }
      this.state = state2;
      this.cdr.markForCheck();
    });
  }
  static {
    this.ɵfac = function TuiExpandComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiExpandComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiExpandComponent,
      selectors: [["tui-expand"]],
      contentQueries: function TuiExpandComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TuiExpandContent, 5, TemplateRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.content = _t.first);
        }
      },
      viewQuery: function TuiExpandComponent_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(_c06, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentWrapper = _t.first);
        }
      },
      hostVars: 9,
      hostBindings: function TuiExpandComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("transitionend.self", function TuiExpandComponent_transitionend_self_HostBindingHandler($event) {
            return ctx.onTransitionEnd($event);
          })("tui-expand-loaded", function TuiExpandComponent_tui_expand_loaded_HostBindingHandler($event) {
            return ctx.onExpandLoaded($event);
          });
        }
        if (rf & 2) {
          ɵɵattribute("aria-expanded", ctx.expanded);
          ɵɵstyleProp("height", ctx.height, "px");
          ɵɵclassProp("_loading", ctx.loading)("_overflow", ctx.overflow)("_expanded", ctx.expanded);
        }
      },
      inputs: {
        async: "async",
        expandedSetter: [0, "expanded", "expandedSetter"]
      },
      ngContentSelectors: _c12,
      decls: 3,
      vars: 3,
      consts: [["wrapper", ""], [1, "t-wrapper"], [4, "ngIf"], ["size", "l", 3, "overlay", "showLoader", 4, "ngIf", "ngIfElse"], ["size", "l", 3, "overlay", "showLoader"], [3, "ngTemplateOutlet"]],
      template: function TuiExpandComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵelementStart(0, "div", 1, 0);
          ɵɵtemplate(2, TuiExpandComponent_ng_container_2_Template, 3, 2, "ng-container", 2);
          ɵɵelementEnd();
        }
        if (rf & 2) {
          ɵɵproperty("@tuiParentAnimation", void 0)("@.disabled", ctx.overflow);
          ɵɵadvance(2);
          ɵɵproperty("ngIf", ctx.contentVisible);
        }
      },
      dependencies: [NgIf, NgTemplateOutlet, TuiLoader],
      styles: ['[_nghost-%COMP%]{transition-property:opacity,height,visibility;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:block;opacity:0;transition-delay:1ms}._overflow[_nghost-%COMP%]{overflow:hidden}._expanded[_nghost-%COMP%]{opacity:1}._loading[_nghost-%COMP%]{opacity:.99}.t-wrapper[_ngcontent-%COMP%]:before, .t-wrapper[_ngcontent-%COMP%]:after{content:"";display:table}'],
      data: {
        animation: [tuiParentAnimation]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiExpandComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-expand",
      imports: [NgIf, NgTemplateOutlet, TuiLoader],
      changeDetection: ChangeDetectionStrategy.OnPush,
      animations: [tuiParentAnimation],
      host: {
        "[style.height.px]": "height",
        "[class._loading]": "loading",
        "[class._overflow]": "overflow",
        "[class._expanded]": "expanded",
        "[attr.aria-expanded]": "expanded",
        "(transitionend.self)": "onTransitionEnd($event)",
        [`(${TUI_EXPAND_LOADED})`]: "onExpandLoaded($event)"
      },
      template: '<div\n    #wrapper\n    class="t-wrapper"\n    @tuiParentAnimation\n    [@.disabled]="overflow"\n>\n    <ng-container *ngIf="contentVisible">\n        <ng-content />\n        <tui-loader\n            *ngIf="async; else content"\n            size="l"\n            [overlay]="true"\n            [showLoader]="loading"\n        >\n            <ng-container [ngTemplateOutlet]="content" />\n        </tui-loader>\n    </ng-container>\n</div>\n',
      styles: [':host{transition-property:opacity,height,visibility;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:block;opacity:0;transition-delay:1ms}:host._overflow{overflow:hidden}:host._expanded{opacity:1}:host._loading{opacity:.99}.t-wrapper:before,.t-wrapper:after{content:"";display:table}\n']
    }]
  }], null, {
    contentWrapper: [{
      type: ViewChild,
      args: ["wrapper"]
    }],
    content: [{
      type: ContentChild,
      args: [TuiExpandContent, {
        read: TemplateRef
      }]
    }],
    async: [{
      type: Input
    }],
    expandedSetter: [{
      type: Input,
      args: ["expanded"]
    }]
  });
})();
var TuiExpand = [TuiExpandComponent, TuiExpandContent];

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-platform.mjs
var TuiPlatform = class _TuiPlatform {
  constructor() {
    this.tuiPlatform = inject(TUI_PLATFORM, {
      skipSelf: true
    });
  }
  static {
    this.ɵfac = function TuiPlatform_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiPlatform)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiPlatform,
      selectors: [["", "tuiPlatform", ""]],
      hostVars: 1,
      hostBindings: function TuiPlatform_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-platform", ctx.tuiPlatform);
        }
      },
      inputs: {
        tuiPlatform: "tuiPlatform"
      },
      features: [ɵɵProvidersFeature([{
        provide: TUI_PLATFORM,
        useFactory: () => inject(_TuiPlatform).tuiPlatform
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPlatform, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiPlatform]",
      providers: [{
        provide: TUI_PLATFORM,
        useFactory: () => inject(TuiPlatform).tuiPlatform
      }],
      host: {
        "[attr.data-platform]": "tuiPlatform"
      }
    }]
  }], null, {
    tuiPlatform: [{
      type: Input
    }]
  });
})();

// node_modules/@ng-web-apis/screen-orientation/fesm2022/ng-web-apis-screen-orientation.mjs
var ScreenOrientationService = class _ScreenOrientationService extends Observable {
  win = inject(WA_WINDOW);
  stream$ = (this.isModern ? fromEvent(this.win.screen.orientation, "change").pipe(startWith(null), map(() => (
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
     * The type read-only property of the ScreenOrientation interface returns the document's current orientation type,
     * one of "portrait-primary", "portrait-secondary", "landscape-primary", or "landscape-secondary".
     *
     * Browser compatibility:
     * Safari 16.4+, Chrome 38+, Firefox 43+
     */
    this.win.screen.orientation.type
  ))) : fromEvent(this.win, "orientationchange").pipe(startWith(null), map(() => {
    const angle = parseInt(this.win.orientation, 10);
    switch (angle) {
      case -90:
        return "landscape-secondary";
      case 180:
        return "portrait-secondary";
      case 90:
        return "landscape-primary";
      case 0:
      default:
        return "portrait-primary";
    }
  }))).pipe(shareReplay({
    bufferSize: 1,
    refCount: true
  }));
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
  }
  get isModern() {
    return !!this.win?.screen?.orientation;
  }
  static ɵfac = function ScreenOrientationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScreenOrientationService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ScreenOrientationService,
    factory: _ScreenOrientationService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScreenOrientationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var ViewportService = class _ViewportService extends Observable {
  visualViewport = inject(WINDOW).visualViewport;
  stream$ = this.visualViewport ? merge(fromEvent(this.visualViewport, "resize"), fromEvent(this.visualViewport, "scroll"), fromEvent(this.visualViewport, "scrollend")).pipe(startWith(null), map(() => this.visualViewport), filter(Boolean), shareReplay({
    bufferSize: 1,
    refCount: true
  })) : EMPTY;
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
  }
  static ɵfac = function ViewportService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ViewportService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ViewportService,
    factory: _ViewportService.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ViewportService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-visual-viewport.mjs
var TuiVisualViewport = class _TuiVisualViewport {
  constructor() {
    this.w = inject(WA_WINDOW);
    this.style = tuiInjectElement().style;
    this.minInnerHeight = Infinity;
    this.$ = inject(ViewportService).pipe(takeUntilDestroyed()).subscribe(({
      offsetLeft,
      offsetTop,
      height,
      width,
      scale
    }) => {
      this.minInnerHeight = Math.min(this.minInnerHeight, this.w.innerHeight);
      this.style.setProperty("--tui-viewport-x", tuiPx(offsetLeft));
      this.style.setProperty("--tui-viewport-y", tuiPx(offsetTop));
      this.style.setProperty("--tui-viewport-height", tuiPx(height));
      this.style.setProperty("--tui-viewport-width", tuiPx(width));
      this.style.setProperty("--tui-viewport-scale", String(scale));
      this.style.setProperty("--tui-viewport-vh", tuiPx(this.w.innerHeight / 100));
      this.style.setProperty("--tui-viewport-vw", tuiPx(this.w.innerWidth / 100));
      this.style.setProperty("--tui-viewport-svh", tuiPx(this.minInnerHeight / 100));
    });
  }
  static {
    this.ɵfac = function TuiVisualViewport_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiVisualViewport)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiVisualViewport,
      selectors: [["", "tuiVisualViewport", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiVisualViewport, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiVisualViewport]"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/event-plugins/fesm2022/taiga-ui-event-plugins.mjs
var LongtapEvent = class extends CustomEvent {
  constructor(type, _a) {
    var _b = _a, {
      clientX,
      clientY
    } = _b, eventInitDict = __objRest(_b, [
      "clientX",
      "clientY"
    ]);
    super(type, __spreadProps(__spreadValues({}, eventInitDict), {
      detail: {
        clientX,
        clientY
      }
    }));
  }
};
var isIos = ({
  userAgent,
  maxTouchPoints
}) => /ipad|iphone|ipod/i.test(userAgent) || /^((?!chrome|android).)*safari/i.test(userAgent) && maxTouchPoints > 1;
var TAP_DELAY = 700;
var SAFE_NAVIGATOR = typeof navigator === "undefined" ? null : navigator;
var MOVE_THRESHOLD = 15;
var LongtapEventPlugin = class {
  constructor() {
    this.isIOS = !!SAFE_NAVIGATOR && isIos(SAFE_NAVIGATOR);
  }
  addEventListener(element, _event, handler) {
    const removeLongtapEventPolyfill = this.isIOS ? this.listenTouchEvents(element) : this.listenContextmenuEvent(element);
    element.addEventListener("longtap", handler);
    return () => {
      removeLongtapEventPolyfill();
      element.removeEventListener("longtap", handler);
    };
  }
  supports(event) {
    return event === "longtap";
  }
  listenContextmenuEvent(element) {
    return this.manager.addEventListener(element, "contextmenu.prevent.stop", ({
      clientX,
      clientY
    }) => {
      this.dispatchLongtapEvent(element, clientX, clientY);
    });
  }
  listenTouchEvents(element) {
    let longTapTimeout = null;
    let touchStartCoords = null;
    const reset = () => {
      clearTimeout(longTapTimeout);
      touchStartCoords = null;
      longTapTimeout = null;
    };
    const removeTouchstartListener = this.manager.addEventListener(element, "touchstart.zoneless.passive", ({
      touches
    }) => {
      const touch = touches[0];
      if (!touch) {
        return;
      }
      const {
        clientX,
        clientY
      } = touch;
      touchStartCoords = {
        clientX,
        clientY
      };
      longTapTimeout = setTimeout(() => {
        this.dispatchLongtapEvent(element, clientX, clientY);
        reset();
      }, TAP_DELAY);
    });
    const removeTouchmoveListener = this.manager.addEventListener(element, "touchmove.zoneless.passive", ({
      touches
    }) => {
      const touch = touches[0];
      if (!touch || !touchStartCoords) {
        return;
      }
      const {
        clientX,
        clientY
      } = touch;
      if (Math.hypot(clientX - touchStartCoords.clientX, clientY - touchStartCoords.clientY) <= MOVE_THRESHOLD) {
        return;
      }
      reset();
    });
    const removeTouchcancelListener = this.manager.addEventListener(element, "touchcancel.zoneless.passive", reset);
    const removeTouchendListener = this.manager.addEventListener(element, "touchend.zoneless.passive", reset);
    return () => {
      removeTouchstartListener();
      removeTouchmoveListener();
      removeTouchcancelListener();
      removeTouchendListener();
    };
  }
  dispatchLongtapEvent(element, clientX, clientY) {
    element.dispatchEvent(new LongtapEvent("longtap", {
      clientX,
      clientY,
      bubbles: false,
      cancelable: false,
      composed: false
    }));
  }
};
var TimedEventPlugin = class {
  supports(event) {
    return this.regExp.test(event);
  }
  getDelay(event) {
    const match = this.regExp.exec(event);
    if (!match?.groups) {
      throw new Error(`Invalid event: ${event}`);
    }
    const {
      time,
      units
    } = match.groups;
    switch (units) {
      case "ms":
        return Number(time);
      case "s":
        return Number(time) * 1e3;
      default:
        throw new Error(`Invalid event: ${event}`);
    }
  }
  unwrap(event) {
    return event.replace(this.regExp, "");
  }
};
var DebounceEventPlugin = class extends TimedEventPlugin {
  constructor() {
    super(...arguments);
    this.regExp = /\.debounce~(?<time>\d+)(?<units>ms|s)/;
  }
  addEventListener(element, eventName, handler) {
    let timeout;
    const unsubscribe = this.manager.addEventListener(element, this.unwrap(eventName), (event) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handler(event);
      }, this.getDelay(eventName));
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }
};
var AbstractEventPlugin = class {
  supports(event) {
    return event.includes(this.modifier);
  }
  unwrap(event) {
    return event.split(".").filter((v) => !this.modifier.includes(v)).join(".");
  }
};
var GLOBAL_HANDLER = new InjectionToken(ngDevMode ? "[GLOBAL_HANDLER]: Global event target handler" : "", {
  factory: () => {
    const document = inject(DOCUMENT);
    return (name) => name === "body" ? document.body : document.defaultView[name] || document.createElement("div");
  }
});
var GlobalEventPlugin = class _GlobalEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.handler = inject(GLOBAL_HANDLER);
    this.modifier = ">";
  }
  addEventListener(_, event, handler) {
    return this.manager.addEventListener(this.handler(event.split(">")[0]), event.split(">")?.[1] ?? "", handler);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵGlobalEventPlugin_BaseFactory;
      return function GlobalEventPlugin_Factory(__ngFactoryType__) {
        return (ɵGlobalEventPlugin_BaseFactory || (ɵGlobalEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_GlobalEventPlugin)))(__ngFactoryType__ || _GlobalEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _GlobalEventPlugin,
      factory: _GlobalEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlobalEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var OptionsEventPlugin = class _OptionsEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = "capture.once.passive";
  }
  supports(event) {
    return event.includes(".") && !this.unwrap(event).includes(".");
  }
  addEventListener(element, event, handler) {
    const unwrap = this.unwrap(event);
    const capture = event.includes(".capture");
    element.addEventListener(unwrap, handler, {
      capture,
      once: event.includes(".once"),
      passive: event.includes(".passive")
    });
    return () => element.removeEventListener(unwrap, handler, {
      capture
    });
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵOptionsEventPlugin_BaseFactory;
      return function OptionsEventPlugin_Factory(__ngFactoryType__) {
        return (ɵOptionsEventPlugin_BaseFactory || (ɵOptionsEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_OptionsEventPlugin)))(__ngFactoryType__ || _OptionsEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _OptionsEventPlugin,
      factory: _OptionsEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OptionsEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var PreventEventPlugin = class _PreventEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = ".prevent";
  }
  addEventListener(element, event, handler) {
    return this.manager.addEventListener(element, this.unwrap(event), (event2) => {
      event2.preventDefault();
      handler(event2);
    });
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵPreventEventPlugin_BaseFactory;
      return function PreventEventPlugin_Factory(__ngFactoryType__) {
        return (ɵPreventEventPlugin_BaseFactory || (ɵPreventEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_PreventEventPlugin)))(__ngFactoryType__ || _PreventEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _PreventEventPlugin,
      factory: _PreventEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PreventEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var ResizePlugin = class _ResizePlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = "resize";
  }
  supports(event) {
    return event === "resize";
  }
  addEventListener(element, event, handler) {
    if (typeof ResizeObserver === "undefined" || !(element instanceof Element)) {
      element.addEventListener(event, handler);
      return () => element.removeEventListener(event, handler);
    }
    const observer = new ResizeObserver(handler);
    observer.observe(element);
    return () => observer.disconnect();
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵResizePlugin_BaseFactory;
      return function ResizePlugin_Factory(__ngFactoryType__) {
        return (ɵResizePlugin_BaseFactory || (ɵResizePlugin_BaseFactory = ɵɵgetInheritedFactory(_ResizePlugin)))(__ngFactoryType__ || _ResizePlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _ResizePlugin,
      factory: _ResizePlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResizePlugin, [{
    type: Injectable
  }], null, null);
})();
var SelfEventPlugin = class _SelfEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = ".self";
  }
  addEventListener(element, event, handler) {
    return this.manager.addEventListener(element, this.unwrap(event), (event2) => {
      if (event2.target === event2.currentTarget) {
        handler(event2);
      }
    });
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵSelfEventPlugin_BaseFactory;
      return function SelfEventPlugin_Factory(__ngFactoryType__) {
        return (ɵSelfEventPlugin_BaseFactory || (ɵSelfEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_SelfEventPlugin)))(__ngFactoryType__ || _SelfEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _SelfEventPlugin,
      factory: _SelfEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelfEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var SilentEventPlugin = class _SilentEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = ".silent";
  }
  addEventListener(element, event, handler) {
    _SilentEventPlugin.ngZone = this.manager.getZone();
    return _SilentEventPlugin.ngZone.runOutsideAngular(() => this.manager.addEventListener(element, this.unwrap(event), handler));
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵSilentEventPlugin_BaseFactory;
      return function SilentEventPlugin_Factory(__ngFactoryType__) {
        return (ɵSilentEventPlugin_BaseFactory || (ɵSilentEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_SilentEventPlugin)))(__ngFactoryType__ || _SilentEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _SilentEventPlugin,
      factory: _SilentEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SilentEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var StopEventPlugin = class _StopEventPlugin extends AbstractEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = ".stop";
  }
  addEventListener(element, event, handler) {
    return this.manager.addEventListener(element, this.unwrap(event), (event2) => {
      event2.stopPropagation();
      handler(event2);
    });
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵStopEventPlugin_BaseFactory;
      return function StopEventPlugin_Factory(__ngFactoryType__) {
        return (ɵStopEventPlugin_BaseFactory || (ɵStopEventPlugin_BaseFactory = ɵɵgetInheritedFactory(_StopEventPlugin)))(__ngFactoryType__ || _StopEventPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _StopEventPlugin,
      factory: _StopEventPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StopEventPlugin, [{
    type: Injectable
  }], null, null);
})();
var ThrottleEventPlugin = class extends TimedEventPlugin {
  constructor() {
    super(...arguments);
    this.regExp = /\.throttle~(?<time>\d+)(?<units>ms|s)/;
  }
  addEventListener(element, eventName, handler) {
    let timeout;
    const unsubscribe = this.manager.addEventListener(element, this.unwrap(eventName), (event) => {
      if (timeout !== void 0) {
        return;
      }
      handler(event);
      timeout = setTimeout(() => {
        timeout = void 0;
      }, this.getDelay(eventName));
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }
};
var ZonelessPlugin = class _ZonelessPlugin extends SilentEventPlugin {
  constructor() {
    super(...arguments);
    this.modifier = ".zoneless";
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵZonelessPlugin_BaseFactory;
      return function ZonelessPlugin_Factory(__ngFactoryType__) {
        return (ɵZonelessPlugin_BaseFactory || (ɵZonelessPlugin_BaseFactory = ɵɵgetInheritedFactory(_ZonelessPlugin)))(__ngFactoryType__ || _ZonelessPlugin);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _ZonelessPlugin,
      factory: _ZonelessPlugin.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ZonelessPlugin, [{
    type: Injectable
  }], null, null);
})();
var PLUGINS = [SilentEventPlugin, ZonelessPlugin, SelfEventPlugin, GlobalEventPlugin, OptionsEventPlugin, PreventEventPlugin, ResizePlugin, StopEventPlugin, LongtapEventPlugin, DebounceEventPlugin, ThrottleEventPlugin];
var NG_EVENT_PLUGINS = PLUGINS.map((useClass) => ({
  provide: EVENT_MANAGER_PLUGINS,
  multi: true,
  useClass
}));

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-root.mjs
var _c07 = ["*", [["tuiOverContent"]], [["tuiOverDialogs"]], [["tuiOverAlerts"]], [["tuiOverDropdowns"]], [["tuiOverHints"]]];
var _c13 = ["*", "tuiOverContent", "tuiOverDialogs", "tuiOverAlerts", "tuiOverDropdowns", "tuiOverHints"];
function TuiRoot_ng_container_2_tui_scroll_controls_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "tui-scroll-controls", 3);
  }
}
function TuiRoot_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TuiRoot_ng_container_2_tui_scroll_controls_1_Template, 1, 0, "tui-scroll-controls", 2);
    ɵɵelement(2, "tui-popups");
    ɵɵprojection(3, 1);
    ɵɵelement(4, "tui-dialogs");
    ɵɵprojection(5, 2);
    ɵɵelement(6, "tui-alerts");
    ɵɵprojection(7, 3);
    ɵɵelement(8, "tui-dropdowns");
    ɵɵprojection(9, 4);
    ɵɵelement(10, "tui-hints");
    ɵɵprojection(11, 5);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r0.scrollbars);
  }
}
var TuiRoot = class _TuiRoot {
  constructor() {
    this.doc = inject(DOCUMENT);
    this.el = tuiInjectElement();
    this.reducedMotion = inject(TUI_REDUCED_MOTION);
    this.duration = tuiGetDuration(inject(TUI_ANIMATIONS_SPEED));
    this.isChildRoot = !!inject(_TuiRoot, {
      optional: true,
      skipSelf: true
    });
    this.top = signal(!this.isChildRoot);
    this.isMobileRes = toSignal(inject(TuiBreakpointService).pipe(map((breakpoint) => breakpoint === "mobile"), tuiWatch()), {
      initialValue: false
    });
    this.nativeScrollbar = inject(TUI_SCROLLBAR_OPTIONS).mode === "native";
    this.scrollbars = !this.nativeScrollbar && !inject(TUI_IS_MOBILE) && !this.isChildRoot;
    const factory = inject(RendererFactory2);
    factory.removeStylesOnCompDestroy = false;
    if (factory.delegate) {
      factory.delegate.removeStylesOnCompDestroy = false;
    }
    if (!this.top()) {
      return;
    }
    this.doc.documentElement.setAttribute("data-tui-theme", inject(TUI_THEME).toLowerCase());
    if (!this.nativeScrollbar) {
      this.doc.defaultView?.document.documentElement.classList.add("tui-zero-scrollbar");
    }
    ngDevMode && console.assert(!!inject(EVENT_MANAGER_PLUGINS).find((plugin) => plugin instanceof PreventEventPlugin), "NG_EVENT_PLUGINS is missing from global providers");
  }
  get isTopLayer() {
    return this.doc.fullscreenElement?.matches("tui-root") ? this.doc.fullscreenElement === this.el : !this.isChildRoot;
  }
  static {
    this.ɵfac = function TuiRoot_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiRoot)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiRoot,
      selectors: [["tui-root"]],
      hostAttrs: ["data-tui-version", "4.90.0", "tuiRootV", "4.90.0"],
      hostVars: 6,
      hostBindings: function TuiRoot_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("touchstart.passive.zoneless", function TuiRoot_touchstart_passive_zoneless_HostBindingHandler() {
            return 0;
          })("fullscreenchange", function TuiRoot_fullscreenchange_HostBindingHandler() {
            return ctx.top.set(ctx.isTopLayer);
          }, ɵɵresolveDocument);
        }
        if (rf & 2) {
          ɵɵstyleProp("--tui-duration", ctx.duration, "ms")("--tui-scroll-behavior", ctx.reducedMotion ? "auto" : "smooth");
          ɵɵclassProp("_mobile", ctx.isMobileRes());
        }
      },
      features: [ɵɵHostDirectivesFeature([TuiPlatform, TuiVisualViewport, TuiFontSize, TuiActiveZone])],
      ngContentSelectors: _c13,
      decls: 3,
      vars: 1,
      consts: [[1, "t-root-content"], [4, "ngIf"], ["class", "t-root-scrollbar", 4, "ngIf"], [1, "t-root-scrollbar"]],
      template: function TuiRoot_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef(_c07);
          ɵɵelementStart(0, "div", 0);
          ɵɵprojection(1);
          ɵɵelementEnd();
          ɵɵtemplate(2, TuiRoot_ng_container_2_Template, 12, 1, "ng-container", 1);
        }
        if (rf & 2) {
          ɵɵadvance(2);
          ɵɵproperty("ngIf", ctx.top());
        }
      },
      dependencies: [NgIf, TuiAlerts, TuiDialogs, TuiDropdowns, TuiHints, TuiPopups, TuiScrollControls],
      styles: ['@keyframes tuiSkeletonVibe{to{opacity:.5}}@keyframes tuiPresent{to{content:""}}@keyframes tuiFade{0%{opacity:0}}@keyframes tuiSlide{0%{transform:var(--tui-from, translateY(100%))}}@keyframes tuiScale{0%{transform:scale(var(--tui-scale, 0))}}@keyframes tuiCollapse{0%{grid-template-rows:0fr}to{grid-template-rows:1fr}}.tui-enter,.tui-leave{animation-duration:var(--tui-duration);animation-timing-function:ease-in-out;pointer-events:none}.tui-leave{animation-direction:reverse}\n', '.tui-zero-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.tui-zero-scrollbar::-webkit-scrollbar,.tui-zero-scrollbar::-webkit-scrollbar-thumb{display:none}body,input{margin:0}[tuiRootV="4.90.0"]{position:relative;display:block;font:var(--tui-font-text-s);color:var(--tui-text-primary);flex:1;border-image:conic-gradient(var(--tui-background-base) 0 0) fill 0/0/0 0 100vh 0;-webkit-tap-highlight-color:transparent;--tui-lh: 1.4em}@supports (font-size: 1lh){[tuiRootV="4.90.0"]{--tui-lh: 1lh}}:root{--tui-inline-start: left;--tui-inline-end: right;--tui-inline: 1}[dir=rtl]{--tui-inline-start: right;--tui-inline-end: left;--tui-inline: -1}[tuiRootV="4.90.0"]>.t-root-scrollbar{position:fixed;top:0;left:0;bottom:0;right:0;z-index:0;display:none;margin:0}[data-tui-theme] [tuiRootV="4.90.0"]>.t-root-scrollbar{display:block}.t-root-content{position:relative;top:var(--t-root-top);block-size:100%;isolation:isolate}.t-root-content>*{--t-root-top: 0}[tuiDropdownButton][tuiDropdownButton]{display:none}\n'],
      encapsulation: 2,
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiRoot, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-root",
      imports: [NgIf, TuiAlerts, TuiDialogs, TuiDropdowns, TuiHints, TuiPopups, TuiScrollControls],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      hostDirectives: [TuiPlatform, TuiVisualViewport, TuiFontSize, TuiActiveZone],
      host: {
        "data-tui-version": TUI_VERSION,
        tuiRootV: TUI_VERSION,
        "[style.--tui-duration.ms]": "duration",
        "[style.--tui-scroll-behavior]": 'reducedMotion ? "auto" : "smooth"',
        "[class._mobile]": "isMobileRes()",
        // Required for the :active state to work in Safari. https://stackoverflow.com/a/33681490
        "(touchstart.passive.zoneless)": "0",
        "(document:fullscreenchange)": "top.set(isTopLayer)"
      },
      template: '<div class="t-root-content">\n    <ng-content />\n</div>\n<ng-container *ngIf="top()">\n    <tui-scroll-controls\n        *ngIf="scrollbars"\n        class="t-root-scrollbar"\n    />\n    <tui-popups />\n    <ng-content select="tuiOverContent" />\n    <tui-dialogs />\n    <ng-content select="tuiOverDialogs" />\n    <tui-alerts />\n    <ng-content select="tuiOverAlerts" />\n    <tui-dropdowns />\n    <ng-content select="tuiOverDropdowns" />\n    <tui-hints />\n    <ng-content select="tuiOverHints" />\n</ng-container>\n',
      styles: ['@keyframes tuiSkeletonVibe{to{opacity:.5}}@keyframes tuiPresent{to{content:""}}@keyframes tuiFade{0%{opacity:0}}@keyframes tuiSlide{0%{transform:var(--tui-from, translateY(100%))}}@keyframes tuiScale{0%{transform:scale(var(--tui-scale, 0))}}@keyframes tuiCollapse{0%{grid-template-rows:0fr}to{grid-template-rows:1fr}}.tui-enter,.tui-leave{animation-duration:var(--tui-duration);animation-timing-function:ease-in-out;pointer-events:none}.tui-leave{animation-direction:reverse}\n', '.tui-zero-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.tui-zero-scrollbar::-webkit-scrollbar,.tui-zero-scrollbar::-webkit-scrollbar-thumb{display:none}body,input{margin:0}[tuiRootV="4.90.0"]{position:relative;display:block;font:var(--tui-font-text-s);color:var(--tui-text-primary);flex:1;border-image:conic-gradient(var(--tui-background-base) 0 0) fill 0/0/0 0 100vh 0;-webkit-tap-highlight-color:transparent;--tui-lh: 1.4em}@supports (font-size: 1lh){[tuiRootV="4.90.0"]{--tui-lh: 1lh}}:root{--tui-inline-start: left;--tui-inline-end: right;--tui-inline: 1}[dir=rtl]{--tui-inline-start: right;--tui-inline-end: left;--tui-inline: -1}[tuiRootV="4.90.0"]>.t-root-scrollbar{position:fixed;top:0;left:0;bottom:0;right:0;z-index:0;display:none;margin:0}[data-tui-theme] [tuiRootV="4.90.0"]>.t-root-scrollbar{display:block}.t-root-content{position:relative;top:var(--t-root-top);block-size:100%;isolation:isolate}.t-root-content>*{--t-root-top: 0}[tuiDropdownButton][tuiDropdownButton]{display:none}\n']
    }]
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-fullscreen.mjs
var _c08 = ["*"];
var TuiFullscreen = class _TuiFullscreen {
  constructor() {
    this.doc = inject(DOCUMENT);
    this.open = signal(false);
    this.opened = new EventEmitter();
    this.options = {
      navigationUI: "auto"
    };
  }
  set fullscreen(open) {
    if (this.open() === open) {
      return;
    }
    if (open) {
      this.root?.nativeElement.requestFullscreen(this.options).then(() => this.fullscreenState(open));
    } else {
      this.doc.exitFullscreen().then(() => this.fullscreenState(open)).catch((error) => console.error("Failed to exit fullscreen:", error));
    }
  }
  closedByEscape(event) {
    const escaped = !this.doc.fullscreenElement && event.target === this.root?.nativeElement;
    if (escaped) {
      this.fullscreenState(false);
    }
  }
  fullscreenState(open) {
    this.open.set(open);
    this.opened.emit(open);
  }
  static {
    this.ɵfac = function TuiFullscreen_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFullscreen)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiFullscreen,
      selectors: [["", "tuiFullscreen", ""]],
      viewQuery: function TuiFullscreen_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(TuiRoot, 5, ElementRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.root = _t.first);
        }
      },
      hostBindings: function TuiFullscreen_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("fullscreenchange", function TuiFullscreen_fullscreenchange_HostBindingHandler($event) {
            return ctx.closedByEscape($event);
          }, ɵɵresolveDocument);
        }
      },
      inputs: {
        options: [0, "tuiFullscreenOptions", "options"],
        fullscreen: [0, "tuiFullscreen", "fullscreen"]
      },
      outputs: {
        opened: "tuiFullscreenChange"
      },
      features: [ɵɵProvidersFeature([], [{
        provide: TuiActiveZone,
        useValue: null
      }])],
      ngContentSelectors: _c08,
      decls: 2,
      vars: 0,
      template: function TuiFullscreen_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵelementStart(0, "tui-root");
          ɵɵprojection(1);
          ɵɵelementEnd();
        }
      },
      dependencies: [TuiRoot],
      styles: ["tui-root[_ngcontent-%COMP%]{scrollbar-width:none;-ms-overflow-style:none;overflow:auto}tui-root[_ngcontent-%COMP%]::-webkit-scrollbar, tui-root[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{display:none}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFullscreen, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "[tuiFullscreen]",
      imports: [TuiRoot],
      template: "<tui-root><ng-content /></tui-root>",
      changeDetection: ChangeDetectionStrategy.OnPush,
      viewProviders: [{
        provide: TuiActiveZone,
        useValue: null
      }],
      host: {
        "(document:fullscreenchange)": "closedByEscape($event)"
      },
      styles: ["tui-root{scrollbar-width:none;-ms-overflow-style:none;overflow:auto}tui-root::-webkit-scrollbar,tui-root::-webkit-scrollbar-thumb{display:none}\n"]
    }]
  }], null, {
    root: [{
      type: ViewChild,
      args: [TuiRoot, {
        read: ElementRef
      }]
    }],
    opened: [{
      type: Output,
      args: ["tuiFullscreenChange"]
    }],
    options: [{
      type: Input,
      args: ["tuiFullscreenOptions"]
    }],
    fullscreen: [{
      type: Input,
      args: ["tuiFullscreen"]
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-icon.mjs
var TuiIcon = class _TuiIcon {
  constructor() {
    this.resolver = tuiInjectIconResolver();
    this.src = signal(inject(TUI_ICON_START, {
      self: true,
      optional: true
    }) || inject(TUI_ICON_END, {
      self: true,
      optional: true
    }));
    this.bg = signal(null);
    this.resource = computed(() => this.resolve(this.src()));
    this.mode = computed(() => tuiGetIconMode(this.src()));
    this.bgResource = computed(() => this.resolve(this.bg()));
  }
  set icon(icon) {
    this.src.set(icon);
  }
  set background(background) {
    this.bg.set(background);
  }
  resolve(value) {
    if (!value) {
      return null;
    }
    return tuiGetIconMode(value) === "font" ? `'${this.resolver(value)}'` : `url(${this.resolver(value)})`;
  }
  static {
    this.ɵfac = function TuiIcon_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiIcon)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiIcon,
      selectors: [["tui-icon"]],
      hostAttrs: ["tuiIconV", "4.90.0"],
      hostVars: 5,
      hostBindings: function TuiIcon_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-icon", ctx.mode());
          ɵɵstyleProp("--t-icon", ctx.resource() || "url()")("--t-icon-bg", ctx.bgResource());
        }
      },
      inputs: {
        icon: "icon",
        background: "background"
      },
      decls: 0,
      vars: 0,
      template: function TuiIcon_Template(rf, ctx) {
      },
      styles: ['[tuiIconV="4.90.0"]{position:relative;display:inline-block;inline-size:1em;block-size:1em;font-size:1.5rem;flex-shrink:0;border:0 solid transparent;vertical-align:middle;box-sizing:border-box;-webkit-mask:var(--t-icon-bg) no-repeat center / contain;mask:var(--t-icon-bg) no-repeat center / contain}@media (hover: hover) and (pointer: fine){[tuiIconV="4.90.0"][data-appearance=icon]:hover{color:var(--tui-text-secondary)}}[tuiIconV="4.90.0"]:after,[tuiIconV="4.90.0"][tuiIcons]:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;content:"";display:block;-webkit-mask:var(--t-icon) no-repeat center / contain;mask:var(--t-icon) no-repeat center / contain;background:currentColor}[tuiIconV="4.90.0"][data-icon=image]:after{-webkit-mask:none;mask:none;background:var(--t-icon) no-repeat center / contain}[tuiIconV="4.90.0"][data-icon=font]:after{content:var(--t-icon);-webkit-mask:none;mask:none;background:none;font:1em/1 var(--tui-font-icon, inherit);text-align:center;text-transform:none}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiIcon, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-icon",
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        tuiIconV: TUI_VERSION,
        "[style.--t-icon]": 'resource() || "url()"',
        "[style.--t-icon-bg]": "bgResource()",
        "[attr.data-icon]": "mode()"
      },
      styles: ['[tuiIconV="4.90.0"]{position:relative;display:inline-block;inline-size:1em;block-size:1em;font-size:1.5rem;flex-shrink:0;border:0 solid transparent;vertical-align:middle;box-sizing:border-box;-webkit-mask:var(--t-icon-bg) no-repeat center / contain;mask:var(--t-icon-bg) no-repeat center / contain}@media (hover: hover) and (pointer: fine){[tuiIconV="4.90.0"][data-appearance=icon]:hover{color:var(--tui-text-secondary)}}[tuiIconV="4.90.0"]:after,[tuiIconV="4.90.0"][tuiIcons]:after{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;content:"";display:block;-webkit-mask:var(--t-icon) no-repeat center / contain;mask:var(--t-icon) no-repeat center / contain;background:currentColor}[tuiIconV="4.90.0"][data-icon=image]:after{-webkit-mask:none;mask:none;background:var(--t-icon) no-repeat center / contain}[tuiIconV="4.90.0"][data-icon=font]:after{content:var(--t-icon);-webkit-mask:none;mask:none;background:none;font:1em/1 var(--tui-font-icon, inherit);text-align:center;text-transform:none}\n']
    }]
  }], null, {
    icon: [{
      type: Input
    }],
    background: [{
      type: Input
    }]
  });
})();
var TuiIconPipe = class _TuiIconPipe {
  constructor() {
    this.transform = tuiInjectIconResolver();
  }
  static {
    this.ɵfac = function TuiIconPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiIconPipe)();
    };
  }
  static {
    this.ɵpipe = ɵɵdefinePipe({
      name: "tuiIcon",
      type: _TuiIconPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiIconPipe, [{
    type: Pipe,
    args: [{
      standalone: true,
      name: "tuiIcon"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-native-validator.mjs
var TuiNativeValidator = class _TuiNativeValidator {
  constructor() {
    this.el = tuiInjectElement();
    this.control$ = new BehaviorSubject(null);
    this.sub = this.control$.pipe(switchMap((control) => control?.events || of(null)), delay(0), tuiZonefree(), tuiTakeUntilDestroyed()).subscribe(() => this.handleValidation());
    this.tuiNativeValidator = "Invalid";
  }
  validate(control) {
    this.control$.next(control);
    return null;
  }
  handleValidation() {
    const invalid = !!this.control$.value?.touched && this.control$.value?.invalid;
    this.el.closest("tui-textfield")?.classList.toggle("tui-invalid", invalid);
    this.el.setCustomValidity?.(invalid ? this.tuiNativeValidator : "");
  }
  static {
    this.ɵfac = function TuiNativeValidator_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiNativeValidator)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiNativeValidator,
      selectors: [["", "tuiNativeValidator", ""]],
      hostBindings: function TuiNativeValidator_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("focusout", function TuiNativeValidator_focusout_HostBindingHandler() {
            return ctx.handleValidation();
          });
        }
      },
      inputs: {
        tuiNativeValidator: "tuiNativeValidator"
      },
      features: [ɵɵProvidersFeature([tuiProvide(NG_VALIDATORS, _TuiNativeValidator, true)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiNativeValidator, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiNativeValidator]",
      providers: [tuiProvide(NG_VALIDATORS, TuiNativeValidator, true)],
      host: {
        "(focusout)": "handleValidation()"
      }
    }]
  }], null, {
    tuiNativeValidator: [{
      type: Input
    }]
  });
})();

// node_modules/@ng-web-apis/resize-observer/fesm2022/ng-web-apis-resize-observer.mjs
var SafeObserver = typeof ResizeObserver !== "undefined" ? ResizeObserver : class {
  observe() {
  }
  unobserve() {
  }
  disconnect() {
  }
};
var WA_RESIZE_OPTION_BOX_DEFAULT = "content-box";
var RESIZE_OPTION_BOX_DEFAULT = WA_RESIZE_OPTION_BOX_DEFAULT;
var WA_RESIZE_OPTION_BOX = new InjectionToken("[WA_RESIZE_OPTION_BOX]", {
  providedIn: "root",
  factory: () => RESIZE_OPTION_BOX_DEFAULT
});
var RESIZE_OPTION_BOX = WA_RESIZE_OPTION_BOX;
var WaResizeObserverService = class _WaResizeObserverService extends Observable {
  constructor() {
    const nativeElement = inject(ElementRef).nativeElement;
    const box = inject(RESIZE_OPTION_BOX);
    super((subscriber) => {
      const observer = new SafeObserver((entries) => subscriber.next(entries));
      observer.observe(nativeElement, {
        box
      });
      return () => {
        observer.disconnect();
      };
    });
  }
  static ɵfac = function WaResizeObserverService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaResizeObserverService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _WaResizeObserverService,
    factory: _WaResizeObserverService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaResizeObserverService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var WaResizeObserver = class _WaResizeObserver {
  waResizeObserver = inject(WaResizeObserverService);
  box = RESIZE_OPTION_BOX_DEFAULT;
  static ɵfac = function WaResizeObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaResizeObserver)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _WaResizeObserver,
    selectors: [["", "waResizeObserver", ""]],
    inputs: {
      waResizeBox: [0, "box", "waResizeBox"]
    },
    outputs: {
      waResizeObserver: "waResizeObserver"
    },
    features: [ɵɵProvidersFeature([WaResizeObserverService, {
      provide: RESIZE_OPTION_BOX,
      useFactory: () => inject(ElementRef).nativeElement.getAttribute("waResizeBox") || RESIZE_OPTION_BOX_DEFAULT
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaResizeObserver, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[waResizeObserver]",
      inputs: ["waResizeBox: box"],
      outputs: ["waResizeObserver"],
      providers: [WaResizeObserverService, {
        provide: RESIZE_OPTION_BOX,
        useFactory: () => inject(ElementRef).nativeElement.getAttribute("waResizeBox") || RESIZE_OPTION_BOX_DEFAULT
      }]
    }]
  }], null, null);
})();
var WA_RESIZE_OBSERVER_SUPPORT = new InjectionToken("[WA_RESIZE_OBSERVER_SUPPORT]", {
  providedIn: "root",
  factory: () => !!inject(WA_WINDOW).ResizeObserver
});

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-textfield.mjs
var _c09 = ["ghost"];
var _c14 = ["vcr"];
var _c2 = [[["input"]], [["select"]], [["textarea"]], [["label"]], "*", [["tui-icon"]]];
var _c3 = ["input", "select", "textarea", "label", "*", "tui-icon"];
var _c4 = (a0) => ({
  $implicit: a0
});
function TuiTextfieldComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TuiTextfieldComponent_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 7);
    ɵɵlistener("click", function TuiTextfieldComponent_button_8_Template_button_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.accessor == null ? null : ctx_r1.accessor.setValue(null));
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("iconStart", ctx_r1.icons.close);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r1.clear(), " ");
  }
}
function TuiTextfieldComponent_span_12_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r3 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r3, " ");
  }
}
function TuiTextfieldComponent_span_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 8);
    ɵɵtemplate(1, TuiTextfieldComponent_span_12_ng_container_1_Template, 2, 1, "ng-container", 9);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r1.content)("polymorpheusOutletContext", ɵɵpureFunction1(2, _c4, ctx_r1.control == null ? null : ctx_r1.control.value));
  }
}
function TuiTextfieldComponent_input_13_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "input", 10, 1);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("value", ctx_r1.computedFiller());
  }
}
var _c5 = (a0) => [a0];
function TuiSelect_option_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "option", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.placeholder, "\n");
  }
}
function TuiSelect_ng_template_1_option_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "option", 4);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    ɵɵproperty("value", item_r2);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", item_r2, " ");
  }
}
function TuiSelect_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TuiSelect_ng_template_1_option_0_Template, 2, 2, "option", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngForOf", ɵɵpureFunction1(1, _c5, ctx_r0.stringified));
  }
}
function TuiTextfieldItemComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate(text_r1);
  }
}
var _c6 = [[["label"]], [["input"]], [["select"]], "*", [["tui-icon"]]];
var _c7 = ["label", "input", "select", "*", "tui-icon"];
var _c8 = (a0, a1) => ({
  item: a0,
  index: a1
});
function TuiTextfieldMultiComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TuiTextfieldMultiComponent_tui_scroll_controls_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "tui-scroll-controls", 11);
  }
}
function TuiTextfieldMultiComponent_5_ng_template_0_Template(rf, ctx) {
}
function TuiTextfieldMultiComponent_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TuiTextfieldMultiComponent_5_ng_template_0_Template, 0, 0, "ng-template", 12);
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const index_r2 = ctx.index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵproperty("polymorpheusOutlet", ctx_r2.component)("polymorpheusOutletContext", ɵɵpureFunction1(5, _c4, ɵɵpureFunction2(2, _c8, item_r1, index_r2)));
  }
}
function TuiTextfieldMultiComponent_span_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 13);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r2.placeholder, " ");
  }
}
function TuiTextfieldMultiComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 14);
    ɵɵlistener("click", function TuiTextfieldMultiComponent_button_13_Template_button_click_0_listener() {
      ɵɵrestoreView(_r4);
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.accessor == null ? null : ctx_r2.accessor.setValue([]));
    });
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵproperty("iconStart", ctx_r2.icons.close);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r2.clear(), " ");
  }
}
function TuiTextfieldMultiComponent_span_17_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const text_r5 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r5, " ");
  }
}
function TuiTextfieldMultiComponent_span_17_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 15);
    ɵɵtemplate(1, TuiTextfieldMultiComponent_span_17_ng_container_1_Template, 2, 1, "ng-container", 16);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r2.content)("polymorpheusOutletContext", ɵɵpureFunction1(2, _c4, ctx_r2.control == null ? null : ctx_r2.control.value));
  }
}
var DEFAULT = {
  appearance: "textfield",
  size: "l",
  cleaner: true
};
var TUI_TEXTFIELD_OPTIONS = new InjectionToken(ngDevMode ? "TUI_TEXTFIELD_OPTIONS" : "", {
  factory: () => ({
    appearance: signal(DEFAULT.appearance),
    size: signal(DEFAULT.size),
    cleaner: signal(DEFAULT.cleaner)
  })
});
function tuiTextfieldOptionsProvider(options) {
  return {
    provide: TUI_TEXTFIELD_OPTIONS,
    deps: [[new Optional(), new SkipSelf(), TUI_TEXTFIELD_OPTIONS]],
    useFactory: (parent) => __spreadValues({
      appearance: signal(parent?.appearance() ?? DEFAULT.appearance),
      size: signal(parent?.size() ?? DEFAULT.size),
      cleaner: signal(parent?.cleaner() ?? DEFAULT.cleaner)
    }, options)
  };
}
var TuiTextfieldOptionsDirective = class _TuiTextfieldOptionsDirective {
  constructor() {
    this.options = inject(TUI_TEXTFIELD_OPTIONS, {
      skipSelf: true
    });
    this.appearance = signal(this.options.appearance());
    this.size = signal(this.options.size());
    this.cleaner = signal(this.options.cleaner());
  }
  set tuiTextfieldAppearance(appearance) {
    this.appearance.set(appearance);
  }
  set tuiTextfieldSize(size) {
    this.size.set(size);
  }
  set tuiTextfieldCleaner(enabled) {
    this.cleaner.set(enabled);
  }
  static {
    this.ɵfac = function TuiTextfieldOptionsDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldOptionsDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldOptionsDirective,
      selectors: [["", "tuiTextfieldAppearance", ""], ["", "tuiTextfieldSize", ""], ["", "tuiTextfieldCleaner", ""]],
      inputs: {
        tuiTextfieldAppearance: "tuiTextfieldAppearance",
        tuiTextfieldSize: "tuiTextfieldSize",
        tuiTextfieldCleaner: "tuiTextfieldCleaner"
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_TEXTFIELD_OPTIONS, _TuiTextfieldOptionsDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldOptionsDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiTextfieldAppearance],[tuiTextfieldSize],[tuiTextfieldCleaner]",
      providers: [tuiProvide(TUI_TEXTFIELD_OPTIONS, TuiTextfieldOptionsDirective)]
    }]
  }], null, {
    tuiTextfieldAppearance: [{
      type: Input
    }],
    tuiTextfieldSize: [{
      type: Input
    }],
    tuiTextfieldCleaner: [{
      type: Input
    }]
  });
})();
var TuiSelectLike = class _TuiSelectLike {
  constructor() {
    this.el = tuiInjectElement();
    this.isAndroid = inject(TUI_IS_ANDROID);
    this.options = inject(TUI_TEXTFIELD_OPTIONS);
  }
  clear() {
    this.el.value = "";
  }
  prevent(event) {
    if (!this.isAndroid) {
      return;
    }
    event.preventDefault();
    this.el.focus();
  }
  static {
    this.ɵfac = function TuiSelectLike_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSelectLike)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiSelectLike,
      selectors: [["", "tuiSelectLike", ""]],
      hostAttrs: ["tuiSelectLike", "", "inputmode", "none", "spellcheck", "false", "autocomplete", "off"],
      hostBindings: function TuiSelectLike_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("beforeinput", function TuiSelectLike_beforeinput_HostBindingHandler($event) {
            return ctx.options.cleaner() && $event.inputType.includes("delete") || $event.preventDefault();
          })("input.capture", function TuiSelectLike_input_capture_HostBindingHandler($event) {
            return ($event.inputType == null ? null : $event.inputType.includes("delete")) && ctx.clear();
          })("keydown.backspace", function TuiSelectLike_keydown_backspace_HostBindingHandler() {
            return ctx.options.cleaner() && ctx.clear();
          })("keydown.delete", function TuiSelectLike_keydown_delete_HostBindingHandler() {
            return ctx.options.cleaner() && ctx.clear();
          })("mousedown", function TuiSelectLike_mousedown_HostBindingHandler($event) {
            return ctx.prevent($event);
          });
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSelectLike, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiSelectLike]",
      host: {
        tuiSelectLike: "",
        inputmode: "none",
        spellcheck: "false",
        autocomplete: "off",
        // Click on cleaner icon does not trigger `beforeinput` event --> handle all kind of deletion in input event
        "(beforeinput)": 'options.cleaner() && $event.inputType.includes("delete") || $event.preventDefault()',
        "(input.capture)": '$event.inputType?.includes("delete") && clear()',
        "(keydown.backspace)": "options.cleaner() && clear()",
        "(keydown.delete)": "options.cleaner() && clear()",
        // Hide Android text select handle (bubble marker below transparent caret)
        "(mousedown)": "prevent($event)"
      }
    }]
  }], null, null);
})();
var TUI_TEXTFIELD_ACCESSOR = new InjectionToken(ngDevMode ? "TUI_TEXTFIELD_ACCESSOR" : "");
function tuiAsTextfieldAccessor(accessor) {
  return tuiProvide(TUI_TEXTFIELD_ACCESSOR, accessor);
}
var TuiTextfieldDropdownDirective = class _TuiTextfieldDropdownDirective {
  constructor() {
    this.directive = inject(TuiDropdownDirective);
    this.directive.tuiDropdown = inject(TemplateRef);
    if (isPlatformBrowser(inject(PLATFORM_ID)) && this.directive.el.matches(":focus-within")) {
      this.directive.toggle(true);
    }
  }
  ngOnDestroy() {
    this.directive.tuiDropdown = null;
  }
  static {
    this.ɵfac = function TuiTextfieldDropdownDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldDropdownDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldDropdownDirective,
      selectors: [["ng-template", "tuiTextfieldDropdown", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldDropdownDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiTextfieldDropdown]"
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiWithTextfieldDropdown = class _TuiWithTextfieldDropdown {
  static {
    this.ɵfac = function TuiWithTextfieldDropdown_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithTextfieldDropdown)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithTextfieldDropdown
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithTextfieldDropdown, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, null);
})();
var TuiTextfieldBaseComponent = class _TuiTextfieldBaseComponent {
  constructor() {
    this.filler = signal("");
    this.autoId = tuiInjectId();
    this.focusedIn = tuiFocusedIn(tuiInjectElement());
    this.contentReady$ = new ReplaySubject(1);
    this.inputQuery = signal(void 0);
    this.auxiliaryQuery = EMPTY_QUERY;
    this.open = tuiDropdownOpen();
    this.dropdown = inject(TuiDropdownDirective);
    this.dropdownOpen = inject(TuiDropdownOpen);
    this.icons = inject(TUI_COMMON_ICONS);
    this.clear = toSignal(inject(TUI_CLEAR_WORD));
    this.computedFiller = computed((value = this.value()) => {
      const filler = this.filler();
      if (filler.length <= value.length) {
        return "";
      }
      const input = this.inputQuery()?.nativeElement ?? this.input?.nativeElement ?? this.el;
      return input.matches('[dir="rtl"] :scope') ? filler.slice(0, filler.length - value.length) + value : value + filler.slice(value.length);
    });
    this.showFiller = computed(() => this.focused() && !!this.computedFiller() && (!!this.value() || !this.input?.nativeElement.placeholder));
    this.focused = computed(() => this.open() || this.focusedIn());
    this.options = inject(TUI_TEXTFIELD_OPTIONS);
    this.el = tuiInjectElement();
    this.value = tuiValue(this.inputQuery);
    this.auxiliaries = toSignal(this.contentReady$.pipe(take(1), switchMap(() => tuiQueryListChanges(this.auxiliaryQuery)), startWith([])), {
      requireSync: true
    });
  }
  set fillerSetter(filler) {
    this.filler.set(filler);
  }
  get id() {
    return this.input?.nativeElement.id || this.autoId;
  }
  get size() {
    return this.options.size();
  }
  get disabled() {
    return this.cva?.disabled() ?? this.control?.disabled ?? this.input?.nativeElement?.disabled ?? false;
  }
  ngAfterContentChecked() {
    this.contentReady$.next(true);
    this.inputQuery.set(this._input);
  }
  handleOption(option) {
    this.accessor?.setValue(option);
    this.open.set(false);
  }
  get interactiveInput() {
    return this._input ?? this.input;
  }
  get hasLabel() {
    return Boolean(this.label?.nativeElement?.childNodes.length);
  }
  onResize({
    contentRect
  }) {
    this.el.style.setProperty("--t-side", tuiPx(contentRect.width));
  }
  // Click on ::before,::after pseudo-elements ([iconStart] / [iconEnd])
  onIconClick() {
    this.interactiveInput?.nativeElement.focus();
    if (!this.dropdownOpen.tuiDropdownEnabled || this.interactiveInput?.nativeElement.matches("input:read-only,textarea:read-only")) {
      return;
    }
    this.open.update((open) => !open);
    try {
      this.interactiveInput?.nativeElement.showPicker?.();
    } catch {
    }
  }
  onScroll(element) {
    if (this.input?.nativeElement === element) {
      this.ghost?.nativeElement.scrollTo({
        left: this.input.nativeElement.scrollLeft
      });
    }
  }
  static {
    this.ɵfac = function TuiTextfieldBaseComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldBaseComponent)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldBaseComponent,
      contentQueries: function TuiTextfieldBaseComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TuiLabel, 5, ElementRef)(dirIndex, TuiTextfieldBase, 5, ElementRef)(dirIndex, TUI_TEXTFIELD_ACCESSOR, 5)(dirIndex, NgControl, 5)(dirIndex, TuiControl, 5)(dirIndex, TuiTextfieldBase, 7, ElementRef)(dirIndex, TUI_AUXILIARY, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.label = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._input = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.accessor = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.control = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.cva = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.input = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.auxiliaryQuery = _t);
        }
      },
      viewQuery: function TuiTextfieldBaseComponent_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(_c09, 5)(_c14, 7, ViewContainerRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.ghost = _t.first);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.vcr = _t.first);
        }
      },
      inputs: {
        content: "content",
        fillerSetter: [0, "filler", "fillerSetter"]
      },
      standalone: false
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldBaseComponent, [{
    type: Directive
  }], null, {
    ghost: [{
      type: ViewChild,
      args: ["ghost"]
    }],
    label: [{
      type: ContentChild,
      args: [forwardRef(() => TuiLabel), {
        read: ElementRef
      }]
    }],
    auxiliaryQuery: [{
      type: ContentChildren,
      args: [TUI_AUXILIARY, {
        descendants: true
      }]
    }],
    _input: [{
      type: ContentChild,
      args: [forwardRef(() => TuiTextfieldBase), {
        read: ElementRef,
        descendants: true
      }]
    }],
    vcr: [{
      type: ViewChild,
      args: ["vcr", {
        read: ViewContainerRef,
        static: true
      }]
    }],
    accessor: [{
      type: ContentChild,
      args: [TUI_TEXTFIELD_ACCESSOR, {
        descendants: true
      }]
    }],
    control: [{
      type: ContentChild,
      args: [NgControl, {
        descendants: true
      }]
    }],
    cva: [{
      type: ContentChild,
      args: [TuiControl, {
        descendants: true
      }]
    }],
    input: [{
      type: ContentChild,
      args: [forwardRef(() => TuiTextfieldBase), {
        read: ElementRef,
        static: true
      }]
    }],
    content: [{
      type: Input
    }],
    fillerSetter: [{
      type: Input,
      args: ["filler"]
    }]
  });
})();
var TuiTextfieldComponent = class _TuiTextfieldComponent extends TuiTextfieldBaseComponent {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiTextfieldComponent_BaseFactory;
      return function TuiTextfieldComponent_Factory(__ngFactoryType__) {
        return (ɵTuiTextfieldComponent_BaseFactory || (ɵTuiTextfieldComponent_BaseFactory = ɵɵgetInheritedFactory(_TuiTextfieldComponent)))(__ngFactoryType__ || _TuiTextfieldComponent);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiTextfieldComponent,
      selectors: [["tui-textfield", 3, "multi", ""]],
      hostAttrs: ["tuiTextfieldV", "4.90.0"],
      hostVars: 7,
      hostBindings: function TuiTextfieldComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click.self.prevent", function TuiTextfieldComponent_click_self_prevent_HostBindingHandler() {
            return 0;
          })("pointerdown.self.prevent", function TuiTextfieldComponent_pointerdown_self_prevent_HostBindingHandler() {
            return ctx.onIconClick();
          })("scroll.capture.zoneless", function TuiTextfieldComponent_scroll_capture_zoneless_HostBindingHandler($event) {
            return ctx.onScroll($event.target);
          })("tuiActiveZoneChange", function TuiTextfieldComponent_tuiActiveZoneChange_HostBindingHandler($event) {
            return !$event && (ctx.cva == null ? null : ctx.cva.onTouched());
          });
        }
        if (rf & 2) {
          ɵɵattribute("data-size", ctx.options.size());
          ɵɵclassProp("_with-label", ctx.hasLabel)("_with-template", ctx.content && (ctx.control == null ? null : ctx.control.value) != null)("_disabled", ctx.disabled);
        }
      },
      features: [ɵɵProvidersFeature([tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiAsDataListHost(_TuiTextfieldComponent)]), ɵɵHostDirectivesFeature([TuiDropdownDirective, TuiDropdownFixed, TuiTransitioned, TuiWithDropdownOpen, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent, TuiWithTextfieldDropdown]), ɵɵInheritDefinitionFeature],
      ngContentSelectors: _c3,
      decls: 14,
      vars: 6,
      consts: [["vcr", ""], ["ghost", ""], [4, "ngIf"], [1, "t-content", 3, "click", "pointerdown.zoneless.prevent", "waResizeObserver"], ["appearance", "icon", "size", "xs", "tabindex", "-1", "tuiIconButton", "", "type", "button", "class", "t-clear", 3, "iconStart", "click", 4, "ngIf"], ["class", "t-template", 4, "ngIf"], ["aria-hidden", "true", "disabled", "", "class", "t-filler", 3, "value", 4, "ngIf"], ["appearance", "icon", "size", "xs", "tabindex", "-1", "tuiIconButton", "", "type", "button", 1, "t-clear", 3, "click", "iconStart"], [1, "t-template"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"], ["aria-hidden", "true", "disabled", "", 1, "t-filler", 3, "value"]],
      template: function TuiTextfieldComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef(_c2);
          ɵɵtemplate(0, TuiTextfieldComponent_ng_container_0_Template, 1, 0, "ng-container", 2);
          ɵɵpipe(1, "async");
          ɵɵprojection(2);
          ɵɵprojection(3, 1);
          ɵɵprojection(4, 2);
          ɵɵprojection(5, 3);
          ɵɵelementStart(6, "span", 3);
          ɵɵlistener("click", function TuiTextfieldComponent_Template_span_click_6_listener() {
            return ctx.interactiveInput == null ? null : ctx.interactiveInput.nativeElement == null ? null : ctx.interactiveInput.nativeElement.focus();
          })("pointerdown.zoneless.prevent", function TuiTextfieldComponent_Template_span_pointerdown_zoneless_prevent_6_listener() {
            return 0;
          })("waResizeObserver", function TuiTextfieldComponent_Template_span_waResizeObserver_6_listener($event) {
            return $event[0] && ctx.onResize($event[0]);
          });
          ɵɵprojection(7, 4);
          ɵɵtemplate(8, TuiTextfieldComponent_button_8_Template, 2, 2, "button", 4);
          ɵɵelementContainer(9, null, 0);
          ɵɵprojection(11, 5);
          ɵɵelementEnd();
          ɵɵtemplate(12, TuiTextfieldComponent_span_12_Template, 2, 4, "span", 5)(13, TuiTextfieldComponent_input_13_Template, 2, 1, "input", 6);
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", ɵɵpipeBind1(1, 4, ctx.control == null ? null : ctx.control.control == null ? null : ctx.control.control.valueChanges));
          ɵɵadvance(8);
          ɵɵproperty("ngIf", ctx.options.cleaner());
          ɵɵadvance(4);
          ɵɵproperty("ngIf", (ctx.control == null ? null : ctx.control.value) != null);
          ɵɵadvance();
          ɵɵproperty("ngIf", ctx.showFiller());
        }
      },
      dependencies: [AsyncPipe, NgIf, PolymorpheusOutlet, TuiButton, WaResizeObserver],
      styles: ['[tuiTextfieldV="4.90.0"]{scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--t-height: var(--tui-height-l);--t-padding: var(--tui-padding-l);--t-label-y: -.75rem;--t-label-font: var(--tui-font-text-s);--t-end: 0rem;--t-start: 0rem;position:relative;display:flex;flex-wrap:wrap;align-items:center;cursor:pointer;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-font-text-ui-m);line-height:1.25rem;box-sizing:border-box;gap:0 .25rem;isolation:isolate}[tuiTextfieldV="4.90.0"]::-webkit-scrollbar,[tuiTextfieldV="4.90.0"]::-webkit-scrollbar-thumb{display:none}[tuiTextfieldV="4.90.0"][tuiIcons]:read-only{color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2.25rem}[tuiTextfieldV="4.90.0"][style*="--t-icon-end:"]{--t-end: 2.25rem}[tuiTextfieldV="4.90.0"][tuiIcons]:after{position:relative;block-size:auto;align-self:stretch;border-inline-start:var(--t-padding) solid transparent;border-inline-end:var(--t-padding) solid transparent;margin:0 calc(-1 * var(--t-padding))}[tuiTextfieldV="4.90.0"]::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}[tuiTextfieldV="4.90.0"] label,[tuiTextfieldV="4.90.0"]>.t-content,[tuiTextfieldV="4.90.0"]>.t-template{pointer-events:none}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{font:inherit;resize:none;outline:none;padding-block-start:1.125rem;padding-block-end:1.125rem}[tuiTextfieldV="4.90.0"] input[inputmode=none],[tuiTextfieldV="4.90.0"] select[inputmode=none],[tuiTextfieldV="4.90.0"] textarea[inputmode=none]{caret-color:transparent}[tuiTextfieldV="4.90.0"] input::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] input::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}[tuiTextfieldV="4.90.0"][data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);border-radius:var(--tui-radius-m);gap:0;font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-end:"]{--t-end: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s]:before{margin-inline-end:.625rem;font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s]:after{margin-inline-end:calc(-1 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding));font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s] input,[tuiTextfieldV="4.90.0"][data-size=s] select,[tuiTextfieldV="4.90.0"][data-size=s] textarea{padding-block-start:.5rem;padding-block-end:.5rem}[tuiTextfieldV="4.90.0"][data-size=s]>.t-content{margin-inline-end:-.25rem}[tuiTextfieldV="4.90.0"][data-size=m]{--t-height: var(--tui-height-m);--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-font-text-xs);--t-label-y: -.5625rem;border-radius:var(--tui-radius-m);font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-end:"]{--t-end: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m]:before{margin-inline-start:-.125rem;margin-inline-end:.125rem}[tuiTextfieldV="4.90.0"][data-size=m]:after{margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-.125rem - var(--t-padding))}[tuiTextfieldV="4.90.0"][data-size=m] input,[tuiTextfieldV="4.90.0"][data-size=m] select,[tuiTextfieldV="4.90.0"][data-size=m] textarea{padding-block-start:.875rem;padding-block-end:.875rem}[tuiTextfieldV="4.90.0"][data-size=m]>.t-content{margin-inline-end:-.125rem}[tuiTextfieldV="4.90.0"][data-size=l]{--t-label: -.7rem}[tuiTextfieldV="4.90.0"][tuiIcons]:hover{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(input:read-only):not([multi]),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(textarea:read-only),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(select[data-mode~=readonly]){color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"]:before{z-index:1;margin-inline-end:.5rem;pointer-events:none}[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):before,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):after,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip]))>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]._disabled:before,[tuiTextfieldV="4.90.0"]._disabled:after,[tuiTextfieldV="4.90.0"]._disabled>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]:has(label:not(:empty))>.t-template,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) input:not([type=range]),[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) select:defined,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]._with-label>.t-template,[tuiTextfieldV="4.90.0"]._with-label input:not([type=range]),[tuiTextfieldV="4.90.0"]._with-label select:defined,[tuiTextfieldV="4.90.0"]._with-label textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]>.t-template,[tuiTextfieldV="4.90.0"] input:defined,[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;-webkit-appearance:none;appearance:none;box-sizing:border-box;border-width:0;padding-inline-start:calc(var(--t-start, 0rem) + var(--t-padding));padding-inline-end:calc(var(--t-end, 0rem) + var(--t-side) + var(--t-padding))}[tuiTextfieldV="4.90.0"]>.t-template{display:flex;align-items:center;border-radius:inherit;color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"]._with-template input:first-of-type,[tuiTextfieldV="4.90.0"]._with-template select,[tuiTextfieldV="4.90.0"]._with-template textarea{color:transparent!important}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{background:none;border-radius:inherit}[tuiTextfieldV="4.90.0"] input:not([type=range]),[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{pointer-events:auto}[tuiTextfieldV="4.90.0"] input:not([type=range]):not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] select:defined:not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] textarea:defined:not(select):read-only~.t-filler{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label,[tuiTextfieldV="4.90.0"] select:defined:disabled~label,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content>tui-icon{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown)~label{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label{color:var(--tui-text-negative)}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear{display:flex}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}@supports (-webkit-touch-callout: none){[tuiTextfieldV="4.90.0"] input:not([type=range])._ios-fix,[tuiTextfieldV="4.90.0"] select:defined._ios-fix,[tuiTextfieldV="4.90.0"] textarea:defined._ios-fix{position:fixed;left:1000rem}}[tuiTextfieldV="4.90.0"] [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;flex:1;align-self:flex-start;font-size:inherit;line-height:var(--t-height);letter-spacing:calc((max(1em,.75rem) - 1em)*.4);transition-duration:inherit}[tuiTextfieldV="4.90.0"] label:defined,[tuiTextfieldV="4.90.0"] input:defined::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined::placeholder,[tuiTextfieldV="4.90.0"] select:defined._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] select:not([data-mode~=readonly]){cursor:pointer}[tuiTextfieldV="4.90.0"] select option[value=""]:disabled{color:transparent}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option{background-color:var(--tui-background-elevation-3)}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option:not(:disabled){color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"] button,[tuiTextfieldV="4.90.0"] a{pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:inherit;margin-inline-start:auto;isolation:isolate;border-radius:inherit}[tuiTextfieldV="4.90.0"]>.t-content>tui-icon{pointer-events:auto}[tuiTextfieldV="4.90.0"] textarea~.t-content{min-inline-size:.5rem}[tuiTextfieldV="4.90.0"] .t-clear{z-index:1;display:none;pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-filler:defined{pointer-events:none;color:var(--tui-text-tertiary);opacity:1}[tuiTextfieldV="4.90.0"] [tuiFluidTypography]{font-weight:700}[tuiTextfieldV="4.90.0"] [tuiSelectLike]:not(:read-only){cursor:pointer}[tuiTextfieldV="4.90.0"]:has(input[type=tel]){direction:ltr}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-textfield:not([multi])",
      imports: [AsyncPipe, NgIf, PolymorpheusOutlet, TuiButton, WaResizeObserver],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiAsDataListHost(TuiTextfieldComponent)],
      hostDirectives: [TuiDropdownDirective, TuiDropdownFixed, TuiTransitioned, TuiWithDropdownOpen, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent, TuiWithTextfieldDropdown],
      host: {
        tuiTextfieldV: TUI_VERSION,
        "[attr.data-size]": "options.size()",
        "[class._with-label]": "hasLabel",
        "[class._with-template]": "content && control?.value != null",
        "[class._disabled]": "disabled",
        "(click.self.prevent)": "0",
        "(pointerdown.self.prevent)": "onIconClick()",
        "(scroll.capture.zoneless)": "onScroll($event.target)",
        "(tuiActiveZoneChange)": "!$event && cva?.onTouched()"
      },
      template: '<ng-container *ngIf="control?.control?.valueChanges | async" />\n<ng-content select="input" />\n<ng-content select="select" />\n<ng-content select="textarea" />\n<ng-content select="label" />\n<span\n    class="t-content"\n    (click)="interactiveInput?.nativeElement?.focus()"\n    (pointerdown.zoneless.prevent)="(0)"\n    (waResizeObserver)="$event[0] && onResize($event[0])"\n>\n    <ng-content />\n    <button\n        *ngIf="options.cleaner()"\n        appearance="icon"\n        size="xs"\n        tabindex="-1"\n        tuiIconButton\n        type="button"\n        class="t-clear"\n        [iconStart]="icons.close"\n        (click)="accessor?.setValue(null)"\n    >\n        {{ clear() }}\n    </button>\n    <ng-container #vcr />\n    <ng-content select="tui-icon" />\n</span>\n<span\n    *ngIf="control?.value != null"\n    class="t-template"\n>\n    <ng-container *polymorpheusOutlet="content as text; context: {$implicit: control?.value}">\n        {{ text }}\n    </ng-container>\n</span>\n<input\n    *ngIf="showFiller()"\n    #ghost\n    aria-hidden="true"\n    disabled\n    class="t-filler"\n    [value]="computedFiller()"\n/>\n',
      styles: ['[tuiTextfieldV="4.90.0"]{scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--t-height: var(--tui-height-l);--t-padding: var(--tui-padding-l);--t-label-y: -.75rem;--t-label-font: var(--tui-font-text-s);--t-end: 0rem;--t-start: 0rem;position:relative;display:flex;flex-wrap:wrap;align-items:center;cursor:pointer;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-font-text-ui-m);line-height:1.25rem;box-sizing:border-box;gap:0 .25rem;isolation:isolate}[tuiTextfieldV="4.90.0"]::-webkit-scrollbar,[tuiTextfieldV="4.90.0"]::-webkit-scrollbar-thumb{display:none}[tuiTextfieldV="4.90.0"][tuiIcons]:read-only{color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2.25rem}[tuiTextfieldV="4.90.0"][style*="--t-icon-end:"]{--t-end: 2.25rem}[tuiTextfieldV="4.90.0"][tuiIcons]:after{position:relative;block-size:auto;align-self:stretch;border-inline-start:var(--t-padding) solid transparent;border-inline-end:var(--t-padding) solid transparent;margin:0 calc(-1 * var(--t-padding))}[tuiTextfieldV="4.90.0"]::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}[tuiTextfieldV="4.90.0"] label,[tuiTextfieldV="4.90.0"]>.t-content,[tuiTextfieldV="4.90.0"]>.t-template{pointer-events:none}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{font:inherit;resize:none;outline:none;padding-block-start:1.125rem;padding-block-end:1.125rem}[tuiTextfieldV="4.90.0"] input[inputmode=none],[tuiTextfieldV="4.90.0"] select[inputmode=none],[tuiTextfieldV="4.90.0"] textarea[inputmode=none]{caret-color:transparent}[tuiTextfieldV="4.90.0"] input::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] input::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}[tuiTextfieldV="4.90.0"][data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);border-radius:var(--tui-radius-m);gap:0;font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-end:"]{--t-end: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s]:before{margin-inline-end:.625rem;font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s]:after{margin-inline-end:calc(-1 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding));font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s] input,[tuiTextfieldV="4.90.0"][data-size=s] select,[tuiTextfieldV="4.90.0"][data-size=s] textarea{padding-block-start:.5rem;padding-block-end:.5rem}[tuiTextfieldV="4.90.0"][data-size=s]>.t-content{margin-inline-end:-.25rem}[tuiTextfieldV="4.90.0"][data-size=m]{--t-height: var(--tui-height-m);--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-font-text-xs);--t-label-y: -.5625rem;border-radius:var(--tui-radius-m);font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-end:"]{--t-end: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m]:before{margin-inline-start:-.125rem;margin-inline-end:.125rem}[tuiTextfieldV="4.90.0"][data-size=m]:after{margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-.125rem - var(--t-padding))}[tuiTextfieldV="4.90.0"][data-size=m] input,[tuiTextfieldV="4.90.0"][data-size=m] select,[tuiTextfieldV="4.90.0"][data-size=m] textarea{padding-block-start:.875rem;padding-block-end:.875rem}[tuiTextfieldV="4.90.0"][data-size=m]>.t-content{margin-inline-end:-.125rem}[tuiTextfieldV="4.90.0"][data-size=l]{--t-label: -.7rem}[tuiTextfieldV="4.90.0"][tuiIcons]:hover{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(input:read-only):not([multi]),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(textarea:read-only),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(select[data-mode~=readonly]){color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"]:before{z-index:1;margin-inline-end:.5rem;pointer-events:none}[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):before,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):after,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip]))>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]._disabled:before,[tuiTextfieldV="4.90.0"]._disabled:after,[tuiTextfieldV="4.90.0"]._disabled>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]:has(label:not(:empty))>.t-template,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) input:not([type=range]),[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) select:defined,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]._with-label>.t-template,[tuiTextfieldV="4.90.0"]._with-label input:not([type=range]),[tuiTextfieldV="4.90.0"]._with-label select:defined,[tuiTextfieldV="4.90.0"]._with-label textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]>.t-template,[tuiTextfieldV="4.90.0"] input:defined,[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;-webkit-appearance:none;appearance:none;box-sizing:border-box;border-width:0;padding-inline-start:calc(var(--t-start, 0rem) + var(--t-padding));padding-inline-end:calc(var(--t-end, 0rem) + var(--t-side) + var(--t-padding))}[tuiTextfieldV="4.90.0"]>.t-template{display:flex;align-items:center;border-radius:inherit;color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"]._with-template input:first-of-type,[tuiTextfieldV="4.90.0"]._with-template select,[tuiTextfieldV="4.90.0"]._with-template textarea{color:transparent!important}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{background:none;border-radius:inherit}[tuiTextfieldV="4.90.0"] input:not([type=range]),[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{pointer-events:auto}[tuiTextfieldV="4.90.0"] input:not([type=range]):not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] select:defined:not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] textarea:defined:not(select):read-only~.t-filler{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label,[tuiTextfieldV="4.90.0"] select:defined:disabled~label,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content>tui-icon{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown)~label{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label{color:var(--tui-text-negative)}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear{display:flex}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}@supports (-webkit-touch-callout: none){[tuiTextfieldV="4.90.0"] input:not([type=range])._ios-fix,[tuiTextfieldV="4.90.0"] select:defined._ios-fix,[tuiTextfieldV="4.90.0"] textarea:defined._ios-fix{position:fixed;left:1000rem}}[tuiTextfieldV="4.90.0"] [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;flex:1;align-self:flex-start;font-size:inherit;line-height:var(--t-height);letter-spacing:calc((max(1em,.75rem) - 1em)*.4);transition-duration:inherit}[tuiTextfieldV="4.90.0"] label:defined,[tuiTextfieldV="4.90.0"] input:defined::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined::placeholder,[tuiTextfieldV="4.90.0"] select:defined._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] select:not([data-mode~=readonly]){cursor:pointer}[tuiTextfieldV="4.90.0"] select option[value=""]:disabled{color:transparent}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option{background-color:var(--tui-background-elevation-3)}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option:not(:disabled){color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"] button,[tuiTextfieldV="4.90.0"] a{pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:inherit;margin-inline-start:auto;isolation:isolate;border-radius:inherit}[tuiTextfieldV="4.90.0"]>.t-content>tui-icon{pointer-events:auto}[tuiTextfieldV="4.90.0"] textarea~.t-content{min-inline-size:.5rem}[tuiTextfieldV="4.90.0"] .t-clear{z-index:1;display:none;pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-filler:defined{pointer-events:none;color:var(--tui-text-tertiary);opacity:1}[tuiTextfieldV="4.90.0"] [tuiFluidTypography]{font-weight:700}[tuiTextfieldV="4.90.0"] [tuiSelectLike]:not(:read-only){cursor:pointer}[tuiTextfieldV="4.90.0"]:has(input[type=tel]){direction:ltr}\n']
    }]
  }], null, null);
})();
var TuiTextfieldBase = class _TuiTextfieldBase {
  constructor() {
    this.focused = signal(null);
    this.control = inject(NgControl, {
      optional: true
    });
    this.a = tuiAppearance(inject(TUI_TEXTFIELD_OPTIONS).appearance, {});
    this.s = tuiAppearanceState(null, {});
    this.m = tuiAppearanceMode(this.mode, {});
    this.f = tuiAppearanceFocus(computed(() => this.focused() ?? this.textfield.focused()), {});
    this.el = tuiInjectElement();
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.textfield = inject(TuiTextfieldComponent);
    this.dropdown = inject(TuiDropdownDirective);
    this.readOnly = false;
    this.invalid = null;
    this.value = tuiValue(this.el);
  }
  set focusedSetter(focused) {
    this.focused.set(focused);
  }
  set stateSetter(state2) {
    this.s.set(state2);
  }
  get mode() {
    if (this.readOnly) {
      return "readonly";
    }
    if (this.invalid === false) {
      return "valid";
    }
    if (this.invalid) {
      return "invalid";
    }
    return null;
  }
  // TODO: refactor to signal inputs after Angular update
  ngOnChanges() {
    this.m.set(this.mode);
  }
  setValue(value) {
    this.el.focus();
    this.el.select();
    if (value == null) {
      this.el.ownerDocument.execCommand("delete");
      this.el.value = "";
    } else {
      this.el.ownerDocument.execCommand("insertText", false, this.handlers.stringify()(value));
    }
  }
  static {
    this.ɵfac = function TuiTextfieldBase_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldBase)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldBase,
      hostAttrs: ["tuiTextfield", ""],
      hostVars: 5,
      hostBindings: function TuiTextfieldBase_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("input", function TuiTextfieldBase_input_HostBindingHandler() {
            return 0;
          })("focusin", function TuiTextfieldBase_focusin_HostBindingHandler() {
            return 0;
          })("focusout", function TuiTextfieldBase_focusout_HostBindingHandler() {
            return 0;
          });
        }
        if (rf & 2) {
          ɵɵdomProperty("id", ctx.textfield.id)("readOnly", ctx.readOnly);
          ɵɵattribute("role", ctx.dropdown._content() && !ctx.el.matches("select") ? "combobox" : null);
          ɵɵclassProp("_empty", ctx.value() === "");
        }
      },
      inputs: {
        readOnly: "readOnly",
        invalid: "invalid",
        focusedSetter: [0, "focused", "focusedSetter"],
        stateSetter: [0, "state", "stateSetter"]
      },
      features: [ɵɵProvidersFeature([tuiAsTextfieldAccessor(_TuiTextfieldBase), tuiProvide("tuiDropdownHost", ElementRef)]), ɵɵHostDirectivesFeature([TuiDropdownA11y]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldBase, [{
    type: Directive,
    args: [{
      standalone: true,
      providers: [tuiAsTextfieldAccessor(TuiTextfieldBase), tuiProvide("tuiDropdownHost", ElementRef)],
      hostDirectives: [TuiDropdownA11y],
      host: {
        tuiTextfield: "",
        "[attr.role]": 'dropdown._content() && !el.matches("select") ? "combobox" : null',
        "[id]": "textfield.id",
        "[readOnly]": "readOnly",
        "[class._empty]": 'value() === ""',
        "(input)": "0",
        "(focusin)": "0",
        "(focusout)": "0"
      }
    }]
  }], null, {
    readOnly: [{
      type: Input
    }],
    invalid: [{
      type: Input
    }],
    focusedSetter: [{
      type: Input,
      args: ["focused"]
    }],
    stateSetter: [{
      type: Input,
      args: ["state"]
    }]
  });
})();
var TuiTextfieldDirective = class _TuiTextfieldDirective extends TuiTextfieldBase {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiTextfieldDirective_BaseFactory;
      return function TuiTextfieldDirective_Factory(__ngFactoryType__) {
        return (ɵTuiTextfieldDirective_BaseFactory || (ɵTuiTextfieldDirective_BaseFactory = ɵɵgetInheritedFactory(_TuiTextfieldDirective)))(__ngFactoryType__ || _TuiTextfieldDirective);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldDirective,
      selectors: [["input", "tuiTextfield", "", 3, "tuiInputCard", "", 3, "tuiInputExpire", "", 3, "tuiInputCVC", ""]],
      features: [ɵɵProvidersFeature([tuiAsTextfieldAccessor(_TuiTextfieldDirective), tuiProvide(TuiTextfieldBase, _TuiTextfieldDirective)]), ɵɵHostDirectivesFeature([TuiNativeValidator, TuiAppearance]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      // TODO: Remove :not in v.5
      selector: "input[tuiTextfield]:not([tuiInputCard]):not([tuiInputExpire]):not([tuiInputCVC])",
      providers: [tuiAsTextfieldAccessor(TuiTextfieldDirective), tuiProvide(TuiTextfieldBase, TuiTextfieldDirective)],
      hostDirectives: [TuiNativeValidator, TuiAppearance]
    }]
  }], null, null);
})();
var TuiWithTextfield = class _TuiWithTextfield {
  static {
    this.ɵfac = function TuiWithTextfield_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithTextfield)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithTextfield,
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiTextfieldDirective,
        inputs: ["invalid", "invalid", "focused", "focused", "readOnly", "readOnly", "state", "state"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithTextfield, [{
    type: Directive,
    args: [{
      standalone: true,
      hostDirectives: [{
        directive: TuiTextfieldDirective,
        inputs: ["invalid", "focused", "readOnly", "state"]
      }]
    }]
  }], null, null);
})();
var TuiSelect = class _TuiSelect extends TuiTextfieldBase {
  constructor() {
    super(...arguments);
    this.nav = inject(WA_NAVIGATOR);
    this.doc = inject(DOCUMENT);
    this.placeholder = "";
  }
  setValue(value) {
    this.control?.control?.setValue(value);
    this.el.dispatchEvent(new Event("input", {
      bubbles: true
    }));
  }
  focus() {
    this.el.classList.add("_ios-fix");
    this.el.focus();
    this.el.classList.remove("_ios-fix");
  }
  get ariaLabel() {
    return this.doc.querySelector(`label[for="${this.el.id}"]`) ? null : this.el.getAttribute("aria-label") || this.placeholder;
  }
  get stringified() {
    return this.handlers.stringify()(this.control?.value ?? "");
  }
  async onCopy() {
    await this.nav.clipboard.writeText(this.stringified);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiSelect_BaseFactory;
      return function TuiSelect_Factory(__ngFactoryType__) {
        return (ɵTuiSelect_BaseFactory || (ɵTuiSelect_BaseFactory = ɵɵgetInheritedFactory(_TuiSelect)))(__ngFactoryType__ || _TuiSelect);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiSelect,
      selectors: [["select", "tuiTextfield", ""]],
      hostVars: 4,
      hostBindings: function TuiSelect_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("input", function TuiSelect_input_HostBindingHandler() {
            return 0;
          })("focusin", function TuiSelect_focusin_HostBindingHandler() {
            return 0;
          })("focusout", function TuiSelect_focusout_HostBindingHandler() {
            return 0;
          })("keydown.space.prevent", function TuiSelect_keydown_space_prevent_HostBindingHandler() {
            return 0;
          })("keydown.enter.prevent", function TuiSelect_keydown_enter_prevent_HostBindingHandler() {
            return 0;
          })("keydown.backspace", function TuiSelect_keydown_backspace_HostBindingHandler() {
            return ctx.setValue("");
          })("mousedown.prevent", function TuiSelect_mousedown_prevent_HostBindingHandler() {
            return ctx.focus();
          })("keydown.control.c", function TuiSelect_keydown_control_c_HostBindingHandler() {
            return ctx.onCopy();
          })("keydown.meta.c", function TuiSelect_keydown_meta_c_HostBindingHandler() {
            return ctx.onCopy();
          });
        }
        if (rf & 2) {
          ɵɵdomProperty("id", ctx.textfield.id);
          ɵɵattribute("aria-label", ctx.ariaLabel);
          ɵɵclassProp("_empty", ctx.stringified === "");
        }
      },
      inputs: {
        placeholder: "placeholder"
      },
      features: [ɵɵProvidersFeature([tuiAsTextfieldAccessor(_TuiSelect)]), ɵɵHostDirectivesFeature([TuiNativeValidator, TuiAppearance]), ɵɵInheritDefinitionFeature],
      decls: 3,
      vars: 2,
      consts: [["selected", ""], ["disabled", "", "selected", "", "value", "", 4, "ngIf", "ngIfElse"], ["disabled", "", "selected", "", "value", ""], ["selected", "", 3, "value", 4, "ngFor", "ngForOf"], ["selected", "", 3, "value"]],
      template: function TuiSelect_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiSelect_option_0_Template, 2, 1, "option", 1)(1, TuiSelect_ng_template_1_Template, 1, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor);
        }
        if (rf & 2) {
          const selected_r3 = ɵɵreference(2);
          ɵɵproperty("ngIf", ctx.placeholder && !ctx.stringified)("ngIfElse", selected_r3);
        }
      },
      dependencies: [NgForOf, NgIf],
      encapsulation: 2,
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiSelect, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "select[tuiTextfield]",
      imports: [NgForOf, NgIf],
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [tuiAsTextfieldAccessor(TuiSelect)],
      hostDirectives: [TuiNativeValidator, TuiAppearance],
      host: {
        "[id]": "textfield.id",
        "[class._empty]": 'stringified === ""',
        "[attr.aria-label]": "ariaLabel",
        "(input)": "0",
        "(focusin)": "0",
        "(focusout)": "0",
        "(keydown.space.prevent)": "0",
        "(keydown.enter.prevent)": "0",
        "(keydown.backspace)": 'setValue("")',
        "(mousedown.prevent)": "focus()",
        "(keydown.control.c)": "onCopy()",
        "(keydown.meta.c)": "onCopy()"
      },
      template: '<option\n    *ngIf="placeholder && !stringified; else selected"\n    disabled\n    selected\n    value=""\n>\n    {{ placeholder }}\n</option>\n<ng-template #selected>\n    <option\n        *ngFor="let item of [stringified]"\n        selected\n        [value]="item"\n    >\n        {{ item }}\n    </option>\n</ng-template>\n'
    }]
  }], null, {
    placeholder: [{
      type: Input
    }]
  });
})();
var TuiTextfieldItemComponent = class _TuiTextfieldItemComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.context = injectContext();
    this.textfield = inject(TuiTextfieldMultiComponent);
  }
  get content() {
    return this.textfield.item ?? this.handlers.stringify()(this.context.$implicit.item);
  }
  prevent(e) {
    this.textfield.focused() && e.preventDefault();
  }
  static {
    this.ɵfac = function TuiTextfieldItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldItemComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiTextfieldItemComponent,
      selectors: [["tui-textfield-item"]],
      hostVars: 4,
      hostBindings: function TuiTextfieldItemComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("pointerdown.self", function TuiTextfieldItemComponent_pointerdown_self_HostBindingHandler($event) {
            return ctx.prevent($event);
          })("keydown.arrowLeft.prevent", function TuiTextfieldItemComponent_keydown_arrowLeft_prevent_HostBindingHandler() {
            return ctx.el.previousElementSibling == null ? null : ctx.el.previousElementSibling.firstChild == null ? null : ctx.el.previousElementSibling.firstChild.focus();
          })("keydown.arrowRight.prevent", function TuiTextfieldItemComponent_keydown_arrowRight_prevent_HostBindingHandler() {
            return ctx.el.nextElementSibling == null ? null : ctx.el.nextElementSibling.firstChild == null ? null : ctx.el.nextElementSibling.firstChild.focus();
          });
        }
        if (rf & 2) {
          ɵɵclassProp("_string", !ctx.textfield.item)("_disabled", ctx.handlers.disabledItemHandler()(ctx.context.$implicit.item));
        }
      },
      decls: 1,
      vars: 2,
      consts: [[4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiTextfieldItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiTextfieldItemComponent_ng_container_0_Template, 2, 1, "ng-container", 0);
        }
        if (rf & 2) {
          ɵɵproperty("polymorpheusOutlet", ctx.content)("polymorpheusOutletContext", ctx.context);
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: ['[_nghost-%COMP%]{max-inline-size:100%;flex-shrink:0;white-space:nowrap;text-overflow:ellipsis;color:var(--tui-text-primary)}._string[_nghost-%COMP%]{overflow:hidden}._string._disabled[_nghost-%COMP%]{opacity:var(--tui-disabled-opacity)}._string[_nghost-%COMP%]:after{content:",\\a0"}[_nghost-%COMP%]:last-of-type{max-inline-size:80%}tui-textfield:not([data-focus="true"])[_nghost-%COMP%]:last-of-type:after, tui-textfield:not([data-focus="true"])   [_nghost-%COMP%]:last-of-type:after{display:none}tui-textfield:has([tuiSelectLike])[_nghost-%COMP%]:last-of-type:after, tui-textfield:has([tuiSelectLike])   [_nghost-%COMP%]:last-of-type:after, tui-textfield[data-mode~="readonly"][_nghost-%COMP%]:last-of-type:after, tui-textfield[data-mode~="readonly"]   [_nghost-%COMP%]:last-of-type:after{content:"\\a0"}'],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldItemComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-textfield-item",
      imports: [PolymorpheusOutlet],
      template: '<ng-container *polymorpheusOutlet="content as text; context: context">{{ text }}</ng-container>',
      changeDetection: ChangeDetectionStrategy.Default,
      host: {
        "[class._string]": "!textfield.item",
        "[class._disabled]": "handlers.disabledItemHandler()(context.$implicit.item)",
        "(pointerdown.self)": "prevent($event)",
        "(keydown.arrowLeft.prevent)": "el.previousElementSibling?.firstChild?.focus()",
        "(keydown.arrowRight.prevent)": "el.nextElementSibling?.firstChild?.focus()"
      },
      styles: [':host{max-inline-size:100%;flex-shrink:0;white-space:nowrap;text-overflow:ellipsis;color:var(--tui-text-primary)}:host._string{overflow:hidden}:host._string._disabled{opacity:var(--tui-disabled-opacity)}:host._string:after{content:",\\a0"}:host:last-of-type{max-inline-size:80%}:host-context(tui-textfield:not([data-focus="true"])):last-of-type:after{display:none}:host-context(tui-textfield:has([tuiSelectLike])):last-of-type:after,:host-context(tui-textfield[data-mode~="readonly"]):last-of-type:after{content:"\\a0"}\n']
    }]
  }], null, null);
})();
var TuiTextfieldMultiComponent = class _TuiTextfieldMultiComponent extends TuiTextfieldBaseComponent {
  constructor() {
    super(...arguments);
    this.height = signal(null);
    this.win = inject(WA_WINDOW);
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.component = new PolymorpheusComponent(TuiTextfieldItemComponent);
    this.sub = fromEvent(this.el, "scroll").pipe(filter(() => this.rows === 1), tuiZonefree(), takeUntilDestroyed()).subscribe(() => {
      this.el.style.setProperty("--t-scroll", tuiPx(-1 * this.el.scrollLeft));
    });
    this.rows = 100;
  }
  handleOption(option) {
    this.accessor?.setValue(tuiArrayToggle(this.control?.value ?? [], option, this.handlers.identityMatcher()));
  }
  get placeholder() {
    const placeholder = this.interactiveInput?.nativeElement.matches("input") ? this.interactiveInput.nativeElement.placeholder : this.computedFiller();
    const value = this.computedFiller() || this.value();
    const longer = value.length > placeholder.length ? value : placeholder;
    return this.focused() ? longer : "";
  }
  onItems({
    target
  }) {
    const height = this.rows > 1 && this.control?.value?.length ? target.querySelector("tui-textfield-item")?.clientHeight ?? 0 : null;
    if (height !== 0) {
      this.height.set(height);
    }
  }
  onLeft(event) {
    if (this.value() || !tuiIsElement(event.currentTarget)) {
      return;
    }
    event.preventDefault();
    event.currentTarget.previousElementSibling?.firstElementChild?.focus();
  }
  focusInput() {
    const selection = this.win.getSelection();
    if (!selection?.rangeCount || selection.getRangeAt(0)?.collapsed) {
      this.interactiveInput?.nativeElement.focus();
    }
  }
  onClick(target) {
    if (target === this.el || !this.cva?.interactive() || !this.el.matches("[tuiChevron]") && !this.el.querySelector("select, [tuiInputDateMulti]") || target.matches('input:read-only,input[inputmode="none"]')) {
      return;
    }
    this.open.update((open) => !open);
    try {
      this.interactiveInput?.nativeElement.showPicker?.();
    } catch {
    }
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiTextfieldMultiComponent_BaseFactory;
      return function TuiTextfieldMultiComponent_Factory(__ngFactoryType__) {
        return (ɵTuiTextfieldMultiComponent_BaseFactory || (ɵTuiTextfieldMultiComponent_BaseFactory = ɵɵgetInheritedFactory(_TuiTextfieldMultiComponent)))(__ngFactoryType__ || _TuiTextfieldMultiComponent);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiTextfieldMultiComponent,
      selectors: [["tui-textfield", "multi", ""]],
      contentQueries: function TuiTextfieldMultiComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TuiItem, 5, TemplateRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.item = _t.first);
        }
      },
      hostAttrs: ["tuiTextfieldV", "4.90.0", 1, "tui-interactive"],
      hostVars: 14,
      hostBindings: function TuiTextfieldMultiComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click.prevent", function TuiTextfieldMultiComponent_click_prevent_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          })("tuiActiveZoneChange", function TuiTextfieldMultiComponent_tuiActiveZoneChange_HostBindingHandler($event) {
            return !$event && (ctx.el.scrollTo({
              left: 0
            }) || (ctx.cva == null ? null : ctx.cva.onTouched()));
          })("pointerdown.self.prevent", function TuiTextfieldMultiComponent_pointerdown_self_prevent_HostBindingHandler() {
            return ctx.onIconClick();
          })("scroll.capture.zoneless", function TuiTextfieldMultiComponent_scroll_capture_zoneless_HostBindingHandler($event) {
            return ctx.onScroll($event.target);
          });
        }
        if (rf & 2) {
          ɵɵattribute("data-state", ctx.disabled ? "disabled" : null)("data-size", ctx.options.size());
          ɵɵstyleProp("--t-item-height", ctx.height(), "px")("--t-rows", ctx.rows);
          ɵɵclassProp("_empty", !(ctx.control == null ? null : ctx.control.value == null ? null : ctx.control.value.length))("_with-label", ctx.hasLabel)("_with-template", ctx.content && (ctx.control == null ? null : ctx.control.value) != null)("_disabled", ctx.disabled);
        }
      },
      inputs: {
        rows: "rows"
      },
      features: [ɵɵProvidersFeature([tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiAsDataListHost(_TuiTextfieldMultiComponent), tuiProvide(TuiTextfieldComponent, _TuiTextfieldMultiComponent), tuiProvide(TUI_SCROLL_REF, ElementRef)]), ɵɵHostDirectivesFeature([TuiDropdownFixed, TuiDropdownDirective, TuiWithDropdownOpen, TuiWithTextfieldDropdown, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent, TuiWithAppearance]), ɵɵInheritDefinitionFeature],
      ngContentSelectors: _c7,
      decls: 18,
      vars: 13,
      consts: [["vcr", ""], [4, "ngIf"], ["class", "t-scrollbar", 4, "ngIf"], [1, "t-items", 3, "click", "pointerdown.self.zoneless.prevent", "waResizeObserver"], [4, "ngFor", "ngForOf"], [1, "t-input", 3, "keydown.arrowLeft"], ["class", "t-ghost", 4, "ngIf"], ["aria-hidden", "true", "disabled", "", 1, "t-filler", 3, "value"], [1, "t-content", 3, "click", "pointerdown.zoneless.prevent", "waResizeObserver"], ["appearance", "icon", "size", "xs", "tabindex", "-1", "tuiIconButton", "", "type", "button", "class", "t-clear", 3, "iconStart", "click", 4, "ngIf"], ["class", "t-template", 4, "ngIf"], [1, "t-scrollbar"], [3, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-ghost"], ["appearance", "icon", "size", "xs", "tabindex", "-1", "tuiIconButton", "", "type", "button", 1, "t-clear", 3, "click", "iconStart"], [1, "t-template"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiTextfieldMultiComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef(_c6);
          ɵɵtemplate(0, TuiTextfieldMultiComponent_ng_container_0_Template, 1, 0, "ng-container", 1);
          ɵɵpipe(1, "async");
          ɵɵtemplate(2, TuiTextfieldMultiComponent_tui_scroll_controls_2_Template, 1, 0, "tui-scroll-controls", 2);
          ɵɵelementStart(3, "div", 3);
          ɵɵlistener("click", function TuiTextfieldMultiComponent_Template_div_click_3_listener() {
            return ctx.focusInput();
          })("pointerdown.self.zoneless.prevent", function TuiTextfieldMultiComponent_Template_div_pointerdown_self_zoneless_prevent_3_listener() {
            return 0;
          })("waResizeObserver", function TuiTextfieldMultiComponent_Template_div_waResizeObserver_3_listener($event) {
            return $event[0] && ctx.onItems($event[0]);
          });
          ɵɵprojection(4);
          ɵɵtemplate(5, TuiTextfieldMultiComponent_5_Template, 1, 7, null, 4);
          ɵɵelementStart(6, "span", 5);
          ɵɵlistener("keydown.arrowLeft", function TuiTextfieldMultiComponent_Template_span_keydown_arrowLeft_6_listener($event) {
            return ctx.onLeft($event);
          });
          ɵɵprojection(7, 1);
          ɵɵprojection(8, 2);
          ɵɵtemplate(9, TuiTextfieldMultiComponent_span_9_Template, 2, 1, "span", 6);
          ɵɵelement(10, "input", 7);
          ɵɵelementEnd()();
          ɵɵelementStart(11, "span", 8);
          ɵɵlistener("click", function TuiTextfieldMultiComponent_Template_span_click_11_listener() {
            return ctx.interactiveInput == null ? null : ctx.interactiveInput.nativeElement == null ? null : ctx.interactiveInput.nativeElement.focus();
          })("pointerdown.zoneless.prevent", function TuiTextfieldMultiComponent_Template_span_pointerdown_zoneless_prevent_11_listener() {
            return 0;
          })("waResizeObserver", function TuiTextfieldMultiComponent_Template_span_waResizeObserver_11_listener($event) {
            return $event[0] && ctx.onResize($event[0]);
          });
          ɵɵprojection(12, 3);
          ɵɵtemplate(13, TuiTextfieldMultiComponent_button_13_Template, 2, 2, "button", 9);
          ɵɵelementContainer(14, null, 0);
          ɵɵprojection(16, 4);
          ɵɵelementEnd();
          ɵɵtemplate(17, TuiTextfieldMultiComponent_span_17_Template, 2, 4, "span", 10);
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", ɵɵpipeBind1(1, 11, ctx.control == null ? null : ctx.control.control == null ? null : ctx.control.control.valueChanges));
          ɵɵadvance(2);
          ɵɵproperty("ngIf", ctx.rows > 1);
          ɵɵadvance();
          ɵɵclassProp("t-items_horizontal", ctx.rows === 1);
          ɵɵadvance(2);
          ɵɵproperty("ngForOf", ctx.control == null ? null : ctx.control.value);
          ɵɵadvance(4);
          ɵɵproperty("ngIf", ctx.placeholder);
          ɵɵadvance();
          ɵɵclassProp("t-filler_hidden", !ctx.showFiller());
          ɵɵproperty("value", ctx.computedFiller());
          ɵɵadvance(3);
          ɵɵproperty("ngIf", ctx.options.cleaner());
          ɵɵadvance(4);
          ɵɵproperty("ngIf", (ctx.control == null ? null : ctx.control.value) != null);
        }
      },
      dependencies: [AsyncPipe, NgForOf, NgIf, PolymorpheusOutlet, TuiButton, TuiScrollControls, WaResizeObserver],
      styles: ['[tuiTextfieldV="4.90.0"]{scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--t-height: var(--tui-height-l);--t-padding: var(--tui-padding-l);--t-label-y: -.75rem;--t-label-font: var(--tui-font-text-s);--t-end: 0rem;--t-start: 0rem;position:relative;display:flex;flex-wrap:wrap;align-items:center;cursor:pointer;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-font-text-ui-m);line-height:1.25rem;box-sizing:border-box;gap:0 .25rem;isolation:isolate}[tuiTextfieldV="4.90.0"]::-webkit-scrollbar,[tuiTextfieldV="4.90.0"]::-webkit-scrollbar-thumb{display:none}[tuiTextfieldV="4.90.0"][tuiIcons]:read-only{color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2.25rem}[tuiTextfieldV="4.90.0"][style*="--t-icon-end:"]{--t-end: 2.25rem}[tuiTextfieldV="4.90.0"][tuiIcons]:after{position:relative;block-size:auto;align-self:stretch;border-inline-start:var(--t-padding) solid transparent;border-inline-end:var(--t-padding) solid transparent;margin:0 calc(-1 * var(--t-padding))}[tuiTextfieldV="4.90.0"]::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}[tuiTextfieldV="4.90.0"] label,[tuiTextfieldV="4.90.0"]>.t-content,[tuiTextfieldV="4.90.0"]>.t-template{pointer-events:none}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{font:inherit;resize:none;outline:none;padding-block-start:1.125rem;padding-block-end:1.125rem}[tuiTextfieldV="4.90.0"] input[inputmode=none],[tuiTextfieldV="4.90.0"] select[inputmode=none],[tuiTextfieldV="4.90.0"] textarea[inputmode=none]{caret-color:transparent}[tuiTextfieldV="4.90.0"] input::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] input::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}[tuiTextfieldV="4.90.0"][data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);border-radius:var(--tui-radius-m);gap:0;font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-end:"]{--t-end: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s]:before{margin-inline-end:.625rem;font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s]:after{margin-inline-end:calc(-1 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding));font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s] input,[tuiTextfieldV="4.90.0"][data-size=s] select,[tuiTextfieldV="4.90.0"][data-size=s] textarea{padding-block-start:.5rem;padding-block-end:.5rem}[tuiTextfieldV="4.90.0"][data-size=s]>.t-content{margin-inline-end:-.25rem}[tuiTextfieldV="4.90.0"][data-size=m]{--t-height: var(--tui-height-m);--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-font-text-xs);--t-label-y: -.5625rem;border-radius:var(--tui-radius-m);font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-end:"]{--t-end: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m]:before{margin-inline-start:-.125rem;margin-inline-end:.125rem}[tuiTextfieldV="4.90.0"][data-size=m]:after{margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-.125rem - var(--t-padding))}[tuiTextfieldV="4.90.0"][data-size=m] input,[tuiTextfieldV="4.90.0"][data-size=m] select,[tuiTextfieldV="4.90.0"][data-size=m] textarea{padding-block-start:.875rem;padding-block-end:.875rem}[tuiTextfieldV="4.90.0"][data-size=m]>.t-content{margin-inline-end:-.125rem}[tuiTextfieldV="4.90.0"][data-size=l]{--t-label: -.7rem}[tuiTextfieldV="4.90.0"][tuiIcons]:hover{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(input:read-only):not([multi]),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(textarea:read-only),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(select[data-mode~=readonly]){color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"]:before{z-index:1;margin-inline-end:.5rem;pointer-events:none}[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):before,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):after,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip]))>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]._disabled:before,[tuiTextfieldV="4.90.0"]._disabled:after,[tuiTextfieldV="4.90.0"]._disabled>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]:has(label:not(:empty))>.t-template,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) input:not([type=range]),[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) select:defined,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]._with-label>.t-template,[tuiTextfieldV="4.90.0"]._with-label input:not([type=range]),[tuiTextfieldV="4.90.0"]._with-label select:defined,[tuiTextfieldV="4.90.0"]._with-label textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]>.t-template,[tuiTextfieldV="4.90.0"] input:defined,[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;-webkit-appearance:none;appearance:none;box-sizing:border-box;border-width:0;padding-inline-start:calc(var(--t-start, 0rem) + var(--t-padding));padding-inline-end:calc(var(--t-end, 0rem) + var(--t-side) + var(--t-padding))}[tuiTextfieldV="4.90.0"]>.t-template{display:flex;align-items:center;border-radius:inherit;color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"]._with-template input:first-of-type,[tuiTextfieldV="4.90.0"]._with-template select,[tuiTextfieldV="4.90.0"]._with-template textarea{color:transparent!important}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{background:none;border-radius:inherit}[tuiTextfieldV="4.90.0"] input:not([type=range]),[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{pointer-events:auto}[tuiTextfieldV="4.90.0"] input:not([type=range]):not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] select:defined:not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] textarea:defined:not(select):read-only~.t-filler{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label,[tuiTextfieldV="4.90.0"] select:defined:disabled~label,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content>tui-icon{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown)~label{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label{color:var(--tui-text-negative)}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear{display:flex}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}@supports (-webkit-touch-callout: none){[tuiTextfieldV="4.90.0"] input:not([type=range])._ios-fix,[tuiTextfieldV="4.90.0"] select:defined._ios-fix,[tuiTextfieldV="4.90.0"] textarea:defined._ios-fix{position:fixed;left:1000rem}}[tuiTextfieldV="4.90.0"] [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;flex:1;align-self:flex-start;font-size:inherit;line-height:var(--t-height);letter-spacing:calc((max(1em,.75rem) - 1em)*.4);transition-duration:inherit}[tuiTextfieldV="4.90.0"] label:defined,[tuiTextfieldV="4.90.0"] input:defined::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined::placeholder,[tuiTextfieldV="4.90.0"] select:defined._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] select:not([data-mode~=readonly]){cursor:pointer}[tuiTextfieldV="4.90.0"] select option[value=""]:disabled{color:transparent}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option{background-color:var(--tui-background-elevation-3)}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option:not(:disabled){color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"] button,[tuiTextfieldV="4.90.0"] a{pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:inherit;margin-inline-start:auto;isolation:isolate;border-radius:inherit}[tuiTextfieldV="4.90.0"]>.t-content>tui-icon{pointer-events:auto}[tuiTextfieldV="4.90.0"] textarea~.t-content{min-inline-size:.5rem}[tuiTextfieldV="4.90.0"] .t-clear{z-index:1;display:none;pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-filler:defined{pointer-events:none;color:var(--tui-text-tertiary);opacity:1}[tuiTextfieldV="4.90.0"] [tuiFluidTypography]{font-weight:700}[tuiTextfieldV="4.90.0"] [tuiSelectLike]:not(:read-only){cursor:pointer}[tuiTextfieldV="4.90.0"]:has(input[type=tel]){direction:ltr}tui-textfield[tuiTextfieldV="4.90.0"][multi]{flex-wrap:nowrap;overflow:scroll;align-items:stretch;cursor:text;gap:0;max-block-size:calc(var(--t-vertical) * 2 + var(--t-item-height) * var(--t-rows));overscroll-behavior-x:none;scroll-behavior:var(--tui-scroll-behavior)}tui-textfield[tuiTextfieldV="4.90.0"][multi]:before,tui-textfield[tuiTextfieldV="4.90.0"][multi]:after{position:sticky;top:0;left:0;inset-inline-start:0;block-size:var(--t-height)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiChevron]:after{top:.375rem;block-size:calc(var(--t-height) - .75rem)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-scrollbar{transform:translate(calc(var(--t-padding) * var(--tui-inline)));margin-inline-start:calc(-1 * var(--t-start));margin-inline-end:calc(1px - 100% + var(--t-start))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-scrollbar .t-bar_horizontal{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items{position:sticky;left:var(--t-start);display:flex;inset-inline-start:var(--t-start);min-inline-size:0;min-block-size:-webkit-fit-content;min-block-size:-moz-fit-content;min-block-size:fit-content;flex:1;align-items:center;flex-wrap:wrap;padding:var(--t-vertical) 0;transition-duration:inherit}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items:after{content:"";min-inline-size:1px;min-block-size:1px}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal{clip-path:inset(0 0 0 calc(var(--t-start) / 2 - var(--t-padding) - .25rem));flex-wrap:nowrap}[dir=rtl] tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal{clip-path:inset(0 calc(var(--t-start) / 2 - var(--t-padding) - .25rem) 0 0)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal>.t-input{padding-inline-end:calc(var(--t-side) + var(--t-end) + var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items:not(tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal){--t-scroll: 0}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>label[tuiLabel]{position:absolute;top:0;inline-size:100%}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input{position:relative;display:flex;align-items:center;flex:1;block-size:1.25em;max-block-size:1.25rem;max-inline-size:100%;pointer-events:none;transform:translate(var(--t-scroll))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input input{position:absolute;left:0;inset-inline-start:0;inline-size:100%;padding:0}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-ghost{visibility:hidden;white-space:pre;text-overflow:clip;padding-inline-end:.125rem;min-block-size:var(--t-item-height, 1em)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-filler{position:absolute;left:0;inset-inline-start:0;color:var(--tui-text-tertiary);pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-filler_hidden{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-content{position:sticky;top:0;left:calc(100% - var(--t-side) - var(--t-end) + var(--t-padding) - var(--t-offset));inset-inline-start:calc(100% - var(--t-side) - var(--t-end) + var(--t-padding) - var(--t-offset));margin:0;gap:.25rem}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-content .t-clear{display:flex}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=invalid]:not([data-mode~=readonly])>.t-items>[tuiLabel]{color:var(--tui-text-negative)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly])>.t-items>[tuiLabel]{color:var(--tui-text-primary)!important}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-content .t-clear,tui-textfield[tuiTextfieldV="4.90.0"][multi]._disabled>.t-content .t-clear,tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-content .t-clear{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items input:not(:focus)::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-items input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-items label~.t-input input::placeholder{opacity:0}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-items input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly]):not(:focus-within)>.t-items input::placeholder{opacity:1}tui-textfield[tuiTextfieldV="4.90.0"][multi]:not(._empty)>.t-items [tuiLabel],tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly])>.t-items [tuiLabel]{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-state=disabled],tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]{pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-state=disabled] select,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly] select{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]{--t-vertical: .625rem;--t-offset: calc(1rem - var(--t-end) / 4.5)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]:before{margin-inline-end:.75rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]:after{left:calc(100% - var(--t-end) - .375rem + .25 * (1em - 1rem));inset-inline-start:calc(100% - var(--t-end) - .375rem + .25 * (1em - 1rem));margin-inline-end:calc(.5 * (1.5rem - 1em) - var(--t-padding));margin-inline-start:-.75rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]._with-label{--t-vertical: 1.125rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]._with-label>.t-items{padding:1.75rem 0 .5rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]{--t-vertical: .5rem;--t-offset: calc(.75rem + var(--t-end) / 14)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]:before{left:-.125rem;inset-inline-start:-.125rem;margin-inline-end:.375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]:after{left:calc(100% - var(--t-end) - .25rem);inset-inline-start:calc(100% - var(--t-end) - .25rem);margin-inline-start:-.125rem;border-width:.625rem;margin-inline-end:calc(.5 * (1.5rem - 1em) - var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]._with-label{--t-vertical: .875rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]._with-label>.t-items{padding:1.375rem 0 .375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]>.t-content{transform:translate(calc(.125rem * var(--tui-inline)))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]{--t-vertical: .125rem;--t-offset: calc(.625rem + var(--t-end) / 10)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]:before{margin-inline-end:.375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]:after{left:calc(100% - var(--t-end) - .25rem);inset-inline-start:calc(100% - var(--t-end) - .25rem);border-width:.625rem;margin-inline-end:calc(-1 * var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]>.t-content{gap:0;transform:translate(calc(.25rem * var(--tui-inline)))}tui-textfield[tuiTextfieldV="4.90.0"][multi]:focus-visible:not([data-focus=false]) input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi]:focus-visible:not([data-focus=false]) input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true] input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true] input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]:not(._focused):has(:focus-visible) input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]:not(._focused):has(:focus-visible) input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]._focused._focused input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]._focused._focused input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi] tui-textfield-item{transform:translate(var(--t-scroll))}tui-textfield[tuiTextfieldV="4.90.0"][multi] input{color:var(--tui-text-primary)}tui-textfield[tuiTextfieldV="4.90.0"][multi] input::placeholder{transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out}tui-textfield[tuiTextfieldV="4.90.0"][multi] select{opacity:0;padding:0;pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-items select~.t-filler{display:block}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty:not([data-focus=true])>.t-items select~.t-filler{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi]:has([tuiSelectLike]){cursor:pointer}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldMultiComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-textfield[multi]",
      imports: [AsyncPipe, NgForOf, NgIf, PolymorpheusOutlet, TuiButton, TuiScrollControls, WaResizeObserver],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiAsDataListHost(TuiTextfieldMultiComponent), tuiProvide(TuiTextfieldComponent, TuiTextfieldMultiComponent), tuiProvide(TUI_SCROLL_REF, ElementRef)],
      hostDirectives: [TuiDropdownFixed, TuiDropdownDirective, TuiWithDropdownOpen, TuiWithTextfieldDropdown, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent, TuiWithAppearance],
      host: {
        class: "tui-interactive",
        tuiTextfieldV: TUI_VERSION,
        "[attr.data-state]": 'disabled ? "disabled" : null',
        "[class._empty]": "!control?.value?.length",
        "[style.--t-item-height.px]": "height()",
        "[style.--t-rows]": "rows",
        "(click.prevent)": "onClick($event.target)",
        "(tuiActiveZoneChange)": "!$event && (el.scrollTo({left: 0}) || cva?.onTouched())",
        // TODO: Remove in v5
        "[attr.data-size]": "options.size()",
        "[class._with-label]": "hasLabel",
        "[class._with-template]": "content && control?.value != null",
        "[class._disabled]": "disabled",
        "(pointerdown.self.prevent)": "onIconClick()",
        "(scroll.capture.zoneless)": "onScroll($event.target)"
      },
      template: '<ng-container *ngIf="control?.control?.valueChanges | async" />\n<tui-scroll-controls\n    *ngIf="rows > 1"\n    class="t-scrollbar"\n/>\n\n<div\n    class="t-items"\n    [class.t-items_horizontal]="rows === 1"\n    (click)="focusInput()"\n    (pointerdown.self.zoneless.prevent)="(0)"\n    (waResizeObserver)="$event[0] && onItems($event[0])"\n>\n    <ng-content select="label" />\n    <ng-template\n        *ngFor="let item of control?.value; let index = index"\n        [polymorpheusOutlet]="component"\n        [polymorpheusOutletContext]="{$implicit: {item, index}}"\n    />\n    <span\n        class="t-input"\n        (keydown.arrowLeft)="onLeft($event)"\n    >\n        <ng-content select="input" />\n        <ng-content select="select" />\n        <span\n            *ngIf="placeholder"\n            class="t-ghost"\n        >\n            {{ placeholder }}\n        </span>\n        <input\n            aria-hidden="true"\n            disabled\n            class="t-filler"\n            [class.t-filler_hidden]="!showFiller()"\n            [value]="computedFiller()"\n        />\n    </span>\n</div>\n\n<span\n    class="t-content"\n    (click)="interactiveInput?.nativeElement?.focus()"\n    (pointerdown.zoneless.prevent)="(0)"\n    (waResizeObserver)="$event[0] && onResize($event[0])"\n>\n    <ng-content />\n    <button\n        *ngIf="options.cleaner()"\n        appearance="icon"\n        size="xs"\n        tabindex="-1"\n        tuiIconButton\n        type="button"\n        class="t-clear"\n        [iconStart]="icons.close"\n        (click)="accessor?.setValue([])"\n    >\n        {{ clear() }}\n    </button>\n    <ng-container #vcr />\n    <ng-content select="tui-icon" />\n</span>\n\n<span\n    *ngIf="control?.value != null"\n    class="t-template"\n>\n    <ng-container *polymorpheusOutlet="content as text; context: {$implicit: control?.value}">\n        {{ text }}\n    </ng-container>\n</span>\n',
      styles: ['[tuiTextfieldV="4.90.0"]{scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;--t-height: var(--tui-height-l);--t-padding: var(--tui-padding-l);--t-label-y: -.75rem;--t-label-font: var(--tui-font-text-s);--t-end: 0rem;--t-start: 0rem;position:relative;display:flex;flex-wrap:wrap;align-items:center;cursor:pointer;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-font-text-ui-m);line-height:1.25rem;box-sizing:border-box;gap:0 .25rem;isolation:isolate}[tuiTextfieldV="4.90.0"]::-webkit-scrollbar,[tuiTextfieldV="4.90.0"]::-webkit-scrollbar-thumb{display:none}[tuiTextfieldV="4.90.0"][tuiIcons]:read-only{color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"][style*="--t-icon-start:"]{--t-start: 2.25rem}[tuiTextfieldV="4.90.0"][style*="--t-icon-end:"]{--t-end: 2.25rem}[tuiTextfieldV="4.90.0"][tuiIcons]:after{position:relative;block-size:auto;align-self:stretch;border-inline-start:var(--t-padding) solid transparent;border-inline-end:var(--t-padding) solid transparent;margin:0 calc(-1 * var(--t-padding))}[tuiTextfieldV="4.90.0"]::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}[tuiTextfieldV="4.90.0"] label,[tuiTextfieldV="4.90.0"]>.t-content,[tuiTextfieldV="4.90.0"]>.t-template{pointer-events:none}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{font:inherit;resize:none;outline:none;padding-block-start:1.125rem;padding-block-end:1.125rem}[tuiTextfieldV="4.90.0"] input[inputmode=none],[tuiTextfieldV="4.90.0"] select[inputmode=none],[tuiTextfieldV="4.90.0"] textarea[inputmode=none]{caret-color:transparent}[tuiTextfieldV="4.90.0"] input::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-inner-spin-button,[tuiTextfieldV="4.90.0"] input::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] select::-webkit-outer-spin-button,[tuiTextfieldV="4.90.0"] textarea::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}[tuiTextfieldV="4.90.0"][data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);border-radius:var(--tui-radius-m);gap:0;font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-start:"]{--t-start: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s][style*="--t-icon-end:"]{--t-end: 1.375rem}[tuiTextfieldV="4.90.0"][data-size=s]:before{margin-inline-end:.625rem;font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s]:after{margin-inline-end:calc(-1 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding));font-size:1rem}[tuiTextfieldV="4.90.0"][data-size=s] input,[tuiTextfieldV="4.90.0"][data-size=s] select,[tuiTextfieldV="4.90.0"][data-size=s] textarea{padding-block-start:.5rem;padding-block-end:.5rem}[tuiTextfieldV="4.90.0"][data-size=s]>.t-content{margin-inline-end:-.25rem}[tuiTextfieldV="4.90.0"][data-size=m]{--t-height: var(--tui-height-m);--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-font-text-xs);--t-label-y: -.5625rem;border-radius:var(--tui-radius-m);font:var(--tui-font-text-ui-s);line-height:1rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-start:"]{--t-start: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m][style*="--t-icon-end:"]{--t-end: 1.75rem}[tuiTextfieldV="4.90.0"][data-size=m]:before{margin-inline-start:-.125rem;margin-inline-end:.125rem}[tuiTextfieldV="4.90.0"][data-size=m]:after{margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-.125rem - var(--t-padding))}[tuiTextfieldV="4.90.0"][data-size=m] input,[tuiTextfieldV="4.90.0"][data-size=m] select,[tuiTextfieldV="4.90.0"][data-size=m] textarea{padding-block-start:.875rem;padding-block-end:.875rem}[tuiTextfieldV="4.90.0"][data-size=m]>.t-content{margin-inline-end:-.125rem}[tuiTextfieldV="4.90.0"][data-size=l]{--t-label: -.7rem}[tuiTextfieldV="4.90.0"][tuiIcons]:hover{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(input:read-only):not([multi]),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(textarea:read-only),[tuiTextfieldV="4.90.0"][tuiIcons]:hover:has(select[data-mode~=readonly]){color:var(--tui-text-tertiary)}[tuiTextfieldV="4.90.0"]:before{z-index:1;margin-inline-end:.5rem;pointer-events:none}[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):before,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip])):after,[tuiTextfieldV="4.90.0"]:has(:disabled:not(.t-filler,button,option,[tuiChip]))>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]._disabled:before,[tuiTextfieldV="4.90.0"]._disabled:after,[tuiTextfieldV="4.90.0"]._disabled>.t-template{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"]:has(label:not(:empty))>.t-template,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) input:not([type=range]),[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) select:defined,[tuiTextfieldV="4.90.0"]:has(label:not(:empty)) textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty))>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true]):has(label:not(:empty)) textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]._with-label>.t-template,[tuiTextfieldV="4.90.0"]._with-label input:not([type=range]),[tuiTextfieldV="4.90.0"]._with-label select:defined,[tuiTextfieldV="4.90.0"]._with-label textarea:defined{padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined::placeholder,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label>.t-template._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label input:not([type=range])._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label select:defined._empty,[tuiTextfieldV="4.90.0"]:not([data-focus=true])._with-label textarea:defined._empty{color:transparent}[tuiTextfieldV="4.90.0"]>.t-template,[tuiTextfieldV="4.90.0"] input:defined,[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{position:absolute;top:0;left:0;inline-size:100%;block-size:100%;-webkit-appearance:none;appearance:none;box-sizing:border-box;border-width:0;padding-inline-start:calc(var(--t-start, 0rem) + var(--t-padding));padding-inline-end:calc(var(--t-end, 0rem) + var(--t-side) + var(--t-padding))}[tuiTextfieldV="4.90.0"]>.t-template{display:flex;align-items:center;border-radius:inherit;color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"]._with-template input:first-of-type,[tuiTextfieldV="4.90.0"]._with-template select,[tuiTextfieldV="4.90.0"]._with-template textarea{color:transparent!important}[tuiTextfieldV="4.90.0"] input,[tuiTextfieldV="4.90.0"] select,[tuiTextfieldV="4.90.0"] textarea{background:none;border-radius:inherit}[tuiTextfieldV="4.90.0"] input:not([type=range]),[tuiTextfieldV="4.90.0"] select:defined,[tuiTextfieldV="4.90.0"] textarea:defined{pointer-events:auto}[tuiTextfieldV="4.90.0"] input:not([type=range]):not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] select:defined:not(select):read-only~.t-filler,[tuiTextfieldV="4.90.0"] textarea:defined:not(select):read-only~.t-filler{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label,[tuiTextfieldV="4.90.0"] select:defined:disabled~label,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content{opacity:var(--tui-disabled-opacity)}[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~label>tui-icon,[tuiTextfieldV="4.90.0"] input:not([type=range]):disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] select:defined:disabled~.t-content>tui-icon,[tuiTextfieldV="4.90.0"] textarea:defined:disabled~.t-content>tui-icon{display:none}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown)~label{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled)[data-mode~=invalid]~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):invalid:not(:disabled):not([data-mode])~label{color:var(--tui-text-negative)}[tuiTextfieldV="4.90.0"] input:not([type=range]):-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:-webkit-autofill:not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] input:not([type=range]):not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] select:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear,[tuiTextfieldV="4.90.0"] textarea:defined:not(._empty):not(:placeholder-shown):not(:disabled):not([data-mode~=readonly])~.t-content .t-clear{display:flex}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly]):focus-visible:not([data-focus=false])~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[data-focus=true]~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[data-focus=true]~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]:not(._focused):has(:focus-visible)~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused::placeholder,[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] input:not([type=range]):not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] select:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label,[tuiTextfieldV="4.90.0"] textarea:defined:not([data-mode~=readonly])[tuiWrapper]._focused._focused~label{color:var(--tui-text-primary)!important;font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}@supports (-webkit-touch-callout: none){[tuiTextfieldV="4.90.0"] input:not([type=range])._ios-fix,[tuiTextfieldV="4.90.0"] select:defined._ios-fix,[tuiTextfieldV="4.90.0"] textarea:defined._ios-fix{position:fixed;left:1000rem}}[tuiTextfieldV="4.90.0"] [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;flex:1;align-self:flex-start;font-size:inherit;line-height:var(--t-height);letter-spacing:calc((max(1em,.75rem) - 1em)*.4);transition-duration:inherit}[tuiTextfieldV="4.90.0"] label:defined,[tuiTextfieldV="4.90.0"] input:defined::placeholder,[tuiTextfieldV="4.90.0"] textarea:defined::placeholder,[tuiTextfieldV="4.90.0"] select:defined._empty{color:var(--tui-text-secondary)}[tuiTextfieldV="4.90.0"] select:not([data-mode~=readonly]){cursor:pointer}[tuiTextfieldV="4.90.0"] select option[value=""]:disabled{color:transparent}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option{background-color:var(--tui-background-elevation-3)}[tuiTextfieldV="4.90.0"] select optgroup,[tuiTextfieldV="4.90.0"] select option:not(:disabled){color:var(--tui-text-primary)}[tuiTextfieldV="4.90.0"] button,[tuiTextfieldV="4.90.0"] a{pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:inherit;margin-inline-start:auto;isolation:isolate;border-radius:inherit}[tuiTextfieldV="4.90.0"]>.t-content>tui-icon{pointer-events:auto}[tuiTextfieldV="4.90.0"] textarea~.t-content{min-inline-size:.5rem}[tuiTextfieldV="4.90.0"] .t-clear{z-index:1;display:none;pointer-events:auto}[tuiTextfieldV="4.90.0"]>.t-filler:defined{pointer-events:none;color:var(--tui-text-tertiary);opacity:1}[tuiTextfieldV="4.90.0"] [tuiFluidTypography]{font-weight:700}[tuiTextfieldV="4.90.0"] [tuiSelectLike]:not(:read-only){cursor:pointer}[tuiTextfieldV="4.90.0"]:has(input[type=tel]){direction:ltr}tui-textfield[tuiTextfieldV="4.90.0"][multi]{flex-wrap:nowrap;overflow:scroll;align-items:stretch;cursor:text;gap:0;max-block-size:calc(var(--t-vertical) * 2 + var(--t-item-height) * var(--t-rows));overscroll-behavior-x:none;scroll-behavior:var(--tui-scroll-behavior)}tui-textfield[tuiTextfieldV="4.90.0"][multi]:before,tui-textfield[tuiTextfieldV="4.90.0"][multi]:after{position:sticky;top:0;left:0;inset-inline-start:0;block-size:var(--t-height)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiChevron]:after{top:.375rem;block-size:calc(var(--t-height) - .75rem)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-scrollbar{transform:translate(calc(var(--t-padding) * var(--tui-inline)));margin-inline-start:calc(-1 * var(--t-start));margin-inline-end:calc(1px - 100% + var(--t-start))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-scrollbar .t-bar_horizontal{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items{position:sticky;left:var(--t-start);display:flex;inset-inline-start:var(--t-start);min-inline-size:0;min-block-size:-webkit-fit-content;min-block-size:-moz-fit-content;min-block-size:fit-content;flex:1;align-items:center;flex-wrap:wrap;padding:var(--t-vertical) 0;transition-duration:inherit}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items:after{content:"";min-inline-size:1px;min-block-size:1px}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal{clip-path:inset(0 0 0 calc(var(--t-start) / 2 - var(--t-padding) - .25rem));flex-wrap:nowrap}[dir=rtl] tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal{clip-path:inset(0 calc(var(--t-start) / 2 - var(--t-padding) - .25rem) 0 0)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal>.t-input{padding-inline-end:calc(var(--t-side) + var(--t-end) + var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items:not(tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items_horizontal){--t-scroll: 0}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>label[tuiLabel]{position:absolute;top:0;inline-size:100%}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input{position:relative;display:flex;align-items:center;flex:1;block-size:1.25em;max-block-size:1.25rem;max-inline-size:100%;pointer-events:none;transform:translate(var(--t-scroll))}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input input{position:absolute;left:0;inset-inline-start:0;inline-size:100%;padding:0}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-ghost{visibility:hidden;white-space:pre;text-overflow:clip;padding-inline-end:.125rem;min-block-size:var(--t-item-height, 1em)}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-filler{position:absolute;left:0;inset-inline-start:0;color:var(--tui-text-tertiary);pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items>.t-input .t-filler_hidden{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-content{position:sticky;top:0;left:calc(100% - var(--t-side) - var(--t-end) + var(--t-padding) - var(--t-offset));inset-inline-start:calc(100% - var(--t-side) - var(--t-end) + var(--t-padding) - var(--t-offset));margin:0;gap:.25rem}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-content .t-clear{display:flex}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=invalid]:not([data-mode~=readonly])>.t-items>[tuiLabel]{color:var(--tui-text-negative)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly])>.t-items>[tuiLabel]{color:var(--tui-text-primary)!important}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-content .t-clear,tui-textfield[tuiTextfieldV="4.90.0"][multi]._disabled>.t-content .t-clear,tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-content .t-clear{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]>.t-items input:not(:focus)::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-items input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]>.t-items label~.t-input input::placeholder{opacity:0}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-items input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly]):not(:focus-within)>.t-items input::placeholder{opacity:1}tui-textfield[tuiTextfieldV="4.90.0"][multi]:not(._empty)>.t-items [tuiLabel],tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true]:not([data-mode~=readonly])>.t-items [tuiLabel]{font:var(--t-label-font);line-height:var(--t-height);transform:translateY(var(--t-label-y))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-state=disabled],tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly]{pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-state=disabled] select,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-mode~=readonly] select{display:none}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]{--t-vertical: .625rem;--t-offset: calc(1rem - var(--t-end) / 4.5)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]:before{margin-inline-end:.75rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]:after{left:calc(100% - var(--t-end) - .375rem + .25 * (1em - 1rem));inset-inline-start:calc(100% - var(--t-end) - .375rem + .25 * (1em - 1rem));margin-inline-end:calc(.5 * (1.5rem - 1em) - var(--t-padding));margin-inline-start:-.75rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]._with-label{--t-vertical: 1.125rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=l]._with-label>.t-items{padding:1.75rem 0 .5rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]{--t-vertical: .5rem;--t-offset: calc(.75rem + var(--t-end) / 14)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]:before{left:-.125rem;inset-inline-start:-.125rem;margin-inline-end:.375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]:after{left:calc(100% - var(--t-end) - .25rem);inset-inline-start:calc(100% - var(--t-end) - .25rem);margin-inline-start:-.125rem;border-width:.625rem;margin-inline-end:calc(.5 * (1.5rem - 1em) - var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]._with-label{--t-vertical: .875rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]._with-label>.t-items{padding:1.375rem 0 .375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=m]>.t-content{transform:translate(calc(.125rem * var(--tui-inline)))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]{--t-vertical: .125rem;--t-offset: calc(.625rem + var(--t-end) / 10)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]:before{margin-inline-end:.375rem}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]:after{left:calc(100% - var(--t-end) - .25rem);inset-inline-start:calc(100% - var(--t-end) - .25rem);border-width:.625rem;margin-inline-end:calc(-1 * var(--t-padding))}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-size=s]>.t-content{gap:0;transform:translate(calc(.25rem * var(--tui-inline)))}tui-textfield[tuiTextfieldV="4.90.0"][multi]:focus-visible:not([data-focus=false]) input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi]:focus-visible:not([data-focus=false]) input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true] input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][data-focus=true] input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]:not(._focused):has(:focus-visible) input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]:not(._focused):has(:focus-visible) input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]._focused._focused input::placeholder,tui-textfield[tuiTextfieldV="4.90.0"][multi][tuiWrapper]._focused._focused input._empty{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi] tui-textfield-item{transform:translate(var(--t-scroll))}tui-textfield[tuiTextfieldV="4.90.0"][multi] input{color:var(--tui-text-primary)}tui-textfield[tuiTextfieldV="4.90.0"][multi] input::placeholder{transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out}tui-textfield[tuiTextfieldV="4.90.0"][multi] select{opacity:0;padding:0;pointer-events:none}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty>.t-items select~.t-filler{display:block}tui-textfield[tuiTextfieldV="4.90.0"][multi]._empty:not([data-focus=true])>.t-items select~.t-filler{color:var(--tui-text-secondary)}tui-textfield[tuiTextfieldV="4.90.0"][multi]:has([tuiSelectLike]){cursor:pointer}\n']
    }]
  }], null, {
    item: [{
      type: ContentChild,
      args: [TuiItem, {
        read: TemplateRef,
        descendants: true
      }]
    }],
    rows: [{
      type: Input
    }]
  });
})();
var TuiTextfield = [TuiItem, TuiLabel, TuiSelect, TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective, TuiTextfieldDropdownDirective, TuiTextfieldMultiComponent];
function tuiInjectAuxiliary(predicate) {
  const {
    auxiliaries
  } = inject(TuiTextfieldComponent);
  return computed(() => auxiliaries().find(predicate) ?? null);
}
var TuiTextfieldContent = class _TuiTextfieldContent {
  constructor() {
    this.ref = inject(TuiTextfieldComponent).vcr?.createEmbeddedView(inject(TemplateRef));
  }
  ngDoCheck() {
    this.ref?.detectChanges();
  }
  static {
    this.ɵfac = function TuiTextfieldContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldContent)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiTextfieldContent,
      selectors: [["ng-template", "tuiTextfieldContent", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldContent, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiTextfieldContent]"
    }]
  }], null, null);
})();
function tuiTextfieldIconBinding(token) {
  const textfield = inject(TUI_TEXTFIELD_OPTIONS);
  const options = inject(token);
  return tuiDirectiveBinding(TuiIcons, "iconEnd", computed(() => options.icon(textfield.size())), {});
}
var TuiWithNativePicker = class _TuiWithNativePicker {
  constructor() {
    tuiInjectElement().type = "text";
  }
  static {
    this.ɵfac = function TuiWithNativePicker_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithNativePicker)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithNativePicker
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithNativePicker, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], function() {
    return [];
  }, null);
})();

export {
  tuiParentAnimation,
  tuiParentStop,
  tuiHost,
  tuiHeightCollapse,
  tuiHeightCollapseList,
  tuiWidthCollapse,
  tuiWidthCollapseList,
  tuiCrossFade,
  tuiFadeIn,
  tuiFadeInList,
  tuiFadeInTop,
  tuiFadeInBottom,
  tuiDropdownAnimation,
  tuiScaleIn,
  tuiPop,
  tuiScaleInList,
  tuiSlideIn,
  tuiSlideInLeft,
  tuiSlideInLeftList,
  tuiSlideInRight,
  tuiSlideInRightList,
  tuiSlideInTop,
  tuiSlideInTopList,
  tuiSlideInBottom,
  tuiSlideInBottomList,
  TuiTransitioned,
  TUI_APPEARANCE_DEFAULT_OPTIONS,
  TUI_APPEARANCE_OPTIONS,
  tuiAppearanceOptionsProvider,
  TuiAppearance,
  tuiAppearance,
  tuiAppearanceState,
  tuiAppearanceFocus,
  tuiAppearanceMode,
  TuiWithAppearance,
  TUI_BUTTON_DEFAULT_OPTIONS,
  TUI_BUTTON_OPTIONS,
  tuiButtonOptionsProvider,
  TuiButton,
  TUI_LINK_DEFAULT_OPTIONS,
  TUI_LINK_OPTIONS,
  tuiLinkOptionsProvider,
  TuiLink,
  TUI_NOTIFICATION_DEFAULT_OPTIONS,
  TUI_NOTIFICATION_OPTIONS,
  tuiNotificationOptionsProvider,
  TuiNotification,
  TuiTitle,
  TuiPopoverDirective,
  TuiMapperPipe,
  TUI_ALERT_DEFAULT_OPTIONS,
  TUI_ALERT_OPTIONS,
  TUI_ALERT_POSITION,
  TUI_ALERTS,
  TUI_ALERTS_GROUPED,
  tuiAlertOptionsProvider,
  TuiAlertComponent,
  TuiAlertService,
  TuiAlert,
  TuiAlerts,
  TuiDateFormat,
  TUI_GROUP_DEFAULT_OPTIONS,
  TUI_GROUP_OPTIONS,
  tuiGroupOptionsProvider,
  TuiGroup,
  TuiHovered,
  TUI_HINT_COMPONENT,
  TuiHintService,
  TuiHintDriver,
  TUI_HINT_DIRECTIONS,
  TUI_HINT_DEFAULT_OPTIONS,
  TUI_HINT_OPTIONS,
  tuiHintOptionsProvider,
  TuiHintOptionsDirective,
  TuiHintHover,
  TuiHintPosition,
  TuiHintDirective,
  TuiHintPointer,
  TuiHintUnstyledComponent,
  TuiHintUnstyled,
  TUI_HINT_PROVIDERS,
  TuiHintBaseComponent,
  TuiHintComponent,
  TuiHintDescribe,
  TuiHintHost,
  TuiHintManual,
  TuiHintOverflow,
  TuiHint,
  TuiHints,
  TuiValidator,
  TUI_DEFAULT_ITEMS_HANDLERS,
  TUI_ITEMS_HANDLERS,
  tuiItemsHandlersProvider,
  TuiItemsHandlersDirective,
  TuiWithItemsHandlers,
  TuiItemsHandlersValidator,
  TuiNumberFormat,
  TuiPopupService,
  TuiPopup,
  TuiPopups,
  TuiSurface,
  TuiLet,
  TuiRepeatTimes,
  TuiAutoColorPipe,
  TuiCalendarSheetPipe,
  TuiFallbackSrcPipe,
  TuiFlagPipe,
  TuiFormatDatePipe,
  TuiFormatNumberPipe,
  TuiInitialsPipe,
  TuiMonthPipe,
  TuiOrderWeekDaysPipe,
  TuiSpinButton,
  TUI_CALENDAR_SHEET_DEFAULT_OPTIONS,
  TUI_CALENDAR_SHEET_OPTIONS,
  tuiCalendarSheetOptionsProvider,
  TuiCalendarSheet,
  TuiCalendarSpin,
  TuiCalendarYear,
  TuiCalendar,
  tuiAutoFocusOptionsProvider,
  TuiAutoFocus,
  TUI_DIALOGS,
  TUI_DIALOG_DEFAULT_OPTIONS,
  TUI_DIALOGS_CLOSE,
  TUI_DIALOG_OPTIONS,
  tuiDialogOptionsProvider,
  TuiDialogCloseService,
  TuiDialogComponent,
  TuiDialogService,
  TuiDialog,
  tuiDialog,
  TuiDialogs,
  TuiError,
  TUI_LOADER_DEFAULT_OPTIONS,
  TUI_LOADER_OPTIONS,
  tuiLoaderOptionsProvider,
  TuiLoader,
  TuiExpandContent,
  TUI_EXPAND_LOADED,
  TuiExpandComponent,
  TuiExpand,
  TuiRoot,
  TuiFullscreen,
  TuiIcon,
  TuiIconPipe,
  TuiNativeValidator,
  WaResizeObserverService,
  WaResizeObserver,
  TUI_TEXTFIELD_OPTIONS,
  tuiTextfieldOptionsProvider,
  TuiTextfieldOptionsDirective,
  TuiSelectLike,
  TUI_TEXTFIELD_ACCESSOR,
  tuiAsTextfieldAccessor,
  TuiTextfieldDropdownDirective,
  TuiWithTextfieldDropdown,
  TuiTextfieldBaseComponent,
  TuiTextfieldComponent,
  TuiTextfieldBase,
  TuiTextfieldDirective,
  TuiWithTextfield,
  TuiSelect,
  TuiTextfieldItemComponent,
  TuiTextfieldMultiComponent,
  TuiTextfield,
  tuiInjectAuxiliary,
  TuiTextfieldContent,
  tuiTextfieldIconBinding,
  TuiWithNativePicker
};
//# sourceMappingURL=chunk-VJWCGFTS.js.map
