import {
  ErrorStateComponent,
  LoadingStateComponent
} from "./chunk-QAVY5BF2.js";
import "./chunk-TDWIJLVP.js";
import {
  TuiInputDirective,
  TuiLabel,
  TuiTextfield,
  TuiTextfieldComponent
} from "./chunk-5CFPV56S.js";
import "./chunk-X5EJLYJL.js";
import "./chunk-L767LOQY.js";
import "./chunk-ALDSJSHZ.js";
import {
  TuiCardLarge
} from "./chunk-I4HQXK6G.js";
import "./chunk-YUXVJ5IX.js";
import {
  ActivatedRoute,
  ChangeDetectionStrategy,
  Component,
  DefaultValueAccessor,
  Directive,
  FormsModule,
  HostListener,
  HttpClient,
  HttpErrorResponse,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  Router,
  RouterLink,
  TUI_VERSION,
  TuiButton,
  TuiTitle,
  TuiWithAppearance,
  TuiWithIcons,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  firstValueFrom,
  inject,
  input,
  setClassMetadata,
  signal,
  tuiAppearanceOptionsProvider,
  tuiCreateOptions,
  tuiWithStyles,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵHostDirectivesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-2IN24IS5.js";

// node_modules/@taiga-ui/kit/fesm2022/taiga-ui-kit-components-badge.mjs
var TUI_BADGE_DEFAULT_OPTIONS = {
  appearance: "",
  size: "l"
};
var [TUI_BADGE_OPTIONS, tuiBadgeOptionsProvider] = tuiCreateOptions(TUI_BADGE_DEFAULT_OPTIONS);
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
      exportAs: ["tui-badge-5.16.0"],
      decls: 0,
      vars: 0,
      template: function Styles_Template(rf, ctx) {
      },
      styles: ['[tuiBadge]:where(*[data-tui-version="5.16.0"]){--t-scale: calc(1 + (var(--tui-font-scale) - 1) / 2);--t-icon-size: 1rem;--t-padding: calc(.5rem * var(--t-scale));--t-size: var(--tui-height-xs);--t-margin: -.25rem;-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:inline-flex;align-items:center;flex-shrink:0;box-sizing:border-box;white-space:nowrap;overflow:hidden;vertical-align:middle;max-inline-size:100%;gap:calc(var(--t-gap, 0rem) - 2 * var(--t-margin, 0rem));border-radius:6rem;justify-content:center;background:#959595;color:var(--tui-background-base);padding:.0625rem var(--t-padding);block-size:var(--t-size);min-block-size:calc(var(--tui-lh) + .125rem);min-inline-size:max(calc(var(--tui-lh) + .125rem),var(--t-size));inline-size:fit-content;font:var(--tui-typography-ui-s);zoom:1}[tuiBadge]:where(*[data-tui-version="5.16.0"])>img,[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-icon,[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiAvatar],[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-badge,[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiBadge],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiRadio],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiSwitch],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiCheckbox],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:before,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{margin:var(--t-margin)}@supports not (font-size: 1lh){[tuiBadge]:where(*[data-tui-version="5.16.0"]){--tui-lh: 1.2em}}[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-icon,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:before,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{font-size:calc(var(--t-icon-size) * var(--t-scale))!important;zoom:1}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=negative]{--t-status: var(--tui-status-negative)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=positive]{--t-status: var(--tui-status-positive)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=warning]{--t-status: var(--tui-status-warning)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=info]{--t-status: var(--tui-status-info)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=neutral]{--t-status: var(--tui-status-neutral)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-padding: calc(.25rem * var(--tui-font-scale) * var(--t-scale));--t-size: 1rem;--t-icon-size: .625rem;--t-margin: -.0625rem;font:var(--tui-typography-ui-2xs);gap:.1875rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=s][tuiStatus]:before{inline-size:.25rem;block-size:.25rem;margin-inline:.0625rem -.125rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-padding: calc(.375rem * var(--tui-font-scale));--t-size: 1.25rem;--t-icon-size: .75rem;--t-margin: -.125rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=xl]{--t-margin: -.25rem;--t-padding: .75rem;--t-size: var(--tui-height-s);font:var(--tui-typography-ui-m)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=xl][tuiStatus]:before{inline-size:.5rem;block-size:.5rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=negative],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=positive],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=warning],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=info],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=neutral]{color:var(--tui-text-primary)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiStatus]:before{inline-size:.375rem;block-size:.375rem;margin:0}img[tuiBadge]:where(*[data-tui-version="5.16.0"]),tui-icon[tuiBadge]:where(*[data-tui-version="5.16.0"]){padding:0;inline-size:var(--t-size)}img[tuiBadge]:where(*[data-tui-version="5.16.0"]):before,tui-icon[tuiBadge]:where(*[data-tui-version="5.16.0"]):before{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;--t-margin: 0}\n'],
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
      exportAs: `tui-badge-${TUI_VERSION}`,
      styles: ['[tuiBadge]:where(*[data-tui-version="5.16.0"]){--t-scale: calc(1 + (var(--tui-font-scale) - 1) / 2);--t-icon-size: 1rem;--t-padding: calc(.5rem * var(--t-scale));--t-size: var(--tui-height-xs);--t-margin: -.25rem;-webkit-appearance:none;appearance:none;padding:0;border:0;background:none;font:inherit;line-height:inherit;text-decoration:none;position:relative;display:inline-flex;align-items:center;flex-shrink:0;box-sizing:border-box;white-space:nowrap;overflow:hidden;vertical-align:middle;max-inline-size:100%;gap:calc(var(--t-gap, 0rem) - 2 * var(--t-margin, 0rem));border-radius:6rem;justify-content:center;background:#959595;color:var(--tui-background-base);padding:.0625rem var(--t-padding);block-size:var(--t-size);min-block-size:calc(var(--tui-lh) + .125rem);min-inline-size:max(calc(var(--tui-lh) + .125rem),var(--t-size));inline-size:fit-content;font:var(--tui-typography-ui-s);zoom:1}[tuiBadge]:where(*[data-tui-version="5.16.0"])>img,[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-icon,[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiAvatar],[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-badge,[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiBadge],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiRadio],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiSwitch],[tuiBadge]:where(*[data-tui-version="5.16.0"])>[tuiCheckbox],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:before,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{margin:var(--t-margin)}@supports not (font-size: 1lh){[tuiBadge]:where(*[data-tui-version="5.16.0"]){--tui-lh: 1.2em}}[tuiBadge]:where(*[data-tui-version="5.16.0"])>tui-icon,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:before,[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiIcons]:after{font-size:calc(var(--t-icon-size) * var(--t-scale))!important;zoom:1}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=negative]{--t-status: var(--tui-status-negative)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=positive]{--t-status: var(--tui-status-positive)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=warning]{--t-status: var(--tui-status-warning)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=info]{--t-status: var(--tui-status-info)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-appearance=neutral]{--t-status: var(--tui-status-neutral)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=s]{--t-padding: calc(.25rem * var(--tui-font-scale) * var(--t-scale));--t-size: 1rem;--t-icon-size: .625rem;--t-margin: -.0625rem;font:var(--tui-typography-ui-2xs);gap:.1875rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=s][tuiStatus]:before{inline-size:.25rem;block-size:.25rem;margin-inline:.0625rem -.125rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=m]{--t-padding: calc(.375rem * var(--tui-font-scale));--t-size: 1.25rem;--t-icon-size: .75rem;--t-margin: -.125rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=xl]{--t-margin: -.25rem;--t-padding: .75rem;--t-size: var(--tui-height-s);font:var(--tui-typography-ui-m)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[data-size=xl][tuiStatus]:before{inline-size:.5rem;block-size:.5rem}[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=negative],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=positive],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=warning],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=info],[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiAppearance][data-appearance=neutral]{color:var(--tui-text-primary)}[tuiBadge]:where(*[data-tui-version="5.16.0"])[tuiStatus]:before{inline-size:.375rem;block-size:.375rem;margin:0}img[tuiBadge]:where(*[data-tui-version="5.16.0"]),tui-icon[tuiBadge]:where(*[data-tui-version="5.16.0"]){padding:0;inline-size:var(--t-size)}img[tuiBadge]:where(*[data-tui-version="5.16.0"]):before,tui-icon[tuiBadge]:where(*[data-tui-version="5.16.0"]):before{position:absolute;inset-block-start:0;inset-inline-start:0;inline-size:100%;block-size:100%;--t-margin: 0}\n']
    }]
  }], null, null);
})();
var TuiBadge = class _TuiBadge {
  constructor() {
    this.nothing = tuiWithStyles(Styles);
    this.size = input(inject(TUI_BADGE_OPTIONS).size);
  }
  static {
    this.\u0275fac = function TuiBadge_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiBadge)();
    };
  }
  static {
    this.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
      type: _TuiBadge,
      selectors: [["", "tuiBadge", ""], ["tui-icon", "tuiBadge", ""]],
      hostVars: 1,
      hostBindings: function TuiBadge_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-size", ctx.size());
        }
      },
      inputs: {
        size: [1, "size"]
      },
      features: [\u0275\u0275ProvidersFeature([tuiAppearanceOptionsProvider(TUI_BADGE_OPTIONS)]), \u0275\u0275HostDirectivesFeature([TuiWithAppearance, TuiWithIcons])]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiBadge, [{
    type: Directive,
    args: [{
      // tui-icon[tuiBadge] is required to avoid double matching of TuiIcons
      selector: "[tuiBadge],tui-icon[tuiBadge]",
      providers: [tuiAppearanceOptionsProvider(TUI_BADGE_OPTIONS)],
      hostDirectives: [TuiWithAppearance, TuiWithIcons],
      host: {
        "[attr.data-size]": "size()"
      }
    }]
  }], null, null);
})();

