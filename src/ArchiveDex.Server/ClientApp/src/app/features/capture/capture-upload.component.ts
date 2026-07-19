import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../core/translate.service';
import { LoadingStateComponent, ErrorStateComponent } from '../../shared/states.component';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture-upload',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LoadingStateComponent, ErrorStateComponent],
  template: `
    <h2>{{ 'capture.title' | translate }}</h2>
    <div class="upload-section">
      <input type="file" accept="image/*" (change)="onFileSelected($event)" #fileInput hidden />
      <button (click)="fileInput.click()" [disabled]="uploading">{{ 'capture.upload' | translate }}</button>
      @if (selectedFile) { <p>{{ selectedFile.name }}</p> }
      @if (uploading) { <app-loading-state /> }
      @if (error) { <app-error-state [message]="error" (retry)="reset()" /> }
    </div>
  `,
  styles: [`.upload-section{max-width:24rem;margin:1rem 0}`],
})
export class CaptureUploadComponent {
  selectedFile: File | null = null; uploading = false; error = '';
  constructor(private http: HttpClient, private router: Router) {}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) { this.selectedFile = input.files[0]; this.upload(); }
  }
  async upload() {
    if (!this.selectedFile) return;
    this.uploading = true; this.error = '';
    try {
      const form = new FormData(); form.append('image', this.selectedFile);
      const result = await firstValueFrom(this.http.post<{ id: string }>('/api/v1/captures', form));
      await this.router.navigate(['/capture', result.id]);
    } catch { this.error = 'Upload failed.'; }
    finally { this.uploading = false; }
  }
  reset() { this.error = ''; this.selectedFile = null; }
}
