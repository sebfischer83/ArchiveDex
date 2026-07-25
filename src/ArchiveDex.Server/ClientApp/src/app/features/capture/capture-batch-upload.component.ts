import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CaptureService } from './capture.service';
import { ErrorStateComponent } from '../../shared/states.component';
import { TuiButton, TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'app-capture-batch-upload',
  standalone: true,
  imports: [ErrorStateComponent, RouterLink, TuiButton, TuiTitle],
  template: `
    <section class="batch-upload">
      <h2 tuiTitle>Mehrere Bilder hochladen<span tuiSubtitle>Wähle viele Karten auf einmal – Analyse & Prüfung laufen danach gesammelt.</span></h2>

      @if (activeBatchId(); as batchId) {
        @if (!uploading()) {
          <div class="resume-card">
            <span tuiTitle>Laufenden Batch gefunden<span tuiSubtitle>Verarbeitung läuft auf dem Server weiter.</span></span>
            <div class="resume-actions">
              <button tuiButton type="button" appearance="primary" (click)="resume(batchId)">Ergebnisse ansehen</button>
              <button tuiButton type="button" appearance="flat" (click)="clear(batchId)">Neuer Batch</button>
            </div>
          </div>
        }
      }

      @if (!uploading()) {
        <label class="picker">
          <input type="file" accept="image/*" multiple (change)="onFilesSelected($event)" />
          <span class="picker-icon" aria-hidden="true">🖼️</span>
          <span class="picker-text">Bilder auswählen (mehrere möglich)</span>
        </label>
        <a tuiButton size="s" appearance="flat" [routerLink]="['/capture']">Nur eine Karte erfassen</a>
      } @else {
        <div class="progress" aria-live="polite">
          <span tuiTitle>Lädt hoch…<span tuiSubtitle>{{ progress().done }} von {{ progress().total }} Bildern</span></span>
          <div class="bar" role="progressbar" [attr.aria-valuenow]="progress().done" aria-valuemin="0" [attr.aria-valuemax]="progress().total">
            <div class="bar-fill" [style.width.%]="progress().total ? (progress().done / progress().total) * 100 : 0"></div>
          </div>
        </div>
      }

      @if (progress().failures.length) {
        <div class="failures">
          <p>{{ progress().failures.length }} Bild(er) konnten nicht hochgeladen werden:</p>
          <ul>@for (f of progress().failures; track f.name) { <li>{{ f.name }}</li> }</ul>
        </div>
      }

      @if (error()) { <app-error-state [message]="error()" (retry)="reset()" /> }
    </section>
  `,
  styles: [`
    .batch-upload{max-width:40rem;display:flex;flex-direction:column;gap:1.25rem}
    .resume-card{padding:1rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);display:flex;align-items:center;justify-content:space-between;gap:1rem}
    .resume-actions{display:flex;flex-wrap:wrap;gap:.5rem}
    .picker{display:flex;flex-direction:column;align-items:center;gap:.5rem;padding:2rem;border:2px dashed var(--tui-border-normal);border-radius:var(--tui-radius-l);cursor:pointer;text-align:center;background:var(--tui-background-neutral-1)}
    .picker:hover{border-color:var(--tui-border-focus)}
    .picker input{position:absolute;width:1px;height:1px;opacity:0}
    .picker-icon{font-size:2rem}
    .picker-text{color:var(--tui-text-secondary)}
    .progress{display:flex;flex-direction:column;gap:.75rem}
    .bar{height:.75rem;border-radius:.75rem;background:var(--tui-background-neutral-1);overflow:hidden}
    .bar-fill{height:100%;background:var(--tui-background-accent-1);transition:width .2s ease}
    .failures{color:var(--tui-text-negative);font-size:.9rem}
    .failures ul{margin:.25rem 0 0;padding-inline-start:1.25rem}
    @media(max-width:640px){.resume-card{align-items:stretch;flex-direction:column}}
  `],
})
export class CaptureBatchUploadComponent {
  private readonly captures = inject(CaptureService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly activeBatchId = this.captures.activeBatchId;
  readonly uploading = signal(false);
  readonly error = signal('');
  readonly progress = signal<{ done: number; total: number; failures: { name: string; reason: string }[] }>(
    { done: 0, total: 0, failures: [] });

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length) void this.upload(files);
  }

  async upload(files: File[]): Promise<void> {
    this.uploading.set(true);
    this.error.set('');
    this.progress.set({ done: 0, total: files.length, failures: [] });
    try {
      const batchId = await this.captures.createBatch();
      this.captures.uploadBatchImages(batchId, files)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: p => this.progress.set(p),
          error: () => { this.error.set('Der Upload ist fehlgeschlagen.'); this.uploading.set(false); },
          complete: () => { void this.router.navigate(['/capture/batch', batchId]); },
        });
    } catch {
      this.error.set('Der Batch konnte nicht angelegt werden.');
      this.uploading.set(false);
    }
  }

  resume(batchId: string): void { void this.router.navigate(['/capture/batch', batchId]); }
  clear(batchId: string): void { this.captures.clearActiveBatch(batchId); }
  reset(): void { this.error.set(''); this.uploading.set(false); this.progress.set({ done: 0, total: 0, failures: [] }); }
}
