import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { ZoomableImageComponent } from '../../shared/zoomable-image.component';
import { TuiButton, TuiIcon, TuiInputDirective, TuiNotificationDirective, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiBadge } from '@taiga-ui/kit';

interface SpecimenValuation {
  status: string;
  amountMinor?: number;
  currency?: string;
  provider?: string;
  method?: string;
  confidence?: string | null;
  conditionApplied?: boolean | null;
  estimatedAt?: string | null;
  marketDataAsOf?: string | null;
  sourceUrls?: string[];
}

/** A value the plausibility guard held back instead of overwriting the current one. */
interface ReviewPending {
  amountMinor: number;
  previousAmountMinor: number | null;
  reason: string | null;
  provider: string | null;
  method: string | null;
  confidence: string | null;
  sourceUrls?: string[];
  recordedAt: string;
}

interface CardSpecimen {
  id: string; condition: string; imageUrl: string; thumbnailUrl: string;
  etag: string; valuation: SpecimenValuation; reviewPending: ReviewPending | null;
}

interface CardDetail {
  id: string; catalogReferenceId: string | null;
  originalName: string; germanName: string | null; germanNameUnavailableReason: string | null;
  printedNumber: string; collectorNumber: string; setTotal: string | null;
  setIdentifier: string; setName: string; language: string; variantKey: string; etag: string;
  specimens: CardSpecimen[];
}

interface CardEditModel {
  catalogReferenceId: string | null;
  originalName: string;
  germanName: string | null;
  germanNameUnavailableReason: string | null;
  collectorNumber: string;
  setTotal: string | null;
  setIdentifier: string;
  setName: string;
  language: string;
  variantKey: string;
}

interface SpecimenValuationEdit {
  specimenId: string;
  condition: string;
  thumbnailUrl: string;
  amountEur: number | null;
  originalAmountMinor: number | null;
  etag: string;
}

/** Long form of the trading-card condition codes the capture pipeline assigns. */
const CONDITION_LABELS: Record<string, string> = {
  NM: 'Near Mint — wie neu',
  LP: 'Lightly Played — leicht gespielt',
  MP: 'Moderately Played — mäßig gespielt',
  HP: 'Heavily Played — stark gespielt',
  DMG: 'Damaged — beschädigt',
};

const CONDITION_APPEARANCES: Record<string, string> = {
  NM: 'positive', LP: 'info', MP: 'warning', HP: 'warning', DMG: 'negative',
};

