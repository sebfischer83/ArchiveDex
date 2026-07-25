import {
  SessionService
} from "./chunk-3VVDTR7U.js";
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
import {
  TuiNotificationDirective
} from "./chunk-YUXVJ5IX.js";
import {
  CommonModule,
  Component,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  Router,
  TranslatePipe,
  TuiButton,
  TuiTitle,
  setClassMetadata,
  signal,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-2IN24IS5.js";

// src/app/features/auth/sign-in.component.ts
function SignInComponent_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "span", 1);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
var SignInComponent = class _SignInComponent {
  constructor(session, router) {
    this.session = session;
    this.router = router;
    this.userName = "";
    this.password = "";
    this.loading = signal(
      false,
      ...ngDevMode ? [{ debugName: "loading" }] : (
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
  async doSignIn() {
    this.loading.set(true);
    this.error.set("");
    try {
      await this.session.signIn(this.userName, this.password);
      await this.router.navigate(["/capture"]);
    } catch {
      this.error.set("Invalid credentials.");
    } finally {
      this.loading.set(false);
    }
  }
  static {
    this.\u0275fac = function SignInComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SignInComponent)(\u0275\u0275directiveInject(SessionService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SignInComponent, selectors: [["app-sign-in"]], decls: 19, vars: 16, consts: [["tuiCardLarge", "", 1, "sign-in"], ["tuiTitle", ""], [3, "ngSubmit"], ["tuiLabel", ""], ["tuiInput", "", "name", "user", "required", "", 3, "ngModelChange", "ngModel"], ["tuiInput", "", "type", "password", "name", "pass", "required", "", 3, "ngModelChange", "ngModel"], ["tuiButton", "", "type", "submit", "appearance", "primary", 3, "disabled"], ["tuiNotification", "", "appearance", "negative", "role", "alert"]], template: function SignInComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h2", 1);
        \u0275\u0275text(2);
        \u0275\u0275pipe(3, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "form", 2);
        \u0275\u0275listener("ngSubmit", function SignInComponent_Template_form_ngSubmit_4_listener() {
          return ctx.doSignIn();
        });
        \u0275\u0275elementStart(5, "tui-textfield")(6, "label", 3);
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "input", 4);
        \u0275\u0275twoWayListener("ngModelChange", function SignInComponent_Template_input_ngModelChange_9_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.userName, $event) || (ctx.userName = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275controlCreate();
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "tui-textfield")(11, "label", 3);
        \u0275\u0275text(12);
        \u0275\u0275pipe(13, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "input", 5);
        \u0275\u0275twoWayListener("ngModelChange", function SignInComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275controlCreate();
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "button", 6);
        \u0275\u0275text(16);
        \u0275\u0275pipe(17, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(18, SignInComponent_Conditional_18_Template, 3, 1, "div", 7);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 8, "auth.signIn"));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 10, "auth.username"));
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.userName);
        \u0275\u0275control();
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 12, "auth.password"));
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.password);
        \u0275\u0275control();
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.loading());
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 14, "auth.signIn"));
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.error() ? 18 : -1);
      }
    }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, TuiButton, TuiLabel, TuiTextfieldComponent, TuiInputDirective, TuiTitle, TuiNotificationDirective, TuiCardLarge, TranslatePipe], styles: ["\n.sign-in[_ngcontent-%COMP%] {\n  max-width: 24rem;\n  margin: 2rem auto;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\nform[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n/*# sourceMappingURL=sign-in.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SignInComponent, [{
    type: Component,
    args: [{ selector: "app-sign-in", standalone: true, imports: [CommonModule, FormsModule, TranslatePipe, TuiButton, TuiTextfield, TuiInputDirective, TuiTitle, TuiNotificationDirective, TuiCardLarge], template: `
    <div tuiCardLarge class="sign-in">
      <h2 tuiTitle>{{ 'auth.signIn' | translate }}</h2>
      <form (ngSubmit)="doSignIn()">
        <tui-textfield>
          <label tuiLabel>{{ 'auth.username' | translate }}</label>
          <input tuiInput [(ngModel)]="userName" name="user" required />
        </tui-textfield>
        <tui-textfield>
          <label tuiLabel>{{ 'auth.password' | translate }}</label>
          <input tuiInput type="password" [(ngModel)]="password" name="pass" required />
        </tui-textfield>
        <button tuiButton type="submit" appearance="primary" [disabled]="loading()">{{ 'auth.signIn' | translate }}</button>
      </form>
      @if (error()) {
        <div tuiNotification appearance="negative" role="alert">
          <span tuiTitle>{{ error() }}</span>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;ccf03ce2da3aba31f5cec412557d23267faf333991c9cbb6288e4b5f4a575f81;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/auth/sign-in.component.ts */\n.sign-in {\n  max-width: 24rem;\n  margin: 2rem auto;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n/*# sourceMappingURL=sign-in.component.css.map */\n"] }]
  }], () => [{ type: SessionService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SignInComponent, { className: "SignInComponent", filePath: "src/app/features/auth/sign-in.component.ts", lineNumber: 37 });
})();
export {
  SignInComponent
};
//# sourceMappingURL=chunk-W47XKI4C.js.map
