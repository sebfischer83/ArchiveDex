import {
  TuiScrollControls,
  TuiScrollRef,
  TuiScrollbar
} from "./chunk-X5EJLYJL.js";
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
  tuiAsDriver,
  tuiAsPositionAccessor,
  tuiAsRectAccessor,
  tuiAsVehicle,
  tuiFallbackAccessor,
  tuiPositionAccessorFor,
  tuiRectAccessorFor
} from "./chunk-L767LOQY.js";
import {
  TUI_FONT_OFFSET,
  tuiFocusedIn,
  tuiGetClosestFocusable,
  tuiGetFocused,
  tuiIsEditingKey,
  tuiIsFocusable,
  tuiIsFocused,
  tuiIsFocusedIn,
  tuiMoveFocus,
  tuiOverrideOptions
} from "./chunk-ALDSJSHZ.js";
import {
  AsyncPipe,
  BehaviorSubject,
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_SPACE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DOCUMENT,
  DestroyRef,
  Directive,
  EMPTY,
  EMPTY_CLIENT_RECT,
  ElementRef,
  EnvironmentInjector,
  INJECTOR$1,
  Injectable,
  InjectionToken,
  NG_VALIDATORS,
  NgControl,
  NgZone,
  Observable,
  Optional,
  PLATFORM_ID,
  Pipe,
  PolymorpheusComponent,
  PolymorpheusOutlet,
  PolymorpheusTemplate,
  Self,
  SkipSelf,
  Subject,
  TUI_AUXILIARY,
  TUI_BUTTON_OPTIONS,
  TUI_CLEAR_WORD,
  TUI_COMMON_ICONS,
  TUI_DARK_MODE,
  TUI_DEFAULT_IDENTITY_MATCHER,
  TUI_DEFAULT_MATCHER,
  TUI_FALSE_HANDLER,
  TUI_ICON_START,
  TUI_NOTHING_FOUND_MESSAGE,
  TUI_SELECTION_STREAM,
  TUI_STRICT_MATCHER,
  TUI_TEXTFIELD_VALUE,
  TUI_TRUE_HANDLER,
  TUI_VERSION,
  TUI_VIEWPORT,
  TemplateRef,
  TuiAnimated,
  TuiAppearance,
  TuiButton,
  TuiPopupService,
  TuiWithIcons,
  ViewContainerRef,
  ViewEncapsulation,
  WA_ANIMATION_FRAME,
  WA_IS_ANDROID,
  WA_IS_MOBILE,
  WA_IS_TOUCH,
  WA_WINDOW,
  coerceArray,
  combineLatest,
  computed,
  contentChild,
  contentChildren,
  createComponent,
  delay,
  distinctUntilChanged,
  effect,
  filter,
  forwardRef,
  fromEvent,
  inject,
  injectContext,
  input,
  isPlatformBrowser,
  map,
  merge,
  model,
  of,
  outputFromObservable,
  setClassMetadata,
  share,
  signal,
  startWith,
  svgNodeFilter,
  switchMap,
  takeUntil,
  takeUntilDestroyed,
  takeWhile,
  tap,
  throttleTime,
  timer,
  toObservable,
  tuiAppearance,
  tuiAppearanceFocus,
  tuiAppearanceMode,
  tuiAppearanceState,
  tuiArrayToggle,
  tuiAsAuxiliary,
  tuiButtonOptionsProvider,
  tuiClamp,
  tuiCloseWatcher,
  tuiCreateOptions,
  tuiGenerateId,
  tuiGetActualTarget,
  tuiGetElementObscures,
  tuiIfMap,
  tuiInjectElement,
  tuiIsElement,
  tuiIsElementEditable,
  tuiIsFlat,
  tuiIsHTMLElement,
  tuiIsPresent,
  tuiIsString,
  tuiIsTextNode,
  tuiIsTextfield,
  tuiPointToClientRect,
  tuiProvide,
  tuiPx,
  tuiSetSignal,
  tuiStopPropagation,
  tuiTakeUntilDestroyed,
  tuiTypedFromEvent,
  tuiValue,
  tuiWithStyles,
  tuiZoneOptimized,
  tuiZonefree,
  tuiZonefreeScheduler,
  untracked,
  viewChild,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefinePipe,
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
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuerySignal
} from "./chunk-2IN24IS5.js";

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-cell.mjs
var [TUI_CELL_OPTIONS, tuiCellOptionsProvider] = tuiCreateOptions({
  height: "normal",
  size: "l"
});
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
      exportAs: ["tui-cell-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiCell]:where(*[data-tui-version="5.16.0"]){--t-pad: .125rem 1rem;--t-radius: var(--tui-radius-s);transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:flex;align-items:center;text-align:start;box-sizing:content-box;isolation:isolate;color:var(--tui-text-primary);padding:var(--t-pad);min-block-size:var(--t-block-size);border-radius:var(--t-radius)}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(button,label):not(:disabled):active{background:var(--tui-background-neutral-1)}[tuiCell]:where(*[data-tui-version="5.16.0"]):disabled,[tuiCell]:where(*[data-tui-version="5.16.0"])[data-state=disabled]{opacity:initial;pointer-events:none}[tuiCell]:where(*[data-tui-version="5.16.0"]):disabled>*:not([tuiTooltip]),[tuiCell]:where(*[data-tui-version="5.16.0"])[data-state=disabled]>*:not([tuiTooltip]){opacity:var(--tui-disabled-opacity)}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(label):has(input:disabled){opacity:initial;pointer-events:none}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(label):has(input:disabled)>*:not([tuiTooltip]){opacity:var(--tui-disabled-opacity)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiAccessories]{position:relative;display:flex;max-block-size:var(--t-block-size);align-items:center;align-self:stretch;margin-inline-start:auto}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions]{position:absolute;z-index:1;inset-inline-end:0;padding-inline-end:inherit;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions]~*{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] button,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] a{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);opacity:0}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] button:focus-visible,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] a:focus-visible{opacity:1}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{display:flex;align-items:center;gap:.25rem;color:var(--tui-text-secondary)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{flex:3 7 30%;align-items:normal;text-align:start;gap:.25rem .5rem}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]{flex-direction:row;justify-content:space-between}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:first-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:first-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:last-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:last-child{flex:3 7 30%;max-inline-size:max-content;white-space:nowrap}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:last-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:last-child{flex:7 3 70%}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]{justify-content:space-between}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]~[tuiTitle]{flex:7 3 70%;max-inline-size:max-content;margin-inline-start:auto;text-align:end;align-items:flex-end}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]~[tuiTitle][tuiFade]{align-items:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"]) tui-badge-notification[data-size=xs]{position:absolute;top:50%;transform:translateY(-50%);inset-inline-start:.375rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-block-size: calc(var(--tui-height-s) - .125rem);--t-pad: .1875rem 1rem;gap:.5rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s][data-height=spacious]{--t-pad: .4375rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s][data-height=compact]{--t-block-size: calc(var(--tui-height-s) - .25rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiTitle]{max-block-size:100%;font:var(--tui-typography-ui-s);gap:0}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiSubtitle]{font:var(--tui-typography-ui-2xs)}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiAvatar]{--t-size: 1.5rem;--t-radius: var(--tui-radius-m);font:var(--tui-typography-body-m);font-size:.5625rem;margin:.1875rem 0}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-block-size: calc(var(--tui-height-m) - .75rem);--t-pad: .375rem 1rem;gap:.5rem .75rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m][data-height=spacious]{--t-pad: 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m][data-height=compact]{--t-block-size: calc(var(--tui-height-m) - .5rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiTitle]{font:var(--tui-typography-ui-s);gap:.0625rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiSubtitle]{font:var(--tui-typography-ui-xs)}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiAvatar]{--t-size: 2rem;--t-radius: var(--tui-radius-m);align-self:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l]{--t-block-size: calc(var(--tui-height-l) - 1rem);--t-pad: .5rem 1rem;--t-radius: var(--tui-radius-l);gap:.5rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l][data-height=spacious]{--t-pad: 1.25rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l][data-height=compact]{--t-block-size: calc(var(--tui-height-l) - 1rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l] [tuiAvatar]{--t-size: 2.5rem;font:var(--tui-typography-body-m);font-weight:700;align-self:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions]~*{opacity:0}[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] button,[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] a,[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] label{opacity:1}[tuiCell]:where(*[data-tui-version="5.16.0"]):focus-visible{outline:.125rem solid var(--tui-border-focus);outline-offset:-.125rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellStretch]{inline-size:100%;margin-inline:-1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]{display:grid;grid-auto-flow:column;grid-auto-columns:fit-content(100%);grid-template-columns:auto 1fr}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]:has(>[tuiTitle]:first-child){grid-template-columns:1fr}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]>*{grid-row:1}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiAccessories]{grid-row:2}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiTitle] [tuiTitle],[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiTitle] [tuiSubtitle]{display:grid}@media(hover:hover)and (pointer:fine){a[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]),button[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]),label[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]){background:var(--tui-background-neutral-1);cursor:pointer}label[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:has(input:disabled)){background:var(--tui-background-neutral-1);cursor:pointer}}\n'],
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
      exportAs: `tui-cell-${TUI_VERSION}`,
      styles: ['[tuiCell]:where(*[data-tui-version="5.16.0"]){--t-pad: .125rem 1rem;--t-radius: var(--tui-radius-s);transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:flex;align-items:center;text-align:start;box-sizing:content-box;isolation:isolate;color:var(--tui-text-primary);padding:var(--t-pad);min-block-size:var(--t-block-size);border-radius:var(--t-radius)}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(button,label):not(:disabled):active{background:var(--tui-background-neutral-1)}[tuiCell]:where(*[data-tui-version="5.16.0"]):disabled,[tuiCell]:where(*[data-tui-version="5.16.0"])[data-state=disabled]{opacity:initial;pointer-events:none}[tuiCell]:where(*[data-tui-version="5.16.0"]):disabled>*:not([tuiTooltip]),[tuiCell]:where(*[data-tui-version="5.16.0"])[data-state=disabled]>*:not([tuiTooltip]){opacity:var(--tui-disabled-opacity)}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(label):has(input:disabled){opacity:initial;pointer-events:none}[tuiCell]:where(*[data-tui-version="5.16.0"]):is(label):has(input:disabled)>*:not([tuiTooltip]){opacity:var(--tui-disabled-opacity)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiAccessories]{position:relative;display:flex;max-block-size:var(--t-block-size);align-items:center;align-self:stretch;margin-inline-start:auto}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions]{position:absolute;z-index:1;inset-inline-end:0;padding-inline-end:inherit;--t-group-mask: none;--t-group-mask-end: none;--t-group-mask-start: none}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions]~*{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] button,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] a{transition-property:opacity;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);opacity:0}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] button:focus-visible,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiCellActions][tuiCellActions] a:focus-visible{opacity:1}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{display:flex;align-items:center;gap:.25rem;color:var(--tui-text-secondary)}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]{flex:3 7 30%;align-items:normal;text-align:start;gap:.25rem .5rem}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]{flex-direction:row;justify-content:space-between}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:first-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:first-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:last-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:last-child{flex:3 7 30%;max-inline-size:max-content;white-space:nowrap}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]>[tuiFade]:last-child,[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]>[tuiFade]:last-child{flex:7 3 70%}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle] [tuiTitle]~[tuiSubtitle]{justify-content:space-between}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]~[tuiTitle]{flex:7 3 70%;max-inline-size:max-content;margin-inline-start:auto;text-align:end;align-items:flex-end}[tuiCell]:where(*[data-tui-version="5.16.0"]) [tuiTitle]~[tuiTitle][tuiFade]{align-items:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"]) tui-badge-notification[data-size=xs]{position:absolute;top:50%;transform:translateY(-50%);inset-inline-start:.375rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-block-size: calc(var(--tui-height-s) - .125rem);--t-pad: .1875rem 1rem;gap:.5rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s][data-height=spacious]{--t-pad: .4375rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s][data-height=compact]{--t-block-size: calc(var(--tui-height-s) - .25rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiTitle]{max-block-size:100%;font:var(--tui-typography-ui-s);gap:0}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiSubtitle]{font:var(--tui-typography-ui-2xs)}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiAvatar]{--t-size: 1.5rem;--t-radius: var(--tui-radius-m);font:var(--tui-typography-body-m);font-size:.5625rem;margin:.1875rem 0}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-block-size: calc(var(--tui-height-m) - .75rem);--t-pad: .375rem 1rem;gap:.5rem .75rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m][data-height=spacious]{--t-pad: 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m][data-height=compact]{--t-block-size: calc(var(--tui-height-m) - .5rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiTitle]{font:var(--tui-typography-ui-s);gap:.0625rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiSubtitle]{font:var(--tui-typography-ui-xs)}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiAvatar]{--t-size: 2rem;--t-radius: var(--tui-radius-m);align-self:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l]{--t-block-size: calc(var(--tui-height-l) - 1rem);--t-pad: .5rem 1rem;--t-radius: var(--tui-radius-l);gap:.5rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l][data-height=spacious]{--t-pad: 1.25rem 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l][data-height=compact]{--t-block-size: calc(var(--tui-height-l) - 1rem);--t-pad: 0 1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[data-size=l] [tuiAvatar]{--t-size: 2.5rem;font:var(--tui-typography-body-m);font-weight:700;align-self:flex-start}[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions]~*{opacity:0}[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] button,[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] a,[tuiCell]:where(*[data-tui-version="5.16.0"]):hover [tuiCellActions] label{opacity:1}[tuiCell]:where(*[data-tui-version="5.16.0"]):focus-visible{outline:.125rem solid var(--tui-border-focus);outline-offset:-.125rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellStretch]{inline-size:100%;margin-inline:-1rem}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]{display:grid;grid-auto-flow:column;grid-auto-columns:fit-content(100%);grid-template-columns:auto 1fr}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]:has(>[tuiTitle]:first-child){grid-template-columns:1fr}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]>*{grid-row:1}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiAccessories]{grid-row:2}[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiTitle] [tuiTitle],[tuiCell]:where(*[data-tui-version="5.16.0"])[tuiCellResponsive]._rearranged [tuiTitle] [tuiSubtitle]{display:grid}@media(hover:hover)and (pointer:fine){a[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]),button[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]),label[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:disabled,[data-state=disabled]){background:var(--tui-background-neutral-1);cursor:pointer}label[tuiCell]:where(*[data-tui-version="5.16.0"]):hover:not(:has(input:disabled)){background:var(--tui-background-neutral-1);cursor:pointer}}\n']
    }]
  }], null, null);
})();
var TuiCell = class _TuiCell {
  constructor() {
    this.nothing = tuiWithStyles(Styles);
    this.options = inject(TUI_CELL_OPTIONS);
    this.size = input(this.options.size, {
      alias: "tuiCell"
    });
    this.height = input(this.options.height, {
      alias: "tuiCellHeight"
    });
  }
  static {
    this.\u0275fac = function TuiCell_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCell)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCell,
      selectors: [["", "tuiCell", "", 5, "ng-template"]],
      hostAttrs: ["data-tui-version", "5.16.0", "tuiCell", ""],
      hostVars: 2,
      hostBindings: function TuiCell_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-height", ctx.height())("data-size", ctx.size() || ctx.options.size || "l");
        }
      },
      inputs: {
        size: [1, "tuiCell", "size"],
        height: [1, "tuiCellHeight", "height"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiButtonOptionsProvider({
        size: "s"
      })])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCell, [{
    type: Directive,
    args: [{
      selector: "[tuiCell]:not(ng-template)",
      providers: [tuiButtonOptionsProvider({
        size: "s"
      })],
      host: {
        "data-tui-version": TUI_VERSION,
        tuiCell: "",
        "[attr.data-height]": "height()",
        "[attr.data-size]": 'size() || options.size || "l"'
      }
    }]
  }], null, null);
})();
var TuiCellResponsive = class _TuiCellResponsive {
  constructor() {
    this.offset = inject(TUI_FONT_OFFSET);
  }
  static {
    this.\u0275fac = function TuiCellResponsive_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCellResponsive)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCellResponsive,
      selectors: [["", "tuiCell", "", "tuiCellResponsive", ""]],
      hostVars: 2,
      hostBindings: function TuiCellResponsive_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("_rearranged", ctx.offset() > 10);
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCellResponsive, [{
    type: Directive,
    args: [{
      selector: "[tuiCell][tuiCellResponsive]",
      host: {
        "[class._rearranged]": "offset() > 10"
      }
    }]
  }], null, null);
})();
var TuiCellStretch = class _TuiCellStretch {
  constructor() {
    this.isMobile = inject(WA_IS_MOBILE);
  }
  static {
    this.\u0275fac = function TuiCellStretch_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiCellStretch)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiCellStretch,
      selectors: [["", "tuiCell", "", "tuiCellStretch", ""]],
      hostVars: 2,
      hostBindings: function TuiCellStretch_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275styleProp("border-radius", ctx.isMobile ? 0 : null);
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiCellStretch, [{
    type: Directive,
    args: [{
      selector: "[tuiCell][tuiCellStretch]",
      host: {
        "[style.border-radius]": "isMobile ? 0 : null"
      }
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

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-obscured.mjs
var TuiObscuredService = class _TuiObscuredService extends Observable {
  constructor() {
    super((subscriber) => this.obscured$.subscribe(subscriber));
    this.el = tuiInjectElement();
    this.obscured$ = inject(WA_ANIMATION_FRAME).pipe(throttleTime(100, tuiZonefreeScheduler()), map(() => tuiGetElementObscures(this.el)), startWith(null), distinctUntilChanged(), tuiZoneOptimized());
  }
  static {
    this.\u0275fac = function TuiObscuredService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiObscuredService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _TuiObscuredService,
      factory: _TuiObscuredService.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiObscuredService, [{
    type: Injectable
  }], () => [], null);
})();
var TuiObscured = class _TuiObscured {
  constructor() {
    this.activeZone = inject(TuiActiveZone, {
      optional: true
    });
    this.obscured$ = inject(TuiObscuredService, {
      self: true
    }).pipe(map((by) => !!by?.every((el) => !this.activeZone?.contains(el))));
    this.tuiObscuredEnabled = input();
    this.tuiObscured$ = toObservable(this.tuiObscuredEnabled).pipe(tuiIfMap(() => this.obscured$));
    this.tuiObscured = outputFromObservable(this.tuiObscured$);
  }
  static {
    this.\u0275fac = function TuiObscured_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiObscured)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiObscured,
      selectors: [["", "tuiObscured", ""]],
      inputs: {
        tuiObscuredEnabled: [1, "tuiObscuredEnabled"]
      },
      outputs: {
        tuiObscured: "tuiObscured"
      },
      features: [\u0275\u0275ProvidersFeature([TuiObscuredService])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiObscured, [{
    type: Directive,
    args: [{
      selector: "[tuiObscured]",
      providers: [TuiObscuredService]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-portals-dropdown.mjs
var _c0 = (a0) => ({
  $implicit: a0
});
function TuiDropdownComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r1, " ");
  }
}
var _c1 = ["tuiDropdownHost"];
var TuiDropdownDriver = class _TuiDropdownDriver extends BehaviorSubject {
  constructor() {
    super(false);
    this.type = "dropdown";
  }
  static {
    this.\u0275fac = function TuiDropdownDriver_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownDriver)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _TuiDropdownDriver,
      factory: _TuiDropdownDriver.\u0275fac
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownDriver, [{
    type: Injectable
  }], () => [], null);
})();
var TuiDropdownDriverDirective = class _TuiDropdownDriverDirective extends TuiDriverDirective {
  constructor() {
    super(...arguments);
    this.type = "dropdown";
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiDropdownDriverDirective_BaseFactory;
      return function TuiDropdownDriverDirective_Factory(__ngFactoryType__) {
        return (\u0275TuiDropdownDriverDirective_BaseFactory || (\u0275TuiDropdownDriverDirective_BaseFactory = \u0275\u0275getInheritedFactory(_TuiDropdownDriverDirective)))(__ngFactoryType__ || _TuiDropdownDriverDirective);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownDriverDirective,
      features: [\u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownDriverDirective, [{
    type: Directive
  }], null, null);
})();
var TUI_DROPDOWN_DEFAULT_OPTIONS = {
  align: "start",
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
    this.\u0275fac = function TuiDropdownOptionsDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownOptionsDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
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
      features: [\u0275\u0275ProvidersFeature([tuiProvide(TUI_DROPDOWN_OPTIONS, _TuiDropdownOptionsDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownOptionsDirective, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownAlign], [tuiDropdownAppearance], [tuiDropdownDirection], [tuiDropdownLimitWidth], [tuiDropdownMinHeight], [tuiDropdownMaxHeight], [tuiDropdownOffset]",
      inputs: ["align: tuiDropdownAlign", "appearance: tuiDropdownAppearance", "direction: tuiDropdownDirection", "limitWidth: tuiDropdownLimitWidth", "minHeight: tuiDropdownMinHeight", "maxHeight: tuiDropdownMaxHeight", "offset: tuiDropdownOffset"],
      providers: [tuiProvide(TUI_DROPDOWN_OPTIONS, TuiDropdownOptionsDirective)]
    }]
  }], null, null);
})();
var TuiDropdownPosition = class _TuiDropdownPosition extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.el = tuiInjectElement();
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.viewport = inject(TUI_VIEWPORT);
    this.direction = new Subject();
    this.type = "dropdown";
    this.accessor = tuiFallbackAccessor("dropdown")(inject(TuiRectAccessor, {
      self: true,
      optional: true
    }), {
      getClientRect: () => this.el.getBoundingClientRect()
    });
    this.tuiDropdownDirectionChange = outputFromObservable(this.direction.pipe(distinctUntilChanged()));
  }
  getPosition({
    width,
    height
  }) {
    if (!width && !height) {
      this.previous = void 0;
    }
    const hostRect = this.accessor.getClientRect();
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
      this.direction.next(previous);
      return [position[align], position[previous]];
    }
    this.previous = better;
    this.direction.next(better);
    return [position[align], position[better]];
  }
  getAlign(align) {
    const rtl = this.el.matches('[dir="rtl"] :scope');
    if (rtl && align === "start") {
      return "right";
    }
    if (rtl && align === "end") {
      return "left";
    }
    if (align === "center") {
      return "center";
    }
    return align === "end" ? "right" : "left";
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiDropdownPosition_BaseFactory;
      return function TuiDropdownPosition_Factory(__ngFactoryType__) {
        return (\u0275TuiDropdownPosition_BaseFactory || (\u0275TuiDropdownPosition_BaseFactory = \u0275\u0275getInheritedFactory(_TuiDropdownPosition)))(__ngFactoryType__ || _TuiDropdownPosition);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownPosition,
      outputs: {
        tuiDropdownDirectionChange: "tuiDropdownDirectionChange"
      },
      features: [\u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownPosition, [{
    type: Directive
  }], null, null);
})();
var MAX_WIDTH_GAP = 16;
var TuiDropdownAnchor = class _TuiDropdownAnchor {
  constructor() {
    this.el = tuiInjectElement();
    this.directive = inject(TuiDropdownDirective);
    this.accessor = this.directive.accessor;
    this.viewport = inject(TUI_VIEWPORT);
    this.vvs = inject(TuiVisualViewportService);
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.position = this.directive.position;
    this.styles$ = inject(TuiPositionService).pipe(takeWhile(() => this.directive.el.isConnected && !!this.directive.el.getBoundingClientRect().height), map((v) => this.position === "fixed" ? this.vvs.correct(v) : v), map((point) => this.getStyles(...point)), takeUntilDestroyed());
  }
  ngAfterViewInit() {
    this.styles$.subscribe({
      next: (styles) => Object.assign(this.el.style, styles),
      complete: () => this.directive.toggle(false)
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
    const rect = this.accessor.getClientRect();
    const viewport = this.viewport.getClientRect();
    const zoom = this.directive.el.currentCSSZoom || 1;
    const above = rect.top - viewport.top - 2 * offset;
    const below = viewport.top + viewport.height - y - offset;
    const available = y > rect.bottom ? below : above;
    const height = this.el.getBoundingClientRect().right <= rect.left || x >= rect.right ? maxHeight : tuiClamp(available, minHeight, maxHeight);
    y -= top;
    x -= left;
    return {
      position: this.position,
      top: tuiPx(Math.round(Math.max(y, offset - top) / zoom)),
      left: tuiPx(Math.round(x / zoom)),
      maxHeight: tuiPx(Math.round(height / zoom)),
      width: limitWidth === "fixed" ? tuiPx(Math.round(rect.width / zoom)) : "",
      minWidth: limitWidth === "min" ? tuiPx(Math.round(rect.width / zoom)) : "",
      maxWidth: tuiPx(Math.round(viewport.width / zoom) - MAX_WIDTH_GAP)
    };
  }
  static {
    this.\u0275fac = function TuiDropdownAnchor_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownAnchor)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownAnchor,
      features: [\u0275\u0275ProvidersFeature([TuiPositionService, tuiPositionAccessorFor("dropdown", TuiDropdownPosition), tuiRectAccessorFor("dropdown", forwardRef(() => TuiDropdownDirective))])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownAnchor, [{
    type: Directive,
    args: [{
      providers: [TuiPositionService, tuiPositionAccessorFor("dropdown", TuiDropdownPosition), tuiRectAccessorFor("dropdown", forwardRef(() => TuiDropdownDirective))]
    }]
  }], null, null);
})();
var TuiDropdownComponent = class _TuiDropdownComponent {
  constructor() {
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.directive = inject(TuiDropdownDirective);
    this.context = inject(TUI_DROPDOWN_CONTEXT, {
      optional: true
    });
    this.darkMode = inject(TUI_DARK_MODE);
    this.theme = computed((_ = this.darkMode()) => this.directive.el.closest("[tuiTheme]")?.getAttribute("tuiTheme"));
    this.close = () => this.directive.toggle(false);
  }
  static {
    this.\u0275fac = function TuiDropdownComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiDropdownComponent,
      selectors: [["tui-dropdown"]],
      hostVars: 2,
      hostBindings: function TuiDropdownComponent_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-appearance", ctx.options.appearance)("tuiTheme", ctx.theme());
        }
      },
      features: [\u0275\u0275HostDirectivesFeature([TuiActiveZone, TuiAnimated, TuiDropdownAnchor])],
      decls: 2,
      vars: 4,
      consts: [[1, "t-scroll"], ["class", "t-primitive", 4, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-primitive"]],
      template: function TuiDropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275elementStart(0, "tui-scrollbar", 0);
          \u0275\u0275template(1, TuiDropdownComponent_div_1_Template, 2, 1, "div", 1);
          \u0275\u0275elementEnd();
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275property("polymorpheusOutlet", ctx.directive.content())("polymorpheusOutletContext", \u0275\u0275pureFunction1(2, _c0, ctx.close));
        }
      },
      dependencies: [PolymorpheusOutlet, TuiScrollbar],
      styles: ["[_nghost-%COMP%]{position:absolute;display:flex;box-shadow:var(--tui-shadow-medium);color:var(--tui-text-primary);background:var(--tui-background-elevation-3);border-radius:var(--tui-radius-m);overflow:hidden;border:1px solid var(--tui-border-normal);box-sizing:border-box;isolation:isolate;pointer-events:auto;--tui-from: translateY(-1rem)}[_nghost-%COMP%]:has(tui-data-list[data-size=l]){border-radius:var(--tui-radius-l)}.tui-enter[_nghost-%COMP%], .tui-leave[_nghost-%COMP%]{animation-name:tuiFade,tuiSlide;animation-duration:calc(var(--tui-duration) / 2);pointer-events:none}[_nghost-%COMP%]:not([style*=top]){visibility:hidden}.t-scroll[_ngcontent-%COMP%]{flex-grow:1;max-inline-size:calc(100% + 2px);inline-size:max-content;overscroll-behavior:none;margin:-1px}.t-primitive[_ngcontent-%COMP%]{padding:1rem}"],
      changeDetection: 1
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownComponent, [{
    type: Component,
    args: [{
      selector: "tui-dropdown",
      imports: [PolymorpheusOutlet, TuiScrollbar],
      changeDetection: ChangeDetectionStrategy.Default,
      hostDirectives: [TuiActiveZone, TuiAnimated, TuiDropdownAnchor],
      host: {
        "[attr.data-appearance]": "options.appearance",
        "[attr.tuiTheme]": "theme()"
      },
      template: '<tui-scrollbar class="t-scroll">\n    <div\n        *polymorpheusOutlet="directive.content() as text; context: {$implicit: close}"\n        class="t-primitive"\n    >\n        {{ text }}\n    </div>\n</tui-scrollbar>\n',
      styles: [":host{position:absolute;display:flex;box-shadow:var(--tui-shadow-medium);color:var(--tui-text-primary);background:var(--tui-background-elevation-3);border-radius:var(--tui-radius-m);overflow:hidden;border:1px solid var(--tui-border-normal);box-sizing:border-box;isolation:isolate;pointer-events:auto;--tui-from: translateY(-1rem)}:host:has(tui-data-list[data-size=l]){border-radius:var(--tui-radius-l)}:host.tui-enter,:host.tui-leave{animation-name:tuiFade,tuiSlide;animation-duration:calc(var(--tui-duration) / 2);pointer-events:none}:host:not([style*=top]){visibility:hidden}.t-scroll{flex-grow:1;max-inline-size:calc(100% + 2px);inline-size:max-content;overscroll-behavior:none;margin:-1px}.t-primitive{padding:1rem}\n"]
    }]
  }], null, null);
})();
var TUI_DROPDOWN_COMPONENT = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_COMPONENT" : "", {
  factory: () => TuiDropdownComponent
});
var TUI_DROPDOWN_CONTEXT = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_CONTEXT" : "");
var TUI_DROPDOWN_HOST = new InjectionToken(ngDevMode ? "TUI_DROPDOWN_HOST" : "");
var TuiDropdownA11y = class _TuiDropdownA11y {
  constructor() {
    this.id = tuiGenerateId();
    this.host = inject(TUI_DROPDOWN_HOST);
    this.dropdown = inject(TuiDropdownDirective);
    this.tuiDropdownRole = input("listbox");
    this.sync = effect(() => {
      const content = this.dropdown.content();
      const dropdown = this.dropdown.ref();
      const host = this.host.nativeElement;
      host.setAttribute("aria-expanded", String(!!dropdown));
      host.setAttribute("aria-controls", this.id);
      host.setAttribute("aria-haspopup", this.tuiDropdownRole());
      dropdown?.location.nativeElement.setAttribute("id", this.id);
      dropdown?.location.nativeElement.setAttribute("role", this.tuiDropdownRole());
      if (content) {
        return;
      }
      host.removeAttribute("aria-expanded");
      host.removeAttribute("aria-controls");
      host.removeAttribute("aria-haspopup");
    });
  }
  static {
    this.\u0275fac = function TuiDropdownA11y_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownA11y)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownA11y,
      selectors: [["", "tuiDropdownA11y", ""]],
      inputs: {
        tuiDropdownRole: [1, "tuiDropdownRole"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownA11y, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownA11y]"
    }]
  }], null, null);
})();
var TuiDropdownDirective = class _TuiDropdownDirective {
  constructor() {
    this.injector = inject(INJECTOR$1);
    this.refresh$ = new Subject();
    this.service = inject(TuiPopupService);
    this.cdr = inject(ChangeDetectorRef);
    this.drivers = coerceArray(inject(TuiDropdownDriver, {
      self: true,
      optional: true
    }));
    this.sub = this.refresh$.pipe(throttleTime(0, tuiZonefreeScheduler()), takeUntilDestroyed()).subscribe(() => {
      this.ref()?.changeDetectorRef.detectChanges();
      this.ref()?.changeDetectorRef.markForCheck();
    });
    this.autoClose = effect(() => {
      if (!this.content()) {
        this.toggle(false);
      }
    });
    this.ref = signal(null);
    this.el = tuiInjectElement();
    this.type = "dropdown";
    this.component = new PolymorpheusComponent(inject(TUI_DROPDOWN_COMPONENT), inject(INJECTOR$1));
    this.content = input(null, {
      alias: "tuiDropdown",
      transform: (content) => content instanceof TemplateRef ? new PolymorpheusTemplate(content, this.cdr) : content
    });
  }
  get accessor() {
    const accessors = this.injector.get(TuiRectAccessor, null, {
      self: true
    });
    return tuiFallbackAccessor("dropdown")(accessors, this);
  }
  get position() {
    return tuiCheckFixedPosition(this.el) ? "fixed" : "absolute";
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
    if (show && this.content() && !ref) {
      this.ref.set(this.service.add(this.component));
    } else if (!show && ref) {
      this.ref.set(null);
      ref.destroy();
    }
    this.drivers.forEach((driver) => driver?.next(show));
  }
  static {
    this.\u0275fac = function TuiDropdownDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownDirective,
      selectors: [["", "tuiDropdown", "", 5, "ng-container", 5, "ng-template"]],
      hostVars: 2,
      hostBindings: function TuiDropdownDirective_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275classProp("tui-dropdown-open", ctx.ref());
        }
      },
      inputs: {
        content: [1, "tuiDropdown", "content"]
      },
      exportAs: ["tuiDropdown"],
      features: [\u0275\u0275ProvidersFeature([tuiAsVehicle(_TuiDropdownDirective), tuiProvide(TUI_DROPDOWN_HOST, ElementRef)]), \u0275\u0275HostDirectivesFeature([TuiDropdownDriverDirective, {
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
      selector: "[tuiDropdown]:not(ng-container):not(ng-template)",
      providers: [tuiAsVehicle(TuiDropdownDirective), tuiProvide(TUI_DROPDOWN_HOST, ElementRef)],
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
  }], null, null);
})();
var TuiDropdownClose = class _TuiDropdownClose {
  constructor() {
    this.el = tuiInjectElement();
    this.ref = inject(TuiDropdownDirective).ref;
    this.open = inject(TuiDropdownOpen);
    this.obscured = inject(TuiObscured);
    this.activeZone = inject(TuiActiveZone);
    this.tuiDropdownClose = outputFromObservable(merge(
      inject(TuiDropdownDriver).pipe(tuiIfMap(() => merge(tuiCloseWatcher(), this.obscured.tuiObscured$.pipe(filter(Boolean)), this.activeZone.tuiActiveZoneChange.pipe(filter((a) => !a)), tuiTypedFromEvent(this.el, "focusin").pipe(filter((event) => !this.open.nativeElement.contains(tuiGetActualTarget(event)) || !this.ref()))))),
      // @ts-ignore
      typeof CloseWatcher === "undefined" ? tuiTypedFromEvent(inject(DOCUMENT), "keydown", {
        capture: true
      }).pipe(filter(({
        key
      }) => key === "Escape" && this.open.open() && !this.ref()?.location.nativeElement?.nextElementSibling), tuiStopPropagation()) : EMPTY
    ));
  }
  static {
    this.\u0275fac = function TuiDropdownClose_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownClose)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownClose,
      outputs: {
        tuiDropdownClose: "tuiDropdownClose"
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownClose, [{
    type: Directive
  }], null, null);
})();
var TuiDropdownOpen = class _TuiDropdownOpen {
  constructor() {
    this.dropdownHost = contentChild("tuiDropdownHost", {
      descendants: true,
      read: ElementRef
    });
    this.directive = inject(TuiDropdownDirective);
    this.el = tuiInjectElement();
    this.obscured = inject(TuiObscured);
    this.driver = inject(TuiDropdownDriver);
    this.dropdown = computed(() => this.directive.ref()?.location.nativeElement);
    this.enabled = input(true, {
      alias: "tuiDropdownEnabled"
    });
    this.open = model(false, {
      alias: "tuiDropdownOpen"
    });
    this.driveEffect = effect(() => this.drive(this.open()));
    this.syncSub = this.driver.pipe(filter((open) => open !== this.open()), takeUntilDestroyed()).subscribe((open) => this.update(open));
    this.keydownSub = tuiTypedFromEvent(inject(DOCUMENT), "keydown").pipe(takeUntilDestroyed()).subscribe((event) => this.onKeydown(event));
  }
  get nativeElement() {
    const initial = this.dropdownHost()?.nativeElement || this.el;
    const focusable = tuiIsFocusable(initial) ? initial : tuiGetClosestFocusable({
      initial,
      root: this.el
    });
    return this.dropdownHost()?.nativeElement || focusable || this.el;
  }
  toggle(open) {
    if (this.focused && !open) {
      this.nativeElement.focus({
        preventScroll: true
      });
    }
    this.update(open);
  }
  onClick(target) {
    if (!this.editable && this.nativeElement.contains(target)) {
      this.update(!this.open());
    }
  }
  onArrow(event, up) {
    if (!tuiIsElement(event.target) || !this.nativeElement.contains(event.target) || !this.enabled() || !this.directive.content()) {
      return;
    }
    event.preventDefault();
    this.focusDropdown(up);
  }
  get editable() {
    return tuiIsElementEditable(this.nativeElement);
  }
  get focused() {
    return tuiIsFocusedIn(this.nativeElement) || tuiIsFocusedIn(this.dropdown());
  }
  onKeydown(event) {
    const target = tuiGetActualTarget(event);
    if (!event.defaultPrevented && tuiIsEditingKey(event.key) && this.editable && this.focused && tuiIsHTMLElement(target) && !tuiIsElementEditable(target)) {
      this.nativeElement.focus({
        preventScroll: true
      });
    }
  }
  update(open) {
    if (open && !this.enabled()) {
      return this.drive();
    }
    this.open.set(open);
    this.drive();
  }
  drive(open = this.open() && this.enabled()) {
    tuiSetSignal(this.obscured.tuiObscuredEnabled, open);
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
    this.\u0275fac = function TuiDropdownOpen_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownOpen)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownOpen,
      selectors: [["", "tuiDropdown", "", "tuiDropdownAuto", ""], ["", "tuiDropdown", "", "tuiDropdownOpen", ""], ["", "tuiDropdown", "", "tuiDropdownOpenChange", ""]],
      contentQueries: function TuiDropdownOpen_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.dropdownHost, _c1, 5, ElementRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      hostBindings: function TuiDropdownOpen_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function TuiDropdownOpen_click_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          })("keydown.arrowDown", function TuiDropdownOpen_keydown_arrowDown_HostBindingHandler($event) {
            return ctx.onArrow($event, false);
          })("keydown.arrowUp", function TuiDropdownOpen_keydown_arrowUp_HostBindingHandler($event) {
            return ctx.onArrow($event, true);
          })("tuiActiveZoneChange", function TuiDropdownOpen_tuiActiveZoneChange_HostBindingHandler() {
            return 0;
          })("tuiDropdownClose", function TuiDropdownOpen_tuiDropdownClose_HostBindingHandler() {
            return ctx.toggle(false);
          });
        }
      },
      inputs: {
        enabled: [1, "tuiDropdownEnabled", "enabled"],
        open: [1, "tuiDropdownOpen", "open"]
      },
      outputs: {
        open: "tuiDropdownOpenChange"
      },
      features: [\u0275\u0275ProvidersFeature([TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiProvide(TUI_DROPDOWN_HOST, _TuiDropdownOpen)]), \u0275\u0275HostDirectivesFeature([TuiObscured, {
        directive: TuiDropdownClose,
        outputs: ["tuiDropdownClose", "tuiDropdownClose"]
      }, {
        directive: TuiActiveZone,
        inputs: ["tuiActiveZoneParent", "tuiActiveZoneParent"],
        outputs: ["tuiActiveZoneChange", "tuiActiveZoneChange"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownOpen, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdown][tuiDropdownAuto],[tuiDropdown][tuiDropdownOpen],[tuiDropdown][tuiDropdownOpenChange]",
      providers: [TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiProvide(TUI_DROPDOWN_HOST, TuiDropdownOpen)],
      hostDirectives: [TuiObscured, {
        directive: TuiDropdownClose,
        outputs: ["tuiDropdownClose"]
      }, {
        directive: TuiActiveZone,
        inputs: ["tuiActiveZoneParent"],
        outputs: ["tuiActiveZoneChange"]
      }],
      host: {
        "(click)": "onClick($event.target)",
        "(keydown.arrowDown)": "onArrow($event, false)",
        "(keydown.arrowUp)": "onArrow($event, true)",
        // TODO: Necessary because startWith(false) + distinctUntilChanged() in TuiActiveZone, think of better solution
        "(tuiActiveZoneChange)": "0",
        "(tuiDropdownClose)": "toggle(false)"
      }
    }]
  }], null, null);
})();
var TuiDropdownContent = class _TuiDropdownContent {
  constructor() {
    this.directive = inject(TuiDropdownDirective);
    tuiSetSignal(this.directive.content, inject(TemplateRef));
    if (isPlatformBrowser(inject(PLATFORM_ID)) && this.directive.el.matches(":focus-within")) {
      this.directive.toggle(true);
    }
  }
  ngOnDestroy() {
    tuiSetSignal(this.directive.content, null);
  }
  static {
    this.\u0275fac = function TuiDropdownContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownContent)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownContent,
      selectors: [["ng-template", "tuiDropdown", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[tuiDropdown]"
    }]
  }], () => [], null);
})();
var TuiDropdownContext = class _TuiDropdownContext extends TuiRectAccessor {
  constructor() {
    super(...arguments);
    this.isTouch = inject(WA_IS_TOUCH);
    this.currentRect = EMPTY_CLIENT_RECT;
    this.userSelect = computed(() => this.isTouch() ? "none" : null);
    this.activeZone = inject(TuiActiveZone);
    this.driver = inject(TuiDropdownDriver);
    this.doc = inject(DOCUMENT);
    this.sub = merge(tuiTypedFromEvent(this.doc, "pointerdown"), tuiTypedFromEvent(this.doc, "keydown").pipe(filter(({
      key
    }) => key === "Escape")), tuiTypedFromEvent(this.doc, "contextmenu", {
      capture: true
    })).pipe(filter((event) => this.driver.value && !this.activeZone.contains(tuiGetActualTarget(event))), tuiZoneOptimized(), takeUntilDestroyed()).subscribe(() => {
      this.driver.next(false);
      this.currentRect = EMPTY_CLIENT_RECT;
    });
    this.type = "dropdown";
  }
  getClientRect() {
    return this.currentRect;
  }
  onContextMenu(x, y) {
    this.currentRect = tuiPointToClientRect(x, y);
    this.driver.next(true);
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiDropdownContext_BaseFactory;
      return function TuiDropdownContext_Factory(__ngFactoryType__) {
        return (\u0275TuiDropdownContext_BaseFactory || (\u0275TuiDropdownContext_BaseFactory = \u0275\u0275getInheritedFactory(_TuiDropdownContext)))(__ngFactoryType__ || _TuiDropdownContext);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownContext,
      selectors: [["", "tuiDropdownContext", ""]],
      hostVars: 6,
      hostBindings: function TuiDropdownContext_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("longtap", function TuiDropdownContext_longtap_HostBindingHandler($event) {
            return ctx.onContextMenu($event.detail.clientX, $event.detail.clientY);
          });
        }
        if (rf & 2) {
          \u0275\u0275styleProp("-webkit-touch-callout", ctx.userSelect())("-webkit-user-select", ctx.userSelect())("user-select", ctx.userSelect());
        }
      },
      features: [\u0275\u0275ProvidersFeature([TuiActiveZone, TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiAsRectAccessor(_TuiDropdownContext)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownContext, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownContext]",
      providers: [TuiActiveZone, TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver), tuiAsRectAccessor(TuiDropdownContext)],
      host: {
        "[style.-webkit-touch-callout]": "userSelect()",
        "[style.-webkit-user-select]": "userSelect()",
        "[style.user-select]": "userSelect()",
        "(longtap)": "onContextMenu($event.detail.clientX, $event.detail.clientY)"
      }
    }]
  }], null, null);
})();
var TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS = {
  showDelay: 200,
  hideDelay: 500
};
var [TUI_DROPDOWN_HOVER_OPTIONS, tuiDropdownHoverOptionsProvider] = tuiCreateOptions(TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS);
var TuiDropdownHover = class _TuiDropdownHover extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.dropdownHost = contentChild("tuiDropdownHost", {
      descendants: true,
      read: ElementRef
    });
    this.el = tuiInjectElement();
    this.doc = inject(DOCUMENT);
    this.options = inject(TUI_DROPDOWN_HOVER_OPTIONS);
    this.activeZone = inject(TuiActiveZone);
    this.open = inject(TuiDropdownOpen, {
      optional: true
    });
    this.stream$ = merge(
      /**
       * Dropdown can be removed not only via click/touch –
       * swipe on mobile devices removes dropdown sheet without triggering new mouseover / mouseout events.
       */
      toObservable(inject(TuiDropdownDirective).ref).pipe(filter((x) => !x && this.hovered()), switchMap(() => tuiTypedFromEvent(this.doc, "pointerdown").pipe(map(tuiGetActualTarget), delay(this.tuiDropdownHideDelay()), startWith(null), takeUntil(fromEvent(this.doc, "mouseover"))))),
      tuiTypedFromEvent(this.doc, "mouseover").pipe(map(tuiGetActualTarget)),
      tuiTypedFromEvent(this.doc, "mouseout").pipe(map((e) => e.relatedTarget))
    ).pipe(map((element) => tuiIsElement(element) && this.isHovered(element)), distinctUntilChanged(), switchMap((v) => of(v).pipe(delay(v ? this.tuiDropdownShowDelay() : this.tuiDropdownHideDelay()), takeUntil(this.open ? fromEvent(this.el, "pointerdown") : EMPTY))), tuiZoneOptimized(), tap((hovered) => {
      this.hovered.set(hovered);
      this.open?.toggle(hovered);
    }), share());
    this.hovered = signal(false);
    this.tuiDropdownShowDelay = input(this.options.showDelay);
    this.tuiDropdownHideDelay = input(this.options.hideDelay);
    this.type = "dropdown";
  }
  onClick(event) {
    if (this.hovered() && this.open) {
      event.preventDefault();
    }
  }
  isHovered(element) {
    const host = this.dropdownHost()?.nativeElement || this.el;
    const hovered = host.contains(element);
    const child = !this.el.contains(element) && this.activeZone.contains(element);
    return hovered || child;
  }
  static {
    this.\u0275fac = function TuiDropdownHover_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownHover)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownHover,
      selectors: [["", "tuiDropdownHover", ""]],
      contentQueries: function TuiDropdownHover_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.dropdownHost, _c1, 5, ElementRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      hostBindings: function TuiDropdownHover_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click.capture", function TuiDropdownHover_click_capture_HostBindingHandler($event) {
            return ctx.onClick($event);
          });
        }
      },
      inputs: {
        tuiDropdownShowDelay: [1, "tuiDropdownShowDelay"],
        tuiDropdownHideDelay: [1, "tuiDropdownHideDelay"]
      },
      features: [\u0275\u0275ProvidersFeature([TuiActiveZone, tuiAsDriver(_TuiDropdownHover)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownHover, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownHover]",
      providers: [TuiActiveZone, tuiAsDriver(TuiDropdownHover)],
      host: {
        "(click.capture)": "onClick($event)"
      }
    }]
  }], () => [], null);
})();
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
    this.\u0275fac = function TuiDropdownFixed_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownFixed)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownFixed,
      features: [\u0275\u0275ProvidersFeature([tuiDropdownOptionsProvider({})])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownFixed, [{
    type: Directive,
    args: [{
      providers: [tuiDropdownOptionsProvider({})]
    }]
  }], () => [], null);
})();
var TuiDropdownAuto = class _TuiDropdownAuto {
  constructor() {
    inject(TUI_DROPDOWN_OPTIONS).limitWidth = "auto";
  }
  static {
    this.\u0275fac = function TuiDropdownAuto_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownAuto)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownAuto
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownAuto, [{
    type: Directive
  }], () => [], null);
})();
var TuiDropdownManual = class _TuiDropdownManual {
  constructor() {
    this.driver = inject(TuiDropdownDriver);
    this.tuiDropdownManual = input(false);
  }
  ngOnChanges() {
    this.driver.next(!!this.tuiDropdownManual());
  }
  static {
    this.\u0275fac = function TuiDropdownManual_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownManual)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownManual,
      selectors: [["", "tuiDropdownManual", ""]],
      inputs: {
        tuiDropdownManual: [1, "tuiDropdownManual"]
      },
      features: [\u0275\u0275ProvidersFeature([TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver)]), \u0275\u0275NgOnChangesFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownManual, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownManual]",
      providers: [TuiDropdownDriver, tuiAsDriver(TuiDropdownDriver)]
    }]
  }], null, null);
})();
var TuiDropdownPositionSided = class _TuiDropdownPositionSided extends TuiPositionAccessor {
  constructor() {
    super(...arguments);
    this.options = inject(TUI_DROPDOWN_OPTIONS);
    this.viewport = inject(TUI_VIEWPORT);
    this.vertical = inject(TuiDropdownPosition);
    this.previous = this.options.direction || "bottom";
    this.tuiDropdownSided = input("");
    this.tuiDropdownSidedOffset = input(4);
    this.type = "dropdown";
  }
  getPosition(rect) {
    if (this.tuiDropdownSided() === false) {
      return this.vertical.getPosition(rect);
    }
    const {
      height,
      width
    } = rect;
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
      top: hostRect.bottom - height + this.tuiDropdownSidedOffset() + 1,
      // 1 for border
      left: hostRect.left - width - offset,
      right: hostRect.right + offset,
      bottom: hostRect.top - this.tuiDropdownSidedOffset() - 1
      // 1 for border
    };
    const better = available.top > available.bottom ? "top" : "bottom";
    const maxLeft = available.left > available.right ? position.left : position.right;
    const left = available[align] > width ? position[align] : maxLeft;
    if (available[this.previous] > height && direction || this.previous === better) {
      this.vertical.direction.next(this.previous);
      return [left, position[this.previous]];
    }
    this.previous = better;
    this.vertical.direction.next(better);
    return [left, position[better]];
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiDropdownPositionSided_BaseFactory;
      return function TuiDropdownPositionSided_Factory(__ngFactoryType__) {
        return (\u0275TuiDropdownPositionSided_BaseFactory || (\u0275TuiDropdownPositionSided_BaseFactory = \u0275\u0275getInheritedFactory(_TuiDropdownPositionSided)))(__ngFactoryType__ || _TuiDropdownPositionSided);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownPositionSided,
      selectors: [["", "tuiDropdownSided", ""]],
      inputs: {
        tuiDropdownSided: [1, "tuiDropdownSided"],
        tuiDropdownSidedOffset: [1, "tuiDropdownSidedOffset"]
      },
      features: [\u0275\u0275ProvidersFeature([TuiDropdownPosition, tuiAsPositionAccessor(_TuiDropdownPositionSided)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownPositionSided, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownSided]",
      providers: [TuiDropdownPosition, tuiAsPositionAccessor(TuiDropdownPositionSided)]
    }]
  }], null, null);
})();
var TuiDropdownSelection = class _TuiDropdownSelection extends TuiDriver {
  constructor() {
    super((subscriber) => this.stream$.subscribe(subscriber));
    this.doc = inject(DOCUMENT);
    this.vcr = inject(ViewContainerRef);
    this.dropdown = inject(TuiDropdownDirective);
    this.el = tuiInjectElement();
    this.handler = computed((visible = this.tuiDropdownSelection()) => tuiIsString(visible) ? TUI_TRUE_HANDLER : visible);
    this.stream$ = combineLatest([toObservable(this.handler), inject(TUI_SELECTION_STREAM).pipe(map(() => this.getRange()), filter((range) => this.isValid(range)), distinctUntilChanged((x, y) => x.startOffset === y.startOffset && x.endOffset === y.endOffset && x.commonAncestorContainer === y.commonAncestorContainer)), merge(fromEvent(this.el, "scroll", {
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
    this.range = isPlatformBrowser(inject(PLATFORM_ID)) ? new Range() : {};
    this.type = "dropdown";
    this.tuiDropdownSelection = input("");
    this.tuiDropdownSelectionPosition = input("selection");
  }
  getClientRect() {
    switch (this.tuiDropdownSelectionPosition()) {
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
    ghost.textContent = `${CHAR_ZERO_WIDTH_SPACE}${value}${CHAR_NO_BREAK_SPACE}`;
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
    const fontSize = Number.parseFloat(styles.fontSize) || 16;
    const lineHeight = Number.parseFloat(styles.lineHeight) || fontSize * 1.2;
    const visibleTop = Math.max(caret.top, host.top);
    const visibleBottom = Math.min(caret.bottom, host.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const threshold = lineHeight * 0.5;
    return visibleHeight >= threshold;
  }
  static {
    this.\u0275fac = function TuiDropdownSelection_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDropdownSelection)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiDropdownSelection,
      selectors: [["", "tuiDropdownSelection", ""]],
      inputs: {
        tuiDropdownSelection: [1, "tuiDropdownSelection"],
        tuiDropdownSelectionPosition: [1, "tuiDropdownSelectionPosition"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsDriver(_TuiDropdownSelection), tuiAsRectAccessor(_TuiDropdownSelection)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDropdownSelection, [{
    type: Directive,
    args: [{
      selector: "[tuiDropdownSelection]",
      providers: [tuiAsDriver(TuiDropdownSelection), tuiAsRectAccessor(TuiDropdownSelection)]
    }]
  }], () => [], null);
})();
var TuiWithDropdownOpen = class _TuiWithDropdownOpen {
  static {
    this.\u0275fac = function TuiWithDropdownOpen_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithDropdownOpen)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiWithDropdownOpen,
      features: [\u0275\u0275HostDirectivesFeature([{
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
      hostDirectives: [{
        directive: TuiDropdownOpen,
        inputs: ["tuiDropdownOpen: open", "tuiDropdownEnabled"],
        outputs: ["tuiDropdownOpenChange: openChange"]
      }]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-data-list.mjs
var _c02 = ["*"];
function TuiDataListComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
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
function TuiDataListComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 0);
    \u0275\u0275template(1, TuiDataListComponent_Conditional_1_ng_container_1_Template, 2, 1, "ng-container", 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("polymorpheusOutlet", ctx_r1.emptyContent() || ctx_r1.fallback());
  }
}
var TUI_DATA_LIST_HOST = new InjectionToken(ngDevMode ? "TUI_DATA_LIST_HOST" : "");
function tuiAsDataListHost(host) {
  return tuiProvide(TUI_DATA_LIST_HOST, host);
}
var TUI_DATA_LIST_SIZE = new InjectionToken(ngDevMode ? "TUI_DATA_LIST_SIZE" : "");
function tuiInjectDataListSize() {
  const sizes = ["s", "m", "l"];
  const size = inject(TUI_DATA_LIST_SIZE, {
    optional: true
  }) || inject(TUI_DATA_LIST_HOST, {
    optional: true
  })?.size;
  return size && sizes.includes(size) ? size : "l";
}
var TUI_OPTION_CONTENT = new InjectionToken(ngDevMode ? "TUI_OPTION_CONTENT" : "");
var TuiWithOptionContent = class _TuiWithOptionContent {
  constructor() {
    this.local = null;
    this.global = inject(TUI_OPTION_CONTENT, {
      optional: true
    });
  }
  get content() {
    return this.global ?? this.local;
  }
  static {
    this.\u0275fac = function TuiWithOptionContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithOptionContent)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiWithOptionContent,
      contentQueries: function TuiWithOptionContent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuery(dirIndex, TUI_OPTION_CONTENT, 5);
        }
        if (rf & 2) {
          let _t;
          \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.local = _t.first);
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithOptionContent, [{
    type: Directive
  }], null, {
    local: [{
      type: ContentChild,
      args: [TUI_OPTION_CONTENT, {
        descendants: true
      }]
    }]
  });
})();
var TuiOptionWithContent = class _TuiOptionWithContent {
  constructor() {
    this.vcr = inject(ViewContainerRef);
    this.content = inject(TUI_OPTION_CONTENT, {
      optional: true
    });
    this.ref = this.content && createComponent(this.content, {
      environmentInjector: inject(EnvironmentInjector),
      elementInjector: inject(INJECTOR$1),
      hostElement: tuiInjectElement()
    });
    if (this.ref) {
      this.vcr.insert(this.ref.hostView);
      this.ref.changeDetectorRef.detectChanges();
    }
  }
  static {
    this.\u0275fac = function TuiOptionWithContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptionWithContent)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiOptionWithContent
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptionWithContent, [{
    type: Directive
  }], () => [], null);
})();
var TuiOptionWithValue = class _TuiOptionWithValue {
  constructor() {
    this.host = inject(TUI_DATA_LIST_HOST, {
      optional: true
    });
    this.disabled = input(false);
    this.value = input();
  }
  onClick(value = this.value()) {
    if (value !== void 0) {
      this.host?.handleOption?.(value);
    }
  }
  static {
    this.\u0275fac = function TuiOptionWithValue_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptionWithValue)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiOptionWithValue,
      selectors: [["button", "tuiOption", "", "value", ""], ["a", "tuiOption", "", "value", ""], ["label", "tuiOption", "", "value", ""]],
      hostBindings: function TuiOptionWithValue_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click", function TuiOptionWithValue_click_HostBindingHandler() {
            return ctx.onClick();
          });
        }
      },
      inputs: {
        disabled: [1, "disabled"],
        value: [1, "value"]
      },
      features: [\u0275\u0275HostDirectivesFeature([TuiOptionWithContent])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptionWithValue, [{
    type: Directive,
    args: [{
      selector: "button[tuiOption][value], a[tuiOption][value], label[tuiOption][value]",
      hostDirectives: [TuiOptionWithContent],
      host: {
        "(click)": "onClick()"
      }
    }]
  }], null, null);
})();
var TuiDataListComponent = class _TuiDataListComponent {
  constructor() {
    this.ngZone = inject(NgZone);
    this.destroyRef = inject(DestroyRef);
    this.el = tuiInjectElement();
    this.cdr = inject(ChangeDetectorRef);
    this.optionsQuery = contentChildren(forwardRef(() => TuiOptionWithValue), {
      descendants: true
    });
    this.fallback = inject(TUI_NOTHING_FOUND_MESSAGE);
    this.empty = signal(false);
    this.emptyContent = input();
    this.size = input(tuiInjectDataListSize());
    this.options = computed(() => this.optionsQuery().map(({
      value
    }) => value()).filter(tuiIsPresent));
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
  ngAfterContentChecked() {
    timer(0).pipe(tuiZonefree(this.ngZone), tuiTakeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.empty.set(!this.elements.length);
      this.cdr.detectChanges();
    });
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
    return Array.from(this.el.querySelectorAll("[tuiOption]:not(.t-empty)"));
  }
  static {
    this.\u0275fac = function TuiDataListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiDataListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiDataListComponent,
      selectors: [["tui-data-list"]],
      contentQueries: function TuiDataListComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.optionsQuery, TuiOptionWithValue, 5);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      hostAttrs: ["data-tui-version", "5.16.0", "role", "listbox"],
      hostVars: 2,
      hostBindings: function TuiDataListComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("focusin", function TuiDataListComponent_focusin_HostBindingHandler($event) {
            return ctx.onFocusIn($event.relatedTarget, $event.currentTarget);
          })("keydown.arrowDown.prevent", function TuiDataListComponent_keydown_arrowDown_prevent_HostBindingHandler($event) {
            return ctx.onKeyDownArrow($event.target, 1);
          })("keydown.arrowUp.prevent", function TuiDataListComponent_keydown_arrowUp_prevent_HostBindingHandler($event) {
            return ctx.onKeyDownArrow($event.target, -1);
          })("keydown.shift.tab", function TuiDataListComponent_keydown_shift_tab_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          })("keydown.tab", function TuiDataListComponent_keydown_tab_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          })("mousedown.prevent", function TuiDataListComponent_mousedown_prevent_HostBindingHandler() {
            return 0;
          })("mouseleave", function TuiDataListComponent_mouseleave_HostBindingHandler($event) {
            return ctx.handleFocusLossIfNecessary($event.target);
          })("wheel.zoneless.passive", function TuiDataListComponent_wheel_zoneless_passive_HostBindingHandler() {
            return ctx.handleFocusLossIfNecessary();
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("data-size", ctx.size())("role", ctx.role);
        }
      },
      inputs: {
        emptyContent: [1, "emptyContent"],
        size: [1, "size"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiCellOptionsProvider(() => ({
        size: inject(_TuiDataListComponent).size()
      })), tuiAsAuxiliary(_TuiDataListComponent), {
        provide: TUI_OPTION_CONTENT,
        useFactory: () => inject(TuiWithOptionContent, {
          optional: true
        })?.content ?? inject(TUI_OPTION_CONTENT, {
          skipSelf: true,
          optional: true
        })
      }])],
      ngContentSelectors: _c02,
      decls: 2,
      vars: 1,
      consts: [["tuiCell", "", "tuiOption", "", 1, "t-empty"], [4, "polymorpheusOutlet"]],
      template: function TuiDataListComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275projection(0);
          \u0275\u0275conditionalCreate(1, TuiDataListComponent_Conditional_1_Template, 2, 1, "span", 0);
        }
        if (rf & 2) {
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.empty() ? 1 : -1);
        }
      },
      dependencies: [PolymorpheusOutlet, TuiCell],
      styles: ['tui-data-list:where(*[data-tui-version="5.16.0"]){display:flex;flex-direction:column;padding:.25rem}tui-data-list:where(*[data-tui-version="5.16.0"]):focus-within [tuiOption]._with-dropdown:not(:focus){background:transparent}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]{min-block-size:0;font:var(--tui-typography-ui-s);padding:.375rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]:before,tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]:after{font-size:1rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiOption]{min-block-size:2.25rem;font:var(--tui-typography-ui-s);padding:.5rem .375rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l]{gap:.125rem;padding:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l] [tuiOption]{font:var(--tui-typography-ui-m);padding-inline:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l] hr{block-size:1rem;border-inline-width:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]{transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);box-sizing:border-box;border-radius:var(--tui-radius-s);outline:none!important;cursor:pointer;word-break:break-word;text-transform:inherit}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:disabled{opacity:var(--tui-disabled-opacity);cursor:default}@media(hover:hover)and (pointer:fine){tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:hover:not(:disabled){background:var(--tui-background-neutral-1)}}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:active:not(:disabled),tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:focus-within,tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]._with-dropdown{background:var(--tui-background-neutral-1)}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:after{margin-inline-start:auto}tui-data-list:where(*[data-tui-version="5.16.0"])>.t-empty{pointer-events:none;color:var(--tui-text-tertiary)}tui-data-list:where(*[data-tui-version="5.16.0"]) hr{position:relative;margin:0;block-size:.75rem;border:.375rem solid transparent;border-block:0}tui-data-list:where(*[data-tui-version="5.16.0"]) hr+hr,tui-data-list:where(*[data-tui-version="5.16.0"]) hr:first-child,tui-data-list:where(*[data-tui-version="5.16.0"]) hr:last-child{display:none}tui-data-list:where(*[data-tui-version="5.16.0"]) hr:before{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);content:"";block-size:1px;inline-size:100%;background:var(--tui-border-normal)}tui-opt-group:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;font-weight:700!important;gap:inherit;color:var(--tui-text-primary);flex-direction:column}tui-data-list[data-size=s] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-body-s)}tui-data-list[data-size=s] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.1875rem .375rem}tui-data-list[data-size=m] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-ui-m)}tui-data-list[data-size=m] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.375rem}tui-data-list[data-size=l] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-ui-l)}tui-data-list[data-size=l] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.5rem}tui-opt-group:where(*[data-tui-version="5.16.0"]):empty:before,tui-opt-group:where(*[data-tui-version="5.16.0"])[data-label=""]:before{display:none}tui-opt-group:where(*[data-tui-version="5.16.0"]):before{content:attr(data-label);word-break:break-word}tui-sheet-dialog tui-opt-group:where(*[data-tui-version="5.16.0"]):before{font:var(--tui-typography-heading-h6);padding:.5rem 0!important}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiDataListComponent, [{
    type: Component,
    args: [{
      selector: "tui-data-list",
      imports: [PolymorpheusOutlet, TuiCell],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiCellOptionsProvider(() => ({
        size: inject(TuiDataListComponent).size()
      })), tuiAsAuxiliary(TuiDataListComponent), {
        provide: TUI_OPTION_CONTENT,
        useFactory: () => inject(TuiWithOptionContent, {
          optional: true
        })?.content ?? inject(TUI_OPTION_CONTENT, {
          skipSelf: true,
          optional: true
        })
      }],
      host: {
        "data-tui-version": TUI_VERSION,
        role: "listbox",
        "[attr.data-size]": "size()",
        "[attr.role]": "role",
        "(focusin)": "onFocusIn($event.relatedTarget, $event.currentTarget)",
        "(keydown.arrowDown.prevent)": "onKeyDownArrow($event.target, 1)",
        "(keydown.arrowUp.prevent)": "onKeyDownArrow($event.target, -1)",
        "(keydown.shift.tab)": "handleFocusLossIfNecessary()",
        "(keydown.tab)": "handleFocusLossIfNecessary()",
        "(mousedown.prevent)": "(0)",
        "(mouseleave)": "handleFocusLossIfNecessary($event.target)",
        "(wheel.zoneless.passive)": "handleFocusLossIfNecessary()"
      },
      template: '<ng-content />\n@if (empty()) {\n    <!-- tuiOption selector purely for cosmetics, do not import -->\n    <span\n        tuiCell\n        tuiOption\n        class="t-empty"\n    >\n        <ng-container *polymorpheusOutlet="emptyContent() || fallback() as text">\n            {{ text }}\n        </ng-container>\n    </span>\n}\n',
      styles: ['tui-data-list:where(*[data-tui-version="5.16.0"]){display:flex;flex-direction:column;padding:.25rem}tui-data-list:where(*[data-tui-version="5.16.0"]):focus-within [tuiOption]._with-dropdown:not(:focus){background:transparent}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]{min-block-size:0;font:var(--tui-typography-ui-s);padding:.375rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]:before,tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=s] [tuiOption]:after{font-size:1rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=m] [tuiOption]{min-block-size:2.25rem;font:var(--tui-typography-ui-s);padding:.5rem .375rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l]{gap:.125rem;padding:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l] [tuiOption]{font:var(--tui-typography-ui-m);padding-inline:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"])[data-size=l] hr{block-size:1rem;border-inline-width:.5rem}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]{transition-property:background;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);box-sizing:border-box;border-radius:var(--tui-radius-s);outline:none!important;cursor:pointer;word-break:break-word;text-transform:inherit}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:disabled{opacity:var(--tui-disabled-opacity);cursor:default}@media(hover:hover)and (pointer:fine){tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:hover:not(:disabled){background:var(--tui-background-neutral-1)}}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:active:not(:disabled),tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:focus-within,tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]._with-dropdown{background:var(--tui-background-neutral-1)}tui-data-list:where(*[data-tui-version="5.16.0"]) [tuiOption]:after{margin-inline-start:auto}tui-data-list:where(*[data-tui-version="5.16.0"])>.t-empty{pointer-events:none;color:var(--tui-text-tertiary)}tui-data-list:where(*[data-tui-version="5.16.0"]) hr{position:relative;margin:0;block-size:.75rem;border:.375rem solid transparent;border-block:0}tui-data-list:where(*[data-tui-version="5.16.0"]) hr+hr,tui-data-list:where(*[data-tui-version="5.16.0"]) hr:first-child,tui-data-list:where(*[data-tui-version="5.16.0"]) hr:last-child{display:none}tui-data-list:where(*[data-tui-version="5.16.0"]) hr:before{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);content:"";block-size:1px;inline-size:100%;background:var(--tui-border-normal)}tui-opt-group:where(*[data-tui-version="5.16.0"]){position:relative;display:flex;font-weight:700!important;gap:inherit;color:var(--tui-text-primary);flex-direction:column}tui-data-list[data-size=s] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-body-s)}tui-data-list[data-size=s] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.1875rem .375rem}tui-data-list[data-size=m] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-ui-m)}tui-data-list[data-size=m] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.375rem}tui-data-list[data-size=l] tui-opt-group:where(*[data-tui-version="5.16.0"]){font:var(--tui-typography-ui-l)}tui-data-list[data-size=l] tui-opt-group:where(*[data-tui-version="5.16.0"]):before{padding:.5rem}tui-opt-group:where(*[data-tui-version="5.16.0"]):empty:before,tui-opt-group:where(*[data-tui-version="5.16.0"])[data-label=""]:before{display:none}tui-opt-group:where(*[data-tui-version="5.16.0"]):before{content:attr(data-label);word-break:break-word}tui-sheet-dialog tui-opt-group:where(*[data-tui-version="5.16.0"]):before{font:var(--tui-typography-heading-h6);padding:.5rem 0!important}\n']
    }]
  }], null, null);
})();
var TuiOptGroup = class _TuiOptGroup {
  constructor() {
    this.label = input();
  }
  static {
    this.\u0275fac = function TuiOptGroup_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOptGroup)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiOptGroup,
      selectors: [["tui-opt-group"]],
      hostAttrs: ["data-tui-version", "5.16.0", "role", "group"],
      hostVars: 1,
      hostBindings: function TuiOptGroup_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-label", ctx.label() || "");
        }
      },
      inputs: {
        label: [1, "label"]
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOptGroup, [{
    type: Directive,
    args: [{
      selector: "tui-opt-group",
      host: {
        "data-tui-version": TUI_VERSION,
        role: "group",
        "[attr.data-label]": 'label() || ""'
      }
    }]
  }], null, null);
})();
var TuiOption = class _TuiOption {
  constructor() {
    this.isMobile = inject(WA_IS_MOBILE);
    this.el = tuiInjectElement();
    this.datalist = inject(forwardRef(() => TuiDataListComponent), {
      optional: true
    });
    this.dropdown = inject(TuiDropdownDirective, {
      self: true,
      optional: true
    })?.ref;
    this.disabled = input(false);
  }
  // Preventing focus loss upon focused option removal
  ngOnDestroy() {
    this.datalist?.handleFocusLossIfNecessary(this.el);
  }
  onMouseMove() {
    if (!this.isMobile && !tuiIsFocused(this.el) && this.datalist && this.el.closest("[tuiDataListDropdownManager]")) {
      this.el.focus({
        preventScroll: true
      });
    }
  }
  static {
    this.\u0275fac = function TuiOption_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiOption)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiOption,
      selectors: [["button", "tuiOption", ""], ["a", "tuiOption", ""], ["label", "tuiOption", ""]],
      hostAttrs: ["role", "option", "type", "button"],
      hostVars: 3,
      hostBindings: function TuiOption_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("mousemove.zoneless", function TuiOption_mousemove_zoneless_HostBindingHandler() {
            return ctx.onMouseMove();
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("disabled", ctx.disabled() || null);
          \u0275\u0275classProp("_with-dropdown", ctx.dropdown == null ? null : ctx.dropdown());
        }
      },
      inputs: {
        disabled: [1, "disabled"]
      },
      features: [\u0275\u0275HostDirectivesFeature([TuiWithIcons, TuiCell])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiOption, [{
    type: Directive,
    args: [{
      selector: "button[tuiOption], a[tuiOption], label[tuiOption]",
      hostDirectives: [TuiWithIcons, TuiCell],
      host: {
        role: "option",
        type: "button",
        "[attr.disabled]": "disabled() || null",
        "[class._with-dropdown]": "dropdown?.()",
        "(mousemove.zoneless)": "onMouseMove()"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-label.mjs
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
      exportAs: ["tui-label-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiLabel]:where(*[data-tui-version="5.16.0"]){display:flex;gap:.25rem;flex-direction:column;font:var(--tui-typography-body-s);color:var(--tui-text-primary)}[tuiLabel]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical]){flex-direction:row;inline-size:fit-content;font:var(--tui-typography-body-m)}[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=checkbox],[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=radio]{font:inherit;inset-block-start:calc(var(--tui-lh) / 2);transform:translateY(-50%);margin-inline-end:.5rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=checkbox][data-size=s],[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=radio][data-size=s]{line-height:1.3;margin-inline-end:.25rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) small{font:var(--tui-typography-body-s)}[tuiLabel]:where(*[data-tui-version="5.16.0"]) [tuiTitle]:where(:not([tuiCell] *)){margin-block-start:.125rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-secondary)}\n'],
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
      exportAs: `tui-label-${TUI_VERSION}`,
      styles: ['[tuiLabel]:where(*[data-tui-version="5.16.0"]){display:flex;gap:.25rem;flex-direction:column;font:var(--tui-typography-body-s);color:var(--tui-text-primary)}[tuiLabel]:where(*[data-tui-version="5.16.0"]):not([data-orientation=vertical]){flex-direction:row;inline-size:fit-content;font:var(--tui-typography-body-m)}[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=checkbox],[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=radio]{font:inherit;inset-block-start:calc(var(--tui-lh) / 2);transform:translateY(-50%);margin-inline-end:.5rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=checkbox][data-size=s],[tuiLabel]:where(*[data-tui-version="5.16.0"]) input[type=radio][data-size=s]{line-height:1.3;margin-inline-end:.25rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) small{font:var(--tui-typography-body-s)}[tuiLabel]:where(*[data-tui-version="5.16.0"]) [tuiTitle]:where(:not([tuiCell] *)){margin-block-start:.125rem}[tuiLabel]:where(*[data-tui-version="5.16.0"]) [tuiSubtitle]{color:var(--tui-text-secondary)}\n']
    }]
  }], null, null);
})();
var TuiLabel = class _TuiLabel {
  constructor() {
    this.textfield = contentChild(forwardRef(() => TUI_DATA_LIST_HOST));
    this.el = tuiInjectElement();
    this.nothing = tuiWithStyles(Styles2);
    this.parent = inject(forwardRef(() => TUI_DATA_LIST_HOST), {
      optional: true
    });
  }
  static {
    this.\u0275fac = function TuiLabel_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLabel)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiLabel,
      selectors: [["label", "tuiLabel", ""]],
      contentQueries: function TuiLabel_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.textfield, TUI_DATA_LIST_HOST, 5);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance();
        }
      },
      hostAttrs: ["data-tui-version", "5.16.0"],
      hostVars: 2,
      hostBindings: function TuiLabel_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-orientation", ctx.textfield() ? "vertical" : "horizontal")("for", ctx.el.htmlFor || (ctx.parent == null ? null : ctx.parent.id));
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLabel, [{
    type: Directive,
    args: [{
      selector: "label[tuiLabel]",
      host: {
        "data-tui-version": TUI_VERSION,
        "[attr.data-orientation]": 'textfield() ? "vertical" : "horizontal"',
        "[attr.for]": "el.htmlFor || parent?.id"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-directives-button-x.mjs
var [TUI_BUTTON_X_OPTIONS, tuiButtonXOptionsProvider] = tuiCreateOptions({
  appearance: "neutral",
  size: "s"
});
var TuiButtonX = class _TuiButtonX {
  static {
    this.\u0275fac = function TuiButtonX_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiButtonX)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiButtonX,
      selectors: [["", "tuiButtonX", ""]],
      hostAttrs: ["tuiIconButton", "", "type", "button"],
      hostVars: 2,
      hostBindings: function TuiButtonX_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("pointerdown.prevent.zoneless", function TuiButtonX_pointerdown_prevent_zoneless_HostBindingHandler() {
            return 0;
          });
        }
        if (rf & 2) {
          \u0275\u0275styleProp("--t-radius", 100, "%");
        }
      },
      features: [\u0275\u0275ProvidersFeature([tuiButtonOptionsProvider(() => inject(TUI_BUTTON_X_OPTIONS)), {
        provide: TUI_ICON_START,
        useFactory: () => inject(TUI_COMMON_ICONS).close
      }]), \u0275\u0275HostDirectivesFeature([{
        directive: TuiButton,
        inputs: ["size", "size"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiButtonX, [{
    type: Directive,
    args: [{
      selector: "[tuiButtonX]",
      providers: [tuiButtonOptionsProvider(() => inject(TUI_BUTTON_X_OPTIONS)), {
        provide: TUI_ICON_START,
        useFactory: () => inject(TUI_COMMON_ICONS).close
      }],
      hostDirectives: [{
        directive: TuiButton,
        inputs: ["size"]
      }],
      host: {
        tuiIconButton: "",
        type: "button",
        "[style.--t-radius.%]": "100",
        "(pointerdown.prevent.zoneless)": "(0)"
      }
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
var TuiItemsHandlersDirective = class _TuiItemsHandlersDirective {
  constructor() {
    this.handlers = inject(TUI_ITEMS_HANDLERS, {
      skipSelf: true
    });
    this.stringify = input(this.handlers.stringify());
    this.identityMatcher = input(this.handlers.identityMatcher());
    this.disabledItemHandler = input(this.handlers.disabledItemHandler());
  }
  static {
    this.\u0275fac = function TuiItemsHandlersDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiItemsHandlersDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiItemsHandlersDirective,
      inputs: {
        stringify: [1, "stringify"],
        identityMatcher: [1, "identityMatcher"],
        disabledItemHandler: [1, "disabledItemHandler"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiProvide(TUI_ITEMS_HANDLERS, _TuiItemsHandlersDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiItemsHandlersDirective, [{
    type: Directive,
    args: [{
      providers: [tuiProvide(TUI_ITEMS_HANDLERS, TuiItemsHandlersDirective)]
    }]
  }], null, null);
})();
var TuiWithItemsHandlers = class _TuiWithItemsHandlers {
  static {
    this.\u0275fac = function TuiWithItemsHandlers_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithItemsHandlers)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiWithItemsHandlers,
      features: [\u0275\u0275HostDirectivesFeature([{
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
    });
    this.disabledItemHandler = (value) => Array.isArray(value) ? value.some((item) => this.handlers.disabledItemHandler()(item)) : Boolean(value) && this.handlers.disabledItemHandler()(value);
    this.validate = ({
      value
    }) => this.disabledItemHandler(value) ? {
      tuiDisabledItem: value
    } : null;
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiItemsHandlersValidator_BaseFactory;
      return function TuiItemsHandlersValidator_Factory(__ngFactoryType__) {
        return (\u0275TuiItemsHandlersValidator_BaseFactory || (\u0275TuiItemsHandlersValidator_BaseFactory = \u0275\u0275getInheritedFactory(_TuiItemsHandlersValidator)))(__ngFactoryType__ || _TuiItemsHandlersValidator);
      };
    })();
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiItemsHandlersValidator,
      features: [\u0275\u0275ProvidersFeature([tuiProvide(NG_VALIDATORS, _TuiItemsHandlersValidator, true)]), \u0275\u0275InheritDefinitionFeature]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiItemsHandlersValidator, [{
    type: Directive,
    args: [{
      providers: [tuiProvide(NG_VALIDATORS, TuiItemsHandlersValidator, true)]
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-pipes-filter-by-input.mjs
var TUI_FILTER_BY_INPUT_DEFAULT_OPTIONS = {
  filter: (items, search, stringify) => items.find((x) => TUI_STRICT_MATCHER(x, search, stringify)) ? items : items.filter((x) => TUI_DEFAULT_MATCHER(x, search, stringify))
};
var [TUI_FILTER_BY_INPUT_OPTIONS, tuiFilterByInputOptionsProvider] = tuiCreateOptions(TUI_FILTER_BY_INPUT_DEFAULT_OPTIONS);
var TuiFilterByInputPipe = class _TuiFilterByInputPipe {
  constructor() {
    this.options = inject(TUI_FILTER_BY_INPUT_OPTIONS);
    this.search = inject(TUI_TEXTFIELD_VALUE);
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.filter = signal(this.options.filter);
    this.filterFlat = computed((filter2 = this.filter(), search = this.search(), stringify = this.handlers.stringify()) => (items) => filter2(items, search, stringify));
    this.items = signal([]);
    this.filtered = computed((items = this.items(), filter2 = this.filterFlat()) => items && (tuiIsFlat(items) ? filter2(items) : this.filter2d(items)));
  }
  transform(items, filter2 = this.options.filter) {
    untracked(() => {
      this.items.set(items);
      this.filter.set(filter2);
    });
    return this.filtered();
  }
  filter2d(groups) {
    const groupMap = new Map(groups.flatMap((group, i) => group.map((item) => [item, i])));
    const filteredGroups = [];
    this.filterFlat()(groups.flat()).forEach((item) => {
      const i = groupMap.get(item);
      filteredGroups[i] = filteredGroups[i]?.concat(item) ?? [item];
    });
    return filteredGroups;
  }
  static {
    this.\u0275fac = function TuiFilterByInputPipe_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiFilterByInputPipe)();
    };
  }
  static {
    this.\u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
      name: "tuiFilterByInput",
      type: _TuiFilterByInputPipe,
      pure: false
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiFilterByInputPipe, [{
    type: Pipe,
    args: [{
      name: "tuiFilterByInput",
      pure: false
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-textfield.mjs
var _c03 = ["ghost"];
var _c12 = ["vcr"];
var _c2 = [[["input"]], [["select"]], [["textarea"]], [["label", "tuiLabel", ""]], "*", [["tui-icon"]]];
var _c3 = ["input", "select", "textarea", "label[tuiLabel]", "*", "tui-icon"];
var _c4 = (a0) => ({
  $implicit: a0
});
function TuiTextfieldComponent_Conditional_0_Template(rf, ctx) {
}
function TuiTextfieldComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 7);
    \u0275\u0275listener("click", function TuiTextfieldComponent_Conditional_11_Template_button_click_0_listener() {
      let tmp_4_0;
      \u0275\u0275restoreView(_r3);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView((tmp_4_0 = ctx_r3.accessor()) == null ? null : tmp_4_0.setValue(null));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r3.clear(), " ");
  }
}
function TuiTextfieldComponent_Conditional_13_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const text_r5 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r5, " ");
  }
}
function TuiTextfieldComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275template(1, TuiTextfieldComponent_Conditional_13_ng_container_1_Template, 2, 1, "ng-container", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("tuiCell", ctx_r3.options.size());
    \u0275\u0275advance();
    \u0275\u0275property("polymorpheusOutlet", ctx_r3.content())("polymorpheusOutletContext", \u0275\u0275pureFunction1(3, _c4, (tmp_5_0 = ctx_r3.control()) == null ? null : tmp_5_0.value));
  }
}
function TuiTextfieldComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 6, 2);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r3.computedFiller());
  }
}
function TuiTextfieldItemComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const text_r1 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(text_r1);
  }
}
var _c5 = [[["label", "tuiLabel", ""]], [["input"]], [["select"]], "*", [["tui-icon"]]];
var _c6 = ["label[tuiLabel]", "input", "select", "*", "tui-icon"];
var _c7 = (a0, a1) => ({
  item: a0,
  index: a1
});
function TuiTextfieldMultiComponent_Conditional_0_Template(rf, ctx) {
}
function TuiTextfieldMultiComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tui-scroll-controls", 3);
  }
}
function TuiTextfieldMultiComponent_For_7_ng_template_0_Template(rf, ctx) {
}
function TuiTextfieldMultiComponent_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, TuiTextfieldMultiComponent_For_7_ng_template_0_Template, 0, 0, "ng-template", 5);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const $index_r4 = ctx.$index;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("polymorpheusOutlet", ctx_r4.component)("polymorpheusOutletContext", \u0275\u0275pureFunction1(5, _c4, \u0275\u0275pureFunction2(2, _c7, item_r3, $index_r4)));
  }
}
function TuiTextfieldMultiComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r4.placeholder);
  }
}
function TuiTextfieldMultiComponent_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 12);
    \u0275\u0275listener("click", function TuiTextfieldMultiComponent_Conditional_16_Template_button_click_0_listener() {
      let tmp_5_0;
      \u0275\u0275restoreView(_r7);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView((tmp_5_0 = ctx_r4.accessor()) == null ? null : tmp_5_0.setValue([]));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r4.clear(), " ");
  }
}
function TuiTextfieldMultiComponent_Conditional_20_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const text_r8 = ctx.polymorpheusOutlet;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", text_r8, " ");
  }
}
function TuiTextfieldMultiComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275template(1, TuiTextfieldMultiComponent_Conditional_20_ng_container_1_Template, 2, 1, "ng-container", 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275property("tuiCell", ctx_r4.options.size());
    \u0275\u0275advance();
    \u0275\u0275property("polymorpheusOutlet", ctx_r4.content())("polymorpheusOutletContext", \u0275\u0275pureFunction1(3, _c4, (tmp_6_0 = ctx_r4.control()) == null ? null : tmp_6_0.value));
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
var TuiTextfieldOptionsDirective = class _TuiTextfieldOptionsDirective {
  constructor() {
    this.options = inject(TUI_TEXTFIELD_OPTIONS, {
      skipSelf: true
    });
    this.appearance = input(this.options.appearance(), {
      alias: "tuiTextfieldAppearance"
    });
    this.size = input(this.options.size(), {
      alias: "tuiTextfieldSize",
      transform: (size) => size || DEFAULT.size
    });
    this.cleaner = input(this.options.cleaner(), {
      alias: "tuiTextfieldCleaner"
    });
  }
  static {
    this.\u0275fac = function TuiTextfieldOptionsDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldOptionsDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiTextfieldOptionsDirective,
      selectors: [["", "tuiTextfieldAppearance", ""], ["", "tuiTextfieldSize", ""], ["", "tuiTextfieldCleaner", ""]],
      inputs: {
        appearance: [1, "tuiTextfieldAppearance", "appearance"],
        size: [1, "tuiTextfieldSize", "size"],
        cleaner: [1, "tuiTextfieldCleaner", "cleaner"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiProvide(TUI_TEXTFIELD_OPTIONS, _TuiTextfieldOptionsDirective)])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldOptionsDirective, [{
    type: Directive,
    args: [{
      selector: "[tuiTextfieldAppearance],[tuiTextfieldSize],[tuiTextfieldCleaner]",
      providers: [tuiProvide(TUI_TEXTFIELD_OPTIONS, TuiTextfieldOptionsDirective)]
    }]
  }], null, null);
})();
var TuiSelectLike = class _TuiSelectLike {
  constructor() {
    this.el = tuiInjectElement();
    this.isAndroid = inject(WA_IS_ANDROID);
    this.isMobile = inject(WA_IS_MOBILE);
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
    this.\u0275fac = function TuiSelectLike_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiSelectLike)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiSelectLike,
      selectors: [["", "tuiSelectLike", ""]],
      hostAttrs: ["autocomplete", "off", "inputmode", "none", "spellcheck", "false", "tuiSelectLike", ""],
      hostBindings: function TuiSelectLike_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("beforeinput", function TuiSelectLike_beforeinput_HostBindingHandler($event) {
            return ctx.isMobile && $event.inputType.includes("insertText") || ctx.options.cleaner() && $event.inputType.includes("delete") || $event.preventDefault();
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
      selector: "[tuiSelectLike]",
      host: {
        autocomplete: "off",
        inputmode: "none",
        spellcheck: "false",
        tuiSelectLike: "",
        // Click on cleaner icon does not trigger `beforeinput` event --> handle all kind of deletion in input event
        "(beforeinput)": '(isMobile && $event.inputType.includes("insertText")) || options.cleaner() && $event.inputType.includes("delete") || $event.preventDefault()',
        "(input.capture)": '$event.inputType?.includes("delete") && clear()',
        "(keydown.backspace)": "options.cleaner() && clear()",
        // No (input) event if caret is at the beginning
        "(keydown.delete)": "options.cleaner() && clear()",
        // No (input) event if caret is at the end
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
var TuiTextfieldComponent = class _TuiTextfieldComponent {
  constructor() {
    this.focusedIn = tuiFocusedIn(tuiInjectElement());
    this.ghost = viewChild("ghost");
    this.dropdown = inject(TuiDropdownDirective);
    this.open = inject(TuiDropdownOpen);
    this.clear = inject(TUI_CLEAR_WORD);
    this.label = contentChild(forwardRef(() => TuiLabel), {
      read: ElementRef
    });
    this.computedFiller = computed((value = this.value()) => {
      const filler = this.filler();
      if (filler.length <= value.length) {
        return "";
      }
      return this.input()?.nativeElement.matches('[dir="rtl"] :scope') ? `${filler.slice(0, filler.length - value.length)}${value}` : `${value}${filler.slice(value.length)}`;
    });
    this.showFiller = computed(() => this.focused() && !!this.computedFiller() && (!!this.value() || !this.input()?.nativeElement.placeholder));
    this.accessor = contentChild(TUI_TEXTFIELD_ACCESSOR);
    this.vcr = viewChild("vcr", {
      read: ViewContainerRef
    });
    this.control = contentChild(NgControl);
    this.child = contentChild(TuiControl);
    this.auxiliaries = contentChildren(TUI_AUXILIARY, {
      descendants: true
    });
    this.focused = computed(() => this.open.open() || this.focusedIn());
    this.options = inject(TUI_TEXTFIELD_OPTIONS);
    this.el = tuiInjectElement();
    this.input = contentChild(TUI_TEXTFIELD_ACCESSOR, {
      read: ElementRef
    });
    this.content = input();
    this.filler = input("");
    this.value = tuiValue(this.input);
  }
  get disabled() {
    return this.control()?.disabled ?? this.input()?.nativeElement?.disabled ?? false;
  }
  get size() {
    return this.options.size();
  }
  handleOption(option) {
    this.accessor()?.setValue(option);
    this.open.open.set(false);
  }
  get hasLabel() {
    return Boolean(this.label()?.nativeElement?.childNodes.length);
  }
  onResize({
    clientWidth
  }) {
    this.el.style.setProperty("--t-side", tuiPx(clientWidth));
  }
  // Click on ::before,::after pseudo-elements ([iconStart] / [iconEnd])
  onIconClick() {
    this.input()?.nativeElement.focus();
    if (!this.open.enabled() || this.input()?.nativeElement.matches("input:read-only,textarea:read-only")) {
      return;
    }
    this.open.open.update((open) => !open);
    try {
      this.input()?.nativeElement.showPicker?.();
    } catch {
    }
  }
  onScroll(element) {
    const input2 = this.input();
    if (input2?.nativeElement === element) {
      this.ghost()?.nativeElement.scrollTo({
        left: input2?.nativeElement.scrollLeft
      });
    }
  }
  static {
    this.\u0275fac = function TuiTextfieldComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiTextfieldComponent,
      selectors: [["tui-textfield", 3, "multi", ""]],
      contentQueries: function TuiTextfieldComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.label, TuiLabel, 5, ElementRef)(dirIndex, ctx.accessor, TUI_TEXTFIELD_ACCESSOR, 5)(dirIndex, ctx.control, NgControl, 5)(dirIndex, ctx.child, TuiControl, 5)(dirIndex, ctx.auxiliaries, TUI_AUXILIARY, 5)(dirIndex, ctx.input, TUI_TEXTFIELD_ACCESSOR, 5, ElementRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance(6);
        }
      },
      viewQuery: function TuiTextfieldComponent_Query(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275viewQuerySignal(ctx.ghost, _c03, 5)(ctx.vcr, _c12, 5, ViewContainerRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance(2);
        }
      },
      hostAttrs: [1, "tui-interactive"],
      hostVars: 7,
      hostBindings: function TuiTextfieldComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("animationcancel", function TuiTextfieldComponent_animationcancel_HostBindingHandler() {
            return 0;
          })("animationstart", function TuiTextfieldComponent_animationstart_HostBindingHandler() {
            return 0;
          })("click.self.prevent", function TuiTextfieldComponent_click_self_prevent_HostBindingHandler() {
            return 0;
          })("pointerdown.self.prevent", function TuiTextfieldComponent_pointerdown_self_prevent_HostBindingHandler() {
            return ctx.onIconClick();
          })("scroll.capture.zoneless", function TuiTextfieldComponent_scroll_capture_zoneless_HostBindingHandler($event) {
            return ctx.onScroll($event.target);
          })("tuiActiveZoneChange", function TuiTextfieldComponent_tuiActiveZoneChange_HostBindingHandler($event) {
            let tmp_0_0;
            return !$event && ((tmp_0_0 = ctx.control()) == null ? null : tmp_0_0.valueAccessor == null ? null : tmp_0_0.valueAccessor.onTouched == null ? null : tmp_0_0.valueAccessor.onTouched());
          });
        }
        if (rf & 2) {
          let tmp_3_0;
          \u0275\u0275attribute("data-size", ctx.options.size());
          \u0275\u0275classProp("_disabled", ctx.disabled)("_with-label", ctx.hasLabel)("_with-template", ctx.content() && ((tmp_3_0 = ctx.control()) == null ? null : tmp_3_0.value) != null);
        }
      },
      inputs: {
        content: [1, "content"],
        filler: [1, "filler"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiButtonXOptionsProvider(() => inject(TUI_BUTTON_OPTIONS)), tuiAsDataListHost(_TuiTextfieldComponent), {
        provide: TUI_TEXTFIELD_VALUE,
        useFactory: () => inject(_TuiTextfieldComponent).value
      }]), \u0275\u0275HostDirectivesFeature([TuiAppearance, TuiDropdownDirective, TuiDropdownFixed, TuiWithDropdownOpen, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent])],
      ngContentSelectors: _c3,
      decls: 15,
      vars: 6,
      consts: [["side", ""], ["vcr", ""], ["ghost", ""], [1, "t-content", 3, "pointerdown", "resize"], ["tabindex", "-1", "tuiButtonX", ""], [1, "t-template", 3, "tuiCell"], ["aria-hidden", "true", "disabled", "", 1, "t-filler", 3, "value"], ["tabindex", "-1", "tuiButtonX", "", 3, "click"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiTextfieldComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = \u0275\u0275getCurrentView();
          \u0275\u0275projectionDef(_c2);
          \u0275\u0275conditionalCreate(0, TuiTextfieldComponent_Conditional_0_Template, 0, 0);
          \u0275\u0275pipe(1, "async");
          \u0275\u0275projection(2);
          \u0275\u0275projection(3, 1);
          \u0275\u0275projection(4, 2);
          \u0275\u0275projection(5, 3);
          \u0275\u0275elementStart(6, "span", 3, 0);
          \u0275\u0275listener("pointerdown", function TuiTextfieldComponent_Template_span_pointerdown_6_listener() {
            let tmp_3_0;
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView((tmp_3_0 = ctx.input()) == null ? null : tmp_3_0.nativeElement == null ? null : tmp_3_0.nativeElement.focus());
          })("resize", function TuiTextfieldComponent_Template_span_resize_6_listener() {
            \u0275\u0275restoreView(_r1);
            const side_r2 = \u0275\u0275reference(7);
            return \u0275\u0275resetView(ctx.onResize(side_r2));
          });
          \u0275\u0275projection(8, 4);
          \u0275\u0275elementContainer(9, null, 1);
          \u0275\u0275conditionalCreate(11, TuiTextfieldComponent_Conditional_11_Template, 2, 1, "button", 4);
          \u0275\u0275projection(12, 5);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(13, TuiTextfieldComponent_Conditional_13_Template, 2, 5, "span", 5);
          \u0275\u0275conditionalCreate(14, TuiTextfieldComponent_Conditional_14_Template, 2, 1, "input", 6);
        }
        if (rf & 2) {
          let tmp_2_0;
          let tmp_4_0;
          \u0275\u0275conditional(((tmp_2_0 = ctx.child()) == null ? null : tmp_2_0.value()) ?? \u0275\u0275pipeBind1(1, 4, (tmp_2_0 = ctx.control()) == null ? null : tmp_2_0.control == null ? null : tmp_2_0.control.valueChanges) ? 0 : -1);
          \u0275\u0275advance(11);
          \u0275\u0275conditional(ctx.options.cleaner() ? 11 : -1);
          \u0275\u0275advance(2);
          \u0275\u0275conditional(((tmp_4_0 = ctx.control()) == null ? null : tmp_4_0.value) != null ? 13 : -1);
          \u0275\u0275advance();
          \u0275\u0275conditional(ctx.showFiller() ? 14 : -1);
        }
      },
      dependencies: [AsyncPipe, PolymorpheusOutlet, TuiButtonX, TuiCell],
      styles: ['tui-textfield:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:calc(var(--tui-duration) / 2);transition-timing-function:var(--tui-curve-productive-standard);--t-height: calc(var(--tui-height-l) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-l);--t-label: 0;--t-label-y: -.75rem;--t-label-font: var(--tui-typography-ui-s);--t-end: 0px;--t-start: 0px;--t-side: 0px;--t-max: .75rem;--t-space: clamp(0px, calc(var(--t-side) + var(--t-end)), var(--t-max));position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-typography-ui-m);box-sizing:border-box;isolation:isolate}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance]{outline:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]{color:var(--tui-text-tertiary)}@media(hover:hover)and (pointer:fine){tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){color:var(--tui-text-secondary)}}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly])[data-state=hover]{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-start]{--t-start: calc(2.5rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:before{z-index:1;block-size:var(--t-height);inline-size:1.5rem;margin-inline-end:1rem;pointer-events:none;max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{position:relative;inline-size:calc(1.5rem + 2 * var(--t-padding));cursor:pointer;margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-1 * var(--t-padding));block-size:var(--t-height);max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template{pointer-events:none}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);--t-max: 0px;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-start]{--t-start: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-end]{--t-end: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:before{font-size:1rem;margin-inline:-.25rem .25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inline-size:calc(.75rem + 2 * var(--t-padding));margin-inline:0 -.5rem;font-size:1rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content{gap:0}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content>*:last-child{margin-inline-end:-.25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-height: calc(var(--tui-height-m) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-typography-ui-xs);--t-label-y: -.5625rem;--t-max: .125rem;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-start]{--t-start: calc(2.125rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:before{margin-inline:-.125rem .75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inline-size:calc(1.25rem + 2 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]>.t-content>*:last-child{margin-inline-end:-.125rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]){pointer-events:none;opacity:var(--tui-disabled-opacity)}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]) [tuiAppearance]:is(._disabled,:disabled,[data-state=disabled]){opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled])>.t-content>tui-icon{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label{--t-label: 1}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label [tuiInput]{inset-block-end:0;padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template._empty,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]._empty{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]{position:absolute;inset-inline:0;inline-size:auto;block-size:var(--t-height);-webkit-appearance:none;appearance:none;background:none;font:inherit;resize:none;outline:none;color:var(--tui-text-primary);box-sizing:border-box;border-radius:inherit;border-width:0;padding-inline-start:calc(var(--t-start) + var(--t-padding));padding-inline-end:calc(var(--t-end) + var(--t-side) + var(--t-padding) + var(--t-space));white-space:nowrap;overflow:hidden}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:is(input,textarea):read-only~.t-filler{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled{animation:tuiPresent 1s infinite;opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][inputmode=none]{caret-color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-template [tuiInput]:first-of-type{color:transparent!important}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled] [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled]:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown):not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty):not(tui-textfield)~[tuiLabel]{font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;max-inline-size:calc(100% - var(--t-start));flex:1;align-self:flex-start;font:inherit;-webkit-user-select:none;user-select:none;padding:calc(var(--t-height) / 2 - .625em) 0;line-height:1.25!important;transition-duration:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]+.t-content{margin-inline-start:0}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"]) select option[value=""]:disabled{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option{background-color:var(--tui-background-elevation-3)}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option:not(:disabled){color:var(--tui-text-primary)}tui-textfield:where(*[data-tui-version="5.16.0"]) button,tui-textfield:where(*[data-tui-version="5.16.0"]) a,tui-textfield:where(*[data-tui-version="5.16.0"]) tui-icon{pointer-events:auto}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:.25rem;margin-inline-start:auto;isolation:isolate;border-radius:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) textarea~.t-content{min-inline-size:.5rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=readonly],[data-state=disabled],._empty) [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty~.t-content [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled~.t-content [tuiButtonX]{display:none}tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler{pointer-events:none!important;color:var(--tui-text-tertiary)}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiFluidTypography]{font-weight:700}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiSelectLike]:not(:read-only){cursor:pointer}tui-textfield:where(*[data-tui-version="5.16.0"]):has(input[type=tel]){direction:ltr}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled) [tuiInput]:not(._empty)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled)[multi]:not(._empty) [tuiLabel]{color:var(--tui-text-negative)}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly]):focus-visible:not([data-focus=false]) [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly])[data-focus=true] [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldComponent, [{
    type: Component,
    args: [{
      selector: "tui-textfield:not([multi])",
      imports: [AsyncPipe, PolymorpheusOutlet, TuiButtonX, TuiCell],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiButtonXOptionsProvider(() => inject(TUI_BUTTON_OPTIONS)), tuiAsDataListHost(TuiTextfieldComponent), {
        provide: TUI_TEXTFIELD_VALUE,
        useFactory: () => inject(TuiTextfieldComponent).value
      }],
      hostDirectives: [TuiAppearance, TuiDropdownDirective, TuiDropdownFixed, TuiWithDropdownOpen, TuiWithIcons, TuiWithItemsHandlers, TuiWithOptionContent],
      host: {
        class: "tui-interactive",
        "[attr.data-size]": "options.size()",
        "[class._disabled]": "disabled",
        // TODO :has([tuiInput]:disabled)
        "[class._with-label]": "hasLabel",
        // TODO :has([tuiLabel]
        "[class._with-template]": "content() && control()?.value != null",
        "(animationcancel)": "0",
        // TODO :has([tuiInput]:disabled)
        "(animationstart)": "0",
        // TODO :has([tuiInput]:disabled)
        "(click.self.prevent)": "0",
        // TODO preventing breaks resize: both, but not preventing breaks focus, fix
        "(pointerdown.self.prevent)": "onIconClick()",
        "(scroll.capture.zoneless)": "onScroll($event.target)",
        "(tuiActiveZoneChange)": "!$event && control()?.valueAccessor?.onTouched?.()"
      },
      template: '@if (child()?.value() ?? (control()?.control?.valueChanges | async)) {}\n<ng-content select="input" />\n<ng-content select="select" />\n<ng-content select="textarea" />\n<ng-content select="label[tuiLabel]" />\n<span\n    #side\n    class="t-content"\n    (pointerdown)="input()?.nativeElement?.focus()"\n    (resize)="onResize(side)"\n>\n    <ng-content />\n    <ng-container #vcr />\n    @if (options.cleaner()) {\n        <button\n            tabindex="-1"\n            tuiButtonX\n            (click)="accessor()?.setValue(null)"\n        >\n            {{ clear() }}\n        </button>\n    }\n    <ng-content select="tui-icon" />\n</span>\n@if (control()?.value != null) {\n    <span\n        class="t-template"\n        [tuiCell]="options.size()"\n    >\n        <ng-container *polymorpheusOutlet="content() as text; context: {$implicit: control()?.value}">\n            {{ text }}\n        </ng-container>\n    </span>\n}\n@if (showFiller()) {\n    <input\n        #ghost\n        aria-hidden="true"\n        disabled\n        class="t-filler"\n        [value]="computedFiller()"\n    />\n}\n',
      styles: ['tui-textfield:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:calc(var(--tui-duration) / 2);transition-timing-function:var(--tui-curve-productive-standard);--t-height: calc(var(--tui-height-l) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-l);--t-label: 0;--t-label-y: -.75rem;--t-label-font: var(--tui-typography-ui-s);--t-end: 0px;--t-start: 0px;--t-side: 0px;--t-max: .75rem;--t-space: clamp(0px, calc(var(--t-side) + var(--t-end)), var(--t-max));position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-typography-ui-m);box-sizing:border-box;isolation:isolate}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance]{outline:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]{color:var(--tui-text-tertiary)}@media(hover:hover)and (pointer:fine){tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){color:var(--tui-text-secondary)}}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly])[data-state=hover]{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-start]{--t-start: calc(2.5rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:before{z-index:1;block-size:var(--t-height);inline-size:1.5rem;margin-inline-end:1rem;pointer-events:none;max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{position:relative;inline-size:calc(1.5rem + 2 * var(--t-padding));cursor:pointer;margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-1 * var(--t-padding));block-size:var(--t-height);max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template{pointer-events:none}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);--t-max: 0px;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-start]{--t-start: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-end]{--t-end: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:before{font-size:1rem;margin-inline:-.25rem .25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inline-size:calc(.75rem + 2 * var(--t-padding));margin-inline:0 -.5rem;font-size:1rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content{gap:0}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content>*:last-child{margin-inline-end:-.25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-height: calc(var(--tui-height-m) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-typography-ui-xs);--t-label-y: -.5625rem;--t-max: .125rem;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-start]{--t-start: calc(2.125rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:before{margin-inline:-.125rem .75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inline-size:calc(1.25rem + 2 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]>.t-content>*:last-child{margin-inline-end:-.125rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]){pointer-events:none;opacity:var(--tui-disabled-opacity)}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]) [tuiAppearance]:is(._disabled,:disabled,[data-state=disabled]){opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled])>.t-content>tui-icon{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label{--t-label: 1}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label [tuiInput]{inset-block-end:0;padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template._empty,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]._empty{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]{position:absolute;inset-inline:0;inline-size:auto;block-size:var(--t-height);-webkit-appearance:none;appearance:none;background:none;font:inherit;resize:none;outline:none;color:var(--tui-text-primary);box-sizing:border-box;border-radius:inherit;border-width:0;padding-inline-start:calc(var(--t-start) + var(--t-padding));padding-inline-end:calc(var(--t-end) + var(--t-side) + var(--t-padding) + var(--t-space));white-space:nowrap;overflow:hidden}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:is(input,textarea):read-only~.t-filler{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled{animation:tuiPresent 1s infinite;opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][inputmode=none]{caret-color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-template [tuiInput]:first-of-type{color:transparent!important}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled] [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled]:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown):not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty):not(tui-textfield)~[tuiLabel]{font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;max-inline-size:calc(100% - var(--t-start));flex:1;align-self:flex-start;font:inherit;-webkit-user-select:none;user-select:none;padding:calc(var(--t-height) / 2 - .625em) 0;line-height:1.25!important;transition-duration:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]+.t-content{margin-inline-start:0}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"]) select option[value=""]:disabled{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option{background-color:var(--tui-background-elevation-3)}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option:not(:disabled){color:var(--tui-text-primary)}tui-textfield:where(*[data-tui-version="5.16.0"]) button,tui-textfield:where(*[data-tui-version="5.16.0"]) a,tui-textfield:where(*[data-tui-version="5.16.0"]) tui-icon{pointer-events:auto}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:.25rem;margin-inline-start:auto;isolation:isolate;border-radius:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) textarea~.t-content{min-inline-size:.5rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=readonly],[data-state=disabled],._empty) [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty~.t-content [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled~.t-content [tuiButtonX]{display:none}tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler{pointer-events:none!important;color:var(--tui-text-tertiary)}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiFluidTypography]{font-weight:700}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiSelectLike]:not(:read-only){cursor:pointer}tui-textfield:where(*[data-tui-version="5.16.0"]):has(input[type=tel]){direction:ltr}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled) [tuiInput]:not(._empty)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled)[multi]:not(._empty) [tuiLabel]{color:var(--tui-text-negative)}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly]):focus-visible:not([data-focus=false]) [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly])[data-focus=true] [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}\n']
    }]
  }], null, null);
})();
var TuiTextfieldItemComponent = class _TuiTextfieldItemComponent {
  constructor() {
    this.el = tuiInjectElement();
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.context = injectContext();
    this.textfield = inject(TuiTextfieldMultiComponent);
    this.content = computed(() => this.textfield.item() ?? this.handlers.stringify()(this.context.$implicit.item));
  }
  prevent(e) {
    this.textfield.focused() && e.preventDefault();
  }
  static {
    this.\u0275fac = function TuiTextfieldItemComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldItemComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiTextfieldItemComponent,
      selectors: [["tui-textfield-item"]],
      hostVars: 4,
      hostBindings: function TuiTextfieldItemComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("keydown.arrowLeft.prevent", function TuiTextfieldItemComponent_keydown_arrowLeft_prevent_HostBindingHandler() {
            return ctx.el.previousElementSibling == null ? null : ctx.el.previousElementSibling.firstChild == null ? null : ctx.el.previousElementSibling.firstChild.focus();
          })("keydown.arrowRight.prevent", function TuiTextfieldItemComponent_keydown_arrowRight_prevent_HostBindingHandler() {
            return ctx.el.nextElementSibling == null ? null : ctx.el.nextElementSibling.firstChild == null ? null : ctx.el.nextElementSibling.firstChild.focus();
          })("pointerdown.self", function TuiTextfieldItemComponent_pointerdown_self_HostBindingHandler($event) {
            return ctx.prevent($event);
          });
        }
        if (rf & 2) {
          \u0275\u0275classProp("_disabled", ctx.handlers.disabledItemHandler()(ctx.context.$implicit.item))("_string", !ctx.textfield.item());
        }
      },
      decls: 1,
      vars: 2,
      consts: [[4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiTextfieldItemComponent_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275template(0, TuiTextfieldItemComponent_ng_container_0_Template, 2, 1, "ng-container", 0);
        }
        if (rf & 2) {
          \u0275\u0275property("polymorpheusOutlet", ctx.content())("polymorpheusOutletContext", ctx.context);
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: ['[_nghost-%COMP%]{display:flex;max-inline-size:100%;flex-shrink:0;white-space:nowrap;text-overflow:ellipsis;color:var(--tui-text-primary)}._string[_nghost-%COMP%]{display:block;overflow:hidden;overflow:clip visible}._string._disabled[_nghost-%COMP%]{opacity:var(--tui-disabled-opacity)}._string[_nghost-%COMP%]:after{content:",\\a0"}[_nghost-%COMP%]:last-of-type{max-inline-size:80%}tui-textfield:not([data-focus="true"])[_nghost-%COMP%]:last-of-type:after, tui-textfield:not([data-focus="true"])   [_nghost-%COMP%]:last-of-type:after{display:none}tui-textfield:has([tuiSelectLike])[_nghost-%COMP%]:last-of-type:after, tui-textfield:has([tuiSelectLike])   [_nghost-%COMP%]:last-of-type:after, tui-textfield[data-mode~="readonly"][_nghost-%COMP%]:last-of-type:after, tui-textfield[data-mode~="readonly"]   [_nghost-%COMP%]:last-of-type:after{content:"\\a0"}']
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldItemComponent, [{
    type: Component,
    args: [{
      selector: "tui-textfield-item",
      imports: [PolymorpheusOutlet],
      template: '<ng-container *polymorpheusOutlet="content() as text; context: context">{{ text }}</ng-container>',
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class._disabled]": "handlers.disabledItemHandler()(context.$implicit.item)",
        "[class._string]": "!textfield.item()",
        "(keydown.arrowLeft.prevent)": "el.previousElementSibling?.firstChild?.focus()",
        "(keydown.arrowRight.prevent)": "el.nextElementSibling?.firstChild?.focus()",
        "(pointerdown.self)": "prevent($event)"
      },
      styles: [':host{display:flex;max-inline-size:100%;flex-shrink:0;white-space:nowrap;text-overflow:ellipsis;color:var(--tui-text-primary)}:host._string{display:block;overflow:hidden;overflow:clip visible}:host._string._disabled{opacity:var(--tui-disabled-opacity)}:host._string:after{content:",\\a0"}:host:last-of-type{max-inline-size:80%}:host-context(tui-textfield:not([data-focus="true"])):last-of-type:after{display:none}:host-context(tui-textfield:has([tuiSelectLike])):last-of-type:after,:host-context(tui-textfield[data-mode~="readonly"]):last-of-type:after{content:"\\a0"}\n']
    }]
  }], null, null);
})();
var TUI_TEXTFIELD_ITEM = new PolymorpheusComponent(TuiTextfieldItemComponent);
var TuiTextfieldMultiComponent = class _TuiTextfieldMultiComponent extends TuiTextfieldComponent {
  constructor() {
    super(...arguments);
    this.height = signal(null);
    this.win = inject(WA_WINDOW);
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.component = TUI_TEXTFIELD_ITEM;
    this.items = computed(() => this.cva()?.value() ?? []);
    this.sub = fromEvent(this.el, "scroll").pipe(filter(() => this.rows() === 1), tuiZonefree(), takeUntilDestroyed()).subscribe(() => {
      this.el.style.setProperty("--t-scroll", tuiPx(-1 * this.el.scrollLeft));
    });
    this.cva = contentChild(TuiControl);
    this.item = contentChild(TuiItem, {
      read: TemplateRef,
      descendants: true
    });
    this.rows = input(100);
  }
  handleOption(option) {
    this.accessor()?.setValue(tuiArrayToggle(this.items(), option, this.handlers.identityMatcher()));
  }
  get placeholder() {
    const el = this.input()?.nativeElement;
    const placeholder = el?.matches("input") ? el.placeholder : this.computedFiller();
    const value = this.computedFiller() || this.value();
    const longer = value.length > placeholder.length ? value : placeholder;
    return this.focused() ? longer : "";
  }
  onItems(target) {
    this.height.update((h) => target.querySelector("tui-textfield-item")?.clientHeight || h);
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
      this.input()?.nativeElement.focus();
    }
  }
  onClick(target) {
    if (target === this.el || !this.cva()?.interactive() || !this.el.matches("[tuiChevron]") && !this.el.querySelector("select, [tuiInputDateMulti]") || target.matches('input:read-only,input[inputmode="none"]')) {
      return;
    }
    this.open.open.update((open) => !open);
    try {
      this.input()?.nativeElement.showPicker?.();
    } catch {
    }
  }
  static {
    this.\u0275fac = /* @__PURE__ */ (() => {
      let \u0275TuiTextfieldMultiComponent_BaseFactory;
      return function TuiTextfieldMultiComponent_Factory(__ngFactoryType__) {
        return (\u0275TuiTextfieldMultiComponent_BaseFactory || (\u0275TuiTextfieldMultiComponent_BaseFactory = \u0275\u0275getInheritedFactory(_TuiTextfieldMultiComponent)))(__ngFactoryType__ || _TuiTextfieldMultiComponent);
      };
    })();
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiTextfieldMultiComponent,
      selectors: [["tui-textfield", "multi", ""]],
      contentQueries: function TuiTextfieldMultiComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          \u0275\u0275contentQuerySignal(dirIndex, ctx.cva, TuiControl, 5)(dirIndex, ctx.item, TuiItem, 5, TemplateRef);
        }
        if (rf & 2) {
          \u0275\u0275queryAdvance(2);
        }
      },
      hostVars: 7,
      hostBindings: function TuiTextfieldMultiComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("click.prevent", function TuiTextfieldMultiComponent_click_prevent_HostBindingHandler($event) {
            return ctx.onClick($event.target);
          })("tuiActiveZoneChange", function TuiTextfieldMultiComponent_tuiActiveZoneChange_HostBindingHandler($event) {
            return !$event && ctx.el.scrollTo({
              left: 0
            });
          });
        }
        if (rf & 2) {
          \u0275\u0275attribute("data-state", ctx.disabled ? "disabled" : null);
          \u0275\u0275styleProp("--t-item-height", ctx.height(), "px")("--t-rows", ctx.rows());
          \u0275\u0275classProp("_empty", !ctx.items().length);
        }
      },
      inputs: {
        rows: [1, "rows"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiButtonXOptionsProvider(() => inject(TUI_BUTTON_OPTIONS)), tuiAsDataListHost(_TuiTextfieldMultiComponent), tuiProvide(TuiTextfieldComponent, _TuiTextfieldMultiComponent), {
        provide: TUI_TEXTFIELD_VALUE,
        useFactory: () => inject(TuiTextfieldComponent).value
      }, tuiFilterByInputOptionsProvider({
        filter: (items, search, stringify) => items.filter((x) => TUI_DEFAULT_MATCHER(x, search, stringify))
      })]), \u0275\u0275HostDirectivesFeature([TuiScrollRef]), \u0275\u0275InheritDefinitionFeature],
      ngContentSelectors: _c6,
      decls: 21,
      vars: 12,
      consts: [["wrapper", ""], ["side", ""], ["vcr", ""], [1, "t-scrollbar"], [1, "t-items", 3, "click", "pointerdown.self.zoneless.prevent", "resize"], [3, "polymorpheusOutlet", "polymorpheusOutletContext"], [1, "t-input", 3, "keydown.arrowLeft"], [1, "t-ghost"], ["aria-hidden", "true", "disabled", "", 1, "t-filler", 3, "value"], [1, "t-content", 3, "click.stop", "pointerdown.zoneless.prevent", "resize"], ["tabindex", "-1", "tuiButtonX", ""], [1, "t-template", 3, "tuiCell"], ["tabindex", "-1", "tuiButtonX", "", 3, "click"], [4, "polymorpheusOutlet", "polymorpheusOutletContext"]],
      template: function TuiTextfieldMultiComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r1 = \u0275\u0275getCurrentView();
          \u0275\u0275projectionDef(_c5);
          \u0275\u0275conditionalCreate(0, TuiTextfieldMultiComponent_Conditional_0_Template, 0, 0);
          \u0275\u0275pipe(1, "async");
          \u0275\u0275conditionalCreate(2, TuiTextfieldMultiComponent_Conditional_2_Template, 1, 0, "tui-scroll-controls", 3);
          \u0275\u0275elementStart(3, "div", 4, 0);
          \u0275\u0275listener("click", function TuiTextfieldMultiComponent_Template_div_click_3_listener() {
            return ctx.focusInput();
          })("pointerdown.self.zoneless.prevent", function TuiTextfieldMultiComponent_Template_div_pointerdown_self_zoneless_prevent_3_listener() {
            return 0;
          })("resize", function TuiTextfieldMultiComponent_Template_div_resize_3_listener() {
            \u0275\u0275restoreView(_r1);
            const wrapper_r2 = \u0275\u0275reference(4);
            return \u0275\u0275resetView(ctx.onItems(wrapper_r2));
          });
          \u0275\u0275projection(5);
          \u0275\u0275repeaterCreate(6, TuiTextfieldMultiComponent_For_7_Template, 1, 7, null, 5, \u0275\u0275repeaterTrackByIdentity);
          \u0275\u0275elementStart(8, "span", 6);
          \u0275\u0275listener("keydown.arrowLeft", function TuiTextfieldMultiComponent_Template_span_keydown_arrowLeft_8_listener($event) {
            return ctx.onLeft($event);
          });
          \u0275\u0275projection(9, 1);
          \u0275\u0275projection(10, 2);
          \u0275\u0275conditionalCreate(11, TuiTextfieldMultiComponent_Conditional_11_Template, 2, 1, "span", 7);
          \u0275\u0275element(12, "input", 8);
          \u0275\u0275elementEnd()();
          \u0275\u0275elementStart(13, "span", 9, 1);
          \u0275\u0275listener("click.stop", function TuiTextfieldMultiComponent_Template_span_click_stop_13_listener() {
            let tmp_4_0;
            \u0275\u0275restoreView(_r1);
            return \u0275\u0275resetView((tmp_4_0 = ctx.input()) == null ? null : tmp_4_0.nativeElement == null ? null : tmp_4_0.nativeElement.focus());
          })("pointerdown.zoneless.prevent", function TuiTextfieldMultiComponent_Template_span_pointerdown_zoneless_prevent_13_listener() {
            return 0;
          })("resize", function TuiTextfieldMultiComponent_Template_span_resize_13_listener() {
            \u0275\u0275restoreView(_r1);
            const side_r6 = \u0275\u0275reference(14);
            return \u0275\u0275resetView(ctx.onResize(side_r6));
          });
          \u0275\u0275projection(15, 3);
          \u0275\u0275conditionalCreate(16, TuiTextfieldMultiComponent_Conditional_16_Template, 2, 1, "button", 10);
          \u0275\u0275elementContainer(17, null, 2);
          \u0275\u0275projection(19, 4);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(20, TuiTextfieldMultiComponent_Conditional_20_Template, 2, 5, "span", 11);
        }
        if (rf & 2) {
          let tmp_3_0;
          let tmp_11_0;
          \u0275\u0275conditional(((tmp_3_0 = ctx.child()) == null ? null : tmp_3_0.value()) ?? \u0275\u0275pipeBind1(1, 10, (tmp_3_0 = ctx.control()) == null ? null : tmp_3_0.control == null ? null : tmp_3_0.control.valueChanges) ? 0 : -1);
          \u0275\u0275advance(2);
          \u0275\u0275conditional(ctx.rows() > 1 ? 2 : -1);
          \u0275\u0275advance();
          \u0275\u0275classProp("t-items_horizontal", ctx.rows() === 1);
          \u0275\u0275advance(3);
          \u0275\u0275repeater(ctx.items());
          \u0275\u0275advance(5);
          \u0275\u0275conditional(ctx.placeholder ? 11 : -1);
          \u0275\u0275advance();
          \u0275\u0275classProp("t-filler_hidden", !ctx.showFiller());
          \u0275\u0275property("value", ctx.computedFiller());
          \u0275\u0275advance(4);
          \u0275\u0275conditional(ctx.options.cleaner() ? 16 : -1);
          \u0275\u0275advance(4);
          \u0275\u0275conditional(((tmp_11_0 = ctx.control()) == null ? null : tmp_11_0.value) != null ? 20 : -1);
        }
      },
      dependencies: [AsyncPipe, PolymorpheusOutlet, TuiButtonX, TuiCell, TuiScrollControls],
      styles: ['tui-textfield:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:calc(var(--tui-duration) / 2);transition-timing-function:var(--tui-curve-productive-standard);--t-height: calc(var(--tui-height-l) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-l);--t-label: 0;--t-label-y: -.75rem;--t-label-font: var(--tui-typography-ui-s);--t-end: 0px;--t-start: 0px;--t-side: 0px;--t-max: .75rem;--t-space: clamp(0px, calc(var(--t-side) + var(--t-end)), var(--t-max));position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-typography-ui-m);box-sizing:border-box;isolation:isolate}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance]{outline:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]{color:var(--tui-text-tertiary)}@media(hover:hover)and (pointer:fine){tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){color:var(--tui-text-secondary)}}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly])[data-state=hover]{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-start]{--t-start: calc(2.5rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:before{z-index:1;block-size:var(--t-height);inline-size:1.5rem;margin-inline-end:1rem;pointer-events:none;max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{position:relative;inline-size:calc(1.5rem + 2 * var(--t-padding));cursor:pointer;margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-1 * var(--t-padding));block-size:var(--t-height);max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template{pointer-events:none}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);--t-max: 0px;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-start]{--t-start: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-end]{--t-end: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:before{font-size:1rem;margin-inline:-.25rem .25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inline-size:calc(.75rem + 2 * var(--t-padding));margin-inline:0 -.5rem;font-size:1rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content{gap:0}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content>*:last-child{margin-inline-end:-.25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-height: calc(var(--tui-height-m) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-typography-ui-xs);--t-label-y: -.5625rem;--t-max: .125rem;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-start]{--t-start: calc(2.125rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:before{margin-inline:-.125rem .75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inline-size:calc(1.25rem + 2 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]>.t-content>*:last-child{margin-inline-end:-.125rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]){pointer-events:none;opacity:var(--tui-disabled-opacity)}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]) [tuiAppearance]:is(._disabled,:disabled,[data-state=disabled]){opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled])>.t-content>tui-icon{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label{--t-label: 1}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label [tuiInput]{inset-block-end:0;padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template._empty,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]._empty{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]{position:absolute;inset-inline:0;inline-size:auto;block-size:var(--t-height);-webkit-appearance:none;appearance:none;background:none;font:inherit;resize:none;outline:none;color:var(--tui-text-primary);box-sizing:border-box;border-radius:inherit;border-width:0;padding-inline-start:calc(var(--t-start) + var(--t-padding));padding-inline-end:calc(var(--t-end) + var(--t-side) + var(--t-padding) + var(--t-space));white-space:nowrap;overflow:hidden}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:is(input,textarea):read-only~.t-filler{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled{animation:tuiPresent 1s infinite;opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][inputmode=none]{caret-color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-template [tuiInput]:first-of-type{color:transparent!important}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled] [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled]:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown):not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty):not(tui-textfield)~[tuiLabel]{font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;max-inline-size:calc(100% - var(--t-start));flex:1;align-self:flex-start;font:inherit;-webkit-user-select:none;user-select:none;padding:calc(var(--t-height) / 2 - .625em) 0;line-height:1.25!important;transition-duration:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]+.t-content{margin-inline-start:0}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"]) select option[value=""]:disabled{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option{background-color:var(--tui-background-elevation-3)}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option:not(:disabled){color:var(--tui-text-primary)}tui-textfield:where(*[data-tui-version="5.16.0"]) button,tui-textfield:where(*[data-tui-version="5.16.0"]) a,tui-textfield:where(*[data-tui-version="5.16.0"]) tui-icon{pointer-events:auto}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:.25rem;margin-inline-start:auto;isolation:isolate;border-radius:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) textarea~.t-content{min-inline-size:.5rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=readonly],[data-state=disabled],._empty) [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty~.t-content [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled~.t-content [tuiButtonX]{display:none}tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler{pointer-events:none!important;color:var(--tui-text-tertiary)}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiFluidTypography]{font-weight:700}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiSelectLike]:not(:read-only){cursor:pointer}tui-textfield:where(*[data-tui-version="5.16.0"]):has(input[type=tel]){direction:ltr}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled) [tuiInput]:not(._empty)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled)[multi]:not(._empty) [tuiLabel]{color:var(--tui-text-negative)}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly]):focus-visible:not([data-focus=false]) [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly])[data-focus=true] [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]){flex-wrap:nowrap;overflow:scroll;align-items:stretch;cursor:text;max-block-size:calc(var(--t-vertical) * 2 + var(--t-item-height) * var(--t-rows));overscroll-behavior-x:none;scroll-behavior:var(--tui-scroll-behavior)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):before,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):after{position:sticky;inset-block-start:0;inset-inline-start:0;block-size:10rem;min-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)));max-block-size:calc((var(--t-item-height, calc(var(--t-height) - 2 * var(--t-vertical))) + 2 * var(--t-vertical)) * (1 - .2 * var(--t-zoom)))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-scrollbar{transform:translate(calc(var(--t-padding) * var(--tui-inline)));margin-inline-start:calc(-1 * var(--t-start));margin-inline-end:calc(1px - 100% + var(--t-start))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-scrollbar .t-bar_horizontal{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items{position:sticky;z-index:-1;display:flex;inset-inline-start:var(--t-start);min-inline-size:0;min-block-size:var(--t-height);block-size:fit-content;flex:1;align-items:center;flex-wrap:wrap;padding:var(--t-vertical) 0;transition-duration:inherit;box-sizing:border-box;view-timeline:--t-scrollbar-y y}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items:after{content:"";min-inline-size:1px;min-block-size:1px}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal{clip-path:inset(0 0 0 calc(var(--t-start) / 2 - var(--t-padding) - .5rem));flex-wrap:nowrap}[dir=rtl] tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal{clip-path:inset(0 calc(var(--t-start) / 2 - var(--t-padding) - .5rem) 0 0)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal>.t-input{padding-inline-end:calc(var(--t-side) + var(--t-end) + var(--t-padding) + .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input{position:relative;display:flex;align-items:center;flex:1;block-size:var(--t-item-height, 1.25em);max-block-size:calc(var(--t-height) - 2 * var(--t-vertical));max-inline-size:100%;pointer-events:none;transform:translate(var(--t-scroll))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-filler,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input [tuiInput]{inset-block-start:-5%;block-size:110%;padding:0;pointer-events:auto}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-ghost{visibility:hidden;white-space:pre;text-overflow:clip;padding-inline-end:.125rem;block-size:100%}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-filler_hidden{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=l]{--t-vertical: .5625rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=l] tui-textfield-item:first-of-type{margin-block-start:1.125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=m]{--t-vertical: .4375rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=m] tui-textfield-item:first-of-type{margin-block-start:.875rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label>.t-items{align-items:flex-end}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label>.t-items>label[tuiLabel]{min-inline-size:100%;margin:calc(var(--t-height) / 2 - var(--t-vertical) - .625em) 0;margin-inline-end:-100%;padding:0}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-content{position:sticky;min-block-size:var(--t-height);block-size:calc(var(--t-item-height) + 2 * var(--t-vertical));inset-block-start:0;inset-inline-start:calc(100% - var(--t-side) - var(--t-end))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items input:not(:focus)::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]>.t-items input::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]>.t-items label~.t-input input::placeholder{opacity:0}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty>.t-items input::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-focus=true]:not([data-mode~=readonly]):not(:focus-within)>.t-items input::placeholder{opacity:1}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-state=disabled],tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]{pointer-events:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-state=disabled] select,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly] select{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=l]{--t-vertical: .625rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=l]:after{inset-inline-start:calc(100% - var(--t-end) - var(--t-padding) + .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-vertical: .5rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]:before{inset-inline-start:-.125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inset-inline-start:calc(100% - var(--t-end) - .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-vertical: .125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]:before{inset-inline-start:-.25rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inset-inline-start:calc(100% - var(--t-end))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) tui-textfield-item{transform:translate(var(--t-scroll))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) input::placeholder{transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) select{opacity:0;pointer-events:none!important}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty>.t-items select~.t-filler{display:block}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty:not([data-focus=true])>.t-items select~.t-filler{color:var(--tui-text-secondary)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):has([tuiSelectLike]){cursor:pointer}\n'],
      encapsulation: 2
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldMultiComponent, [{
    type: Component,
    args: [{
      selector: "tui-textfield[multi]",
      imports: [AsyncPipe, PolymorpheusOutlet, TuiButtonX, TuiCell, TuiScrollControls],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [tuiButtonOptionsProvider({
        size: "xs",
        appearance: "icon"
      }), tuiButtonXOptionsProvider(() => inject(TUI_BUTTON_OPTIONS)), tuiAsDataListHost(TuiTextfieldMultiComponent), tuiProvide(TuiTextfieldComponent, TuiTextfieldMultiComponent), {
        provide: TUI_TEXTFIELD_VALUE,
        useFactory: () => inject(TuiTextfieldComponent).value
      }, tuiFilterByInputOptionsProvider({
        filter: (items, search, stringify) => items.filter((x) => TUI_DEFAULT_MATCHER(x, search, stringify))
      })],
      hostDirectives: [TuiScrollRef],
      host: {
        "[attr.data-state]": 'disabled ? "disabled" : null',
        "[class._empty]": "!items().length",
        "[style.--t-item-height.px]": "height()",
        "[style.--t-rows]": "rows()",
        "(click.prevent)": "onClick($event.target)",
        "(tuiActiveZoneChange)": "!$event && el.scrollTo({left: 0})"
      },
      template: '@if (child()?.value() ?? (control()?.control?.valueChanges | async)) {}\n@if (rows() > 1) {\n    <tui-scroll-controls class="t-scrollbar" />\n}\n\n<div\n    #wrapper\n    class="t-items"\n    [class.t-items_horizontal]="rows() === 1"\n    (click)="focusInput()"\n    (pointerdown.self.zoneless.prevent)="(0)"\n    (resize)="onItems(wrapper)"\n>\n    <ng-content select="label[tuiLabel]" />\n    @for (item of items(); track item) {\n        <ng-template\n            [polymorpheusOutlet]="component"\n            [polymorpheusOutletContext]="{$implicit: {item, index: $index}}"\n        />\n    }\n    <span\n        class="t-input"\n        (keydown.arrowLeft)="onLeft($event)"\n    >\n        <ng-content select="input" />\n        <ng-content select="select" />\n        @if (placeholder) {\n            <span class="t-ghost">{{ placeholder }}</span>\n        }\n        <input\n            aria-hidden="true"\n            disabled\n            class="t-filler"\n            [class.t-filler_hidden]="!showFiller()"\n            [value]="computedFiller()"\n        />\n    </span>\n</div>\n\n<span\n    #side\n    class="t-content"\n    (click.stop)="input()?.nativeElement?.focus()"\n    (pointerdown.zoneless.prevent)="(0)"\n    (resize)="onResize(side)"\n>\n    <ng-content />\n    @if (options.cleaner()) {\n        <button\n            tabindex="-1"\n            tuiButtonX\n            (click)="accessor()?.setValue([])"\n        >\n            {{ clear() }}\n        </button>\n    }\n    <ng-container #vcr />\n    <ng-content select="tui-icon" />\n</span>\n\n@if (control()?.value != null) {\n    <span\n        class="t-template"\n        [tuiCell]="options.size()"\n    >\n        <ng-container *polymorpheusOutlet="content() as text; context: {$implicit: control()?.value}">\n            {{ text }}\n        </ng-container>\n    </span>\n}\n',
      styles: ['tui-textfield:where(*[data-tui-version="5.16.0"]){scrollbar-width:none;-ms-overflow-style:none;transition-property:color;transition-duration:calc(var(--tui-duration) / 2);transition-timing-function:var(--tui-curve-productive-standard);--t-height: calc(var(--tui-height-l) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-l);--t-label: 0;--t-label-y: -.75rem;--t-label-font: var(--tui-typography-ui-s);--t-end: 0px;--t-start: 0px;--t-side: 0px;--t-max: .75rem;--t-space: clamp(0px, calc(var(--t-side) + var(--t-end)), var(--t-max));position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;min-block-size:var(--t-height);padding:0 var(--t-padding);border-radius:var(--tui-radius-l);font:var(--tui-typography-ui-m);box-sizing:border-box;isolation:isolate}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar,tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-scrollbar-thumb{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance]{outline:none}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]{color:var(--tui-text-tertiary)}@media(hover:hover)and (pointer:fine){tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly]):is(a,button,select,textarea,input,label,.tui-interactive):not(:disabled):hover:not([data-state]){color:var(--tui-text-secondary)}}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=""]:not([data-mode~=readonly])[data-state=hover]{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-start]{--t-start: calc(2.5rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:before{z-index:1;block-size:var(--t-height);inline-size:1.5rem;margin-inline-end:1rem;pointer-events:none;max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{position:relative;inline-size:calc(1.5rem + 2 * var(--t-padding));cursor:pointer;margin-inline-start:calc(.25rem - var(--t-padding));margin-inline-end:calc(-1 * var(--t-padding));block-size:var(--t-height);max-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])::-webkit-resizer{border:.25rem solid transparent;inline-size:.5rem;block-size:.5rem;box-sizing:content-box;color:var(--tui-text-tertiary);background:linear-gradient(-45deg,transparent,transparent .125rem,currentColor .125rem,currentColor .1875rem,transparent .1875rem,transparent .25rem,currentColor .25rem,currentColor .3125rem,transparent .35rem);background-clip:content-box}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template{pointer-events:none}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-height: var(--tui-height-s);--t-padding: var(--tui-padding-s);--t-max: 0px;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-start]{--t-start: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s][data-icon-end]{--t-end: 1.5rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:before{font-size:1rem;margin-inline:-.25rem .25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inline-size:calc(.75rem + 2 * var(--t-padding));margin-inline:0 -.5rem;font-size:1rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content{gap:0}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=s]>.t-content>*:last-child{margin-inline-end:-.25rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-height: calc(var(--tui-height-m) + 2.5 * var(--t-label) * var(--tui-font-offset));--t-padding: var(--tui-padding-m);--t-label-font: var(--tui-typography-ui-xs);--t-label-y: -.5625rem;--t-max: .125rem;border-radius:var(--tui-radius-m);font:var(--tui-typography-ui-s)}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-start]{--t-start: calc(2.125rem * (1 + .25 * var(--t-zoom)))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m][data-icon-end]{--t-end: 1.75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:before{margin-inline:-.125rem .75rem}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inline-size:calc(1.25rem + 2 * var(--t-padding));margin-inline-start:calc(.5rem - var(--t-padding))}tui-textfield:where(*[data-tui-version="5.16.0"])[data-size=m]>.t-content>*:last-child{margin-inline-end:-.125rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]){pointer-events:none;opacity:var(--tui-disabled-opacity)}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled]) [tuiAppearance]:is(._disabled,:disabled,[data-state=disabled]){opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"]):is(._disabled,[data-state=disabled])>.t-content>tui-icon{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label{--t-label: 1}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label [tuiInput]{inset-block-end:0;padding-block-start:calc(var(--t-height) / 3);padding-block-end:0}tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly])>.t-template._empty,tui-textfield:where(*[data-tui-version="5.16.0"])._with-label:is(:not([data-focus=true]),[data-mode~=readonly]) [tuiInput]._empty{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]{position:absolute;inset-inline:0;inline-size:auto;block-size:var(--t-height);-webkit-appearance:none;appearance:none;background:none;font:inherit;resize:none;outline:none;color:var(--tui-text-primary);box-sizing:border-box;border-radius:inherit;border-width:0;padding-inline-start:calc(var(--t-start) + var(--t-padding));padding-inline-end:calc(var(--t-end) + var(--t-side) + var(--t-padding) + var(--t-space));white-space:nowrap;overflow:hidden}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:is(input,textarea):read-only~.t-filler,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:is(input,textarea):read-only~.t-filler{display:none}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler:disabled,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled{animation:tuiPresent 1s infinite;opacity:1}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler[inputmode=none],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][inputmode=none]{caret-color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-inner-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"])>.t-template::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler::-webkit-outer-spin-button,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::-webkit-outer-spin-button{-webkit-appearance:none;appearance:none}tui-textfield:where(*[data-tui-version="5.16.0"])._with-template [tuiInput]:first-of-type{color:transparent!important}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled] [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:-webkit-autofill:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput][chrome-autofilled]:not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:not(._empty,:placeholder-shown):not(tui-textfield)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"])[multi][multi]:not(._empty):not(tui-textfield)~[tuiLabel]{font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]{transition-property:all;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;display:block;max-inline-size:calc(100% - var(--t-start));flex:1;align-self:flex-start;font:inherit;-webkit-user-select:none;user-select:none;padding:calc(var(--t-height) / 2 - .625em) 0;line-height:1.25!important;transition-duration:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel][tuiLabel][tuiLabel]+.t-content{margin-inline-start:0}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]::placeholder,tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty{color:var(--tui-text-secondary)}tui-textfield:where(*[data-tui-version="5.16.0"]) select option[value=""]:disabled{color:transparent}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option{background-color:var(--tui-background-elevation-3)}tui-textfield:where(*[data-tui-version="5.16.0"]) select optgroup,tui-textfield:where(*[data-tui-version="5.16.0"]) select option:not(:disabled){color:var(--tui-text-primary)}tui-textfield:where(*[data-tui-version="5.16.0"]) button,tui-textfield:where(*[data-tui-version="5.16.0"]) a,tui-textfield:where(*[data-tui-version="5.16.0"]) tui-icon{pointer-events:auto}tui-textfield:where(*[data-tui-version="5.16.0"])>.t-content{z-index:1;display:flex;block-size:var(--t-height);align-items:center;gap:.25rem;margin-inline-start:auto;isolation:isolate;border-radius:inherit}tui-textfield:where(*[data-tui-version="5.16.0"]) textarea~.t-content{min-inline-size:.5rem}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=readonly],[data-state=disabled],._empty) [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]._empty~.t-content [tuiButtonX],tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiInput]:disabled~.t-content [tuiButtonX]{display:none}tui-textfield:where(*[data-tui-version="5.16.0"]) .t-filler{pointer-events:none!important;color:var(--tui-text-tertiary)}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiFluidTypography]{font-weight:700}tui-textfield:where(*[data-tui-version="5.16.0"]) [tuiSelectLike]:not(:read-only){cursor:pointer}tui-textfield:where(*[data-tui-version="5.16.0"]):has(input[type=tel]){direction:ltr}tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled) [tuiInput]:not(._empty)~[tuiLabel],tui-textfield:where(*[data-tui-version="5.16.0"]):is([data-mode~=invalid],.tui-invalid,:invalid):not([data-mode~=readonly],[data-mode~=valid],[data-state=disabled],:disabled,._disabled)[multi]:not(._empty) [tuiLabel]{color:var(--tui-text-negative)}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly]):focus-visible:not([data-focus=false]) [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield:where(*[data-tui-version="5.16.0"]):not([data-mode~=readonly])[data-focus=true] [tuiLabel]{color:var(--tui-text-primary)!important;font:var(--t-label-font);transform:translateY(calc(var(--t-label-y) - var(--tui-font-offset) / 2))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]){flex-wrap:nowrap;overflow:scroll;align-items:stretch;cursor:text;max-block-size:calc(var(--t-vertical) * 2 + var(--t-item-height) * var(--t-rows));overscroll-behavior-x:none;scroll-behavior:var(--tui-scroll-behavior)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):before,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):after{position:sticky;inset-block-start:0;inset-inline-start:0;block-size:10rem;min-block-size:calc(var(--t-height) * (1 - .2 * var(--t-zoom)));max-block-size:calc((var(--t-item-height, calc(var(--t-height) - 2 * var(--t-vertical))) + 2 * var(--t-vertical)) * (1 - .2 * var(--t-zoom)))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-scrollbar{transform:translate(calc(var(--t-padding) * var(--tui-inline)));margin-inline-start:calc(-1 * var(--t-start));margin-inline-end:calc(1px - 100% + var(--t-start))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-scrollbar .t-bar_horizontal{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items{position:sticky;z-index:-1;display:flex;inset-inline-start:var(--t-start);min-inline-size:0;min-block-size:var(--t-height);block-size:fit-content;flex:1;align-items:center;flex-wrap:wrap;padding:var(--t-vertical) 0;transition-duration:inherit;box-sizing:border-box;view-timeline:--t-scrollbar-y y}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items:after{content:"";min-inline-size:1px;min-block-size:1px}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal{clip-path:inset(0 0 0 calc(var(--t-start) / 2 - var(--t-padding) - .5rem));flex-wrap:nowrap}[dir=rtl] tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal{clip-path:inset(0 calc(var(--t-start) / 2 - var(--t-padding) - .5rem) 0 0)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items_horizontal>.t-input{padding-inline-end:calc(var(--t-side) + var(--t-end) + var(--t-padding) + .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input{position:relative;display:flex;align-items:center;flex:1;block-size:var(--t-item-height, 1.25em);max-block-size:calc(var(--t-height) - 2 * var(--t-vertical));max-inline-size:100%;pointer-events:none;transform:translate(var(--t-scroll))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-filler,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input [tuiInput]{inset-block-start:-5%;block-size:110%;padding:0;pointer-events:auto}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-ghost{visibility:hidden;white-space:pre;text-overflow:clip;padding-inline-end:.125rem;block-size:100%}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items>.t-input .t-filler_hidden{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=l]{--t-vertical: .5625rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=l] tui-textfield-item:first-of-type{margin-block-start:1.125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=m]{--t-vertical: .4375rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label[data-size=m] tui-textfield-item:first-of-type{margin-block-start:.875rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label>.t-items{align-items:flex-end}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._with-label>.t-items>label[tuiLabel]{min-inline-size:100%;margin:calc(var(--t-height) / 2 - var(--t-vertical) - .625em) 0;margin-inline-end:-100%;padding:0}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-content{position:sticky;min-block-size:var(--t-height);block-size:calc(var(--t-item-height) + 2 * var(--t-vertical));inset-block-start:0;inset-inline-start:calc(100% - var(--t-side) - var(--t-end))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])>.t-items input:not(:focus)::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]>.t-items input::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]>.t-items label~.t-input input::placeholder{opacity:0}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty>.t-items input::placeholder,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-focus=true]:not([data-mode~=readonly]):not(:focus-within)>.t-items input::placeholder{opacity:1}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-state=disabled],tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly]{pointer-events:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-state=disabled] select,tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-mode~=readonly] select{display:none}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=l]{--t-vertical: .625rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=l]:after{inset-inline-start:calc(100% - var(--t-end) - var(--t-padding) + .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-vertical: .5rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]:before{inset-inline-start:-.125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=m]:after{inset-inline-start:calc(100% - var(--t-end) - .25rem)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-vertical: .125rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]:before{inset-inline-start:-.25rem}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])[data-size=s]:after{inset-inline-start:calc(100% - var(--t-end))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) tui-textfield-item{transform:translate(var(--t-scroll))}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) input::placeholder{transition-property:color;transition-duration:var(--tui-duration, .3s);transition-timing-function:var(--tui-curve-productive-standard)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]) select{opacity:0;pointer-events:none!important}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty>.t-items select~.t-filler{display:block}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"])._empty:not([data-focus=true])>.t-items select~.t-filler{color:var(--tui-text-secondary)}tui-textfield[multi][multi]:where(*[data-tui-version="5.16.0"]):has([tuiSelectLike]){cursor:pointer}\n']
    }]
  }], null, null);
})();
var TuiTextfield = [TuiItem, TuiLabel, TuiTextfieldComponent, TuiTextfieldOptionsDirective, TuiTextfieldMultiComponent, TuiDropdownContent];
var TUI_TEXTFIELD_CONTENT = new InjectionToken(ngDevMode ? "TUI_TEXTFIELD_CONTENT" : "");
var TuiTextfieldContent = class _TuiTextfieldContent {
  constructor() {
    this.vcr = inject(TuiTextfieldComponent).vcr;
    this.options = {
      injector: inject(INJECTOR$1)
    };
    this.content = inject(TUI_TEXTFIELD_CONTENT, {
      optional: true
    }) || inject(TemplateRef);
    this.ref = computed(() => {
      const vcr = this.vcr();
      return this.content instanceof TemplateRef ? vcr?.createEmbeddedView(this.content) : vcr?.createComponent(this.content, this.options).hostView;
    });
  }
  ngDoCheck() {
    this.ref()?.detectChanges();
  }
  ngOnDestroy() {
    this.ref()?.destroy();
  }
  static {
    this.\u0275fac = function TuiTextfieldContent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiTextfieldContent)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiTextfieldContent,
      selectors: [["ng-template", "tuiTextfieldContent", ""]]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiTextfieldContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[tuiTextfieldContent]"
    }]
  }], null, null);
})();
var TuiWithNativePicker = class _TuiWithNativePicker {
  constructor() {
    tuiInjectElement().type = "text";
  }
  static {
    this.\u0275fac = function TuiWithNativePicker_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithNativePicker)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiWithNativePicker
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithNativePicker, [{
    type: Directive
  }], () => [], null);
})();

