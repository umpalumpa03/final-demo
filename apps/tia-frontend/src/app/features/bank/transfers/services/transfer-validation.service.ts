import { Injectable } from '@angular/core';
import { RecipientType } from '../models/transfers.state.model';

@Injectable({ providedIn: 'root' })
export class TransferValidationService {
  public identifyRecipientType(input: string): RecipientType | null {
    const cleaned = input.replace(/\s/g, '');

    if (cleaned.startsWith('+995')) return 'phone';

    if (cleaned.startsWith('GE')) {
      if (cleaned.substring(4, 7) === 'TIA') {
        return 'iban-same-bank';
      }
      return 'iban-different-bank';
    }
    if (/^[A-Z]{2}\d{2}/.test(cleaned)) {
      return 'iban-different-bank';
    }

    return null;
  }

  public validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/\s/g, '');
    return /^\+995\d{9}$/.test(cleaned);
  }

  public validateIban(iban: string): boolean {
    const cleaned = iban.replace(/\s/g, '');
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;

    if (!ibanRegex.test(cleaned)) {
      return false;
    }
    const length = cleaned.length;
    return length >= 15 && length <= 34;
  }

  public getIbanCountry(iban: string): string {
    return iban.substring(0, 2);
  }
}
