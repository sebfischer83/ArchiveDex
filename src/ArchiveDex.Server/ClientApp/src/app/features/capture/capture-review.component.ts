import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Capture, CaptureService, ReviewCapture } from './capture.service';
import { ErrorStateComponent, LoadingStateComponent } from '../../shared/states.component';

@Component({
  selector: 'app-capture-review',
  standalone: true,
  imports: [FormsModule, ErrorStateComponent, LoadingStateComponent],
  template: `
    <section class="review">
      <header><p class="eyebrow">Capture</p><h2>Karte prüfen</h2></header>
      @if (loading) { <app-loading-state /> }
      @else if (error) { <app-error-state [message]="error" (retry)="load()" /> }
      @else if (capture?.status === 'needsNewImage') {
        <app-error-state [message]="capture.error?.detail || 'Bitte ein neues Bild aufnehmen.'" />
        <button type="button" (click)="newCapture()">Neues Bild</button>
      }
      @else if (capture?.status === 'failed') {
        <app-error-state [message]="capture.error?.detail || 'Analyse fehlgeschlagen.'" />
        @if (capture.error?.retryable) { <button type="button" (click)="retry()">Analyse wiederholen</button> }
      }
      @else if (capture?.status === 'needsReview') {
        @if (capture.duplicate) { <p class="warning">Dieses Bild ist bereits in der Sammlung. Beim Speichern ist eine Bestätigung nötig.</p> }
        <form (ngSubmit)="save()" #reviewForm="ngForm">
          <label>Name <input name="originalName" [(ngModel)]="model.originalName" required maxlength="200" /></label>
          <label>Deutscher Name <input name="germanName" [(ngModel)]="model.germanName" maxlength="200" /></label>
          <label>Grund, falls nicht verfügbar <input name="germanNameUnavailableReason" [(ngModel)]="model.germanNameUnavailableReason" maxlength="200" /></label>
          <div class="pair">
            <label>Kartennummer <input name="printedNumber" [(ngModel)]="model.printedNumber" required /></label>
            <label>Sprache <input name="language" [(ngModel)]="model.language" required /></label>
          </div>
          <div class="pair">
            <label>Set-Code <input name="setIdentifier" [(ngModel)]="model.setIdentifier" required /></label>
            <label>Set <input name="setName" [(ngModel)]="model.setName" required /></label>
          </div>
          <div class="pair">
            <label>Variante <input name="variantKey" [(ngModel)]="model.variantKey" required /></label>
            <label>Zustand
              <select name="condition" [(ngModel)]="model.condition" required>
                <option value="NM">NM</option><option value="LP">LP</option><option value="MP">MP</option>
                <option value="HP">HP</option><option value="DMG">DMG</option>
              </select>
            </label>
          </div>
          @if (capture.proposal?.condition?.limitations?.length) {
            <p class="note">Einschränkung: {{ capture.proposal!.condition.limitations.join(', ') }}</p>
          }
          @if (capture.proposal?.valuation?.status === 'available') {
            <p>Schätzwert: {{ ((capture.proposal?.valuation?.amountMinor || 0) / 100).toFixed(2) }} EUR</p>
          }
          <button type="submit" [disabled]="saving || reviewForm.invalid">{{ saving ? 'Speichert…' : 'Bestätigen und speichern' }}</button>
        </form>
      }
    </section>
  `,
  styles: [`
    .review{max-width:46rem}.eyebrow{text-transform:uppercase;letter-spacing:.14em;color:#626262;margin:0}
    form{display:grid;gap:1rem}.pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    label{display:grid;gap:.35rem;font-weight:650}input,select{padding:.7rem;border:1px solid #aaa;border-radius:.35rem;font:inherit}
    button{justify-self:start;padding:.75rem 1.1rem}.warning{border-left:4px solid #b87500;padding:.75rem;background:#fff7e6}.note{color:#555}
    @media(max-width:600px){.pair{grid-template-columns:1fr}}
  `],
})
export class CaptureReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(CaptureService);
  private readonly destroyRef = inject(DestroyRef);
  capture: Capture | null = null;
  loading = true; saving = false; error = '';
  model: ReviewCapture = {
    catalogReferenceId: null, originalName: '', germanName: null, germanNameUnavailableReason: null,
    printedNumber: '', setIdentifier: '', setName: '', language: 'en', variantKey: 'standard', condition: 'NM',
  };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true; this.error = '';
    const id = this.route.snapshot.paramMap.get('captureId');
    if (!id) { this.error = 'Capture-ID fehlt.'; this.loading = false; return; }
    this.service.poll(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: capture => { this.capture = capture; this.loading = false; if (capture.status === 'needsReview') this.populate(capture); },
      error: () => { this.error = 'Capture konnte nicht geladen werden.'; this.loading = false; },
    });
  }

  async save(): Promise<void> {
    if (!this.capture) return;
    this.saving = true; this.error = '';
    try {
      this.capture = await this.service.review(this.capture, this.model);
      const finalized = await this.service.finalize(this.capture, false);
      await this.router.navigate(['/cards', finalized.body?.cardRecordId]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409 && error.error?.code === 'DUPLICATE_IMAGE') {
        if (confirm('Das Bild ist bereits gespeichert. Trotzdem als weiteres Exemplar anlegen?') && this.capture) {
          const finalized = await this.service.finalize(this.capture, true);
          await this.router.navigate(['/cards', finalized.body?.cardRecordId]);
        }
      } else {
        this.error = 'Die Karte konnte nicht gespeichert werden.';
      }
    } finally { this.saving = false; }
  }

  async retry(): Promise<void> {
    if (!this.capture) return;
    try { this.capture = await this.service.retry(this.capture); this.load(); }
    catch { this.error = 'Die Analyse konnte nicht neu gestartet werden.'; }
  }

  newCapture(): void { void this.router.navigate(['/capture']); }

  private populate(capture: Capture): void {
    const proposal = capture.proposal;
    if (!proposal || this.model.originalName) return;
    const candidate = proposal.candidates[0];
    this.model = {
      catalogReferenceId: candidate?.catalogReferenceId ?? null,
      originalName: candidate?.printedName ?? proposal.printedName.value ?? '',
      germanName: candidate?.officialGermanName ?? proposal.officialGermanName.value,
      germanNameUnavailableReason: candidate?.officialGermanName || proposal.officialGermanName.value ? null : 'Nicht im Katalog verfügbar',
      printedNumber: candidate?.printedNumber ?? proposal.printedNumber.value ?? '',
      setIdentifier: candidate?.setIdentifier ?? proposal.setIdentifier.value ?? '',
      setName: candidate?.setName ?? proposal.setName.value ?? '',
      language: candidate?.language ?? proposal.language.value ?? 'en',
      variantKey: candidate?.variantKey ?? proposal.variantKey.value ?? 'standard',
      condition: proposal.condition.grade ?? 'NM',
    };
  }
}
