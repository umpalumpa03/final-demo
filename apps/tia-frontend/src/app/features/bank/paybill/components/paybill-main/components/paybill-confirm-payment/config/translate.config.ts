import {
  BillDetails,
  PaybillPayload,
} from '../../../shared/models/paybill.model';
import { SummaryField } from '../../../shared/models/summary.model';

export const CONFIRM_PAYMENT_UI = {
  TITLE: 'paybill.main.confirm.title',
  SUBTITLE: 'paybill.main.confirm.subtitle',
  SUMMARY_HEADER: 'paybill.main.confirm.summary_header',
  SUMMARY_SUBHEADER: 'paybill.main.confirm.summary_subheader',
} as const;

export const mapConfirmSummaryFields = (
  providerName: string,
  summary: PaybillPayload,
  details: BillDetails,
): SummaryField[] => {
  return [
    {
      label: 'paybill.main.confirm.summary_fields.service',
      value: providerName,
      canTranslate: true,
    },
    {
      label: 'paybill.main.confirm.summary_fields.account',
      value: summary.accountNumber,
      canTranslate: true,
    },
    {
      label: 'paybill.main.confirm.summary_fields.holder',
      value: details.accountHolder ?? 'paybill.confirm.summary_fields.na',
      canTranslate: !details.accountHolder,
    },
    {
      label: 'paybill.main.confirm.summary_fields.amount',
      value: summary.amount,
      isTotal: true,
      canTranslate: true,
    },
  ];
};
