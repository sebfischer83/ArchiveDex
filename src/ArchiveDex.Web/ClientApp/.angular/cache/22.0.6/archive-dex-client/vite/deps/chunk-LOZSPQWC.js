import {
  WA_ANIMATION_FRAME,
  WA_LOCAL_STORAGE,
  WA_NAVIGATOR,
  WA_PERFORMANCE,
  WA_USER_AGENT,
  WA_WINDOW,
  tuiExtractI18n
} from "./chunk-A6ZHIR5V.js";
import {
  coerceArray,
  coerceElement
} from "./chunk-GMVKAMJ5.js";
import {
  AnimationEngine
} from "./chunk-NGWXDF6P.js";
import {
  Meta
} from "./chunk-4VUQSEPK.js";
import {
  NgControl,
  NgModel
} from "./chunk-N4D5YFQF.js";
import {
  AsyncPipe,
  NgIf,
  isPlatformBrowser,
  isPlatformServer
} from "./chunk-BFMOBU5G.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  INJECTOR$1,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  LOCALE_ID,
  NgZone,
  Optional,
  Output,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  RuntimeError,
  Self,
  SkipSelf,
  TemplateRef,
  VERSION,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  assertInInjectionContext,
  assertNotInReactiveContext,
  computed,
  createComponent,
  effect,
  forwardRef,
  inject,
  isSignal,
  reflectComponentType,
  setClassMetadata,
  signal,
  untracked,
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
  ɵɵdirectiveInject,
  ɵɵdomElementContainer,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵinvalidFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresolveDocument,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-HRGKPJ5A.js";