// src/app/features/cards/card-detail.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function CardDetailComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-state");
  }
}
function CardDetailComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-error-state", 2);
    \u0275\u0275listener("retry", function CardDetailComponent_Conditional_1_Template_app_error_state_retry_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function CardDetailComponent_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_3_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const c_r4 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.startEditing(c_r4));
    });
    \u0275\u0275text(1, "Bearbeiten");
    \u0275\u0275elementEnd();
  }
}
function CardDetailComponent_Conditional_2_Conditional_4_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function CardDetailComponent_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 9, 0);
    \u0275\u0275listener("ngSubmit", function CardDetailComponent_Conditional_2_Conditional_4_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r5);
      const c_r4 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save(c_r4));
    });
    \u0275\u0275elementStart(2, "h2", 10);
    \u0275\u0275text(3, "Kartendaten bearbeiten");
    \u0275\u0275elementStart(4, "span", 11);
    \u0275\u0275text(5, "\xC4nderungen am Setnamen gelten f\xFCr das gesamte Set.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "tui-textfield")(7, "label", 12);
    \u0275\u0275text(8, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 13);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.originalName, $event) || (ctx_r1.editModel.originalName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 14)(11, "tui-textfield")(12, "label", 12);
    \u0275\u0275text(13, "Deutscher Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.germanName, $event) || (ctx_r1.editModel.germanName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.germanNameChanged($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "tui-textfield")(16, "label", 12);
    \u0275\u0275text(17, "Grund, falls nicht verf\xFCgbar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.germanNameUnavailableReason, $event) || (ctx_r1.editModel.germanNameUnavailableReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.unavailableReasonChanged($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 14)(20, "tui-textfield")(21, "label", 12);
    \u0275\u0275text(22, "Kartennummer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_23_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.collectorNumber, $event) || (ctx_r1.editModel.collectorNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "tui-textfield")(25, "label", 12);
    \u0275\u0275text(26, "Karten im Set");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 18);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.setTotal, $event) || (ctx_r1.editModel.setTotal = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 14)(29, "tui-textfield")(30, "label", 12);
    \u0275\u0275text(31, "Set-Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.setIdentifier, $event) || (ctx_r1.editModel.setIdentifier = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "tui-textfield")(34, "label", 12);
    \u0275\u0275text(35, "Setname");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.setName, $event) || (ctx_r1.editModel.setName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 14)(38, "tui-textfield")(39, "label", 12);
    \u0275\u0275text(40, "Sprache");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_41_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.language, $event) || (ctx_r1.editModel.language = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "tui-textfield")(43, "label", 12);
    \u0275\u0275text(44, "Variante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function CardDetailComponent_Conditional_2_Conditional_4_Template_input_ngModelChange_45_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.editModel.variantKey, $event) || (ctx_r1.editModel.variantKey = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(46, CardDetailComponent_Conditional_2_Conditional_4_Conditional_46_Template, 2, 1, "p", 23);
    \u0275\u0275elementStart(47, "div", 24)(48, "button", 25);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "button", 26);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_4_Template_button_click_50_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.cancelEditing());
    });
    \u0275\u0275text(51, "Abbrechen");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const editForm_r6 = \u0275\u0275reference(1);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.originalName);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.germanName);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.germanNameUnavailableReason);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.collectorNumber);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.setTotal);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.setIdentifier);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.setName);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.language);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.editModel.variantKey);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.error() ? 46 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.saving() || editForm_r6.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saving() ? "Speichert\u2026" : "Speichern");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving());
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const url_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275property("href", url_r9, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.sourceHost(url_r9));
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275repeaterCreate(1, CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Conditional_4_For_2_Template, 2, 2, "a", 35, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const specimen_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(specimen_r8.valuation.sourceUrls);
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 33);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Conditional_4_Template, 3, 0, "div", 34);
  }
  if (rf & 2) {
    const specimen_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ((specimen_r8.valuation.amountMinor || 0) / 100).toFixed(2), " EUR");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", specimen_r8.valuation.provider, " \xB7 ", specimen_r8.valuation.method);
    \u0275\u0275advance();
    \u0275\u0275conditional(specimen_r8.valuation.sourceUrls?.length ? 4 : -1);
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 33);
    \u0275\u0275text(1, "Keine Bewertung");
    \u0275\u0275elementEnd();
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 28)(1, "button", 29);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_5_For_6_Template_button_click_1_listener() {
      const specimen_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const c_r4 = \u0275\u0275nextContext(2);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openPreview(specimen_r8.imageUrl, c_r4.germanName || c_r4.originalName));
    });
    \u0275\u0275element(2, "img", 30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 31)(4, "span", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_6_Template, 5, 4)(7, CardDetailComponent_Conditional_2_Conditional_5_For_6_Conditional_7_Template, 2, 0, "p", 33);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const specimen_r8 = ctx.$implicit;
    const c_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", (c_r4.germanName || c_r4.originalName) + " gro\xDF anzeigen");
    \u0275\u0275advance();
    \u0275\u0275property("src", specimen_r8.thumbnailUrl, \u0275\u0275sanitizeUrl)("alt", c_r4.germanName || c_r4.originalName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(specimen_r8.condition);
    \u0275\u0275advance();
    \u0275\u0275conditional(specimen_r8.valuation.status === "available" ? 6 : 7);
  }
}
function CardDetailComponent_Conditional_2_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 27);
    \u0275\u0275repeaterCreate(5, CardDetailComponent_Conditional_2_Conditional_5_For_6_Template, 8, 5, "article", 28, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r4.germanName || c_r4.originalName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", c_r4.setName, " \xB7 ", c_r4.language, " \xB7 #", c_r4.printedNumber);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(c_r4.specimens);
  }
}
function CardDetailComponent_Conditional_2_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 36);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_6_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closePreview());
    });
    \u0275\u0275elementStart(1, "div", 37);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_6_Template_div_click_1_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(2, "button", 38);
    \u0275\u0275listener("click", function CardDetailComponent_Conditional_2_Conditional_6_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.closePreview());
    });
    \u0275\u0275text(3, "Schlie\xDFen");
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "img", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const image_r11 = ctx;
    \u0275\u0275advance(4);
    \u0275\u0275property("src", image_r11.url, \u0275\u0275sanitizeUrl)("alt", image_r11.alt);
  }
}
function CardDetailComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "a", 4);
    \u0275\u0275text(2, "Sammlung");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CardDetailComponent_Conditional_2_Conditional_3_Template, 2, 0, "button", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, CardDetailComponent_Conditional_2_Conditional_4_Template, 52, 13, "form", 6)(5, CardDetailComponent_Conditional_2_Conditional_5_Template, 7, 4);
    \u0275\u0275conditionalCreate(6, CardDetailComponent_Conditional_2_Conditional_6_Template, 5, 2, "div", 7);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!ctx_r1.editing() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.editing() ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_4_0 = ctx_r1.preview()) ? 6 : -1, tmp_4_0);
  }
}
var CardDetailComponent = class _CardDetailComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.card = signal(
      null,
      ...ngDevMode ? [{ debugName: "card" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.loading = signal(
      true,
      ...ngDevMode ? [{ debugName: "loading" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.saving = signal(
      false,
      ...ngDevMode ? [{ debugName: "saving" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.editing = signal(
      false,
      ...ngDevMode ? [{ debugName: "editing" }] : (
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
    this.preview = signal(
      null,
      ...ngDevMode ? [{ debugName: "preview" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.editModel = this.emptyEditModel();
  }
  ngOnInit() {
    void this.load();
  }
  async load() {
    this.loading.set(true);
    this.error.set("");
    try {
      this.card.set(await firstValueFrom(this.http.get(`/api/v1/cards/${this.route.snapshot.paramMap.get("cardId")}`)));
    } catch {
      this.error.set("Kartendetail konnte nicht geladen werden.");
    } finally {
      this.loading.set(false);
    }
  }
  startEditing(card) {
    this.editModel = {
      catalogReferenceId: card.catalogReferenceId,
      originalName: card.originalName,
      germanName: card.germanName,
      germanNameUnavailableReason: card.germanNameUnavailableReason,
      collectorNumber: card.collectorNumber,
      setTotal: card.setTotal,
      setIdentifier: card.setIdentifier,
      setName: card.setName,
      language: card.language,
      variantKey: card.variantKey
    };
    this.error.set("");
    this.editing.set(true);
  }
  cancelEditing() {
    this.error.set("");
    this.editing.set(false);
  }
  async save(card) {
    const collectorNumber = this.editModel.collectorNumber.trim();
    const setTotal = this.editModel.setTotal?.trim() || null;
    const printedNumber = setTotal ? `${collectorNumber}/${setTotal}` : collectorNumber;
    this.saving.set(true);
    this.error.set("");
    try {
      const updated = await firstValueFrom(this.http.put(`/api/v1/cards/${card.id}`, __spreadProps(__spreadValues({}, this.editModel), {
        collectorNumber,
        setTotal,
        printedNumber
      }), { headers: { "If-Match": card.etag } }));
      this.card.set(updated);
      this.editing.set(false);
      if (updated.id !== card.id)
        await this.router.navigate(["/cards", updated.id], { replaceUrl: true });
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409)
        this.error.set("Die Karte wurde zwischenzeitlich ge\xE4ndert. Bitte neu laden und erneut bearbeiten.");
      else if (error instanceof HttpErrorResponse && error.error?.detail)
        this.error.set(error.error.detail);
      else
        this.error.set("Die \xC4nderungen konnten nicht gespeichert werden.");
    } finally {
      this.saving.set(false);
    }
  }
  germanNameChanged(value) {
    if (value?.trim())
      this.editModel.germanNameUnavailableReason = null;
  }
  unavailableReasonChanged(value) {
    if (value?.trim())
      this.editModel.germanName = null;
  }
  openPreview(url, alt) {
    this.preview.set({ url, alt });
  }
  closePreview() {
    this.preview.set(null);
  }
  sourceHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "Quelle";
    }
  }
  emptyEditModel() {
    return {
      catalogReferenceId: null,
      originalName: "",
      germanName: null,
      germanNameUnavailableReason: null,
      collectorNumber: "",
      setTotal: null,
      setIdentifier: "",
      setName: "",
      language: "",
      variantKey: ""
    };
  }
  static {
    this.\u0275fac = function CardDetailComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CardDetailComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CardDetailComponent, selectors: [["app-card-detail"]], hostBindings: function CardDetailComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown.escape", function CardDetailComponent_keydown_escape_HostBindingHandler() {
          return ctx.closePreview();
        }, \u0275\u0275resolveDocument);
      }
    }, decls: 3, vars: 1, consts: [["editForm", "ngForm"], [3, "message"], [3, "retry", "message"], [1, "toolbar"], ["tuiButton", "", "appearance", "flat", "size", "s", "iconStart", "@tui.arrow-left", "routerLink", "/sets"], ["tuiButton", "", "appearance", "secondary", "size", "s", "type", "button"], [1, "edit-form"], ["role", "dialog", "aria-modal", "true", "aria-label", "Gro\xDFe Kartenansicht", 1, "image-overlay"], ["tuiButton", "", "appearance", "secondary", "size", "s", "type", "button", 3, "click"], [1, "edit-form", 3, "ngSubmit"], ["tuiTitle", ""], ["tuiSubtitle", ""], ["tuiLabel", ""], ["tuiInput", "", "name", "originalName", "required", "", "maxlength", "200", 3, "ngModelChange", "ngModel"], [1, "pair"], ["tuiInput", "", "name", "germanName", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "germanNameUnavailableReason", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "collectorNumber", "required", "", "maxlength", "25", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setTotal", "maxlength", "25", "placeholder", "z. B. 200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setIdentifier", "required", "", "maxlength", "100", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setName", "required", "", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "language", "required", "", "maxlength", "10", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "variantKey", "required", "", "maxlength", "50", 3, "ngModelChange", "ngModel"], [1, "form-error"], [1, "actions"], ["tuiButton", "", "appearance", "primary", "type", "submit", 3, "disabled"], ["tuiButton", "", "appearance", "flat", "type", "button", 3, "click", "disabled"], [1, "specimens"], ["tuiCardLarge", "compact"], ["type", "button", 1, "image-button", 3, "click"], [3, "src", "alt"], [1, "specimen-info"], ["tuiBadge", "", "appearance", "neutral"], [1, "muted"], [1, "source-links"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"], ["role", "dialog", "aria-modal", "true", "aria-label", "Gro\xDFe Kartenansicht", 1, "image-overlay", 3, "click"], [1, "overlay-content", 3, "click"], ["tuiButton", "", "appearance", "secondary", "size", "s", "type", "button", 1, "close-preview", 3, "click"]], template: function CardDetailComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275conditionalCreate(0, CardDetailComponent_Conditional_0_Template, 1, 0, "app-loading-state")(1, CardDetailComponent_Conditional_1_Template, 1, 1, "app-error-state", 1)(2, CardDetailComponent_Conditional_2_Template, 7, 3);
      }
      if (rf & 2) {
        let tmp_0_0;
        \u0275\u0275conditional(ctx.loading() ? 0 : ctx.error() && !ctx.card() ? 1 : (tmp_0_0 = ctx.card()) ? 2 : -1, tmp_0_0);
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm, RouterLink, ErrorStateComponent, LoadingStateComponent, TuiButton, TuiInputDirective, TuiLabel, TuiTextfieldComponent, TuiTitle, TuiCardLarge, TuiBadge], styles: ["\n.toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\nh2[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n}\n.edit-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.25rem;\n  max-width: 50rem;\n  margin-top: 1.5rem;\n}\n.pair[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: .75rem;\n  align-items: center;\n}\n.form-error[_ngcontent-%COMP%] {\n  color: var(--tui-text-negative);\n  margin: 0;\n}\n.specimens[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  margin-top: 1.5rem;\n}\n.specimens[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n.image-button[_ngcontent-%COMP%] {\n  padding: 0;\n  border: 0;\n  border-radius: .3rem;\n  background: transparent;\n  cursor: zoom-in;\n  line-height: 0;\n}\n.image-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid var(--tui-border-focus);\n  outline-offset: 3px;\n}\n.image-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 110px;\n  height: 152px;\n  object-fit: cover;\n  border-radius: .3rem;\n}\n.specimen-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: .5rem;\n  align-items: flex-start;\n}\n.source-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: .5rem;\n  font-size: .875rem;\n}\n.muted[_ngcontent-%COMP%] {\n  color: var(--tui-text-tertiary);\n}\n.image-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  background: rgba(0, 0, 0, .82);\n  cursor: zoom-out;\n}\n.overlay-content[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 100%;\n  height: 100%;\n  cursor: default;\n}\n.overlay-content[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: min(92vw, 56rem);\n  max-height: 90vh;\n  width: auto;\n  height: auto;\n  object-fit: contain;\n  border-radius: .6rem;\n  box-shadow: 0 1rem 4rem rgba(0, 0, 0, .45);\n}\n.close-preview[_ngcontent-%COMP%] {\n  position: fixed;\n  z-index: 1;\n  top: 1rem;\n  right: 1rem;\n}\n@media (max-width: 600px) {\n  .pair[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=card-detail.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardDetailComponent, [{
    type: Component,
    args: [{ selector: "app-card-detail", standalone: true, imports: [FormsModule, RouterLink, ErrorStateComponent, LoadingStateComponent, TuiButton, TuiInputDirective, TuiTextfield, TuiTitle, TuiCardLarge, TuiBadge], template: `
    @if (loading()) { <app-loading-state /> }
    @else if (error() && !card()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (card(); as c) {
      <div class="toolbar">
        <a tuiButton appearance="flat" size="s" iconStart="@tui.arrow-left" routerLink="/sets">Sammlung</a>
        @if (!editing()) {
          <button tuiButton appearance="secondary" size="s" type="button" (click)="startEditing(c)">Bearbeiten</button>
        }
      </div>

      @if (editing()) {
        <form (ngSubmit)="save(c)" #editForm="ngForm" class="edit-form">
          <h2 tuiTitle>Kartendaten bearbeiten<span tuiSubtitle>\xC4nderungen am Setnamen gelten f\xFCr das gesamte Set.</span></h2>
          <tui-textfield><label tuiLabel>Name</label><input tuiInput name="originalName" [(ngModel)]="editModel.originalName" required maxlength="200" /></tui-textfield>
          <div class="pair">
            <tui-textfield><label tuiLabel>Deutscher Name</label><input tuiInput name="germanName" [(ngModel)]="editModel.germanName" maxlength="200" (ngModelChange)="germanNameChanged($event)" /></tui-textfield>
            <tui-textfield><label tuiLabel>Grund, falls nicht verf\xFCgbar</label><input tuiInput name="germanNameUnavailableReason" [(ngModel)]="editModel.germanNameUnavailableReason" maxlength="200" (ngModelChange)="unavailableReasonChanged($event)" /></tui-textfield>
          </div>
          <div class="pair">
            <tui-textfield><label tuiLabel>Kartennummer</label><input tuiInput name="collectorNumber" [(ngModel)]="editModel.collectorNumber" required maxlength="25" /></tui-textfield>
            <tui-textfield><label tuiLabel>Karten im Set</label><input tuiInput name="setTotal" [(ngModel)]="editModel.setTotal" maxlength="25" placeholder="z. B. 200" /></tui-textfield>
          </div>
          <div class="pair">
            <tui-textfield><label tuiLabel>Set-Code</label><input tuiInput name="setIdentifier" [(ngModel)]="editModel.setIdentifier" required maxlength="100" /></tui-textfield>
            <tui-textfield><label tuiLabel>Setname</label><input tuiInput name="setName" [(ngModel)]="editModel.setName" required maxlength="200" /></tui-textfield>
          </div>
          <div class="pair">
            <tui-textfield><label tuiLabel>Sprache</label><input tuiInput name="language" [(ngModel)]="editModel.language" required maxlength="10" /></tui-textfield>
            <tui-textfield><label tuiLabel>Variante</label><input tuiInput name="variantKey" [(ngModel)]="editModel.variantKey" required maxlength="50" /></tui-textfield>
          </div>
          @if (error()) { <p class="form-error">{{ error() }}</p> }
          <div class="actions">
            <button tuiButton appearance="primary" type="submit" [disabled]="saving() || editForm.invalid">{{ saving() ? 'Speichert\u2026' : 'Speichern' }}</button>
            <button tuiButton appearance="flat" type="button" [disabled]="saving()" (click)="cancelEditing()">Abbrechen</button>
          </div>
        </form>
      } @else {
        <h2 tuiTitle>
          {{ c.germanName || c.originalName }}
          <span tuiSubtitle>{{ c.setName }} \xB7 {{ c.language }} \xB7 #{{ c.printedNumber }}</span>
        </h2>
        <div class="specimens">@for (specimen of c.specimens; track specimen.id) {
          <article tuiCardLarge="compact">
            <button
              class="image-button"
              type="button"
              [attr.aria-label]="(c.germanName || c.originalName) + ' gro\xDF anzeigen'"
              (click)="openPreview(specimen.imageUrl, c.germanName || c.originalName)"
            >
              <img [src]="specimen.thumbnailUrl" [alt]="c.germanName || c.originalName" />
            </button>
            <div class="specimen-info">
              <span tuiBadge appearance="neutral">{{ specimen.condition }}</span>
              @if (specimen.valuation.status === 'available') {
                <p>{{ ((specimen.valuation.amountMinor || 0) / 100).toFixed(2) }} EUR</p>
                <p class="muted">{{ specimen.valuation.provider }} \xB7 {{ specimen.valuation.method }}</p>
                @if (specimen.valuation.sourceUrls?.length) {
                  <div class="source-links">
                    @for (url of specimen.valuation.sourceUrls; track url) {
                      <a [href]="url" target="_blank" rel="noopener noreferrer">{{ sourceHost(url) }}</a>
                    }
                  </div>
                }
              }
              @else { <p class="muted">Keine Bewertung</p> }
            </div>
          </article>
        }</div>
      }

      @if (preview(); as image) {
        <div class="image-overlay" role="dialog" aria-modal="true" aria-label="Gro\xDFe Kartenansicht" (click)="closePreview()">
          <div class="overlay-content" (click)="$event.stopPropagation()">
            <button tuiButton class="close-preview" appearance="secondary" size="s" type="button" (click)="closePreview()">Schlie\xDFen</button>
            <img [src]="image.url" [alt]="image.alt" />
          </div>
        </div>
      }
    }
  `, styles: ["/* angular:styles/component:css;65834205ed7a7976454079c751fc3e66cb41d3644130880171042ec2f88972ae;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/cards/card-detail.component.ts */\n.toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}\nh2 {\n  margin-top: 2rem;\n}\n.edit-form {\n  display: grid;\n  gap: 1.25rem;\n  max-width: 50rem;\n  margin-top: 1.5rem;\n}\n.pair {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n.actions {\n  display: flex;\n  gap: .75rem;\n  align-items: center;\n}\n.form-error {\n  color: var(--tui-text-negative);\n  margin: 0;\n}\n.specimens {\n  display: grid;\n  gap: 1rem;\n  margin-top: 1.5rem;\n}\n.specimens article {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n.image-button {\n  padding: 0;\n  border: 0;\n  border-radius: .3rem;\n  background: transparent;\n  cursor: zoom-in;\n  line-height: 0;\n}\n.image-button:focus-visible {\n  outline: 3px solid var(--tui-border-focus);\n  outline-offset: 3px;\n}\n.image-button img {\n  width: 110px;\n  height: 152px;\n  object-fit: cover;\n  border-radius: .3rem;\n}\n.specimen-info {\n  display: flex;\n  flex-direction: column;\n  gap: .5rem;\n  align-items: flex-start;\n}\n.source-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: .5rem;\n  font-size: .875rem;\n}\n.muted {\n  color: var(--tui-text-tertiary);\n}\n.image-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 1000;\n  display: grid;\n  place-items: center;\n  padding: 1rem;\n  background: rgba(0, 0, 0, .82);\n  cursor: zoom-out;\n}\n.overlay-content {\n  position: relative;\n  display: grid;\n  place-items: center;\n  width: 100%;\n  height: 100%;\n  cursor: default;\n}\n.overlay-content img {\n  max-width: min(92vw, 56rem);\n  max-height: 90vh;\n  width: auto;\n  height: auto;\n  object-fit: contain;\n  border-radius: .6rem;\n  box-shadow: 0 1rem 4rem rgba(0, 0, 0, .45);\n}\n.close-preview {\n  position: fixed;\n  z-index: 1;\n  top: 1rem;\n  right: 1rem;\n}\n@media (max-width: 600px) {\n  .pair {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=card-detail.component.css.map */\n"] }]
  }], null, { closePreview: [{
    type: HostListener,
    args: ["document:keydown.escape"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CardDetailComponent, { className: "CardDetailComponent", filePath: "src/app/features/cards/card-detail.component.ts", lineNumber: 141 });
})();
export {
  CardDetailComponent
};
//# sourceMappingURL=chunk-QES6PTHG.js.map