@Component({
  selector: 'app-card-detail', standalone: true,
  imports: [
    DatePipe, UpperCasePipe, FormsModule, RouterLink, ErrorStateComponent, LoadingStateComponent,
    ZoomableImageComponent, TuiButton, TuiIcon, TuiInputDirective, TuiNotificationDirective,
    TuiTextfield, TuiTitle, TuiCardLarge, TuiBadge,
  ],
  template: `
    @if (loading()) { <app-loading-state /> }
    @else if (error() && !card()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (card(); as c) {
      <div class="toolbar">
        <a tuiButton appearance="flat" size="s" iconStart="@tui.arrow-left" routerLink="/sets">Sammlung</a>
        @if (!editing()) {
          <button tuiButton appearance="secondary" size="s" iconStart="@tui.pencil" type="button" (click)="startEditing(c)">Bearbeiten</button>
        }
      </div>

      @if (editing()) {
        <form (ngSubmit)="save(c)" #editForm="ngForm" class="edit-form">
          <h2 tuiTitle>Kartendaten bearbeiten<span tuiSubtitle>Änderungen am Setnamen gelten für das gesamte Set.</span></h2>

          <fieldset tuiCardLarge="compact" class="panel">
            <legend class="panel-heading"><tui-icon icon="@tui.tag" />Karte</legend>
            <tui-textfield><label tuiLabel>Name</label><input tuiInput name="originalName" [(ngModel)]="editModel.originalName" required maxlength="200" /></tui-textfield>
            <div class="pair">
              <tui-textfield><label tuiLabel>Deutscher Name</label><input tuiInput name="germanName" [(ngModel)]="editModel.germanName" maxlength="200" (ngModelChange)="germanNameChanged($event)" /></tui-textfield>
              <tui-textfield><label tuiLabel>Grund, falls nicht verfügbar</label><input tuiInput name="germanNameUnavailableReason" [(ngModel)]="editModel.germanNameUnavailableReason" maxlength="200" (ngModelChange)="unavailableReasonChanged($event)" /></tui-textfield>
            </div>
            <div class="pair">
              <tui-textfield><label tuiLabel>Kartennummer</label><input tuiInput name="collectorNumber" [(ngModel)]="editModel.collectorNumber" required maxlength="25" /></tui-textfield>
              <tui-textfield><label tuiLabel>Karten im Set</label><input tuiInput name="setTotal" [(ngModel)]="editModel.setTotal" maxlength="25" placeholder="z. B. 200" /></tui-textfield>
            </div>
          </fieldset>

          <fieldset tuiCardLarge="compact" class="panel">
            <legend class="panel-heading"><tui-icon icon="@tui.layers" />Set</legend>
            <div class="pair">
              <tui-textfield><label tuiLabel>Set-Code</label><input tuiInput name="setIdentifier" [(ngModel)]="editModel.setIdentifier" required maxlength="100" /></tui-textfield>
              <tui-textfield><label tuiLabel>Setname</label><input tuiInput name="setName" [(ngModel)]="editModel.setName" required maxlength="200" /></tui-textfield>
            </div>
            <div class="pair">
              <tui-textfield><label tuiLabel>Sprache</label><input tuiInput name="language" [(ngModel)]="editModel.language" required maxlength="10" /></tui-textfield>
              <tui-textfield><label tuiLabel>Variante</label><input tuiInput name="variantKey" [(ngModel)]="editModel.variantKey" required maxlength="50" /></tui-textfield>
            </div>
          </fieldset>

          <fieldset tuiCardLarge="compact" class="panel">
            <legend class="panel-heading"><tui-icon icon="@tui.badge-euro" />Werte der Exemplare</legend>
            <p class="hint">Werte werden in EUR gespeichert. Ein leeres Feld entfernt die vorhandene Bewertung.</p>
            @for (valuation of valuationEdits; track valuation.specimenId) {
              <div class="valuation-row">
                <img [src]="valuation.thumbnailUrl" alt="" />
                <span tuiBadge [appearance]="conditionAppearance(valuation.condition)" [attr.title]="conditionLabel(valuation.condition)">{{ valuation.condition }}</span>
                <tui-textfield>
                  <label tuiLabel>Manueller Wert (EUR)</label>
                  <input
                    tuiInput
                    type="number"
                    inputmode="decimal"
                    min="0"
                    step="0.01"
                    name="valuation-{{ valuation.specimenId }}"
                    [(ngModel)]="valuation.amountEur"
                  />
                </tui-textfield>
              </div>
            }
          </fieldset>

          @if (error()) { <p tuiNotification appearance="negative" role="alert">{{ error() }}</p> }
          <div class="actions">
            <button tuiButton appearance="primary" type="submit" [disabled]="saving() || editForm.invalid">{{ saving() ? 'Speichert…' : 'Speichern' }}</button>
            <button tuiButton appearance="flat" type="button" [disabled]="saving()" (click)="cancelEditing()">Abbrechen</button>
          </div>
        </form>
      } @else {
        @if (error()) { <p tuiNotification appearance="negative" role="alert" class="view-error">{{ error() }}</p> }
        <header tuiCardLarge="compact" class="hero">
          <div class="hero-art">
            @if (primarySpecimen(); as specimen) {
              <app-zoomable-image
                class="hero-image"
                [src]="specimen.imageUrl"
                [thumbnailSrc]="specimen.thumbnailUrl"
                [alt]="displayName(c)"
              />
            } @else {
              <div class="hero-placeholder"><tui-icon icon="@tui.image" /></div>
            }
          </div>
          <div class="hero-body">
            <h2 tuiTitle class="hero-title">
              {{ displayName(c) }}
              @if (secondaryName(c); as secondary) { <span tuiSubtitle>{{ secondary }}</span> }
            </h2>
            <div class="chips">
              <span tuiBadge appearance="primary">#{{ c.printedNumber }}</span>
              <span tuiBadge appearance="neutral">{{ c.setName }}</span>
              <span tuiBadge appearance="neutral">{{ c.language | uppercase }}</span>
              <span tuiBadge appearance="neutral">{{ c.variantKey }}</span>
            </div>
            <dl class="stats">
              <div><dt>Gesamtwert</dt><dd>{{ totalValueText() }}</dd></div>
              <div><dt>Exemplare</dt><dd>{{ c.specimens.length }}</dd></div>
              <div><dt>Bewertet</dt><dd>{{ valuedCount() }} / {{ c.specimens.length }}</dd></div>
            </dl>
          </div>
        </header>

        <section tuiCardLarge="compact" class="panel card-data" aria-labelledby="card-data-title">
          <h3 id="card-data-title" class="panel-heading"><tui-icon icon="@tui.info" />Kartendaten</h3>
          <dl class="facts">
            <div><dt>Name auf der Karte</dt><dd>{{ c.originalName }}</dd></div>
            <div><dt>Deutscher Name</dt><dd [class.unset]="!c.germanName">{{ c.germanName || 'Nicht angegeben' }}</dd></div>
            <div><dt>Grund, falls nicht verfügbar</dt><dd [class.unset]="!c.germanNameUnavailableReason">{{ c.germanNameUnavailableReason || 'Nicht angegeben' }}</dd></div>
            <div><dt>Kartennummer</dt><dd>{{ c.collectorNumber }}</dd></div>
            <div><dt>Karten im Set</dt><dd [class.unset]="!c.setTotal">{{ c.setTotal || 'Nicht angegeben' }}</dd></div>
            <div><dt>Set-Code</dt><dd>{{ c.setIdentifier }}</dd></div>
            <div><dt>Setname</dt><dd>{{ c.setName }}</dd></div>
            <div><dt>Sprache</dt><dd>{{ c.language }}</dd></div>
            <div><dt>Variante</dt><dd>{{ c.variantKey }}</dd></div>
          </dl>
        </section>

        <h3 class="section-heading">
          <tui-icon icon="@tui.layers" />Exemplare
          <span class="section-count">{{ c.specimens.length }}</span>
        </h3>
        <div class="specimens">@for (specimen of c.specimens; track specimen.id; let index = $index) {
          <article tuiCardLarge="compact" class="specimen">
            <app-zoomable-image
              class="specimen-thumb"
              [src]="specimen.imageUrl"
              [thumbnailSrc]="specimen.thumbnailUrl"
              [alt]="displayName(c) + ' — Exemplar ' + (index + 1)"
            />
            <div class="specimen-body">
              <div class="specimen-head">
                <span tuiBadge [appearance]="conditionAppearance(specimen.condition)" [attr.title]="conditionLabel(specimen.condition)">{{ specimen.condition }}</span>
                <span class="ordinal">Exemplar {{ index + 1 }}</span>
              </div>
              @if (specimen.valuation.status === 'available') {
                <p class="amount">{{ formatEur(specimen.valuation.amountMinor) }}</p>
                <p class="provider">{{ valuationDescription(specimen.valuation) }}</p>
                <ul class="valuation-meta">
                  @if (specimen.valuation.estimatedAt) {
                    <li><tui-icon icon="@tui.calendar" />Bewertet am {{ specimen.valuation.estimatedAt | date:'dd.MM.yyyy' }}</li>
                  }
                  @if (specimen.valuation.marketDataAsOf) {
                    <li><tui-icon icon="@tui.trending-up" />Marktdaten vom {{ specimen.valuation.marketDataAsOf | date:'dd.MM.yyyy' }}</li>
                  }
                  @if (specimen.valuation.confidence) {
                    <li><tui-icon icon="@tui.gauge" />Konfidenz {{ specimen.valuation.confidence }}</li>
                  }
                  @if (specimen.valuation.conditionApplied) {
                    <li><tui-icon icon="@tui.check" />Zustand eingerechnet</li>
                  }
                </ul>
                @if (specimen.valuation.sourceUrls?.length) {
                  <div class="source-links">
                    @for (url of specimen.valuation.sourceUrls; track url) {
                      <a [href]="url" target="_blank" rel="noopener noreferrer">
                        <tui-icon icon="@tui.external-link" />{{ sourceHost(url) }}
                      </a>
                    }
                  </div>
                }
              }
              @else { <p class="no-value"><tui-icon icon="@tui.circle-slash" />Keine Bewertung</p> }

              @if (specimen.reviewPending; as pending) {
                <div class="review" role="group" [attr.aria-label]="'Vorgeschlagener Wert für Exemplar ' + (index + 1)">
                  <p class="review-head">
                    <tui-icon icon="@tui.triangle-alert" />
                    <span tuiBadge appearance="warning">Zu prüfen</span>
                  </p>
                  <p class="review-amount">
                    {{ formatEur(pending.amountMinor) }}
                    @if (pending.previousAmountMinor !== null) {
                      <span class="review-previous">statt {{ formatEur(pending.previousAmountMinor) }}</span>
                    }
                  </p>
                  @if (pending.reason) { <p class="review-reason">{{ pending.reason }}</p> }
                  <div class="review-actions">
                    <button tuiButton appearance="primary" size="s" type="button"
                      [disabled]="resolving() === specimen.id"
                      (click)="resolveReview(specimen, 'accept')">Übernehmen</button>
                    <button tuiButton appearance="secondary" size="s" type="button"
                      [disabled]="resolving() === specimen.id"
                      (click)="resolveReview(specimen, 'reject')">Verwerfen</button>
                  </div>
                </div>
              }
            </div>
          </article>
        }</div>
      }
    }
  `,
  styles: [`
    :host{display:block;max-width:64rem}
    .toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem}

    .view-error{margin:1.5rem 0 0}
    .hero{display:grid;grid-template-columns:minmax(0,14rem) minmax(0,1fr);gap:1.75rem;align-items:start;margin-top:1.5rem}
    .hero-art{position:relative;display:grid;place-items:center;padding:.75rem;border-radius:1rem;
      background:radial-gradient(circle at 50% 30%,var(--tui-background-neutral-1) 0%,transparent 72%)}
    .hero-image{width:100%}
    .hero-placeholder{display:grid;place-items:center;width:100%;aspect-ratio:5/7;border-radius:.6rem;
      border:1px dashed var(--tui-border-normal);color:var(--tui-text-tertiary)}
    .hero-placeholder tui-icon{font-size:2rem}
    .hero-body{display:grid;gap:1rem;min-width:0}
    .hero-title{overflow-wrap:anywhere}
    .chips{display:flex;flex-wrap:wrap;gap:.4rem}

    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:.75rem;margin:0}
    .stats>div{padding:.65rem .8rem;border-radius:.65rem;background:var(--tui-background-neutral-1);min-width:0}
    .stats dt{color:var(--tui-text-secondary);font-size:.75rem;text-transform:uppercase;letter-spacing:.04em}
    .stats dd{margin:.2rem 0 0;font-size:1.05rem;font-weight:600;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}

    .panel{display:grid;gap:1rem;margin-top:1.5rem;min-width:0}
    .panel-heading{display:flex;align-items:center;gap:.5rem;margin:0;font-size:1rem;font-weight:600;padding:0}
    .panel-heading tui-icon{color:var(--tui-text-secondary)}
    .section-heading{display:flex;align-items:center;gap:.5rem;margin:2rem 0 1rem;font-size:1rem;font-weight:600}
    .section-heading tui-icon{color:var(--tui-text-secondary)}
    .section-count{padding:.05rem .5rem;border-radius:1rem;background:var(--tui-background-neutral-1);
      color:var(--tui-text-secondary);font-size:.8125rem;font-weight:500}

    .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:1rem 1.5rem;margin:0}
    .facts>div{min-width:0;padding-bottom:.6rem;border-bottom:1px solid var(--tui-border-normal)}
    .facts dt{color:var(--tui-text-secondary);font-size:.8125rem;margin-bottom:.2rem}
    .facts dd{margin:0;overflow-wrap:anywhere}
    .facts dd.unset{color:var(--tui-text-tertiary);font-style:italic}

    .specimens{display:grid;grid-template-columns:repeat(auto-fill,minmax(20rem,1fr));gap:1rem}
    .specimen{display:grid;grid-template-columns:6.5rem minmax(0,1fr);gap:1rem;align-items:start}
    .specimen-thumb{width:6.5rem;height:9rem}
    .specimen-body{display:grid;gap:.45rem;min-width:0}
    .specimen-head{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
    .ordinal{color:var(--tui-text-tertiary);font-size:.8125rem}
    .amount{margin:0;font-size:1.35rem;font-weight:700;font-variant-numeric:tabular-nums}
    .provider{margin:0;color:var(--tui-text-secondary);font-size:.875rem;overflow-wrap:anywhere}
    .valuation-meta{display:grid;gap:.2rem;margin:.15rem 0 0;padding:0;list-style:none;
      color:var(--tui-text-tertiary);font-size:.8125rem}
    .valuation-meta li{display:flex;align-items:center;gap:.35rem}
    .valuation-meta tui-icon,.source-links tui-icon,.no-value tui-icon{font-size:.9rem}
    .source-links{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.15rem}
    .source-links a{display:inline-flex;align-items:center;gap:.3rem;padding:.15rem .5rem;border-radius:1rem;
      background:var(--tui-background-neutral-1);color:var(--tui-text-secondary);font-size:.8125rem;text-decoration:none}
    .source-links a:hover{color:var(--tui-text-primary)}
    .no-value{display:flex;align-items:center;gap:.35rem;margin:0;color:var(--tui-text-tertiary)}

    .review{display:grid;gap:.4rem;margin-top:.5rem;padding:.65rem .75rem;border-radius:.6rem;
      background:var(--tui-background-neutral-1);border:1px solid var(--tui-status-warning, var(--tui-border-normal))}
    .review-head{display:flex;align-items:center;gap:.4rem;margin:0}
    .review-head tui-icon{color:var(--tui-text-warning, var(--tui-text-secondary));font-size:.95rem}
    .review-amount{margin:0;font-size:1.1rem;font-weight:700;font-variant-numeric:tabular-nums}
    .review-previous{margin-inline-start:.4rem;font-size:.8125rem;font-weight:400;
      color:var(--tui-text-tertiary);text-decoration:line-through}
    .review-reason{margin:0;font-size:.8125rem;color:var(--tui-text-secondary)}
    .review-actions{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.15rem}

    .edit-form{display:grid;gap:1.25rem;margin-top:1.5rem}
    .edit-form fieldset{border:0}
    .pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .hint{margin:-.35rem 0 0;color:var(--tui-text-tertiary);font-size:.875rem}
    .valuation-row{display:grid;grid-template-columns:3rem auto minmax(12rem,1fr);gap:.75rem;align-items:center}
    .valuation-row img{width:3rem;height:4.2rem;object-fit:contain;border-radius:.25rem;background:var(--tui-background-neutral-1)}
    .actions{display:flex;gap:.75rem;align-items:center}

    @media(max-width:760px){
      .hero{grid-template-columns:1fr;justify-items:center;text-align:center}
      .hero-art{max-width:16rem}
      .hero-body{justify-items:center;width:100%}
      .chips{justify-content:center}
      .stats{width:100%;text-align:left}
    }
    @media(max-width:600px){
      .pair{grid-template-columns:1fr}
      .specimen{grid-template-columns:5rem minmax(0,1fr)}
      .specimen-thumb{width:5rem;height:6.9rem}
      .valuation-row{grid-template-columns:3rem 1fr}
      .valuation-row tui-textfield{grid-column:1/-1}
    }
  `],
})
export class CardDetailComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly card = signal<CardDetail | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editing = signal(false);
  readonly error = signal('');
  /** Id of the specimen whose held value is currently being accepted or rejected. */
  readonly resolving = signal('');
  editModel: CardEditModel = this.emptyEditModel();
  valuationEdits: SpecimenValuationEdit[] = [];

  /** The hero shows the first specimen; the rest stay in the specimen grid below. */
  readonly primarySpecimen = computed(() => this.card()?.specimens[0] ?? null);
  readonly valuedCount = computed(
    () => this.card()?.specimens.filter(specimen => specimen.valuation.status === 'available').length ?? 0);
  readonly totalValueMinor = computed(
    () => this.card()?.specimens.reduce((sum, specimen) => sum + (specimen.valuation.amountMinor ?? 0), 0) ?? 0);

  private readonly eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

  ngOnInit(): void { void this.load(); }

  async load(): Promise<void> {
    this.loading.set(true); this.error.set('');
    try {
      this.card.set(await firstValueFrom(this.http.get<CardDetail>(`/api/v1/cards/${this.route.snapshot.paramMap.get('cardId')}`)));
    } catch {
      this.error.set('Kartendetail konnte nicht geladen werden.');
    } finally {
      this.loading.set(false);
    }
  }

  startEditing(card: CardDetail): void {
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
      variantKey: card.variantKey,
    };
    this.valuationEdits = card.specimens.map(specimen => ({
      specimenId: specimen.id,
      condition: specimen.condition,
      thumbnailUrl: specimen.thumbnailUrl,
      amountEur: specimen.valuation.amountMinor == null ? null : specimen.valuation.amountMinor / 100,
      originalAmountMinor: specimen.valuation.amountMinor ?? null,
      etag: specimen.etag,
    }));
    this.error.set('');
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.error.set('');
    this.valuationEdits = [];
    this.editing.set(false);
  }

  async save(card: CardDetail): Promise<void> {
    const collectorNumber = this.editModel.collectorNumber.trim();
    const setTotal = this.editModel.setTotal?.trim() || null;
    const printedNumber = setTotal ? `${collectorNumber}/${setTotal}` : collectorNumber;
    if (this.valuationEdits.some(edit => !this.isValidAmount(edit.amountEur))) {
      this.error.set('Der manuelle Wert muss 0 oder größer sein und darf höchstens zwei Nachkommastellen haben.');
      return;
    }
    const specimenValuations = this.valuationEdits
      .map(edit => ({...edit, amountMinor: this.toAmountMinor(edit.amountEur)}))
      .filter(edit => edit.amountMinor !== edit.originalAmountMinor)
      .map(edit => ({specimenId: edit.specimenId, amountMinor: edit.amountMinor, etag: edit.etag}));
    this.saving.set(true); this.error.set('');
    try {
      const updated = await firstValueFrom(this.http.put<CardDetail>(`/api/v1/cards/${card.id}`, {
        ...this.editModel,
        collectorNumber,
        setTotal,
        printedNumber,
        specimenValuations,
      }, {headers: {'If-Match': card.etag}}));
      this.card.set(updated);
      this.editing.set(false);
      if (updated.id !== card.id)
        await this.router.navigate(['/cards', updated.id], {replaceUrl: true});
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409)
        this.error.set('Die Karte wurde zwischenzeitlich geändert. Bitte neu laden und erneut bearbeiten.');
      else if (error instanceof HttpErrorResponse && error.error?.detail)
        this.error.set(error.error.detail);
      else
        this.error.set('Die Änderungen konnten nicht gespeichert werden.');
    } finally {
      this.saving.set(false);
    }
  }

  germanNameChanged(value: string | null): void {
    if (value?.trim()) this.editModel.germanNameUnavailableReason = null;
  }

  unavailableReasonChanged(value: string | null): void {
    if (value?.trim()) this.editModel.germanName = null;
  }

  /** Takes over or discards a held value, then reloads so the card reflects the new truth. */
  async resolveReview(specimen: CardSpecimen, decision: 'accept' | 'reject'): Promise<void> {
    this.resolving.set(specimen.id);
    this.error.set('');
    try {
      await firstValueFrom(this.http.post(
        `/api/v1/specimens/${specimen.id}/valuation/review`,
        {decision},
        {headers: {'If-Match': specimen.etag}}));
      await this.load();
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409)
        this.error.set('Das Exemplar wurde zwischenzeitlich geändert. Bitte neu laden.');
      else
        this.error.set('Der Vorschlag konnte nicht verarbeitet werden.');
    } finally {
      this.resolving.set('');
    }
  }

  displayName(card: CardDetail): string {
    return card.germanName || card.originalName;
  }

  /** Shown under the title only when it adds information beyond the headline name. */
  secondaryName(card: CardDetail): string {
    return card.germanName && card.germanName !== card.originalName ? card.originalName : '';
  }

  totalValueText(): string {
    return this.valuedCount() === 0 ? 'Noch kein Schätzwert' : this.eur.format(this.totalValueMinor() / 100);
  }

  formatEur(amountMinor: number | null | undefined): string {
    return this.eur.format((amountMinor ?? 0) / 100);
  }

  conditionLabel(condition: string): string {
    return CONDITION_LABELS[condition] ?? condition;
  }

  conditionAppearance(condition: string): string {
    return CONDITION_APPEARANCES[condition] ?? 'neutral';
  }

  sourceHost(url: string): string {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return 'Quelle'; }
  }

  valuationDescription(valuation: SpecimenValuation): string {
    if (valuation.provider === 'manual') return 'Manuell eingetragen';
    return [valuation.provider, valuation.method].filter(Boolean).join(' · ');
  }

  private isValidAmount(amountEur: number | null): boolean {
    if (amountEur == null) return true;
    if (!Number.isFinite(amountEur) || amountEur < 0) return false;
    const amountMinor = amountEur * 100;
    return Number.isSafeInteger(Math.round(amountMinor))
      && Math.abs(amountMinor - Math.round(amountMinor)) < 0.000001;
  }

  private toAmountMinor(amountEur: number | null): number | null {
    return amountEur == null ? null : Math.round(amountEur * 100);
  }

  private emptyEditModel(): CardEditModel {
    return {
      catalogReferenceId: null,
      originalName: '',
      germanName: null,
      germanNameUnavailableReason: null,
      collectorNumber: '',
      setTotal: null,
      setIdentifier: '',
      setName: '',
      language: '',
      variantKey: '',
    };
  }
}
