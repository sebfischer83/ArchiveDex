import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';

interface ImportInfo {
  recordCount: number;
  sourceCreatedAt: string;
  importedAt: string;
}

interface SetMapping {
  id: string;
  setName: string;
  setIdentifier: string;
  language: string;
  cardmarketExpansionId: number | null;
  cardCount: number;
}

interface CardmarketStatus {
  products: ImportInfo | null;
  prices: ImportInfo | null;
  sets: SetMapping[];
  setsTotal: number;
  setsMapped: number;
  cardsTotal: number;
  matched: Record<string, number>;
  unmatched: number;
}

type UploadKind = 'products' | 'prices';

/**
 * Upload panel for Cardmarket's two downloadable files. Both are snapshots and may be re-uploaded
 * at any time; each upload replaces the previous one. Zoneless-safe: state lives in signals.
 */
@Component({
  selector: 'app-cardmarket-panel',
  standalone: true,
  imports: [DatePipe, DecimalPipe, TuiButton, TuiIcon, TuiBadge],
  template: `
    <section class="panel" aria-labelledby="cardmarket-title">
      <div class="head">
        <div>
          <strong id="cardmarket-title">Cardmarket-Preisdaten</strong>
          <small>
            Produktliste und Preisguide von cardmarket.com als JSON. Jeder Upload ersetzt den
            vorherigen Stand — die Dateien sind Momentaufnahmen, keine Ergänzungen.
          </small>
        </div>
        @if (status(); as s) {
          @if (s.prices) { <span tuiBadge appearance="positive">Preise geladen</span> }
          @else { <span tuiBadge appearance="neutral">Keine Preise</span> }
        }
      </div>

      <div class="slots">
        @for (slot of slots; track slot.kind) {
          <div class="slot">
            <div class="slot-head">
              <tui-icon [icon]="slot.icon" />
              <strong>{{ slot.label }}</strong>
            </div>
            @if (infoFor(slot.kind); as info) {
              <dl>
                <div><dt>Datensätze</dt><dd>{{ info.recordCount | number:'1.0-0' }}</dd></div>
                <div><dt>Stand der Datei</dt><dd>{{ info.sourceCreatedAt | date:'dd.MM.yyyy HH:mm' }}</dd></div>
                <div><dt>Hochgeladen</dt><dd>{{ info.importedAt | date:'dd.MM.yyyy HH:mm' }}</dd></div>
              </dl>
            } @else {
              <p class="empty">Noch nicht hochgeladen.</p>
            }
            <input
              #picker
              hidden
              type="file"
              accept=".json,application/json"
              (change)="upload(slot.kind, $event)"
            />
            <button
              tuiButton
              appearance="secondary"
              size="s"
              type="button"
              [disabled]="uploading() !== ''"
              (click)="picker.click()"
            >
              {{ uploading() === slot.kind ? 'Lädt …' : (infoFor(slot.kind) ? 'Neu hochladen' : 'Hochladen') }}
            </button>
          </div>
        }
      </div>

      @if (status(); as s) {
        <dl class="coverage">
          <div>
            <dt>Sets mit Expansion-ID</dt>
            <dd>{{ s.setsMapped }} / {{ s.setsTotal }}</dd>
          </div>
          <div>
            <dt>Karten zugeordnet</dt>
            <dd>{{ s.cardsTotal - s.unmatched }} / {{ s.cardsTotal }}</dd>
          </div>
          @if (aiResolved() > 0) {
            <div><dt>Davon per KI geklärt</dt><dd>{{ aiResolved() }}</dd></div>
          }
          @if (unresolved() > 0) {
            <div><dt>Nicht klärbar</dt><dd class="warn">{{ unresolved() }}</dd></div>
          }
        </dl>
        <details class="mapping" [open]="s.setsMapped < s.setsTotal">
          <summary>Set-Zuordnung ({{ s.setsMapped }} von {{ s.setsTotal }})</summary>
          <p class="hint">
            <tui-icon icon="@tui.info" />
            Sets ohne Expansion-ID werden bei der Preisermittlung übersprungen. Die ID steht als
            <code>idExpansion</code> in der Cardmarket-URL der Set-Einzelkartenliste.
          </p>
          <ul>
            @for (set of s.sets; track set.id) {
              <li>
                <span class="set-name">
                  {{ set.setName }}
                  <small>{{ set.setIdentifier }} · {{ set.language }} · {{ set.cardCount }} Karten</small>
                </span>
                <input
                  #expansion
                  type="number"
                  min="1"
                  step="1"
                  inputmode="numeric"
                  placeholder="idExpansion"
                  [value]="set.cardmarketExpansionId ?? ''"
                  [disabled]="savingSet() === set.id"
                  (keydown.enter)="saveExpansion(set, expansion.value)"
                />
                <button
                  tuiButton
                  appearance="flat"
                  size="s"
                  type="button"
                  [disabled]="savingSet() === set.id"
                  (click)="saveExpansion(set, expansion.value)"
                >Speichern</button>
              </li>
            }
          </ul>
        </details>
      }

      @if (message()) { <small class="ok">{{ message() }}</small> }
      @if (error()) { <small class="err">{{ error() }}</small> }
    </section>
  `,
  styles: [`
    .panel{display:grid;gap:.85rem;padding:1rem;margin-bottom:1rem;border:1px solid var(--tui-border-normal);border-radius:.75rem}
    .head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap}
    .head>div{display:grid;gap:.25rem;min-width:0}
    .slots{display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:.75rem}
    .slot{display:grid;gap:.5rem;align-content:start;padding:.75rem;border-radius:.6rem;
      background:var(--tui-background-neutral-1)}
    .slot-head{display:flex;align-items:center;gap:.4rem}
    .slot-head tui-icon{color:var(--tui-text-secondary)}
    .slot button{justify-self:start}
    .slot dl,.coverage{display:grid;gap:.3rem;margin:0}
    .slot dl>div,.coverage>div{display:flex;justify-content:space-between;gap:.75rem;font-size:.8125rem}
    .slot dt,.coverage dt{color:var(--tui-text-secondary)}
    .slot dd,.coverage dd{margin:0;font-variant-numeric:tabular-nums}
    .coverage{grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.35rem 1.25rem}
    .coverage dd.warn{color:var(--tui-text-negative)}
    .empty{margin:0;color:var(--tui-text-tertiary);font-size:.8125rem}
    .hint{display:flex;align-items:flex-start;gap:.4rem;margin:0;color:var(--tui-text-tertiary);font-size:.8125rem}
    .hint tui-icon{flex:none;font-size:.9rem;margin-top:.1rem}
    .hint code{font-family:ui-monospace,monospace}
    .mapping summary{cursor:pointer;font-size:.875rem;color:var(--tui-text-secondary)}
    .mapping ul{display:grid;gap:.4rem;margin:.6rem 0 0;padding:0;list-style:none}
    .mapping li{display:grid;grid-template-columns:minmax(0,1fr) 8rem auto;gap:.6rem;align-items:center}
    .set-name{display:grid;min-width:0}
    .set-name small{color:var(--tui-text-tertiary);font-size:.75rem}
    .mapping input{width:100%;padding:.3rem .45rem;border-radius:.4rem;font:inherit;
      border:1px solid var(--tui-border-normal);background:var(--tui-background-base);
      color:var(--tui-text-primary)}
    @media(max-width:640px){.mapping li{grid-template-columns:1fr auto}.set-name{grid-column:1/-1}}
    .ok{color:var(--tui-text-positive)}
    .err{color:var(--tui-text-negative)}
  `],
})
export class CardmarketPanelComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly status = signal<CardmarketStatus | null>(null);
  readonly uploading = signal<'' | UploadKind>('');
  readonly savingSet = signal('');
  readonly message = signal('');
  readonly error = signal('');

  readonly slots: ReadonlyArray<{kind: UploadKind; label: string; icon: string}> = [
    {kind: 'products', label: 'Produktliste', icon: '@tui.layers'},
    {kind: 'prices', label: 'Preisguide', icon: '@tui.badge-euro'},
  ];

  readonly aiResolved = computed(() => this.status()?.matched['aiResolved'] ?? 0);
  readonly unresolved = computed(() =>
    (this.status()?.matched['unresolved'] ?? 0) + (this.status()?.matched['noCandidate'] ?? 0));

  ngOnInit(): void { void this.load(); }

  async load(): Promise<void> {
    try {
      this.status.set(await firstValueFrom(this.http.get<CardmarketStatus>('/api/v1/cardmarket/status')));
    } catch {
      // The panel is informational; a failed status must not break the collection view.
    }
  }

  async upload(kind: UploadKind, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    this.uploading.set(kind);
    this.message.set('');
    this.error.set('');
    try {
      const result = await firstValueFrom(this.http.post<{recordCount: number}>(
        `/api/v1/cardmarket/${kind}`, file, {headers: {'Content-Type': 'application/json'}}));
      const label = kind === 'products' ? 'Produkte' : 'Preise';
      this.message.set(`${result.recordCount.toLocaleString('de-DE')} ${label} übernommen.`);
      await this.load();
    } catch (error) {
      this.error.set(error instanceof HttpErrorResponse && error.error?.detail
        ? error.error.detail
        : 'Die Datei konnte nicht verarbeitet werden.');
    } finally {
      this.uploading.set('');
    }
  }

  /**
   * Changing the expansion drops every match made against the old one, so this is a deliberate,
   * explicitly saved action rather than a live-bound field.
   */
  async saveExpansion(set: SetMapping, raw: string): Promise<void> {
    const value = Number.parseInt(raw, 10);
    if (!Number.isInteger(value) || value <= 0) {
      this.error.set('Die Expansion-ID muss eine positive Zahl sein.');
      return;
    }
    if (value === set.cardmarketExpansionId) return;

    this.savingSet.set(set.id);
    this.message.set('');
    this.error.set('');
    try {
      await firstValueFrom(this.http.put(
        `/api/v1/cardmarket/sets/${set.id}/expansion`, {cardmarketExpansionId: value}));
      this.message.set(`Expansion ${value} für „${set.setName}" gespeichert.`);
      await this.load();
    } catch (error) {
      this.error.set(error instanceof HttpErrorResponse && error.error?.detail
        ? error.error.detail
        : 'Die Expansion-ID konnte nicht gespeichert werden.');
    } finally {
      this.savingSet.set('');
    }
  }

  infoFor(kind: UploadKind): ImportInfo | null {
    const status = this.status();
    return status ? status[kind] : null;
  }
}
