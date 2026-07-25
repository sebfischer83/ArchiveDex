import {
  EmptyStateComponent,
  ErrorStateComponent,
  LoadingStateComponent
} from "./chunk-QAVY5BF2.js";
import "./chunk-TDWIJLVP.js";
import {
  TuiCardLarge
} from "./chunk-I4HQXK6G.js";
import "./chunk-YUXVJ5IX.js";
import {
  Component,
  HttpClient,
  Router,
  TranslatePipe,
  TuiTitle,
  firstValueFrom,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-2IN24IS5.js";

// src/app/features/sets/set-overview.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function SetOverviewComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-state");
  }
}
function SetOverviewComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-error-state", 3);
    \u0275\u0275listener("retry", function SetOverviewComponent_Conditional_4_Template_app_error_state_retry_0_listener() {
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
function SetOverviewComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-empty-state", 1);
    \u0275\u0275pipe(1, "translate");
  }
  if (rf & 2) {
    \u0275\u0275property("message", \u0275\u0275pipeBind1(1, 1, "sets.empty"));
  }
}
function SetOverviewComponent_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function SetOverviewComponent_Conditional_6_For_2_Template_button_click_0_listener() {
      const s_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openSet(s_r4.id));
    });
    \u0275\u0275elementStart(1, "span", 0);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 6);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", s_r4.setName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("", s_r4.language, " \xB7 ", s_r4.distinctCardCount, " Karten \xB7 ", s_r4.specimenCount, " Exemplare");
  }
}
function SetOverviewComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275repeaterCreate(1, SetOverviewComponent_Conditional_6_For_2_Template, 5, 4, "button", 4, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.sets());
  }
}
var SetOverviewComponent = class _SetOverviewComponent {
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.sets = signal(
      [],
      ...ngDevMode ? [{ debugName: "sets" }] : (
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
    this.error = signal(
      "",
      ...ngDevMode ? [{ debugName: "error" }] : (
        /* istanbul ignore next */
        []
      )
    );
  }
  ngOnInit() {
    void this.load();
  }
  async load() {
    this.loading.set(true);
    this.error.set("");
    try {
      const p = await firstValueFrom(this.http.get("/api/v1/sets"));
      this.sets.set(p.items);
    } catch {
      this.error.set("Collection could not be loaded.");
    } finally {
      this.loading.set(false);
    }
  }
  openSet(id) {
    void this.router.navigate(["/sets", id, "cards"]);
  }
  static {
    this.\u0275fac = function SetOverviewComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SetOverviewComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SetOverviewComponent, selectors: [["app-set-overview"]], decls: 7, vars: 4, consts: [["tuiTitle", ""], [3, "message"], [1, "grid"], [3, "retry", "message"], ["tuiCardLarge", "compact", 1, "card"], ["tuiCardLarge", "compact", 1, "card", 3, "click"], ["tuiSubtitle", ""]], template: function SetOverviewComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1);
        \u0275\u0275pipe(2, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(3, SetOverviewComponent_Conditional_3_Template, 1, 0, "app-loading-state")(4, SetOverviewComponent_Conditional_4_Template, 1, 1, "app-error-state", 1)(5, SetOverviewComponent_Conditional_5_Template, 2, 3, "app-empty-state", 1)(6, SetOverviewComponent_Conditional_6_Template, 3, 0, "div", 2);
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 2, "sets.title"));
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : ctx.sets().length === 0 ? 5 : 6);
      }
    }, dependencies: [LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, TuiTitle, TuiCardLarge, TranslatePipe], styles: ["\n.grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));\n  gap: 1rem;\n}\n.card[_ngcontent-%COMP%] {\n  text-align: left;\n  cursor: pointer;\n  width: 100%;\n}\n/*# sourceMappingURL=set-overview.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SetOverviewComponent, [{
    type: Component,
    args: [{ selector: "app-set-overview", standalone: true, imports: [TranslatePipe, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent, TuiTitle, TuiCardLarge], template: `
    <h2 tuiTitle>{{ 'sets.title' | translate }}</h2>
    @if (loading()) { <app-loading-state /> }
    @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (sets().length === 0) { <app-empty-state [message]="'sets.empty' | translate" /> }
    @else {
      <div class="grid">
        @for (s of sets(); track s.id) {
          <button tuiCardLarge="compact" class="card" (click)="openSet(s.id)">
            <span tuiTitle>
              {{ s.setName }}
              <span tuiSubtitle>{{ s.language }} \xB7 {{ s.distinctCardCount }} Karten \xB7 {{ s.specimenCount }} Exemplare</span>
            </span>
          </button>
        }
      </div>
    }
  `, styles: ["/* angular:styles/component:css;03c59a0160f05646faecc5bbfe1720632a1ae26da47cf17fdced3b244d0e1584;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/sets/set-overview.component.ts */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));\n  gap: 1rem;\n}\n.card {\n  text-align: left;\n  cursor: pointer;\n  width: 100%;\n}\n/*# sourceMappingURL=set-overview.component.css.map */\n"] }]
  }], () => [{ type: HttpClient }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SetOverviewComponent, { className: "SetOverviewComponent", filePath: "src/app/features/sets/set-overview.component.ts", lineNumber: 36 });
})();
export {
  SetOverviewComponent
};
//# sourceMappingURL=chunk-63QAY2HU.js.map