import {
  BehaviorSubject,
  EMPTY,
  NEVER,
  Observable,
  ReplaySubject,
  Subject,
  __decorate,
  asyncScheduler,
  catchError,
  combineLatest,
  concat,
  defaultIfEmpty,
  defer,
  delay,
  distinctUntilChanged,
  endWith,
  filter,
  finalize,
  fromEvent,
  identity,
  map,
  merge,
  observeOn,
  of,
  pipe,
  queueScheduler,
  repeat,
  share,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  takeWhile,
  tap,
  throttleTime,
  timer,
  withLatestFrom
} from "./chunk-YB2C65QT.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-constants.mjs
var TUI_ALLOW_SIGNAL_WRITES = parseInt(VERSION.major, 10) >= 19 ? {} : { allowSignalWrites: true };
var rect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0
};
var EMPTY_QUERY = new QueryList();
var EMPTY_ARRAY = [];
var EMPTY_FUNCTION = () => {
};
var EMPTY_CLIENT_RECT = __spreadProps(__spreadValues({}, rect), {
  toJSON: () => rect
});
var TUI_FALSE_HANDLER = () => false;
var TUI_TRUE_HANDLER = () => true;
function bothEmpty(item1, item2) {
  return Array.isArray(item1) && Array.isArray(item2) && !item1.length && !item2.length;
}
var TUI_DEFAULT_MATCHER = (item, search, stringify = String) => stringify(item).toLowerCase().includes(search.toLowerCase());
var TUI_STRICT_MATCHER = (item, search, stringify = String) => stringify(item).toLowerCase() === search.toLowerCase();
var TUI_DEFAULT_IDENTITY_MATCHER = (item1, item2) => item1 === item2 || bothEmpty(item1, item2);
var svgNodeFilter = {
  acceptNode(node) {
    return "ownerSVGElement" in node ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
  }
};
var CHAR_NO_BREAK_SPACE = " ";
var CHAR_EN_DASH = "–";
var CHAR_HYPHEN = "-";
var CHAR_MINUS = "−";
var CHAR_PLUS = "+";
var CHAR_ZERO_WIDTH_SPACE = "​";
var TUI_VERSION = "4.90.0";

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-math.mjs
function tuiClamp(value, min, max) {
  ngDevMode && console.assert(!Number.isNaN(value));
  ngDevMode && console.assert(!Number.isNaN(min));
  ngDevMode && console.assert(!Number.isNaN(max));
  ngDevMode && console.assert(max >= min);
  return Math.min(max, Math.max(min, value));
}
function tuiInRange(value, fromInclude, toExclude) {
  ngDevMode && console.assert(!Number.isNaN(value));
  ngDevMode && console.assert(!Number.isNaN(fromInclude));
  ngDevMode && console.assert(!Number.isNaN(toExclude));
  ngDevMode && console.assert(fromInclude < toExclude);
  return value >= fromInclude && value < toExclude;
}
function tuiNormalizeToIntNumber(value, min, max) {
  ngDevMode && console.assert(Number.isInteger(min));
  ngDevMode && console.assert(Number.isInteger(max));
  ngDevMode && console.assert(min <= max);
  if (Number.isNaN(value) || value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return Math.round(value);
}
function tuiQuantize(value, quantum) {
  ngDevMode && console.assert(Number.isFinite(value));
  ngDevMode && console.assert(Number.isFinite(quantum));
  ngDevMode && console.assert(quantum > 0);
  const remainder = value % quantum;
  return remainder < quantum / 2 ? value - remainder : value + quantum - remainder;
}
var MAX_PRECISION = 292;
function calculate(value, precision, func) {
  if (value === Infinity) {
    return value;
  }
  ngDevMode && console.assert(!Number.isNaN(value), "Value must be number");
  ngDevMode && console.assert(Number.isInteger(precision), "Precision must be integer");
  precision = Math.min(precision, MAX_PRECISION);
  const [significand, exponent = ""] = `${value}`.split("e");
  const roundedInt = func(Number(`${significand}e${Number(exponent) + precision}`));
  ngDevMode && console.assert(Number.isSafeInteger(roundedInt), "Impossible to correctly round such a large number");
  const processedPair = `${roundedInt}e`.split("e");
  return Number(`${processedPair[0]}e${Number(processedPair[1]) - precision}`);
}
function tuiRound(value, precision = 0) {
  return calculate(value, precision, Math.round);
}
function tuiCeil(value, precision = 0) {
  return calculate(value, precision, Math.ceil);
}
function tuiFloor(value, precision = 0) {
  return calculate(value, precision, Math.floor);
}
function tuiTrunc(value, precision = 0) {
  return calculate(value, precision, Math.trunc);
}
function tuiIsSafeToRound(value, precision = 0) {
  return Number.isSafeInteger(Math.trunc(value * 10 ** precision));
}
function tuiRoundWith({ value, precision, method }) {
  switch (method) {
    case "ceil":
      return tuiCeil(value, precision);
    case "floor":
      return tuiFloor(value, precision);
    case "round":
      return tuiRound(value, precision);
    default:
      return tuiTrunc(value, precision);
  }
}
function tuiSum(...args) {
  const decimal = args.map((double) => (double.toString().split(".")[1] ?? "").length);
  const maxDecimal = Math.max(0, ...decimal);
  const precision = 10 ** maxDecimal;
  const sumInt = args.reduce((acc, n) => acc + Math.round(n * precision), 0);
  return sumInt / precision;
}
function tuiToInt(bool) {
  return bool ? 1 : 0;
}

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function takeUntilDestroyed(destroyRef) {
  if (!destroyRef) {
    ngDevMode && assertInInjectionContext(takeUntilDestroyed);
    destroyRef = inject(DestroyRef);
  }
  const destroyed$ = new Observable((subscriber) => {
    if (destroyRef.destroyed) {
      subscriber.next();
      return;
    }
    const unregisterFn = destroyRef.onDestroy(subscriber.next.bind(subscriber));
    return unregisterFn;
  });
  return (source) => {
    return source.pipe(takeUntil(destroyed$));
  };
}
function toObservable(source, options) {
  if (ngDevMode && !options?.injector) {
    assertInInjectionContext(toObservable);
  }
  const injector = options?.injector ?? inject(Injector);
  const subject = new ReplaySubject(1);
  const watcher = effect(() => {
    let value;
    try {
      value = source();
    } catch (err) {
      untracked(() => subject.error(err));
      return;
    }
    untracked(() => subject.next(value));
  }, {
    injector,
    manualCleanup: true
  });
  injector.get(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });
  return subject.asObservable();
}
function toSignal(source, options) {
  typeof ngDevMode !== "undefined" && ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  if (ngDevMode && requiresCleanup && !options?.injector) {
    assertInInjectionContext(toSignal);
  }
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state;
  if (options?.requireSync) {
    state = signal({
      kind: 0
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  } else {
    state = signal({
      kind: 1,
      value: options?.initialValue
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  }
  let destroyUnregisterFn;
  const sub = source.subscribe({
    next: (value) => state.set({
      kind: 1,
      value
    }),
    error: (error) => {
      state.set({
        kind: 2,
        error
      });
      destroyUnregisterFn?.();
    },
    complete: () => {
      destroyUnregisterFn?.();
    }
  });
  if (options?.requireSync && state().kind === 0) {
    throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  destroyUnregisterFn = cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, __spreadValues({
    equal: options?.equal
  }, ngDevMode ? createDebugNameObject(options?.debugName, "source") : void 0));
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}
function createDebugNameObject(toSignalDebugName, internalSignalDebugName) {
  return {
    debugName: `toSignal${toSignalDebugName ? "#" + toSignalDebugName : ""}.${internalSignalDebugName}`
  };
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-miscellaneous.mjs
function tuiArrayRemove(array, index) {
  return array.slice(0, Math.max(index, 0)).concat(array.slice(Math.max(index + 1, 0)));
}
function tuiArrayShallowEquals(a, b) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}
function tuiArrayToggle(array, item, identity2) {
  const index = identity2 ? array.findIndex((it) => identity2(it, item)) : array.indexOf(item);
  return index === -1 ? [...array, item] : tuiArrayRemove(array, index);
}
var changeDateSeparator = (dateString, newDateSeparator) => dateString.replaceAll(/[^0-9A-Za-zА-Яа-я]/gi, newDateSeparator);
function tuiCreateToken(defaults) {
  return defaults === void 0 ? new InjectionToken("") : tuiCreateTokenFromFactory(() => defaults);
}
function tuiCreateTokenFromFactory(factory) {
  return factory ? new InjectionToken("", { factory }) : new InjectionToken("");
}
function tuiIsString(value) {
  return typeof value === "string";
}
function tuiDirectiveBinding(token, key, initial, options = { self: true }) {
  const result = isSignal(initial) ? initial : signal(initial);
  const directive = inject(token, options);
  const output = directive[`${key.toString()}Change`];
  let previous;
  effect(() => {
    const value = result();
    if (previous === value) {
      return;
    }
    if (isSignal(directive[key])) {
      directive[key].set(value);
    } else {
      directive[key] = value;
    }
    directive.ngOnChanges?.({});
    output?.emit?.(value);
    previous = value;
  }, TUI_ALLOW_SIGNAL_WRITES);
  return result;
}
function tuiDistanceBetweenTouches({ touches }) {
  return Math.hypot((touches[0]?.clientX ?? 0) - (touches[1]?.clientX ?? 0), (touches[0]?.clientY ?? 0) - (touches[1]?.clientY ?? 0));
}
function tuiEaseInOutQuad(t) {
  ngDevMode && console.assert(t >= 0 && t <= 1, "Input must be between 0 and 1 inclusive but received ", t);
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function tuiGetOriginalArrayFromQueryList(queryList) {
  let array = [];
  queryList.find((_item, _index, originalArray) => {
    array = originalArray;
    return true;
  });
  return array;
}
function tuiIsNumber(value) {
  return typeof value === "number";
}
function tuiIsPresent(value) {
  return value !== null && value !== void 0;
}
function tuiNullableSame(a, b, handler) {
  if (a === null) {
    return b === null;
  }
  if (b === null) {
    return false;
  }
  return handler(a, b);
}
function tuiProvide(provide, useExisting, multi = false) {
  return { provide, useExisting, multi };
}
function tuiProvideOptions(provide, options, fallback) {
  return {
    provide,
    useFactory: () => __spreadValues(__spreadValues({}, inject(provide, { optional: true, skipSelf: true }) || fallback), inject(options, { optional: true }) || // @ts-ignore
    (typeof options === "function" ? options() : options))
  };
}
function decorateMethod(originalMethod) {
  let previousArgs = [];
  let originalFnWasCalledLeastAtOnce = false;
  let pureValue;
  return function tuiPureMethodPatched(...args) {
    const isPure = originalFnWasCalledLeastAtOnce && previousArgs.length === args.length && args.every((arg, index) => arg === previousArgs[index]);
    if (isPure) {
      return pureValue;
    }
    previousArgs = args;
    pureValue = originalMethod.apply(this, args);
    originalFnWasCalledLeastAtOnce = true;
    return pureValue;
  };
}
function decorateGetter(originalGetter, propertyKey, enumerable = true) {
  return function tuiPureGetterPatched() {
    const value = originalGetter.call(this);
    Object.defineProperty(this, propertyKey, { enumerable, value });
    return value;
  };
}
function tuiPure(target, propertyKeyOrContext, descriptor) {
  if (typeof target === "function") {
    const context = propertyKeyOrContext;
    if (context.kind === "getter") {
      return decorateGetter(target, context.name);
    }
    if (context.kind === "method") {
      return decorateMethod(target);
    }
    throw new TuiPureException();
  }
  const { get, enumerable, value } = descriptor;
  const propertyKey = propertyKeyOrContext;
  if (get) {
    return {
      configurable: true,
      enumerable,
      get: decorateGetter(get, propertyKey, enumerable)
    };
  }
  if (typeof value !== "function") {
    throw new TuiPureException();
  }
  const original = value;
  return {
    configurable: true,
    enumerable,
    get() {
      let previousArgs = [];
      let originalFnWasCalledLeastAtOnce = false;
      let pureValue;
      const patched = (...args) => {
        const isPure = originalFnWasCalledLeastAtOnce && previousArgs.length === args.length && args.every((arg, index) => arg === previousArgs[index]);
        if (isPure) {
          return pureValue;
        }
        previousArgs = args;
        pureValue = original.apply(this, args);
        originalFnWasCalledLeastAtOnce = true;
        return pureValue;
      };
      Object.defineProperty(this, propertyKey, {
        configurable: true,
        value: patched
      });
      return patched;
    }
  };
}
var TuiPureException = class extends Error {
  constructor() {
    super(ngDevMode ? "tuiPure can only be used with functions or getters" : "");
  }
};
function tuiPx(value) {
  ngDevMode && console.assert(Number.isFinite(value), "Value must be finite number");
  return `${value}px`;
}
function tuiSanitizeText(value) {
  const controlCharsRegex = /[\x00-\x1F\x7F-\x9F]/g;
  const zeroWidthCharsRegex = /[\u200B-\u200D\uFEFF]/g;
  return value.trim().replaceAll(controlCharsRegex, "").replaceAll(zeroWidthCharsRegex, "");
}
var MAP = new InjectionToken(ngDevMode ? "MAP" : "", {
  factory: () => {
    const map2 = /* @__PURE__ */ new Map();
    inject(DestroyRef).onDestroy(() => map2.forEach((component) => component.destroy()));
    return map2;
  }
});
function tuiWithStyles(component) {
  const map2 = inject(MAP);
  const environmentInjector = inject(EnvironmentInjector);
  if (!map2.has(component)) {
    map2.set(component, createComponent(component, { environmentInjector }));
  }
  return void 0;
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-dom.mjs
function tuiContainsOrAfter(current, node) {
  try {
    return current.contains(node) || !!(node.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_PRECEDING);
  } catch {
    return false;
  }
}
function tuiIsInput(element) {
  return element.matches("input");
}
function tuiIsTextarea(element) {
  return element.matches("textarea");
}
function tuiIsTextfield(element) {
  return tuiIsInput(element) || tuiIsTextarea(element);
}
function tuiIsElement(node) {
  return !!node && "nodeType" in node && node.nodeType === Node.ELEMENT_NODE;
}
function tuiIsHTMLElement(node) {
  const defaultView = node?.ownerDocument.defaultView;
  return !!node && !!defaultView && node instanceof defaultView.HTMLElement;
}
function tuiIsTextNode(node) {
  return node.nodeType === Node.TEXT_NODE;
}
function tuiIsInputEvent(event) {
  return "data" in event && "inputType" in event;
}
function tuiGetActualTarget(event) {
  return event.composedPath()[0];
}
var DEFAULT_FORMAT = "text/plain";
function tuiGetClipboardDataText(event, format = DEFAULT_FORMAT) {
  return "clipboardData" in event && event.clipboardData !== null ? event.clipboardData.getData(format) || event.clipboardData.getData(DEFAULT_FORMAT) : event.target.ownerDocument.defaultView.clipboardData.getData("text");
}
function tuiGetDocumentOrShadowRoot(node) {
  return "getRootNode" in node && node.isConnected ? node.getRootNode() : node.ownerDocument;
}
function tuiGetElementObscures(element) {
  if (!element.getBoundingClientRect) {
    return null;
  }
  const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
  if (width === 0 && height === 0) {
    return null;
  }
  const doc = tuiGetDocumentOrShadowRoot(element);
  const horizontalMiddle = Math.round(left + width / 2);
  const verticalMiddle = Math.round(top + height / 2);
  const elements = [
    doc.elementFromPoint(horizontalMiddle, Math.round(top) + 2),
    doc.elementFromPoint(horizontalMiddle, Math.round(bottom) - 2),
    doc.elementFromPoint(Math.round(left) + 2, verticalMiddle),
    doc.elementFromPoint(Math.round(right) - 2, verticalMiddle)
  ].filter(tuiIsPresent);
  if (!elements.length) {
    return [];
  }
  const filtered = elements.filter((el) => !element.contains(el) && !el.contains(element));
  return filtered.length === 4 ? filtered : null;
}
function tuiGetElementOffset(host, element) {
  ngDevMode && console.assert(host.contains(element), "Host must contain element");
  let { offsetTop, offsetLeft, offsetParent } = element;
  while (tuiIsHTMLElement(offsetParent) && offsetParent !== host) {
    offsetTop += offsetParent.offsetTop;
    offsetLeft += offsetParent.offsetLeft;
    offsetParent = offsetParent.offsetParent;
  }
  return { offsetTop, offsetLeft };
}
function tuiGetSelectedText({ getSelection, document }) {
  return document.activeElement && tuiIsTextfield(document.activeElement) ? document.activeElement.value.slice(document.activeElement.selectionStart || 0, document.activeElement.selectionEnd || 0) : getSelection()?.toString() || null;
}
function tuiInjectElement() {
  return inject(ElementRef).nativeElement;
}
function tuiIsCurrentTarget({ target, currentTarget }) {
  return target === currentTarget;
}
function tuiIsElementEditable(element) {
  return tuiIsTextfield(element) && !element.readOnly && element.inputMode !== "none" || Boolean(element.isContentEditable);
}
function tuiPointToClientRect(x = 0, y = 0) {
  const rect2 = {
    x,
    y,
    left: x,
    right: x,
    top: y,
    bottom: y,
    width: 0,
    height: 0
  };
  return __spreadProps(__spreadValues({}, rect2), {
    toJSON: () => rect2
  });
}
function tuiValue(input, injector = inject(INJECTOR$1)) {
  const win = injector.get(WA_WINDOW);
  if (!win.tuiInputPatched && isPlatformBrowser(injector.get(PLATFORM_ID))) {
    win.tuiInputPatched = true;
    patch(win.HTMLInputElement.prototype);
    patch(win.HTMLTextAreaElement.prototype);
    patch(win.HTMLSelectElement.prototype);
  }
  let element = isSignal(input) ? void 0 : coerceElement(input);
  let cleanup = () => {
  };
  const options = __spreadValues({ injector }, TUI_ALLOW_SIGNAL_WRITES);
  const value = signal(element?.value || "");
  const process = (el) => {
    const update = () => untracked(() => value.set(el.value));
    el.addEventListener("input", update, { capture: true });
    el.addEventListener("tui-input", update, { capture: true });
    return () => {
      el.removeEventListener("input", update, { capture: true });
      el.removeEventListener("tui-input", update, { capture: true });
    };
  };
  injector.get(DestroyRef).onDestroy(() => cleanup());
  if (isSignal(input)) {
    effect(() => {
      element = coerceElement(input());
      cleanup();
      if (element && !element.matches("select[multiple]")) {
        value.set(element.value);
        cleanup = process(element);
      }
    }, options);
  } else if (element && !element.matches("select[multiple]")) {
    cleanup = process(element);
  }
  effect(() => {
    const v = value();
    if (element?.matches("select[multiple]")) {
      return;
    }
    if (element?.matches(":focus") && "selectionStart" in element) {
      const { selectionStart, selectionEnd } = element;
      element.value = v;
      try {
        element.setSelectionRange(selectionStart, selectionEnd);
      } catch {
      }
    } else if (element) {
      element.value = v;
    }
  }, options);
  return value;
}
function patch(prototype) {
  const { set } = Object.getOwnPropertyDescriptor(prototype, "value");
  Object.defineProperty(prototype, "value", {
    set(detail) {
      const value = this.value;
      const event = new CustomEvent("tui-input", { detail, bubbles: true });
      set.call(this, detail);
      if (value !== detail) {
        this.dispatchEvent(event);
      }
    }
  });
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-observables.mjs
function tuiCloseWatcher() {
  return new Observable((subscriber) => {
    let watcher;
    const setup = () => {
      watcher = getWatcher();
      watcher.onclose = () => setup();
      watcher.oncancel = (event) => {
        event.preventDefault();
        subscriber.next();
      };
    };
    setup();
    return () => watcher.destroy();
  });
}
function getWatcher() {
  try {
    return new CloseWatcher();
  } catch {
    return { destroy: () => {
    } };
  }
}
function tuiControlValue(control) {
  return new Observable((subscriber) => control?.valueChanges?.pipe(startWith(control.value)).subscribe(subscriber));
}
function tuiTypedFromEvent(target, event, options = {}) {
  return fromEvent(target, event, options);
}
var TuiDragState = class {
  constructor(stage, event) {
    this.stage = stage;
    this.event = event;
  }
};
function tuiDragAndDropFrom(element) {
  const { ownerDocument } = element;
  return concat(tuiTypedFromEvent(element, "mousedown").pipe(take(1), map((event) => new TuiDragState("start", event))), merge(tuiTypedFromEvent(ownerDocument, "mousemove").pipe(map((event) => new TuiDragState("continues", event))), merge(tuiTypedFromEvent(ownerDocument, "mouseup"), tuiTypedFromEvent(ownerDocument, "dragend")).pipe(take(1), map((event) => new TuiDragState("end", event)), endWith(null))).pipe(takeWhile(tuiIsPresent))).pipe(repeat());
}
function tuiPreventDefault() {
  return tap((event) => event.preventDefault());
}
function tuiIfMap(project, predicate = Boolean) {
  return pipe(switchMap((value) => predicate(value) ? project(value) : EMPTY));
}
function tuiQueryListChanges(queryList) {
  return queryList.changes.pipe(startWith(null), map(() => tuiGetOriginalArrayFromQueryList(queryList)));
}
function tuiScrollFrom(element) {
  return tuiTypedFromEvent(element === element.ownerDocument.documentElement ? element.ownerDocument : element, "scroll");
}
function tuiTakeUntilDestroyed(destroyRef) {
  return pipe(takeUntil(NEVER.pipe(takeUntilDestroyed(destroyRef), catchError(() => EMPTY), defaultIfEmpty(null))));
}
var tuiUntrackedScheduler = {
  now: queueScheduler.now.bind(queueScheduler),
  schedule(work, delay2, state) {
    return queueScheduler.schedule(function(s) {
      return untracked(() => work.call(this, s));
    }, delay2, state);
  }
};
function tuiWatch(cdr = inject(ChangeDetectorRef)) {
  return tap(() => cdr.markForCheck());
}
function tuiZonefull(zone = inject(NgZone)) {
  return (source) => new Observable((subscriber) => source.subscribe({
    next: (value) => zone.run(() => subscriber.next(value)),
    error: (error) => zone.run(() => subscriber.error(error)),
    complete: () => zone.run(() => subscriber.complete())
  }));
}
function tuiZonefree(zone = inject(NgZone)) {
  return (source) => new Observable((subscriber) => zone.runOutsideAngular(() => source.subscribe(subscriber)));
}
function tuiZoneOptimized(zone = inject(NgZone)) {
  return pipe(tuiZonefree(zone), tuiZonefull(zone));
}
var TuiZoneScheduler = class {
  constructor(zoneConditionFn, scheduler = asyncScheduler) {
    this.zoneConditionFn = zoneConditionFn;
    this.scheduler = scheduler;
  }
  now() {
    return this.scheduler.now();
  }
  schedule(...args) {
    return this.zoneConditionFn(() => this.scheduler.schedule(...args));
  }
};
function tuiZonefreeScheduler(zone = inject(NgZone), scheduler = asyncScheduler) {
  return new TuiZoneScheduler(zone.runOutsideAngular.bind(zone), scheduler);
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-focus.mjs
function tuiGetFocused({ activeElement }) {
  if (!activeElement?.shadowRoot) {
    return activeElement;
  }
  let element = activeElement.shadowRoot.activeElement;
  while (element?.shadowRoot) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}
function tuiFocusedIn(node) {
  return toSignal(merge(fromEvent(node, "focus", { capture: true }).pipe(map(TUI_TRUE_HANDLER)), fromEvent(node, "blur", { capture: true }).pipe(map(TUI_FALSE_HANDLER))).pipe(observeOn(tuiUntrackedScheduler)), { initialValue: false });
}
function tuiIsKeyboardFocusable(element) {
  if (element.hasAttribute("disabled") || element.getAttribute("tabIndex") === "-1") {
    return false;
  }
  if (tuiIsHTMLElement(element) && element.isContentEditable || element.getAttribute("tabIndex") === "0") {
    return true;
  }
  switch (element.tagName) {
    case "A":
    case "LINK":
      return element.hasAttribute("href");
    case "AUDIO":
    case "VIDEO":
      return element.hasAttribute("controls");
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    case "INPUT":
      return element.getAttribute("type") !== "hidden";
    default:
      return false;
  }
}
function tuiIsMouseFocusable(element) {
  return !element.hasAttribute("disabled") && (element.getAttribute("tabIndex") === "-1" || tuiIsKeyboardFocusable(element));
}
function tuiGetClosestFocusable({ initial, root, previous = false, keyboard = true }) {
  if (!root.ownerDocument) {
    return null;
  }
  const check = keyboard ? tuiIsKeyboardFocusable : tuiIsMouseFocusable;
  const treeWalker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, svgNodeFilter);
  treeWalker.currentNode = initial;
  do {
    if (tuiIsHTMLElement(treeWalker.currentNode)) {
      initial = treeWalker.currentNode;
    }
    if (tuiIsHTMLElement(initial) && check(initial)) {
      return initial;
    }
  } while (previous ? treeWalker.previousNode() : treeWalker.nextNode());
  return null;
}
function tuiIsFocused(node) {
  return !!node?.ownerDocument && tuiGetFocused(node.ownerDocument) === node && node.ownerDocument.hasFocus();
}
function tuiIsFocusedIn(node) {
  const focused = node?.ownerDocument && tuiGetFocused(node.ownerDocument);
  return !!focused && node.contains(focused) && node.ownerDocument?.hasFocus();
}
function tuiMoveFocus(currentIndex, elements, step) {
  currentIndex += step;
  while (currentIndex >= 0 && currentIndex < elements.length) {
    elements[currentIndex]?.focus();
    if (tuiIsFocused(elements[currentIndex])) {
      return;
    }
    currentIndex += step;
  }
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-date-time.mjs
var DAYS_IN_WEEK = 7;
var MONTHS_IN_YEAR = 12;
var MIN_DAY = 1;
var MIN_MONTH = 0;
var MAX_MONTH = 11;
var MIN_YEAR = 0;
var MAX_YEAR = 9999;
var MAX_DISPLAYED_YEAR = 2099;
var RANGE_SEPARATOR_CHAR = `${CHAR_NO_BREAK_SPACE}${CHAR_EN_DASH}${CHAR_NO_BREAK_SPACE}`;
var MILLISECONDS_IN_SECOND = 1e3;
var SECONDS_IN_MINUTE = 60;
var MINUTES_IN_HOUR = 60;
var HOURS_IN_DAY = 24;
var MILLISECONDS_IN_MINUTE = MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE;
var MILLISECONDS_IN_HOUR = MILLISECONDS_IN_MINUTE * MINUTES_IN_HOUR;
var MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;
var DATE_FILLER_LENGTH = 10;
var DATE_RANGE_FILLER_LENGTH = 2 * DATE_FILLER_LENGTH + RANGE_SEPARATOR_CHAR.length;
var TuiDayOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};
var TuiMonthNumber = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};
var TuiYear = class _TuiYear {
  constructor(year) {
    this.year = year;
    ngDevMode && console.assert(_TuiYear.isValidYear(year));
  }
  /**
   * Checks year for validity
   */
  static isValidYear(year) {
    return Number.isInteger(year) && tuiInRange(year, MIN_YEAR, MAX_YEAR + 1);
  }
  /**
   * Check if passed year is a leap year
   */
  static isLeapYear(year) {
    ngDevMode && console.assert(_TuiYear.isValidYear(year));
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
  }
  /**
   * Returns amount of leap years from year 0 to the passed one
   */
  static getAbsoluteLeapYears(year) {
    ngDevMode && console.assert(_TuiYear.isValidYear(year));
    return Math.ceil(year / 400) + (Math.ceil(year / 4) - Math.ceil(year / 100));
  }
  static lengthBetween(from, to) {
    return to.year - from.year;
  }
  /**
   * Normalizes year by clamping it between min and max years
   */
  static normalizeYearPart(year) {
    return tuiNormalizeToIntNumber(year, MIN_YEAR, MAX_YEAR);
  }
  get formattedYear() {
    return String(this.year).padStart(4, "0");
  }
  get isLeapYear() {
    return _TuiYear.isLeapYear(this.year);
  }
  /**
   * Returns amount of leap years from year 0 to current
   */
  get absoluteLeapYears() {
    return _TuiYear.getAbsoluteLeapYears(this.year);
  }
  /**
   * Passed year is after current
   */
  yearBefore({ year }) {
    return this.year < year;
  }
  /**
   * Passed year is the same or after current
   */
  yearSameOrBefore({ year }) {
    return this.year <= year;
  }
  /**
   * Passed year is the same as current
   */
  yearSame({ year }) {
    return this.year === year;
  }
  /**
   * Passed year is either the same of before the current
   */
  yearSameOrAfter({ year }) {
    return this.year >= year;
  }
  /**
   * Passed year is before current
   */
  yearAfter({ year }) {
    return this.year > year;
  }
  /**
   * Immutably offsets year
   */
  append({ year = 0 }) {
    ngDevMode && console.assert(Number.isInteger(year));
    const resultYear = this.year + year;
    ngDevMode && console.assert(_TuiYear.isValidYear(resultYear));
    return new _TuiYear(resultYear);
  }
  toString() {
    return this.formattedYear;
  }
  valueOf() {
    return this.year;
  }
  /**
   * Returns the primitive value of the given Date object.
   * Depending on the argument, the method can return either a string or a number.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/@@toPrimitive
   */
  [Symbol.toPrimitive](hint) {
    return Date.prototype[Symbol.toPrimitive].call(this, hint);
  }
  toJSON() {
    return this.formattedYear;
  }
};
var TuiMonth = class _TuiMonth extends TuiYear {
  /**
   * @param year
   * @param month (starting with 0)
   */
  constructor(year, month) {
    super(year);
    this.month = month;
    ngDevMode && console.assert(_TuiMonth.isValidMonth(year, month));
  }
  /**
   * Tests month and year for validity
   */
  static isValidMonth(year, month) {
    return TuiYear.isValidYear(year) && _TuiMonth.isValidMonthPart(month);
  }
  /**
   * Returns number of days in a month
   */
  static getMonthDaysCount(month, isLeapYear) {
    ngDevMode && console.assert(_TuiMonth.isValidMonthPart(month));
    switch (month) {
      case TuiMonthNumber.April:
      case TuiMonthNumber.June:
      case TuiMonthNumber.November:
      case TuiMonthNumber.September:
        return 30;
      case TuiMonthNumber.February:
        return isLeapYear ? 29 : 28;
      default:
        return 31;
    }
  }
  /**
   * Returns current month and year based on local time zone
   * @nosideeffects
   */
  static currentLocal() {
    const nativeDate = /* @__PURE__ */ new Date();
    return new _TuiMonth(nativeDate.getFullYear(), nativeDate.getMonth());
  }
  /**
   * Returns current month and year based on UTC
   */
  static currentUtc() {
    const nativeDate = /* @__PURE__ */ new Date();
    return new _TuiMonth(nativeDate.getUTCFullYear(), nativeDate.getUTCMonth());
  }
  static lengthBetween(from, to) {
    const absoluteFrom = from.month + from.year * 12;
    const absoluteTo = to.month + to.year * 12;
    return absoluteTo - absoluteFrom;
  }
  /**
   * Normalizes number by clamping it between min and max month
   */
  static normalizeMonthPart(month) {
    return tuiNormalizeToIntNumber(month, MIN_MONTH, MAX_MONTH);
  }
  /**
   * Tests month for validity
   */
  static isValidMonthPart(month) {
    return Number.isInteger(month) && tuiInRange(month, MIN_MONTH, MAX_MONTH + 1);
  }
  get formattedMonthPart() {
    return String(this.month + 1).padStart(2, "0");
  }
  /**
   * Returns days in a month
   */
  get daysCount() {
    return _TuiMonth.getMonthDaysCount(this.month, this.isLeapYear);
  }
  /**
   * Passed month and year are after current
   */
  monthBefore(another) {
    return this.yearBefore(another) || this.yearSame(another) && this.month < another.month;
  }
  /**
   * Passed month and year are after or the same as current
   */
  monthSameOrBefore(another) {
    return this.yearBefore(another) || this.yearSame(another) && this.month <= another.month;
  }
  /**
   * Passed month and year are the same as current
   */
  monthSame(another) {
    return this.yearSame(another) && this.month === another.month;
  }
  /**
   * Passed month and year are either before or equal to current
   */
  monthSameOrAfter(another) {
    return this.yearAfter(another) || this.yearSame(another) && this.month >= another.month;
  }
  /**
   * Passed month and year are before current
   */
  monthAfter(another) {
    return this.yearAfter(another) || this.yearSame(another) && this.month > another.month;
  }
  /**
   * Immutably alters current month and year by passed offset
   *
   * @param offset
   * @return new month and year object as a result of offsetting current
   */
  append({ year = 0, month = 0 }) {
    const totalMonths = (this.year + year) * MONTHS_IN_YEAR + this.month + month;
    return new _TuiMonth(Math.floor(totalMonths / MONTHS_IN_YEAR), totalMonths % MONTHS_IN_YEAR);
  }
  toString() {
    return `${this.formattedMonthPart}.${this.formattedYear}`;
  }
  valueOf() {
    return this.toLocalNativeDate().valueOf();
  }
  toJSON() {
    return `${super.toJSON()}-${this.formattedMonthPart}`;
  }
  /**
   * Returns native {@link Date} based on local time zone
   */
  toLocalNativeDate() {
    const date = new Date(this.year, this.month);
    date.setFullYear(this.year);
    return date;
  }
  /**
   * Returns native {@link Date} based on UTC
   */
  toUtcNativeDate() {
    return new Date(Date.UTC(this.year, this.month));
  }
};
var TuiDay = class _TuiDay extends TuiMonth {
  /**
   * @param year
   * @param month (starting with 0)
   * @param day
   */
  constructor(year, month, day) {
    super(year, month);
    this.day = day;
    ngDevMode && console.assert(_TuiDay.isValidDay(year, month, day));
  }
  /**
   * Creates {@link TuiDay} from native {@link Date} based on local time zone
   */
  static fromLocalNativeDate(date) {
    return new _TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }
  /**
   * Creates {@link TuiDay} from native {@link Date} using UTC
   */
  static fromUtcNativeDate(date) {
    return new _TuiDay(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }
  /**
   * Check validity of year, month and day
   *
   * @param year
   * @param month
   * @param day
   * @return boolean validity
   */
  static isValidDay(year, month, day) {
    return TuiMonth.isValidMonth(year, month) && Number.isInteger(day) && tuiInRange(day, MIN_DAY, TuiMonth.getMonthDaysCount(month, TuiYear.isLeapYear(year)) + 1);
  }
  /**
   * Current day based on local time zone
   */
  static currentLocal() {
    const nativeDate = /* @__PURE__ */ new Date();
    const year = nativeDate.getFullYear();
    const month = nativeDate.getMonth();
    const day = nativeDate.getDate();
    return new _TuiDay(year, month, day);
  }
  /**
   * Returns current day based on UTC
   */
  static currentUtc() {
    const nativeDate = /* @__PURE__ */ new Date();
    const year = nativeDate.getUTCFullYear();
    const month = nativeDate.getUTCMonth();
    const day = nativeDate.getUTCDate();
    return new _TuiDay(year, month, day);
  }
  /**
   * Calculates {@link TuiDay} normalizing year, month and day. {@link NaN} is turned into minimal value.
   *
   * @param year any year value, including invalid
   * @param month any month value, including invalid (months start with 0)
   * @param day any day value, including invalid
   * @return normalized date
   */
  static normalizeOf(year, month, day) {
    const normalizedYear = TuiYear.normalizeYearPart(year);
    const normalizedMonth = TuiMonth.normalizeMonthPart(month);
    const normalizedDay = _TuiDay.normalizeDayPart(day, normalizedMonth, normalizedYear);
    return new _TuiDay(normalizedYear, normalizedMonth, normalizedDay);
  }
  static lengthBetween(from, to) {
    return Math.round((to.toLocalNativeDate().getTime() - from.toLocalNativeDate().getTime()) / (1e3 * 60 * 60 * 24));
  }
  static parseRawDateString(date, dateMode = "DMY") {
    ngDevMode && console.assert(date.length === DATE_FILLER_LENGTH, "[parseRawDateString]: wrong date string length");
    switch (dateMode) {
      case "MDY":
        return {
          day: parseInt(date.slice(3, 5), 10),
          month: parseInt(date.slice(0, 2), 10) - 1,
          year: parseInt(date.slice(6, 10), 10)
        };
      case "YMD":
        return {
          day: parseInt(date.slice(8, 10), 10),
          month: parseInt(date.slice(5, 7), 10) - 1,
          year: parseInt(date.slice(0, 4), 10)
        };
      case "DMY":
      default:
        return {
          day: parseInt(date.slice(0, 2), 10),
          month: parseInt(date.slice(3, 5), 10) - 1,
          year: parseInt(date.slice(6, 10), 10)
        };
    }
  }
  // TODO: Move month and year related code corresponding classes
  /**
   * Parsing a string with date with normalization
   *
   * @param rawDate date string
   * @param dateMode date format of the date string (DMY | MDY | YMD)
   * @return normalized date
   */
  static normalizeParse(rawDate, dateMode = "DMY") {
    const { day, month, year } = this.parseRawDateString(rawDate, dateMode);
    return _TuiDay.normalizeOf(year, month, day);
  }
  /**
   * Parsing a date stringified in a toJSON format
   * @param yearMonthDayString date string in format of YYYY-MM-DD
   * @return date
   * @throws exceptions if any part of the date is invalid
   */
  static jsonParse(yearMonthDayString) {
    const { day, month, year } = this.parseRawDateString(yearMonthDayString, "YMD");
    if (!TuiMonth.isValidMonth(year, month) || !Number.isInteger(day) || !tuiInRange(day, MIN_DAY, TuiMonth.getMonthDaysCount(month, TuiYear.isLeapYear(year)) + 1)) {
      throw new TuiInvalidDayException(year, month, day);
    }
    return new _TuiDay(year, month, day);
  }
  static normalizeDayPart(day, month, year) {
    ngDevMode && console.assert(TuiMonth.isValidMonth(year, month));
    const monthDaysCount = TuiMonth.getMonthDaysCount(month, TuiYear.isLeapYear(year));
    return tuiNormalizeToIntNumber(day, 1, monthDaysCount);
  }
  get formattedDayPart() {
    return String(this.day).padStart(2, "0");
  }
  get isWeekend() {
    const dayOfWeek = this.dayOfWeek(false);
    return dayOfWeek === TuiDayOfWeek.Saturday || dayOfWeek === TuiDayOfWeek.Sunday;
  }
  /**
   * Returns day of week
   *
   * @param startFromMonday whether week starts from Monday and not from Sunday
   * @return day of week (from 0 to 6)
   */
  dayOfWeek(startFromMonday = true) {
    const dayOfWeek = startFromMonday ? this.toLocalNativeDate().getDay() - 1 : this.toLocalNativeDate().getDay();
    return dayOfWeek < 0 ? 6 : dayOfWeek;
  }
  /**
   * Passed date is after current
   */
  dayBefore(another) {
    return this.monthBefore(another) || this.monthSame(another) && this.day < another.day;
  }
  /**
   * Passed date is after or equals to current
   */
  daySameOrBefore(another) {
    return this.monthBefore(another) || this.monthSame(another) && this.day <= another.day;
  }
  /**
   * Passed date is the same as current
   */
  daySame(another) {
    return this.monthSame(another) && this.day === another.day;
  }
  /**
   * Passed date is either before or the same as current
   */
  daySameOrAfter(another) {
    return this.monthAfter(another) || this.monthSame(another) && this.day >= another.day;
  }
  /**
   * Passed date is before current
   */
  dayAfter(another) {
    return this.monthAfter(another) || this.monthSame(another) && this.day > another.day;
  }
  /**
   * Clamping date between two limits
   *
   * @param min
   * @param max
   * @return clamped date
   */
  dayLimit(min, max) {
    if (min !== null && this.dayBefore(min)) {
      return min;
    }
    if (max !== null && this.dayAfter(max)) {
      return max;
    }
    return this;
  }
  /**
   * Immutably alters current day by passed offset
   *
   * If resulting month has more days than original one, date is rounded to the maximum day
   * in the resulting month. Offset of days will be calculated based on the resulted year and month
   * to not interfere with parent classes methods
   *
   * @param offset
   * @return new date object as a result of offsetting current
   */
  append({ year = 0, month = 0, day = 0 }) {
    const totalMonths = (this.year + year) * MONTHS_IN_YEAR + this.month + month;
    let years = Math.floor(totalMonths / MONTHS_IN_YEAR);
    let months = totalMonths % MONTHS_IN_YEAR;
    const monthDaysCount = TuiMonth.getMonthDaysCount(months, TuiYear.isLeapYear(years));
    const currentMonthDaysCount = TuiMonth.getMonthDaysCount(this.month, TuiYear.isLeapYear(years));
    let days = day;
    if (this.day >= monthDaysCount) {
      days += this.day - (currentMonthDaysCount - monthDaysCount);
    } else if (currentMonthDaysCount < monthDaysCount && this.day === currentMonthDaysCount) {
      days += this.day + (monthDaysCount - currentMonthDaysCount);
    } else {
      days += this.day;
    }
    while (days > TuiMonth.getMonthDaysCount(months, TuiYear.isLeapYear(years))) {
      days -= TuiMonth.getMonthDaysCount(months, TuiYear.isLeapYear(years));
      if (months === TuiMonthNumber.December) {
        years++;
        months = TuiMonthNumber.January;
      } else {
        months++;
      }
    }
    while (days < MIN_DAY) {
      if (months === TuiMonthNumber.January) {
        years--;
        months = TuiMonthNumber.December;
      } else {
        months--;
      }
      days += TuiMonth.getMonthDaysCount(months, TuiYear.isLeapYear(years));
    }
    return new _TuiDay(years, months, days);
  }
  /**
   * Returns formatted whole date
   */
  getFormattedDay(dateFormat, separator) {
    ngDevMode && console.assert(separator.length === 1, "Separator should consist of only 1 symbol");
    const dd = this.formattedDayPart;
    const mm = this.formattedMonthPart;
    const yyyy = this.formattedYear;
    switch (dateFormat) {
      case "MDY":
        return `${mm}${separator}${dd}${separator}${yyyy}`;
      case "YMD":
        return `${yyyy}${separator}${mm}${separator}${dd}`;
      case "DMY":
      default:
        return `${dd}${separator}${mm}${separator}${yyyy}`;
    }
  }
  toString(dateFormat = "DMY", separator = ".") {
    return this.getFormattedDay(dateFormat, separator);
  }
  toJSON() {
    return `${super.toJSON()}-${this.formattedDayPart}`;
  }
  /**
   * Returns native {@link Date} based on local time zone
   */
  toLocalNativeDate() {
    const date = super.toLocalNativeDate();
    date.setDate(this.day);
    return date;
  }
  /**
   * Returns native {@link Date} based on UTC
   */
  toUtcNativeDate() {
    return new Date(Date.UTC(this.year, this.month, this.day));
  }
};
var TuiInvalidDayException = class extends Error {
  constructor(year, month, day) {
    super(ngDevMode ? `Invalid day: ${year}-${month}-${day}` : "");
  }
};
var TuiMonthRange = class _TuiMonthRange {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    ngDevMode && console.assert(from.monthSameOrBefore(to));
  }
  static sort(month1, month2) {
    return month1.monthSameOrBefore(month2) ? new _TuiMonthRange(month1, month2) : new _TuiMonthRange(month2, month1);
  }
  get isSingleMonth() {
    return this.from.monthSame(this.to);
  }
  monthSame(another) {
    return this.from.monthSame(another.from) && this.to.monthSame(another.to);
  }
  toString() {
    return `${this.from}${RANGE_SEPARATOR_CHAR}${this.to}`;
  }
};
var TuiDayRange = class _TuiDayRange extends TuiMonthRange {
  constructor(from, to) {
    super(from, to);
    this.from = from;
    this.to = to;
    ngDevMode && console.assert(from.daySameOrBefore(to));
  }
  /**
   * Creates range from two days after sorting them
   *
   * @param day1
   * @param day2
   * @return new range with sorted days
   */
  static sort(day1, day2) {
    return day1.daySameOrBefore(day2) ? new _TuiDayRange(day1, day2) : new _TuiDayRange(day2, day1);
  }
  /**
   * Parse and correct a day range in string format
   *
   * @param rangeString a string of dates in a format dd.mm.yyyy - dd.mm.yyyy
   * @param dateMode {@link TuiDateMode}
   * @return normalized day range object
   */
  static normalizeParse(rangeString, dateMode = "DMY") {
    const leftDay = TuiDay.normalizeParse(rangeString.slice(0, DATE_FILLER_LENGTH), dateMode);
    if (rangeString.length < DATE_RANGE_FILLER_LENGTH) {
      return new _TuiDayRange(leftDay, leftDay);
    }
    return _TuiDayRange.sort(leftDay, TuiDay.normalizeParse(rangeString.slice(DATE_FILLER_LENGTH + RANGE_SEPARATOR_CHAR.length), dateMode));
  }
  get isSingleDay() {
    return this.from.daySame(this.to);
  }
  /**
   * Tests ranges for identity
   *
   * @param another second range to test against current
   * @return `true` if days are identical
   */
  daySame(another) {
    return this.from.daySame(another.from) && this.to.daySame(another.to);
  }
  /**
   * Locks range between two days included, or limits from one side if the other is null
   *
   * @param min
   * @param max
   * @return range — clamped range
   */
  dayLimit(min, max) {
    return new _TuiDayRange(this.from.dayLimit(min, max), this.to.dayLimit(min, max));
  }
  /**
   * Human readable format.
   */
  getFormattedDayRange(dateFormat, dateSeparator) {
    const from = this.from.getFormattedDay(dateFormat, dateSeparator);
    const to = this.to.getFormattedDay(dateFormat, dateSeparator);
    return `${from}${RANGE_SEPARATOR_CHAR}${to}`;
  }
  toString(dateFormat = "DMY", dateSeparator = ".") {
    return this.getFormattedDayRange(dateFormat, dateSeparator);
  }
  toArray() {
    const { from, to } = this;
    const arr = [];
    for (const day = from.toUtcNativeDate(); day <= to.toUtcNativeDate(); day.setDate(day.getDate() + 1)) {
      arr.push(TuiDay.fromLocalNativeDate(day));
    }
    return arr;
  }
};
var TUI_FIRST_DAY = new TuiDay(MIN_YEAR, MIN_MONTH, MIN_DAY);
var TUI_LAST_DAY = new TuiDay(MAX_YEAR, MAX_MONTH, 31);
var TUI_LAST_DISPLAYED_DAY = new TuiDay(MAX_DISPLAYED_YEAR, MAX_MONTH, 31);
var TuiTime = class _TuiTime {
  constructor(hours, minutes, seconds = 0, ms = 0) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.ms = ms;
    ngDevMode && console.assert(
      // Currently `TuiTime` could have hours more than 23
      // in order to not break current behaviour of `isValidTime` the logic is duplicated
      Number.isInteger(hours) && tuiInRange(hours, 0, Infinity) && Number.isInteger(minutes) && tuiInRange(minutes, 0, MINUTES_IN_HOUR) && Number.isInteger(seconds) && tuiInRange(seconds, 0, SECONDS_IN_MINUTE) && Number.isInteger(ms) && tuiInRange(ms, 0, 1e3),
      "Time must be real, but got:",
      hours,
      minutes,
      seconds,
      ms
    );
  }
  /**
   * Checks if time is valid
   */
  static isValidTime(hours, minutes, seconds = 0, ms = 0) {
    return Number.isInteger(hours) && tuiInRange(hours, 0, HOURS_IN_DAY) && Number.isInteger(minutes) && tuiInRange(minutes, 0, MINUTES_IN_HOUR) && Number.isInteger(seconds) && tuiInRange(seconds, 0, SECONDS_IN_MINUTE) && Number.isInteger(ms) && tuiInRange(ms, 0, 1e3);
  }
  /**
   * Current UTC time.
   */
  static current() {
    return _TuiTime.fromAbsoluteMilliseconds(Date.now() % MILLISECONDS_IN_DAY);
  }
  /**
   * Current time in local timezone
   */
  static currentLocal() {
    const date = /* @__PURE__ */ new Date();
    return _TuiTime.fromAbsoluteMilliseconds((Date.now() - date.getTimezoneOffset() * MILLISECONDS_IN_MINUTE) % MILLISECONDS_IN_DAY);
  }
  /**
   * Calculates TuiTime from milliseconds
   */
  static fromAbsoluteMilliseconds(milliseconds) {
    ngDevMode && console.assert(Number.isInteger(milliseconds) && milliseconds >= 0, "Milliseconds must be a non-negative integer.");
    const hours = Math.floor(milliseconds / MILLISECONDS_IN_HOUR);
    const minutes = Math.floor(milliseconds % MILLISECONDS_IN_HOUR / MILLISECONDS_IN_MINUTE);
    const seconds = Math.floor(milliseconds % MILLISECONDS_IN_HOUR % MILLISECONDS_IN_MINUTE / 1e3) || 0;
    const ms = Math.floor(milliseconds % MILLISECONDS_IN_HOUR % MILLISECONDS_IN_MINUTE % 1e3) || 0;
    return new _TuiTime(hours, minutes, seconds, ms);
  }
  /**
   * Parses string into TuiTime object
   */
  static fromString(time) {
    const hours = this.parseHours(time);
    const minutes = Number(time.slice(3, 5)) || 0;
    const seconds = Number(time.slice(6, 8)) || 0;
    const ms = Number(time.slice(9, 12)) || 0;
    return new _TuiTime(hours, minutes, seconds, ms);
  }
  /**
   * Converts Date object into TuiTime
   * @param date
   */
  static fromLocalNativeDate(date) {
    return new _TuiTime(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }
  static parseMeridiemPeriod(time) {
    return /[AP]M/.exec(time.toUpperCase().replaceAll(/\W/g, ""))?.[0] || null;
  }
  static parseHours(time) {
    const hours = Number(time.slice(0, 2));
    const meridiem = this.parseMeridiemPeriod(time);
    if (!meridiem) {
      return hours;
    }
    if (hours === 12) {
      return meridiem === "AM" ? 0 : 12;
    }
    return meridiem === "PM" ? hours + 12 : hours;
  }
  /**
   * Shifts time by hours and minutes
   */
  shift({ hours = 0, minutes = 0, seconds = 0, ms = 0 }) {
    const totalMs = this.toAbsoluteMilliseconds() + hours * MILLISECONDS_IN_HOUR + minutes * MILLISECONDS_IN_MINUTE + seconds * MILLISECONDS_IN_SECOND + ms;
    const totalSeconds = Math.floor(totalMs / MILLISECONDS_IN_SECOND);
    const totalMinutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE);
    const totalHours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    return new _TuiTime(this.normalizeToRange(totalHours, HOURS_IN_DAY), this.normalizeToRange(totalMinutes, MINUTES_IN_HOUR), this.normalizeToRange(totalSeconds, SECONDS_IN_MINUTE), this.normalizeToRange(totalMs, MILLISECONDS_IN_SECOND));
  }
  /**
   * Converts TuiTime to string
   */
  toString(mode) {
    const needAddMs = mode?.startsWith("HH:MM:SS.MSS") || !mode && this.ms > 0;
    const needAddSeconds = needAddMs || mode?.startsWith("HH:MM:SS") || !mode && this.seconds > 0;
    const { hours = this.hours, meridiem = "" } = mode?.includes("AA") ? this.toTwelveHour(this.hours) : {};
    const hhMm = `${this.formatTime(hours)}:${this.formatTime(this.minutes)}`;
    const ss = needAddSeconds ? `:${this.formatTime(this.seconds)}` : "";
    const mss = needAddMs ? `.${this.formatTime(this.ms, 3)}` : "";
    const aa = meridiem && `${CHAR_NO_BREAK_SPACE}${meridiem}`;
    return `${hhMm}${ss}${mss}${aa}`;
  }
  valueOf() {
    return this.toAbsoluteMilliseconds();
  }
  /**
   * Returns the primitive value of the given Date object.
   * Depending on the argument, the method can return either a string or a number.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/@@toPrimitive
   */
  [Symbol.toPrimitive](hint) {
    return Date.prototype[Symbol.toPrimitive].call(this, hint);
  }
  /**
   * Converts TuiTime to milliseconds
   */
  toAbsoluteMilliseconds() {
    return this.hours * MILLISECONDS_IN_HOUR + this.minutes * MILLISECONDS_IN_MINUTE + this.seconds * 1e3 + this.ms;
  }
  formatTime(time, digits = 2) {
    return String(time).padStart(digits, "0");
  }
  toTwelveHour(hours) {
    const meridiem = hours >= 12 ? "PM" : "AM";
    if (hours === 0 || hours === 12) {
      return { meridiem, hours: 12 };
    }
    return { meridiem, hours: hours % 12 };
  }
  normalizeToRange(value, modulus) {
    return (value % modulus + modulus) % modulus;
  }
};

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-tokens.mjs
var TUI_REDUCED_MOTION = new InjectionToken(ngDevMode ? "TUI_REDUCED_MOTION" : "", {
  factory: () => inject(DOCUMENT).defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
});
var TUI_ANIMATIONS_SPEED = new InjectionToken(ngDevMode ? "TUI_ANIMATIONS_SPEED" : "", {
  factory: () => inject(TUI_REDUCED_MOTION) ? 0 : 1
});
var TUI_ASSETS_PATH = new InjectionToken(ngDevMode ? "TUI_ASSETS_PATH" : "", {
  factory: () => "assets/taiga-ui/icons"
});
function tuiAssetsPathProvider(useValue) {
  return {
    provide: TUI_ASSETS_PATH,
    useValue
  };
}
var TUI_AUXILIARY = new InjectionToken(ngDevMode ? "TUI_AUXILIARY" : "", {
  factory: () => null
});
function tuiAsAuxiliary(x) {
  return tuiProvide(TUI_AUXILIARY, x);
}
var COMMON_ICONS = {
  check: "@tui.check",
  close: "@tui.x",
  error: "@tui.circle-alert",
  more: "@tui.chevron-right",
  search: "@tui.search",
  ellipsis: "@tui.ellipsis"
};
var TUI_COMMON_ICONS = new InjectionToken(ngDevMode ? "TUI_COMMON_ICONS" : "", {
  factory: () => COMMON_ICONS
});
function tuiCommonIconsProvider(icons) {
  return tuiProvideOptions(TUI_COMMON_ICONS, icons, COMMON_ICONS);
}
var TUI_DARK_MODE_DEFAULT_KEY = "tuiDark";
var TUI_DARK_MODE_KEY = new InjectionToken(ngDevMode ? "TUI_DARK_MODE_KEY" : "", {
  factory: () => TUI_DARK_MODE_DEFAULT_KEY
});
var TUI_DARK_MODE = new InjectionToken(ngDevMode ? "TUI_DARK_MODE" : "", {
  factory: () => {
    let automatic = true;
    const storage = inject(WA_LOCAL_STORAGE);
    const key = inject(TUI_DARK_MODE_KEY);
    const saved = storage?.getItem(key);
    const media = inject(WA_WINDOW).matchMedia("(prefers-color-scheme: dark)");
    const result = signal(Boolean((saved && JSON.parse(saved)) ?? media.matches));
    fromEvent(media, "change").pipe(filter(() => !storage?.getItem(key)), takeUntilDestroyed()).subscribe(() => {
      automatic = true;
      result.set(media.matches);
    });
    untracked(() => {
      effect(() => {
        const value = String(result());
        if (automatic) {
          automatic = false;
        } else {
          storage?.setItem(key, value);
        }
      });
    });
    return Object.assign(result, {
      reset: () => {
        storage?.removeItem(key);
        automatic = true;
        result.set(media.matches);
      }
    });
  }
});
var TUI_DEFAULT_DATE_FORMAT = {
  mode: "DMY",
  separator: "."
};
var TUI_DATE_FORMAT = new InjectionToken(ngDevMode ? "TUI_DATE_FORMAT" : "", {
  factory: () => of(TUI_DEFAULT_DATE_FORMAT)
});
function tuiDateFormatProvider(options) {
  return {
    provide: TUI_DATE_FORMAT,
    deps: [[new Optional(), new SkipSelf(), TUI_DATE_FORMAT]],
    useFactory: (parent) => (parent || of(TUI_DEFAULT_DATE_FORMAT)).pipe(map((format) => __spreadValues(__spreadValues({}, format), options)))
  };
}
var TUI_DAY_TYPE_HANDLER = new InjectionToken(ngDevMode ? "TUI_DAY_TYPE_HANDLER" : "", {
  factory: () => (day) => day.isWeekend ? "weekend" : "weekday"
});
var TUI_FIRST_DAY_OF_WEEK = new InjectionToken(ngDevMode ? "TUI_FIRST_DAY_OF_WEEK" : "", {
  factory: () => TuiDayOfWeek.Monday
});
var TUI_MONTHS = new InjectionToken(ngDevMode ? "TUI_MONTHS" : "", {
  factory: tuiExtractI18n("months")
});
var TUI_CLOSE_WORD = new InjectionToken(ngDevMode ? "TUI_CLOSE_WORD" : "", {
  factory: tuiExtractI18n("close")
});
var TUI_BACK_WORD = new InjectionToken(ngDevMode ? "TUI_BACK_WORD" : "", {
  factory: tuiExtractI18n("back")
});
var TUI_CLEAR_WORD = new InjectionToken(ngDevMode ? "TUI_CLEAR_WORD" : "", {
  factory: tuiExtractI18n("clear")
});
var TUI_NOTHING_FOUND_MESSAGE = new InjectionToken(ngDevMode ? "TUI_NOTHING_FOUND_MESSAGE" : "", {
  factory: tuiExtractI18n("nothingFoundMessage")
});
var TUI_DEFAULT_ERROR_MESSAGE = new InjectionToken(ngDevMode ? "TUI_DEFAULT_ERROR_MESSAGE" : "", {
  factory: tuiExtractI18n("defaultErrorMessage")
});
var TUI_SPIN_TEXTS = new InjectionToken(ngDevMode ? "TUI_SPIN_TEXTS" : "", {
  factory: tuiExtractI18n("spinTexts")
});
var TUI_SHORT_WEEK_DAYS = new InjectionToken(ngDevMode ? "TUI_SHORT_WEEK_DAYS" : "", {
  factory: tuiExtractI18n("shortWeekDays")
});
var TUI_ICON_START = new InjectionToken(ngDevMode ? "TUI_ICON_START" : "", {
  factory: () => ""
});
var TUI_ICON_END = new InjectionToken(ngDevMode ? "TUI_ICON_END" : "", {
  factory: () => ""
});
var TUI_ICON_REGISTRY = new InjectionToken(ngDevMode ? "TUI_ICON_REGISTRY" : "", {
  factory: () => ({})
});
var TUI_ICON_STARTS = TUI_ICON_REGISTRY;
function tuiIconsProvider(icons) {
  return {
    provide: TUI_ICON_REGISTRY,
    useFactory: () => __spreadValues(__spreadValues({}, inject(TUI_ICON_REGISTRY, { skipSelf: true, optional: true }) || {}), Object.fromEntries(Object.entries(icons).map(([key, value]) => [
      key,
      `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(value)}`
    ])))
  };
}
var ICON_MODE_PREFIXES = { font: "@font.", image: "@img." };
var TUI_ICON_RESOLVER = new InjectionToken(ngDevMode ? "TUI_ICON_RESOLVER" : "", {
  factory: () => {
    const path = inject(TUI_ASSETS_PATH);
    return (icon) => `${path}/${icon.replace(/@[a-zA-Z]+\./, "").split(".").join("/")}.svg`;
  }
});
var TUI_ICON_START_RESOLVER = TUI_ICON_RESOLVER;
function tuiGetIconMode(icon) {
  if (!icon) {
    return null;
  }
  if (icon.startsWith(ICON_MODE_PREFIXES.image)) {
    return "image";
  }
  return icon.startsWith(ICON_MODE_PREFIXES.font) ? "font" : "svg";
}
function tuiInjectIconResolver() {
  const icons = inject(TUI_ICON_REGISTRY);
  const resolver = inject(TUI_ICON_RESOLVER);
  return (icon) => {
    if (!icon || icon.includes("/")) {
      return icon;
    }
    if (tuiGetIconMode(icon) === "font") {
      return icon.slice(ICON_MODE_PREFIXES.font.length);
    }
    return icons[icon] ?? resolver(icon);
  };
}
function tuiIconResolverProvider(useValue) {
  return { provide: TUI_ICON_RESOLVER, useValue };
}
var TUI_MEDIA = new InjectionToken(ngDevMode ? "TUI_MEDIA" : "", {
  factory: () => ({
    mobile: 768,
    desktopSmall: 1024,
    desktopLarge: 1280
  })
});
var TUI_DEFAULT_NUMBER_FORMAT = {
  precision: NaN,
  decimalSeparator: ".",
  thousandSeparator: CHAR_NO_BREAK_SPACE,
  rounding: "truncate",
  decimalMode: "pad"
};
var TUI_NUMBER_FORMAT = new InjectionToken(ngDevMode ? "TUI_NUMBER_FORMAT" : "", {
  factory: () => of(TUI_DEFAULT_NUMBER_FORMAT)
});
function tuiNumberFormatProvider(options) {
  return {
    provide: TUI_NUMBER_FORMAT,
    deps: [[new Optional(), new SkipSelf(), TUI_NUMBER_FORMAT]],
    useFactory: (parent) => (parent || of(TUI_DEFAULT_NUMBER_FORMAT)).pipe(map((format) => __spreadValues(__spreadValues({}, format), options)))
  };
}
var TUI_SCROLL_REF = new InjectionToken(ngDevMode ? "TUI_SCROLL_REF" : "", {
  factory: () => new ElementRef(inject(DOCUMENT).documentElement)
});
var TUI_SELECTION_STREAM = new InjectionToken(ngDevMode ? "TUI_SELECTION_STREAM" : "", {
  factory: () => {
    const doc = inject(DOCUMENT);
    return merge(tuiTypedFromEvent(doc, "selectionchange"), tuiTypedFromEvent(doc, "mouseup"), tuiTypedFromEvent(doc, "mousedown").pipe(switchMap(() => tuiTypedFromEvent(doc, "mousemove").pipe(takeUntil(tuiTypedFromEvent(doc, "mouseup"))))), tuiTypedFromEvent(doc, "keydown"), tuiTypedFromEvent(doc, "keyup")).pipe(share());
  }
});
var TUI_SPIN_ICONS = new InjectionToken(ngDevMode ? "TUI_SPIN_ICONS" : "", {
  factory: () => ({
    decrement: "@tui.chevron-left",
    increment: "@tui.chevron-right"
  })
});
var TUI_THEME = new InjectionToken(ngDevMode ? "TUI_THEME" : "", {
  factory: () => "Taiga UI"
});
var TUI_VIEWPORT = new InjectionToken(ngDevMode ? "TUI_VIEWPORT" : "", {
  factory: () => {
    const win = inject(WA_WINDOW);
    return {
      type: "viewport",
      getClientRect() {
        const { height = 0, offsetTop = 0 } = win.visualViewport || {};
        const rect2 = {
          top: 0,
          left: 0,
          right: win.innerWidth,
          bottom: win.innerHeight,
          width: win.innerWidth,
          height: height + offsetTop || win.innerHeight,
          x: 0,
          y: 0
        };
        return __spreadProps(__spreadValues({}, rect2), {
          toJSON: () => JSON.stringify(rect2)
        });
      }
    };
  }
});
function tuiAsViewport(accessor) {
  return tuiProvide(TUI_VIEWPORT, accessor);
}

// node_modules/@taiga-ui/polymorpheus/fesm2022/taiga-ui-polymorpheus.mjs
var POLYMORPHEUS_CONTEXT = new InjectionToken("");
function provideContext(useValue) {
  return {
    provide: POLYMORPHEUS_CONTEXT,
    useValue
  };
}
function injectContext(options = {}) {
  return inject(POLYMORPHEUS_CONTEXT, options);
}
var PolymorpheusComponent = class {
  constructor(component, i) {
    this.component = component;
    this.i = i;
  }
  createInjector(injector, useValue) {
    return Injector.create({
      parent: this.i || injector,
      providers: useValue == null ? [] : [provideContext(useValue)]
    });
  }
};
var PolymorpheusContext = class {
  constructor($implicit) {
    this.$implicit = $implicit;
  }
  get polymorpheusOutlet() {
    return this.$implicit;
  }
};
function isPrimitive(value) {
  return Object(value) !== value;
}
var PolymorpheusTemplate = class _PolymorpheusTemplate {
  constructor(template = inject(TemplateRef, {
    self: true
  }), cdr = inject(ChangeDetectorRef)) {
    this.template = template;
    this.cdr = cdr;
    this.polymorpheus = "";
  }
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  check() {
    this.cdr.markForCheck();
  }
  static {
    this.ɵfac = function PolymorpheusTemplate_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PolymorpheusTemplate)(ɵɵdirectiveInject(TemplateRef), ɵɵdirectiveInject(ChangeDetectorRef));
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _PolymorpheusTemplate,
      selectors: [["ng-template", "polymorpheus", ""]],
      inputs: {
        polymorpheus: "polymorpheus"
      },
      exportAs: ["polymorpheus"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PolymorpheusTemplate, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[polymorpheus]",
      inputs: ["polymorpheus"],
      exportAs: "polymorpheus"
    }]
  }], function() {
    return [{
      type: TemplateRef
    }, {
      type: ChangeDetectorRef
    }];
  }, null);
})();
var PolymorpheusOutlet = class _PolymorpheusOutlet {
  constructor() {
    this.vcr = inject(ViewContainerRef);
    this.i = inject(INJECTOR$1);
    this.t = inject(TemplateRef);
    this.content = "";
  }
  static ngTemplateContextGuard(_dir, _ctx) {
    return true;
  }
  ngOnChanges({
    content
  }) {
    const context = this.getContext();
    const component = isComponent(this.content);
    this.update();
    this.c?.injector.get(ChangeDetectorRef).markForCheck();
    if (!content) {
      return;
    }
    this.vcr.clear();
    const proxy = new Proxy(ensureContext(context), {
      get: (_, key) => ensureContext(component ? this.context : this.getContext())?.[key]
    });
    if (isComponent(this.content)) {
      this.process(this.content, context == null ? void 0 : proxy);
      this.update();
    } else if ((context instanceof PolymorpheusContext && context.$implicit) != null) {
      this.vcr.createEmbeddedView(this.template, proxy, {
        injector: this.i
      });
    }
  }
  ngDoCheck() {
    if (isDirective(this.content)) {
      this.content.check();
    }
  }
  get template() {
    if (isDirective(this.content)) {
      return this.content.template;
    }
    return this.content instanceof TemplateRef ? this.content : this.t;
  }
  getContext() {
    if (isTemplate(this.content) || isComponent(this.content)) {
      return this.context;
    }
    return new PolymorpheusContext(typeof this.content === "function" ? this.content(this.context ?? {}) : this.content);
  }
  process(content, proxy) {
    this.c = this.vcr.createComponent(content.component, {
      injector: content.createInjector(this.i, proxy)
    });
  }
  update() {
    if (typeof this.context !== "object" || !isComponent(this.content)) {
      return;
    }
    const {
      inputs = []
    } = reflectComponentType(this.content.component) || {};
    for (const {
      templateName
    } of inputs) {
      if (templateName in (this.context ?? {})) {
        this.c?.setInput(templateName, this.context?.[templateName]);
      }
    }
  }
  static {
    this.ɵfac = function PolymorpheusOutlet_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PolymorpheusOutlet)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _PolymorpheusOutlet,
      selectors: [["", "polymorpheusOutlet", ""]],
      inputs: {
        content: [0, "polymorpheusOutlet", "content"],
        context: [0, "polymorpheusOutletContext", "context"]
      },
      features: [ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PolymorpheusOutlet, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[polymorpheusOutlet]"
    }]
  }], null, {
    content: [{
      type: Input,
      args: ["polymorpheusOutlet"]
    }],
    context: [{
      type: Input,
      args: ["polymorpheusOutletContext"]
    }]
  });
})();
function isDirective(content) {
  return content instanceof PolymorpheusTemplate;
}
function isComponent(content) {
  return content instanceof PolymorpheusComponent;
}
function isTemplate(content) {
  return isDirective(content) || content instanceof TemplateRef;
}
function ensureContext(context) {
  return isPrimitive(context) ? new PolymorpheusContext(context) : context;
}

