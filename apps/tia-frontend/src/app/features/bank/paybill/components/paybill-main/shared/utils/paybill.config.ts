import { PaybillPayload, PaybillProvider } from '../models/paybill.model';
import { SummaryField } from '../models/summary.model';

export const formatPaymentDate = (date: Date): string => {
  return date
    .toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ' at');
};

export const getSuccessSummaryItems = (
  provider: PaybillProvider | null,
  payload: PaybillPayload | null,
): SummaryField[] => {
  if (!provider || !payload) return [];

  return [
    {
      label: 'paybill.main.success.summary_fields.service',
      value: provider.serviceName || provider.name || '',
      canTranslate: true,
    },
    {
      label: 'paybill.main.success.summary_fields.amount_paid',
      value: `${payload.amount} GEL`,
      canTranslate: true,
    },
    {
      label: 'paybill.main.success.summary_fields.date_time',
      value: formatPaymentDate(new Date()),
      canTranslate: false,
    },
  ];
};
