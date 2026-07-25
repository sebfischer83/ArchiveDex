import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/translate.service';
import { LoadingStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { Router, RouterLink } from '@angular/router';
import { CaptureService } from './capture.service';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiInputFiles } from '@taiga-ui/kit';

@Component({
  selector: 'app-capture-upload',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LoadingStateComponent, ErrorStateComponent, RouterLink, TuiButton, TuiTitle, TuiInputFiles],
  template: `
    <h2 tuiTitle>{{ 'capture.title' | translate }}</h2>
    @if (activeCaptureId(); as captureId) {
      <section class="resume-card" aria-live="polite">
        <span tuiTitle>
          Laufende Erfassung gefunden
          <span tuiSubtitle>Die Verarbeitung läuft auf dem Server weiter – auch bei geschlossenem Browser.</span>
        </span>
        <div class="resume-actions">
          <button tuiButton type="button" appearance="primary" (click)="resume(captureId)">Fortsetzen</button>
          <button tuiButton type="button" appearance="flat" (click)="startNew(captureId)">Neue Erfassung</button>
        </div>
      </section>
    }
    <div class="upload-section">
      <label tuiInputFiles>
        <input type="file" tuiInputFiles accept="image/*" ngModel name="file" (change)="onNativeChange($event)" />
      </label>
      @if (selectedFile(); as file) { <p>{{ file.name }}</p> }
      @if (uploading()) { <app-loading-state /> }
      @if (error()) { <app-error-state [message]="error()" (retry)="reset()" /> }
      <a tuiButton size="s" appearance="flat" [routerLink]="['/capture/batch']">Mehrere Bilder hochladen</a>
    </div>
  `,
  styles: [`
    .resume-card{max-width:40rem;margin:1rem 0;padding:1rem;border-radius:var(--tui-radius-l);background:var(--tui-background-neutral-1);display:flex;align-items:center;justify-content:space-between;gap:1rem}
    .resume-actions{display:flex;flex-wrap:wrap;gap:.5rem}
    .upload-section{max-width:24rem;margin:1rem 0;display:flex;flex-direction:column;gap:1rem}
    @media(max-width:640px){.resume-card{align-items:stretch;flex-direction:column}}
  `],
})
export class CaptureUploadComponent {
  private readonly captures = inject(CaptureService);
  private readonly router = inject(Router);
  readonly activeCaptureId = this.captures.activeCaptureId;
  readonly selectedFile = signal<File | null>(null);
  readonly uploading = signal(false);
  readonly error = signal('');
  onNativeChange(event: Event) {
    // Read the picked File directly off the native input rather than via (ngModelChange):
    // TuiInputFilesDirective requires an NgControl sibling (hence the bare `ngModel` above) to
    // construct at all, but its constructor-time self-registration as the value accessor loses
    // the race against Angular's own NgModel constructor, so ngModelChange ends up emitting the
    // input's raw DOM value (the browser's fake "C:\fakepath\..." string) instead of the real
    // File. Reading input.files here (target-phase listener) runs before Taiga's wrapping
    // <label tuiInputFiles> clears the input in its own bubble-phase change handler.
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file) { this.selectedFile.set(file); void this.upload(); }
  }
  async upload() {
    const file = this.selectedFile();
    if (!file) return;
    this.uploading.set(true); this.error.set('');
    try {
      const result = await this.captures.create(file);
      await this.router.navigate(['/capture', result.id]);
    } catch { this.error.set('Upload failed.'); }
    finally { this.uploading.set(false); }
  }
  resume(captureId: string): void { void this.router.navigate(['/capture', captureId]); }
  startNew(captureId: string): void {
    this.captures.clearActiveCapture(captureId);
    this.reset();
  }
  reset() { this.error.set(''); this.selectedFile.set(null); }
}
