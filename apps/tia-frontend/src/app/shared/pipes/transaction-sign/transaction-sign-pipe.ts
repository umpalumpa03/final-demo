import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionSign',
})
export class TransactionSignPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) {
      return '';
    }
    const type = value.toLowerCase();
    if (type === 'debit') {
      return '-';
    }
    if (type === 'credit') {
      return '+';
    }
    return '';
  }
}
