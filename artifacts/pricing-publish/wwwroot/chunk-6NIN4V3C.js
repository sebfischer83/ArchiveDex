import {
  CaptureService
} from "./chunk-K3UCMJHQ.js";
import {
  ErrorStateComponent,
  LoadingStateComponent,
  TuiLoader
} from "./chunk-QAVY5BF2.js";
import {
  TuiIcon
} from "./chunk-TDWIJLVP.js";
import {
  TuiActiveZone,
  TuiControl,
  TuiDriver,
  TuiDriverDirective,
  TuiItem,
  TuiNativeValidator,
  TuiPositionAccessor,
  TuiPositionService,
  TuiRectAccessor,
  TuiValidator,
  TuiVisualViewportService,
  tuiAsControl,
  tuiAsDriver,
  tuiAsRectAccessor,
  tuiAsVehicle,
  tuiFallbackAccessor,
  tuiPositionAccessorFor,
  tuiRectAccessorFor
} from "./chunk-L767LOQY.js";
import {
  tuiIsFocused,
  tuiIsObscured
} from "./chunk-ALDSJSHZ.js";
import {
  TuiLink
} from "./chunk-YUXVJ5IX.js";
import {
  BehaviorSubject,
  CHAR_NO_BREAK_SPACE,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DefaultValueAccessor,
  Directive,
  EMPTY_CLIENT_RECT,
  FormControl,
  FormsModule,
  INJECTOR$1,
  Injectable,
  InjectionToken,
  LOCALE_ID,
  NG_VALIDATORS,
  NgControlStatus,
  NgModel,
  NgTemplateOutlet,
  NgZone,
  Observable,
  Pipe,
  PolymorpheusComponent,
  PolymorpheusOutlet,
  Router,
  Subject,
  TUI_BREAKPOINT,
  TUI_COMMON_ICONS,
  TUI_FALSE_HANDLER,
  TUI_TRUE_HANDLER,
  TUI_VERSION,
  TUI_VIEWPORT,
  TemplateRef,
  TranslatePipe,
  TuiAnimated,
  TuiAppearance,
  TuiButton,
  TuiPopupService,
  TuiTitle,
  TuiWithAppearance,
  Validators,
  ViewEncapsulation,
  WA_IS_MOBILE,
  WA_WINDOW,
  __spreadProps,
  __spreadValues,
  coerceArray,
  combineLatest,
  computed,
  contentChild,
  contentChildren,
  debounce,
  delay,
  distinctUntilChanged,
  filter,
  forwardRef,
  fromEvent,
  inject,
  injectContext,
  input,
  map,
  merge,
  model,
  of,
  output,
  outputFromObservable,
  repeat,
  setClassMetadata,
  signal,
  skip,
  startWith,
  switchMap,
  takeUntil,
  takeUntilDestroyed,
  takeWhile,
  tap,
  timer,
  toObservable,
  tuiAppearance,
  tuiAppearanceMode,
  tuiAppearanceOptionsProvider,
  tuiButtonOptionsProvider,
  tuiClamp,
  tuiControlValue,
  tuiCreateOptions,
  tuiExtractI18n,
  tuiIfMap,
  tuiInjectElement,
  tuiIsElement,
  tuiIsPresent,
  tuiPointToClientRect,
  tuiProvide,
  tuiPx,
  tuiRound,
  tuiSetSignal,
  tuiTypedFromEvent,
  tuiWithStyles,
  tuiZoneOptimized,
  tuiZonefreeScheduler,
  ɵsetClassDebugInfo,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuerySignal,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-2IN24IS5.js";

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
    this.\u0275fac = function TuiHoveredService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHoveredService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _TuiHoveredService,
      factory: _TuiHoveredService.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHoveredService, [{
    type: Injectable
  }], () => [], null);
})();
var TuiHovered = class _TuiHovered {
  constructor() {
    this.tuiHoveredChange = outputFromObservable(inject(TuiHoveredService));
  }
  static {
    this.\u0275fac = function TuiHovered_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHovered)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHovered,
      selectors: [["", "tuiHoveredChange", ""]],
      outputs: {
        tuiHoveredChange: "tuiHoveredChange"
      },
      features: [\u0275\u0275ProvidersFeature([TuiHoveredService])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHovered, [{
    type: Directive,
    args: [{
      selector: "[tuiHoveredChange]",
      providers: [TuiHoveredService]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-expand.mjs
var _c0 = ["*"];
function TuiExpand_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngTemplateOutlet", ctx_r0.content() || null);
  }
}
var TuiExpand = class _TuiExpand {
  constructor() {
    this.content = contentChild(TuiItem, {
      read: TemplateRef
    });
    this.open = signal(false);
    this.expanded = input(false);
  }
  ngOnInit() {
    this.open.set(this.expanded());
  }
  onTransitionEnd({
    propertyName
  }) {
    if (propertyName === "grid-template-rows") {
      this.open.set(this.expanded());
    }
  }
  static {
    this.\u0275fac = function TuiExpand_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiExpand)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiExpand,
      selectors: [["tui-expand"]],
      contentQueries: function TuiExpand_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.content, TuiItem, 5, TemplateRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      hostVars: 4,
      hostBindings: function TuiExpand_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("transitionend.self", function TuiExpand_transitionend_self_HostBindingHandler($event) {
            return ctx.onTransitionEnd($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275classProp("_expanded", ctx.expanded())("_open", ctx.open());
        }
      },
      inputs: {
        expanded: [1, "expanded"]
      },
      ngContentSelectors: _c0,
      decls: 3,
      vars: 1,
      consts: [[1, "t-wrapper"], [3, "ngTemplateOutlet"]],
      template: function TuiExpand_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "div", 0);
          \u0275\u0275conditionalCreate(1, TuiExpand_Conditional_1_Template, 1, 1, "ng-container", 1);
          \u0275\u0275projection(2);
          \u0275\u0275elementEnd();
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.expanded() || ctx.open() ? 1 : -1);
        }
      },
      dependencies: [NgTemplateOutlet],
      styles: ["[_nghost-%COMP%]{transition-property:grid-template-rows,padding;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:relative;display:grid;grid-template-rows:0fr;transition-delay:1ms}[_nghost-%COMP%]:not(._expanded){padding-block:0}._expanded[_nghost-%COMP%]{visibility:visible;grid-template-rows:1fr}._expanded[_nghost-%COMP%] > .t-wrapper[_ngcontent-%COMP%]{opacity:1;visibility:visible}._expanded._open[_nghost-%COMP%] > .t-wrapper[_ngcontent-%COMP%]{overflow:visible}.t-wrapper[_ngcontent-%COMP%]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);grid-row:1 / span 2;overflow:hidden;opacity:0;visibility:hidden}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiExpand, [{
    type: Component,
    args: [{
      selector: "tui-expand",
      imports: [NgTemplateOutlet],
      template: `
        <div class="t-wrapper">
            @if (expanded() || open()) {
                <ng-container [ngTemplateOutlet]="content() || null" />
            }
            <ng-content />
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._expanded]": "expanded()",
        "[class._open]": "open()",
        "(transitionend.self)": "onTransitionEnd($event)"
      },
      styles: [":host{transition-property:grid-template-rows,padding;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:relative;display:grid;grid-template-rows:0fr;transition-delay:1ms}:host:not(._expanded){padding-block:0}:host._expanded{visibility:visible;grid-template-rows:1fr}:host._expanded>.t-wrapper{opacity:1;visibility:visible}:host._expanded._open>.t-wrapper{overflow:visible}.t-wrapper{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);grid-row:1 / span 2;overflow:hidden;opacity:0;visibility:hidden}\n"]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-portals-hint.mjs
function TuiHintUnstyledComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
var _c02 = ["*"];
function TuiHintComponent_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 1);
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    \u0275\u0275property("innerHTML", text_r1, \u0275\u0275sanitizeHtml);
  }
}
var TUI_HINT_COMPONENT = new InjectionToken(ngDevMode ? "TUI_HINT_COMPONENT" : "", {
  factory: () => TuiHintComponent
});
var TuiHintDriver = class _TuiHintDriver extends TuiDriverDirective {
  constructor() {
    super(...arguments);
    this.type = "hint";
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiHintDriver_BaseFactory;
      return function TuiHintDriver_Factory(__ngFactoryType__) {
        return (\u0275TuiHintDriver_BaseFactory || (\u0275TuiHintDriver_BaseFactory = \u0275\u0275getInheritedFactory(_TuiHintDriver)))(__ngFactoryType__ || _TuiHintDriver);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintDriver,
      features: [\u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDriver, [{
    type: Directive
  }], null, null);
})();
var TUI_HINT_DIRECTIONS = ["bottom-start", "bottom", "bottom-end", "top-start", "top", "top-end", "start-top", "start", "start-bottom", "end-top", "end", "end-bottom"];
var TUI_HINT_DEFAULT_OPTIONS = {
  direction: "bottom-start",
  centered: true,
  showDelay: 500,
  hideDelay: 200,
  appearance: "",
  /** TODO @deprecated use {@link TUI_TOOLTIP_OPTIONS} instead **/
  icon: "@tui.circle-help"
};
var [TUI_HINT_OPTIONS, tuiHintOptionsProvider] = tuiCreateOptions(TUI_HINT_DEFAULT_OPTIONS);
var TuiHintHover = class _TuiHintHover extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.isMobile = inject(WA_IS_MOBILE);
    this.el = tuiInjectElement();
    this.hovered$ = inject(TuiHoveredService);
    this.options = inject(TUI_HINT_OPTIONS);
    this.visible = false;
    this.toggle$ = new Subject();
    this.stream$ = merge(this.toggle$.pipe(switchMap((show) => this.isMobile ? of(show).pipe(delay(0)) : of(show).pipe(delay(show ? 0 : this.hideDelay()))), takeUntil(this.hovered$), repeat()), this.hovered$.pipe(switchMap((show) => this.isMobile ? of(show).pipe(delay(0)) : of(show).pipe(delay(show ? this.showDelay() : this.hideDelay()))), takeUntil(this.toggle$), repeat())).pipe(filter(() => this.enabled), map((value) => value && (this.el.hasAttribute("tuiHintPointer") || !tuiIsObscured(this.el))), tap((visible) => {
      this.visible = visible;
    }));
    this.parent = inject(_TuiHintHover, {
      optional: true,
      skipSelf: true
    });
    this.showDelay = input(this.options.showDelay, {
      alias: "tuiHintShowDelay"
    });
    this.hideDelay = input(this.options.hideDelay, {
      alias: "tuiHintHideDelay"
    });
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
    this.\u0275fac = function TuiHintHover_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintHover)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintHover,
      inputs: {
        showDelay: [1, "tuiHintShowDelay", "showDelay"],
        hideDelay: [1, "tuiHintHideDelay", "hideDelay"]
      },
      exportAs: ["tuiHintHover"],
      features: [\u0275\u0275ProvidersFeature([tuiAsDriver(_TuiHintHover), TuiHoveredService]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintHover, [{
    type: Directive,
    args: [{
      providers: [tuiAsDriver(TuiHintHover), TuiHoveredService],
      exportAs: "tuiHintHover"
    }]
  }], () => [], null);
})();
var GAP$1 = 8;
var ARROW_OFFSET$1 = 22;
var TOP = 1;
var LEFT = 0;
var TuiHintPosition = class _TuiHintPosition extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.el = tuiInjectElement();
    this.viewport = inject(TUI_VIEWPORT);
    this.options = inject(TUI_HINT_OPTIONS);
    this.directionChange = new Subject();
    this.accessor = tuiFallbackAccessor("hint")(inject(TuiRectAccessor, {
      optional: true
    }), {
      getClientRect: () => this.el.getBoundingClientRect()
    });
    this.points = TUI_HINT_DIRECTIONS.reduce((acc, direction) => __spreadProps(__spreadValues({}, acc), {
      [direction]: [0, 0]
    }), {});
    this.direction = input(this.options.direction, {
      alias: "tuiHintDirection"
    });
    this.offset = input(inject(WA_IS_MOBILE) ? 16 : 8, {
      alias: "tuiHintOffset"
    });
    this.centered = input(this.options.centered, {
      alias: "tuiHintCentered"
    });
    this.tuiHintDirectionChange = outputFromObservable(this.directionChange.pipe(distinctUntilChanged()));
    this.type = "hint";
  }
  getPosition({
    width,
    height
  }) {
    const direction = this.direction();
    const rect = this.accessor.getClientRect();
    const leftCenter = rect.left + rect.width / 2;
    const topCenter = rect.top + rect.height / 2;
    const rtl = this.el.matches('[dir="rtl"] :scope');
    const narrow = rect.width < ARROW_OFFSET$1 * 2 || this.centered();
    const short = rect.height < ARROW_OFFSET$1 * 2 || this.centered();
    const start = narrow ? leftCenter - ARROW_OFFSET$1 : rect.left;
    const end = narrow ? leftCenter - width + ARROW_OFFSET$1 : rect.right - width;
    const top = short ? topCenter - ARROW_OFFSET$1 : rect.top;
    const bottom = short ? topCenter - height + ARROW_OFFSET$1 : rect.bottom - height;
    this.points["top-start"][TOP] = rect.top - height - this.offset();
    this.points["top-start"][LEFT] = this.centered() ? end : start;
    this.points.top[TOP] = this.points["top-start"][TOP];
    this.points.top[LEFT] = leftCenter - width / 2;
    this.points["top-end"][TOP] = this.points["top-start"][TOP];
    this.points["top-end"][LEFT] = this.centered() ? start : end;
    this.points["bottom-start"][TOP] = rect.bottom + this.offset();
    this.points["bottom-start"][LEFT] = this.points["top-start"][LEFT];
    this.points.bottom[TOP] = this.points["bottom-start"][TOP];
    this.points.bottom[LEFT] = this.points.top[LEFT];
    this.points["bottom-end"][TOP] = this.points["bottom-start"][TOP];
    this.points["bottom-end"][LEFT] = this.points["top-end"][LEFT];
    this.points["start-top"][TOP] = this.centered() ? bottom : top;
    this.points["start-top"][LEFT] = rect.left - width - this.offset();
    this.points.start[TOP] = topCenter - height / 2;
    this.points.start[LEFT] = this.points["start-top"][LEFT];
    this.points["start-bottom"][TOP] = this.centered() ? bottom : top;
    this.points["start-bottom"][LEFT] = this.points["start-top"][LEFT];
    this.points["end-top"][TOP] = this.points["start-top"][TOP];
    this.points["end-top"][LEFT] = rect.right + this.offset();
    this.points.end[TOP] = this.points.start[TOP];
    this.points.end[LEFT] = this.points["end-top"][LEFT];
    this.points["end-bottom"][TOP] = this.points["start-bottom"][TOP];
    this.points["end-bottom"][LEFT] = this.points["end-top"][LEFT];
    const array = Array.isArray(direction) ? direction : [direction];
    const priority = array.map((direction2) => adjust(direction2, rtl));
    const updated = priority.concat(TUI_HINT_DIRECTIONS).find((dir) => this.checkPosition(this.points[dir], width, height)) || this.fallback;
    this.directionChange.next(adjust(updated, rtl));
    return this.points[updated];
  }
  get fallback() {
    return this.points.top[TOP] > this.viewport.getClientRect().bottom - this.points.bottom[TOP] ? "top" : "bottom";
  }
  checkPosition([left, top], width, height) {
    const viewport = this.viewport.getClientRect();
    return top > viewport.top + GAP$1 && left > viewport.left + GAP$1 && top + height < viewport.bottom - GAP$1 && left + width < viewport.right - GAP$1;
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiHintPosition_BaseFactory;
      return function TuiHintPosition_Factory(__ngFactoryType__) {
        return (\u0275TuiHintPosition_BaseFactory || (\u0275TuiHintPosition_BaseFactory = \u0275\u0275getInheritedFactory(_TuiHintPosition)))(__ngFactoryType__ || _TuiHintPosition);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintPosition,
      inputs: {
        direction: [1, "tuiHintDirection", "direction"],
        offset: [1, "tuiHintOffset", "offset"],
        centered: [1, "tuiHintCentered", "centered"]
      },
      outputs: {
        tuiHintDirectionChange: "tuiHintDirectionChange"
      },
      features: [\u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintPosition, [{
    type: Directive
  }], null, null);
})();
function adjust(direction, rtl) {
  if (rtl && direction.includes("left")) {
    return direction.replace("left", "right");
  }
  return rtl && direction.includes("right") ? direction.replace("right", "left") : direction;
}
var TuiHintDirective = class _TuiHintDirective {
  constructor() {
    this.service = inject(TuiPopupService);
    this.ref = signal(null);
    this.content = input(null, {
      alias: "tuiHint"
    });
    this.context = input(void 0, {
      alias: "tuiHintContext"
    });
    this.appearance = input(inject(TUI_HINT_OPTIONS).appearance, {
      alias: "tuiHintAppearance"
    });
    this.visible = outputFromObservable(toObservable(this.ref).pipe(map(Boolean), skip(1)), {
      alias: "tuiHintVisible"
    });
    this.component = inject(PolymorpheusComponent);
    this.el = tuiInjectElement();
    this.type = "hint";
  }
  ngOnChanges() {
    if (!this.content()) {
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
    if (show && this.content() && !this.ref()) {
      this.ref.set(this.service.add(this.component));
    } else if (!show) {
      this.ref()?.destroy();
      this.ref.set(null);
    }
  }
  static {
    this.\u0275fac = function TuiHintDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintDirective,
      selectors: [["", "tuiHint", "", 5, "ng-container", 5, "ng-template"]],
      inputs: {
        content: [1, "tuiHint", "content"],
        context: [1, "tuiHintContext", "context"],
        appearance: [1, "tuiHintAppearance", "appearance"]
      },
      outputs: {
        visible: "tuiHintVisible"
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsVehicle(_TuiHintDirective), {
        provide: PolymorpheusComponent,
        deps: [TUI_HINT_COMPONENT, INJECTOR$1],
        useClass: PolymorpheusComponent
      }]), \u0275\u0275HostDirectivesFeature([TuiHintDriver, {
        directive: TuiHintHover,
        inputs: ["tuiHintHideDelay", "tuiHintHideDelay", "tuiHintShowDelay", "tuiHintShowDelay"]
      }, {
        directive: TuiHintPosition,
        inputs: ["tuiHintDirection", "tuiHintDirection", "tuiHintCentered", "tuiHintCentered", "tuiHintOffset", "tuiHintOffset"],
        outputs: ["tuiHintDirectionChange", "tuiHintDirectionChange"]
      }]), \u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDirective, [{
    type: Directive,
    args: [{
      selector: "[tuiHint]:not(ng-container):not(ng-template)",
      providers: [tuiAsVehicle(TuiHintDirective), {
        provide: PolymorpheusComponent,
        deps: [TUI_HINT_COMPONENT, INJECTOR$1],
        useClass: PolymorpheusComponent
      }],
      hostDirectives: [TuiHintDriver, {
        directive: TuiHintHover,
        inputs: ["tuiHintHideDelay", "tuiHintShowDelay"]
      }, {
        directive: TuiHintPosition,
        inputs: ["tuiHintDirection", "tuiHintCentered", "tuiHintOffset"],
        outputs: ["tuiHintDirectionChange"]
      }]
    }]
  }], null, null);
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
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiHintPointer_BaseFactory;
      return function TuiHintPointer_Factory(__ngFactoryType__) {
        return (\u0275TuiHintPointer_BaseFactory || (\u0275TuiHintPointer_BaseFactory = \u0275\u0275getInheritedFactory(_TuiHintPointer)))(__ngFactoryType__ || _TuiHintPointer);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintPointer,
      selectors: [["", "tuiHint", "", "tuiHintPointer", ""]],
      hostBindings: function TuiHintPointer_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("mousemove.zoneless", function TuiHintPointer_mousemove_zoneless_HostBindingHandler($event) {
            return ctx.onMove($event);
          });
        }
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsRectAccessor(_TuiHintPointer), tuiAsDriver(_TuiHintPointer)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintPointer, [{
    type: Directive,
    args: [{
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
    this.hint = inject(TuiHintDirective);
  }
  static {
    this.\u0275fac = function TuiHintUnstyledComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintUnstyledComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiHintUnstyledComponent,
      selectors: [["ng-component"]],
      decls: 1,
      vars: 1,
      consts: [[4, "polymorpheusOutlet"]],
      template: function TuiHintUnstyledComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275template(0, TuiHintUnstyledComponent_ng_container_0_Template, 1, 0, "ng-container", 0);
        }
        if (rf & 2) {
          \u0275\u0275property("polymorpheusOutlet", ctx.hint.content());
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
      imports: [PolymorpheusOutlet],
      template: '<ng-container *polymorpheusOutlet="hint.content()" />',
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var TuiHintUnstyled = class _TuiHintUnstyled {
  constructor() {
    const hint = inject(TuiHintDirective);
    tuiSetSignal(hint.content, inject(TemplateRef));
    hint.component = new PolymorpheusComponent(TuiHintUnstyledComponent, inject(INJECTOR$1));
  }
  static {
    this.\u0275fac = function TuiHintUnstyled_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintUnstyled)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintUnstyled,
      selectors: [["ng-template", "tuiHint", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintUnstyled, [{
    type: Directive,
    args: [{
      selector: "ng-template[tuiHint]"
    }]
  }], () => [], null);
})();
function tuiGetHintProviders() {
  return [TuiPositionService, TuiHoveredService, tuiPositionAccessorFor("hint", TuiHintPosition), tuiRectAccessorFor("hint", forwardRef(() => TuiHintDirective))];
}
var GAP = 8;
var ARROW_OFFSET = 22;
var TuiHintComponent = class _TuiHintComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.hover = inject(TuiHintHover);
    this.vvs = inject(TuiVisualViewportService);
    this.viewport = inject(TUI_VIEWPORT);
    this.pointer = inject(TuiHintPointer, {
      optional: true
    });
    this.accessor = inject(TuiRectAccessor);
    this.hint = inject(TuiHintDirective);
    this.content = this.hint.component.component === TuiHintUnstyledComponent ? signal("") : this.hint.content;
    this.theme = this.hint.el.closest("[tuiTheme]")?.getAttribute("tuiTheme");
    this.appearance = tuiAppearance(this.hint.appearance);
    inject(TuiPositionService).pipe(takeWhile(() => this.hint.el.isConnected && !!this.hint.el.getBoundingClientRect().height), map((point) => this.vvs.correct(point)), takeUntilDestroyed()).subscribe({
      next: (point) => this.update(...point),
      complete: () => this.hint.toggle(false)
    });
    inject(TuiHoveredService).pipe(takeUntilDestroyed()).subscribe((hover) => this.hover.toggle(hover));
  }
  onClick(target) {
    if (!target.closest(this.el.tagName) && !this.hint.el.contains(target) || tuiIsObscured(this.hint.el)) {
      this.hover.toggle(false);
    }
  }
  apply(top, left, beakTop, beakLeft) {
    this.el.style.setProperty("top", top);
    this.el.style.setProperty("left", left);
    this.el.style.setProperty("--t-top", `${beakTop}%`);
    this.el.style.setProperty("--t-left", `${beakLeft}%`);
    this.el.style.setProperty("--t-rotate", !beakLeft || Math.ceil(beakLeft) === 100 ? "90deg" : "0deg");
  }
  update(left, top) {
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
    const startX = Math.round(safeLeft) === Math.round(rect.left);
    const startY = Math.round(top) === Math.round(rect.top);
    const endX = Math.round(safeLeft + clientWidth) === Math.round(rect.right);
    const endY = Math.round(top + clientHeight) === Math.round(rect.bottom);
    const [beakLeft, beakTop] = this.vvs.correct([rect.left + rect.width / 2 - safeLeft, rect.top + rect.height / 2 - top]);
    const x = startX ? ARROW_OFFSET : endX ? clientWidth - ARROW_OFFSET : beakLeft;
    const y = startY ? ARROW_OFFSET : endY ? clientHeight - ARROW_OFFSET : beakTop;
    this.apply(tuiPx(Math.round(top)), tuiPx(Math.round(safeLeft)), Math.round(tuiClamp(y, 0, clientHeight) / clientHeight * 100), Math.round(tuiClamp(x, 0, clientWidth) / clientWidth * 100));
  }
  static {
    this.\u0275fac = function TuiHintComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiHintComponent,
      selectors: [["tui-hint"]],
      hostAttrs: ["role", "tooltip"],
      hostVars: 3,
      hostBindings: function TuiHintComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function TuiHintComponent_click_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          }, \u0275\u0275resolveDocument);
        }
        if (rf & 2) {
          \u0275\u0275attribute("tuiTheme", ctx.theme);
          \u0275\u0275classProp("_untouchable", ctx.pointer);
        }
      },
      features: [\u0275\u0275ProvidersFeature([tuiGetHintProviders(), tuiButtonOptionsProvider({
        size: "s"
      })]), \u0275\u0275HostDirectivesFeature([TuiAppearance, TuiAnimated, TuiActiveZone])],
      ngContentSelectors: _c02,
      decls: 2,
      vars: 2,
      consts: [[3, "innerHTML", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], [3, "innerHTML"]],
      template: function TuiHintComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275template(1, TuiHintComponent_span_1_Template, 1, 1, "span", 0);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275property("polymorpheusOutlet", ctx.content())("polymorpheusOutletContext", ctx.hint.context());
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: [`[_nghost-%COMP%]{position:absolute;max-inline-size:min(20rem,calc(100% - 1rem));padding:.75rem 1rem;background:var(--tui-background-accent-1);border-radius:var(--tui-radius-l);color:var(--tui-text-primary-on-accent-1);box-sizing:border-box;font:var(--tui-typography-body-s);white-space:pre-line;overflow-wrap:break-word;transform-origin:var(--t-left) var(--t-top);--tui-background-elevation-2: var(--tui-background-elevation-3);--tui-scale: .5}.tui-enter[_nghost-%COMP%]{animation:tuiFade var(--tui-duration) var(--tui-curve-expressive-standard),tuiScale var(--tui-duration) var(--tui-curve-expressive-standard) 10ms}.tui-leave[_nghost-%COMP%]{animation:tuiFade calc(var(--tui-duration) / 2) var(--tui-curve-expressive-standard) reverse,tuiScale calc(var(--tui-duration) / 2) var(--tui-curve-expressive-standard) reverse}[_nghost-%COMP%]:before{content:"";position:absolute;inset-block-start:var(--t-top);inset-inline-start:var(--t-left);inline-size:.75rem;block-size:.5rem;background:inherit;-webkit-mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');transition:none;transform:translate(-50%,-50%) rotate(var(--t-rotate))}[_nghost-%COMP%]:not([style*=top]){visibility:hidden}._untouchable[_nghost-%COMP%]{pointer-events:none}[_nghost-%COMP%]     [tuiTitle]{margin-block-end:.75rem}[_nghost-%COMP%]     [tuiTitle]+footer{margin-block-start:.75rem}[_nghost-%COMP%]     [tuiIconButton][data-appearance=icon][data-size=xs]{float:right;margin-inline-end:-.25rem}@supports (float: inline-end){[_nghost-%COMP%]     [tuiIconButton][data-appearance=icon][data-size=xs]{float:inline-end}}[_nghost-%COMP%]     img{display:block;border-radius:var(--tui-radius-m)}[_nghost-%COMP%]     footer{display:flex;justify-content:flex-end;gap:.5rem;inline-size:18rem;max-inline-size:100%;margin:1rem 0 .25rem}`]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintComponent, [{
    type: Component,
    args: [{
      selector: "tui-hint",
      imports: [PolymorpheusOutlet],
      template: `
        <ng-content />
        <span
            *polymorpheusOutlet="content() as text; context: hint.context()"
            [innerHTML]="text"
        ></span>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiGetHintProviders(), tuiButtonOptionsProvider({
        size: "s"
      })],
      hostDirectives: [TuiAppearance, TuiAnimated, TuiActiveZone],
      host: {
        role: "tooltip",
        "[attr.tuiTheme]": "theme",
        "[class._untouchable]": "pointer",
        "(document:click)": "onClick($event.target)"
      },
      styles: [`:host{position:absolute;max-inline-size:min(20rem,calc(100% - 1rem));padding:.75rem 1rem;background:var(--tui-background-accent-1);border-radius:var(--tui-radius-l);color:var(--tui-text-primary-on-accent-1);box-sizing:border-box;font:var(--tui-typography-body-s);white-space:pre-line;overflow-wrap:break-word;transform-origin:var(--t-left) var(--t-top);--tui-background-elevation-2: var(--tui-background-elevation-3);--tui-scale: .5}:host.tui-enter{animation:tuiFade var(--tui-duration) var(--tui-curve-expressive-standard),tuiScale var(--tui-duration) var(--tui-curve-expressive-standard) 10ms}:host.tui-leave{animation:tuiFade calc(var(--tui-duration) / 2) var(--tui-curve-expressive-standard) reverse,tuiScale calc(var(--tui-duration) / 2) var(--tui-curve-expressive-standard) reverse}:host:before{content:"";position:absolute;inset-block-start:var(--t-top);inset-inline-start:var(--t-left);inline-size:.75rem;block-size:.5rem;background:inherit;-webkit-mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');mask-image:url('data:image/svg+xml,<svg viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M3.61336 1.69607L2.44882 2.96493C1.84795 3.61964 0.949361 3.99951 0.00053941 4C0.000359608 4 0.000179805 4 0 4C0.000179863 4 0.000359764 4 0.000539623 4C0.949362 4.00049 1.84795 4.38036 2.44882 5.03506L3.61336 6.30394C4.55981 7.33517 5.03303 7.85079 5.63254 7.96535C5.87433 8.01155 6.12436 8.01155 6.36616 7.96535C6.96567 7.85079 7.43889 7.33517 8.38534 6.30393L9.54988 5.03507C10.1511 4.37994 11.0505 4 12 4C11.0505 4 10.1511 3.62006 9.54988 2.96493L8.38534 1.69606C7.43889 0.664826 6.96567 0.149207 6.36616 0.0346517C6.12436 -0.0115506 5.87433 -0.0115506 5.63254 0.0346517C5.03303 0.149207 4.55981 0.664827 3.61336 1.69607Z" /></svg>');transition:none;transform:translate(-50%,-50%) rotate(var(--t-rotate))}:host:not([style*=top]){visibility:hidden}:host._untouchable{pointer-events:none}:host ::ng-deep [tuiTitle]{margin-block-end:.75rem}:host ::ng-deep [tuiTitle]+footer{margin-block-start:.75rem}:host ::ng-deep [tuiIconButton][data-appearance=icon][data-size=xs]{float:right;margin-inline-end:-.25rem}@supports (float: inline-end){:host ::ng-deep [tuiIconButton][data-appearance=icon][data-size=xs]{float:inline-end}}:host ::ng-deep img{display:block;border-radius:var(--tui-radius-m)}:host ::ng-deep footer{display:flex;justify-content:flex-end;gap:.5rem;inline-size:18rem;max-inline-size:100%;margin:1rem 0 .25rem}
`]
    }]
  }], () => [], null);
})();
var TuiHintDescribe = class _TuiHintDescribe extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.doc = inject(DOCUMENT);
    this.el = tuiInjectElement();
    this.element = computed((id = this.id()) => id ? this.doc.querySelector(`#${id}`) || this.el : this.el);
    this.id = input("", {
      alias: "tuiHintDescribe"
    });
    this.type = "hint";
    this.stream$ = toObservable(this.id).pipe(distinctUntilChanged(), tuiIfMap(() => fromEvent(this.doc, "keydown", {
      capture: true
    }), tuiIsPresent), switchMap(() => this.focused ? of(false) : merge(tuiTypedFromEvent(this.doc, "keyup"), tuiTypedFromEvent(this.element(), "blur")).pipe(map(() => this.focused))), debounce((visible) => visible ? timer(1e3) : of(null)), startWith(false), distinctUntilChanged(), skip(1), tuiZoneOptimized());
  }
  get focused() {
    return tuiIsFocused(this.element());
  }
  static {
    this.\u0275fac = function TuiHintDescribe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintDescribe)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintDescribe,
      selectors: [["", "tuiHintDescribe", ""]],
      inputs: {
        id: [1, "tuiHintDescribe", "id"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsDriver(_TuiHintDescribe)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintDescribe, [{
    type: Directive,
    args: [{
      selector: "[tuiHintDescribe]",
      providers: [tuiAsDriver(TuiHintDescribe)]
    }]
  }], () => [], null);
})();
var TuiHintHost = class _TuiHintHost extends TuiRectAccessor {
  constructor() {
    super(...arguments);
    this.tuiHintHost = input();
    this.type = "hint";
  }
  getClientRect() {
    return this.tuiHintHost()?.getBoundingClientRect() || EMPTY_CLIENT_RECT;
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiHintHost_BaseFactory;
      return function TuiHintHost_Factory(__ngFactoryType__) {
        return (\u0275TuiHintHost_BaseFactory || (\u0275TuiHintHost_BaseFactory = \u0275\u0275getInheritedFactory(_TuiHintHost)))(__ngFactoryType__ || _TuiHintHost);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintHost,
      selectors: [["", "tuiHint", "", "tuiHintHost", ""]],
      inputs: {
        tuiHintHost: [1, "tuiHintHost"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsRectAccessor(_TuiHintHost)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintHost, [{
    type: Directive,
    args: [{
      selector: "[tuiHint][tuiHintHost]",
      providers: [tuiAsRectAccessor(TuiHintHost)]
    }]
  }], null, null);
})();
var TuiHintManual = class _TuiHintManual extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.hover = inject(TuiHintHover);
    this.stream$ = new BehaviorSubject(false);
    this.visible = input(false, {
      alias: "tuiHintManual"
    });
    this.type = "hint";
    this.hover.enabled = false;
  }
  ngOnChanges() {
    this.stream$.next(!!this.visible());
    this.hover.enabled = this.visible() === null;
  }
  static {
    this.\u0275fac = function TuiHintManual_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintManual)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintManual,
      selectors: [["", "tuiHint", "", "tuiHintManual", ""]],
      inputs: {
        visible: [1, "tuiHintManual", "visible"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsDriver(_TuiHintManual)]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiHintManual, [{
    type: Directive,
    args: [{
      selector: "[tuiHint][tuiHintManual]",
      providers: [tuiAsDriver(TuiHintManual)]
    }]
  }], () => [], null);
})();
var TuiHintOverflow = class _TuiHintOverflow {
  constructor() {
    this.hint = inject(TuiHintDirective);
    this.content = input("", {
      alias: "tuiHintOverflow"
    });
  }
  onMouseEnter({
    scrollWidth,
    clientWidth,
    textContent
  }) {
    const content = this.content();
    tuiSetSignal(this.hint.content, scrollWidth > clientWidth && content !== null ? content || textContent : "");
  }
  static {
    this.\u0275fac = function TuiHintOverflow_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiHintOverflow)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiHintOverflow,
      selectors: [["", "tuiHintOverflow", ""]],
      hostBindings: function TuiHintOverflow_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("mouseenter", function TuiHintOverflow_mouseenter_HostBindingHandler($event) {
            return ctx.onMouseEnter($event.currentTarget);
          });
        }
      },
      inputs: {
        content: [1, "tuiHintOverflow", "content"]
      },
      features: [\u0275\u0275HostDirectivesFeature([{
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
      selector: "[tuiHintOverflow]",
      hostDirectives: [{
        directive: TuiHintDirective,
        inputs: ["tuiHintAppearance"]
      }],
      host: {
        "(mouseenter)": "onMouseEnter($event.currentTarget)"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-group.mjs
var TUI_GROUP_DEFAULT_OPTIONS = {
  size: "l",
  collapsed: false,
  rounded: true,
  orientation: "horizontal"
};
var [TUI_GROUP_OPTIONS, tuiGroupOptionsProvider] = tuiCreateOptions(TUI_GROUP_DEFAULT_OPTIONS);
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
      exportAs: ["tui-group-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiGroup]:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;transform:translateZ(0);--t-group-radius: var(--tui-radius-l);--t-group-margin: -1px;--t-group-mask: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-end: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px);--t-group-mask-start: linear-gradient(to right, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) )}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*{z-index:1;flex:1 1 0;min-inline-size:0;-webkit-mask-image:var(--t-group-mask);mask-image:var(--t-group-mask);mask-clip:no-clip}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:disabled,[tuiGroup]:where(*[data-tui-version="5.16.0"])>*._disabled{z-index:0}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:invalid:not([data-mode]),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*[data-mode~=invalid]{z-index:2;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has(:invalid:not([data-mode])),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([data-mode~=invalid]){z-index:2;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has(:focus-visible){z-index:3;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([data-focus=true]){z-index:3;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:checked:not([data-mode]),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*[data-mode~=checked]{z-index:4;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([tuiBlock]:checked){z-index:4;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:not(:last-child){margin-inline-end:var(--t-group-margin)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:nth-child(n){border-radius:0}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:first-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:last-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask-image:none;mask-image:none}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:first-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:last-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask-image:none;mask-image:none}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-size=s],[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-group-radius: var(--tui-radius-m)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]{display:inline-flex;flex-direction:column;--t-group-mask: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-start: linear-gradient(to bottom, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) );--t-group-mask-end: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*{min-block-size:auto;flex:0 0 auto}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:not(:last-child){margin-inline-end:0;margin-block-end:var(--t-group-margin)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:first-child{border-radius:var(--t-group-radius) var(--t-group-radius) 0 0}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:last-child{border-radius:0 0 var(--t-group-radius) var(--t-group-radius)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:only-child{border-radius:var(--t-group-radius)}\n'],
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
      exportAs: `tui-group-${TUI_VERSION}`,
      styles: ['[tuiGroup]:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;transform:translateZ(0);--t-group-radius: var(--tui-radius-l);--t-group-margin: -1px;--t-group-mask: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-end: linear-gradient(to right, rgba(0, 0, 0, .5) 1px, #000 2px);--t-group-mask-start: linear-gradient(to right, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) )}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*{z-index:1;flex:1 1 0;min-inline-size:0;-webkit-mask-image:var(--t-group-mask);mask-image:var(--t-group-mask);mask-clip:no-clip}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:disabled,[tuiGroup]:where(*[data-tui-version="5.16.0"])>*._disabled{z-index:0}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:invalid:not([data-mode]),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*[data-mode~=invalid]{z-index:2;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has(:invalid:not([data-mode])),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([data-mode~=invalid]){z-index:2;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has(:focus-visible){z-index:3;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([data-focus=true]){z-index:3;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:checked:not([data-mode]),[tuiGroup]:where(*[data-tui-version="5.16.0"])>*[data-mode~=checked]{z-index:4;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:has([tuiBlock]:checked){z-index:4;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:not(:last-child){margin-inline-end:var(--t-group-margin)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:nth-child(n){border-radius:0}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:first-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:last-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[tuiGroup]:where(*[data-tui-version="5.16.0"])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask-image:none;mask-image:none}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:first-child{border-radius:0 var(--t-group-radius) var(--t-group-radius) 0;-webkit-mask-image:var(--t-group-mask-end);mask-image:var(--t-group-mask-end)}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:last-child{border-radius:var(--t-group-radius) 0 0 var(--t-group-radius);-webkit-mask-image:var(--t-group-mask-start);mask-image:var(--t-group-mask-start)}[dir=rtl] [tuiGroup]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical])>*:only-child{border-radius:var(--t-group-radius);-webkit-mask-image:none;mask-image:none}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-size=s],[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-group-radius: var(--tui-radius-m)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]{display:inline-flex;flex-direction:column;--t-group-mask: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px, #000 calc(100% - 2px) , rgba(0, 0, 0, .5));--t-group-mask-start: linear-gradient(to bottom, #000 calc(100% - 2px) , rgba(0, 0, 0, .5) calc(100% - 1px) );--t-group-mask-end: linear-gradient(to bottom, rgba(0, 0, 0, .5) 1px, #000 2px)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*{min-block-size:auto;flex:0 0 auto}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:not(:last-child){margin-inline-end:0;margin-block-end:var(--t-group-margin)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:first-child{border-radius:var(--t-group-radius) var(--t-group-radius) 0 0}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:last-child{border-radius:0 0 var(--t-group-radius) var(--t-group-radius)}[tuiGroup]:where(*[data-tui-version="5.16.0"])[data-orientation=vertical]>*:only-child{border-radius:var(--t-group-radius)}\n']
    }]
  }], null, null);
})();
var TuiGroup = class _TuiGroup {
  constructor() {
    this.options = inject(TUI_GROUP_OPTIONS);
    this.nothing = tuiWithStyles(Styles);
    this.orientation = input(this.options.orientation);
    this.collapsed = input(this.options.collapsed);
    this.rounded = input(this.options.rounded);
    this.size = input(this.options.size);
  }
  static {
    this.\u0275fac = function TuiGroup_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiGroup)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiGroup,
      selectors: [["", "tuiGroup", "", 5, "ng-container"]],
      hostAttrs: ["data-tui-version", "5.16.0", "tuiGroup", ""],
      hostVars: 12,
      hostBindings: function TuiGroup_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-orientation", ctx.orientation())("data-size", ctx.size());
          \u0275\u0275styleProp("--t-group-margin", ctx.collapsed() ? null : 0.125, "rem")("--t-group-mask-end", ctx.collapsed() ? null : "none")("--t-group-mask-start", ctx.collapsed() ? null : "none")("--t-group-mask", ctx.collapsed() ? null : "none")("--t-group-radius", ctx.rounded() ? null : 0);
        }
      },
      inputs: {
        orientation: [1, "orientation"],
        collapsed: [1, "collapsed"],
        rounded: [1, "rounded"],
        size: [1, "size"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiGroup, [{
    type: Directive,
    args: [{
      selector: "[tuiGroup]:not(ng-container)",
      host: {
        "data-tui-version": TUI_VERSION,
        tuiGroup: "",
        "[attr.data-orientation]": "orientation()",
        "[attr.data-size]": "size()",
        "[style.--t-group-margin.rem]": "collapsed() ? null : 0.125",
        "[style.--t-group-mask-end]": 'collapsed() ? null : "none"',
        "[style.--t-group-mask-start]": 'collapsed() ? null : "none"',
        "[style.--t-group-mask]": 'collapsed() ? null : "none"',
        "[style.--t-group-radius]": "rounded() ? null : 0"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/kit/fesm2022/taiga-ui-kit-tokens.mjs
var TUI_CONFIRM_WORDS = new InjectionToken(ngDevMode ? "TUI_CONFIRM_WORDS" : "", { factory: tuiExtractI18n("confirm") });
var TUI_CANCEL_WORD = new InjectionToken(ngDevMode ? "TUI_CANCEL_WORD" : "", {
  factory: tuiExtractI18n("cancel")
});
var TUI_DONE_WORD = new InjectionToken(ngDevMode ? "TUI_DONE_WORD" : "", {
  factory: tuiExtractI18n("done")
});
var TUI_MORE_WORD = new InjectionToken(ngDevMode ? "TUI_MORE_WORD" : "", {
  factory: tuiExtractI18n("more")
});
var TUI_HIDE_TEXT = new InjectionToken(ngDevMode ? "TUI_HIDE_TEXT" : "", {
  factory: tuiExtractI18n("hide")
});
var TUI_SHOW_ALL_TEXT = new InjectionToken(ngDevMode ? "TUI_SHOW_ALL_TEXT" : "", { factory: tuiExtractI18n("showAll") });
var TUI_OTHER_DATE_TEXT = new InjectionToken(ngDevMode ? "TUI_OTHER_DATE_TEXT" : "", { factory: tuiExtractI18n("otherDate") });
var TUI_CHOOSE_DAY_OR_RANGE_TEXTS = new InjectionToken(ngDevMode ? "TUI_CHOOSE_DAY_OR_RANGE_TEXTS" : "", { factory: tuiExtractI18n("mobileCalendarTexts") });
var TUI_FROM_TO_TEXTS = new InjectionToken(ngDevMode ? "TUI_FROM_TO_TEXTS" : "", { factory: tuiExtractI18n("range") });
var TUI_PLUS_MINUS_TEXTS = new InjectionToken(ngDevMode ? "TUI_PLUS_MINUS_TEXTS" : "", { factory: tuiExtractI18n("countTexts") });
var TUI_TIME_TEXTS = new InjectionToken(ngDevMode ? "TUI_TIME_TEXTS" : "", {
  factory: tuiExtractI18n("time")
});
var TUI_DATE_TEXTS = new InjectionToken(ngDevMode ? "TUI_DATE_TEXTS" : "", { factory: tuiExtractI18n("dateTexts") });
var TUI_DIGITAL_INFORMATION_UNITS = new InjectionToken(ngDevMode ? "TUI_DIGITAL_INFORMATION_UNITS" : "", { factory: tuiExtractI18n("digitalInformationUnits") });
var TUI_COPY_TEXTS = new InjectionToken(ngDevMode ? "TUI_COPY_TEXTS" : "", {
  factory: tuiExtractI18n("copyTexts")
});
var TUI_PASSWORD_TEXTS = new InjectionToken(ngDevMode ? "TUI_PASSWORD_TEXTS" : "", { factory: tuiExtractI18n("passwordTexts") });
var TUI_CALENDAR_MONTHS = new InjectionToken(ngDevMode ? "TUI_CALENDAR_MONTHS" : "", { factory: tuiExtractI18n("shortCalendarMonths") });
var TUI_FILE_TEXTS = new InjectionToken(ngDevMode ? "TUI_FILE_TEXTS" : "", {
  factory: tuiExtractI18n("fileTexts")
});
var TUI_PAGINATION_TEXTS = new InjectionToken(ngDevMode ? "TUI_PAGINATION_TEXTS" : "", { factory: tuiExtractI18n("pagination") });
var TUI_INPUT_FILE_TEXTS = new InjectionToken(ngDevMode ? "TUI_INPUT_FILE_TEXTS" : "", { factory: tuiExtractI18n("inputFileTexts") });
var TUI_MULTI_SELECT_TEXTS = new InjectionToken(ngDevMode ? "TUI_MULTI_SELECT_TEXTS" : "", { factory: tuiExtractI18n("multiSelectTexts") });
var TUI_COUNTRIES = new InjectionToken(ngDevMode ? "TUI_COUNTRIES" : "", { factory: tuiExtractI18n("countries") });
var TUI_PREVIEW_TEXTS = new InjectionToken(ngDevMode ? "TUI_PREVIEW_TEXTS" : "", { factory: tuiExtractI18n("previewTexts") });
var TUI_PREVIEW_ZOOM_TEXTS = new InjectionToken(ngDevMode ? "TUI_PREVIEW_ZOOM_TEXTS" : "", { factory: tuiExtractI18n("zoomTexts") });
var TUI_INTERNATIONAL_SEARCH = new InjectionToken(ngDevMode ? "TUI_INTERNATIONAL_SEARCH" : "", { factory: tuiExtractI18n("phoneSearch") });
var TUI_DAY_RANGE_PERIODS = new InjectionToken(ngDevMode ? "TUI_DAY_RANGE_PERIODS" : "", { factory: tuiExtractI18n("dayRangePeriods") });

// node_modules/@taiga-ui/kit/fesm2022/taiga-ui-kit-components-files.mjs
var _c03 = ["*"];
var _c1 = (a0) => ({
  $implicit: a0
});
function TuiFile_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r1, " ");
  }
}
function TuiFile_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.fileSize(), " ");
  }
}
function TuiFile_Conditional_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const text_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r3, " ");
  }
}
function TuiFile_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275template(1, TuiFile_Conditional_9_ng_container_1_Template, 2, 1, "ng-container", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("polymorpheusOutlet", ctx);
  }
}
function TuiFile_Conditional_11_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click.prevent", function TuiFile_Conditional_11_Conditional_0_Template_button_click_prevent_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.remove.emit());
    })("mousedown.prevent.zoneless", function TuiFile_Conditional_11_Conditional_0_Template_button_mousedown_prevent_zoneless_0_listener() {
      return 0;
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("iconStart", ctx_r1.icons.close);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx.remove, " ");
  }
}
function TuiFile_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TuiFile_Conditional_11_Conditional_0_Template, 2, 2, "button", 9);
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional((tmp_2_0 = ctx_r1.fileTexts()) ? 0 : -1, tmp_2_0);
  }
}
function TuiFile_ng_template_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 11);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("src", ctx_r1.preview(), \u0275\u0275sanitizeUrl);
  }
}
function TuiFile_ng_template_12_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tui-loader", 12);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("inheritColor", ctx_r1.size() === "l");
  }
}
function TuiFile_ng_template_12_Conditional_1_Conditional_1_tui_icon_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tui-icon", 15);
  }
  if (rf & 2) {
    const src_r5 = ctx.polymorpheusOutlet;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("t-icon_blank", ctx_r1.size() === "l" || ctx_r1.state() === "deleted")("t-icon_error", ctx_r1.state() === "error");
    \u0275\u0275property("icon", src_r5.toString());
  }
}
function TuiFile_ng_template_12_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, TuiFile_ng_template_12_Conditional_1_Conditional_1_tui_icon_0_Template, 1, 5, "tui-icon", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("polymorpheusOutlet", ctx_r1.icon())("polymorpheusOutletContext", \u0275\u0275pureFunction1(2, _c1, ctx_r1.size()));
  }
}
function TuiFile_ng_template_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TuiFile_ng_template_12_Conditional_1_Conditional_0_Template, 1, 1, "tui-loader", 12)(1, TuiFile_ng_template_12_Conditional_1_Conditional_1_Template, 1, 4, "tui-icon", 13);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.state() === "loading" ? 0 : 1);
  }
}
function TuiFile_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TuiFile_ng_template_12_Conditional_0_Template, 1, 1, "img", 11)(1, TuiFile_ng_template_12_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.preview() ? 0 : 1);
  }
}
function TuiFilesComponent_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 0);
  }
  if (rf & 2) {
    const item_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngTemplateOutlet", item_r1);
  }
}
function TuiFilesComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TuiFilesComponent_For_2_Conditional_0_Template, 1, 1, "ng-container", 0);
  }
  if (rf & 2) {
    const $index_r2 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!ctx_r2.max() || $index_r2 < ctx_r2.max() ? 0 : -1);
  }
}
function TuiFilesComponent_Conditional_3_For_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 0);
  }
  if (rf & 2) {
    const item_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngTemplateOutlet", item_r5);
  }
}
function TuiFilesComponent_Conditional_3_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, TuiFilesComponent_Conditional_3_For_3_Conditional_0_Template, 1, 1, "ng-container", 0);
  }
  if (rf & 2) {
    const $index_r6 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r2.max() && $index_r6 >= ctx_r2.max() ? 0 : -1);
  }
}
function TuiFilesComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tui-expand", 1)(1, "div", 2);
    \u0275\u0275repeaterCreate(2, TuiFilesComponent_Conditional_3_For_3_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 3)(5, "button", 4);
    \u0275\u0275listener("click", function TuiFilesComponent_Conditional_3_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.expanded.set(!ctx_r2.expanded()));
    });
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("expanded", ctx_r2.expanded());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.items());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("t-bottom_collapsed", !ctx_r2.expanded());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.expanded() ? ctx_r2.hideText() : ctx_r2.showAllText(), " ");
  }
}
function TuiInputFilesContent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r0.context.$implicit ? ctx_r0.dragged() : ctx_r0.label(), " ");
  }
}
function TuiInputFiles_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r1, " ");
  }
}
var TUI_SIZE_ERROR = "tuiSize";
var TUI_FORMAT_ERROR = "tuiFormat";
function tuiCreateFileSizeValidator(size) {
  return ({
    value
  }) => {
    const files = value && coerceArray(value);
    const $implicit = value && files?.filter((file) => file.size > size);
    return $implicit?.length ? {
      [TUI_SIZE_ERROR]: {
        $implicit,
        size
      }
    } : null;
  };
}
function tuiCreateFileFormatValidator(accept) {
  return ({
    value
  }) => {
    const files = value && coerceArray(value);
    const formats = toArray$1(accept);
    const $implicit = value && files?.filter((file) => !checkFormat(file, formats));
    return $implicit?.length && accept ? {
      [TUI_FORMAT_ERROR]: {
        $implicit
      }
    } : null;
  };
}
function checkFormat({
  name,
  type
}, formats) {
  const extension = `.${(name.split(".").pop() || "").toLowerCase()}`;
  const normalizedType = type?.toLowerCase() || "";
  return formats.some((format) => format === extension || format === normalizedType || format.split("/")[1] === "*" && normalizedType.split("/")[0] === format.split("/")[0]);
}
function toArray$1(accept) {
  return accept.split(",").map((format) => format.trim().toLowerCase()).filter(Boolean);
}
var BYTES_PER_KIB = 1024;
var BYTES_PER_MIB = 1024 * BYTES_PER_KIB;
function tuiFilesRejected(control) {
  const format = control?.getError(TUI_FORMAT_ERROR)?.$implicit || [];
  const size = control?.getError(TUI_SIZE_ERROR)?.$implicit || [];
  return Array.from(/* @__PURE__ */ new Set([...format, ...size]));
}
function tuiFormatSize(units, size, locale) {
  if (size === void 0) {
    return null;
  }
  if (size < BYTES_PER_KIB) {
    return `${size} ${units[0]}`;
  }
  return size < BYTES_PER_MIB ? `${(size / BYTES_PER_KIB).toFixed(0)} ${units[1]}` : `${tuiRound(size / BYTES_PER_MIB, 2).toLocaleString(locale)} ${units[2]}`;
}
var TUI_FILE_DEFAULT_OPTIONS = {
  appearance: "outline",
  formatSize: tuiFormatSize,
  icons: {
    normal: ({
      $implicit
    }) => $implicit === "l" ? "@tui.file" : "@tui.circle-check",
    error: "@tui.circle-alert",
    deleted: "@tui.trash"
  }
};
var [TUI_FILE_OPTIONS, tuiFileOptionsProvider] = tuiCreateOptions(TUI_FILE_DEFAULT_OPTIONS);
var TuiFile = class _TuiFile {
  constructor() {
    this.options = inject(TUI_FILE_OPTIONS);
    this.locale = inject(LOCALE_ID);
    this.units = inject(TUI_DIGITAL_INFORMATION_UNITS);
    this.win = inject(WA_WINDOW);
    this.icons = inject(TUI_COMMON_ICONS);
    this.fileTexts = inject(TUI_FILE_TEXTS);
    this.content = computed(() => this.state() === "error" && !this.file().content ? this.fileTexts().loadingError : this.file().content || "");
    this.fileSize = computed(() => this.options.formatSize(this.units(), this.file().size, this.locale));
    this.preview = computed(() => this.size() === "l" ? this.createPreview(this.file()) : "");
    this.name = computed(() => {
      const dot = this.file().name.lastIndexOf(".");
      return dot > 0 ? this.file().name.slice(0, dot) : this.file().name;
    });
    this.type = computed(() => {
      const dot = this.file().name.lastIndexOf(".");
      return dot > 0 ? this.file().name.slice(dot) : "";
    });
    this.icon = computed((state = this.state()) => state === "loading" ? "" : this.options.icons[state]);
    this.file = input({
      name: ""
    });
    this.state = input("normal");
    this.size = input("m");
    this.showDelete = input(true);
    this.showSize = input(true);
    this.leftContent = input();
    this.remove = output();
  }
  get allowDelete() {
    return this.showDelete() && !!this.remove["listeners"]?.length;
  }
  createPreview(file) {
    if (file.src) {
      return file.src;
    }
    return this.win.File && file instanceof this.win.File && file.type?.startsWith("image/") ? URL.createObjectURL(file) : "";
  }
  static {
    this.\u0275fac = function TuiFile_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFile)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiFile,
      selectors: [["tui-file"], ["a", "tuiFile", ""], ["button", "tuiFile", ""]],
      hostVars: 1,
      hostBindings: function TuiFile_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-delete", ctx.showDelete());
        }
      },
      inputs: {
        file: [1, "file"],
        state: [1, "state"],
        size: [1, "size"],
        showDelete: [1, "showDelete"],
        showSize: [1, "showSize"],
        leftContent: [1, "leftContent"]
      },
      outputs: {
        remove: "remove"
      },
      features: [\u0275\u0275ProvidersFeature([tuiAppearanceOptionsProvider(TUI_FILE_OPTIONS)]), \u0275\u0275HostDirectivesFeature([TuiAppearance])],
      ngContentSelectors: _c03,
      decls: 14,
      vars: 8,
      consts: [["defaultLeftContent", ""], [1, "t-preview"], [4, "polymorpheusOutlet"], [1, "t-wrapper"], [1, "t-text"], ["tuiHintOverflow", "", 1, "t-name"], [1, "t-type"], [1, "t-size"], [1, "t-content"], ["appearance", "icon", "size", "xs", "tuiIconButton", "", "type", "button", 1, "t-remove", 3, "iconStart"], ["appearance", "icon", "size", "xs", "tuiIconButton", "", "type", "button", 1, "t-remove", 3, "click.prevent", "mousedown.prevent.zoneless", "iconStart"], ["alt", "file preview", 1, "t-image", 3, "src"], [1, "t-loader", 3, "inheritColor"], [1, "t-icon", 3, "t-icon_blank", "t-icon_error", "icon"], ["class", "t-icon", 3, "t-icon_blank", "t-icon_error", "icon", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-icon", 3, "icon"]],
      template: function TuiFile_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "div", 1);
          \u0275\u0275template(1, TuiFile_ng_container_1_Template, 2, 1, "ng-container", 2);
          \u0275\u0275elementEnd();
          \u0275\u0275elementStart(2, "div", 3)(3, "div", 4)(4, "div", 5);
          \u0275\u0275text(5);
          \u0275\u0275elementEnd();
          \u0275\u0275elementStart(6, "div", 6);
          \u0275\u0275text(7);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(8, TuiFile_Conditional_8_Template, 2, 1, "div", 7);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(9, TuiFile_Conditional_9_Template, 2, 1, "div", 8);
          \u0275\u0275projection(10);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(11, TuiFile_Conditional_11_Template, 1, 1);
          \u0275\u0275template(12, TuiFile_ng_template_12_Template, 2, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
        }
        if (rf & 2) {
          let tmp_6_0;
          const defaultLeftContent_r6 = \u0275\u0275reference(13);
          \u0275\u0275classProp("t-preview_big", ctx.size() === "l");
          \u0275\u0275advance();
          \u0275\u0275property("polymorpheusOutlet", ctx.leftContent() || defaultLeftContent_r6);
          \u0275\u0275advance(4);
          \u0275\u0275textInterpolate1(" ", ctx.name(), " ");
          \u0275\u0275advance(2);
          \u0275\u0275textInterpolate(ctx.type());
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.showSize() && ctx.fileSize() ? 8 : -1);
          \u0275\u0275advance();
          \u0275\u0275conditional((tmp_6_0 = ctx.content()) ? 9 : -1, tmp_6_0);
          \u0275\u0275advance(2);
          \u0275\u0275conditional(ctx.allowDelete ? 11 : -1);
        }
      },
      dependencies: [PolymorpheusOutlet, TuiButton, TuiHintOverflow, TuiIcon, TuiLoader],
      styles: ['[_nghost-%COMP%]{position:relative;display:flex;align-items:center;font:var(--tui-typography-body-m);padding:.625rem;padding-inline-end:2.25rem;text-decoration:none;border-radius:var(--tui-radius-m)}[_nghost-%COMP%]:hover   .t-remove[_ngcontent-%COMP%], [data-delete=always][_nghost-%COMP%]   .t-remove[_ngcontent-%COMP%]{opacity:1}.t-preview[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;inline-size:1.5rem;block-size:1.5rem;margin-inline-end:.75rem;border-radius:var(--tui-radius-m);overflow:hidden;color:var(--tui-text-tertiary)}.t-preview_big[_ngcontent-%COMP%]{inline-size:4rem;block-size:4rem;margin-inline-end:1rem}.t-preview_big[_ngcontent-%COMP%]:before{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;content:"";background:var(--tui-background-neutral-1)}.t-image[_ngcontent-%COMP%]{max-inline-size:100%;max-block-size:100%}.t-loader[_ngcontent-%COMP%]{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%}.t-icon[_ngcontent-%COMP%]{position:absolute;inset-block-start:0;inset-inline-start:0;inset-block-end:0;inset-inline-end:0;color:var(--tui-status-positive);margin:auto}.t-icon_blank[_ngcontent-%COMP%]{color:var(--tui-text-tertiary)}.t-icon_error[_ngcontent-%COMP%]{color:var(--tui-text-negative)}.t-remove[_ngcontent-%COMP%]{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:absolute;inset-block-start:.625rem;inset-inline-end:.625rem}.t-remove[_ngcontent-%COMP%]:focus{opacity:1}.t-remove[_ngcontent-%COMP%]:focus-visible{box-shadow:inset 0 0 0 2px var(--tui-border-focus)}@media(hover:hover)and (pointer:fine){.t-remove[_ngcontent-%COMP%]{opacity:0}}.t-wrapper[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;overflow:hidden;color:var(--tui-text-primary)}.t-text[_ngcontent-%COMP%]{display:flex;inline-size:100%}.t-size[_ngcontent-%COMP%]{flex-shrink:0;opacity:var(--tui-disabled-opacity);margin-inline-start:.5rem}.t-type[_ngcontent-%COMP%]{flex-shrink:0}.t-name[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.t-content[_ngcontent-%COMP%]{font:var(--tui-typography-body-s);color:var(--tui-text-negative)}']
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFile, [{
    type: Component,
    args: [{
      selector: "tui-file,a[tuiFile],button[tuiFile]",
      imports: [PolymorpheusOutlet, TuiButton, TuiHintOverflow, TuiIcon, TuiLoader],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAppearanceOptionsProvider(TUI_FILE_OPTIONS)],
      hostDirectives: [TuiAppearance],
      host: {
        "[attr.data-delete]": "showDelete()"
      },
      template: `<div
    class="t-preview"
    [class.t-preview_big]="size() === 'l'"
>
    <ng-container *polymorpheusOutlet="leftContent() || defaultLeftContent as text">
        {{ text }}
    </ng-container>
</div>
<div class="t-wrapper">
    <div class="t-text">
        <div
            tuiHintOverflow
            class="t-name"
        >
            {{ name() }}
        </div>
        <div class="t-type">{{ type() }}</div>
        @if (showSize() && fileSize()) {
            <div class="t-size">
                {{ fileSize() }}
            </div>
        }
    </div>
    @if (content(); as text) {
        <div class="t-content">
            <ng-container *polymorpheusOutlet="text">
                {{ text }}
            </ng-container>
        </div>
    }
    <ng-content />
</div>
@if (allowDelete) {
    @if (fileTexts(); as texts) {
        <button
            appearance="icon"
            size="xs"
            tuiIconButton
            type="button"
            class="t-remove"
            [iconStart]="icons.close"
            (click.prevent)="remove.emit()"
            (mousedown.prevent.zoneless)="(0)"
        >
            {{ texts.remove }}
        </button>
    }
}

<ng-template #defaultLeftContent>
    @if (preview()) {
        <img
            alt="file preview"
            class="t-image"
            [src]="preview()"
        />
    } @else {
        @if (state() === 'loading') {
            <tui-loader
                class="t-loader"
                [inheritColor]="size() === 'l'"
            />
        } @else {
            <tui-icon
                *polymorpheusOutlet="icon() as src; context: {$implicit: size()}"
                class="t-icon"
                [class.t-icon_blank]="size() === 'l' || state() === 'deleted'"
                [class.t-icon_error]="state() === 'error'"
                [icon]="src.toString()"
            />
        }
    }
</ng-template>
`,
      styles: [':host{position:relative;display:flex;align-items:center;font:var(--tui-typography-body-m);padding:.625rem;padding-inline-end:2.25rem;text-decoration:none;border-radius:var(--tui-radius-m)}:host:hover .t-remove,:host[data-delete=always] .t-remove{opacity:1}.t-preview{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;inline-size:1.5rem;block-size:1.5rem;margin-inline-end:.75rem;border-radius:var(--tui-radius-m);overflow:hidden;color:var(--tui-text-tertiary)}.t-preview_big{inline-size:4rem;block-size:4rem;margin-inline-end:1rem}.t-preview_big:before{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;content:"";background:var(--tui-background-neutral-1)}.t-image{max-inline-size:100%;max-block-size:100%}.t-loader{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%}.t-icon{position:absolute;inset-block-start:0;inset-inline-start:0;inset-block-end:0;inset-inline-end:0;color:var(--tui-status-positive);margin:auto}.t-icon_blank{color:var(--tui-text-tertiary)}.t-icon_error{color:var(--tui-text-negative)}.t-remove{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);position:absolute;inset-block-start:.625rem;inset-inline-end:.625rem}.t-remove:focus{opacity:1}.t-remove:focus-visible{box-shadow:inset 0 0 0 2px var(--tui-border-focus)}@media(hover:hover)and (pointer:fine){.t-remove{opacity:0}}.t-wrapper{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;overflow:hidden;color:var(--tui-text-primary)}.t-text{display:flex;inline-size:100%}.t-size{flex-shrink:0;opacity:var(--tui-disabled-opacity);margin-inline-start:.5rem}.t-type{flex-shrink:0}.t-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.t-content{font:var(--tui-typography-body-s);color:var(--tui-text-negative)}\n']
    }]
  }], null, null);
})();
var TuiFilesComponent = class _TuiFilesComponent {
  constructor() {
    this.hideText = inject(TUI_HIDE_TEXT);
    this.showAllText = inject(TUI_SHOW_ALL_TEXT);
    this.items = contentChildren(TuiItem, {
      read: TemplateRef
    });
    this.max = input(0);
    this.expanded = model(false);
  }
  static {
    this.\u0275fac = function TuiFilesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFilesComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiFilesComponent,
      selectors: [["tui-files"]],
      contentQueries: function TuiFilesComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.items, TuiItem, 4, TemplateRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      inputs: {
        max: [1, "max"],
        expanded: [1, "expanded"]
      },
      outputs: {
        expanded: "expandedChange"
      },
      features: [\u0275\u0275ProvidersFeature([tuiGroupOptionsProvider({
        size: "m",
        collapsed: true,
        orientation: "vertical"
      })]), \u0275\u0275HostDirectivesFeature([TuiGroup])],
      ngContentSelectors: _c03,
      decls: 4,
      vars: 1,
      consts: [[3, "ngTemplateOutlet"], [3, "expanded"], ["tuiGroup", "", 1, "t-extra-items"], [1, "t-bottom"], ["appearance", "outline", "size", "m", "tuiButton", "", "type", "button", 1, "t-button", 3, "click"]],
      template: function TuiFilesComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275repeaterCreate(1, TuiFilesComponent_For_2_Template, 1, 1, null, null, \u0275\u0275repeaterTrackByIndex);
          \u0275\u0275conditionalCreate(3, TuiFilesComponent_Conditional_3_Template, 7, 4);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275repeater(ctx.items());
          \u0275\u0275advance(2);
          \u0275\u0275conditional(ctx.max() && ctx.items().length > ctx.max() ? 3 : -1);
        }
      },
      dependencies: [NgTemplateOutlet, TuiButton, TuiExpand, TuiGroup],
      styles: ['tui-files:where(*[data-tui-version="5.16.0"]){inline-size:100%;overflow:hidden;border-radius:var(--tui-radius-m)}tui-files:where(*[data-tui-version="5.16.0"]):empty:empty{display:none}tui-files:where(*[data-tui-version="5.16.0"]) .t-files{position:relative;display:block;inline-size:100%;block-size:100%;border-radius:var(--tui-radius-m);overflow:hidden}tui-files:where(*[data-tui-version="5.16.0"]) .t-button{inline-size:100%;border-radius:inherit}tui-files:where(*[data-tui-version="5.16.0"]) .t-bottom{z-index:3;inline-size:100%;background:var(--tui-background-base);-webkit-mask-image:none!important;mask-image:none!important}tui-files:where(*[data-tui-version="5.16.0"]) .t-bottom_collapsed{box-shadow:var(--tui-shadow-popup);margin-block-start:-1.5rem}tui-files:where(*[data-tui-version="5.16.0"]) .t-extra-items{inline-size:100%}tui-files:where(*[data-tui-version="5.16.0"]) .t-extra-items>*{border-radius:0!important}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFilesComponent, [{
    type: Component,
    args: [{
      selector: "tui-files",
      imports: [NgTemplateOutlet, TuiButton, TuiExpand, TuiGroup],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiGroupOptionsProvider({
        size: "m",
        collapsed: true,
        orientation: "vertical"
      })],
      hostDirectives: [TuiGroup],
      template: '<ng-content />\n@for (item of items(); track $index) {\n    @if (!max() || $index < max()) {\n        <ng-container [ngTemplateOutlet]="item" />\n    }\n}\n@if (max() && items().length > max()) {\n    <tui-expand [expanded]="expanded()">\n        <div\n            tuiGroup\n            class="t-extra-items"\n        >\n            @for (item of items(); track $index) {\n                @if (max() && $index >= max()) {\n                    <ng-container [ngTemplateOutlet]="item" />\n                }\n            }\n        </div>\n    </tui-expand>\n    <div\n        class="t-bottom"\n        [class.t-bottom_collapsed]="!expanded()"\n    >\n        <button\n            appearance="outline"\n            size="m"\n            tuiButton\n            type="button"\n            class="t-button"\n            (click)="expanded.set(!expanded())"\n        >\n            {{ expanded() ? hideText() : showAllText() }}\n        </button>\n    </div>\n}\n',
      styles: ['tui-files:where(*[data-tui-version="5.16.0"]){inline-size:100%;overflow:hidden;border-radius:var(--tui-radius-m)}tui-files:where(*[data-tui-version="5.16.0"]):empty:empty{display:none}tui-files:where(*[data-tui-version="5.16.0"]) .t-files{position:relative;display:block;inline-size:100%;block-size:100%;border-radius:var(--tui-radius-m);overflow:hidden}tui-files:where(*[data-tui-version="5.16.0"]) .t-button{inline-size:100%;border-radius:inherit}tui-files:where(*[data-tui-version="5.16.0"]) .t-bottom{z-index:3;inline-size:100%;background:var(--tui-background-base);-webkit-mask-image:none!important;mask-image:none!important}tui-files:where(*[data-tui-version="5.16.0"]) .t-bottom_collapsed{box-shadow:var(--tui-shadow-popup);margin-block-start:-1.5rem}tui-files:where(*[data-tui-version="5.16.0"]) .t-extra-items{inline-size:100%}tui-files:where(*[data-tui-version="5.16.0"]) .t-extra-items>*{border-radius:0!important}\n']
    }]
  }], null, null);
})();
var TuiInputFilesContent = class _TuiInputFilesContent {
  constructor() {
    this.texts = inject(TUI_INPUT_FILE_TEXTS);
    this.component = inject(TuiInputFiles);
    this.breakpoint = inject(TUI_BREAKPOINT);
    this.context = injectContext();
    this.link = computed(() => this.component.input()?.el.multiple ? this.texts().defaultLinkMultiple : this.texts().defaultLinkSingle);
    this.label = computed(() => this.component.input()?.el.multiple ? this.texts().defaultLabelMultiple : this.texts().defaultLabelSingle);
    this.dragged = computed(() => this.component.input()?.el.multiple ? this.texts().dropMultiple : this.texts().drop);
  }
  static {
    this.\u0275fac = function TuiInputFilesContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiInputFilesContent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiInputFilesContent,
      selectors: [["ng-component"]],
      decls: 3,
      vars: 2,
      consts: [["tuiLink", ""]],
      template: function TuiInputFilesContent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "a", 0);
          \u0275\u0275text(1);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(2, TuiInputFilesContent_Conditional_2_Template, 1, 1);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275textInterpolate(ctx.context.$implicit ? "" : ctx.link());
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.breakpoint() !== "mobile" ? 2 : -1);
        }
      },
      dependencies: [TuiLink],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInputFilesContent, [{
    type: Component,
    args: [{
      imports: [TuiLink],
      template: `
        <a tuiLink>{{ context.$implicit ? '' : link() }}</a>
        @if (breakpoint() !== 'mobile') {
            {{ context.$implicit ? dragged() : label() }}
        }
    `,
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
var TUI_INPUT_FILES_DEFAULT_OPTIONS = {
  appearance: "file",
  accept: "",
  multiple: false,
  size: "l",
  maxFileSize: 30 * 1024 * 1024
  // 30 MiB
};
var [TUI_INPUT_FILES_OPTIONS, tuiInputFilesOptionsProvider] = tuiCreateOptions(TUI_INPUT_FILES_DEFAULT_OPTIONS);
var TuiInputFilesValidator = class _TuiInputFilesValidator extends TuiValidator {
  constructor() {
    super(...arguments);
    this.options = inject(TUI_INPUT_FILES_OPTIONS);
    this.accept = this.options.accept;
    this.maxFileSize = this.options.maxFileSize;
  }
  ngOnChanges() {
    this.update();
  }
  ngOnInit() {
    this.update();
  }
  update() {
    this.validate = Validators.compose([tuiCreateFileFormatValidator(this.accept), tuiCreateFileSizeValidator(this.maxFileSize)]) || Validators.nullValidator;
    this.onChange();
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiInputFilesValidator_BaseFactory;
      return function TuiInputFilesValidator_Factory(__ngFactoryType__) {
        return (\u0275TuiInputFilesValidator_BaseFactory || (\u0275TuiInputFilesValidator_BaseFactory = \u0275\u0275getInheritedFactory(_TuiInputFilesValidator)))(__ngFactoryType__ || _TuiInputFilesValidator);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiInputFilesValidator,
      hostVars: 1,
      hostBindings: function TuiInputFilesValidator_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275domProperty("accept", ctx.accept);
        }
      },
      inputs: {
        accept: "accept",
        maxFileSize: "maxFileSize"
      },
      exportAs: ["tuiInputFilesValidator"],
      features: [\u0275\u0275ProvidersFeature([tuiProvide(NG_VALIDATORS, _TuiInputFilesValidator, true)]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInputFilesValidator, [{
    type: Directive,
    args: [{
      inputs: ["accept", "maxFileSize"],
      providers: [tuiProvide(NG_VALIDATORS, TuiInputFilesValidator, true)],
      exportAs: "tuiInputFilesValidator",
      host: {
        "[accept]": "accept"
      }
    }]
  }], null, null);
})();
var TuiInputFilesDirective = class _TuiInputFilesDirective extends TuiControl {
  constructor() {
    super(...arguments);
    this.m = tuiAppearanceMode(this.mode);
    this.el = tuiInjectElement();
    this.reject = outputFromObservable(timer(0, tuiZonefreeScheduler()).pipe(switchMap(() => tuiControlValue(this.control.control)), map(() => tuiFilesRejected(this.control.control)), filter(({
      length
    }) => !!length)));
  }
  process(files) {
    const fileOrFiles = this.el.multiple ? [...toArray(this.value()), ...Array.from(files)] : files[0];
    if (fileOrFiles) {
      this.onChange(fileOrFiles);
    }
  }
  onClick(event) {
    if (this.el.readOnly) {
      event.preventDefault();
    }
  }
  onBlur() {
    if (this.el !== this.el.ownerDocument.activeElement) {
      this.onTouched();
    }
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiInputFilesDirective_BaseFactory;
      return function TuiInputFilesDirective_Factory(__ngFactoryType__) {
        return (\u0275TuiInputFilesDirective_BaseFactory || (\u0275TuiInputFilesDirective_BaseFactory = \u0275\u0275getInheritedFactory(_TuiInputFilesDirective)))(__ngFactoryType__ || _TuiInputFilesDirective);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiInputFilesDirective,
      selectors: [["input", "tuiInputFiles", ""]],
      hostAttrs: ["title", "", "type", "file"],
      hostVars: 1,
      hostBindings: function TuiInputFilesDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("blur", function TuiInputFilesDirective_blur_HostBindingHandler() {
            return ctx.onBlur();
          })("click", function TuiInputFilesDirective_click_HostBindingHandler($event) {
            return ctx.onClick($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275domProperty("disabled", ctx.disabled());
        }
      },
      outputs: {
        reject: "reject"
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsControl(_TuiInputFilesDirective), tuiAppearanceOptionsProvider(TUI_INPUT_FILES_OPTIONS)]), \u0275\u0275HostDirectivesFeature([TuiNativeValidator, TuiWithAppearance, {
        directive: TuiInputFilesValidator,
        inputs: ["accept", "accept", "maxFileSize", "maxFileSize"]
      }]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInputFilesDirective, [{
    type: Directive,
    args: [{
      selector: "input[tuiInputFiles]",
      providers: [tuiAsControl(TuiInputFilesDirective), tuiAppearanceOptionsProvider(TUI_INPUT_FILES_OPTIONS)],
      hostDirectives: [TuiNativeValidator, TuiWithAppearance, {
        directive: TuiInputFilesValidator,
        inputs: ["accept", "maxFileSize"]
      }],
      host: {
        title: "",
        type: "file",
        "[disabled]": "disabled()",
        "(blur)": "onBlur()",
        "(click)": "onClick($event)"
      }
    }]
  }], null, null);
})();
function toArray(value) {
  return value ? coerceArray(value) : [];
}
var TuiInputFiles = class _TuiInputFiles {
  constructor() {
    this.options = inject(TUI_INPUT_FILES_OPTIONS);
    this.content = new PolymorpheusComponent(TuiInputFilesContent);
    this.template = contentChild(TemplateRef);
    this.input = contentChild(TuiInputFilesDirective);
    this.size = input(this.options.size, {
      alias: "tuiInputFiles"
    });
  }
  get fileDragged() {
    return !!this.files && !this.input()?.disabled();
  }
  onFilesSelected(input2) {
    if (!input2?.files) {
      return;
    }
    this.input()?.process(input2.files);
    input2.value = "";
  }
  onDropped({
    dataTransfer
  }) {
    this.files = null;
    const input2 = this.input();
    if (dataTransfer?.files && !input2?.disabled()) {
      input2?.process(dataTransfer.files);
    }
  }
  onDrag(dataTransfer) {
    this.files = dataTransfer?.files;
  }
  static {
    this.\u0275fac = function TuiInputFiles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiInputFiles)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiInputFiles,
      selectors: [["label", "tuiInputFiles", ""]],
      contentQueries: function TuiInputFiles_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.template, TemplateRef, 5)(dirIndex, ctx.input, TuiInputFilesDirective, 5);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance(2);
        }
      },
      hostAttrs: ["data-tui-version", "5.16.0", "tuiInputFiles", ""],
      hostVars: 3,
      hostBindings: function TuiInputFiles_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("change", function TuiInputFiles_change_HostBindingHandler($event) {
            return ctx.onFilesSelected($event.target);
          })("dragenter", function TuiInputFiles_dragenter_HostBindingHandler($event) {
            return ctx.onDrag($event.dataTransfer);
          })("dragleave", function TuiInputFiles_dragleave_HostBindingHandler() {
            return ctx.onDrag(null);
          })("dragover.prevent.zoneless", function TuiInputFiles_dragover_prevent_zoneless_HostBindingHandler() {
            return 0;
          })("drop.prevent", function TuiInputFiles_drop_prevent_HostBindingHandler($event) {
            return ctx.onDropped($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("data-size", ctx.size() || ctx.options.size);
          \u0275\u0275classProp("_dragged", ctx.fileDragged);
        }
      },
      inputs: {
        size: [1, "tuiInputFiles", "size"]
      },
      ngContentSelectors: _c03,
      decls: 2,
      vars: 4,
      consts: [[4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiInputFiles_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275template(1, TuiInputFiles_span_1_Template, 2, 1, "span", 0);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275property("polymorpheusOutlet", ctx.template() || ctx.content)("polymorpheusOutletContext", \u0275\u0275pureFunction1(2, _c1, ctx.fileDragged));
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: ['label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;box-sizing:border-box;flex-direction:column;min-block-size:var(--tui-height-m);justify-content:center;align-items:center;text-align:center;border-radius:var(--tui-radius-s);font:var(--tui-typography-body-s);overflow-wrap:break-word;padding:.75rem 1rem;gap:.5rem}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"])[data-size=l]{min-block-size:var(--tui-height-l);border-radius:var(--tui-radius-l);font:var(--tui-typography-body-m);padding:1rem}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"])>:not(input){position:relative;pointer-events:none}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;color:transparent;cursor:pointer}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input:disabled~*{opacity:var(--tui-disabled-opacity)}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input::-webkit-file-upload-button{display:none}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input::file-selector-button{display:none}*:disabled label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]){pointer-events:none}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);border-radius:inherit;box-sizing:border-box;border:1px dashed var(--tui-text-action);outline:none}tui-root._mobile [tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){border-style:solid}[tuiInputFiles]._dragged [tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}@media(hover:hover)and (pointer:fine){[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=hover]{background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){background:var(--tui-background-neutral-1-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=active]{background:var(--tui-background-neutral-1-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):disabled:not([data-state]),[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=disabled]{background:transparent;border-color:var(--tui-text-tertiary)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):focus-visible:not([data-focus=false]){border:.125rem solid var(--tui-border-focus)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-focus=true]{border:.125rem solid var(--tui-border-focus)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):not(:disabled)[data-mode~=invalid],[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):invalid:not(:disabled):not([data-mode]){border-color:var(--tui-status-negative)!important}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInputFiles, [{
    type: Component,
    args: [{
      selector: "label[tuiInputFiles]",
      imports: [PolymorpheusOutlet],
      template: `
        <ng-content />
        <span
            *polymorpheusOutlet="
                template() || content as text;
                context: {$implicit: fileDragged}
            "
        >
            {{ text }}
        </span>
    `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "data-tui-version": TUI_VERSION,
        tuiInputFiles: "",
        "[attr.data-size]": "size() || options.size",
        "[class._dragged]": "fileDragged",
        "(change)": "onFilesSelected($event.target)",
        "(dragenter)": "onDrag($event.dataTransfer)",
        "(dragleave)": "onDrag(null)",
        "(dragover.prevent.zoneless)": "0",
        "(drop.prevent)": "onDropped($event)"
      },
      styles: ['label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;box-sizing:border-box;flex-direction:column;min-block-size:var(--tui-height-m);justify-content:center;align-items:center;text-align:center;border-radius:var(--tui-radius-s);font:var(--tui-typography-body-s);overflow-wrap:break-word;padding:.75rem 1rem;gap:.5rem}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"])[data-size=l]{min-block-size:var(--tui-height-l);border-radius:var(--tui-radius-l);font:var(--tui-typography-body-m);padding:1rem}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"])>:not(input){position:relative;pointer-events:none}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;color:transparent;cursor:pointer}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input:disabled~*{opacity:var(--tui-disabled-opacity)}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input::-webkit-file-upload-button{display:none}label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]) input::file-selector-button{display:none}*:disabled label[tuiInputFiles]:where(*[data-tui-version="5.16.0"]){pointer-events:none}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);border-radius:inherit;box-sizing:border-box;border:1px dashed var(--tui-text-action);outline:none}tui-root._mobile [tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){border-style:solid}[tuiInputFiles]._dragged [tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]){background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}@media(hover:hover)and (pointer:fine){[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=hover]{background:var(--tui-background-neutral-1);border-color:var(--tui-text-action-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):active:not([data-state]){background:var(--tui-background-neutral-1-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=active]{background:var(--tui-background-neutral-1-hover)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):disabled:not([data-state]),[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-state=disabled]{background:transparent;border-color:var(--tui-text-tertiary)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):focus-visible:not([data-focus=false]){border:.125rem solid var(--tui-border-focus)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"])[data-focus=true]{border:.125rem solid var(--tui-border-focus)}[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):not(:disabled)[data-mode~=invalid],[tuiAppearance][data-appearance=file]:where(*[data-tui-version="5.16.0"]):invalid:not(:disabled):not([data-mode]){border-color:var(--tui-status-negative)!important}\n']
    }]
  }], null, null);
})();
var TuiFileRejectedPipe = class _TuiFileRejectedPipe {
  constructor() {
    this.options = inject(TUI_INPUT_FILES_OPTIONS);
    this.formatSize = inject(TUI_FILE_OPTIONS).formatSize;
    this.locale = inject(LOCALE_ID);
    this.text$ = toObservable(inject(TUI_INPUT_FILE_TEXTS));
    this.unit$ = toObservable(inject(TUI_DIGITAL_INFORMATION_UNITS));
  }
  transform(file, {
    accept = this.options.accept,
    maxFileSize = this.options.maxFileSize
  } = this.options) {
    const sizeValidator = tuiCreateFileSizeValidator(maxFileSize);
    const formatValidator = tuiCreateFileFormatValidator(accept);
    const control = new FormControl(file);
    return combineLatest([this.text$, this.unit$]).pipe(map(([{
      maxSizeRejectionReason,
      formatRejectionReason
    }, units]) => {
      if (file && formatValidator(control)) {
        return {
          name: file.name,
          size: file.size,
          content: formatRejectionReason
        };
      }
      return file && sizeValidator(control) ? {
        name: file.name,
        size: file.size,
        content: `${maxSizeRejectionReason}${CHAR_NO_BREAK_SPACE}${this.formatSize(units, maxFileSize, this.locale)}`
      } : null;
    }));
  }
  static {
    this.\u0275fac = function TuiFileRejectedPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFileRejectedPipe)();
    };
  }
  static {
    this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
      name: "tuiFileRejected",
      type: _TuiFileRejectedPipe,
      pure: true
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFileRejectedPipe, [{
    type: Pipe,
    args: [{
      name: "tuiFileRejected"
    }]
  }], null, null);
})();

