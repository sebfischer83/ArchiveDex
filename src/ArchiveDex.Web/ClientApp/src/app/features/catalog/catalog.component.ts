import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TranslatePipe } from '../../core/translate.pipe';
import { EmptyStateComponent, ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { userSafeErrorMessage, errorIsDuplicate } from '../../core/api-error-mapper';

interface CatalogSetSummary {
  setId: string;
  name: string;
  cardLanguage: string;
  cardCount: number;
  ownedCount: number;
  imageUrl: string | null;
}

interface CardSearchResult {
  id: string;
  setId: string;
  number: string;
  name: string;
  cardLanguage: string;
  rarity: string | null;
  origin: string;
  imageUrl: string | null;
  hasLocalCorrection: boolean;
}

interface CatalogCardDetail extends CardSearchResult {
  setName: string;
  category: string | null;
  illustrator: string | null;
  hp: number | null;
  types: string[] | null;
  stage: string | null;
  evolveFrom: string | null;
  description: string | null;
  attacks: { cost: string[]; name: string; effect: string | null; damage: number | null }[] | null;
  weaknesses: { type: string; value: string }[] | null;
  resistances: { type: string; value: string }[] | null;
  retreat: number | null;
}

interface DuplicateConflict {
  existingEntryId: string;
  existingQuantity: number;
  submittedQuantity: number;
  proposedQuantity: number;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiButton,
    TuiBadge,
    TuiTextfield,
    TranslatePipe,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
  ],
  template: `
    <section class="catalog">
      @if (detailId) {
        <header class="heading">
          <button tuiButton appearance="secondary" size="s" type="button" (click)="backToCatalog()">
            &larr; {{ 'catalog.cards' | translate }}
          </button>
          <h2>{{ 'catalog.cardDetail' | translate }}</h2>
        </header>

        @if (detailLoading) {
          <app-loading-state />
        } @else if (detailError) {
          <app-error-state [message]="detailError" />
        } @else if (detail) {
          <article class="detail">
            @if (detail.imageUrl) {
              <img class="detail-image" [src]="detail.imageUrl" [alt]="detail.name" />
            }
            <div class="detail-copy">
              <p class="eyebrow">{{ detail.setName }} · {{ detail.number }}</p>
              <h3>{{ detail.name }}</h3>
              <div class="badges">
                <tui-badge>{{ detail.cardLanguage }}</tui-badge>
                @if (detail.rarity) { <tui-badge>{{ detail.rarity }}</tui-badge> }
                @if (detail.hp !== null) { <tui-badge>HP {{ detail.hp }}</tui-badge> }
              </div>
              @if (detail.description) { <p>{{ detail.description }}</p> }
              @if (detail.attacks?.length) {
                <h4>{{ 'catalog.attacks' | translate }}</h4>
                @for (attack of detail.attacks; track attack.name) {
                  <p><strong>{{ attack.name }}</strong> {{ attack.damage ?? '' }}<br />{{ attack.effect }}</p>
                }
              }
            </div>

            <form class="collection-form" (ngSubmit)="addToCollection()">
              <h3>{{ 'collection.add' | translate }}</h3>
              <label>{{ 'collection.condition' | translate }}
                <select [(ngModel)]="condition" name="condition">
                  <option value="NM">NM</option><option value="LP">LP</option>
                  <option value="MP">MP</option><option value="HP">HP</option><option value="DMG">DMG</option>
                </select>
              </label>
              <label>{{ 'collection.quantity' | translate }}
                <input type="number" min="1" [(ngModel)]="quantity" name="quantity" required />
              </label>
              <label>{{ 'collection.purchasePrice' | translate }}
                <input type="number" min="0" step="0.01" [(ngModel)]="purchasePrice" name="purchasePrice" />
              </label>
              <label>{{ 'collection.storageLocation' | translate }}
                <input [(ngModel)]="storageLocation" name="storageLocation" />
              </label>
              <label>{{ 'collection.notes' | translate }}
                <textarea [(ngModel)]="notes" name="notes"></textarea>
              </label>
              <button tuiButton type="submit" [disabled]="adding">{{ 'collection.add' | translate }}</button>
              @if (addError) { <p class="error" role="alert">{{ addError }}</p> }
              @if (addSuccess) { <p class="success" role="status">{{ 'catalog.added' | translate }}</p> }
              @if (duplicate) {
                <div class="duplicate" role="alert">
                  <p>{{ 'catalog.duplicate' | translate }} ({{ duplicate.existingQuantity }} → {{ duplicate.proposedQuantity }})</p>
                  <button tuiButton type="button" size="s" (click)="resolveDuplicate(true)">{{ 'catalog.merge' | translate }}</button>
                  <button tuiButton type="button" size="s" appearance="secondary" (click)="resolveDuplicate(false)">{{ 'catalog.createSeparate' | translate }}</button>
                </div>
              }
            </form>
          </article>
        }
      } @else {
        <header class="heading">
          <div>
            <p class="eyebrow">{{ 'catalog.allCards' | translate }}</p>
            <h2>{{ 'catalog.title' | translate }}</h2>
          </div>
        </header>

        <form class="filters" (ngSubmit)="search()">
          <tui-textfield><input tuiTextfield type="search" [(ngModel)]="query" name="query" [placeholder]="'catalog.searchCards' | translate" /></tui-textfield>
          <label>{{ 'catalog.number' | translate }}<input [(ngModel)]="number" name="number" /></label>
          <label>{{ 'catalog.sets' | translate }}
            <select [(ngModel)]="setId" name="setId">
              <option value="">{{ 'catalog.allSets' | translate }}</option>
              @for (set of sets; track set.setId + set.cardLanguage) {
                <option [value]="set.setId">{{ set.name }} ({{ set.cardLanguage }})</option>
              }
            </select>
          </label>
          <label>{{ 'catalog.language' | translate }}
            <select [(ngModel)]="language" name="language">
              <option value="">{{ 'catalog.allLanguages' | translate }}</option>
              @for (item of languages; track item) { <option [value]="item">{{ item }}</option> }
            </select>
          </label>
          <button tuiButton type="submit">{{ 'catalog.search' | translate }}</button>
        </form>

        @if (cardsLoading && !cards.length) {
          <app-loading-state />
        } @else if (cardsError) {
          <app-error-state [message]="cardsError" />
        } @else {
          <div class="grid">
            @for (card of cards; track card.id) {
              <article class="tile">
                <button type="button" class="card-link" (click)="openDetail(card.id)">
                  @if (card.imageUrl) { <img [src]="card.imageUrl" [alt]="card.name" loading="lazy" /> }
                  @else { <span class="placeholder"></span> }
                  <span><small>{{ card.number }} · {{ card.cardLanguage }}</small><strong>{{ card.name }}</strong></span>
                </button>
              </article>
            } @empty { <app-empty-state [message]="'catalog.noCards' | translate" /> }
          </div>
          @if (hasMore) {
            <button class="load-more" tuiButton appearance="secondary" type="button" [disabled]="cardsLoading" (click)="loadMore()">
              {{ 'catalog.loadMore' | translate }}
            </button>
          }
        }
      }
    </section>
  `,
  styles: [`
    :host { display:block; }
    .catalog { max-width:76rem; }
    .heading { display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; }
    h2,h3,p { margin-top:0; }
    .eyebrow { color:var(--tui-text-secondary); margin-bottom:.25rem; text-transform:uppercase; letter-spacing:.08em; font-size:.75rem; }
    .filters { display:grid; grid-template-columns:2fr repeat(3,minmax(9rem,1fr)) auto; align-items:end; gap:.75rem; margin-bottom:1.5rem; padding:1rem; background:var(--tui-background-neutral-1); border-radius:.75rem; }
    label { display:flex; flex-direction:column; gap:.35rem; font-size:.875rem; }
    input,select,textarea { min-height:2.75rem; padding:.5rem .7rem; border:1px solid var(--tui-border-normal); border-radius:.4rem; background:var(--tui-background-base); color:inherit; }
    textarea { min-height:5rem; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(10rem,1fr)); gap:1rem; }
    .tile { border:1px solid var(--tui-border-normal); border-radius:.6rem; overflow:hidden; background:var(--tui-background-base); }
    .card-link { width:100%; border:0; padding:0; background:none; color:inherit; text-align:left; cursor:pointer; }
    .card-link img,.placeholder { display:block; width:100%; aspect-ratio:245/342; object-fit:contain; background:var(--tui-background-neutral-1); }
    .card-link span:last-child { display:flex; flex-direction:column; gap:.2rem; padding:.7rem; }
    .card-link small { color:var(--tui-text-secondary); }
    .load-more { display:block; margin:1.5rem auto; }
    .detail { display:grid; grid-template-columns:minmax(13rem,18rem) minmax(16rem,1fr) minmax(16rem,22rem); gap:2rem; align-items:start; }
    .detail-image { width:100%; border-radius:.75rem; }
    .badges { display:flex; gap:.4rem; flex-wrap:wrap; margin-bottom:1rem; }
    .collection-form { display:flex; flex-direction:column; gap:.75rem; padding:1rem; border:1px solid var(--tui-border-normal); border-radius:.75rem; }
    .duplicate { display:flex; flex-wrap:wrap; gap:.5rem; }
    .duplicate p { flex-basis:100%; }
    .error { color:var(--tui-text-negative); }
    .success { color:var(--tui-text-positive); }
    @media (max-width:58rem) { .filters { grid-template-columns:1fr 1fr; } .detail { grid-template-columns:minmax(12rem,18rem) 1fr; } .collection-form { grid-column:1/-1; } }
    @media (max-width:40rem) { .filters,.detail { grid-template-columns:1fr; } .collection-form { grid-column:auto; } }
  `],
})
export class CatalogComponent implements OnInit {
  readonly languages = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ptBr', 'ru', 'zhHans', 'zhHant'];
  readonly detailId: string | null;
  sets: CatalogSetSummary[] = [];
  cards: CardSearchResult[] = [];
  detail: CatalogCardDetail | null = null;
  query = '';
  number = '';
  setId = '';
  language = '';
  page = 1;
  hasMore = false;
  cardsLoading = false;
  cardsError = '';
  detailLoading = false;
  detailError = '';
  condition = 'NM';
  quantity = 1;
  purchasePrice: number | null = null;
  storageLocation = '';
  notes = '';
  adding = false;
  addError = '';
  addSuccess = false;
  duplicate: DuplicateConflict | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.detailId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    if (this.detailId) void this.loadDetail(this.detailId);
    else void this.loadCatalog();
  }

  private async loadCatalog(): Promise<void> {
    this.cardsLoading = true;
    try {
      [this.sets] = await Promise.all([
        firstValueFrom(this.http.get<CatalogSetSummary[]>('/api/catalog/sets')),
        this.loadCards(false),
      ]);
    } catch (error: unknown) {
      this.cardsError = userSafeErrorMessage(error, undefined, 'Catalog could not be loaded.');
    } finally {
      this.cardsLoading = false;
      this.cdr.markForCheck();
    }
  }

  async search(): Promise<void> {
    this.page = 1;
    await this.loadCards(false);
  }

  async loadMore(): Promise<void> {
    this.page += 1;
    await this.loadCards(true);
  }

  private async loadCards(append: boolean): Promise<void> {
    this.cardsLoading = true;
    this.cardsError = '';
    let params = new HttpParams().set('page', this.page);
    if (this.query.trim()) params = params.set('q', this.query.trim());
    if (this.number.trim()) params = params.set('number', this.number.trim());
    if (this.setId) params = params.set('setId', this.setId);
    if (this.language) params = params.set('cardLanguage', this.language);
    try {
      const page = await firstValueFrom(this.http.get<CardSearchResult[]>('/api/catalog/cards', { params }));
      this.cards = append ? [...this.cards, ...page] : page;
      this.hasMore = page.length === 20;
    } catch (error: unknown) {
      this.page = Math.max(1, this.page - (append ? 1 : 0));
      this.cardsError = userSafeErrorMessage(error, undefined, 'Cards could not be loaded.');
    } finally {
      this.cardsLoading = false;
      this.cdr.markForCheck();
    }
  }

  openDetail(id: string): void {
    void this.router.navigate(['/catalog/card', id]);
  }

  backToCatalog(): void {
    void this.router.navigate(['/catalog']);
  }

  private async loadDetail(id: string): Promise<void> {
    this.detailLoading = true;
    try {
      this.detail = await firstValueFrom(this.http.get<CatalogCardDetail>(`/api/catalog/cards/${encodeURIComponent(id)}`));
    } catch (error: unknown) {
      this.detailError = userSafeErrorMessage(error, undefined, 'Card detail could not be loaded.');
    } finally {
      this.detailLoading = false;
      this.cdr.markForCheck();
    }
  }

  async addToCollection(flags: { mergeDuplicate?: boolean; forceCreate?: boolean } = {}): Promise<void> {
    if (!this.detail || this.quantity < 1 || (this.purchasePrice !== null && this.purchasePrice < 0)) {
      this.addError = 'Check quantity and purchase price.';
      return;
    }
    this.adding = true;
    this.addError = '';
    this.addSuccess = false;
    this.duplicate = null;
    try {
      await firstValueFrom(this.http.post('/api/collection', {
        cardPrintId: this.detail.id,
        condition: this.condition,
        quantity: this.quantity,
        purchasePrice: this.purchasePrice,
        storageLocation: this.storageLocation || null,
        notes: this.notes || null,
        ...flags,
      }));
      this.addSuccess = true;
    } catch (error: unknown) {
      if (errorIsDuplicate(error)) {
        this.duplicate = (error as HttpErrorResponse).error as DuplicateConflict;
      } else {
        this.addError = userSafeErrorMessage(error, undefined, 'Card could not be added.');
      }
    } finally {
      this.adding = false;
      this.cdr.markForCheck();
    }
  }

  resolveDuplicate(merge: boolean): void {
    void this.addToCollection(merge ? { mergeDuplicate: true } : { forceCreate: true });
  }
}
