import {
  CaptureService
} from "./chunk-K3UCMJHQ.js";
import {
  ErrorStateComponent,
  LoadingStateComponent,
  TuiLoader
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
  TuiNotificationDirective
} from "./chunk-YUXVJ5IX.js";
import {
  ActivatedRoute,
  Component,
  DefaultValueAccessor,
  DestroyRef,
  FormsModule,
  HttpErrorResponse,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  Router,
  SelectControlValueAccessor,
  TuiButton,
  TuiTitle,
  inject,
  setClassMetadata,
  signal,
  takeUntilDestroyed,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-2IN24IS5.js";

// src/app/features/capture/capture-review.component.ts
function CaptureReviewComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-state");
  }
}
function CaptureReviewComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-error-state", 6);
    \u0275\u0275listener("retry", function CaptureReviewComponent_Conditional_8_Template_app_error_state_retry_0_listener() {
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
function CaptureReviewComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "tui-loader", 7);
    \u0275\u0275elementStart(2, "span", 2);
    \u0275\u0275text(3, "Bild wird analysiert\u2026");
    \u0275\u0275elementStart(4, "span", 3);
    \u0275\u0275text(5, "Das kann einige Sekunden dauern.");
    \u0275\u0275elementEnd()()();
  }
}
function CaptureReviewComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275element(0, "app-error-state", 4);
    \u0275\u0275elementStart(1, "button", 8);
    \u0275\u0275listener("click", function CaptureReviewComponent_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.newCapture());
    });
    \u0275\u0275text(2, "Neues Bild");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275property("message", c_r4?.error?.detail || "Bitte ein neues Bild aufnehmen.");
  }
}
function CaptureReviewComponent_Conditional_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 8);
    \u0275\u0275listener("click", function CaptureReviewComponent_Conditional_11_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.retry());
    });
    \u0275\u0275text(1, "Analyse wiederholen");
    \u0275\u0275elementEnd();
  }
}
function CaptureReviewComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-error-state", 4);
    \u0275\u0275conditionalCreate(1, CaptureReviewComponent_Conditional_11_Conditional_1_Template, 2, 0, "button", 9);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275property("message", c_r4?.error?.detail || "Analyse fehlgeschlagen.");
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r4?.error?.retryable ? 1 : -1);
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "span", 2);
    \u0275\u0275text(2, "Dieses Bild ist bereits in der Sammlung. Beim Speichern ist eine Best\xE4tigung n\xF6tig.");
    \u0275\u0275elementEnd()();
  }
}
function CaptureReviewComponent_Conditional_12_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r7 = ctx.$implicit;
    \u0275\u0275property("value", o_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(o_r7);
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Einschr\xE4nkung: ", c_r4.proposal.condition.limitations.join(", "));
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_52_Conditional_5_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const url_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275property("href", url_r8, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.sourceHost(url_r8));
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_52_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275text(1, " Quellen: ");
    \u0275\u0275repeaterCreate(2, CaptureReviewComponent_Conditional_12_Conditional_52_Conditional_5_For_3_Template, 2, 2, "a", 32, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(3);
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(c_r4.proposal.valuation.sourceUrls);
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CaptureReviewComponent_Conditional_12_Conditional_52_Conditional_5_Template, 4, 0, "div", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Aktueller Sch\xE4tzwert: ", ((c_r4.proposal?.valuation?.amountMinor || 0) / 100).toFixed(2), " EUR");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", c_r4.proposal.valuation.provider, " \xB7 ", c_r4.proposal.valuation.method);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r4.proposal.valuation.sourceUrls.length ? 5 : -1);
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const aiCost_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate2(" ca. ", ctx_r1.formatAiCost(aiCost_r9.estimatedAmount), " ", aiCost_r9.currency, " ");
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Kosten f\xFCr dieses Modell nicht hinterlegt ");
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const aiCost_r9 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" \xB7 ", aiCost_r9.webSearchCalls, " Websuche(n) ");
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " \xB7 Batch ");
  }
}
function CaptureReviewComponent_Conditional_12_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 29);
    \u0275\u0275text(1, " KI-Analyse: ");
    \u0275\u0275conditionalCreate(2, CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_2_Template, 1, 2)(3, CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_3_Template, 1, 0);
    \u0275\u0275element(4, "br");
    \u0275\u0275text(5);
    \u0275\u0275conditionalCreate(6, CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_6_Template, 1, 1);
    \u0275\u0275conditionalCreate(7, CaptureReviewComponent_Conditional_12_Conditional_53_Conditional_7_Template, 1, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const aiCost_r9 = ctx;
    \u0275\u0275advance(2);
    \u0275\u0275conditional(aiCost_r9.estimatedAmount !== null ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate4(" ", aiCost_r9.provider, " \xB7 ", aiCost_r9.model, " \xB7 ", aiCost_r9.inputTokens, " Input- / ", aiCost_r9.outputTokens, " Output-Tokens ");
    \u0275\u0275advance();
    \u0275\u0275conditional(aiCost_r9.webSearchCalls ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(aiCost_r9.isBatch ? 7 : -1);
  }
}
function CaptureReviewComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275conditionalCreate(0, CaptureReviewComponent_Conditional_12_Conditional_0_Template, 3, 0, "div", 10);
    \u0275\u0275elementStart(1, "div", 11);
    \u0275\u0275element(2, "img", 12);
    \u0275\u0275elementStart(3, "form", 13, 0);
    \u0275\u0275listener("ngSubmit", function CaptureReviewComponent_Conditional_12_Template_form_ngSubmit_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(5, "tui-textfield")(6, "label", 14);
    \u0275\u0275text(7, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 15);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.originalName, $event) || (ctx_r1.model.originalName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "tui-textfield")(10, "label", 14);
    \u0275\u0275text(11, "Deutscher Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 16);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.germanName, $event) || (ctx_r1.model.germanName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "tui-textfield")(14, "label", 14);
    \u0275\u0275text(15, "Grund, falls nicht verf\xFCgbar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 17);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.germanNameUnavailableReason, $event) || (ctx_r1.model.germanNameUnavailableReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 18)(18, "tui-textfield")(19, "label", 14);
    \u0275\u0275text(20, "Kartennummer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 19);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.collectorNumber, $event) || (ctx_r1.model.collectorNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "tui-textfield")(23, "label", 14);
    \u0275\u0275text(24, "Karten im Set");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 20);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.setTotal, $event) || (ctx_r1.model.setTotal = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 18)(27, "tui-textfield")(28, "label", 14);
    \u0275\u0275text(29, "Set-Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "input", 21);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_30_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.setIdentifier, $event) || (ctx_r1.model.setIdentifier = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "tui-textfield")(32, "label", 14);
    \u0275\u0275text(33, "Set");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.setName, $event) || (ctx_r1.model.setName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 18)(36, "tui-textfield")(37, "label", 14);
    \u0275\u0275text(38, "Sprache");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.language, $event) || (ctx_r1.model.language = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "tui-textfield")(41, "label", 14);
    \u0275\u0275text(42, "Variante");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "input", 24);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_input_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.variantKey, $event) || (ctx_r1.model.variantKey = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div", 18)(45, "label", 25)(46, "span", 26);
    \u0275\u0275text(47, "Zustand");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "select", 27);
    \u0275\u0275twoWayListener("ngModelChange", function CaptureReviewComponent_Conditional_12_Template_select_ngModelChange_48_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.model.condition, $event) || (ctx_r1.model.condition = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(49, CaptureReviewComponent_Conditional_12_For_50_Template, 2, 2, "option", 28, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275controlCreate();
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(51, CaptureReviewComponent_Conditional_12_Conditional_51_Template, 2, 1, "p", 29);
    \u0275\u0275conditionalCreate(52, CaptureReviewComponent_Conditional_12_Conditional_52_Template, 6, 4, "div");
    \u0275\u0275conditionalCreate(53, CaptureReviewComponent_Conditional_12_Conditional_53_Template, 8, 7, "p", 29);
    \u0275\u0275elementStart(54, "button", 30);
    \u0275\u0275text(55);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_28_0;
    const reviewForm_r10 = \u0275\u0275reference(4);
    const ctx_r1 = \u0275\u0275nextContext();
    const c_r4 = \u0275\u0275readContextLet(6);
    \u0275\u0275conditional(c_r4?.duplicate ? 0 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("src", c_r4.imageUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.originalName);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.germanName);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.germanNameUnavailableReason);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.collectorNumber);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.setTotal);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.setIdentifier);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.setName);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.language);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.variantKey);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.model.condition);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.conditionOptions);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r4.proposal?.condition?.limitations?.length ? 51 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r4.proposal?.valuation?.status === "available" ? 52 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_28_0 = c_r4.proposal?.aiCost) ? 53 : -1, tmp_28_0);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.saving() || reviewForm_r10.invalid);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.saving() ? "Speichert\u2026" : "Best\xE4tigen und speichern");
  }
}
var CaptureReviewComponent = class _CaptureReviewComponent {
  constructor() {
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.service = inject(CaptureService);
    this.destroyRef = inject(DestroyRef);
    this.capture = signal(
      null,
      ...ngDevMode ? [{ debugName: "capture" }] : (
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
    this.error = signal(
      "",
      ...ngDevMode ? [{ debugName: "error" }] : (
        /* istanbul ignore next */
        []
      )
    );
    this.conditionOptions = ["NM", "LP", "MP", "HP", "DMG"];
    this.model = {
      catalogReferenceId: null,
      originalName: "",
      germanName: null,
      germanNameUnavailableReason: null,
      printedNumber: "",
      collectorNumber: "",
      setTotal: null,
      setIdentifier: "",
      setName: "",
      language: "en",
      variantKey: "standard",
      condition: "NM"
    };
  }
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set("");
    const id = this.route.snapshot.paramMap.get("captureId");
    if (!id) {
      this.error.set("Capture-ID fehlt.");
      this.loading.set(false);
      return;
    }
    this.service.poll(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (capture) => {
        this.capture.set(capture);
        this.loading.set(false);
        if (capture.status === "needsReview")
          this.populate(capture);
      },
      error: () => {
        this.error.set("Capture konnte nicht geladen werden.");
        this.loading.set(false);
      }
    });
  }
  async save() {
    const current = this.capture();
    if (!current)
      return;
    this.model.printedNumber = this.model.setTotal?.trim() ? `${this.model.collectorNumber.trim()}/${this.model.setTotal.trim()}` : this.model.collectorNumber.trim();
    this.saving.set(true);
    this.error.set("");
    try {
      const reviewed = await this.service.review(current, this.model);
      this.capture.set(reviewed);
      const finalized = await this.service.finalize(reviewed, false);
      await this.router.navigate(["/cards", finalized.body?.cardRecordId]);
    } catch (error) {
      const reviewed = this.capture();
      if (error instanceof HttpErrorResponse && error.status === 409 && error.error?.code === "DUPLICATE_IMAGE") {
        if (confirm("Das Bild ist bereits gespeichert. Trotzdem als weiteres Exemplar anlegen?") && reviewed) {
          const finalized = await this.service.finalize(reviewed, true);
          await this.router.navigate(["/cards", finalized.body?.cardRecordId]);
        }
      } else {
        this.error.set("Die Karte konnte nicht gespeichert werden.");
      }
    } finally {
      this.saving.set(false);
    }
  }
  async retry() {
    const current = this.capture();
    if (!current)
      return;
    try {
      this.capture.set(await this.service.retry(current));
      this.load();
    } catch {
      this.error.set("Die Analyse konnte nicht neu gestartet werden.");
    }
  }
  newCapture() {
    void this.router.navigate(["/capture"]);
  }
  formatAiCost(amount) {
    if (amount > 0 && amount < 1e-4)
      return "< 0,0001";
    return amount.toLocaleString("de-DE", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }
  sourceHost(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "Quelle";
    }
  }
  populate(capture) {
    const proposal = capture.proposal;
    if (!proposal || this.model.originalName)
      return;
    const candidate = proposal.candidates[0];
    const number = this.splitNumber(candidate?.printedNumber ?? proposal.printedNumber.value ?? "");
    this.model = {
      catalogReferenceId: candidate?.catalogReferenceId ?? null,
      originalName: candidate?.printedName ?? proposal.printedName.value ?? "",
      germanName: candidate?.officialGermanName ?? proposal.officialGermanName.value,
      germanNameUnavailableReason: candidate?.officialGermanName || proposal.officialGermanName.value ? null : "Nicht im Katalog verf\xFCgbar",
      printedNumber: number.printedNumber,
      collectorNumber: number.collectorNumber,
      setTotal: number.setTotal,
      setIdentifier: candidate?.setIdentifier ?? proposal.setIdentifier.value ?? "",
      setName: candidate?.setName ?? proposal.setName.value ?? "",
      language: candidate?.language ?? proposal.language.value ?? "en",
      variantKey: candidate?.variantKey ?? proposal.variantKey.value ?? "standard",
      condition: proposal.condition.grade ?? "NM"
    };
  }
  splitNumber(printedNumber) {
    const slash = printedNumber.indexOf("/");
    if (slash < 0)
      return { printedNumber, collectorNumber: printedNumber.trim(), setTotal: null };
    return {
      printedNumber,
      collectorNumber: printedNumber.slice(0, slash).trim(),
      setTotal: printedNumber.slice(slash + 1).trim() || null
    };
  }
  static {
    this.\u0275fac = function CaptureReviewComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CaptureReviewComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CaptureReviewComponent, selectors: [["app-capture-review"]], decls: 13, vars: 2, consts: [["reviewForm", "ngForm"], [1, "review"], ["tuiTitle", ""], ["tuiSubtitle", ""], [3, "message"], [1, "analyzing"], [3, "retry", "message"], ["size", "l"], ["tuiButton", "", "type", "button", "appearance", "secondary", 3, "click"], ["tuiButton", "", "type", "button", "appearance", "secondary"], ["tuiNotification", "", "appearance", "warning"], [1, "review-body"], ["alt", "Aufgenommene Karte", 1, "capture-image", 3, "src"], [3, "ngSubmit"], ["tuiLabel", ""], ["tuiInput", "", "name", "originalName", "required", "", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "germanName", "maxlength", "200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "germanNameUnavailableReason", "maxlength", "200", 3, "ngModelChange", "ngModel"], [1, "pair"], ["tuiInput", "", "name", "collectorNumber", "required", "", "maxlength", "25", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setTotal", "maxlength", "25", "placeholder", "z. B. 200", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setIdentifier", "required", "", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "setName", "required", "", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "language", "required", "", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "name", "variantKey", "required", "", 3, "ngModelChange", "ngModel"], [1, "select-field"], [1, "select-label"], ["name", "condition", "required", "", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "note"], ["tuiButton", "", "type", "submit", "appearance", "primary", 3, "disabled"], [1, "source-links"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"]], template: function CaptureReviewComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 1)(1, "header")(2, "h2", 2);
        \u0275\u0275text(3, "Karte pr\xFCfen");
        \u0275\u0275elementStart(4, "span", 3);
        \u0275\u0275text(5, "Capture");
        \u0275\u0275elementEnd()()();
        \u0275\u0275declareLet(6);
        \u0275\u0275conditionalCreate(7, CaptureReviewComponent_Conditional_7_Template, 1, 0, "app-loading-state")(8, CaptureReviewComponent_Conditional_8_Template, 1, 1, "app-error-state", 4)(9, CaptureReviewComponent_Conditional_9_Template, 6, 0, "div", 5)(10, CaptureReviewComponent_Conditional_10_Template, 3, 1)(11, CaptureReviewComponent_Conditional_11_Template, 2, 2)(12, CaptureReviewComponent_Conditional_12_Template, 56, 17);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(6);
        const c_r11 = \u0275\u0275storeLet(ctx.capture());
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.loading() ? 7 : ctx.error() ? 8 : c_r11?.status === "uploaded" || c_r11?.status === "analyzing" ? 9 : c_r11?.status === "needsNewImage" ? 10 : c_r11?.status === "failed" ? 11 : c_r11?.status === "needsReview" ? 12 : -1);
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm, ErrorStateComponent, LoadingStateComponent, TuiButton, TuiLabel, TuiTextfieldComponent, TuiInputDirective, TuiTitle, TuiLoader, TuiNotificationDirective], styles: ["\n.review[_ngcontent-%COMP%] {\n  max-width: 60rem;\n}\n.review-body[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 16rem 1fr;\n  gap: 1.5rem;\n  align-items: start;\n  margin-top: 1rem;\n}\n.capture-image[_ngcontent-%COMP%] {\n  width: 100%;\n  border-radius: .6rem;\n  position: sticky;\n  top: 1rem;\n  background: var(--tui-background-neutral-1);\n}\nform[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.25rem;\n}\n.pair[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n@media (max-width: 760px) {\n  .review-body[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .capture-image[_ngcontent-%COMP%] {\n    max-width: 16rem;\n    position: static;\n  }\n}\n.analyzing[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 2rem 0;\n}\n.select-field[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: .375rem;\n  justify-content: center;\n}\n.select-label[_ngcontent-%COMP%] {\n  font: var(--tui-typography-body-s);\n  color: var(--tui-text-secondary);\n  padding-inline-start: .25rem;\n}\n.select-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  min-height: var(--tui-height-l);\n  padding: 0 1rem;\n  border-radius: var(--tui-radius-l);\n  background: var(--tui-background-neutral-1);\n  color: var(--tui-text-primary);\n  border: 1px solid transparent;\n  font: var(--tui-typography-body-m);\n  cursor: pointer;\n}\n.select-field[_ngcontent-%COMP%]   select[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--tui-border-focus);\n}\n.source-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: .35rem .75rem;\n  font-size: .875rem;\n}\nbutton[type=submit][_ngcontent-%COMP%] {\n  justify-self: start;\n}\n.note[_ngcontent-%COMP%] {\n  color: var(--tui-text-tertiary);\n}\n@media (max-width: 600px) {\n  .pair[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=capture-review.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CaptureReviewComponent, [{
    type: Component,
    args: [{ selector: "app-capture-review", standalone: true, imports: [FormsModule, ErrorStateComponent, LoadingStateComponent, TuiButton, TuiTextfield, TuiInputDirective, TuiTitle, TuiLoader, TuiNotificationDirective], template: `
    <section class="review">
      <header><h2 tuiTitle>Karte pr\xFCfen<span tuiSubtitle>Capture</span></h2></header>
      @let c = capture();
      @if (loading()) { <app-loading-state /> }
      @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
      @else if (c?.status === 'uploaded' || c?.status === 'analyzing') {
        <div class="analyzing">
          <tui-loader size="l" />
          <span tuiTitle>Bild wird analysiert\u2026<span tuiSubtitle>Das kann einige Sekunden dauern.</span></span>
        </div>
      }
      @else if (c?.status === 'needsNewImage') {
        <app-error-state [message]="c?.error?.detail || 'Bitte ein neues Bild aufnehmen.'" />
        <button tuiButton type="button" appearance="secondary" (click)="newCapture()">Neues Bild</button>
      }
      @else if (c?.status === 'failed') {
        <app-error-state [message]="c?.error?.detail || 'Analyse fehlgeschlagen.'" />
        @if (c?.error?.retryable) { <button tuiButton type="button" appearance="secondary" (click)="retry()">Analyse wiederholen</button> }
      }
      @else if (c?.status === 'needsReview') {
        @if (c?.duplicate) {
          <div tuiNotification appearance="warning">
            <span tuiTitle>Dieses Bild ist bereits in der Sammlung. Beim Speichern ist eine Best\xE4tigung n\xF6tig.</span>
          </div>
        }
        <div class="review-body">
          <img class="capture-image" [src]="c!.imageUrl" alt="Aufgenommene Karte" />
          <form (ngSubmit)="save()" #reviewForm="ngForm">
          <tui-textfield><label tuiLabel>Name</label><input tuiInput name="originalName" [(ngModel)]="model.originalName" required maxlength="200" /></tui-textfield>
          <tui-textfield><label tuiLabel>Deutscher Name</label><input tuiInput name="germanName" [(ngModel)]="model.germanName" maxlength="200" /></tui-textfield>
          <tui-textfield><label tuiLabel>Grund, falls nicht verf\xFCgbar</label><input tuiInput name="germanNameUnavailableReason" [(ngModel)]="model.germanNameUnavailableReason" maxlength="200" /></tui-textfield>
          <div class="pair">
            <tui-textfield><label tuiLabel>Kartennummer</label><input tuiInput name="collectorNumber" [(ngModel)]="model.collectorNumber" required maxlength="25" /></tui-textfield>
            <tui-textfield><label tuiLabel>Karten im Set</label><input tuiInput name="setTotal" [(ngModel)]="model.setTotal" maxlength="25" placeholder="z. B. 200" /></tui-textfield>
          </div>
          <div class="pair">
            <tui-textfield><label tuiLabel>Set-Code</label><input tuiInput name="setIdentifier" [(ngModel)]="model.setIdentifier" required /></tui-textfield>
            <tui-textfield><label tuiLabel>Set</label><input tuiInput name="setName" [(ngModel)]="model.setName" required /></tui-textfield>
          </div>
          <div class="pair">
            <tui-textfield><label tuiLabel>Sprache</label><input tuiInput name="language" [(ngModel)]="model.language" required /></tui-textfield>
            <tui-textfield><label tuiLabel>Variante</label><input tuiInput name="variantKey" [(ngModel)]="model.variantKey" required /></tui-textfield>
          </div>
          <div class="pair">
            <label class="select-field">
              <span class="select-label">Zustand</span>
              <select name="condition" [(ngModel)]="model.condition" required>
                @for (o of conditionOptions; track o) { <option [value]="o">{{ o }}</option> }
              </select>
            </label>
          </div>
          @if (c!.proposal?.condition?.limitations?.length) {
            <p class="note">Einschr\xE4nkung: {{ c!.proposal!.condition.limitations.join(', ') }}</p>
          }
          @if (c!.proposal?.valuation?.status === 'available') {
            <div>
              <p>Aktueller Sch\xE4tzwert: {{ ((c!.proposal?.valuation?.amountMinor || 0) / 100).toFixed(2) }} EUR</p>
              <p class="note">{{ c!.proposal!.valuation!.provider }} \xB7 {{ c!.proposal!.valuation!.method }}</p>
              @if (c!.proposal!.valuation!.sourceUrls.length) {
                <div class="source-links">
                  Quellen:
                  @for (url of c!.proposal!.valuation!.sourceUrls; track url) {
                    <a [href]="url" target="_blank" rel="noopener noreferrer">{{ sourceHost(url) }}</a>
                  }
                </div>
              }
            </div>
          }
          @if (c!.proposal?.aiCost; as aiCost) {
            <p class="note">
              KI-Analyse:
              @if (aiCost.estimatedAmount !== null) {
                ca. {{ formatAiCost(aiCost.estimatedAmount) }} {{ aiCost.currency }}
              } @else {
                Kosten f\xFCr dieses Modell nicht hinterlegt
              }
              <br />
              {{ aiCost.provider }} \xB7 {{ aiCost.model }} \xB7
              {{ aiCost.inputTokens }} Input- / {{ aiCost.outputTokens }} Output-Tokens
              @if (aiCost.webSearchCalls) { \xB7 {{ aiCost.webSearchCalls }} Websuche(n) }
              @if (aiCost.isBatch) { \xB7 Batch }
            </p>
          }
          <button tuiButton type="submit" appearance="primary" [disabled]="saving() || reviewForm.invalid">{{ saving() ? 'Speichert\u2026' : 'Best\xE4tigen und speichern' }}</button>
          </form>
        </div>
      }
    </section>
  `, styles: ["/* angular:styles/component:css;b335bac2ca0dbfa535222aeed86879e4750fde62a6141af694007eb0bfddb681;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/capture/capture-review.component.ts */\n.review {\n  max-width: 60rem;\n}\n.review-body {\n  display: grid;\n  grid-template-columns: 16rem 1fr;\n  gap: 1.5rem;\n  align-items: start;\n  margin-top: 1rem;\n}\n.capture-image {\n  width: 100%;\n  border-radius: .6rem;\n  position: sticky;\n  top: 1rem;\n  background: var(--tui-background-neutral-1);\n}\nform {\n  display: grid;\n  gap: 1.25rem;\n}\n.pair {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n@media (max-width: 760px) {\n  .review-body {\n    grid-template-columns: 1fr;\n  }\n  .capture-image {\n    max-width: 16rem;\n    position: static;\n  }\n}\n.analyzing {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 2rem 0;\n}\n.select-field {\n  display: flex;\n  flex-direction: column;\n  gap: .375rem;\n  justify-content: center;\n}\n.select-label {\n  font: var(--tui-typography-body-s);\n  color: var(--tui-text-secondary);\n  padding-inline-start: .25rem;\n}\n.select-field select {\n  min-height: var(--tui-height-l);\n  padding: 0 1rem;\n  border-radius: var(--tui-radius-l);\n  background: var(--tui-background-neutral-1);\n  color: var(--tui-text-primary);\n  border: 1px solid transparent;\n  font: var(--tui-typography-body-m);\n  cursor: pointer;\n}\n.select-field select:focus {\n  outline: none;\n  border-color: var(--tui-border-focus);\n}\n.source-links {\n  display: flex;\n  flex-wrap: wrap;\n  gap: .35rem .75rem;\n  font-size: .875rem;\n}\nbutton[type=submit] {\n  justify-self: start;\n}\n.note {\n  color: var(--tui-text-tertiary);\n}\n@media (max-width: 600px) {\n  .pair {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=capture-review.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CaptureReviewComponent, { className: "CaptureReviewComponent", filePath: "src/app/features/capture/capture-review.component.ts", lineNumber: 120 });
})();
export {
  CaptureReviewComponent
};
//# sourceMappingURL=chunk-PDV32CA5.js.map
