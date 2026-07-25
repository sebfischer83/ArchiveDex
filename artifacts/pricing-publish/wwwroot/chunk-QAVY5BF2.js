import {
  TuiIcon
} from "./chunk-TDWIJLVP.js";
import {
  TuiNotificationDirective
} from "./chunk-YUXVJ5IX.js";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  PolymorpheusOutlet,
  TranslatePipe,
  TuiButton,
  TuiTitle,
  WA_IS_IOS,
  inject,
  input,
  isSafari,
  setClassMetadata,
  tuiCreateOptions,
  tuiInjectElement,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-2IN24IS5.js";

// node_modules/@taiga-ui/core/fesm2022/taiga-ui-core-components-loader.mjs
var _c0 = ["*"];
function TuiLoader_Conditional_2_Conditional_3_ng_container_1_Template(rf, ctx) {
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
function TuiLoader_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275template(1, TuiLoader_Conditional_2_Conditional_3_ng_container_1_Template, 2, 1, "ng-container", 6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("polymorpheusOutlet", ctx_r1.textContent());
  }
}
function TuiLoader_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 3);
    \u0275\u0275element(2, "circle", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, TuiLoader_Conditional_2_Conditional_3_Template, 2, 1, "div", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("t-loader_inherit-color", ctx_r1.inheritColor());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.textContent() ? 3 : -1);
  }
}
var TUI_LOADER_DEFAULT_OPTIONS = {
  size: "m",
  inheritColor: false,
  overlay: false
};
var [TUI_LOADER_OPTIONS, tuiLoaderOptionsProvider] = tuiCreateOptions(TUI_LOADER_DEFAULT_OPTIONS);
var TuiLoader = class _TuiLoader {
  constructor() {
    this.options = inject(TUI_LOADER_OPTIONS);
    this.isApple = isSafari(tuiInjectElement()) || inject(WA_IS_IOS);
    this.size = input(this.options.size);
    this.inheritColor = input(this.options.inheritColor);
    this.overlay = input(this.options.overlay);
    this.textContent = input();
    this.loading = input(true);
  }
  static {
    this.\u0275fac = function TuiLoader_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TuiLoader)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
      type: _TuiLoader,
      selectors: [["tui-loader"]],
      hostVars: 3,
      hostBindings: function TuiLoader_HostBindings(rf, ctx) {
        if (rf & 2) {
          \u0275\u0275attribute("data-size", ctx.size());
          \u0275\u0275classProp("_loading", ctx.loading());
        }
      },
      inputs: {
        size: [1, "size"],
        inheritColor: [1, "inheritColor"],
        overlay: [1, "overlay"],
        textContent: [1, "textContent"],
        loading: [1, "loading"]
      },
      ngContentSelectors: _c0,
      decls: 3,
      vars: 7,
      consts: [[1, "t-content", 3, "disabled"], [1, "t-loader", 3, "t-loader_inherit-color"], [1, "t-loader"], ["height", "100%", "width", "100%", 1, "t-icon"], [1, "t-circle"], [1, "t-text"], [4, "polymorpheusOutlet"]],
      template: function TuiLoader_Template(rf, ctx) {
        if (rf & 1) {
          \u0275\u0275projectionDef();
          \u0275\u0275elementStart(0, "fieldset", 0);
          \u0275\u0275projection(1);
          \u0275\u0275elementEnd();
          \u0275\u0275conditionalCreate(2, TuiLoader_Conditional_2_Template, 4, 3, "div", 1);
        }
        if (rf & 2) {
          \u0275\u0275styleProp("opacity", ctx.overlay() && ctx.loading() ? 0.3 : null)("pointer-events", ctx.loading() ? "none" : null);
          \u0275\u0275property("disabled", ctx.loading() && !ctx.isApple);
          \u0275\u0275attribute("inert", ctx.loading() || null);
          \u0275\u0275advance(2);
          \u0275\u0275conditional(ctx.loading() ? 2 : -1);
        }
      },
      dependencies: [PolymorpheusOutlet],
      styles: ["[_nghost-%COMP%]{position:relative;display:grid;flex-shrink:0;--tui-thickness: calc(var(--t-diameter) / 12)}._loading[_nghost-%COMP%]{overflow:hidden}[data-size=xs][_nghost-%COMP%]{--t-diameter: .75em}[data-size=s][_nghost-%COMP%]{--t-diameter: 1em}[data-size=m][_nghost-%COMP%]{--t-diameter: 1.5em}[data-size=l][_nghost-%COMP%]{--t-diameter: 2.5em}[data-size=xl][_nghost-%COMP%]{--t-diameter: 3.5em}[data-size=xxl][_nghost-%COMP%]{--t-diameter: 5em}.t-content[_ngcontent-%COMP%]{grid-area:1 / 1;padding:0;margin:0;border:none;isolation:inherit;min-inline-size:0;min-block-size:0}.t-loader[_ngcontent-%COMP%]{position:relative;display:flex;grid-area:1 / 1;flex-direction:column;gap:1rem;align-items:center;justify-content:center;color:var(--tui-text-primary);stroke:var(--tui-background-accent-1);font-size:1rem}[data-size=xs][_nghost-%COMP%]   .t-loader[_ngcontent-%COMP%], [data-size=s][_nghost-%COMP%]   .t-loader[_ngcontent-%COMP%]{flex-direction:row}.t-loader.t-loader_inherit-color[_ngcontent-%COMP%]{color:inherit;stroke:currentColor}.t-text[_ngcontent-%COMP%]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:var(--tui-typography-body-s);color:inherit;max-inline-size:100%;text-align:center}@keyframes _ngcontent-%COMP%_tuiLoaderRotate{0%{transform:rotate(-90deg)}50%{transform:rotate(-90deg) rotate(1turn)}to{transform:rotate(-90deg) rotate(3turn)}}.t-icon[_ngcontent-%COMP%]{inline-size:var(--t-diameter);block-size:var(--t-diameter);animation:_ngcontent-%COMP%_tuiLoaderRotate 4s linear infinite}@keyframes _ngcontent-%COMP%_tuiLoaderDashOffset{0%{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}50%{stroke-dashoffset:calc(.05 * calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness))))}to{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}}.t-circle[_ngcontent-%COMP%]{r:calc(var(--t-diameter) / 2 - var(--tui-thickness));cx:50%;cy:50%;stroke-dasharray:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)));fill:none;stroke:inherit;stroke-width:max(var(--tui-thickness),1.5px);stroke-linecap:round;animation:_ngcontent-%COMP%_tuiLoaderDashOffset 4s linear infinite}"]
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TuiLoader, [{
    type: Component,
    args: [{
      selector: "tui-loader",
      imports: [PolymorpheusOutlet],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[attr.data-size]": "size()",
        "[class._loading]": "loading()"
      },
      template: `<fieldset
    class="t-content"
    [attr.inert]="loading() || null"
    [disabled]="loading() && !isApple"
    [style.opacity]="overlay() && loading() ? 0.3 : null"
    [style.pointer-events]="loading() ? 'none' : null"
>
    <ng-content />
</fieldset>

@if (loading()) {
    <div
        class="t-loader"
        [class.t-loader_inherit-color]="inheritColor()"
    >
        <svg
            height="100%"
            width="100%"
            class="t-icon"
        >
            <circle class="t-circle" />
        </svg>
        @if (textContent()) {
            <div class="t-text">
                <ng-container *polymorpheusOutlet="textContent() as text">
                    {{ text }}
                </ng-container>
            </div>
        }
    </div>
}
`,
      styles: [":host{position:relative;display:grid;flex-shrink:0;--tui-thickness: calc(var(--t-diameter) / 12)}:host._loading{overflow:hidden}:host[data-size=xs]{--t-diameter: .75em}:host[data-size=s]{--t-diameter: 1em}:host[data-size=m]{--t-diameter: 1.5em}:host[data-size=l]{--t-diameter: 2.5em}:host[data-size=xl]{--t-diameter: 3.5em}:host[data-size=xxl]{--t-diameter: 5em}.t-content{grid-area:1 / 1;padding:0;margin:0;border:none;isolation:inherit;min-inline-size:0;min-block-size:0}.t-loader{position:relative;display:flex;grid-area:1 / 1;flex-direction:column;gap:1rem;align-items:center;justify-content:center;color:var(--tui-text-primary);stroke:var(--tui-background-accent-1);font-size:1rem}:host[data-size=xs] .t-loader,:host[data-size=s] .t-loader{flex-direction:row}.t-loader.t-loader_inherit-color{color:inherit;stroke:currentColor}.t-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:var(--tui-typography-body-s);color:inherit;max-inline-size:100%;text-align:center}@keyframes tuiLoaderRotate{0%{transform:rotate(-90deg)}50%{transform:rotate(-90deg) rotate(1turn)}to{transform:rotate(-90deg) rotate(3turn)}}.t-icon{inline-size:var(--t-diameter);block-size:var(--t-diameter);animation:tuiLoaderRotate 4s linear infinite}@keyframes tuiLoaderDashOffset{0%{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}50%{stroke-dashoffset:calc(.05 * calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness))))}to{stroke-dashoffset:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)))}}.t-circle{r:calc(var(--t-diameter) / 2 - var(--tui-thickness));cx:50%;cy:50%;stroke-dasharray:calc(2 * 3.14159265 * calc(var(--t-diameter) / 2 - var(--tui-thickness)));fill:none;stroke:inherit;stroke-width:max(var(--tui-thickness),1.5px);stroke-linecap:round;animation:tuiLoaderDashOffset 4s linear infinite}\n"]
    }]
  }], null, null);
})();

