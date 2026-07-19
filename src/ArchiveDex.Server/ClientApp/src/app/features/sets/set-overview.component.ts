import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe } from '../../core/translate.service';
import { LoadingStateComponent, EmptyStateComponent, ErrorStateComponent } from '../../shared/states.component';

interface SetSummary { id: string; setName: string; language: string; distinctCardCount: number; specimenCount: number; }

@Component({
  selector: 'app-set-overview',
  standalone: true,
  imports: [TranslatePipe, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <h2>{{ 'sets.title' | translate }}</h2>
    @if (loading) { <app-loading-state /> }
    @else if (error) { <app-error-state [message]="error" (retry)="load()" /> }
    @else if (sets.length === 0) { <app-empty-state [message]="'sets.empty' | translate" /> }
    @else {
      <div class="grid">
        @for (s of sets; track s.id) {
          <button class="card" (click)="openSet(s.id)">
            <strong>{{ s.setName }}</strong>
            <small>{{ s.language }} · {{ s.distinctCardCount }} Karten · {{ s.specimenCount }} Exemplare</small>
          </button>
        }
      </div>
    }
  `,
  styles: [`.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:1rem}.card{border:1px solid #ddd;border-radius:8px;padding:1rem;text-align:left;background:none;cursor:pointer}.card:hover{background:#f5f5f5}`],
})
export class SetOverviewComponent implements OnInit {
  sets: SetSummary[] = [];
  loading = true; error = '';
  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }
  async load() {
    this.loading = true; this.error = '';
    try { const p = await firstValueFrom(this.http.get<{ items: SetSummary[] }>('/api/v1/sets')); this.sets = p.items; }
    catch { this.error = 'Collection could not be loaded.'; }
    finally { this.loading = false; }
  }
  openSet(id: string) { /* navigate */ }
}
