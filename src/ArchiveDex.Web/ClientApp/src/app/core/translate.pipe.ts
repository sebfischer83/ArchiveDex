import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private ts: TranslateService) {}

  transform(key: string): string {
    return this.ts.translate(key);
  }
}