// src/app/shared/states.component.ts
var LoadingStateComponent = class _LoadingStateComponent {
  static {
    this.\u0275fac = function LoadingStateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LoadingStateComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoadingStateComponent, selectors: [["app-loading-state"]], decls: 2, vars: 1, consts: [[1, "state"], ["size", "l", 3, "inheritColor"]], template: function LoadingStateComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "tui-loader", 1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("inheritColor", false);
      }
    }, dependencies: [TuiLoader], styles: ["\n.state[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 3rem;\n}\n/*# sourceMappingURL=states.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingStateComponent, [{
    type: Component,
    args: [{ selector: "app-loading-state", standalone: true, imports: [TuiLoader], template: `<div class="state"><tui-loader size="l" [inheritColor]="false" /></div>`, styles: ["/* angular:styles/component:css;08123e239b949b299f1f705d6bb5cb38c1dc574479df36a05081dd2c7fb87ba4;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/shared/states.component.ts */\n.state {\n  display: flex;\n  justify-content: center;\n  padding: 3rem;\n}\n/*# sourceMappingURL=states.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoadingStateComponent, { className: "LoadingStateComponent", filePath: "src/app/shared/states.component.ts", lineNumber: 12 });
})();
var EmptyStateComponent = class _EmptyStateComponent {
  constructor() {
    this.message = "";
  }
  static {
    this.\u0275fac = function EmptyStateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EmptyStateComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmptyStateComponent, selectors: [["app-empty-state"]], inputs: { message: "message" }, decls: 5, vars: 1, consts: [[1, "state"], ["icon", "@tui.inbox"], ["tuiTitle", ""], ["tuiSubtitle", ""]], template: function EmptyStateComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275element(1, "tui-icon", 1);
        \u0275\u0275elementStart(2, "span", 2)(3, "span", 3);
        \u0275\u0275text(4);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(ctx.message);
      }
    }, dependencies: [TuiIcon, TuiTitle], styles: ["\n.state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: .75rem;\n  padding: 3rem;\n  color: var(--tui-text-tertiary);\n  text-align: center;\n}\n.state[_ngcontent-%COMP%]   tui-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n}\n/*# sourceMappingURL=states.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmptyStateComponent, [{
    type: Component,
    args: [{ selector: "app-empty-state", standalone: true, imports: [TuiIcon, TuiTitle], template: `
    <div class="state">
      <tui-icon icon="@tui.inbox" />
      <span tuiTitle><span tuiSubtitle>{{ message }}</span></span>
    </div>
  `, styles: ["/* angular:styles/component:css;82a0257f2a066dbeb3905d6933af7862b0b545426b7d8b55e5da28d34f7e8e2f;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/shared/states.component.ts */\n.state {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: .75rem;\n  padding: 3rem;\n  color: var(--tui-text-tertiary);\n  text-align: center;\n}\n.state tui-icon {\n  font-size: 2rem;\n}\n/*# sourceMappingURL=states.component.css.map */\n"] }]
  }], null, { message: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmptyStateComponent, { className: "EmptyStateComponent", filePath: "src/app/shared/states.component.ts", lineNumber: 26 });
})();
var ErrorStateComponent = class _ErrorStateComponent {
  constructor() {
    this.message = "";
    this.retry = new EventEmitter();
  }
  static {
    this.\u0275fac = function ErrorStateComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ErrorStateComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ErrorStateComponent, selectors: [["app-error-state"]], inputs: { message: "message" }, outputs: { retry: "retry" }, decls: 6, vars: 4, consts: [["tuiNotification", "", "appearance", "negative", "role", "alert"], ["tuiTitle", ""], ["tuiButton", "", "type", "button", "appearance", "outline", "size", "s", 3, "click"]], template: function ErrorStateComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "span", 1);
        \u0275\u0275text(2);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "button", 2);
        \u0275\u0275listener("click", function ErrorStateComponent_Template_button_click_3_listener() {
          return ctx.retry.emit();
        });
        \u0275\u0275text(4);
        \u0275\u0275pipe(5, "translate");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.message);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 2, "actions.retry"));
      }
    }, dependencies: [TuiButton, TuiTitle, TuiNotificationDirective, TranslatePipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=states.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateComponent, [{
    type: Component,
    args: [{ selector: "app-error-state", standalone: true, imports: [TuiButton, TuiTitle, TuiNotificationDirective, TranslatePipe], template: `
    <div tuiNotification appearance="negative" role="alert">
      <span tuiTitle>{{ message }}</span>
      <button tuiButton type="button" appearance="outline" size="s" (click)="retry.emit()">{{ 'actions.retry' | translate }}</button>
    </div>
  `, styles: ["/* angular:styles/component:css;d66afc0656e5a9790feda05f39b94204300b1e91850f4533c6454b5c7e8b1b60;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/shared/states.component.ts */\n:host {\n  display: block;\n}\n/*# sourceMappingURL=states.component.css.map */\n"] }]
  }], null, { message: [{
    type: Input
  }], retry: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ErrorStateComponent, { className: "ErrorStateComponent", filePath: "src/app/shared/states.component.ts", lineNumber: 40 });
})();

export {
  TuiLoader,
  LoadingStateComponent,
  EmptyStateComponent,
  ErrorStateComponent
};
//# sourceMappingURL=chunk-QAVY5BF2.js.map
