# Taiga UI Migration Plan

> **Status: DONE (2026-07-22).** All components converted, verified end-to-end against the
> rebuilt Docker image (login, sign-out, sets empty state, capture upload) with zero console
> errors. See the gotcha about `ng serve` + `<base href="/ui/">` at the bottom before using the
> fast dev loop described below.
>
> **Post-verification bugfix:** the initial capture-upload conversion used
> `[ngModel]="selectedFile()" (ngModelChange)="onFileSelected($event)"` on the `input[tuiInputFiles]`
> to read the picked file, which silently sent the browser's fake `"C:\fakepath\..."` string
> instead of the real `File` (backend rejected with `400 The image field is required`). Root cause
> and fix are documented in the pitfalls section below — read it before touching any Taiga
> `TuiInputFiles`/file-upload code.

Convert the ArchiveDex Angular client's hand-rolled UI to **Taiga UI** components, one component
at a time. Base wiring (`provideTaiga()`, `<tui-root>`, global styles) is already done — this plan
only converts the actual feature UI.

**Executor:** work through the tasks top-to-bottom. Each task is self-contained and independently
verifiable. Commit after each component (or small group) so progress is bisectable.

---

## 0. Hard constraints — read first

- **The app is ZONELESS.** Component state that changes after `await` or inside an observable
  `.subscribe()` MUST stay a `signal()`. Do **not** reintroduce plain properties for
  loading/error/data — the view will silently stop updating (symptom: stuck on "Laden…").
  `ngModel`-bound fields (user input) may stay plain; input events trigger CD.
- **Keep behaviour identical.** Same routes, same API calls, same German copy, same form field
  names/validation. This is a visual/component swap, not a rewrite.
- **Keep it accessible.** Preserve `role`, `aria-*`, `alt`, labels. Taiga components mostly handle
  this, but don't drop existing attributes.
- **Theme-aware.** Taiga tokens already provide light/dark via CSS vars. Prefer Taiga tokens
  (`var(--tui-text-primary)`, `var(--tui-background-neutral-1)`, …) over hard-coded colors in the
  remaining custom CSS. Delete custom CSS that a Taiga component now covers.

## Dev loop (fast — do NOT rebuild Docker per change)

UI iteration should use **ng serve**, not Docker image rebuilds:

1. Backend must be running on `:8080` (VS F5, or `docker compose up -d`). Owner login:
   `owner` / `Owner-Dev-2026`.
2. In `src/ArchiveDex.Server/ClientApp`: `npm start` → dev server on `http://localhost:4200`,
   proxies `/api` → `:8080` (proxy.conf.json already wired). Hot reload.
3. Type-check any time with: `npm run build -- --configuration development` (must stay 0 errors).
4. Only rebuild the Docker image (`docker compose build`) for a final end-to-end check, and know
   that VS's own containers may hold `:8080`/`:5432` — stop them first.

## Confirmed Taiga v5.16 APIs (selectors verified in node_modules)

| Need | Taiga | Import (verify exact path against node_modules if unsure) |
|---|---|---|
| Button | `<button tuiButton appearance="primary\|secondary\|flat\|outline">` | `TuiButton` from `@taiga-ui/core` |
| Icon button | `<button tuiIconButton iconStart="@tui.x">` | `TuiButton` |
| Text/number input | `<tui-textfield><input tuiTextfield [(ngModel)]="…"/></tui-textfield>` | `TuiTextfield` from `@taiga-ui/core` |
| Select / dropdown | `<tui-textfield><select tuiSelect …>` or `tui-select` | `TuiSelect` from `@taiga-ui/kit` + `TuiDataListWrapper` |
| Loader/spinner | `<tui-loader [showLoader]="loading()">` or standalone | `TuiLoader` from `@taiga-ui/core` |
| Notification / alert box | `<tui-notification appearance="error\|warning\|info">` | `TuiNotification` from `@taiga-ui/core` |
| Icon | `<tui-icon icon="@tui.search"/>` | `TuiIcon` from `@taiga-ui/core` |
| Title / subtitle text | `<h2 tuiTitle>` / `tuiSubtitle` | `TuiTitle` from `@taiga-ui/core` |
| Card container | `<div tuiCardLarge>` / `tuiCard` | `@taiga-ui/layout` (INSTALL — see task 1) |
| Badge / chip (condition, tags) | `<span tuiBadge>` / `tuiChip` | `TuiBadge` from `@taiga-ui/kit` |
| File upload (drag/drop) | `<input tuiInputFiles>` / `<tui-input-files>` | `TuiInputFiles` from `@taiga-ui/kit` |
| Toast notifications (optional) | `inject(TuiAlertService).open(...)` | `@taiga-ui/core` |