// node_modules/@taiga-ui/cdk/fesm2022/taiga-ui-cdk-directives-id.mjs
var TuiId = class _TuiId {
  constructor() {
    this.el = tuiInjectElement();
    this.autoId = tuiGenerateId();
  }
  get id() {
    return this.el.id || this.autoId;
  }
  static {
    this.\u0275fac = function TuiId_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiId)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiId,
      selectors: [["", "tuiId", ""]],
      hostVars: 1,
      hostBindings: function TuiId_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275domProperty("id", ctx.id);
        }
      }
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiId, [{
    type: Directive,
    args: [{
      selector: "[tuiId]",
      host: {
        "[id]": "id"
      }
    }]
  }], null, null);
})();

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-input.mjs
var TuiInputDirective = class _TuiInputDirective {
  constructor() {
    this.el = tuiInjectElement();
    this.control = inject(NgControl, {
      optional: true
    });
    this.handlers = inject(TUI_ITEMS_HANDLERS);
    this.textfield = inject(TuiTextfieldComponent);
    this.dropdown = inject(TuiDropdownDirective);
    this.a = tuiAppearance(inject(TUI_TEXTFIELD_OPTIONS).appearance);
    this.s = tuiAppearanceState(computed(() => this.state()));
    this.m = tuiAppearanceMode(computed(() => this.mode()));
    this.f = tuiAppearanceFocus(computed(() => this.focused() ?? this.textfield.focused()));
    this.readOnly = input(false);
    this.invalid = input(null);
    this.focused = input(null);
    this.state = input(null);
    this.value = tuiValue(this.el);
    this.mode = computed(() => {
      if (this.readOnly()) {
        return "readonly";
      }
      if (this.invalid() === false) {
        return "valid";
      }
      return this.invalid() ? "invalid" : null;
    });
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
    this.\u0275fac = function TuiInputDirective_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiInputDirective)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiInputDirective,
      selectors: [["input", "tuiInput", ""]],
      hostAttrs: ["tuiInput", ""],
      hostVars: 4,
      hostBindings: function TuiInputDirective_HostBindings(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275listener("focusin", function TuiInputDirective_focusin_HostBindingHandler() {
            return 0;
          })("focusout", function TuiInputDirective_focusout_HostBindingHandler() {
            return 0;
          })("input", function TuiInputDirective_input_HostBindingHandler() {
            return 0;
          });
        }
        if (rf & 2) {
          \u0275\u0275domProperty("readOnly", ctx.readOnly());
          \u0275\u0275attribute("role", ctx.dropdown.content() && !ctx.el.matches("select") ? "combobox" : null);
          \u0275\u0275classProp("_empty", ctx.value() === "");
        }
      },
      inputs: {
        readOnly: [1, "readOnly"],
        invalid: [1, "invalid"],
        focused: [1, "focused"],
        state: [1, "state"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAsTextfieldAccessor(_TuiInputDirective)]), \u0275\u0275HostDirectivesFeature([TuiNativeValidator, TuiId])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiInputDirective, [{
    type: Directive,
    args: [{
      selector: "input[tuiInput]",
      providers: [tuiAsTextfieldAccessor(TuiInputDirective)],
      hostDirectives: [TuiNativeValidator, TuiId],
      host: {
        tuiInput: "",
        "[attr.role]": 'dropdown.content() && !el.matches("select") ? "combobox" : null',
        "[class._empty]": 'value() === ""',
        "[readOnly]": "readOnly()",
        "(focusin)": "0",
        "(focusout)": "0",
        "(input)": "0"
      }
    }]
  }], null, null);
})();
var TuiWithInput = class _TuiWithInput {
  static {
    this.\u0275fac = function TuiWithInput_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiWithInput)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiWithInput,
      features: [\u0275\u0275HostDirectivesFeature([{
        directive: TuiInputDirective,
        inputs: ["invalid", "invalid", "focused", "focused", "readOnly", "readOnly", "state", "state"]
      }])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiWithInput, [{
    type: Directive,
    args: [{
      hostDirectives: [{
        directive: TuiInputDirective,
        inputs: ["invalid", "focused", "readOnly", "state"]
      }]
    }]
  }], null, null);
})();

export {
  TuiLabel,
  TuiTextfieldComponent,
  TuiTextfield,
  TuiInputDirective
};
//# sourceMappingURL=chunk-5CFPV56S.js.map
