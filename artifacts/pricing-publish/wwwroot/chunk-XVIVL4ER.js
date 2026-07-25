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
  ActivatedRoute,
  Component,
  HttpClient,
  Router,
  TuiTitle,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-2IN24IS5.js";

// src/app/features/cards/card-list.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function CardListComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-state");
  }
}
function CardListComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-error-state", 4);
    \u0275\u0275listener("retry", function CardListComponent_Conditional_3_Template_app_error_state_retry_0_listener() {
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
function CardListComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-empty-state", 2);
  }
}
function CardListComponent_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function CardListComponent_Conditional_5_For_2_Template_button_click_0_listener() {
      const card_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.open(card_r4.id));
    });
    \u0275\u0275element(1, "img", 7);
    \u0275\u0275elementStart(2, "span", 0);
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "span", 8);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const card_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", card_r4.thumbnailUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", card_r4.germanName || card_r4.originalName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("#", card_r4.printedNumber, " \xB7 ", card_r4.specimenCount, " Exemplar(e)");
  }
}
function CardListComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275repeaterCreate(1, CardListComponent_Conditional_5_For_2_Template, 6, 4, "button", 5, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.cards());
  }
}
var CardListComponent = class _CardListComponent {
  constructor() {
    this.http = inject(HttpClient);
    this.route = inject(ActivatedRoute);
    this.router = inject(Router);
    this.cards = signal(
      [],
      ...ngDevMode ? [{ debugName: "cards" }] : (
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
      this.cards.set((await firstValueFrom(this.http.get(`/api/v1/sets/${this.route.snapshot.paramMap.get("setId")}/cards`))).items);
    } catch {
      this.error.set("Karten konnten nicht geladen werden.");
    } finally {
      this.loading.set(false);
    }
  }
  open(id) {
    void this.router.navigate(["/cards", id]);
  }
  static {
    this.\u0275fac = function CardListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CardListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CardListComponent, selectors: [["app-card-list"]], decls: 6, vars: 1, consts: [["tuiTitle", ""], [3, "message"], ["message", "In diesem Set sind noch keine Karten."], [1, "cards"], [3, "retry", "message"], ["tuiCardLarge", "compact", 1, "card"], ["tuiCardLarge", "compact", 1, "card", 3, "click"], ["alt", "", 3, "src"], ["tuiSubtitle", ""]], template: function CardListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h2", 0);
        \u0275\u0275text(1, "Karten");
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(2, CardListComponent_Conditional_2_Template, 1, 0, "app-loading-state")(3, CardListComponent_Conditional_3_Template, 1, 1, "app-error-state", 1)(4, CardListComponent_Conditional_4_Template, 1, 0, "app-empty-state", 2)(5, CardListComponent_Conditional_5_Template, 3, 0, "div", 3);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx.loading() ? 2 : ctx.error() ? 3 : !ctx.cards().length ? 4 : 5);
      }
    }, dependencies: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, TuiTitle, TuiCardLarge], styles: ["\n.cards[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));\n  gap: 1rem;\n}\n.cards[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  gap: .8rem;\n  align-items: center;\n  text-align: left;\n  width: 100%;\n}\n.cards[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 88px;\n  object-fit: cover;\n  border-radius: .3rem;\n}\n/*# sourceMappingURL=card-list.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardListComponent, [{
    type: Component,
    args: [{ selector: "app-card-list", standalone: true, imports: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, TuiTitle, TuiCardLarge], template: `
    <h2 tuiTitle>Karten</h2>
    @if (loading()) { <app-loading-state /> }
    @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (!cards().length) { <app-empty-state message="In diesem Set sind noch keine Karten." /> }
    @else { <div class="cards">@for (card of cards(); track card.id) {
      <button tuiCardLarge="compact" class="card" (click)="open(card.id)">
        <img [src]="card.thumbnailUrl" alt="" />
        <span tuiTitle>
          {{ card.germanName || card.originalName }}
          <span tuiSubtitle>#{{ card.printedNumber }} \xB7 {{ card.specimenCount }} Exemplar(e)</span>
        </span>
      </button>
    }</div> }
  `, styles: ["/* angular:styles/component:css;1d6b2db1eb6d3b25a9ae2111f9114cec6f484e05896f7f4d9d4ae29ac0accf49;C:/Development/ArchiveDex/src/ArchiveDex.Server/ClientApp/src/app/features/cards/card-list.component.ts */\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));\n  gap: 1rem;\n}\n.cards button {\n  display: flex;\n  gap: .8rem;\n  align-items: center;\n  text-align: left;\n  width: 100%;\n}\n.cards img {\n  width: 64px;\n  height: 88px;\n  object-fit: cover;\n  border-radius: .3rem;\n}\n/*# sourceMappingURL=card-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CardListComponent, { className: "CardListComponent", filePath: "src/app/features/cards/card-list.component.ts", lineNumber: 34 });
})();
export {
  CardListComponent
};
//# sourceMappingURL=chunk-XVIVL4ER.js.map