> When an exact import path/selector is uncertain, confirm it by grepping the installed package,
> e.g. `grep -rl "class TuiBadge" node_modules/@taiga-ui/kit/fesm2022/` and read its
> `selector:`/`exportAs:`. Do not guess versions — this repo is Taiga **5.16** on Angular **22**.

---

## 1. Prep

- [ ] Install layout package (needed for cards + app shell):
      `npm install --legacy-peer-deps @taiga-ui/layout`
      (use `--legacy-peer-deps`, like the rest — Angular 22 vs Taiga's Angular-19 peer range).
- [ ] Verify **icons** render: drop a `<tui-icon icon="@tui.search"/>` into `app.ts` temporarily,
      `npm start`, confirm the glyph shows. If blank, icons need a resolver — check Taiga docs for
      `TUI_ICON_RESOLVER` / `NG_EVENT_PLUGINS` and configure in `main.ts`. Remove the temp icon.
- [ ] `npm run build -- --configuration development` → 0 errors before starting conversions.

## 2. Shared states — `src/app/shared/states.component.ts`

Do this first; every feature component depends on it.

- [ ] `LoadingStateComponent` → render `<tui-loader size="l" [inheritColor]="true"><...></tui-loader>`
      or a centered `<tui-loader>`. Import `TuiLoader`.
- [ ] `EmptyStateComponent` → keep simple; use `tuiSubtitle`/muted token color. Optional
      `<tui-icon icon="@tui.inbox"/>` above the message.
- [ ] `ErrorStateComponent` → `<tui-notification appearance="error">{{ message }}</tui-notification>`
      plus a `<button tuiButton size="s" appearance="secondary" (click)="retry.emit()">` for retry.
      Keep `@Input() message`, `@Output() retry`.
- [ ] Verify: any page still shows loading/empty/error correctly (e.g. `/ui/sets` empty state).

## 3. App shell — `src/app/app.ts`

- [ ] Replace the custom sidebar with Taiga layout. Options (pick one, keep it simple):
  - **A (recommended):** keep the sidebar `<nav>` but make links
    `<a tuiButton appearance="flat" routerLink=… routerLinkActive>` with `<tui-icon>` per item;
    brand as `<h1 tuiTitle>`.
  - **B:** use `@taiga-ui/layout` `TuiNavigation` (app bar + drawer) for a full app frame.
- [ ] Keep `<tui-root>` as the outermost element. Keep `<router-outlet />`.
- [ ] Move layout colors to Taiga tokens; delete now-dead custom CSS.
- [ ] Add a **sign-out** affordance if trivial (calls `SessionService.signOut()`), else leave.
- [ ] Verify: nav renders, active link highlights, routing works, light/dark both look right.

## 4. Sign-in — `src/app/features/auth/sign-in.component.ts`

- [ ] Wrap the form in a `<div tuiCardLarge>` centered (max-width kept).
- [ ] Username + password → `<tui-textfield>` with `<label tuiTitle>`; password field
      `<input tuiTextfield type="password">`. Keep `[(ngModel)]`, `name`, `required`.
- [ ] Submit → `<button tuiButton type="submit" [disabled]="loading()">`. Show progress via
      `[loading]` if the button supports it, else keep `tui-loader`.
- [ ] Error → `<tui-notification appearance="error">{{ error() }}</tui-notification>` (keep the
      `@if (error())`).
- [ ] Keep `loading()`/`error()` signals. Verify: bad creds → error notification; good creds →
      navigates to `/capture`.

## 5. Sets overview — `src/app/features/sets/set-overview.component.ts`

- [ ] Heading → `<h2 tuiTitle>`.
- [ ] Each set card → `<button tuiCardLarge tuiSurface="elevated" (click)="openSet(s.id)">` (or
      `tuiCard`), with `tuiTitle`/`tuiSubtitle` for name + the `language · count · count` line.
- [ ] Keep the responsive `.grid`. Keep `loading()`/`error()`/`sets()` signals + the state
      components.
- [ ] Verify: empty state (fresh db) shows; with data, cards render + click navigates.

## 6. Card list — `src/app/features/cards/card-list.component.ts`

- [ ] Same card treatment as sets. Card = image (`<img>`) + `tuiTitle` name + `tuiSubtitle`
      `#number · N Exemplar(e)`. Consider `<tui-avatar>`/thumbnail styling for the image.
- [ ] Keep grid + signals. Verify: `/ui/sets/:id/cards` renders, empty state works, click → detail.

## 7. Card detail — `src/app/features/cards/card-detail.component.ts`

- [ ] Back link → `<a tuiButton appearance="flat" iconStart="@tui.arrow-left" routerLink="/sets">`.
- [ ] Title → `<h2 tuiTitle>` with the `#number` as `tuiSubtitle`.
- [ ] Each specimen → `<div tuiCardLarge>`: image, condition as `<span tuiBadge>`, valuation line.
      "Keine Bewertung" as muted subtitle.
- [ ] Keep the `@if (card(); as c)` alias + signals. Verify: detail renders, valuation vs
      "Keine Bewertung" both display.

## 8. Capture upload — `src/app/features/capture/capture-upload.component.ts`

- [ ] Replace the hidden `<input type=file>` + button with Taiga `<tui-input-files>` /
      `<input tuiInputFiles>` (drag-and-drop, `accept="image/*"`). Wire its value change to the
      existing `onFileSelected`/`upload()` flow.
- [ ] Uploading → `<tui-loader>`; error → `<tui-notification appearance="error">`.
- [ ] Keep `selectedFile()`/`uploading()`/`error()` signals. Verify: selecting an image triggers
      upload → navigates to `/capture/:id`.

## 9. Capture review — `src/app/features/capture/capture-review.component.ts` (biggest)

- [ ] All text inputs → `<tui-textfield><input tuiTextfield …></tui-textfield>` with `tuiTitle`
      labels. Keep every `name` + `[(ngModel)]="model.x"` + `required`/`maxlength` exactly.
- [ ] `condition` `<select>` → Taiga `tui-select` (`TuiSelect` + `TuiDataListWrapper`) with the same
      options NM/LP/MP/HP/DMG. Keep `[(ngModel)]="model.condition"`.
- [ ] Duplicate warning `<p class="warning">` → `<tui-notification appearance="warning">`.
- [ ] Error/failed/needsNewImage states → `<tui-notification>` (error) + `<button tuiButton>` for
      the retry / "Neues Bild" actions.
- [ ] Submit → `<button tuiButton type="submit" [disabled]="saving() || reviewForm.invalid">`;
      keep the `saving() ? 'Speichert…' : …` label (or button `[loading]="saving()"`).
- [ ] Keep the `@let c = capture();` alias + all `capture()/loading()/saving()/error()` signals and
      the `poll(...)` subscription logic UNCHANGED.
- [ ] Consider the duplicate-confirm `confirm(...)` → `TuiAlertService`/`TuiDialogService` (optional
      polish; only if straightforward).
- [ ] Verify: needsReview form renders + validates + saves; failed/needsNewImage branches show
      correct notifications + buttons.

## 10. Cleanup + final check

- [ ] Remove `@angular/material` and `@angular/cdk` from `package.json` (unused — 0 refs). Run
      `npm install --legacy-peer-deps` after.
- [ ] Grep for leftover hand-rolled styles that Taiga now covers; delete dead CSS.
- [ ] `npm run build -- --configuration development` → 0 errors.
- [ ] Full click-through on `:4200` logged in as `owner`/`Owner-Dev-2026`: capture upload → review
      → save → card detail → sets → card list. Check light AND dark theme.
- [ ] Optional end-to-end: `docker compose build && docker compose up -d`, hit `:8080/ui/`.

## Verification recipe (headless, optional per component)

To assert a view isn't stuck / renders expected text without a manual browser, use Playwright
(already a devDependency) against the running app. Log in via in-page fetch (antiforgery →
sign-in), navigate, then read `document.body.innerText`. Pattern:

```js
// node script run from ClientApp, `import { chromium } from 'playwright'`
await page.goto('http://localhost:4200/ui/');
await page.evaluate(async () => {
  await fetch('/api/v1/antiforgery', {credentials:'include'});
  const x = document.cookie.split('; ').find(c=>c.startsWith('XSRF-TOKEN='))?.split('=')[1]||'';
  await fetch('/api/v1/session/sign-in', {method:'POST', credentials:'include',
    headers:{'Content-Type':'application/json','X-XSRF-TOKEN':decodeURIComponent(x)},
    body: JSON.stringify({userName:'owner', password:'Owner-Dev-2026'})});
});
await page.goto('http://localhost:4200/ui/sets', {waitUntil:'networkidle'});
// assert innerText contains the expected copy, not "Laden…"
```
(Delete any throwaway test scripts after — don't commit them.)

## Notes / pitfalls

- Taiga `.less` global styles + `stylePreprocessorOptions.includePaths` incl. `node_modules` are
  already set in `angular.json`. New Taiga component imports are standalone — add them to each
  component's `imports: [...]`.
- Don't touch `main.ts` CD config or the zoneless setup.
- The dev container serves a **development** Angular build (readable errors, DevTools); the Docker
  image builds **production**. Both must stay green.
- If a view "doesn't update" after an async action, it's a missing signal — not a Taiga bug.
- **`TuiInputFiles`/`input[tuiInputFiles]` does not reliably deliver the picked `File` via
  `[ngModel]`/`(ngModelChange)`.** `TuiInputFilesDirective` requires an `NgControl` sibling (hence
  needs `ngModel` present at all — its constructor does `inject(NgControl, {self: true})`), and it
  self-registers as the value accessor by directly assigning `ngControl.valueAccessor = this` in
  its constructor. Empirically (verified with a real `setInputFiles()` + captured network request)
  this self-registration loses the race against Angular's own `NgModel` constructor — which
  resolves `DefaultValueAccessor` via `NG_VALUE_ACCESSOR` DI — so `ngModelChange` ends up firing
  with the native `<input>` element's raw DOM `.value` (the browser's fake `"C:\fakepath\name.png"`
  string for file inputs), not the real `File` object `TuiInputFilesDirective.process()` computed.
  **Fix:** keep a bare `ngModel` attribute on the input (structurally required, don't bind or read
  its value) and read the actual file from your own native `(change)` handler instead:
  `(change)="onNativeChange($event)"` with `(event.target as HTMLInputElement).files?.[0]`. This is
  safe against Taiga's wrapping `<label tuiInputFiles>` (which has its own bubble-phase `(change)`
  listener that calls `input.value = ''` after processing) because target-phase listeners on the
  `<input>` itself always run before bubble-phase listeners on an ancestor `<label>`, so your own
  handler reads `input.files` before Taiga clears it. See
  `src/app/features/capture/capture-upload.component.ts`.
