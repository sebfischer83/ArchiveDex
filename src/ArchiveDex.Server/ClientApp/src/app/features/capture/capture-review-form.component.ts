import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Capture, CaptureService, ReviewCapture, deriveReviewModel } from './capture.service';
import { ZoomableImageComponent } from '../../shared/zoomable-image.component';
import { TuiButton, TuiTextfield, TuiInputDirective, TuiNotificationDirective } from '@taiga-ui/core';

export interface CaptureSaved { cardRecordId: string | undefined; specimenId: string | undefined; }

/**
 * Editable review form for a single capture in `needsReview` state. Extracted from
 * CaptureReviewComponent so the batch review list can reuse the exact same
 * confirm/edit/save behaviour. Runs review + finalize and emits (saved) on success;
 * the parent decides what to do next (navigate, mark item done, ...).
 */
@Component({
  selector: 'app-capture-review-form',
  standalone: true,
  imports: [FormsModule, ZoomableImageComponent, TuiButton, TuiTextfield, TuiInputDirective, TuiNotificationDirective],
  template: `
    @if (current().duplicate) {
      <div tuiNotification appearance="warning">
        <span>Dieses Bild ist bereits in der Sammlung. Beim Speichern ist eine Bestätigung nötig.</span>
      </div>
    }
    <div class="review-body">
      <app-zoomable-image class="capture-image" [src]="current().imageUrl" [thumbnailSrc]="current().thumbnailUrl" alt="Aufgenommene Karte" />
      <form (ngSubmit)="save()" #reviewForm="ngForm">
        <tui-textfield><label tuiLabel>Name auf der Karte</label><input tuiInput name="originalName" [(ngModel)]="model.originalName" required maxlength="200" /></tui-textfield>
        <tui-textfield><label tuiLabel>Deutscher Name</label><input tuiInput name="germanName" [(ngModel)]="model.germanName" maxlength="200" /></tui-textfield>
        <tui-textfield><label tuiLabel>Grund, falls nicht verfügbar</label><input tuiInput name="germanNameUnavailableReason" [(ngModel)]="model.germanNameUnavailableReason" maxlength="200" /></tui-textfield>
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
        @if (current().proposal?.condition?.limitations?.length) {
          <p class="note">Einschränkung: {{ current().proposal!.condition.limitations.join(', ') }}</p>
        }
        @if (current().proposal?.valuation?.status === 'available') {
          <div>
            <p>Aktueller Schätzwert: {{ ((current().proposal?.valuation?.amountMinor || 0) / 100).toFixed(2) }} EUR</p>
            <p class="note">{{ current().proposal!.valuation!.provider }} · {{ current().proposal!.valuation!.method }}</p>
            @if (current().proposal!.valuation!.sourceUrls.length) {
              <div class="source-links">
                Quellen:
                @for (url of current().proposal!.valuation!.sourceUrls; track url) {
                  <a [href]="url" target="_blank" rel="noopener noreferrer">{{ sourceHost(url) }}</a>
                }
              </div>
            }
          </div>
        }
        @if (current().proposal?.aiCost; as aiCost) {
          <p class="note">
            KI-Analyse:
            @if (aiCost.estimatedAmount !== null) {
              ca. {{ formatAiCost(aiCost.estimatedAmount) }} {{ aiCost.currency }}
            } @else {
              Kosten für dieses Modell nicht hinterlegt
            }
            <br />
            {{ aiCost.provider }} · {{ aiCost.model }} ·
            {{ aiCost.inputTokens }} Input- / {{ aiCost.outputTokens }} Output-Tokens
            @if (aiCost.webSearchCalls) { · {{ aiCost.webSearchCalls }} Websuche(n) }
            @if (aiCost.isBatch) { · Batch }
          </p>
        }
        @if (error()) { <p class="form-error">{{ error() }}</p> }
        <button tuiButton type="submit" appearance="primary" [disabled]="saving() || reviewForm.invalid">{{ saving() ? 'Speichert…' : submitLabel }}</button>
      </form>
    </div>
  `,
  styles: [`
    :host{display:block}
    .review-body{display:grid;grid-template-columns:16rem 1fr;gap:1.5rem;align-items:start;margin-top:1rem}
    .capture-image{width:100%;position:sticky;top:1rem}
    form{display:grid;gap:1.25rem}.pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    @media(max-width:760px){.review-body{grid-template-columns:1fr}.capture-image{max-width:16rem;position:static}}
    .select-field{display:flex;flex-direction:column;gap:.375rem;justify-content:center}
    .select-label{font:var(--tui-typography-body-s);color:var(--tui-text-secondary);padding-inline-start:.25rem}
    .select-field select{min-height:var(--tui-height-l);padding:0 1rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);color:var(--tui-text-primary);border:1px solid transparent;font:var(--tui-typography-body-m);cursor:pointer}
    .select-field select:focus{outline:none;border-color:var(--tui-border-focus)}
    .source-links{display:flex;flex-wrap:wrap;gap:.35rem .75rem;font-size:.875rem}
    button[type=submit]{justify-self:start}.note{color:var(--tui-text-tertiary)}
    .form-error{color:var(--tui-text-negative);margin:0}
    @media(max-width:600px){.pair{grid-template-columns:1fr}}
  `],
})
export class CaptureReviewFormComponent {
  @Input() submitLabel = 'Bestätigen und speichern';
  @Output() saved = new EventEmitter<CaptureSaved>();

  readonly current = signal<Capture>(null!);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly conditionOptions = ['NM', 'LP', 'MP', 'HP', 'DMG'] as const;
  model: ReviewCapture = {
    catalogReferenceId: null, originalName: '', germanName: null, germanNameUnavailableReason: null,
    printedNumber: '', collectorNumber: '', setTotal: null,
    setIdentifier: '', setName: '', language: 'en', variantKey: 'standard', condition: 'NM',
  };

  constructor(private readonly service: CaptureService) {}

  @Input({ required: true }) set capture(value: Capture) {
    this.current.set(value);
    if (value.status === 'needsReview') this.populate(value);
  }

  async save(): Promise<void> {
    const before = this.current();
    this.model.printedNumber = this.model.setTotal?.trim()
      ? `${this.model.collectorNumber.trim()}/${this.model.setTotal.trim()}`
      : this.model.collectorNumber.trim();
    this.saving.set(true); this.error.set('');
    try {
      const reviewed = await this.service.review(before, this.model);
      this.current.set(reviewed);
      const finalized = await this.service.finalize(reviewed, false);
      this.saved.emit({ cardRecordId: finalized.body?.cardRecordId, specimenId: finalized.body?.id });
    } catch (error) {
      const reviewed = this.current();
      if (error instanceof HttpErrorResponse && error.status === 409 && error.error?.code === 'DUPLICATE_IMAGE') {
        if (confirm('Das Bild ist bereits gespeichert. Trotzdem als weiteres Exemplar anlegen?')) {
          try {
            const finalized = await this.service.finalize(reviewed, true);
            this.saved.emit({ cardRecordId: finalized.body?.cardRecordId, specimenId: finalized.body?.id });
          } catch { this.error.set('Die Karte konnte nicht gespeichert werden.'); }
        }
      } else {
        this.error.set('Die Karte konnte nicht gespeichert werden.');
      }
    } finally { this.saving.set(false); }
  }

  formatAiCost(amount: number): string {
    if (amount > 0 && amount < 0.0001) return '< 0,0001';
    return amount.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  sourceHost(url: string): string {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return 'Quelle'; }
  }

  private populate(capture: Capture): void {
    if (!capture.proposal || this.model.originalName) return;
    this.model = deriveReviewModel(capture);
  }
}
