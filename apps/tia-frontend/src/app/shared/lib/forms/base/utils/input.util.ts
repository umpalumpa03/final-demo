import { Injectable, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private translate = inject(TranslateService);

  getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    if (errors['minlength']) {
      return this.translate.instant('common.validation.minLength', {
        minLength: errors['minlength'].requiredLength,
      });
    }
    if (errors['maxlength']) {
      return this.translate.instant('common.validation.maxLength', {
        maxLength: errors['maxlength'].requiredLength,
      });
    }
    if (errors['min']) {
      return this.translate.instant('common.validation.min', {
        min: errors['min'].min,
      });
    }
    if (errors['max']) {
      return this.translate.instant('common.validation.max', {
        max: errors['max'].max,
      });
    }

    if (errors['required'])
      return this.translate.instant('common.validation.required');
    if (errors['email'])
      return this.translate.instant('common.validation.email');
    if (errors['notFound'])
      return this.translate.instant('common.validation.notFound');
    if (errors['pattern'])
      return this.translate.instant('common.validation.pattern');

    if (errors['passwordStrength'])
      return this.translate.instant('common.validation.passwordStrength');
    if (errors['passwordRules'])
      return this.translate.instant('common.validation.passwordRules');
    if (errors['passwordMismatch'])
      return this.translate.instant('common.validation.passwordMismatch');

    return this.translate.instant('common.validation.default');
  }

  generateUniqueId(prefix: string = 'field'): string {
    const random = Math.floor(Math.random() * 1000000);
    return `${prefix}-${random}`;
  }
}
