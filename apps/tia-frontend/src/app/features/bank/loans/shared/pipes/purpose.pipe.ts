import { Pipe, PipeTransform } from '@angular/core';
import { formatPurpose } from '../utils/purposes.util';

@Pipe({
  name: 'purposeFmt',
  standalone: true,
})
export class PurposeFormatPipe implements PipeTransform {
  transform(value: string | null): string {
    return formatPurpose(value) || '';
  }
}
