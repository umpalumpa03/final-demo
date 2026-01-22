import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstUpper',
})
export class FirstUpperPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    const trimmed = value?.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
}
