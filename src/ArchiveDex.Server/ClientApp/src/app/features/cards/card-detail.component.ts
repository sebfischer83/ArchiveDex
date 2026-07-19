import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';

interface CardDetail {
  id: string; originalName: string; germanName: string | null; printedNumber: string; setName: string;
  language: string; variantKey: string; specimens: Array<{id: string; condition: string; thumbnailUrl: string; valuation: {status: string; amountMinor?: number}}>
}

@Component({
  selector: 'app-card-detail', standalone: true, imports: [RouterLink, ErrorStateComponent, LoadingStateComponent],
  template: `
    @if (loading) { <app-loading-state /> }
    @else if (error) { <app-error-state [message]="error" (retry)="load()" /> }
    @else if (card) {
      <a routerLink="/sets">← Sammlung</a><p class="eyebrow">{{ card.setName }} · {{ card.language }}</p>
      <h2>{{ card.germanName || card.originalName }} <small>#{{ card.printedNumber }}</small></h2>
      <div class="specimens">@for (specimen of card.specimens; track specimen.id) {
        <article><img [src]="specimen.thumbnailUrl" [alt]="card.germanName || card.originalName" /><div><strong>{{ specimen.condition }}</strong>
          @if (specimen.valuation.status === 'available') { <p>{{ ((specimen.valuation.amountMinor || 0) / 100).toFixed(2) }} EUR</p> }
          @else { <p>Keine Bewertung</p> }
        </div></article>
      }</div>
    }
  `,
  styles: [`.eyebrow{margin-top:2rem;color:#666;text-transform:uppercase;letter-spacing:.08em}h2 small{font-weight:400;color:#666}.specimens{display:grid;gap:1rem}.specimens article{display:flex;gap:1rem;padding:1rem;border:1px solid #ddd;border-radius:.6rem}.specimens img{width:110px;height:152px;object-fit:cover;border-radius:.3rem}`],
})
export class CardDetailComponent implements OnInit {
  private readonly http = inject(HttpClient); private readonly route = inject(ActivatedRoute);
  card: CardDetail | null = null; loading = true; error = '';
  ngOnInit(): void { void this.load(); }
  async load(): Promise<void> {
    this.loading = true; this.error = '';
    try { this.card = await firstValueFrom(this.http.get<CardDetail>(`/api/v1/cards/${this.route.snapshot.paramMap.get('cardId')}`)); }
    catch { this.error = 'Kartendetail konnte nicht geladen werden.'; }
    finally { this.loading = false; }
  }
}