// src/app/features/capture/capture-upload.component.ts
function CaptureUploadComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx.name);
  }
}
function CaptureUploadComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-state");
  }
}
function CaptureUploadComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-error-state", 5);
    \u0275\u0275listener("retry", function CaptureUploadComponent_Conditional_8_Template_app_error_state_retry_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.reset());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
var CaptureUploadComponent = class _CaptureUploadComponent {
  constructor(captures, router) {
    this.captures = captures;
    this.router = router;
    this.selectedFile = signal(
      null,
      ...ngDevMode ? [{ debugName: "selectedFile" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.uploading = signal(
      false,
      ...ngDevMode ? [{ debugName: "uploading" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.error = signal(
      "",
      ...ngDevMode ? [{ debugName: "error" }] : (
        /* istanbul ignore next */
        []
      )
    );
  }
  onNativeChange(event) {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.selectedFile.set(file);
      void this.upload();
    }
  }
  async upload() {
    const file = this.selectedFile();
    if (!file)
      return;
    this.uploading.set(true);
    this.error.set("");
    try {
      const result = await this.captures.create(file);
      await this.router.navigate(["/capture", result.id]);
    } catch {
      this.error.set("Upload failed.");
    } finally {
      this.uploading.set(false);
    }
  }
  reset() {
    this.error.set("");
    this.selectedFile.set(null);
  }
  static {
    this.\u0275fac = function CaptureUploadComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CaptureUploadComponent)(\u0275\u0275directiveInject(CaptureService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CaptureUploadComponent, selectors: [["app-capture-upload"]], decls: 9, vars: 6, consts: [["tuiTitle", ""], [1, "upload-section"], ["tuiInputFiles", ""], ["type", "file", "tuiInputFiles", "", "accept", "image/*", "ngModel", "", "name", "file", 3, "change"], [3, "message"], [3, "retry", "message"]], template: function CaptureUploadComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275pipe(2, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 1)(4, "label", 2)(5, "input", 3);
        \u0275\u0275listener("change", function CaptureUploadComponent_Template_input_change_5_listener($event) {
          return ctx.onNativeChange($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275controlCreate();
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(6, CaptureUploadComponent_Conditional_6_Template, 2, 1, "p");
        \u0275\u0275conditionalCreate(7, CaptureUploadComponent_Conditional_7_Template, 1, 0, "app-loading-state");
        \u0275\u0275conditionalCreate(8, CaptureUploadComponent_Conditional_8_Template, 1, 1, "app-error-state", 4);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        let tmp_2_0;
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 4, "capture.title"));
        \u0275\u0275advance(4);
        \u0275\u0275control();
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_2_0 = ctx.selectedFile()) ? 6 : -1, tmp_2_0);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.uploading() ? 7 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error() ? 8 : -1);
      }
    }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, LoadingStateComponent, ErrorStateComponent, TuiTitle, TuiInputFiles, TranslatePipe], styles: ["\n.upload-section[_ngcontent-%COMP%] {\n  max-width: 24rem;\n  margin: 1rem 0;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n/*# sourceMappingURL=capture-upload.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CaptureUploadComponent, [{
    type: Component,
    args: [{ selector: "app-capture-upload", standalone: true, imports: [FormsModule, TranslatePipe, LoadingStateComponent, ErrorStateComponent, TuiTitle, TuiInputFiles], template: `
    <h2 tuiTitle>{{ 'capture.title' | translate }}</h2>
    <div class="upload-section">
      <label tuiInputFiles>
        <input type="file" tuiInputFiles accept="image/*" ngModel name="file" (change)="onNativeChange($event)" />
      </label>
      @if (selectedFile(); as file) { <p>{{ file.name }}</p> }
      @if (uploading()) { <app-loading-state /> }
      @if (error()) { <app-error-state [message]="error()" (retry)="reset()" /> }
    </div>
  `, styles: ["/* angular:styles/component:css;3853af92e5bbe1d065078ddadecd77e0ddba4b3c8f5940d764ebf89c55809ff6;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/capture/capture-upload.component.ts */\n.upload-section {\n  max-width: 24rem;\n  margin: 1rem 0;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n/*# sourceMappingURL=capture-upload.component.css.map */\n"] }]
  }], () => [{ type: CaptureService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CaptureUploadComponent, { className: "CaptureUploadComponent", filePath: "src/app/features/capture/capture-upload.component.ts", lineNumber: 27 });
})();
export {
  CaptureUploadComponent
};
//# sourceMappingURL=chunk-6NIN4V3C.js.map