- **`tui-textfield` inputs MUST have the `tuiInput` directive** (`input tuiInput`, `TuiInputDirective`
  from `@taiga-ui/core`). Without it the input isn't wired as the textfield's value accessor, so the
  floating label + cleaner lay out as a detached flex row next to a tiny input (looks completely
  broken). Correct: `<tui-textfield><label tuiLabel>X</label><input tuiInput [(ngModel)]="v"/></tui-textfield>`.
- **Taiga native `select[tuiSelect]` (`TuiNativeSelect`) doesn't display a pre-set value under
  zoneless.** Its `valueEffect` writes the display string only when the `<option>`s first appear and
  reads the value **untracked**; with zoneless CD, `ngModel`'s `writeValue` runs after that effect,
  so a preselected value (e.g. condition = `'NM'`) shows an empty field (class `_empty`, label not
  floating) even though the underlying `<select>.value` is correct and it submits fine. For a small
  fixed enum, a plain native `<select>` styled with Taiga tokens
  (`background:var(--tui-background-neutral-1)`, `min-height:var(--tui-height-l)`,
  `border-radius:var(--tui-radius-l)`) is more reliable — see the `Zustand` field in
  `capture-review.component.ts`.
- **Show progress during async workflow states.** The capture poll (`load()`) sets `loading=false`
  on the first emit (status `uploaded`/`analyzing`), so without an explicit branch for those states
  the page goes blank until `needsReview`. capture-review has an `@else if (c?.status === 'uploaded'
  || c?.status === 'analyzing')` branch with a `<tui-loader>` + "Bild wird analysiert…".
