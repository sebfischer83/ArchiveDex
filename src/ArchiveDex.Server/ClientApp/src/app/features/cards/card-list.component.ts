import { Component, computed, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EmptyStateComponent, ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';
import { TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';

interface CardSummary {
  id: string; originalName: string; germanName: string | null; printedNumber: string;
  variantKey: string; specimenCount: number; valuedSpecimenCount: number;
  valuationAmountMinor: number; thumbnailUrl: string;
}

@Component({
  selector: 'app-card-list', standalone: true,
  imports: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, TuiTitle, TuiCardLarge],
  template: `
    <div class="heading">
      <h2 tuiTitle>Karten</h2>
      @if (cards().length) { <span>{{ setValueText() }}</span> }
    </div>
    @if (loading()) { <app-loading-state /> }
    @else if (error()) { <app-error-state [message]="error()" (retry)="load()" /> }
    @else if (!cards().length) { <app-empty-state message="In diesem Set sind noch keine Karten." /> }
    @else { <div class="cards">@for (card of cards(); track card.id) {
      <button tuiCardLarge="compact" class="card" (click)="open(card.id)">
        <img [src]="card.thumbnailUrl" alt="" />
        <span tuiTitle>
          {{ card.germanName || card.originalName }}
          <span tuiSubtitle>#{{ card.printedNumber }} · {{ card.specimenCount }} Exemplar(e)</span>
          <span class="estimated-value">{{ cardValueText(card) }}</span>
        </span>
      </button>
    }</div> }
  `,
  styles: [`
    .heading{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
    .heading>span{color:var(--tui-text-secondary)}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1rem}
    .cards button{display:flex;gap:.8rem;align-items:center;text-align:left;width:100%}
    .cards img{width:64px;height:88px;object-fit:cover;border-radius:.3rem}
    .estimated-value{display:block;margin-top:.25rem;font-size:.875rem;font-weight:600;color:var(--tui-text-primary)}
  `],
})
export class CardListComponent implements OnInit {
  private readonly http = inject(HttpClient); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router);
  readonly cards = signal<CardSummary[]>([]); readonly loading = signal(true); readonly error = signal('');
  readonly setValueMinor = computed(() => this.cards().reduce((sum, card) => sum + card.valuationAmountMinor, 0));
  readonly specimenCount = computed(() => this.cards().reduce((sum, card) => sum + card.specimenCount, 0));
  readonly valuedSpecimenCount = computed(() => this.cards().reduce((sum, card) => sum + card.valuedSpecimenCount, 0));
  private readonly eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  ngOnInit(): void { void this.load(); }
  async load(): Promise<void> {
    this.loading.set(true); this.error.set('');
    try { this.cards.set((await firstValueFrom(this.http.get<{items: CardSummary[]}>(`/api/v1/sets/${this.route.snapshot.paramMap.get('setId')}/cards`))).items); }
    catch { this.error.set('Karten konnten nicht geladen werden.'); }
    finally { this.loading.set(false); }
  }
  setValueText(): string { return this.valueText(this.setValueMinor(), this.valuedSpecimenCount(), this.specimenCount(), 'Set-Gesamtwert'); }
  cardValueText(card: CardSummary): string {
    return this.valueText(card.valuationAmountMinor, card.valuedSpecimenCount, card.specimenCount, 'Geschätzter Wert');
  }
  private valueText(amountMinor: number, valued: number, total: number, label: string): string {
    if (valued === 0) return 'Noch kein Schätzwert';
    const incomplete = valued < total;
    return `${incomplete ? 'Teilwert' : label}: ${this.eur.format(amountMinor / 100)}`
      + (incomplete ? ` · ${valued} von ${total} bewertet` : '');
  }
  open(id: string): void { void this.router.navigate(['/cards', id]); }
}
