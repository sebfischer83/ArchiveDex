import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { TuiButton, TuiInputDirective, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiBadge } from '@taiga-ui/kit';

interface CardDetail {
  id: string; catalogReferenceId: string | null;
  originalName: string; germanName: string | null; germanNameUnavailableReason: string | null;
  printedNumber: string; collectorNumber: string; setTotal: string | null;
  setIdentifier: string; setName: string; language: string; variantKey: string; etag: string;
  specimens: Array<{
    id: string; condition: string; imageUrl: string; thumbnailUrl: string;
    valuation: {status: string; amountMinor?: number; provider?: string; method?: string; sourceUrls?: string[]}
  }>;
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

@Component({
  selector: 'app-card-detail', standalone: true,
  imports: [FormsModule, RouterLink, ErrorStateComponent, LoadingStateComponent, TuiButton, TuiInputDirective, TuiTextfield, TuiTitle, TuiCardLarge, TuiBadge],
  template: `
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
          <h2 tuiTitle>Kartendaten bearbeiten<span tuiSubtitle>Änderungen am Setnamen gelten für das gesamte Set.</span></h2>
          <tui-textfield><label tuiLabel>Name</label><input tuiInput name="originalName" [(ngModel)]="editModel.originalName" required maxlength="200" /></tui-textfield>
          <div class="pair">
            <tui-textfield><label tuiLabel>Deutscher Name</label><input tuiInput name="germanName" [(ngModel)]="editModel.germanName" maxlength="200" (ngModelChange)="germanNameChanged($event)" /></tui-textfield>
            <tui-textfield><label tuiLabel>Grund, falls nicht verfügbar</label><input tuiInput name="germanNameUnavailableReason" [(ngModel)]="editModel.germanNameUnavailableReason" maxlength="200" (ngModelChange)="unavailableReasonChanged($event)" /></tui-textfield>
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
            <button tuiButton appearance="primary" type="submit" [disabled]="saving() || editForm.invalid">{{ saving() ? 'Speichert…' : 'Speichern' }}</button>
            <button tuiButton appearance="flat" type="button" [disabled]="saving()" (click)="cancelEditing()">Abbrechen</button>
          </div>
        </form>
      } @else {
        <h2 tuiTitle>
          {{ c.originalName }}
          <span tuiSubtitle>{{ c.setName }} · {{ c.language }} · #{{ c.printedNumber }}</span>
        </h2>
        <section tuiCardLarge="compact" class="card-data" aria-labelledby="card-data-title">
          <h3 id="card-data-title">Kartendaten</h3>
          <dl>
            <div><dt>Name auf der Karte</dt><dd>{{ c.originalName }}</dd></div>
            <div><dt>Deutscher Name</dt><dd>{{ c.germanName || 'Nicht angegeben' }}</dd></div>
            <div><dt>Grund, falls nicht verfügbar</dt><dd>{{ c.germanNameUnavailableReason || 'Nicht angegeben' }}</dd></div>
            <div><dt>Kartennummer</dt><dd>{{ c.collectorNumber }}</dd></div>
            <div><dt>Karten im Set</dt><dd>{{ c.setTotal || 'Nicht angegeben' }}</dd></div>
            <div><dt>Set-Code</dt><dd>{{ c.setIdentifier }}</dd></div>
            <div><dt>Setname</dt><dd>{{ c.setName }}</dd></div>
            <div><dt>Sprache</dt><dd>{{ c.language }}</dd></div>
            <div><dt>Variante</dt><dd>{{ c.variantKey }}</dd></div>
          </dl>
        </section>
        <h3 class="specimen-heading">Exemplare</h3>
        <div class="specimens">@for (specimen of c.specimens; track specimen.id) {
          <article tuiCardLarge="compact">
            <button
              class="image-button"
              type="button"
              [attr.aria-label]="(c.germanName || c.originalName) + ' groß anzeigen'"
              (click)="openPreview(specimen.imageUrl, c.germanName || c.originalName)"
            >
              <img [src]="specimen.thumbnailUrl" [alt]="c.germanName || c.originalName" />
            </button>
            <div class="specimen-info">
              <div class="condition"><span>Zustand</span><span tuiBadge appearance="neutral">{{ specimen.condition }}</span></div>
              @if (specimen.valuation.status === 'available') {
                <p>{{ ((specimen.valuation.amountMinor || 0) / 100).toFixed(2) }} EUR</p>
                <p class="muted">{{ specimen.valuation.provider }} · {{ specimen.valuation.method }}</p>
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
        <div class="image-overlay" role="dialog" aria-modal="true" aria-label="Große Kartenansicht" (click)="closePreview()">
          <div class="overlay-content" (click)="$event.stopPropagation()">
            <button tuiButton class="close-preview" appearance="secondary" size="s" type="button" (click)="closePreview()">Schließen</button>
            <img [src]="image.url" [alt]="image.alt" />
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem}
    h2{margin-top:2rem}
    .edit-form{display:grid;gap:1.25rem;max-width:50rem;margin-top:1.5rem}
    .pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    .actions{display:flex;gap:.75rem;align-items:center}
    .form-error{color:var(--tui-text-negative);margin:0}
    .card-data{margin-top:1.5rem}
    .card-data h3,.specimen-heading{margin:0 0 1rem}
    .card-data dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.5rem;margin:0}
    .card-data dl>div{min-width:0}
    .card-data dt{color:var(--tui-text-secondary);font-size:.8125rem;margin-bottom:.2rem}
    .card-data dd{margin:0;overflow-wrap:anywhere}
    .specimen-heading{margin-top:2rem}
    .specimens{display:grid;gap:1rem;margin-top:1.5rem}
    .specimens article{display:flex;gap:1rem;align-items:center}
    .image-button{padding:0;border:0;border-radius:.3rem;background:transparent;cursor:zoom-in;line-height:0}
    .image-button:focus-visible{outline:3px solid var(--tui-border-focus);outline-offset:3px}
    .image-button img{width:110px;height:152px;object-fit:cover;border-radius:.3rem}
    .specimen-info{display:flex;flex-direction:column;gap:.5rem;align-items:flex-start}
    .condition{display:flex;align-items:center;gap:.5rem}.condition>span:first-child{color:var(--tui-text-secondary);font-size:.875rem}
    .source-links{display:flex;flex-wrap:wrap;gap:.5rem;font-size:.875rem}
    .muted{color:var(--tui-text-tertiary)}
    .image-overlay{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:1rem;background:rgba(0,0,0,.82);cursor:zoom-out}
    .overlay-content{position:relative;display:grid;place-items:center;width:100%;height:100%;cursor:default}
    .overlay-content img{max-width:min(92vw,56rem);max-height:90vh;width:auto;height:auto;object-fit:contain;border-radius:.6rem;box-shadow:0 1rem 4rem rgba(0,0,0,.45)}
    .close-preview{position:fixed;z-index:1;top:1rem;right:1rem}
    @media(max-width:600px){.pair,.card-data dl{grid-template-columns:1fr}}
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
  readonly preview = signal<{url: string; alt: string} | null>(null);
  editModel: CardEditModel = this.emptyEditModel();

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
    this.error.set('');
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.error.set('');
    this.editing.set(false);
  }

  async save(card: CardDetail): Promise<void> {
    const collectorNumber = this.editModel.collectorNumber.trim();
    const setTotal = this.editModel.setTotal?.trim() || null;
    const printedNumber = setTotal ? `${collectorNumber}/${setTotal}` : collectorNumber;
    this.saving.set(true); this.error.set('');
    try {
      const updated = await firstValueFrom(this.http.put<CardDetail>(`/api/v1/cards/${card.id}`, {
        ...this.editModel,
        collectorNumber,
        setTotal,
        printedNumber,
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

  openPreview(url: string, alt: string): void {
    this.preview.set({url, alt});
  }

  @HostListener('document:keydown.escape')
  closePreview(): void {
    this.preview.set(null);
  }

  sourceHost(url: string): string {
    try { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return 'Quelle'; }
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