- Icons need their SVGs copied into the build output: `angular.json` has an `assets` glob entry
  copying `node_modules/@taiga-ui/icons/src/**/*.svg` → `assets/taiga-ui/icons`. Without it,
  `<tui-icon icon="@tui.name">` resolves to a 404'd SVG (renders blank, no error).
- `@taiga-ui/kit` and `@taiga-ui/layout` transitively need several `@ng-web-apis/*` and
  `@maskito/*` peers even if you only use one export (e.g. `TuiBadge` or `TuiCardLarge`) — Angular's
  esbuild-based dev builder resolves each fesm **file**, not per-symbol, so importing anything from
  a barrel file pulls in that file's full import graph. Installed:
  `@ng-web-apis/resize-observer`, `@maskito/angular`, `@maskito/kit`, `@maskito/core`,
  `@maskito/phone`, `libphonenumber-js`. If a future Taiga import errors with
  "Could not resolve X", it's almost always a missing peer — `npm install --legacy-peer-deps X`.
- **`ng serve` + `<base href="/ui/">` don't mix.** The backend serves the SPA under `/ui` (see
  [[vs-docker-dev-setup]]), so `index.html` has `<base href="/ui/">`. But `ng serve`'s dev server
  always serves compiled assets at its own root (`http://localhost:4200/main.js`), ignoring the
  configured base href — so the browser (following `<base>`) requests `/ui/main.js` and gets a 404,
  and the app never boots (blank page, no console error beyond the failed asset load). This is
  **not a Taiga issue** — it predates this migration (base href was set for the ASP.NET-hosted
  scenario). Consequence: the "Dev loop" section's `ng serve` + `:4200` fast loop does **not**
  currently work for anything under `/ui/*`. For real end-to-end verification, rebuild the Docker
  image and test against `:8080/ui/` instead (slower, but correct) — that's what this migration was
  ultimately verified against. Fixing the dev loop (e.g. a serve-only base-href override) is a
  separate follow-up, out of scope here.
