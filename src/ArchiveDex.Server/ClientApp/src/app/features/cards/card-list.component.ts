import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EmptyStateComponent, ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';

interface CardSummary {
  id: string; originalName: string; germanName: string | null; printedNumber: string;
  variantKey: string; specimenCount: number; thumbnailUrl: string;
}

@Component({
  selector: 'app-card-list', standalone: true,
  imports: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent],
  template: `
    <h2>Karten</h2>
    @if (loading) { <app-loading-state /> }
    @else if (error) { <app-error-state [message]="error" (retry)="load()" /> }
    @else if (!cards.length) { <app-empty-state message="In diesem Set sind noch keine Karten." /> }
    @else { <div class="cards">@for (card of cards; track card.id) {
      <button (click)="open(card.id)"><img [src]="card.thumbnailUrl" alt="" /><span><strong>{{ card.germanName || card.originalName }}</strong><small>#{{ card.printedNumber }} · {{ card.specimenCount }} Exemplar(e)</small></span></button>
    }</div> }
  `,
  styles: [`.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1rem}.cards button{display:flex;gap:.8rem;align-items:center;text-align:left;padding:.7rem;background:#fff;border:1px solid #ddd;border-radius:.5rem}.cards img{width:64px;height:88px;object-fit:cover}.cards span{display:grid;gap:.3rem}`],
})
export class CardListComponent implements OnInit {
  private readonly http = inject(HttpClient); private readonly route = inject(ActivatedRoute); private readonly router = inject(Router);
  cards: CardSummary[] = []; loading = true; error = '';
  ngOnInit(): void { void this.load(); }
  async load(): Promise<void> {
    this.loading = true; this.error = '';
    try { this.cards = (await firstValueFrom(this.http.get<{items: CardSummary[]}>(`/api/v1/sets/${this.route.snapshot.paramMap.get('setId')}/cards`))).items; }
    catch { this.error = 'Karten konnten nicht geladen werden.'; }
    finally { this.loading = false; }
  }
  open(id: string): void { void this.router.navigate(['/cards', id]); }
}
