import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { TranslationLoaderService } from '../../../../../../../core/i18n';

export const LOAN_MANAGEMENT_TRANSLATION_KEYS = {
  title: 'loans.management.title',
  subtitle: 'loans.management.subtitle',
} as const;

export function useLoanManagementConfig() {
  const translate = inject(TranslateService);
  const translationLoader = inject(TranslationLoaderService);

  return translationLoader.loadTranslations('loans').pipe(
    switchMap(() =>
      translate.stream([
        LOAN_MANAGEMENT_TRANSLATION_KEYS.title,
        LOAN_MANAGEMENT_TRANSLATION_KEYS.subtitle,
      ])
    ),
    map((translations) => ({
      title: translations[LOAN_MANAGEMENT_TRANSLATION_KEYS.title],
      subtitle: translations[LOAN_MANAGEMENT_TRANSLATION_KEYS.subtitle],
    }))
  );
}