// node_modules/@ng-web-apis/platform/fesm2022/ng-web-apis-platform.mjs
var WA_SAFARI_REG_EXP = /^((?!chrome|android).)*safari/i;
var WA_IOS_REG_EXP = /ipad|iphone|ipod/i;
function isIos({ userAgent, maxTouchPoints }) {
  return WA_IOS_REG_EXP.test(userAgent) || WA_SAFARI_REG_EXP.test(userAgent) && maxTouchPoints > 1;
}
var WA_IS_IOS = new InjectionToken("", {
  factory: () => isIos(inject(WA_NAVIGATOR))
});
var firstRegex = (
  // eslint-disable-next-line sonarjs/regex-complexity
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/
);
var secondRegex = (
  // eslint-disable-next-line sonarjs/regex-complexity
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/
);
var WA_IS_MOBILE = new InjectionToken("", {
  factory: () => firstRegex.test(inject(WA_USER_AGENT).toLowerCase()) || secondRegex.test(inject(WA_USER_AGENT).slice(0, 4).toLowerCase())
});
var WA_IS_ANDROID = new InjectionToken("", {
  factory: () => inject(WA_IS_MOBILE) && !inject(WA_IS_IOS)
});
var WA_IS_TOUCH = new InjectionToken("", {
  factory: () => {
    const media = inject(WA_WINDOW).matchMedia("(pointer: coarse)");
    return toSignal(fromEvent(media, "change").pipe(map(() => media.matches)), {
      initialValue: media.matches
    });
  }
});
var WA_IS_WEBKIT = new InjectionToken("", {
  factory: () => !!inject(WA_WINDOW)?.webkitConvertPointFromNodeToPage
});

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-browser.mjs
function tuiIsSafari({ ownerDocument: doc }) {
  const win = doc?.defaultView;
  const isMacOsSafari = win.safari !== void 0 && win.safari?.pushNotification?.toString() === "[object SafariRemoteNotification]";
  const isIosSafari = (win.navigator?.vendor?.includes("Apple") && !win.navigator?.userAgent?.includes("CriOS") && !win.navigator?.userAgent?.includes("FxiOS")) ?? false;
  return isMacOsSafari || isIosSafari;
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-color.mjs
var COMMA = String.raw`\s*,\s*`;
var HEX = "#(?:[a-f0-9]{6}|[a-f0-9]{3})";
var RGB = String.raw`\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*\)`;
var RGBA = String.raw`\(\s*(?:\d{1,3}\s*,\s*){2}\d{1,3}\s*,\s*\d*\.?\d+\)`;
var VALUE = String.raw`(?:[+-]?\d*\.?\d+)(?:%|[a-z]+)?`;
var KEYWORD = "[_a-z-][_a-z0-9-]*";
var COLOR = [
  "(?:",
  HEX,
  "|",
  "(?:rgb|hsl)",
  RGB,
  "|",
  "(?:rgba|hsla)",
  RGBA,
  "|",
  KEYWORD,
  ")"
];
var REGEXP_ARRAY = [
  String.raw`\s*(`,
  ...COLOR,
  ")",
  String.raw`(?:\s+`,
  "(",
  VALUE,
  "))?",
  "(?:",
  COMMA,
  String.raw`\s*)?`
];

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-utils-di.mjs
function tuiCreateOptions(defaults) {
  const token = new InjectionToken(ngDevMode ? "token" : "", {
    factory: () => defaults
  });
  return [token, (options) => tuiProvideOptions(token, options, defaults)];
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-tokens.mjs
var TUI_REMOVED_ELEMENT = new InjectionToken(ngDevMode ? "TUI_REMOVED_ELEMENT" : "", {
  factory: () => {
    const stub = { onRemovalComplete: () => {
    } };
    const element$ = new Subject();
    const engine = inject(AnimationEngine, { optional: true }) || stub;
    const { onRemovalComplete = stub.onRemovalComplete } = engine;
    engine.onRemovalComplete = (element, context) => {
      element$.next(element);
      onRemovalComplete.call(engine, element, context);
    };
    return element$.pipe(startWith(null), switchMap((element) => timer(0).pipe(map(() => null), startWith(element))), share());
  }
});
function isValidFocusout(target, removedElement = null) {
  return (
    // Not due to switching tabs/going to DevTools
    tuiGetDocumentOrShadowRoot(target).activeElement !== target && // Not due to button/input becoming disabled or under disabled fieldset
    !target.matches(":disabled") && // Not due to element being removed from DOM
    !removedElement?.contains(target) && // Not due to scrollable element became non-scrollable
    tuiIsMouseFocusable(target)
  );
}
function shadowRootActiveElement(root) {
  return merge(tuiTypedFromEvent(root, "focusin").pipe(map(({ target }) => target)), tuiTypedFromEvent(root, "focusout").pipe(filter(({ target, relatedTarget }) => !!relatedTarget && isValidFocusout(target)), map(({ relatedTarget }) => relatedTarget)));
}
var TUI_ACTIVE_ELEMENT = new InjectionToken(ngDevMode ? "TUI_ACTIVE_ELEMENT" : "", {
  factory: () => {
    const removedElement$ = inject(TUI_REMOVED_ELEMENT);
    const win = inject(WA_WINDOW);
    const doc = inject(DOCUMENT);
    const zone = inject(NgZone);
    const focusout$ = tuiTypedFromEvent(win, "focusout", { capture: true });
    const focusin$ = tuiTypedFromEvent(win, "focusin", { capture: true });
    const blur$ = tuiTypedFromEvent(win, "blur");
    const mousedown$ = tuiTypedFromEvent(win, "mousedown");
    const mouseup$ = tuiTypedFromEvent(win, "mouseup");
    return merge(focusout$.pipe(takeUntil(mousedown$), repeat({ delay: () => mouseup$ }), withLatestFrom(removedElement$), filter(([event, removedElement]) => isValidFocusout(tuiGetActualTarget(event), removedElement)), map(([{ relatedTarget }]) => relatedTarget)), blur$.pipe(map(() => doc.activeElement), filter((element) => !!element?.matches("iframe"))), focusin$.pipe(switchMap((event) => {
      const target = tuiGetActualTarget(event);
      const root = tuiGetDocumentOrShadowRoot(target) || doc;
      return root === doc ? of(target) : shadowRootActiveElement(root).pipe(startWith(target));
    })), mousedown$.pipe(switchMap((event) => {
      const actualTargetInCurrentTime = tuiGetActualTarget(event);
      return !doc.activeElement || doc.activeElement === doc.body ? of(actualTargetInCurrentTime) : focusout$.pipe(take(1), map(
        /**
         * Do not use `map(() => tuiGetActualTarget(event))`
         * because we have different result in runtime
         */
        () => actualTargetInCurrentTime
      ), takeUntil(timer(0, tuiZonefreeScheduler(zone))));
    }))).pipe(distinctUntilChanged(), share());
  }
});
var TUI_BASE_HREF = new InjectionToken(ngDevMode ? "TUI_BASE_HREF" : "", {
  factory: () => inject(DOCUMENT).querySelector("base")?.href ?? ""
});
var TUI_MOBILE_REGEXP = /(?:android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|^(?:1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ \-/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ /])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-)/i;
var TUI_IS_MOBILE = new InjectionToken(ngDevMode ? "TUI_IS_MOBILE" : "", {
  factory: () => TUI_MOBILE_REGEXP.test(inject(WA_USER_AGENT))
});
var TUI_IS_IOS = new InjectionToken(ngDevMode ? "TUI_IS_IOS" : "", {
  factory: () => isIos(inject(WA_NAVIGATOR))
});
var TUI_IS_ANDROID = new InjectionToken(ngDevMode ? "TUI_IS_ANDROID" : "", {
  factory: () => inject(TUI_IS_MOBILE) && !inject(TUI_IS_IOS)
});
var TUI_IS_WEBKIT = new InjectionToken(ngDevMode ? "TUI_IS_WEBKIT" : "", {
  factory: () => !!inject(WA_WINDOW)?.webkitConvertPointFromNodeToPage
});
var TUI_PLATFORM = new InjectionToken(ngDevMode ? "TUI_PLATFORM" : "", {
  factory: () => {
    if (inject(TUI_IS_IOS)) {
      return "ios";
    }
    return inject(TUI_IS_ANDROID) ? "android" : "web";
  }
});
var TUI_IS_TOUCH = new InjectionToken(ngDevMode ? "TUI_IS_TOUCH" : "", {
  factory: () => {
    const media = inject(WA_WINDOW).matchMedia("(pointer: coarse)");
    return toSignal(fromEvent(media, "change").pipe(map(() => media.matches)), {
      initialValue: media.matches
    });
  }
});
var TUI_IS_CYPRESS = new InjectionToken(ngDevMode ? "TUI_IS_CYPRESS" : "", {
  factory: () => !!inject(WA_WINDOW).Cypress
});
var TUI_IS_PLAYWRIGHT = new InjectionToken(ngDevMode ? "TUI_IS_PLAYWRIGHT" : "", {
  factory: TUI_FALSE_HANDLER
});
var TUI_IS_E2E = new InjectionToken(ngDevMode ? "TUI_IS_E2E" : "", {
  factory: () => inject(TUI_IS_CYPRESS) || inject(TUI_IS_PLAYWRIGHT) || inject(WA_NAVIGATOR).webdriver
});
var TUI_FALLBACK_VALUE = new InjectionToken(ngDevMode ? "TUI_FALLBACK_VALUE" : "", {
  factory: () => null
});
function tuiFallbackValueProvider(useValue) {
  return {
    provide: TUI_FALLBACK_VALUE,
    useValue
  };
}
var TUI_RANGE = new InjectionToken(ngDevMode ? "TUI_RANGE" : "", {
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)) ? new Range() : {}
});
var TUI_WINDOW_SIZE = new InjectionToken(ngDevMode ? "TUI_WINDOW_SIZE" : "", {
  factory: () => {
    const w = inject(WA_WINDOW);
    return tuiTypedFromEvent(w, "resize").pipe(startWith(null), map(() => {
      const width = Math.max(w.document.documentElement.clientWidth || 0, w.innerWidth || 0, w.visualViewport?.width || 0);
      const height = Math.max(w.document.documentElement.clientHeight || 0, w.innerHeight || 0, w.visualViewport?.height || 0);
      const rect2 = {
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0
      };
      return __spreadProps(__spreadValues({}, rect2), {
        toJSON: () => JSON.stringify(rect2)
      });
    }), shareReplay({ bufferSize: 1, refCount: true }));
  }
});

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-active-zone.mjs
var TuiActiveZone = class _TuiActiveZone {
  constructor() {
    this.control = inject(NgControl, {
      self: true,
      optional: true
    });
    this.active$ = inject(TUI_ACTIVE_ELEMENT);
    this.zone = inject(NgZone);
    this.el = tuiInjectElement();
    this.tuiActiveZoneParent = null;
    this.directParentActiveZone = inject(_TuiActiveZone, {
      skipSelf: true,
      optional: true
    });
    this.tuiActiveZoneChange = this.active$.pipe(map((element) => !!element && this.contains(element)), startWith(false), distinctUntilChanged(), skip(1), tap((active) => {
      if (!active && typeof this.control?.valueAccessor.onTouched === "function") {
        this.control.valueAccessor.onTouched();
      }
    }), tuiZoneOptimized(this.zone), share());
    this.children = [];
    this.directParentActiveZone?.addSubActiveZone(this);
  }
  set tuiActiveZoneParentSetter(zone) {
    this.setZone(zone);
  }
  ngOnDestroy() {
    this.directParentActiveZone?.removeSubActiveZone(this);
    this.tuiActiveZoneParent?.removeSubActiveZone(this);
  }
  contains(node) {
    return this.el.contains(node) || this.children.some((item) => item.contains(node));
  }
  setZone(zone) {
    this.tuiActiveZoneParent?.removeSubActiveZone(this);
    zone?.addSubActiveZone(this);
    this.tuiActiveZoneParent = zone;
  }
  addSubActiveZone(activeZone) {
    this.children = [...this.children, activeZone];
  }
  removeSubActiveZone(activeZone) {
    this.children = tuiArrayRemove(this.children, this.children.indexOf(activeZone));
  }
  static {
    this.ɵfac = function TuiActiveZone_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiActiveZone)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiActiveZone,
      selectors: [["", "tuiActiveZone", "", 5, "ng-container"], ["", "tuiActiveZoneChange", "", 5, "ng-container"], ["", "tuiActiveZoneParent", "", 5, "ng-container"]],
      hostBindings: function TuiActiveZone_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("mousedown.zoneless", function TuiActiveZone_mousedown_zoneless_HostBindingHandler() {
            return 0;
          }, ɵɵresolveDocument);
        }
      },
      inputs: {
        tuiActiveZoneParentSetter: [0, "tuiActiveZoneParent", "tuiActiveZoneParentSetter"]
      },
      outputs: {
        tuiActiveZoneChange: "tuiActiveZoneChange"
      },
      exportAs: ["tuiActiveZone"]
    });
  }
};
__decorate([tuiPure], TuiActiveZone.prototype, "setZone", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiActiveZone, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiActiveZone]:not(ng-container), [tuiActiveZoneChange]:not(ng-container), [tuiActiveZoneParent]:not(ng-container)",
      exportAs: "tuiActiveZone",
      host: {
        "(document:mousedown.zoneless)": "(0)"
      }
    }]
  }], function() {
    return [];
  }, {
    tuiActiveZoneChange: [{
      type: Output
    }],
    tuiActiveZoneParentSetter: [{
      type: Input,
      args: ["tuiActiveZoneParent"]
    }],
    setZone: []
  });
})();

