import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { TranslationLoaderService } from '../../../../../../../core/i18n';

export const LOAN_DRAWER_TRANSLATION_KEYS = {
  title: 'loans.management.drawer.title',
  subtitle: 'loans.management.drawer.subtitle',
  applicantSection: 'loans.management.drawer.applicantSection',
  loanSection: 'loans.management.drawer.loanSection',
  riskSection: 'loans.management.drawer.riskSection',
  declineSection: 'loans.management.drawer.declineSection',
  fullName: 'loans.management.drawer.fields.fullName',
  email: 'loans.management.drawer.fields.email',
  phoneNumber: 'loans.management.drawer.fields.phoneNumber',
  employmentStatus: 'loans.management.drawer.fields.employmentStatus',
  address: 'loans.management.drawer.fields.address',
  annualIncome: 'loans.management.drawer.fields.annualIncome',
  creditScore: 'loans.management.drawer.fields.creditScore',
  applicantUnavailable: 'loans.management.drawer.applicantUnavailable',
  loanAmount: 'loans.management.drawer.fields.loanAmount',
  loanPurpose: 'loans.management.drawer.fields.loanPurpose',
  loanTerm: 'loans.management.drawer.fields.loanTerm',
  interestRate: 'loans.management.drawer.fields.interestRate',
  monthlyPayment: 'loans.management.drawer.fields.monthlyPayment',
  requestDate: 'loans.management.drawer.fields.requestDate',
  months: 'loans.management.drawer.fields.months',
  debtToIncome: 'loans.management.drawer.fields.debtToIncome',
  loanToIncome: 'loans.management.drawer.fields.loanToIncome',
  totalInterest: 'loans.management.drawer.fields.totalInterest',
  creditScorePoor: 'loans.management.drawer.creditScoreBadge.Poor',
  creditScoreFair: 'loans.management.drawer.creditScoreBadge.Fair',
  creditScoreGood: 'loans.management.drawer.creditScoreBadge.Good',
  creditScoreVeryGood: 'loans.management.drawer.creditScoreBadge.Very Good',
  creditScoreExcellent: 'loans.management.drawer.creditScoreBadge.Excellent',
  declinePlaceholder: 'loans.management.drawer.declinePlaceholder',
  close: 'loans.management.drawer.buttons.close',
  decline: 'loans.management.drawer.buttons.decline',
  approve: 'loans.management.drawer.buttons.approve',
  cancel: 'loans.management.drawer.buttons.cancel',
  confirmDecline: 'loans.management.drawer.buttons.confirmDecline',
} as const;

type TranslationKeys = typeof LOAN_DRAWER_TRANSLATION_KEYS;
type TranslationValues = { [K in keyof TranslationKeys]: string };

export function useLoanDrawerConfig() {
  const translate = inject(TranslateService);
  const translationLoader = inject(TranslationLoaderService);

  const keys = Object.values(LOAN_DRAWER_TRANSLATION_KEYS);

  return translationLoader.loadTranslations('loans').pipe(
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
