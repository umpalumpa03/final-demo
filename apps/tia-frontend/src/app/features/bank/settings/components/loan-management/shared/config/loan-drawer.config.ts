import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { TranslationLoaderService } from '../../../../../../../core/i18n';

export const LOAN_DRAWER_TRANSLATION_KEYS = {
  title: 'settings.loan-management.drawer.title',
  subtitle: 'settings.loan-management.drawer.subtitle',
  applicantSection: 'settings.loan-management.drawer.applicantSection',
  loanSection: 'settings.loan-management.drawer.loanSection',
  riskSection: 'settings.loan-management.drawer.riskSection',
  declineSection: 'settings.loan-management.drawer.declineSection',
  fullName: 'settings.loan-management.drawer.fields.fullName',
  email: 'settings.loan-management.drawer.fields.email',
  phoneNumber: 'settings.loan-management.drawer.fields.phoneNumber',
  employmentStatus: 'settings.loan-management.drawer.fields.employmentStatus',
  address: 'settings.loan-management.drawer.fields.address',
  annualIncome: 'settings.loan-management.drawer.fields.annualIncome',
  creditScore: 'settings.loan-management.drawer.fields.creditScore',
  applicantUnavailable: 'settings.loan-management.drawer.applicantUnavailable',
  loanAmount: 'settings.loan-management.drawer.fields.loanAmount',
  loanPurpose: 'settings.loan-management.drawer.fields.loanPurpose',
  loanTerm: 'settings.loan-management.drawer.fields.loanTerm',
  interestRate: 'settings.loan-management.drawer.fields.interestRate',
  monthlyPayment: 'settings.loan-management.drawer.fields.monthlyPayment',
  requestDate: 'settings.loan-management.drawer.fields.requestDate',
  months: 'settings.loan-management.drawer.fields.months',
  debtToIncome: 'settings.loan-management.drawer.fields.debtToIncome',
  loanToIncome: 'settings.loan-management.drawer.fields.loanToIncome',
  totalInterest: 'settings.loan-management.drawer.fields.totalInterest',
  creditScorePoor: 'settings.loan-management.drawer.creditScoreBadge.Poor',
  creditScoreFair: 'settings.loan-management.drawer.creditScoreBadge.Fair',
  creditScoreGood: 'settings.loan-management.drawer.creditScoreBadge.Good',
  creditScoreVeryGood: 'settings.loan-management.drawer.creditScoreBadge.Very Good',
  creditScoreExcellent: 'settings.loan-management.drawer.creditScoreBadge.Excellent',
  declinePlaceholder: 'settings.loan-management.drawer.declinePlaceholder',
  close: 'settings.loan-management.drawer.buttons.close',
  decline: 'settings.loan-management.drawer.buttons.decline',
  approve: 'settings.loan-management.drawer.buttons.approve',
  cancel: 'settings.loan-management.drawer.buttons.cancel',
  confirmDecline: 'settings.loan-management.drawer.buttons.confirmDecline',
} as const;

type TranslationKeys = typeof LOAN_DRAWER_TRANSLATION_KEYS;
type TranslationValues = { [K in keyof TranslationKeys]: string };

export function useLoanDrawerConfig() {
  const translate = inject(TranslateService);
  const translationLoader = inject(TranslationLoaderService);

  const keys = Object.values(LOAN_DRAWER_TRANSLATION_KEYS);

  return translationLoader.loadTranslations('settings').pipe(
    switchMap(() => translate.stream(keys)),
    map((translations): TranslationValues => ({
      title: translations[LOAN_DRAWER_TRANSLATION_KEYS.title],
      subtitle: translations[LOAN_DRAWER_TRANSLATION_KEYS.subtitle],
      applicantSection: translations[LOAN_DRAWER_TRANSLATION_KEYS.applicantSection],
      loanSection: translations[LOAN_DRAWER_TRANSLATION_KEYS.loanSection],
      riskSection: translations[LOAN_DRAWER_TRANSLATION_KEYS.riskSection],
      declineSection: translations[LOAN_DRAWER_TRANSLATION_KEYS.declineSection],
      fullName: translations[LOAN_DRAWER_TRANSLATION_KEYS.fullName],
      email: translations[LOAN_DRAWER_TRANSLATION_KEYS.email],
      phoneNumber: translations[LOAN_DRAWER_TRANSLATION_KEYS.phoneNumber],
      employmentStatus: translations[LOAN_DRAWER_TRANSLATION_KEYS.employmentStatus],
      address: translations[LOAN_DRAWER_TRANSLATION_KEYS.address],
      annualIncome: translations[LOAN_DRAWER_TRANSLATION_KEYS.annualIncome],
      creditScore: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScore],
      applicantUnavailable: translations[LOAN_DRAWER_TRANSLATION_KEYS.applicantUnavailable],
      loanAmount: translations[LOAN_DRAWER_TRANSLATION_KEYS.loanAmount],
      loanPurpose: translations[LOAN_DRAWER_TRANSLATION_KEYS.loanPurpose],
      loanTerm: translations[LOAN_DRAWER_TRANSLATION_KEYS.loanTerm],
      interestRate: translations[LOAN_DRAWER_TRANSLATION_KEYS.interestRate],
      monthlyPayment: translations[LOAN_DRAWER_TRANSLATION_KEYS.monthlyPayment],
      requestDate: translations[LOAN_DRAWER_TRANSLATION_KEYS.requestDate],
      months: translations[LOAN_DRAWER_TRANSLATION_KEYS.months],
      debtToIncome: translations[LOAN_DRAWER_TRANSLATION_KEYS.debtToIncome],
      loanToIncome: translations[LOAN_DRAWER_TRANSLATION_KEYS.loanToIncome],
      totalInterest: translations[LOAN_DRAWER_TRANSLATION_KEYS.totalInterest],
      creditScorePoor: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScorePoor],
      creditScoreFair: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScoreFair],
      creditScoreGood: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScoreGood],
      creditScoreVeryGood: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScoreVeryGood],
      creditScoreExcellent: translations[LOAN_DRAWER_TRANSLATION_KEYS.creditScoreExcellent],
      declinePlaceholder: translations[LOAN_DRAWER_TRANSLATION_KEYS.declinePlaceholder],
      close: translations[LOAN_DRAWER_TRANSLATION_KEYS.close],
      decline: translations[LOAN_DRAWER_TRANSLATION_KEYS.decline],
      approve: translations[LOAN_DRAWER_TRANSLATION_KEYS.approve],
      cancel: translations[LOAN_DRAWER_TRANSLATION_KEYS.cancel],
      confirmDecline: translations[LOAN_DRAWER_TRANSLATION_KEYS.confirmDecline],
    }))
  );
}