// node_modules/@ng-web-apis/mutation-observer/fesm2022/ng-web-apis-mutation-observer.mjs
var SafeObserver = typeof MutationObserver !== "undefined" ? MutationObserver : class {
  observe() {
  }
  disconnect() {
  }
  takeRecords() {
    return [];
  }
};
var WA_MUTATION_OBSERVER_INIT = new InjectionToken("[WA_MUTATION_OBSERVER_INIT]");
var MUTATION_OBSERVER_INIT = WA_MUTATION_OBSERVER_INIT;
function provideMutationObserverInit(useValue) {
  return {
    provide: WA_MUTATION_OBSERVER_INIT,
    useValue
  };
}
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
  config = inject(MUTATION_OBSERVER_INIT);
  attributeFilter = "";
  attributeOldValue = "";
  attributes = "";
  characterData = "";
  characterDataOldValue = "";
  childList = "";
  subtree = "";
  waMutationObserver = new EventEmitter();
  constructor() {
    super((records) => {
      this.waMutationObserver.emit(records);
    });
    this.observe(this.nativeElement, this.config);
  }
  ngOnDestroy() {
    this.disconnect();
  }
  static ɵfac = function WaMutationObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaMutationObserver)();
  };
  static ɵdir = ɵɵdefineDirective({
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
    features: [ɵɵProvidersFeature([{
      provide: MUTATION_OBSERVER_INIT,
      useFactory: mutationObserverInitFactory
    }]), ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaMutationObserver, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[waMutationObserver]",
      providers: [{
        provide: MUTATION_OBSERVER_INIT,
        useFactory: mutationObserverInitFactory
      }],
      exportAs: "MutationObserver"
    }]
  }], function() {
    return [];
  }, {
    attributeFilter: [{
      type: Input
    }],
    attributeOldValue: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    characterData: [{
      type: Input
    }],
    characterDataOldValue: [{
      type: Input
    }],
    childList: [{
      type: Input
    }],
    subtree: [{
      type: Input
    }],
    waMutationObserver: [{
      type: Output
    }]
  });
})();
var WaMutationObserverService = class _WaMutationObserverService extends Observable {
  constructor() {
    const nativeElement = inject(ElementRef).nativeElement;
    const config = inject(MUTATION_OBSERVER_INIT);
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
  static ɵfac = function WaMutationObserverService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WaMutationObserverService)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _WaMutationObserverService,
    factory: _WaMutationObserverService.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WaMutationObserverService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-animated.mjs
var TUI_ENTER = "tui-enter";
var TUI_LEAVE = "tui-leave";
var TuiAnimated = class _TuiAnimated {
  constructor() {
    this.renderer = inject(ViewContainerRef)._hostLView?.[11];
    this.el = tuiInjectElement();
    afterNextRender(() => this.remove());
    if (!this.renderer || isPlatformServer(inject(PLATFORM_ID))) {
      return;
    }
    const renderer = this.renderer.delegate || this.renderer;
    if (renderer.data[TUI_LEAVE]) {
      renderer.data[TUI_LEAVE].push(this.el);
    } else {
      renderer.data[TUI_LEAVE] = [this.el];
      renderer.removeChild = wrap(renderer);
    }
  }
  ngOnDestroy() {
    const data = this.renderer?.data || {
      [TUI_LEAVE]: []
    };
    setTimeout(() => {
      data[TUI_LEAVE] = data[TUI_LEAVE]?.filter((e) => e !== this.el);
    });
  }
  remove() {
    if (this.el.isConnected && !this.el.getAnimations?.().length) {
      this.el.classList.remove(TUI_ENTER);
    }
  }
  static {
    this.ɵfac = function TuiAnimated_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAnimated)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiAnimated,
      selectors: [["", "tuiAnimated", ""]],
      hostAttrs: [1, "tui-enter"],
      hostBindings: function TuiAnimated_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("animationend.self", function TuiAnimated_animationend_self_HostBindingHandler() {
            return ctx.remove();
          })("animationcancel.self", function TuiAnimated_animationcancel_self_HostBindingHandler() {
            return ctx.remove();
          });
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAnimated, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiAnimated]",
      host: {
        class: TUI_ENTER,
        "(animationend.self)": "remove()",
        "(animationcancel.self)": "remove()"
      }
    }]
  }], function() {
    return [];
  }, null);
})();
function wrap(renderer) {
  const {
    removeChild
  } = renderer;
  return (parent, el, host) => {
    const remove = () => removeChild.call(renderer, parent, el, host);
    const elements = renderer.data[TUI_LEAVE];
    const element = elements.find((leave) => el.contains(leave));
    if (!element) {
      remove();
      return;
    }
    element.classList.remove(TUI_ENTER);
    const {
      length
    } = element.getAnimations?.() || [];
    element.classList.add(TUI_LEAVE);
    const animations = element.getAnimations?.() ?? [];
    const last = animations[animations.length - 1];
    const finish = () => {
      if (!parent || parent.contains(el)) {
        remove();
      }
    };
    if (animations.length > length && last) {
      last.onfinish = finish;
      last.oncancel = finish;
    } else {
      remove();
    }
  };
}
var TuiAnimatedParent = class _TuiAnimatedParent {
  constructor() {
    this.el = tuiInjectElement();
    this.renderer = inject(Renderer2);
  }
  handle() {
    this.el.classList.remove(TUI_ENTER);
    this.renderer.data[TUI_LEAVE] = Array.from(this.el.children);
  }
  static {
    this.ɵfac = function TuiAnimatedParent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiAnimatedParent)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiAnimatedParent,
      selectors: [["", "tuiAnimatedParent", ""]],
      hostBindings: function TuiAnimatedParent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("waMutationObserver", function TuiAnimatedParent_waMutationObserver_HostBindingHandler() {
            return ctx.handle();
          });
        }
      },
      features: [ɵɵProvidersFeature([provideMutationObserverInit({
        childList: true
      })]), ɵɵHostDirectivesFeature([TuiAnimated, {
        directive: WaMutationObserver,
        outputs: ["waMutationObserver", "waMutationObserver"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiAnimatedParent, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiAnimatedParent]",
      providers: [provideMutationObserverInit({
        childList: true
      })],
      hostDirectives: [TuiAnimated, {
        directive: WaMutationObserver,
        outputs: ["waMutationObserver"]
      }],
      host: {
        "(waMutationObserver)": "handle()"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-classes.mjs
var TuiAccessor = class {
};
var TuiPositionAccessor = class extends TuiAccessor {
};
var TuiRectAccessor = class extends TuiAccessor {
};
function tuiProvideAccessor(provide, type, fallback) {
  return {
    provide,
    deps: [[new SkipSelf(), new Optional(), provide], fallback],
    useFactory: tuiFallbackAccessor(type)
  };
}
function tuiFallbackAccessor(type) {
  return (accessors, fallback) => accessors?.find?.((accessor) => accessor !== fallback && accessor.type === type) || fallback;
}
function tuiPositionAccessorFor(type, fallback) {
  return tuiProvideAccessor(TuiPositionAccessor, type, fallback);
}
function tuiRectAccessorFor(type, fallback) {
  return tuiProvideAccessor(TuiRectAccessor, type, fallback);
}
function tuiAsPositionAccessor(accessor) {
  return tuiProvide(TuiPositionAccessor, accessor, true);
}
function tuiAsRectAccessor(accessor) {
  return tuiProvide(TuiRectAccessor, accessor, true);
}
var TuiVehicle = class {
};
function tuiAsVehicle(vehicle) {
  return tuiProvide(TuiVehicle, vehicle, true);
}
var TuiDriver = class extends Observable {
};
function tuiAsDriver(driver) {
  return tuiProvide(TuiDriver, driver, true);
}
var TuiDriverDirective = class _TuiDriverDirective {
  constructor() {
    this.destroyRef = inject(DestroyRef);
    this.drivers = inject(TuiDriver, {
      self: true,
      optional: true
    }) || [];
    this.vehicles = inject(TuiVehicle, {
      self: true,
      optional: true
    });
  }
  ngAfterViewInit() {
    const vehicle = this.vehicles?.find(({
      type
    }) => type === this.type);
    merge(...this.drivers.filter(({
      type
    }) => type === this.type)).pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      vehicle?.toggle(value);
    });
  }
  static {
    this.ɵfac = function TuiDriverDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDriverDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDriverDirective,
      standalone: false
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDriverDirective, [{
    type: Directive
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-scrollbar.mjs
function TuiScrollControls_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function TuiScrollControls_ng_template_1_ng_container_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5);
    ɵɵlistener("mousedown.capture.prevent", function TuiScrollControls_ng_template_1_ng_container_0_div_1_Template_div_mousedown_capture_prevent_0_listener() {
      return 0;
    });
    ɵɵelement(1, "div", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const bars_r1 = ɵɵnextContext().ngIf;
    ɵɵclassProp("t-bar_has-horizontal", bars_r1[1]);
  }
}
function TuiScrollControls_ng_template_1_ng_container_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 7);
    ɵɵlistener("mousedown.capture.prevent", function TuiScrollControls_ng_template_1_ng_container_0_div_2_Template_div_mousedown_capture_prevent_0_listener() {
      return 0;
    });
    ɵɵelement(1, "div", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const bars_r1 = ɵɵnextContext().ngIf;
    ɵɵclassProp("t-bar_has-vertical", bars_r1[0]);
  }
}
function TuiScrollControls_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, TuiScrollControls_ng_template_1_ng_container_0_div_1_Template, 2, 2, "div", 3)(2, TuiScrollControls_ng_template_1_ng_container_0_div_2_Template, 2, 2, "div", 4);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const bars_r1 = ctx.ngIf;
    ɵɵadvance();
    ɵɵproperty("ngIf", bars_r1[0]);
    ɵɵadvance();
    ɵɵproperty("ngIf", bars_r1[1]);
  }
}
function TuiScrollControls_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, TuiScrollControls_ng_template_1_ng_container_0_Template, 3, 2, "ng-container", 2);
    ɵɵpipe(1, "async");
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngIf", ɵɵpipeBind1(1, 1, ctx_r1.refresh$));
  }
}
var _c0 = ["*"];
function TuiScrollbar_tui_scroll_controls_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "tui-scroll-controls", 2);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵclassProp("t-hover-mode", ctx_r0.options.mode === "hover");
  }
}
var TuiScrollbarService = class _TuiScrollbarService extends Observable {
  constructor() {
    super((subscriber) => this.scroll$.subscribe(subscriber));
    this.el = tuiInjectElement();
    this.element = inject(TUI_SCROLL_REF).nativeElement;
    this.scroll$ = merge(tuiTypedFromEvent(this.el.parentElement, "mousedown").pipe(filter(({
      target
    }) => target !== this.el), map((event) => this.getScrolled(event, 0.5, 0.5))), tuiTypedFromEvent(this.el, "mousedown").pipe(tuiZonefree(), switchMap((event) => {
      const {
        ownerDocument
      } = this.el;
      const rect2 = this.el.getBoundingClientRect();
      const vertical = getOffsetVertical(event, rect2);
      const horizontal = getOffsetHorizontal(event, rect2);
      return tuiTypedFromEvent(ownerDocument, "mousemove").pipe(map((event2) => this.getScrolled(event2, vertical, horizontal)), takeUntil(tuiTypedFromEvent(ownerDocument, "mouseup")));
    })));
  }
  getScrolled({
    clientY,
    clientX
  }, offsetY, offsetX) {
    const {
      offsetHeight,
      offsetWidth
    } = this.el;
    const {
      top,
      left,
      right,
      width,
      height
    } = this.el.parentElement.getBoundingClientRect();
    const rtl = this.el.matches('[dir="rtl"] :scope');
    const inline = rtl ? right : left;
    const multiplier = rtl ? -1 : 1;
    const maxTop = this.element.scrollHeight - height;
    const maxLeft = this.element.scrollWidth - width;
    const scrolledTop = (clientY - top - offsetHeight * offsetY) / (height - offsetHeight);
    const scrolledLeft = (clientX - inline - offsetWidth * offsetX * multiplier) / (width - offsetWidth);
    return [maxTop * scrolledTop, maxLeft * scrolledLeft];
  }
  static {
    this.ɵfac = function TuiScrollbarService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollbarService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiScrollbarService,
      factory: _TuiScrollbarService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollbarService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
function getOffsetVertical({
  clientY
}, {
  top,
  height
}) {
  return (clientY - top) / height;
}
function getOffsetHorizontal({
  clientX
}, {
  left,
  width
}) {
  return (clientX - left) / width;
}
var MIN_WIDTH = 24;
var TuiScrollbarDirective = class _TuiScrollbarDirective {
  constructor() {
    this.el = inject(TUI_SCROLL_REF).nativeElement;
    this.style = tuiInjectElement().style;
    this.scrollSub = inject(TuiScrollbarService).pipe(takeUntilDestroyed()).subscribe(([top, left]) => {
      this.el.style.scrollBehavior = "auto";
      if (this.tuiScrollbar === "horizontal") {
        this.el.scrollLeft = left;
      } else {
        this.el.scrollTop = top;
      }
      this.el.style.scrollBehavior = "";
    });
    this.styleSub = merge(inject(WA_ANIMATION_FRAME).pipe(throttleTime(100, tuiZonefreeScheduler())), tuiScrollFrom(this.el)).pipe(tuiZonefree(), takeUntilDestroyed()).subscribe(() => {
      const dimension = {
        scrollTop: this.el.scrollTop,
        scrollHeight: this.el.scrollHeight,
        clientHeight: this.el.clientHeight,
        scrollLeft: this.el.scrollLeft,
        scrollWidth: this.el.scrollWidth,
        clientWidth: this.el.clientWidth
      };
      const thumb = `${this.getThumb(dimension) * 100}%`;
      const view = `${this.getView(dimension) * 100}%`;
      if (this.tuiScrollbar === "vertical") {
        this.style.top = thumb;
        this.style.height = view;
      } else {
        this.style.left = thumb;
        this.style.insetInlineStart = thumb;
        this.style.width = view;
      }
    });
    this.tuiScrollbar = "vertical";
  }
  getScrolled(dimension) {
    return this.tuiScrollbar === "vertical" ? dimension.scrollTop / (dimension.scrollHeight - dimension.clientHeight) : dimension.scrollLeft / (dimension.scrollWidth - dimension.clientWidth);
  }
  getCompensation(dimension) {
    if (dimension.clientHeight * dimension.clientHeight / dimension.scrollHeight > MIN_WIDTH && this.tuiScrollbar === "vertical" || dimension.clientWidth * dimension.clientWidth / dimension.scrollWidth > MIN_WIDTH && this.tuiScrollbar === "horizontal") {
      return 0;
    }
    return this.tuiScrollbar === "vertical" ? MIN_WIDTH / dimension.clientHeight : MIN_WIDTH / dimension.clientWidth;
  }
  getThumb(dimension) {
    const compensation = this.getCompensation(dimension) || this.getView(dimension);
    return Math.abs(this.getScrolled(dimension) * (1 - compensation));
  }
  getView(dimension) {
    return this.tuiScrollbar === "vertical" ? Math.ceil(dimension.clientHeight / dimension.scrollHeight * 100) / 100 : Math.ceil(dimension.clientWidth / dimension.scrollWidth * 100) / 100;
  }
  static {
    this.ɵfac = function TuiScrollbarDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollbarDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiScrollbarDirective,
      selectors: [["", "tuiScrollbar", ""]],
      inputs: {
        tuiScrollbar: "tuiScrollbar"
      },
      features: [ɵɵProvidersFeature([TuiScrollbarService])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollbarDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiScrollbar]",
      providers: [TuiScrollbarService]
    }]
  }], null, {
    tuiScrollbar: [{
      type: Input
    }]
  });
})();
var TUI_DEFAULT_SCROLLBAR_OPTIONS = {
  mode: "always"
};
var [TUI_SCROLLBAR_OPTIONS, tuiScrollbarOptionsProvider] = tuiCreateOptions(TUI_DEFAULT_SCROLLBAR_OPTIONS);
var TuiScrollControls = class _TuiScrollControls {
  constructor() {
    this.scrollRef = inject(TUI_SCROLL_REF).nativeElement;
    this.nativeScrollbar = inject(TUI_SCROLLBAR_OPTIONS).mode === "native";
    this.refresh$ = inject(WA_ANIMATION_FRAME).pipe(throttleTime(300, tuiZonefreeScheduler()), map(() => this.scrollbars), startWith([false, false]), distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]), tuiZoneOptimized());
  }
  get scrollbars() {
    const {
      clientHeight,
      scrollHeight,
      clientWidth,
      scrollWidth
    } = this.scrollRef;
    return [Math.ceil(clientHeight / scrollHeight * 100) < 100, Math.ceil(clientWidth / scrollWidth * 100) < 100];
  }
  static {
    this.ɵfac = function TuiScrollControls_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollControls)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiScrollControls,
      selectors: [["tui-scroll-controls"]],
      decls: 3,
      vars: 2,
      consts: [["custom", ""], [4, "ngIf", "ngIfElse"], [4, "ngIf"], ["tuiAnimated", "", "class", "t-bar t-bar_vertical", 3, "t-bar_has-horizontal", "mousedown.capture.prevent", 4, "ngIf"], ["tuiAnimated", "", "class", "t-bar t-bar_horizontal", 3, "t-bar_has-vertical", "mousedown.capture.prevent", 4, "ngIf"], ["tuiAnimated", "", 1, "t-bar", "t-bar_vertical", 3, "mousedown.capture.prevent"], ["tuiScrollbar", "vertical", 1, "t-thumb"], ["tuiAnimated", "", 1, "t-bar", "t-bar_horizontal", 3, "mousedown.capture.prevent"], ["tuiScrollbar", "horizontal", 1, "t-thumb"]],
      template: function TuiScrollControls_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵtemplate(0, TuiScrollControls_ng_container_0_Template, 1, 0, "ng-container", 1)(1, TuiScrollControls_ng_template_1_Template, 2, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor);
        }
        if (rf & 2) {
          const custom_r3 = ɵɵreference(2);
          ɵɵproperty("ngIf", ctx.nativeScrollbar)("ngIfElse", custom_r3);
        }
      },
      dependencies: [AsyncPipe, NgIf, TuiAnimated, TuiScrollbarDirective],
      styles: ["[_nghost-%COMP%]{position:sticky;top:0;left:0;z-index:1;inset-inline-start:0;min-inline-size:calc(100% - 1px);min-block-size:calc(100% - 1px);max-inline-size:calc(100% - 1px);max-block-size:calc(100% - 1px);margin-inline-end:calc(-100% + 1px);pointer-events:none;overflow:hidden;color:var(--tui-text-primary)}.t-bar[_ngcontent-%COMP%]{position:absolute;right:0;bottom:0;pointer-events:auto}.t-bar.tui-enter[_ngcontent-%COMP%], .t-bar.tui-leave[_ngcontent-%COMP%]{animation-name:tuiFade}.t-bar_vertical[_ngcontent-%COMP%]{top:0;inline-size:.875rem}@supports (inset-inline-end: 0){.t-bar_vertical[_ngcontent-%COMP%]{right:unset;inset-inline-end:0}}.t-bar_horizontal[_ngcontent-%COMP%]{left:0;inset-inline-start:0;block-size:.875rem}.t-bar_has-horizontal[_ngcontent-%COMP%]{bottom:.5rem}.t-bar_has-vertical[_ngcontent-%COMP%]{right:.5rem}.t-thumb[_ngcontent-%COMP%]{transition-property:all;transition-duration:.15s;transition-timing-function:ease-in-out;position:absolute;border-radius:6.25rem;border:.25rem solid transparent;cursor:pointer;pointer-events:auto;-webkit-user-select:none;user-select:none;background:currentColor;background-clip:content-box;box-sizing:border-box;transition-property:width,height,opacity;opacity:.2}.t-thumb[_ngcontent-%COMP%]:hover{opacity:.24}.t-thumb[_ngcontent-%COMP%]:active{opacity:.48}.t-bar_vertical[_ngcontent-%COMP%]   .t-thumb[_ngcontent-%COMP%]{right:0;inset-inline-end:0;inline-size:.75rem;min-block-size:1.25rem}.t-bar_vertical[_ngcontent-%COMP%]:hover   .t-thumb[_ngcontent-%COMP%], .t-bar_vertical[_ngcontent-%COMP%]   .t-thumb[_ngcontent-%COMP%]:active{inline-size:.875rem}.t-bar_horizontal[_ngcontent-%COMP%]   .t-thumb[_ngcontent-%COMP%]{bottom:0;block-size:.75rem;min-inline-size:1.25rem}.t-bar_horizontal[_ngcontent-%COMP%]:hover   .t-thumb[_ngcontent-%COMP%], .t-bar_horizontal[_ngcontent-%COMP%]   .t-thumb[_ngcontent-%COMP%]:active{block-size:.875rem}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollControls, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-scroll-controls",
      imports: [AsyncPipe, NgIf, TuiAnimated, TuiScrollbarDirective],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '<ng-container *ngIf="nativeScrollbar; else custom" />\n<ng-template #custom>\n    <ng-container *ngIf="refresh$ | async as bars">\n        <div\n            *ngIf="bars[0]"\n            tuiAnimated\n            class="t-bar t-bar_vertical"\n            [class.t-bar_has-horizontal]="bars[1]"\n            (mousedown.capture.prevent)="(0)"\n        >\n            <div\n                tuiScrollbar="vertical"\n                class="t-thumb"\n            ></div>\n        </div>\n        <div\n            *ngIf="bars[1]"\n            tuiAnimated\n            class="t-bar t-bar_horizontal"\n            [class.t-bar_has-vertical]="bars[0]"\n            (mousedown.capture.prevent)="(0)"\n        >\n            <div\n                tuiScrollbar="horizontal"\n                class="t-thumb"\n            ></div>\n        </div>\n    </ng-container>\n</ng-template>\n',
      styles: [":host{position:sticky;top:0;left:0;z-index:1;inset-inline-start:0;min-inline-size:calc(100% - 1px);min-block-size:calc(100% - 1px);max-inline-size:calc(100% - 1px);max-block-size:calc(100% - 1px);margin-inline-end:calc(-100% + 1px);pointer-events:none;overflow:hidden;color:var(--tui-text-primary)}.t-bar{position:absolute;right:0;bottom:0;pointer-events:auto}.t-bar.tui-enter,.t-bar.tui-leave{animation-name:tuiFade}.t-bar_vertical{top:0;inline-size:.875rem}@supports (inset-inline-end: 0){.t-bar_vertical{right:unset;inset-inline-end:0}}.t-bar_horizontal{left:0;inset-inline-start:0;block-size:.875rem}.t-bar_has-horizontal{bottom:.5rem}.t-bar_has-vertical{right:.5rem}.t-thumb{transition-property:all;transition-duration:.15s;transition-timing-function:ease-in-out;position:absolute;border-radius:6.25rem;border:.25rem solid transparent;cursor:pointer;pointer-events:auto;-webkit-user-select:none;user-select:none;background:currentColor;background-clip:content-box;box-sizing:border-box;transition-property:width,height,opacity;opacity:.2}.t-thumb:hover{opacity:.24}.t-thumb:active{opacity:.48}.t-bar_vertical .t-thumb{right:0;inset-inline-end:0;inline-size:.75rem;min-block-size:1.25rem}.t-bar_vertical:hover .t-thumb,.t-bar_vertical .t-thumb:active{inline-size:.875rem}.t-bar_horizontal .t-thumb{bottom:0;block-size:.75rem;min-inline-size:1.25rem}.t-bar_horizontal:hover .t-thumb,.t-bar_horizontal .t-thumb:active{block-size:.875rem}\n"]
    }]
  }], null, null);
})();
var TUI_SCROLL_INTO_VIEW = "tui-scroll-into-view";
var TUI_SCROLLABLE = "tui-scrollable";
var TuiScrollbar = class _TuiScrollbar {
  constructor() {
    this.el = tuiInjectElement();
    this.options = inject(TUI_SCROLLBAR_OPTIONS);
    this.isIOS = inject(TUI_IS_IOS);
    this.browserScrollRef = new ElementRef(this.el);
    this.hidden = this.options.mode === "hidden";
  }
  get delegated() {
    return this.scrollRef !== this.el || this.options.mode === "native";
  }
  get scrollRef() {
    return this.browserScrollRef.nativeElement;
  }
  set scrollRef(element) {
    this.browserScrollRef.nativeElement = element;
  }
  scrollIntoView(detail) {
    if (this.delegated) {
      return;
    }
    const {
      offsetHeight,
      offsetWidth
    } = detail;
    const {
      offsetTop,
      offsetLeft
    } = tuiGetElementOffset(this.scrollRef, detail);
    const scrollTop = offsetTop + offsetHeight / 2 - this.scrollRef.clientHeight / 2;
    const scrollLeft = offsetLeft + offsetWidth / 2 - this.scrollRef.clientWidth / 2;
    this.scrollRef.scrollTo?.(scrollLeft, scrollTop);
  }
  static {
    this.ɵfac = function TuiScrollbar_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollbar)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiScrollbar,
      selectors: [["tui-scrollbar"]],
      hostVars: 2,
      hostBindings: function TuiScrollbar_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("tui-scrollable.stop", function TuiScrollbar_tui_scrollable_stop_HostBindingHandler($event) {
            return ctx.scrollRef = $event.detail;
          })("tui-scroll-into-view.stop", function TuiScrollbar_tui_scroll_into_view_stop_HostBindingHandler($event) {
            return ctx.scrollIntoView($event.detail);
          });
        }
        if (rf & 2) {
          ɵɵclassProp("_native-hidden", ctx.options.mode !== "native" && (!ctx.isIOS || ctx.hidden));
        }
      },
      inputs: {
        hidden: "hidden"
      },
      features: [ɵɵProvidersFeature([{
        provide: TUI_SCROLL_REF,
        useFactory: () => inject(_TuiScrollbar).browserScrollRef
      }])],
      ngContentSelectors: _c0,
      decls: 3,
      vars: 3,
      consts: [["class", "t-bars", 3, "t-hover-mode", 4, "ngIf"], [1, "t-content"], [1, "t-bars"]],
      template: function TuiScrollbar_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵtemplate(0, TuiScrollbar_tui_scroll_controls_0_Template, 1, 2, "tui-scroll-controls", 0);
          ɵɵelementStart(1, "div", 1);
          ɵɵprojection(2);
          ɵɵelementEnd();
        }
        if (rf & 2) {
          ɵɵproperty("ngIf", !ctx.hidden && !ctx.isIOS && ctx.options.mode !== "native");
          ɵɵadvance();
          ɵɵclassProp("t-content_delegated", ctx.delegated);
        }
      },
      dependencies: [NgIf, TuiScrollControls],
      styles: ["[_nghost-%COMP%]{position:relative;display:flex;max-block-size:100%;isolation:isolate;overflow:auto}._native-hidden[_nghost-%COMP%]{scrollbar-width:none;-ms-overflow-style:none}._native-hidden[_nghost-%COMP%]::-webkit-scrollbar, ._native-hidden[_nghost-%COMP%]::-webkit-scrollbar-thumb{display:none}[_nghost-%COMP%]   .t-hover-mode[_ngcontent-%COMP%]:not(:active){transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;opacity:0}[_nghost-%COMP%]:hover > .t-hover-mode[_ngcontent-%COMP%]{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;opacity:1}.t-content[_ngcontent-%COMP%]{isolation:isolate;flex:1;flex-basis:auto;inline-size:100%;block-size:-webkit-max-content;block-size:max-content}.t-content_delegated[_ngcontent-%COMP%]{block-size:100%}.t-bars[_ngcontent-%COMP%]{color:var(--tui-text-primary)}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollbar, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-scrollbar",
      imports: [NgIf, TuiScrollControls],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: TUI_SCROLL_REF,
        useFactory: () => inject(TuiScrollbar).browserScrollRef
      }],
      host: {
        "[class._native-hidden]": 'options.mode !== "native" && (!isIOS || hidden)',
        [`(${TUI_SCROLLABLE}.stop)`]: "scrollRef = $event.detail",
        [`(${TUI_SCROLL_INTO_VIEW}.stop)`]: "scrollIntoView($event.detail)"
      },
      template: `<tui-scroll-controls
    *ngIf="!hidden && !isIOS && options.mode !== 'native'"
    class="t-bars"
    [class.t-hover-mode]="options.mode === 'hover'"
/>
<div
    class="t-content"
    [class.t-content_delegated]="delegated"
>
    <ng-content />
</div>
`,
      styles: [":host{position:relative;display:flex;max-block-size:100%;isolation:isolate;overflow:auto}:host._native-hidden{scrollbar-width:none;-ms-overflow-style:none}:host._native-hidden::-webkit-scrollbar,:host._native-hidden::-webkit-scrollbar-thumb{display:none}:host .t-hover-mode:not(:active){transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;opacity:0}:host:hover>.t-hover-mode{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;opacity:1}.t-content{isolation:isolate;flex:1;flex-basis:auto;inline-size:100%;block-size:-webkit-max-content;block-size:max-content}.t-content_delegated{block-size:100%}.t-bars{color:var(--tui-text-primary)}\n"]
    }]
  }], null, {
    hidden: [{
      type: Input
    }]
  });
})();
var TuiScrollIntoView = class _TuiScrollIntoView {
  constructor() {
    this.el = tuiInjectElement();
    this.destroyRef = inject(DestroyRef);
  }
  set tuiScrollIntoView(scroll) {
    if (!scroll) {
      return;
    }
    timer(0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.el.dispatchEvent(new CustomEvent(TUI_SCROLL_INTO_VIEW, {
        bubbles: true,
        detail: this.el
      }));
    });
  }
  static {
    this.ɵfac = function TuiScrollIntoView_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollIntoView)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiScrollIntoView,
      selectors: [["", "tuiScrollIntoView", ""]],
      inputs: {
        tuiScrollIntoView: "tuiScrollIntoView"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollIntoView, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiScrollIntoView]"
    }]
  }], null, {
    tuiScrollIntoView: [{
      type: Input
    }]
  });
})();
var SCROLL_REF_SELECTOR = "[tuiScrollRef]";
var TuiScrollRef = class _TuiScrollRef {
  static {
    this.ɵfac = function TuiScrollRef_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollRef)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiScrollRef,
      selectors: [["", "tuiScrollRef", ""]],
      features: [ɵɵProvidersFeature([tuiProvide(TUI_SCROLL_REF, ElementRef)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollRef, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiScrollRef]",
      providers: [tuiProvide(TUI_SCROLL_REF, ElementRef)]
    }]
  }], null, null);
})();
var TuiScrollable = class _TuiScrollable {
  constructor() {
    this.el = tuiInjectElement();
  }
  ngOnInit() {
    this.el.dispatchEvent(new CustomEvent(TUI_SCROLLABLE, {
      bubbles: true,
      detail: this.el
    }));
  }
  static {
    this.ɵfac = function TuiScrollable_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollable)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiScrollable,
      selectors: [["", "tuiScrollable", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollable, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiScrollable]"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-services.mjs
var TuiBreakpointService = class _TuiBreakpointService extends Observable {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.media = inject(TUI_MEDIA);
    this.sorted = Object.values(this.media).sort((a, b) => a - b);
    this.invert = Object.keys(this.media).reduce((ret, key) => __spreadProps(__spreadValues({}, ret), {
      [this.media[key]]: key
    }), {});
    this.stream$ = inject(TUI_WINDOW_SIZE).pipe(map(({
      width
    }) => this.sorted.find((size) => size > width)), map((key) => this.invert[key || this.sorted[this.sorted.length - 1] || 0] ?? null), distinctUntilChanged(), tuiZoneOptimized(), shareReplay({
      bufferSize: 1,
      refCount: true
    }));
  }
  static {
    this.ɵfac = function TuiBreakpointService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiBreakpointService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiBreakpointService,
      factory: _TuiBreakpointService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiBreakpointService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiDarkThemeService = class _TuiDarkThemeService extends Observable {
  constructor() {
    const media = inject(WA_WINDOW).matchMedia("(prefers-color-scheme: dark)");
    const media$ = fromEvent(media, "change").pipe(startWith(null), map(() => media.matches), shareReplay({
      bufferSize: 1,
      refCount: true
    }));
    super((subscriber) => media$.subscribe(subscriber));
  }
  static {
    this.ɵfac = function TuiDarkThemeService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDarkThemeService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiDarkThemeService,
      factory: _TuiDarkThemeService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDarkThemeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiFormatDateService = class _TuiFormatDateService {
  constructor() {
    this.locale = inject(LOCALE_ID);
  }
  format(timestamp) {
    return of(new Date(timestamp).toLocaleTimeString(this.locale, {
      hour: "numeric",
      minute: "2-digit"
    }));
  }
  static {
    this.ɵfac = function TuiFormatDateService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFormatDateService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiFormatDateService,
      factory: _TuiFormatDateService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFormatDateService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var TuiPositionService = class _TuiPositionService extends Observable {
  constructor() {
    const animationFrame$ = inject(WA_ANIMATION_FRAME);
    const zone = inject(NgZone);
    super((subscriber) => animationFrame$.pipe(startWith(null), map(() => this.accessor.getPosition(this.el.getBoundingClientRect(), this.el)), tuiZonefree(zone), finalize(() => this.accessor.getPosition(EMPTY_CLIENT_RECT))).subscribe(subscriber));
    this.el = tuiInjectElement();
    this.accessor = inject(TuiPositionAccessor);
  }
  static {
    this.ɵfac = function TuiPositionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiPositionService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiPositionService,
      factory: _TuiPositionService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPositionService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var TuiVisualViewportService = class _TuiVisualViewportService {
  constructor() {
    this.isWebkit = inject(TUI_IS_WEBKIT);
    this.win = inject(WA_WINDOW);
  }
  // https://bugs.webkit.org/show_bug.cgi?id=207089
  correct(point) {
    return this.isWebkit ? [point[0] + (this.win.visualViewport?.offsetTop ?? 0), point[1] + (this.win.visualViewport?.offsetLeft ?? 0)] : point;
  }
  static {
    this.ɵfac = function TuiVisualViewportService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiVisualViewportService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiVisualViewportService,
      factory: _TuiVisualViewportService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiVisualViewportService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-utils-dom.mjs
function tuiCheckFixedPosition(element) {
  return !!element && (isFixed(element) || tuiCheckFixedPosition(element.parentElement));
}
function isFixed(element) {
  return element.ownerDocument.defaultView?.getComputedStyle(element).getPropertyValue("position") === "fixed";
}
function tuiGetViewportHeight({ document, innerHeight }) {
  return Math.max(document.documentElement.clientHeight || 0, innerHeight || 0);
}
function tuiGetViewportWidth({ document, innerWidth }) {
  return Math.max(document.documentElement.clientWidth || 0, innerWidth || 0);
}
function tuiGetWordRange(currentRange) {
  const range = currentRange.cloneRange();
  const { startContainer, startOffset, endContainer, endOffset } = range;
  const { ownerDocument } = startContainer;
  if (!ownerDocument) {
    return range;
  }
  const treeWalker = ownerDocument.createTreeWalker(ownerDocument.body, NodeFilter.SHOW_TEXT, svgNodeFilter);
  treeWalker.currentNode = startContainer;
  do {
    const container = treeWalker.currentNode;
    const textContent = container.textContent || "";
    const content = container === startContainer ? textContent.slice(0, Math.max(0, startOffset + 1)) : textContent;
    const offset = Math.max(content.lastIndexOf(" "), content.lastIndexOf("\n"), content.lastIndexOf(CHAR_NO_BREAK_SPACE), content.lastIndexOf(CHAR_ZERO_WIDTH_SPACE)) + 1;
    range.setStart(container, 0);
    if (offset) {
      range.setStart(container, offset);
      break;
    }
  } while (treeWalker.previousNode());
  treeWalker.currentNode = endContainer;
  do {
    const container = treeWalker.currentNode;
    const textContent = container.textContent || "";
    const content = container === endContainer ? textContent.slice(endOffset + 1) : textContent;
    const offset = [
      content.indexOf(" "),
      content.lastIndexOf("\n"),
      content.indexOf(CHAR_NO_BREAK_SPACE),
      content.indexOf(CHAR_ZERO_WIDTH_SPACE)
    ].reduce((result, item) => result === -1 || item === -1 ? Math.max(result, item) : Math.min(result, item), -1);
    range.setEnd(container, textContent.length);
    if (offset !== -1) {
      range.setEnd(container, offset + textContent.length - content.length);
      break;
    }
  } while (treeWalker.nextNode());
  return range;
}

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-utils-format.mjs
function tuiNumberToStringWithoutExp(value) {
  const valueAsString = String(value);
  const [numberPart, expPart] = valueAsString.split("e-");
  let valueWithoutExp = valueAsString;
  if (expPart) {
    const [, fractionalPart = ""] = numberPart?.split(".") ?? [];
    const decimalDigits = Number(expPart) + (fractionalPart?.length || 0);
    valueWithoutExp = value.toFixed(decimalDigits);
  }
  return valueWithoutExp;
}
function tuiGetFractionPartPadded(value, precision) {
  const [, fractionPartPadded = ""] = tuiNumberToStringWithoutExp(value).split(".");
  return tuiIsNumber(precision) ? fractionPartPadded.slice(0, Math.max(0, precision)) : fractionPartPadded;
}
function tuiFormatNumber(value, settings = {}) {
  const { precision, decimalSeparator, thousandSeparator, decimalMode, rounding } = __spreadValues(__spreadProps(__spreadValues({}, TUI_DEFAULT_NUMBER_FORMAT), {
    decimalMode: "always",
    precision: Infinity
  }), settings);
  const rounded = Number.isFinite(precision) ? tuiRoundWith({ value, precision, method: rounding }) : value;
  const integerPartString = String(Math.floor(Math.abs(rounded)));
  let fractionPartPadded = tuiGetFractionPartPadded(rounded, precision);
  const hasFraction = Number(fractionPartPadded) > 0;
  if (Number.isFinite(precision)) {
    if (decimalMode === "always" || hasFraction && decimalMode === "pad") {
      const zeroPaddingSize = Math.max(precision - fractionPartPadded.length, 0);
      const zeroPartString = "0".repeat(zeroPaddingSize);
      fractionPartPadded = `${fractionPartPadded}${zeroPartString}`;
    } else {
      fractionPartPadded = fractionPartPadded.replace(/0*$/, "");
    }
  }
  const remainder = integerPartString.length % 3;
  const sign = value < 0 ? CHAR_HYPHEN : "";
  let result = sign + integerPartString.charAt(0);
  for (let i = 1; i < integerPartString.length; i++) {
    if (i % 3 === remainder && integerPartString.length > 3) {
      result += thousandSeparator;
    }
    result += integerPartString.charAt(i);
  }
  return fractionPartPadded ? result + decimalSeparator + fractionPartPadded : result;
}
function tuiStringHashToHsl(value) {
  if (value === "") {
    return "";
  }
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash;
  }
  const hue = hash % 360;
  const saturation = 60 + hash % 5;
  const lightness = 80 + hash % 5;
  return `hsl(${hue},${saturation}%,${lightness}%)`;
}

// node_modules/@taiga-ui/font-watcher/index.esm.js
var IFRAME = {
  position: "fixed",
  visibility: "hidden",
  pointerEvents: "none"
};
var BODY = {
  height: "fit-content",
  lineHeight: "1em",
  fontSize: "calc(env(preferred-text-scale) * 1em)"
};
function tuiFontSizeWatcher(callback, iframe = globalThis.document.createElement("iframe")) {
  const resize = () => {
    const { innerWidth = 0, outerWidth = 0, devicePixelRatio = 0 } = iframe.ownerDocument?.defaultView || {};
    iframe.width = `${innerWidth === outerWidth ? innerWidth : innerWidth / devicePixelRatio}`;
  };
  iframe.ownerDocument?.body.append(iframe);
  iframe.ownerDocument?.defaultView?.addEventListener("resize", resize);
  const doc = iframe.contentDocument;
  const observer = new ResizeObserver(() => callback(doc?.body.offsetHeight || 0));
  Object.assign(iframe.style, IFRAME);
  Object.assign(doc?.body.style || {}, BODY);
  doc?.documentElement.style.setProperty("font", "-apple-system-body");
  doc?.body.insertAdjacentText("beforeend", ".".repeat(1e3));
  observer.observe(doc?.body || iframe);
  resize();
  return () => {
    observer.disconnect();
    iframe.ownerDocument?.defaultView?.removeEventListener("resize", resize);
    iframe.remove();
  };
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-font-size.mjs
var TUI_FONT_SIZE_HANDLER = new InjectionToken(ngDevMode ? "TUI_FONT_SIZE_HANDLER" : "");
var TuiFontSize = class _TuiFontSize {
  constructor() {
    this.handler = inject(TUI_FONT_SIZE_HANDLER, {
      optional: true
    });
    this.enabled = !inject(_TuiFontSize, {
      optional: true,
      skipSelf: true
    }) && isPlatformBrowser(inject(PLATFORM_ID)) && typeof ResizeObserver !== "undefined";
    this.nothing = inject(DestroyRef).onDestroy(this.enabled && this.handler ? tuiFontSizeWatcher(this.handler, inject(DOCUMENT).createElement("iframe")) : EMPTY_FUNCTION);
  }
  static {
    this.ɵfac = function TuiFontSize_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFontSize)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiFontSize
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFontSize, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-utils-miscellaneous.mjs
var TUI_FONT_OFFSET = new InjectionToken(ngDevMode ? "TUI_FONT_OFFSET" : "", { factory: () => signal(0) });
function tuiEnableFontScaling() {
  return {
    provide: TUI_FONT_SIZE_HANDLER,
    useFactory: () => {
      const offset = inject(TUI_FONT_OFFSET);
      const { documentElement } = inject(DOCUMENT);
      return (size) => {
        const current = tuiClamp(size, 17, 28) - 17;
        offset.set(current);
        return documentElement.style.setProperty("--tui-font-offset", tuiPx(current));
      };
    }
  };
}
var KEYS = [
  "Spacebar",
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Left",
  "Right",
  "End",
  "Home"
];
function tuiIsEditingKey(key = "") {
  return key.length === 1 || KEYS.includes(key);
}
function tuiIsObscured(el, exceptSelector = "tui-hints") {
  return !!tuiGetElementObscures(el)?.some((el2) => !el2.closest(exceptSelector));
}
function tuiOverrideOptions(override, fallback) {
  return (directive, options) => {
    const result = directive || __spreadValues({}, options || fallback);
    Object.keys(override).forEach((key) => {
      result[key] = override[key];
    });
    return result;
  };
}
var SIZES = {
  xxs: 0,
  xs: 1,
  s: 2,
  m: 3,
  l: 4,
  xl: 5,
  xxl: 6
};
function tuiSizeBigger(size, biggerThanSize = "s") {
  return SIZES[size] > SIZES[biggerThanSize];
}
var TUI_ANIMATIONS_DEFAULT_DURATION = 300;
function tuiToAnimationOptions(speed = inject(TUI_ANIMATIONS_SPEED), easing) {
  return {
    value: "",
    params: {
      duration: tuiGetDuration(speed),
      easing
    }
  };
}
function tuiGetDuration(speed) {
  return speed && TUI_ANIMATIONS_DEFAULT_DURATION / speed;
}

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-classes.mjs
var _c02 = ["viewContainer"];
var TuiValueTransformer = class {
};
function tuiValueTransformerFrom(token) {
  return {
    provide: TuiValueTransformer,
    useFactory: () => inject(token).valueTransformer
  };
}
var TuiNonNullableValueTransformer = class extends TuiValueTransformer {
  fromControlValue(value) {
    this.prevValue = value;
    return value;
  }
  toControlValue(value) {
    this.prevValue = value ?? this.prevValue;
    return this.prevValue;
  }
};
var TUI_IDENTITY_VALUE_TRANSFORMER = {
  fromControlValue: identity,
  toControlValue: identity
};
var FLAGS = {
  self: true,
  optional: true
};
var TuiControl = class _TuiControl {
  constructor() {
    this.fallback = inject(TUI_FALLBACK_VALUE, FLAGS);
    this.refresh$ = new Subject();
    this.pseudoInvalid = signal(null);
    this.internal = signal(this.fallback);
    this.control = inject(NgControl, {
      self: true
    });
    this.cdr = inject(ChangeDetectorRef);
    this.transformer = inject(TuiValueTransformer, FLAGS) ?? TUI_IDENTITY_VALUE_TRANSFORMER;
    this.value = computed(() => this.internal() ?? this.fallback);
    this.readOnly = signal(false);
    this.touched = signal(false);
    this.status = signal(void 0);
    this.disabled = computed(() => this.status() === "DISABLED");
    this.interactive = computed(() => !this.disabled() && !this.readOnly());
    this.invalid = computed(() => this.pseudoInvalid() !== null ? !!this.pseudoInvalid() && this.interactive() : this.interactive() && this.touched() && this.status() === "INVALID");
    this.mode = computed(() => (
      // eslint-disable-next-line no-nested-ternary
      this.readOnly() ? "readonly" : this.invalid() ? "invalid" : "valid"
    ));
    this.onTouched = EMPTY_FUNCTION;
    this.onChange = EMPTY_FUNCTION;
    this.control.valueAccessor = this;
    this.refresh$.pipe(delay(0), startWith(null), map(() => this.control.control), filter(Boolean), distinctUntilChanged(), switchMap((c) => merge(c.valueChanges, c.statusChanges, c.events || EMPTY).pipe(startWith(null))), takeUntilDestroyed()).subscribe(() => this.update());
  }
  set readOnlySetter(readOnly) {
    this.readOnly.set(readOnly);
  }
  set invalidSetter(invalid) {
    this.pseudoInvalid.set(invalid);
  }
  registerOnChange(onChange) {
    this.refresh$.next();
    this.onChange = (value) => {
      const internal = untracked(() => this.internal());
      if (value === internal) {
        return;
      }
      onChange(this.transformer.toControlValue(value));
      this.internal.set(value);
      this.update();
    };
  }
  registerOnTouched(onTouched) {
    this.onTouched = () => {
      onTouched();
      this.update();
    };
  }
  setDisabledState() {
    this.update();
  }
  writeValue(value) {
    const safe = this.control instanceof NgModel ? this.control.model : value;
    this.internal.set(this.transformer.fromControlValue(safe));
    this.update();
  }
  update() {
    this.status.set(this.control.control?.status);
    this.touched.set(!!this.control.control?.touched);
    this.cdr.markForCheck();
  }
  static {
    this.ɵfac = function TuiControl_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiControl)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiControl,
      inputs: {
        readOnlySetter: [0, "readOnly", "readOnlySetter"],
        invalidSetter: [0, "invalid", "invalidSetter"]
      },
      standalone: false
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiControl, [{
    type: Directive
  }], function() {
    return [];
  }, {
    readOnlySetter: [{
      type: Input,
      args: ["readOnly"]
    }],
    invalidSetter: [{
      type: Input,
      args: ["invalid"]
    }]
  });
})();
function tuiAsControl(control) {
  return tuiProvide(TuiControl, control);
}
var TuiPortals = class _TuiPortals {
  constructor() {
    this.injector = inject(INJECTOR$1);
    this.nothing = inject(TuiPortalService).attach(this);
  }
  addComponentChild(component) {
    const injector = component.createInjector(this.injector);
    const ref = this.vcr.createComponent(component.component, {
      injector
    });
    ref.changeDetectorRef.detectChanges();
    return ref;
  }
  addTemplateChild(templateRef, context) {
    return this.vcr.createEmbeddedView(templateRef, context);
  }
  static {
    this.ɵfac = function TuiPortals_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiPortals)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiPortals,
      viewQuery: function TuiPortals_Query(rf, ctx) {
        if (rf & 1) {
          ɵɵviewQuery(_c02, 5, ViewContainerRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.vcr = _t.first);
        }
      },
      standalone: false
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPortals, [{
    type: Directive
  }], null, {
    vcr: [{
      type: ViewChild,
      args: ["viewContainer", {
        read: ViewContainerRef
      }]
    }]
  });
})();
var TuiPortalService = class _TuiPortalService {
  attach(host) {
    this.host = host;
  }
  add(component) {
    return this.safeHost.addComponentChild(component);
  }
  remove({
    hostView
  }) {
    this.removeTemplate(hostView);
  }
  addTemplate(templateRef, context) {
    return this.safeHost.addTemplateChild(templateRef, context);
  }
  removeTemplate(viewRef) {
    if (!viewRef.destroyed) {
      viewRef.destroy();
    }
  }
  get safeHost() {
    if (!this.host) {
      throw new TuiNoHostException();
    }
    return this.host;
  }
  static {
    this.ɵfac = function TuiPortalService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiPortalService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiPortalService,
      factory: _TuiPortalService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPortalService, [{
    type: Injectable
  }], null, null);
})();
function tuiAsPortal(portal) {
  return tuiProvide(TuiPortalService, portal);
}
var TuiNoHostException = class extends Error {
  constructor() {
    super(ngDevMode ? "Portals cannot be used without TuiPortalHostComponent; perhaps you forgot to wrap your application with tui-root." : "");
  }
};
var TuiValidationError = class {
  constructor(message, context = {}) {
    this.message = message;
    this.context = context;
  }
};

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-services.mjs
var TuiIdService = class _TuiIdService {
  static {
    this.autoId = 0;
  }
  generate() {
    return `tui_${_TuiIdService.autoId++}${Date.now().toString(36)}`;
  }
  static {
    this.ɵfac = function TuiIdService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiIdService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiIdService,
      factory: _TuiIdService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiIdService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function tuiInjectId() {
  return inject(TuiIdService).generate();
}
var TuiPopoverService = class _TuiPopoverService {
  constructor(items, component, options = {}) {
    this.options = options;
    this.id = inject(TuiIdService);
    this.component = new PolymorpheusComponent(component, inject(INJECTOR$1));
    this.items$ = inject(items);
  }
  open(content, options = {}) {
    return new Observable((observer) => {
      const item = __spreadProps(__spreadValues(__spreadValues({}, this.options), options), {
        content,
        $implicit: observer,
        component: this.component,
        createdAt: Date.now(),
        id: this.id.generate(),
        completeWith: (result) => {
          observer.next(result);
          observer.complete();
        }
      });
      this.items$.next([...this.items$.value, item]);
      return () => {
        this.items$.next(this.items$.value.filter((value) => value !== item));
      };
    });
  }
  static {
    this.ɵfac = function TuiPopoverService_Factory(__ngFactoryType__) {
      ɵɵinvalidFactory();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiPopoverService,
      factory: _TuiPopoverService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiPopoverService, [{
    type: Injectable
  }], function() {
    return [{
      type: void 0
    }, {
      type: void 0
    }, {
      type: void 0
    }];
  }, null);
})();
function tuiAsPopover(popover) {
  return tuiProvide(TuiPopoverService, popover);
}
var SCROLL_TIME = 300;
function getX(elementOrWindow) {
  return "scrollX" in elementOrWindow ? elementOrWindow.scrollX : elementOrWindow.scrollLeft;
}
function getY(elementOrWindow) {
  return "scrollY" in elementOrWindow ? elementOrWindow.scrollY : elementOrWindow.scrollTop;
}
var TuiScrollService = class _TuiScrollService {
  constructor() {
    this.performanceRef = inject(WA_PERFORMANCE);
    this.animationFrame$ = inject(WA_ANIMATION_FRAME);
    this.zone = inject(NgZone);
  }
  scroll$(elementOrWindow, scrollTop, scrollLeft = getX(elementOrWindow), duration = SCROLL_TIME) {
    ngDevMode && console.assert(duration >= 0, "duration cannot be negative");
    ngDevMode && console.assert(scrollTop >= 0, "scrollTop cannot be negative");
    ngDevMode && console.assert(scrollLeft >= 0, "scrollLeft cannot be negative");
    const initialTop = getY(elementOrWindow);
    const initialLeft = getX(elementOrWindow);
    const deltaTop = scrollTop - initialTop;
    const deltaLeft = scrollLeft - initialLeft;
    const observable = !duration ? of([scrollTop, scrollLeft]) : defer(() => of(this.performanceRef.now())).pipe(switchMap((start) => this.animationFrame$.pipe(map((now) => now - start))), map((elapsed) => tuiEaseInOutQuad(tuiClamp(elapsed / duration, 0, 1))), map((percent) => [initialTop + deltaTop * percent, initialLeft + deltaLeft * percent]), takeUntil(timer(duration, tuiZonefreeScheduler(this.zone))), endWith([scrollTop, scrollLeft]));
    return observable.pipe(tap(([scrollTop2, scrollLeft2]) => {
      elementOrWindow.scrollTo?.(scrollLeft2, scrollTop2);
    }));
  }
  static {
    this.ɵfac = function TuiScrollService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiScrollService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiScrollService,
      factory: _TuiScrollService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiScrollService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var TUI_THEME_COLOR = new InjectionToken(ngDevMode ? "TUI_THEME_COLOR" : "", {
  factory: () => inject(Meta).getTag('name="theme-color"')?.content ?? ""
});
var TuiThemeColorService = class _TuiThemeColorService {
  constructor() {
    this.current = inject(TUI_THEME_COLOR);
    this.doc = inject(DOCUMENT);
    this.meta = inject(Meta);
    this.color = this.current;
  }
  get color() {
    return this.current;
  }
  set color(content) {
    this.current = content;
    this.meta.updateTag({
      name: "theme-color",
      content
    });
    this.doc.documentElement.style.setProperty("--tui-theme-color", content);
  }
  static {
    this.ɵfac = function TuiThemeColorService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiThemeColorService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiThemeColorService,
      factory: _TuiThemeColorService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiThemeColorService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], function() {
    return [];
  }, null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-obscured.mjs
var TuiObscuredService = class _TuiObscuredService extends Observable {
  constructor() {
    super((subscriber) => this.obscured$.subscribe(subscriber));
    this.el = tuiInjectElement();
    this.obscured$ = inject(WA_ANIMATION_FRAME).pipe(throttleTime(100, tuiZonefreeScheduler()), map(() => tuiGetElementObscures(this.el)), startWith(null), distinctUntilChanged(), tuiZoneOptimized());
  }
  static {
    this.ɵfac = function TuiObscuredService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiObscuredService)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiObscuredService,
      factory: _TuiObscuredService.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiObscuredService, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var TuiObscured = class _TuiObscured {
  constructor() {
    this.activeZone = inject(TuiActiveZone, {
      optional: true
    });
    this.enabled$ = new BehaviorSubject(false);
    this.obscured$ = inject(TuiObscuredService, {
      self: true
    }).pipe(
      // TODO: Refactor so that dropdowns and dialogs work properly without hacks
      map((by) => !!by?.every((el) => el.closest("tui-dialogs") || !this.activeZone?.contains(el)))
    );
    this.tuiObscured = this.enabled$.pipe(tuiIfMap(() => this.obscured$));
  }
  set tuiObscuredEnabled(enabled) {
    this.enabled$.next(enabled);
  }
  static {
    this.ɵfac = function TuiObscured_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiObscured)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiObscured,
      selectors: [["", "tuiObscured", ""]],
      inputs: {
        tuiObscuredEnabled: "tuiObscuredEnabled"
      },
      outputs: {
        tuiObscured: "tuiObscured"
      },
      features: [ɵɵProvidersFeature([TuiObscuredService])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiObscured, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiObscured]",
      providers: [TuiObscuredService]
    }]
  }], null, {
    tuiObscured: [{
      type: Output
    }],
    tuiObscuredEnabled: [{
      type: Input
    }]
  });
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-dropdown.mjs
var _c03 = (a0) => ({
  $implicit: a0
});
function TuiDropdownComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", text_r1, " ");
  }
}
var _c1 = ["tuiDropdownHost"];
var TuiDropdownDriver = class _TuiDropdownDriver extends BehaviorSubject {
  constructor() {
    super(false);
    this.type = "dropdown";
  }
  static {
    this.ɵfac = function TuiDropdownDriver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownDriver)();
    };
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiDropdownDriver,
      factory: _TuiDropdownDriver.ɵfac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownDriver, [{
    type: Injectable
  }], function() {
    return [];
  }, null);
})();
var TuiDropdownDriverDirective = class _TuiDropdownDriverDirective extends TuiDriverDirective {
  constructor() {
    super(...arguments);
    this.type = "dropdown";
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdownDriverDirective_BaseFactory;
      return function TuiDropdownDriverDirective_Factory(__ngFactoryType__) {
        return (ɵTuiDropdownDriverDirective_BaseFactory || (ɵTuiDropdownDriverDirective_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdownDriverDirective)))(__ngFactoryType__ || _TuiDropdownDriverDirective);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownDriverDirective,
      features: [ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownDriverDirective, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, null);
})();
var TUI_DROPDOWN_COMPONENT = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_COMPONENT" : "", {
  factory: () => TuiDropdownComponent
});
var TUI_DROPDOWN_CONTEXT = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_CONTEXT" : "");
var TUI_DROPDOWN_HOST = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_HOST" : "");
var TuiDropdownService = class _TuiDropdownService extends TuiPortalService {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdownService_BaseFactory;
      return function TuiDropdownService_Factory(__ngFactoryType__) {
        return (ɵTuiDropdownService_BaseFactory || (ɵTuiDropdownService_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdownService)))(__ngFactoryType__ || _TuiDropdownService);
      };
    })();
  }
  static {
    this.ɵprov = ɵɵdefineInjectable({
      token: _TuiDropdownService,
      factory: _TuiDropdownService.ɵfac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var TUI_DROPDOWN_DEFAULT_OPTIONS = {
  align: "left",
  direction: null,
  limitWidth: "auto",
  maxHeight: 400,
  minHeight: 80,
  offset: 4,
  appearance: ""
};
var TUI_DROPDOWN_OPTIONS = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_OPTIONS" : "", {
  factory: () => TUI_DROPDOWN_DEFAULT_OPTIONS
});
var tuiDropdownOptionsProvider = (override) => ({
  provide: TUI_DROPDOWN_OPTIONS,
  deps: [[new Optional(), new Self(), TuiDropdownOptionsDirective], [new Optional(), new SkipSelf(), TUI_DROPDOWN_OPTIONS]],
  useFactory: tuiOverrideOptions(override, TUI_DROPDOWN_DEFAULT_OPTIONS)
});
var TuiDropdownOptionsDirective = class _TuiDropdownOptionsDirective {
  constructor() {
    this.options = inject(TUI_DROPDOWN_OPTIONS, {
      skipSelf: true
    });
    this.align = this.options.align;
    this.appearance = this.options.appearance;
    this.direction = this.options.direction;
    this.limitWidth = this.options.limitWidth;
    this.minHeight = this.options.minHeight;
    this.maxHeight = this.options.maxHeight;
    this.offset = this.options.offset;
  }
  static {
    this.ɵfac = function TuiDropdownOptionsDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownOptionsDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownOptionsDirective,
      selectors: [["", "tuiDropdownAlign", ""], ["", "tuiDropdownAppearance", ""], ["", "tuiDropdownDirection", ""], ["", "tuiDropdownLimitWidth", ""], ["", "tuiDropdownMinHeight", ""], ["", "tuiDropdownMaxHeight", ""], ["", "tuiDropdownOffset", ""]],
      inputs: {
        align: [0, "tuiDropdownAlign", "align"],
        appearance: [0, "tuiDropdownAppearance", "appearance"],
        direction: [0, "tuiDropdownDirection", "direction"],
        limitWidth: [0, "tuiDropdownLimitWidth", "limitWidth"],
        minHeight: [0, "tuiDropdownMinHeight", "minHeight"],
        maxHeight: [0, "tuiDropdownMaxHeight", "maxHeight"],
        offset: [0, "tuiDropdownOffset", "offset"]
      },
      features: [ɵɵProvidersFeature([tuiProvide(TUI_DROPDOWN_OPTIONS, _TuiDropdownOptionsDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownOptionsDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownAlign], [tuiDropdownAppearance], [tuiDropdownDirection], [tuiDropdownLimitWidth], [tuiDropdownMinHeight], [tuiDropdownMaxHeight], [tuiDropdownOffset]",
      providers: [tuiProvide(TUI_DROPDOWN_OPTIONS, TuiDropdownOptionsDirective)]
    }]
  }], null, {
    align: [{
      type: Input,
      args: ["tuiDropdownAlign"]
    }],
    appearance: [{
      type: Input,
      args: ["tuiDropdownAppearance"]
    }],
    direction: [{
      type: Input,
      args: ["tuiDropdownDirection"]
    }],
    limitWidth: [{
      type: Input,
      args: ["tuiDropdownLimitWidth"]
    }],
    minHeight: [{
      type: Input,
      args: ["tuiDropdownMinHeight"]
    }],
    maxHeight: [{
      type: Input,
      args: ["tuiDropdownMaxHeight"]
    }],
    offset: [{
      type: Input,
      args: ["tuiDropdownOffset"]
    }]
  });
})();
var TuiDropdownPosition = class _TuiDropdownPosition extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.el = tuiInjectElement();
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.viewport = inject(TUI_VIEWPORT);
    this.directionChange = new EventEmitter();
    this.type = "dropdown";
    this.accessor = tuiFallbackAccessor("dropdown")(inject(TuiRectAccessor), inject(TuiDropdownDirective, {
      optional: true
    }));
  }
  emitDirection(direction) {
    this.directionChange.emit(direction);
  }
  getPosition({
    width,
    height
  }) {
    if (!width && !height) {
      this.previous = void 0;
    }
    const hostRect = this.accessor?.getClientRect() ?? EMPTY_CLIENT_RECT;
    const viewportRect = this.viewport.getClientRect();
    const {
      minHeight,
      direction,
      offset,
      limitWidth
    } = this.options;
    const align = this.getAlign(this.options.align);
    const viewport = {
      top: viewportRect.top - offset,
      bottom: viewportRect.bottom + offset,
      right: viewportRect.right - offset,
      left: viewportRect.left + offset
    };
    const previous = this.previous || direction || "bottom";
    const available = {
      top: hostRect.top - 2 * offset - viewport.top,
      bottom: viewport.bottom - hostRect.bottom - 2 * offset
    };
    const rectWidth = limitWidth === "fixed" ? hostRect.width : width;
    const right = Math.max(hostRect.right - rectWidth, offset);
    const left = hostRect.left + width < viewport.right ? hostRect.left : right;
    const position = {
      top: hostRect.top - offset - height,
      bottom: hostRect.bottom + offset,
      right: Math.max(viewport.left, right),
      center: hostRect.left + hostRect.width / 2 + width / 2 < viewport.right ? hostRect.left + hostRect.width / 2 - width / 2 : right,
      left: Math.max(viewport.left, left)
    };
    const better = available.top > available.bottom ? "top" : "bottom";
    if (available[previous] > minHeight && direction || available[previous] > height) {
      this.emitDirection(previous);
      return [position[previous], position[align]];
    }
    this.previous = better;
    this.emitDirection(better);
    return [position[better], position[align]];
  }
  getAlign(align) {
    const rtl = this.el.matches('[dir="rtl"] :scope');
    if (rtl && align === "left") {
      return "right";
    }
    return rtl && align === "right" ? "left" : align;
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdownPosition_BaseFactory;
      return function TuiDropdownPosition_Factory(__ngFactoryType__) {
        return (ɵTuiDropdownPosition_BaseFactory || (ɵTuiDropdownPosition_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdownPosition)))(__ngFactoryType__ || _TuiDropdownPosition);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownPosition,
      outputs: {
        directionChange: "tuiDropdownDirectionChange"
      },
      features: [ɵɵInheritDefinitionFeature]
    });
  }
};
__decorate([tuiPure], TuiDropdownPosition.prototype, "emitDirection", null);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownPosition, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, {
    directionChange: [{
      type: Output,
      args: ["tuiDropdownDirectionChange"]
    }],
    emitDirection: []
  });
})();
var TuiDropdownA11y = class _TuiDropdownA11y {
  constructor() {
    this.id = inject(TuiIdService).generate();
    this.host = inject(TUI_DROPDOWN_HOST);
    this.dropdown = inject(TuiDropdownDirective);
    this.sync = effect(() => {
      const content = this.dropdown._content();
      const dropdown = this.dropdown.ref();
      const host = this.host.nativeElement;
      host.setAttribute("aria-expanded", String(!!dropdown));
      host.setAttribute("aria-controls", this.id);
      host.setAttribute("aria-haspopup", this._tuiDropdownRole());
      if (host.matches("input")) {
        if (content) {
          host.setAttribute("role", "combobox");
        } else {
          host.removeAttribute("role");
        }
      }
      dropdown?.location.nativeElement.setAttribute("role", this._tuiDropdownRole());
      dropdown?.location.nativeElement.setAttribute("id", this.id);
      if (content) {
        return;
      }
      host.removeAttribute("aria-expanded");
      host.removeAttribute("aria-controls");
      host.removeAttribute("aria-haspopup");
    });
    this._tuiDropdownRole = signal("listbox");
  }
  set tuiDropdownRole(role) {
    this._tuiDropdownRole.set(role);
  }
  static {
    this.ɵfac = function TuiDropdownA11y_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownA11y)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownA11y,
      selectors: [["", "tuiDropdownA11y", ""]],
      inputs: {
        tuiDropdownRole: "tuiDropdownRole"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownA11y, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownA11y]"
    }]
  }], null, {
    tuiDropdownRole: [{
      type: Input
    }]
  });
})();
var TuiDropdownDirective = class _TuiDropdownDirective {
  constructor() {
    this.refresh$ = new Subject();
    this.service = inject(TuiDropdownService);
    this.cdr = inject(ChangeDetectorRef);
    this.drivers = coerceArray(inject(TuiDropdownDriver, {
      self: true,
      optional: true
    }));
    this.sub = this.refresh$.pipe(throttleTime(0, tuiZonefreeScheduler()), takeUntilDestroyed()).subscribe(() => {
      this.ref()?.changeDetectorRef.detectChanges();
      this.ref()?.changeDetectorRef.markForCheck();
    });
    this.el = tuiInjectElement();
    this.type = "dropdown";
    this.component = new PolymorpheusComponent(inject(TUI_DROPDOWN_COMPONENT), inject(INJECTOR$1));
    this.ref = signal(null);
    this._content = signal(null);
  }
  set tuiDropdown(content) {
    this._content.set(content instanceof TemplateRef ? new PolymorpheusTemplate(content, this.cdr) : content);
    if (!this._content()) {
      this.toggle(false);
    }
  }
  get position() {
    return tuiCheckFixedPosition(this.el) ? "fixed" : "absolute";
  }
  // TODO(v5): delete
  get content() {
    return this._content();
  }
  // TODO(v5): delete
  set content(x) {
    this._content.set(x);
  }
  ngAfterViewChecked() {
    if (this.ref()) {
      this.refresh$.next();
    }
  }
  ngOnDestroy() {
    this.toggle(false);
  }
  getClientRect() {
    return this.el.getBoundingClientRect();
  }
  toggle(show) {
    const ref = this.ref();
    if (show && this._content() && !ref) {
      this.ref.set(this.service.add(this.component));
    } else if (!show && ref) {
      this.ref.set(null);
      this.service.remove(ref);
    }
    this.drivers.forEach((driver) => driver?.next(show));
    this.cdr.markForCheck();
  }
  static {
    this.ɵfac = function TuiDropdownDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownDirective,
      selectors: [["", "tuiDropdown", "", 5, "ng-container", 5, "ng-template"]],
      hostVars: 2,
      hostBindings: function TuiDropdownDirective_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵclassProp("tui-dropdown-open", ctx.ref());
        }
      },
      inputs: {
        tuiDropdown: "tuiDropdown"
      },
      exportAs: ["tuiDropdown"],
      features: [ɵɵProvidersFeature([tuiAsRectAccessor(_TuiDropdownDirective), tuiAsVehicle(_TuiDropdownDirective), tuiProvide(TUI_DROPDOWN_HOST, ElementRef)]), ɵɵHostDirectivesFeature([TuiDropdownDriverDirective, {
        directive: TuiDropdownA11y,
        inputs: ["tuiDropdownRole", "tuiDropdownRole"]
      }, {
        directive: TuiDropdownPosition,
        outputs: ["tuiDropdownDirectionChange", "tuiDropdownDirectionChange"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdown]:not(ng-container):not(ng-template)",
      providers: [tuiAsRectAccessor(TuiDropdownDirective), tuiAsVehicle(TuiDropdownDirective), tuiProvide(TUI_DROPDOWN_HOST, ElementRef)],
      exportAs: "tuiDropdown",
      hostDirectives: [TuiDropdownDriverDirective, {
        directive: TuiDropdownA11y,
        inputs: ["tuiDropdownRole"]
      }, {
        directive: TuiDropdownPosition,
        outputs: ["tuiDropdownDirectionChange"]
      }],
      host: {
        "[class.tui-dropdown-open]": "ref()"
      }
    }]
  }], null, {
    tuiDropdown: [{
      type: Input
    }]
  });
})();
var MAX_WIDTH_GAP = 16;
var TuiDropdownComponent = class _TuiDropdownComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.accessor = inject(TuiRectAccessor);
    this.viewport = inject(TUI_VIEWPORT);
    this.vvs = inject(TuiVisualViewportService);
    this.styles$ = inject(TuiPositionService).pipe(takeWhile(() => this.directive.el.isConnected && !!this.directive.el.getBoundingClientRect().height), map((v) => this.position === "fixed" ? this.vvs.correct(v) : v), map(([top, left]) => this.getStyles(left, top)), takeUntilDestroyed());
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.directive = inject(TuiDropdownDirective);
    this.context = inject(TUI_DROPDOWN_CONTEXT, {
      optional: true
    });
    this.darkMode = inject(TUI_DARK_MODE);
    this.position = this.directive.position;
    this.theme = computed((_ = this.darkMode()) => this.directive.el.closest("[tuiTheme]")?.getAttribute("tuiTheme"));
    this.close = () => this.directive.toggle(false);
  }
  ngAfterViewInit() {
    this.styles$.subscribe({
      next: (styles) => Object.assign(this.el.style, styles),
      complete: () => this.close?.()
    });
  }
  getStyles(x, y) {
    const {
      maxHeight,
      minHeight,
      offset,
      limitWidth
    } = this.options;
    const parent = this.el.offsetParent?.getBoundingClientRect() || EMPTY_CLIENT_RECT;
    const {
      left = 0,
      top = 0
    } = this.position === "fixed" ? {} : parent;
    const rect2 = this.accessor.getClientRect();
    const viewport = this.viewport.getClientRect();
    const zoom = this.directive.el?.currentCSSZoom || 1;
    const above = rect2.top - viewport.top - 2 * offset;
    const below = viewport.top + viewport.height - y - offset;
    const available = y > rect2.bottom ? below : above;
    const height = this.el.getBoundingClientRect().right <= rect2.left || x >= rect2.right ? maxHeight : tuiClamp(available, minHeight, maxHeight);
    y -= top;
    x -= left;
    return {
      position: this.position,
      top: tuiPx(Math.round(Math.max(y, offset - top) / zoom)),
      left: tuiPx(Math.round(x / zoom)),
      maxHeight: tuiPx(Math.round(height / zoom)),
      width: limitWidth === "fixed" ? tuiPx(Math.round(rect2.width / zoom)) : "",
      minWidth: limitWidth === "min" ? tuiPx(Math.round(rect2.width / zoom)) : "",
      maxWidth: tuiPx(Math.round(viewport.width / zoom) - MAX_WIDTH_GAP)
    };
  }
  static {
    this.ɵfac = function TuiDropdownComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiDropdownComponent,
      selectors: [["tui-dropdown"]],
      hostVars: 2,
      hostBindings: function TuiDropdownComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-appearance", ctx.options.appearance)("tuiTheme", ctx.theme());
        }
      },
      features: [ɵɵProvidersFeature([TuiPositionService, tuiPositionAccessorFor("dropdown", TuiDropdownPosition), tuiRectAccessorFor("dropdown", TuiDropdownDirective)]), ɵɵHostDirectivesFeature([TuiActiveZone, TuiAnimated])],
      decls: 2,
      vars: 4,
      consts: [[1, "t-scroll"], ["class", "t-primitive", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-primitive"]],
      template: function TuiDropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵelementStart(0, "tui-scrollbar", 0);
          ɵɵtemplate(1, TuiDropdownComponent_div_1_Template, 2, 1, "div", 1);
          ɵɵelementEnd();
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵproperty("polymorpheusOutlet", ctx.directive._content())("polymorpheusOutletContext", ɵɵpureFunction1(2, _c03, ctx.close));
        }
      },
      dependencies: [PolymorpheusOutlet, TuiScrollbar],
      styles: ["[_nghost-%COMP%]{position:absolute;display:flex;box-shadow:var(--tui-shadow-medium);color:var(--tui-text-primary);background:var(--tui-background-elevation-3);border-radius:var(--tui-radius-m);overflow:hidden;border:1px solid var(--tui-border-normal);box-sizing:border-box;isolation:isolate;pointer-events:auto;--tui-from: translateY(-1rem)}.tui-enter[_nghost-%COMP%], .tui-leave[_nghost-%COMP%]{animation-name:tuiFade,tuiSlide}[_nghost-%COMP%]:not([style*=top]){visibility:hidden}.t-scroll[_ngcontent-%COMP%]{flex-grow:1;max-inline-size:100%;inline-size:-webkit-max-content;inline-size:max-content;overscroll-behavior:none}.t-primitive[_ngcontent-%COMP%]{padding:1rem}"],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-dropdown",
      imports: [PolymorpheusOutlet, TuiScrollbar],
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [TuiPositionService, tuiPositionAccessorFor("dropdown", TuiDropdownPosition), tuiRectAccessorFor("dropdown", TuiDropdownDirective)],
      hostDirectives: [TuiActiveZone, TuiAnimated],
      host: {
        "[attr.data-appearance]": "options.appearance",
        "[attr.tuiTheme]": "theme()"
      },
      template: '<tui-scrollbar class="t-scroll">\n    <div\n        *polymorpheusOutlet="directive._content() as text; context: {$implicit: close}"\n        class="t-primitive"\n    >\n        {{ text }}\n    </div>\n</tui-scrollbar>\n',
      styles: [":host{position:absolute;display:flex;box-shadow:var(--tui-shadow-medium);color:var(--tui-text-primary);background:var(--tui-background-elevation-3);border-radius:var(--tui-radius-m);overflow:hidden;border:1px solid var(--tui-border-normal);box-sizing:border-box;isolation:isolate;pointer-events:auto;--tui-from: translateY(-1rem)}:host.tui-enter,:host.tui-leave{animation-name:tuiFade,tuiSlide}:host:not([style*=top]){visibility:hidden}.t-scroll{flex-grow:1;max-inline-size:100%;inline-size:-webkit-max-content;inline-size:max-content;overscroll-behavior:none}.t-primitive{padding:1rem}\n"]
    }]
  }], null, null);
})();
var TuiDropdownContext = class _TuiDropdownContext extends TuiRectAccessor {
  constructor() {
    super(...arguments);
    this.zone = inject(NgZone);
    this.isTouch = inject(TUI_IS_TOUCH);
    this.currentRect = EMPTY_CLIENT_RECT;
    this.userSelect = computed(() => this.isTouch() ? "none" : null);
    this.activeZone = inject(TuiActiveZone);
    this.driver = inject(TuiDropdownDriver);
    this.doc = inject(DOCUMENT);
    this.sub = merge(tuiTypedFromEvent(this.doc, "pointerdown"), tuiTypedFromEvent(this.doc, "contextmenu", {
      capture: true
    })).pipe(tuiZonefree(), takeUntilDestroyed()).subscribe((event) => this.closeDropdown(event));
    this.type = "dropdown";
  }
  getClientRect() {
    return this.currentRect;
  }
  closeDropdown(event) {
    if (!event || this.driver.value && !this.activeZone.contains(tuiGetActualTarget(event))) {
      this.zone.run(() => {
        this.driver.next(false);
        this.currentRect = EMPTY_CLIENT_RECT;
      });
    }
  }
  onContextMenu(x, y) {
    this.currentRect = tuiPointToClientRect(x, y);
    this.driver.next(true);
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdownContext_BaseFactory;
      return function TuiDropdownContext_Factory(__ngFactoryType__) {
        return (ɵTuiDropdownContext_BaseFactory || (ɵTuiDropdownContext_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdownContext)))(__ngFactoryType__ || _TuiDropdownContext);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownContext,
      selectors: [["", "tuiDropdownContext", ""]],
      hostVars: 6,
      hostBindings: function TuiDropdownContext_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("keydown.esc", function TuiDropdownContext_keydown_esc_HostBindingHandler() {
            return ctx.closeDropdown();
          }, ɵɵresolveDocument)("longtap", function TuiDropdownContext_longtap_HostBindingHandler($event) {
            return ctx.onContextMenu($event.detail.clientX, $event.detail.clientY);
          });
        }
        if (rf & 2) {
          ɵɵstyleProp("user-select", ctx.userSelect())("-webkit-user-select", ctx.userSelect())("-webkit-touch-callout", ctx.userSelect());
        }
      },
      features: [ɵɵProvidersFeature([TuiActiveZone, TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiAsRectAccessor(_TuiDropdownContext)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownContext, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownContext]",
      providers: [TuiActiveZone, TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiAsRectAccessor(TuiDropdownContext)],
      host: {
        "[style.user-select]": "userSelect()",
        "[style.-webkit-user-select]": "userSelect()",
        "[style.-webkit-touch-callout]": "userSelect()",
        "(document:keydown.esc)": "closeDropdown()",
        "(longtap)": "onContextMenu($event.detail.clientX, $event.detail.clientY)"
      }
    }]
  }], null, null);
})();
var TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS = {
  showDelay: 200,
  hideDelay: 500
};
var TUI_DROPDOWN_HOVER_OPTIONS = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_HOVER_OPTIONS" : "", {
  factory: () => TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS
});
function tuiDropdownHoverOptionsProvider(options) {
  return tuiProvideOptions(TUI_DROPDOWN_HOVER_OPTIONS, options, TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS);
}
var TuiDropdownOpen = class _TuiDropdownOpen {
  constructor() {
    this.directive = inject(TuiDropdownDirective);
    this.el = tuiInjectElement();
    this.obscured = inject(TuiObscured);
    this.activeZone = inject(TuiActiveZone);
    this.zone = inject(NgZone);
    this.dropdown = computed(() => this.directive.ref()?.location.nativeElement);
    this.tuiDropdownEnabled = true;
    this.tuiDropdownOpen = false;
    this.tuiDropdownOpenChange = new EventEmitter();
    this.driver = inject(TuiDropdownDriver);
    this.sub = this.driver.pipe(tuiIfMap(() => merge(tuiCloseWatcher(), this.obscured.tuiObscured.pipe(filter(Boolean)), this.activeZone.tuiActiveZoneChange.pipe(filter((a) => !a)), fromEvent(this.el, "focusin").pipe(filter((event) => !this.nativeElement.contains(tuiGetActualTarget(event)) || !this.directive.ref())))), tuiZonefull(), tuiWatch(), takeUntilDestroyed()).subscribe(() => this.toggle(false));
    this.sync = this.driver.pipe(takeUntilDestroyed()).subscribe((open) => {
      if (open !== this.tuiDropdownOpen) {
        this.update(open);
      }
    });
  }
  get nativeElement() {
    const initial = this.dropdownHost?.nativeElement || this.el;
    const focusable = tuiIsKeyboardFocusable(initial) ? initial : tuiGetClosestFocusable({
      initial,
      root: this.el
    });
    return this.dropdownHost?.nativeElement || focusable || this.el;
  }
  ngOnChanges() {
    this.drive(!!this.tuiDropdownOpen);
    this.tuiDropdownOpenChange.emit(!!this.tuiDropdownOpen);
  }
  toggle(open) {
    if (this.focused && !open) {
      this.nativeElement.focus({
        preventScroll: true
      });
    }
    this.update(open);
  }
  onEsc(event) {
    if (
      // @ts-ignore
      typeof CloseWatcher === "undefined" && // ?. for autofill events
      event.key?.toLowerCase() === "escape" && this.tuiDropdownEnabled && !!this.tuiDropdownOpen && !this.dropdown()?.nextElementSibling
    ) {
      this.zone.run(() => {
        event.preventDefault();
        this.toggle(false);
      });
    }
  }
  onClick(target) {
    if (!this.editable && this.nativeElement.contains(target)) {
      this.update(!this.tuiDropdownOpen);
    }
  }
  onArrow(event, up) {
    if (!tuiIsElement(event.target) || !this.nativeElement.contains(event.target) || !this.tuiDropdownEnabled || !this.directive._content()) {
      return;
    }
    event.preventDefault();
    this.focusDropdown(up);
  }
  onKeydown(event) {
    const target = tuiGetActualTarget(event);
    if (!event.defaultPrevented && tuiIsEditingKey(event.key) && this.editable && this.focused && tuiIsHTMLElement(target) && !tuiIsElementEditable(target)) {
      this.nativeElement.focus({
        preventScroll: true
      });
    }
  }
  get editable() {
    return tuiIsElementEditable(this.nativeElement);
  }
  get focused() {
    return tuiIsFocusedIn(this.nativeElement) || tuiIsFocusedIn(this.dropdown());
  }
  update(open) {
    if (open && !this.tuiDropdownEnabled) {
      return this.drive();
    }
    this.tuiDropdownOpen = open;
    this.tuiDropdownOpenChange.emit(open);
    this.drive();
  }
  drive(open = !!this.tuiDropdownOpen && this.tuiDropdownEnabled) {
    this.obscured.tuiObscuredEnabled = open;
    this.driver.next(open);
  }
  focusDropdown(previous) {
    const root = this.dropdown();
    if (!root) {
      this.update(true);
      return;
    }
    const doc = this.el.ownerDocument;
    const child = root.appendChild(doc.createElement("div"));
    const initial = previous ? child : root;
    const focusable = tuiGetClosestFocusable({
      initial,
      previous,
      root
    });
    child.remove();
    focusable?.focus();
  }
  static {
    this.ɵfac = function TuiDropdownOpen_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownOpen)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownOpen,
      selectors: [["", "tuiDropdown", "", "tuiDropdownOpen", ""], ["", "tuiDropdown", "", "tuiDropdownOpenChange", ""]],
      contentQueries: function TuiDropdownOpen_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, _c1, 5, ElementRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dropdownHost = _t.first);
        }
      },
      hostBindings: function TuiDropdownOpen_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click", function TuiDropdownOpen_click_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          })("keydown.arrowDown", function TuiDropdownOpen_keydown_arrowDown_HostBindingHandler($event) {
            return ctx.onArrow($event, false);
          })("keydown.arrowUp", function TuiDropdownOpen_keydown_arrowUp_HostBindingHandler($event) {
            return ctx.onArrow($event, true);
          })("keydown.zoneless.capture", function TuiDropdownOpen_keydown_zoneless_capture_HostBindingHandler($event) {
            return ctx.onEsc($event);
          }, ɵɵresolveDocument)("keydown.zoneless", function TuiDropdownOpen_keydown_zoneless_HostBindingHandler($event) {
            return ctx.onKeydown($event);
          }, ɵɵresolveDocument)("tuiActiveZoneChange", function TuiDropdownOpen_tuiActiveZoneChange_HostBindingHandler() {
            return 0;
          });
        }
      },
      inputs: {
        tuiDropdownEnabled: "tuiDropdownEnabled",
        tuiDropdownOpen: "tuiDropdownOpen"
      },
      outputs: {
        tuiDropdownOpenChange: "tuiDropdownOpenChange"
      },
      features: [ɵɵProvidersFeature([TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiProvide(TUI_DROPDOWN_HOST, _TuiDropdownOpen)]), ɵɵHostDirectivesFeature([TuiObscured, {
        directive: TuiActiveZone,
        inputs: ["tuiActiveZoneParent", "tuiActiveZoneParent"],
        outputs: ["tuiActiveZoneChange", "tuiActiveZoneChange"]
      }]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownOpen, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdown][tuiDropdownOpen],[tuiDropdown][tuiDropdownOpenChange]",
      providers: [TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiProvide(TUI_DROPDOWN_HOST, TuiDropdownOpen)],
      hostDirectives: [TuiObscured, {
        directive: TuiActiveZone,
        inputs: ["tuiActiveZoneParent"],
        outputs: ["tuiActiveZoneChange"]
      }],
      host: {
        "(click)": "onClick($event.target)",
        "(keydown.arrowDown)": "onArrow($event, false)",
        "(keydown.arrowUp)": "onArrow($event, true)",
        "(document:keydown.zoneless.capture)": "onEsc($event)",
        "(document:keydown.zoneless)": "onKeydown($event)",
        // TODO: Necessary because startWith(false) + distinctUntilChanged() in TuiActiveZone, think of better solution
        "(tuiActiveZoneChange)": "0"
      }
    }]
  }], null, {
    dropdownHost: [{
      type: ContentChild,
      args: ["tuiDropdownHost", {
        descendants: true,
        read: ElementRef
      }]
    }],
    tuiDropdownEnabled: [{
      type: Input
    }],
    tuiDropdownOpen: [{
      type: Input
    }],
    tuiDropdownOpenChange: [{
      type: Output
    }]
  });
})();
var TuiDropdownHover = class _TuiDropdownHover extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.el = tuiInjectElement();
    this.doc = inject(DOCUMENT);
    this.options = inject(TUI_DROPDOWN_HOVER_OPTIONS);
    this.activeZone = inject(TuiActiveZone);
    this.open = inject(TuiDropdownOpen, {
      optional: true
    });
    this.dropdownExternalRemoval$ = toObservable(inject(TuiDropdownDirective).ref).pipe(filter((x) => !x && this.hovered));
    this.stream$ = merge(this.dropdownExternalRemoval$.pipe(switchMap(() => tuiTypedFromEvent(this.doc, "pointerdown").pipe(map(tuiGetActualTarget), delay(this.hideDelay), startWith(null), takeUntil(fromEvent(this.doc, "mouseover"))))), tuiTypedFromEvent(this.doc, "mouseover").pipe(map(tuiGetActualTarget)), tuiTypedFromEvent(this.doc, "mouseout").pipe(map((e) => e.relatedTarget))).pipe(map((element) => tuiIsElement(element) && this.isHovered(element)), distinctUntilChanged(), switchMap((visible) => of(visible).pipe(delay(visible ? this.showDelay : this.hideDelay), takeUntil(this.open ? fromEvent(this.el, "pointerdown") : EMPTY))), tuiZoneOptimized(), tap((hovered) => {
      this.hovered = hovered;
      this.open?.toggle(hovered);
    }), share());
    this.showDelay = this.options.showDelay;
    this.hideDelay = this.options.hideDelay;
    this.hovered = false;
    this.type = "dropdown";
  }
  onClick(event) {
    if (this.hovered && this.open) {
      event.preventDefault();
    }
  }
  isHovered(element) {
    const host = this.dropdownHost?.nativeElement || this.el;
    const hovered = host.contains(element);
    const child = !this.el.contains(element) && this.activeZone.contains(element);
    return hovered || child;
  }
  static {
    this.ɵfac = function TuiDropdownHover_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownHover)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownHover,
      selectors: [["", "tuiDropdownHover", ""]],
      contentQueries: function TuiDropdownHover_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, _c1, 5, ElementRef);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dropdownHost = _t.first);
        }
      },
      hostBindings: function TuiDropdownHover_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click.capture", function TuiDropdownHover_click_capture_HostBindingHandler($event) {
            return ctx.onClick($event);
          });
        }
      },
      inputs: {
        showDelay: [0, "tuiDropdownShowDelay", "showDelay"],
        hideDelay: [0, "tuiDropdownHideDelay", "hideDelay"]
      },
      features: [ɵɵProvidersFeature([TuiActiveZone, tuiAsDriver(_TuiDropdownHover)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownHover, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownHover]",
      providers: [TuiActiveZone, tuiAsDriver(TuiDropdownHover)],
      host: {
        "(click.capture)": "onClick($event)"
      }
    }]
  }], function() {
    return [];
  }, {
    dropdownHost: [{
      type: ContentChild,
      args: ["tuiDropdownHost", {
        descendants: true,
        read: ElementRef
      }]
    }],
    showDelay: [{
      type: Input,
      args: ["tuiDropdownShowDelay"]
    }],
    hideDelay: [{
      type: Input,
      args: ["tuiDropdownHideDelay"]
    }]
  });
})();
var TuiDropdownManual = class _TuiDropdownManual {
  constructor() {
    this.driver = inject(TuiDropdownDriver);
    this.tuiDropdownManual = false;
  }
  ngOnChanges() {
    this.driver.next(!!this.tuiDropdownManual);
  }
  static {
    this.ɵfac = function TuiDropdownManual_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownManual)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownManual,
      selectors: [["", "tuiDropdownManual", ""]],
      inputs: {
        tuiDropdownManual: "tuiDropdownManual"
      },
      features: [ɵɵProvidersFeature([TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver)]), ɵɵNgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownManual, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownManual]",
      providers: [TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver)]
    }]
  }], null, {
    tuiDropdownManual: [{
      type: Input
    }]
  });
})();
var TuiDropdownOpenLegacy = class _TuiDropdownOpenLegacy {
  constructor() {
    this.openStateSub = new Subject();
    this.tuiDropdownOpenChange = this.openStateSub.pipe(distinctUntilChanged());
  }
  set tuiDropdownOpen(open) {
    this.emitOpenChange(open);
  }
  emitOpenChange(open) {
    this.openStateSub.next(open);
  }
  static {
    this.ɵfac = function TuiDropdownOpenLegacy_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownOpenLegacy)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownOpenLegacy,
      selectors: [["", "tuiDropdownOpen", "", 3, "tuiDropdown", ""], ["", "tuiDropdownOpenChange", "", 3, "tuiDropdown", ""]],
      inputs: {
        tuiDropdownOpen: "tuiDropdownOpen"
      },
      outputs: {
        tuiDropdownOpenChange: "tuiDropdownOpenChange"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownOpenLegacy, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownOpen]:not([tuiDropdown]),[tuiDropdownOpenChange]:not([tuiDropdown])"
    }]
  }], null, {
    tuiDropdownOpenChange: [{
      type: Output
    }],
    tuiDropdownOpen: [{
      type: Input
    }]
  });
})();
var TuiDropdownPortal = class _TuiDropdownPortal {
  constructor() {
    this.template = inject(TemplateRef);
    this.service = inject(TuiDropdownService);
  }
  set tuiDropdown(show) {
    this.viewRef?.destroy();
    if (show) {
      this.viewRef = this.service.addTemplate(this.template);
    }
  }
  ngOnDestroy() {
    this.viewRef?.destroy();
  }
  static {
    this.ɵfac = function TuiDropdownPortal_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownPortal)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownPortal,
      selectors: [["ng-template", "tuiDropdown", ""]],
      inputs: {
        tuiDropdown: "tuiDropdown"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownPortal, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiDropdown]"
    }]
  }], null, {
    tuiDropdown: [{
      type: Input
    }]
  });
})();
var TuiDropdownPositionSided = class _TuiDropdownPositionSided extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.viewport = inject(TUI_VIEWPORT);
    this.vertical = inject(TuiDropdownPosition);
    this.previous = this.options.direction || "bottom";
    this.tuiDropdownSided = "";
    this.tuiDropdownSidedOffset = 4;
    this.type = "dropdown";
  }
  getPosition(rect2) {
    if (this.tuiDropdownSided === false) {
      return this.vertical.getPosition(rect2);
    }
    const {
      height,
      width
    } = rect2;
    const hostRect = this.vertical.accessor?.getClientRect() ?? EMPTY_CLIENT_RECT;
    const viewport = this.viewport.getClientRect();
    const {
      direction,
      offset
    } = this.options;
    const adjusted = this.vertical.getAlign(this.options.align);
    const align = adjusted === "center" ? "left" : adjusted;
    const available = {
      top: hostRect.bottom - viewport.top,
      left: hostRect.left - offset - viewport.left,
      right: viewport.right - hostRect.right - offset,
      bottom: viewport.bottom - hostRect.top
    };
    const position = {
      top: hostRect.bottom - height + this.tuiDropdownSidedOffset + 1,
      left: hostRect.left - width - offset,
      right: hostRect.right + offset,
      bottom: hostRect.top - this.tuiDropdownSidedOffset - 1
      // 1 for border
    };
    const better = available.top > available.bottom ? "top" : "bottom";
    const maxLeft = available.left > available.right ? position.left : position.right;
    const left = available[align] > width ? position[align] : maxLeft;
    if (available[this.previous] > height && direction || this.previous === better) {
      this.vertical.emitDirection(this.previous);
      return [position[this.previous], left];
    }
    this.previous = better;
    this.vertical.emitDirection(better);
    return [position[better], left];
  }
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdownPositionSided_BaseFactory;
      return function TuiDropdownPositionSided_Factory(__ngFactoryType__) {
        return (ɵTuiDropdownPositionSided_BaseFactory || (ɵTuiDropdownPositionSided_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdownPositionSided)))(__ngFactoryType__ || _TuiDropdownPositionSided);
      };
    })();
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownPositionSided,
      selectors: [["", "tuiDropdownSided", ""]],
      inputs: {
        tuiDropdownSided: "tuiDropdownSided",
        tuiDropdownSidedOffset: "tuiDropdownSidedOffset"
      },
      features: [ɵɵProvidersFeature([TuiDropdownPosition, tuiAsPositionAccessor(_TuiDropdownPositionSided)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownPositionSided, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownSided]",
      providers: [TuiDropdownPosition, tuiAsPositionAccessor(TuiDropdownPositionSided)]
    }]
  }], null, {
    tuiDropdownSided: [{
      type: Input
    }],
    tuiDropdownSidedOffset: [{
      type: Input
    }]
  });
})();
var TuiDropdownSelection = class _TuiDropdownSelection extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.doc = inject(DOCUMENT);
    this.vcr = inject(ViewContainerRef);
    this.dropdown = inject(TuiDropdownDirective);
    this.el = tuiInjectElement();
    this.handler$ = new BehaviorSubject(TUI_TRUE_HANDLER);
    this.stream$ = combineLatest([this.handler$, inject(TUI_SELECTION_STREAM).pipe(map(() => this.getRange()), filter((range) => this.isValid(range)), distinctUntilChanged((x, y) => x.startOffset === y.startOffset && x.endOffset === y.endOffset && x.commonAncestorContainer === y.commonAncestorContainer)), merge(fromEvent(this.el, "scroll", {
      passive: true,
      capture: true
    })).pipe(throttleTime(16, void 0, {
      leading: false,
      trailing: true
    }), startWith(0))]).pipe(tap(([, range]) => {
      this.range = this.el.contains(range.commonAncestorContainer) && tuiIsTextNode(range.commonAncestorContainer) ? range : this.range;
    }), map(([handler, range]) => {
      const contained = this.el.contains(range.commonAncestorContainer);
      const valid = contained && handler(this.range);
      const visible = valid || this.inDropdown(range);
      const active = tuiGetFocused(this.doc);
      const textfield = active && tuiIsTextfield(active) && this.el.contains(active);
      return visible && textfield ? this.isCaretVisible(this.range) : visible;
    }));
    this.range = inject(TUI_RANGE);
    this.position = "selection";
    this.type = "dropdown";
  }
  set tuiDropdownSelection(visible) {
    if (!tuiIsString(visible)) {
      this.handler$.next(visible);
    }
  }
  getClientRect() {
    switch (this.position) {
      case "tag": {
        const {
          commonAncestorContainer
        } = this.range;
        const element = tuiIsElement(commonAncestorContainer) ? commonAncestorContainer : commonAncestorContainer.parentNode;
        return element && tuiIsElement(element) ? element.getBoundingClientRect() : EMPTY_CLIENT_RECT;
      }
      case "word":
        return tuiGetWordRange(this.range).getBoundingClientRect();
      default:
        return this.range.getBoundingClientRect();
    }
  }
  ngOnDestroy() {
    if (this.ghost) {
      this.ghostHost.removeChild(this.ghost);
    }
  }
  get ghostHost() {
    return this.el.querySelector("tui-textfield .t-ghost") || this.el;
  }
  getRange() {
    const active = tuiGetFocused(this.doc);
    const selection = this.doc.getSelection();
    const range = active && tuiIsTextfield(active) && this.el.contains(active) ? this.veryVerySadInputFix(active) : selection?.rangeCount && selection.getRangeAt(0) || this.range;
    return range.cloneRange();
  }
  /**
   * Check if given range is at least partially inside dropdown
   */
  inDropdown(range) {
    const {
      startContainer,
      endContainer
    } = range;
    const inDropdown = this.boxContains(range.commonAncestorContainer);
    const hostToDropdown = this.boxContains(endContainer) && this.el.contains(startContainer);
    const dropdownToHost = this.boxContains(startContainer) && this.el.contains(endContainer);
    return inDropdown || hostToDropdown || dropdownToHost;
  }
  /**
   * Check if Node is inside dropdown
   */
  boxContains(node) {
    return !!this.dropdown.ref()?.location.nativeElement.contains(node);
  }
  /**
   * Check if range is not inside tui-textfield's DOM elements
   */
  isValid(range) {
    return !this.el.contains(range.commonAncestorContainer) || !this.el.closest("tui-textfield") || range.intersectsNode(this.ghost || this.el);
  }
  veryVerySadInputFix(element) {
    const {
      ghost = this.initGhost(this.ghostHost)
    } = this;
    const {
      top,
      left,
      width,
      height
    } = this.ghostHost.getBoundingClientRect();
    const {
      selectionStart,
      selectionEnd,
      value
    } = element;
    const range = this.doc.createRange();
    const hostRect = this.ghostHost.getBoundingClientRect();
    ghost.style.top = tuiPx(top - hostRect.top);
    ghost.style.left = tuiPx(left - hostRect.left);
    ghost.style.width = tuiPx(width);
    ghost.style.height = tuiPx(height);
    ghost.textContent = CHAR_ZERO_WIDTH_SPACE + value + CHAR_NO_BREAK_SPACE;
    range.setStart(ghost.firstChild, selectionStart || 0);
    range.setEnd(ghost.firstChild, selectionEnd || 0);
    return range;
  }
  /**
   * Create an invisible DIV styled exactly like input/textarea element inside directive
   */
  initGhost(element) {
    const ghost = this.doc.createElement("div");
    const {
      font,
      letterSpacing,
      textTransform,
      padding,
      borderTop
    } = getComputedStyle(element);
    ghost.style.position = "absolute";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0";
    ghost.style.whiteSpace = "pre-wrap";
    ghost.style.boxSizing = "border-box";
    ghost.style.borderTop = borderTop;
    ghost.style.font = font;
    ghost.style.letterSpacing = letterSpacing;
    ghost.style.textTransform = textTransform;
    ghost.style.padding = padding;
    this.ghostHost.appendChild(ghost);
    this.ghost = ghost;
    return ghost;
  }
  isCaretVisible(range) {
    const caret = range.getBoundingClientRect();
    const host = this.ghostHost.getBoundingClientRect();
    const styles = getComputedStyle(this.ghostHost);
    const fontSize = parseFloat(styles.fontSize) || 16;
    const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2;
    const visibleTop = Math.max(caret.top, host.top);
    const visibleBottom = Math.min(caret.bottom, host.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const threshold = lineHeight * 0.5;
    return visibleHeight >= threshold;
  }
  static {
    this.ɵfac = function TuiDropdownSelection_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownSelection)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownSelection,
      selectors: [["", "tuiDropdownSelection", ""]],
      inputs: {
        position: [0, "tuiDropdownSelectionPosition", "position"],
        tuiDropdownSelection: "tuiDropdownSelection"
      },
      features: [ɵɵProvidersFeature([tuiAsDriver(_TuiDropdownSelection), tuiAsRectAccessor(_TuiDropdownSelection)]), ɵɵInheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownSelection, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "[tuiDropdownSelection]",
      providers: [tuiAsDriver(TuiDropdownSelection), tuiAsRectAccessor(TuiDropdownSelection)]
    }]
  }], function() {
    return [];
  }, {
    position: [{
      type: Input,
      args: ["tuiDropdownSelectionPosition"]
    }],
    tuiDropdownSelection: [{
      type: Input
    }]
  });
})();
var TuiDropdown = [TuiDropdownOptionsDirective, TuiDropdownDriverDirective, TuiDropdownDirective, TuiDropdownComponent, TuiDropdownOpen, TuiDropdownOpenLegacy, TuiDropdownPortal, TuiDropdownManual, TuiDropdownHover, TuiDropdownContext, TuiDropdownPosition, TuiDropdownPositionSided, TuiDropdownSelection, TuiDropdownA11y];
function tuiDropdown(value) {
  return tuiDirectiveBinding(TuiDropdownDirective, "tuiDropdown", value, {});
}
function tuiDropdownEnabled(value) {
  return tuiDirectiveBinding(TuiDropdownOpen, "tuiDropdownEnabled", value, {});
}
function tuiDropdownOpen() {
  const open = tuiDirectiveBinding(TuiDropdownOpen, "tuiDropdownOpen", false, {});
  inject(TuiDropdownOpen).tuiDropdownOpenChange.pipe(takeUntilDestroyed()).subscribe((value) => open.set(value));
  return open;
}
var TuiDropdownFixed = class _TuiDropdownFixed {
  constructor() {
    const override = tuiOverrideOptions({
      limitWidth: "fixed"
    }, TUI_DROPDOWN_DEFAULT_OPTIONS);
    override(inject(TUI_DROPDOWN_OPTIONS, {
      self: true,
      optional: true
    }), null);
  }
  static {
    this.ɵfac = function TuiDropdownFixed_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownFixed)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownFixed,
      features: [ɵɵProvidersFeature([tuiDropdownOptionsProvider({})])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownFixed, [{
    type: Directive,
    args: [{
      standalone: true,
      providers: [tuiDropdownOptionsProvider({})]
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiDropdownAuto = class _TuiDropdownAuto {
  constructor() {
    inject(TUI_DROPDOWN_OPTIONS).limitWidth = "auto";
  }
  static {
    this.ɵfac = function TuiDropdownAuto_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownAuto)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDropdownAuto
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownAuto, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], function() {
    return [];
  }, null);
})();
var TuiDropdowns = class _TuiDropdowns extends TuiPortals {
  static {
    this.ɵfac = /* @__PURE__ */ (() => {
      let ɵTuiDropdowns_BaseFactory;
      return function TuiDropdowns_Factory(__ngFactoryType__) {
        return (ɵTuiDropdowns_BaseFactory || (ɵTuiDropdowns_BaseFactory = ɵɵgetInheritedFactory(_TuiDropdowns)))(__ngFactoryType__ || _TuiDropdowns);
      };
    })();
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiDropdowns,
      selectors: [["tui-dropdowns"]],
      hostAttrs: [2, "position", "absolute", "width", "100%", "top", "0"],
      features: [ɵɵProvidersFeature([tuiAsPortal(TuiDropdownService)]), ɵɵInheritDefinitionFeature],
      decls: 2,
      vars: 0,
      consts: [["viewContainer", ""]],
      template: function TuiDropdowns_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵdomElementContainer(0, null, 0);
        }
      },
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdowns, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-dropdowns",
      template: "<ng-container #viewContainer />",
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAsPortal(TuiDropdownService)],
      host: {
        style: "position: absolute; width: 100%; top: 0"
      }
    }]
  }], null, null);
})();
var TuiWithDropdownOpen = class _TuiWithDropdownOpen {
  static {
    this.ɵfac = function TuiWithDropdownOpen_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithDropdownOpen)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithDropdownOpen,
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiDropdownOpen,
        inputs: ["tuiDropdownOpen", "open", "tuiDropdownEnabled", "tuiDropdownEnabled"],
        outputs: ["tuiDropdownOpenChange", "openChange"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithDropdownOpen, [{
    type: Directive,
    args: [{
      standalone: true,
      hostDirectives: [{
        directive: TuiDropdownOpen,
        inputs: ["tuiDropdownOpen: open", "tuiDropdownEnabled"],
        outputs: ["tuiDropdownOpenChange: openChange"]
      }]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-icons.mjs
var TuiIconsStyles = class _TuiIconsStyles {
  static {
    this.ɵfac = function TuiIconsStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiIconsStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiIconsStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-icons-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiIconsStyles_Template(rf, ctx) {
      },
      styles: ['[tuiIconsV="4.90.0"]{--t-icon-start: none;--t-icon-end: none}[tuiIconsV="4.90.0"]:before,[tuiIconsV="4.90.0"]:after{content:"";inline-size:1em;block-size:1em;line-height:1em;font-size:1.5rem;flex-shrink:0;box-sizing:content-box;background:currentColor}[tuiIconsV="4.90.0"]:before{display:var(--t-icon-start, none);-webkit-mask:var(--t-icon-start) no-repeat center / contain padding-box;mask:var(--t-icon-start) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"]:after{display:var(--t-icon-end, none);-webkit-mask:var(--t-icon-end) no-repeat center / contain padding-box;mask:var(--t-icon-end) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-start=image]:before{-webkit-mask:none;mask:none;background:var(--t-icon-start) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-end=image]:after{-webkit-mask:none;mask:none;background:var(--t-icon-end) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-start=font]:before,[tuiIconsV="4.90.0"][data-icon-end=font]:after{display:grid;-webkit-mask:none;mask:none;background:none;font:1.3em/1 var(--tui-font-icon, inherit);text-align:center;place-content:center;text-transform:none}[tuiIconsV="4.90.0"][data-icon-start=font]:before{content:var(--t-icon-start)}[tuiIconsV="4.90.0"][data-icon-end=font]:after{content:var(--t-icon-end)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiIconsStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-icons-${TUI_VERSION}`,
      styles: ['[tuiIconsV="4.90.0"]{--t-icon-start: none;--t-icon-end: none}[tuiIconsV="4.90.0"]:before,[tuiIconsV="4.90.0"]:after{content:"";inline-size:1em;block-size:1em;line-height:1em;font-size:1.5rem;flex-shrink:0;box-sizing:content-box;background:currentColor}[tuiIconsV="4.90.0"]:before{display:var(--t-icon-start, none);-webkit-mask:var(--t-icon-start) no-repeat center / contain padding-box;mask:var(--t-icon-start) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"]:after{display:var(--t-icon-end, none);-webkit-mask:var(--t-icon-end) no-repeat center / contain padding-box;mask:var(--t-icon-end) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-start=image]:before{-webkit-mask:none;mask:none;background:var(--t-icon-start) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-end=image]:after{-webkit-mask:none;mask:none;background:var(--t-icon-end) no-repeat center / contain padding-box}[tuiIconsV="4.90.0"][data-icon-start=font]:before,[tuiIconsV="4.90.0"][data-icon-end=font]:after{display:grid;-webkit-mask:none;mask:none;background:none;font:1.3em/1 var(--tui-font-icon, inherit);text-align:center;place-content:center;text-transform:none}[tuiIconsV="4.90.0"][data-icon-start=font]:before{content:var(--t-icon-start)}[tuiIconsV="4.90.0"][data-icon-end=font]:after{content:var(--t-icon-end)}\n']
    }]
  }], null, null);
})();
var TuiIcons = class _TuiIcons {
  constructor() {
    this.resolver = tuiInjectIconResolver();
    this.nothing = tuiWithStyles(TuiIconsStyles);
    this.startResource = computed(() => this.resolve(this.iconStart()));
    this.endResource = computed(() => this.resolve(this.iconEnd()));
    this.startMode = computed(() => tuiGetIconMode(this.iconStart()?.toString()));
    this.endMode = computed(() => tuiGetIconMode(this.iconEnd()));
    this.iconStart = signal(inject(TUI_ICON_START, {
      self: true,
      optional: true
    }) || "");
    this.iconEnd = signal(inject(TUI_ICON_END, {
      self: true,
      optional: true
    }) || "");
  }
  // TODO(v5): use signal inputs
  set iconStartSetter(x) {
    this.iconStart.set(x);
  }
  // TODO(v5): use signal inputs
  set iconEndSetter(x) {
    this.iconEnd.set(x);
  }
  resolve(icon) {
    if (!icon) {
      return null;
    }
    const iconStr = icon.toString();
    return tuiGetIconMode(iconStr) === "font" ? `'${this.resolver(iconStr)}'` : `url(${this.resolver(iconStr)})`;
  }
  static {
    this.ɵfac = function TuiIcons_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiIcons)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiIcons,
      hostAttrs: ["tuiIcons", "", "tuiIconsV", "4.90.0"],
      hostVars: 6,
      hostBindings: function TuiIcons_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-icon-start", ctx.startMode())("data-icon-end", ctx.endMode());
          ɵɵstyleProp("--t-icon-start", ctx.startResource())("--t-icon-end", ctx.endResource());
        }
      },
      inputs: {
        iconStartSetter: [0, "iconStart", "iconStartSetter"],
        iconEndSetter: [0, "iconEnd", "iconEndSetter"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiIcons, [{
    type: Directive,
    args: [{
      standalone: true,
      host: {
        tuiIcons: "",
        tuiIconsV: TUI_VERSION,
        "[style.--t-icon-start]": "startResource()",
        "[style.--t-icon-end]": "endResource()",
        "[attr.data-icon-start]": "startMode()",
        "[attr.data-icon-end]": "endMode()"
      }
    }]
  }], null, {
    iconStartSetter: [{
      type: Input,
      args: ["iconStart"]
    }],
    iconEndSetter: [{
      type: Input,
      args: ["iconEnd"]
    }]
  });
})();
var TuiWithIcons = class _TuiWithIcons {
  static {
    this.ɵfac = function TuiWithIcons_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithIcons)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithIcons,
      features: [ɵɵHostDirectivesFeature([{
        directive: TuiIcons,
        inputs: ["iconStart", "iconStart", "iconEnd", "iconEnd"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithIcons, [{
    type: Directive,
    args: [{
      standalone: true,
      hostDirectives: [{
        directive: TuiIcons,
        inputs: ["iconStart", "iconEnd"]
      }]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-data-list.mjs
var _c04 = ["*"];
var _c12 = (a0) => ({
  $implicit: a0
});
function TuiOption_ng_container_0_Template(rf, ctx) {
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
function TuiOption_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function TuiDataListComponent_div_1_ng_container_1_Template(rf, ctx) {
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
function TuiDataListComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtemplate(1, TuiDataListComponent_div_1_ng_container_1_Template, 2, 1, "ng-container", 2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("polymorpheusOutlet", ctx_r1.emptyContent || ctx_r1.fallback());
  }
}
var TUI_DATA_LIST_ACCESSOR = new InjectionToken(ngDevMode ? "TUI_DATA_LIST_ACCESSOR" : "");
function tuiAsDataListAccessor(accessor) {
  return [tuiProvide(TUI_DATA_LIST_ACCESSOR, accessor), tuiAsAuxiliary(accessor)];
}
var TUI_DATA_LIST_HOST = new InjectionToken(ngDevMode ? "TUI_DATA_LIST_HOST" : "");
function tuiAsDataListHost(host) {
  return tuiProvide(TUI_DATA_LIST_HOST, host);
}
var TUI_OPTION_CONTENT = new InjectionToken(ngDevMode ? "TUI_OPTION_CONTENT" : "");
function tuiAsOptionContent(useValue) {
  return {
    provide: TUI_OPTION_CONTENT,
    useValue
  };
}
var TuiWithOptionContent = class _TuiWithOptionContent {
  constructor() {
    this.localContent = null;
    this.globalContent = inject(TUI_OPTION_CONTENT, {
      optional: true
    });
  }
  get content() {
    return this.globalContent ?? this.localContent;
  }
  static {
    this.ɵfac = function TuiWithOptionContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithOptionContent)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiWithOptionContent,
      contentQueries: function TuiWithOptionContent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TUI_OPTION_CONTENT, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.localContent = _t.first);
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithOptionContent, [{
    type: Directive,
    args: [{
      standalone: true
    }]
  }], null, {
    localContent: [{
      type: ContentChild,
      args: [TUI_OPTION_CONTENT, {
        descendants: true
      }]
    }]
  });
})();
var TuiOptionNew = class _TuiOptionNew {
  constructor() {
    this.vcr = inject(ViewContainerRef);
    this.isMobile = inject(TUI_IS_MOBILE);
    this.el = tuiInjectElement();
    this.dataList = inject(forwardRef(() => TuiDataListComponent), {
      optional: true
    });
    this.content = inject(TUI_OPTION_CONTENT, {
      optional: true
    });
    this.ref = this.content && createComponent(this.content, {
      environmentInjector: inject(EnvironmentInjector),
      elementInjector: inject(INJECTOR$1),
      hostElement: tuiInjectElement()
    });
    this.dropdown = inject(TuiDropdownDirective, {
      self: true,
      optional: true
    })?.ref;
    this.disabled = false;
    if (this.ref) {
      this.vcr.insert(this.ref.hostView);
      this.ref.changeDetectorRef.detectChanges();
    }
  }
  // Preventing focus loss upon focused option removal
  ngOnDestroy() {
    this.dataList?.handleFocusLossIfNecessary(this.el);
  }
  onMouseMove() {
    if (!this.isMobile && !tuiIsFocused(this.el) && this.dataList && this.el.closest("[tuiDataListDropdownManager]")) {
      this.el.focus({
        preventScroll: true
      });
    }
  }
  static {
    this.ɵfac = function TuiOptionNew_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptionNew)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiOptionNew,
      selectors: [["button", "tuiOption", "", "new", ""], ["a", "tuiOption", "", "new", ""], ["label", "tuiOption", "", "new", ""]],
      hostAttrs: ["type", "button", "role", "option"],
      hostVars: 3,
      hostBindings: function TuiOptionNew_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("mousemove.zoneless", function TuiOptionNew_mousemove_zoneless_HostBindingHandler() {
            return ctx.onMouseMove();
          });
        }
        if (rf & 2) {
          ɵɵattribute("disabled", ctx.disabled || null);
          ɵɵclassProp("_with-dropdown", ctx.dropdown == null ? null : ctx.dropdown());
        }
      },
      inputs: {
        disabled: "disabled"
      },
      features: [ɵɵHostDirectivesFeature([TuiWithIcons])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptionNew, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "button[tuiOption][new], a[tuiOption][new], label[tuiOption][new]",
      hostDirectives: [TuiWithIcons],
      host: {
        type: "button",
        role: "option",
        "[attr.disabled]": "disabled || null",
        "[class._with-dropdown]": "dropdown?.()",
        "(mousemove.zoneless)": "onMouseMove()"
      }
    }]
  }], function() {
    return [];
  }, {
    disabled: [{
      type: Input
    }]
  });
})();
var TuiOptionWithValue = class _TuiOptionWithValue {
  constructor() {
    this.host = inject(TUI_DATA_LIST_HOST, {
      optional: true
    });
    this.disabled = false;
    this.value = signal(void 0);
  }
  // TODO(v5): use `input.required<T>()` to remove `undefined` from `this.value()`
  set valueSetter(x) {
    this.value.set(x);
  }
  onClick(value = this.value()) {
    if (this.host?.handleOption && value !== void 0) {
      this.host.handleOption(value);
    }
  }
  static {
    this.ɵfac = function TuiOptionWithValue_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptionWithValue)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiOptionWithValue,
      selectors: [["button", "tuiOption", "", "value", "", "new", ""], ["a", "tuiOption", "", "value", "", "new", ""], ["label", "tuiOption", "", "value", "", "new", ""]],
      hostBindings: function TuiOptionWithValue_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click", function TuiOptionWithValue_click_HostBindingHandler() {
            return ctx.onClick();
          });
        }
      },
      inputs: {
        disabled: "disabled",
        valueSetter: [0, "value", "valueSetter"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptionWithValue, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "button[tuiOption][value][new], a[tuiOption][value][new], label[tuiOption][value][new]",
      host: {
        "(click)": "onClick()"
      }
    }]
  }], null, {
    disabled: [{
      type: Input
    }],
    valueSetter: [{
      type: Input,
      args: [{
        alias: "value",
        required: true
      }]
    }]
  });
})();
var TuiOption = class _TuiOption {
  constructor() {
    this.isMobile = inject(TUI_IS_MOBILE);
    this.el = tuiInjectElement();
    this.dataList = inject(forwardRef(() => TuiDataListComponent), {
      optional: true
    });
    this.host = inject(TUI_DATA_LIST_HOST, {
      optional: true
    });
    this.content = inject(TUI_OPTION_CONTENT, {
      optional: true
    });
    this.dropdown = inject(TuiDropdownDirective, {
      self: true,
      optional: true
    })?.ref;
    this.disabled = false;
  }
  // Preventing focus loss upon focused option removal
  ngOnDestroy() {
    this.dataList?.handleFocusLossIfNecessary(this.el);
  }
  onClick() {
    if (this.host?.handleOption && this.value !== void 0) {
      this.host.handleOption(this.value);
    }
  }
  onMouseMove() {
    if (!this.isMobile && !tuiIsFocused(this.el) && this.dataList && this.el.closest("[tuiDataListDropdownManager]")) {
      this.el.focus({
        preventScroll: true
      });
    }
  }
  static {
    this.ɵfac = function TuiOption_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOption)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiOption,
      selectors: [["button", "tuiOption", "", 3, "new", ""], ["a", "tuiOption", "", 3, "new", ""], ["label", "tuiOption", "", 3, "new", ""]],
      hostAttrs: ["type", "button", "role", "option"],
      hostVars: 3,
      hostBindings: function TuiOption_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("click", function TuiOption_click_HostBindingHandler() {
            return ctx.onClick();
          })("mousemove.zoneless", function TuiOption_mousemove_zoneless_HostBindingHandler() {
            return ctx.onMouseMove();
          });
        }
        if (rf & 2) {
          ɵɵattribute("disabled", ctx.disabled || null);
          ɵɵclassProp("_with-dropdown", ctx.dropdown == null ? null : ctx.dropdown());
        }
      },
      inputs: {
        disabled: "disabled",
        value: "value"
      },
      features: [ɵɵHostDirectivesFeature([TuiWithIcons])],
      ngContentSelectors: _c04,
      decls: 3,
      vars: 4,
      consts: [["t", ""], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiOption_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵtemplate(0, TuiOption_ng_container_0_Template, 2, 1, "ng-container", 1)(1, TuiOption_ng_template_1_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
        }
        if (rf & 2) {
          const t_r2 = ɵɵreference(2);
          ɵɵproperty("polymorpheusOutlet", ctx.content || t_r2)("polymorpheusOutletContext", ɵɵpureFunction1(2, _c12, t_r2));
        }
      },
      dependencies: [PolymorpheusOutlet],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOption, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "button[tuiOption]:not([new]), a[tuiOption]:not([new]), label[tuiOption]:not([new])",
      imports: [PolymorpheusOutlet],
      template: `
        <ng-container *polymorpheusOutlet="content || t as text; context: {$implicit: t}">
            {{ text }}
        </ng-container>
        <ng-template #t>
            <ng-content />
        </ng-template>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      hostDirectives: [TuiWithIcons],
      host: {
        type: "button",
        role: "option",
        "[attr.disabled]": "disabled || null",
        "[class._with-dropdown]": "dropdown?.()",
        "(click)": "onClick()",
        "(mousemove.zoneless)": "onMouseMove()"
      }
    }]
  }], null, {
    disabled: [{
      type: Input
    }],
    value: [{
      type: Input
    }]
  });
})();
function tuiInjectDataListSize() {
  const sizes = ["s", "m", "l"];
  const size = inject(TUI_DATA_LIST_HOST, {
    optional: true
  })?.size;
  return size && sizes.includes(size) ? size : "l";
}
var TuiDataListComponent = class _TuiDataListComponent {
  constructor() {
    this.legacyOptionsQuery = EMPTY_QUERY;
    this.optionsQuery = EMPTY_QUERY;
    this.ngZone = inject(NgZone);
    this.destroyRef = inject(DestroyRef);
    this.el = tuiInjectElement();
    this.cdr = inject(ChangeDetectorRef);
    this.contentReady$ = new ReplaySubject(1);
    this.fallback = toSignal(inject(TUI_NOTHING_FOUND_MESSAGE));
    this.empty = signal(false);
    this.size = tuiInjectDataListSize();
    this.options = toSignal(this.contentReady$.pipe(switchMap(() => combineLatest([tuiQueryListChanges(this.legacyOptionsQuery), tuiQueryListChanges(this.optionsQuery)])), map(([legacyOptions, options]) => [...legacyOptions.map(({
      value
    }) => value), ...options.map(({
      value
    }) => value())].filter(tuiIsPresent)), startWith([])), {
      requireSync: true
    });
  }
  onKeyDownArrow(current, step) {
    const {
      elements
    } = this;
    tuiMoveFocus(elements.indexOf(current), elements, step);
  }
  handleFocusLossIfNecessary(element = this.el) {
    if (tuiIsFocusedIn(element)) {
      this.origin?.focus({
        preventScroll: true
      });
    }
  }
  ngAfterContentInit() {
    this.contentReady$.next(true);
  }
  // TODO: Refactor to :has after Safari support bumped to 15
  ngAfterContentChecked() {
    timer(0).pipe(tuiZonefree(this.ngZone), tuiTakeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.empty.set(!this.elements.length);
      this.cdr.detectChanges();
    });
  }
  // TODO(v5): delete
  getOptions(includeDisabled = false) {
    return [...this.legacyOptionsQuery, ...this.optionsQuery].filter(({
      disabled
    }) => includeDisabled || !disabled).map(({
      value
    }) => isSignal(value) ? value() : value).filter(tuiIsPresent);
  }
  get role() {
    return this.el.parentElement?.closest('[role="menu"],[role="listbox"]') ? null : this.el.role;
  }
  onFocusIn(relatedTarget, currentTarget) {
    if (!currentTarget.contains(relatedTarget) && !this.origin) {
      this.origin = relatedTarget;
    }
  }
  get elements() {
    return Array.from(this.el.querySelectorAll("[tuiOption]"));
  }
  static {
    this.ɵfac = function TuiDataListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDataListComponent)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiDataListComponent,
      selectors: [["tui-data-list"]],
      contentQueries: function TuiDataListComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TuiOption, 5)(dirIndex, TuiOptionWithValue, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.legacyOptionsQuery = _t);
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.optionsQuery = _t);
        }
      },
      hostAttrs: ["role", "listbox", "tuiDataListV", "4.90.0"],
      hostVars: 2,
      hostBindings: function TuiDataListComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          ɵɵlistener("focusin", function TuiDataListComponent_focusin_HostBindingHandler($event) {
            return ctx.onFocusIn($event.relatedTarget, $event.currentTarget);
          })("mousedown.prevent", function TuiDataListComponent_mousedown_prevent_HostBindingHandler() {
            return 0;
          })("wheel.zoneless.passive", function TuiDataListComponent_wheel_zoneless_passive_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          })("mouseleave", function TuiDataListComponent_mouseleave_HostBindingHandler($event) {
            return ctx.handleFocusLossIfNecessary($event.target);
          })("keydown.tab", function TuiDataListComponent_keydown_tab_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          })("keydown.shift.tab", function TuiDataListComponent_keydown_shift_tab_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          })("keydown.arrowDown.prevent", function TuiDataListComponent_keydown_arrowDown_prevent_HostBindingHandler($event) {
            return ctx.onKeyDownArrow($event.target, 1);
          })("keydown.arrowUp.prevent", function TuiDataListComponent_keydown_arrowUp_prevent_HostBindingHandler($event) {
            return ctx.onKeyDownArrow($event.target, -1);
          });
        }
        if (rf & 2) {
          ɵɵattribute("role", ctx.role)("data-size", ctx.size);
        }
      },
      inputs: {
        emptyContent: "emptyContent",
        size: "size"
      },
      features: [ɵɵProvidersFeature([tuiAsDataListAccessor(_TuiDataListComponent), {
        provide: TUI_OPTION_CONTENT,
        useFactory: () => inject(TuiWithOptionContent, {
          optional: true
        })?.content ?? // TODO(v5): remove when all legacy controls are deleted
        inject(TUI_OPTION_CONTENT, {
          host: true,
          skipSelf: true,
          optional: true
        }) ?? inject(TUI_OPTION_CONTENT, {
          skipSelf: true,
          optional: true
        })
      }])],
      ngContentSelectors: _c04,
      decls: 2,
      vars: 1,
      consts: [["class", "t-empty", 4, "ngIf"], [1, "t-empty"], [4, "polymorpheusOutlet"]],
      template: function TuiDataListComponent_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵprojection(0);
          ɵɵtemplate(1, TuiDataListComponent_div_1_Template, 2, 1, "div", 0);
        }
        if (rf & 2) {
          ɵɵadvance();
          ɵɵproperty("ngIf", ctx.empty());
        }
      },
      dependencies: [NgIf, PolymorpheusOutlet],
      styles: ['[tuiDataListV="4.90.0"]{--tui-data-list-padding: .25rem;--tui-data-list-margin: .0625rem;display:flex;font:var(--tui-font-text-m);flex-direction:column;padding:calc(var(--tui-data-list-padding) - var(--tui-data-list-margin)) var(--tui-data-list-padding);color:var(--tui-text-tertiary)}[tuiDataListV="4.90.0"]:focus-within .t-trap{display:none}[tuiDataListV="4.90.0"]:focus-within [tuiOption]._with-dropdown:not(:focus){background-color:transparent}[tuiDataListV="4.90.0"][data-size=s]{--tui-data-list-margin: 0rem}[tuiDataListV="4.90.0"][data-size=s] [tuiOption][new]:not([tuiCell]){gap:.5rem}[tuiDataListV="4.90.0"][data-size=s]>.t-empty,[tuiDataListV="4.90.0"][data-size=s] [tuiOption]{--t-option-padding-inline: .375rem;font:var(--tui-font-text-s);line-height:1rem;min-block-size:1.75rem;padding-block-start:.3125rem;padding-block-end:.3125rem}[tuiDataListV="4.90.0"][data-size=s]>.t-empty:before,[tuiDataListV="4.90.0"][data-size=s] [tuiOption]:before{font-size:1rem}[tuiDataListV="4.90.0"][data-size=m] [tuiOption][new]:not([tuiCell]){gap:.75rem}[tuiDataListV="4.90.0"][data-size=m]>.t-empty,[tuiDataListV="4.90.0"][data-size=m] [tuiOption]{--t-option-padding-inline: .5rem;font:var(--tui-font-text-s);min-block-size:2.25rem;padding-block-start:.375rem;padding-block-end:.375rem}[tuiDataListV="4.90.0"][data-size=l]{--tui-data-list-padding: .375rem;--tui-data-list-margin: .125rem}[tuiDataListV="4.90.0"][data-size=l] [tuiOption][new]:not([tuiCell]){gap:1rem}[tuiDataListV="4.90.0"][data-size=l]>.t-empty,[tuiDataListV="4.90.0"][data-size=l] [tuiOption]{--t-option-padding-inline: .5rem;font:var(--tui-font-text-m);min-block-size:2.5rem;padding-block-start:.375rem;padding-block-end:.375rem}[tuiDataListV="4.90.0"]>.t-empty{display:flex;align-items:center;box-sizing:border-box;margin:var(--tui-data-list-margin) 0}[tuiDataListV="4.90.0"] [tuiOption]:not([new]){justify-content:space-between}[tuiDataListV="4.90.0"] [tuiOption]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:flex;align-items:center;box-sizing:border-box;margin:var(--tui-data-list-margin) 0;text-align:start;color:var(--tui-text-primary);border-radius:var(--tui-radius-s);outline:none;cursor:pointer;background-clip:padding-box}[tuiDataListV="4.90.0"] [tuiOption]:disabled{opacity:var(--tui-disabled-opacity);cursor:default}@media (hover: hover) and (pointer: fine){[tuiDataListV="4.90.0"] [tuiOption]:hover:not(:disabled){background-color:var(--tui-background-neutral-1)}}[tuiDataListV="4.90.0"] [tuiOption]:active:not(:disabled),[tuiDataListV="4.90.0"] [tuiOption]:focus-within,[tuiDataListV="4.90.0"] [tuiOption]._with-dropdown{background-color:var(--tui-background-neutral-1)}[tuiDataListV="4.90.0"] [tuiOption]:not([new]):before{margin-inline-end:.5rem}[tuiDataListV="4.90.0"] [tuiOption]:after{font-size:1rem;margin:0 -.625rem 0 auto;border-inline-start:.5rem solid;border-inline-end:.5rem solid}[tuiDataListV="4.90.0"]>.t-empty,[tuiDataListV="4.90.0"] [tuiOption]{padding-inline-start:var(--t-option-padding-inline);padding-inline-end:var(--t-option-padding-inline)}tui-opt-group{position:relative;display:flex;font:var(--tui-font-text-xs);font-weight:700;color:var(--tui-text-primary);flex-direction:column;line-height:1rem}[tuiDataListV="4.90.0"][data-size=l] tui-opt-group{font:var(--tui-font-text-l);font-weight:700}[tuiDataListV="4.90.0"][data-size=l] tui-opt-group:after{left:.5rem;right:.5rem}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group{font:var(--tui-font-text-m);font-weight:700}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group:before{padding-inline-start:.375rem;padding-inline-end:.375rem}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group:after{left:.375rem;right:.375rem}tui-opt-group:empty:before,tui-opt-group:empty:after{display:none}tui-opt-group:before{content:attr(data-label);padding:var(--tui-data-list-padding) .375rem;margin:var(--tui-data-list-margin) 0;white-space:normal;word-break:break-word}tui-opt-group:after{position:absolute;left:.5rem;right:.5rem;top:var(--tui-data-list-padding);block-size:1px;background:var(--tui-border-normal)}tui-opt-group:not(:empty)~tui-opt-group:before{padding-block-start:calc(.75rem + var(--tui-data-list-padding))}tui-opt-group:not(:empty)~tui-opt-group[data-label=""]:before,tui-opt-group:not(:empty)~tui-opt-group:not([data-label]):before{padding:var(--tui-data-list-padding) 0}tui-opt-group:not(:empty)~tui-opt-group:after{content:""}tui-opt-group[data-label=""]:before,tui-opt-group:not([data-label]):before{content:"";padding:0;margin:0}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDataListComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "tui-data-list",
      imports: [NgIf, PolymorpheusOutlet],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiAsDataListAccessor(TuiDataListComponent), {
        provide: TUI_OPTION_CONTENT,
        useFactory: () => inject(TuiWithOptionContent, {
          optional: true
        })?.content ?? // TODO(v5): remove when all legacy controls are deleted
        inject(TUI_OPTION_CONTENT, {
          host: true,
          skipSelf: true,
          optional: true
        }) ?? inject(TUI_OPTION_CONTENT, {
          skipSelf: true,
          optional: true
        })
      }],
      host: {
        role: "listbox",
        tuiDataListV: TUI_VERSION,
        "[attr.role]": "role",
        "[attr.data-size]": "size",
        "(focusin)": "onFocusIn($event.relatedTarget, $event.currentTarget)",
        "(mousedown.prevent)": "(0)",
        "(wheel.zoneless.passive)": "handleFocusLossIfNecessary()",
        "(mouseleave)": "handleFocusLossIfNecessary($event.target)",
        "(keydown.tab)": "handleFocusLossIfNecessary()",
        "(keydown.shift.tab)": "handleFocusLossIfNecessary()",
        "(keydown.arrowDown.prevent)": "onKeyDownArrow($event.target, 1)",
        "(keydown.arrowUp.prevent)": "onKeyDownArrow($event.target, -1)"
      },
      template: '<ng-content />\n<div\n    *ngIf="empty()"\n    class="t-empty"\n>\n    <ng-container *polymorpheusOutlet="emptyContent || fallback() as text">\n        {{ text }}\n    </ng-container>\n</div>\n',
      styles: ['[tuiDataListV="4.90.0"]{--tui-data-list-padding: .25rem;--tui-data-list-margin: .0625rem;display:flex;font:var(--tui-font-text-m);flex-direction:column;padding:calc(var(--tui-data-list-padding) - var(--tui-data-list-margin)) var(--tui-data-list-padding);color:var(--tui-text-tertiary)}[tuiDataListV="4.90.0"]:focus-within .t-trap{display:none}[tuiDataListV="4.90.0"]:focus-within [tuiOption]._with-dropdown:not(:focus){background-color:transparent}[tuiDataListV="4.90.0"][data-size=s]{--tui-data-list-margin: 0rem}[tuiDataListV="4.90.0"][data-size=s] [tuiOption][new]:not([tuiCell]){gap:.5rem}[tuiDataListV="4.90.0"][data-size=s]>.t-empty,[tuiDataListV="4.90.0"][data-size=s] [tuiOption]{--t-option-padding-inline: .375rem;font:var(--tui-font-text-s);line-height:1rem;min-block-size:1.75rem;padding-block-start:.3125rem;padding-block-end:.3125rem}[tuiDataListV="4.90.0"][data-size=s]>.t-empty:before,[tuiDataListV="4.90.0"][data-size=s] [tuiOption]:before{font-size:1rem}[tuiDataListV="4.90.0"][data-size=m] [tuiOption][new]:not([tuiCell]){gap:.75rem}[tuiDataListV="4.90.0"][data-size=m]>.t-empty,[tuiDataListV="4.90.0"][data-size=m] [tuiOption]{--t-option-padding-inline: .5rem;font:var(--tui-font-text-s);min-block-size:2.25rem;padding-block-start:.375rem;padding-block-end:.375rem}[tuiDataListV="4.90.0"][data-size=l]{--tui-data-list-padding: .375rem;--tui-data-list-margin: .125rem}[tuiDataListV="4.90.0"][data-size=l] [tuiOption][new]:not([tuiCell]){gap:1rem}[tuiDataListV="4.90.0"][data-size=l]>.t-empty,[tuiDataListV="4.90.0"][data-size=l] [tuiOption]{--t-option-padding-inline: .5rem;font:var(--tui-font-text-m);min-block-size:2.5rem;padding-block-start:.375rem;padding-block-end:.375rem}[tuiDataListV="4.90.0"]>.t-empty{display:flex;align-items:center;box-sizing:border-box;margin:var(--tui-data-list-margin) 0}[tuiDataListV="4.90.0"] [tuiOption]:not([new]){justify-content:space-between}[tuiDataListV="4.90.0"] [tuiOption]{-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:ease-in-out;display:flex;align-items:center;box-sizing:border-box;margin:var(--tui-data-list-margin) 0;text-align:start;color:var(--tui-text-primary);border-radius:var(--tui-radius-s);outline:none;cursor:pointer;background-clip:padding-box}[tuiDataListV="4.90.0"] [tuiOption]:disabled{opacity:var(--tui-disabled-opacity);cursor:default}@media (hover: hover) and (pointer: fine){[tuiDataListV="4.90.0"] [tuiOption]:hover:not(:disabled){background-color:var(--tui-background-neutral-1)}}[tuiDataListV="4.90.0"] [tuiOption]:active:not(:disabled),[tuiDataListV="4.90.0"] [tuiOption]:focus-within,[tuiDataListV="4.90.0"] [tuiOption]._with-dropdown{background-color:var(--tui-background-neutral-1)}[tuiDataListV="4.90.0"] [tuiOption]:not([new]):before{margin-inline-end:.5rem}[tuiDataListV="4.90.0"] [tuiOption]:after{font-size:1rem;margin:0 -.625rem 0 auto;border-inline-start:.5rem solid;border-inline-end:.5rem solid}[tuiDataListV="4.90.0"]>.t-empty,[tuiDataListV="4.90.0"] [tuiOption]{padding-inline-start:var(--t-option-padding-inline);padding-inline-end:var(--t-option-padding-inline)}tui-opt-group{position:relative;display:flex;font:var(--tui-font-text-xs);font-weight:700;color:var(--tui-text-primary);flex-direction:column;line-height:1rem}[tuiDataListV="4.90.0"][data-size=l] tui-opt-group{font:var(--tui-font-text-l);font-weight:700}[tuiDataListV="4.90.0"][data-size=l] tui-opt-group:after{left:.5rem;right:.5rem}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group{font:var(--tui-font-text-m);font-weight:700}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group:before{padding-inline-start:.375rem;padding-inline-end:.375rem}[tuiDataListV="4.90.0"][data-size=m] tui-opt-group:after{left:.375rem;right:.375rem}tui-opt-group:empty:before,tui-opt-group:empty:after{display:none}tui-opt-group:before{content:attr(data-label);padding:var(--tui-data-list-padding) .375rem;margin:var(--tui-data-list-margin) 0;white-space:normal;word-break:break-word}tui-opt-group:after{position:absolute;left:.5rem;right:.5rem;top:var(--tui-data-list-padding);block-size:1px;background:var(--tui-border-normal)}tui-opt-group:not(:empty)~tui-opt-group:before{padding-block-start:calc(.75rem + var(--tui-data-list-padding))}tui-opt-group:not(:empty)~tui-opt-group[data-label=""]:before,tui-opt-group:not(:empty)~tui-opt-group:not([data-label]):before{padding:var(--tui-data-list-padding) 0}tui-opt-group:not(:empty)~tui-opt-group:after{content:""}tui-opt-group[data-label=""]:before,tui-opt-group:not([data-label]):before{content:"";padding:0;margin:0}\n']
    }]
  }], null, {
    legacyOptionsQuery: [{
      type: ContentChildren,
      args: [forwardRef(() => TuiOption), {
        descendants: true
      }]
    }],
    optionsQuery: [{
      type: ContentChildren,
      args: [forwardRef(() => TuiOptionWithValue), {
        descendants: true
      }]
    }],
    emptyContent: [{
      type: Input
    }],
    size: [{
      type: Input
    }]
  });
})();
var TuiDataListDirective = class _TuiDataListDirective {
  static {
    this.ɵfac = function TuiDataListDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDataListDirective)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiDataListDirective,
      selectors: [["ng-template", "tuiDataList", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDataListDirective, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "ng-template[tuiDataList]"
    }]
  }], null, null);
})();
function tuiAsDataList(list) {
  return tuiProvide(TuiDataListDirective, list);
}
var TuiOptGroup = class _TuiOptGroup {
  static {
    this.ɵfac = function TuiOptGroup_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptGroup)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiOptGroup,
      selectors: [["tui-opt-group"]],
      hostAttrs: ["role", "group"],
      hostVars: 1,
      hostBindings: function TuiOptGroup_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("data-label", ctx.label);
        }
      },
      inputs: {
        label: "label"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptGroup, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "tui-opt-group",
      host: {
        role: "group",
        "[attr.data-label]": "label"
      }
    }]
  }], null, {
    label: [{
      type: Input
    }]
  });
})();
var TuiDataList = [TuiDataListComponent, TuiDataListDirective, TuiOption, TuiOptionNew, TuiOptionWithValue, TuiOptGroup];

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-label.mjs
var TuiLabelStyles = class _TuiLabelStyles {
  static {
    this.ɵfac = function TuiLabelStyles_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLabelStyles)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _TuiLabelStyles,
      selectors: [["ng-component"]],
      exportAs: ["tui-label-4.90.0"],
      decls: 0,
      vars: 0,
      template: function TuiLabelStyles_Template(rf, ctx) {
      },
      styles: ['[tuiLabelV="4.90.0"]{display:flex;gap:.25rem;flex-direction:column;font:var(--tui-font-text-s);color:var(--tui-text-primary)}[tuiLabelV="4.90.0"]:not([data-orientation=vertical]){flex-direction:row;inline-size:-webkit-fit-content;inline-size:-moz-fit-content;inline-size:fit-content;font:var(--tui-font-text-m)}[tuiLabelV="4.90.0"]:has(tui-textfield),[tuiLabelV="4.90.0"]:has(tui-primitive-textfield),[tuiLabelV="4.90.0"]:has(tui-textarea){flex-direction:column!important;inline-size:auto!important;font:var(--tui-font-text-s)!important}[tuiLabelV="4.90.0"] input[type=checkbox],[tuiLabelV="4.90.0"] input[type=radio]{margin-inline-end:.5rem}[tuiLabelV="4.90.0"] input[type=checkbox][data-size=s],[tuiLabelV="4.90.0"] input[type=radio][data-size=s]{margin-inline-end:.25rem;margin-block-start:.125rem}[tuiLabelV="4.90.0"] small{font:var(--tui-font-text-s)}[tuiLabelV="4.90.0"] [tuiTitle]{margin-block-start:.125rem}[tuiLabelV="4.90.0"] [tuiCell] [tuiTitle]{margin-block-start:0}[tuiLabelV="4.90.0"] [tuiSubtitle]{color:var(--tui-text-secondary)}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLabelStyles, [{
    type: Component,
    args: [{
      standalone: true,
      template: "",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: `tui-label-${TUI_VERSION}`,
      styles: ['[tuiLabelV="4.90.0"]{display:flex;gap:.25rem;flex-direction:column;font:var(--tui-font-text-s);color:var(--tui-text-primary)}[tuiLabelV="4.90.0"]:not([data-orientation=vertical]){flex-direction:row;inline-size:-webkit-fit-content;inline-size:-moz-fit-content;inline-size:fit-content;font:var(--tui-font-text-m)}[tuiLabelV="4.90.0"]:has(tui-textfield),[tuiLabelV="4.90.0"]:has(tui-primitive-textfield),[tuiLabelV="4.90.0"]:has(tui-textarea){flex-direction:column!important;inline-size:auto!important;font:var(--tui-font-text-s)!important}[tuiLabelV="4.90.0"] input[type=checkbox],[tuiLabelV="4.90.0"] input[type=radio]{margin-inline-end:.5rem}[tuiLabelV="4.90.0"] input[type=checkbox][data-size=s],[tuiLabelV="4.90.0"] input[type=radio][data-size=s]{margin-inline-end:.25rem;margin-block-start:.125rem}[tuiLabelV="4.90.0"] small{font:var(--tui-font-text-s)}[tuiLabelV="4.90.0"] [tuiTitle]{margin-block-start:.125rem}[tuiLabelV="4.90.0"] [tuiCell] [tuiTitle]{margin-block-start:0}[tuiLabelV="4.90.0"] [tuiSubtitle]{color:var(--tui-text-secondary)}\n']
    }]
  }], null, null);
})();
var TuiLabel = class _TuiLabel {
  constructor() {
    this.el = tuiInjectElement();
    this.nothing = tuiWithStyles(TuiLabelStyles);
    this.parent = inject(forwardRef(() => TUI_DATA_LIST_HOST), {
      optional: true
    });
  }
  static {
    this.ɵfac = function TuiLabel_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLabel)();
    };
  }
  static {
    this.ɵdir = ɵɵdefineDirective({
      type: _TuiLabel,
      selectors: [["label", "tuiLabel", ""]],
      contentQueries: function TuiLabel_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          ɵɵcontentQuery(dirIndex, TUI_DATA_LIST_HOST, 5);
        }
        if (rf & 2) {
          let _t;
          ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.textfield = _t.first);
        }
      },
      hostAttrs: ["tuiLabelV", "4.90.0"],
      hostVars: 2,
      hostBindings: function TuiLabel_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵattribute("for", ctx.el.htmlFor || (ctx.parent == null ? null : ctx.parent.id))("data-orientation", ctx.textfield ? "vertical" : "horizontal");
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLabel, [{
    type: Directive,
    args: [{
      standalone: true,
      selector: "label[tuiLabel]",
      host: {
        tuiLabelV: TUI_VERSION,
        "[attr.for]": "el.htmlFor || parent?.id",
        "[attr.data-orientation]": 'textfield ? "vertical" : "horizontal"'
      }
    }]
  }], null, {
    textfield: [{
      type: ContentChild,
      args: [forwardRef(() => TUI_DATA_LIST_HOST)]
    }]
  });
})();

export {
  tuiClamp,
  tuiInRange,
  tuiQuantize,
  tuiRound,
  tuiIsSafeToRound,
  tuiSum,
  tuiToInt,
  TUI_ALLOW_SIGNAL_WRITES,
  EMPTY_QUERY,
  EMPTY_ARRAY,
  EMPTY_FUNCTION,
  EMPTY_CLIENT_RECT,
  TUI_FALSE_HANDLER,
  TUI_TRUE_HANDLER,
  TUI_DEFAULT_MATCHER,
  TUI_STRICT_MATCHER,
  TUI_DEFAULT_IDENTITY_MATCHER,
  svgNodeFilter,
  CHAR_NO_BREAK_SPACE,
  CHAR_EN_DASH,
  CHAR_HYPHEN,
  CHAR_MINUS,
  CHAR_PLUS,
  TUI_VERSION,
  takeUntilDestroyed,
  toObservable,
  toSignal,
  tuiArrayShallowEquals,
  tuiArrayToggle,
  changeDateSeparator,
  tuiCreateToken,
  tuiCreateTokenFromFactory,
  tuiIsString,
  tuiDirectiveBinding,
  tuiDistanceBetweenTouches,
  tuiGetOriginalArrayFromQueryList,
  tuiIsNumber,
  tuiIsPresent,
  tuiNullableSame,
  tuiProvide,
  tuiProvideOptions,
  tuiPure,
  tuiPx,
  tuiSanitizeText,
  tuiWithStyles,
  TuiAccessor,
  TuiPositionAccessor,
  TuiRectAccessor,
  tuiProvideAccessor,
  tuiFallbackAccessor,
  tuiPositionAccessorFor,
  tuiRectAccessorFor,
  tuiAsPositionAccessor,
  tuiAsRectAccessor,
  TuiVehicle,
  tuiAsVehicle,
  TuiDriver,
  tuiAsDriver,
  TuiDriverDirective,
  coerceBooleanProperty,
  tuiContainsOrAfter,
  tuiIsElement,
  tuiIsHTMLElement,
  tuiIsInputEvent,
  tuiGetActualTarget,
  tuiGetClipboardDataText,
  tuiGetSelectedText,
  tuiInjectElement,
  tuiIsCurrentTarget,
  tuiPointToClientRect,
  tuiValue,
  WA_MUTATION_OBSERVER_INIT,
  WaMutationObserver,
  WaMutationObserverService,
  TuiAnimated,
  TuiAnimatedParent,
  tuiIsSafari,
  tuiCreateOptions,
  tuiCloseWatcher,
  tuiControlValue,
  tuiTypedFromEvent,
  tuiDragAndDropFrom,
  tuiPreventDefault,
  tuiIfMap,
  tuiQueryListChanges,
  tuiTakeUntilDestroyed,
  tuiWatch,
  tuiZonefull,
  tuiZonefree,
  tuiZoneOptimized,
  tuiZonefreeScheduler,
  tuiGetFocused,
  tuiFocusedIn,
  tuiGetClosestFocusable,
  tuiIsFocused,
  tuiIsFocusedIn,
  tuiMoveFocus,
  DAYS_IN_WEEK,
  MIN_YEAR,
  MAX_YEAR,
  RANGE_SEPARATOR_CHAR,
  HOURS_IN_DAY,
  MILLISECONDS_IN_DAY,
  DATE_FILLER_LENGTH,
  DATE_RANGE_FILLER_LENGTH,
  TuiYear,
  TuiMonth,
  TuiDay,
  TuiMonthRange,
  TuiDayRange,
  TUI_FIRST_DAY,
  TUI_LAST_DAY,
  TUI_LAST_DISPLAYED_DAY,
  TuiTime,
  TUI_REDUCED_MOTION,
  TUI_ANIMATIONS_SPEED,
  TUI_ASSETS_PATH,
  tuiAssetsPathProvider,
  TUI_AUXILIARY,
  tuiAsAuxiliary,
  TUI_COMMON_ICONS,
  tuiCommonIconsProvider,
  TUI_DARK_MODE_DEFAULT_KEY,
  TUI_DARK_MODE_KEY,
  TUI_DARK_MODE,
  TUI_DEFAULT_DATE_FORMAT,
  TUI_DATE_FORMAT,
  tuiDateFormatProvider,
  TUI_DAY_TYPE_HANDLER,
  TUI_FIRST_DAY_OF_WEEK,
  TUI_MONTHS,
  TUI_CLOSE_WORD,
  TUI_BACK_WORD,
  TUI_CLEAR_WORD,
  TUI_NOTHING_FOUND_MESSAGE,
  TUI_DEFAULT_ERROR_MESSAGE,
  TUI_SPIN_TEXTS,
  TUI_SHORT_WEEK_DAYS,
  TUI_ICON_START,
  TUI_ICON_END,
  TUI_ICON_REGISTRY,
  TUI_ICON_STARTS,
  tuiIconsProvider,
  TUI_ICON_RESOLVER,
  TUI_ICON_START_RESOLVER,
  tuiGetIconMode,
  tuiInjectIconResolver,
  tuiIconResolverProvider,
  TUI_MEDIA,
  TUI_DEFAULT_NUMBER_FORMAT,
  TUI_NUMBER_FORMAT,
  tuiNumberFormatProvider,
  TUI_SCROLL_REF,
  TUI_SELECTION_STREAM,
  TUI_SPIN_ICONS,
  TUI_THEME,
  TUI_VIEWPORT,
  tuiAsViewport,
  TuiIcons,
  TuiWithIcons,
  POLYMORPHEUS_CONTEXT,
  injectContext,
  PolymorpheusComponent,
  PolymorpheusTemplate,
  PolymorpheusOutlet,
  TUI_IS_MOBILE,
  TUI_IS_IOS,
  TUI_IS_ANDROID,
  TUI_PLATFORM,
  tuiFallbackValueProvider,
  TuiIdService,
  tuiInjectId,
  TuiPopoverService,
  tuiAsPopover,
  TuiScrollService,
  TuiScrollbarService,
  TuiScrollbarDirective,
  TUI_DEFAULT_SCROLLBAR_OPTIONS,
  TUI_SCROLLBAR_OPTIONS,
  tuiScrollbarOptionsProvider,
  TuiScrollControls,
  TUI_SCROLL_INTO_VIEW,
  TUI_SCROLLABLE,
  TuiScrollbar,
  TuiScrollIntoView,
  SCROLL_REF_SELECTOR,
  TuiScrollRef,
  TuiScrollable,
  TuiActiveZone,
  TuiBreakpointService,
  TuiDarkThemeService,
  TuiFormatDateService,
  TuiPositionService,
  TuiVisualViewportService,
  tuiCheckFixedPosition,
  tuiGetViewportHeight,
  tuiGetViewportWidth,
  tuiGetWordRange,
  tuiNumberToStringWithoutExp,
  tuiGetFractionPartPadded,
  tuiFormatNumber,
  tuiStringHashToHsl,
  TuiFontSize,
  TUI_FONT_OFFSET,
  tuiEnableFontScaling,
  tuiIsEditingKey,
  tuiIsObscured,
  tuiOverrideOptions,
  tuiSizeBigger,
  TUI_ANIMATIONS_DEFAULT_DURATION,
  tuiToAnimationOptions,
  tuiGetDuration,
  TuiValueTransformer,
  tuiValueTransformerFrom,
  TuiNonNullableValueTransformer,
  TUI_IDENTITY_VALUE_TRANSFORMER,
  TuiControl,
  tuiAsControl,
  TuiPortals,
  TuiPortalService,
  tuiAsPortal,
  TuiValidationError,
  TuiDropdownDriver,
  TuiDropdownDriverDirective,
  TUI_DROPDOWN_COMPONENT,
  TUI_DROPDOWN_CONTEXT,
  TUI_DROPDOWN_HOST,
  TuiDropdownService,
  TUI_DROPDOWN_DEFAULT_OPTIONS,
  TUI_DROPDOWN_OPTIONS,
  tuiDropdownOptionsProvider,
  TuiDropdownOptionsDirective,
  TuiDropdownPosition,
  TuiDropdownA11y,
  TuiDropdownDirective,
  TuiDropdownComponent,
  TuiDropdownContext,
  TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS,
  TUI_DROPDOWN_HOVER_OPTIONS,
  tuiDropdownHoverOptionsProvider,
  TuiDropdownOpen,
  TuiDropdownHover,
  TuiDropdownManual,
  TuiDropdownOpenLegacy,
  TuiDropdownPortal,
  TuiDropdownPositionSided,
  TuiDropdownSelection,
  TuiDropdown,
  tuiDropdown,
  tuiDropdownEnabled,
  tuiDropdownOpen,
  TuiDropdownFixed,
  TuiDropdownAuto,
  TuiDropdowns,
  TuiWithDropdownOpen,
  TUI_DATA_LIST_ACCESSOR,
  tuiAsDataListAccessor,
  TUI_DATA_LIST_HOST,
  tuiAsDataListHost,
  TUI_OPTION_CONTENT,
  tuiAsOptionContent,
  TuiWithOptionContent,
  TuiOptionNew,
  TuiOptionWithValue,
  TuiOption,
  tuiInjectDataListSize,
  TuiDataListComponent,
  TuiDataListDirective,
  tuiAsDataList,
  TuiOptGroup,
  TuiDataList,
  TuiLabel
};
//# sourceMappingURL=chunk-LOZSPQWC.js.map
