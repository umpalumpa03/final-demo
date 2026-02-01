import { PaybillPayload, PaybillProvider } from "../models/paybill.model";

export const formatPaymentDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ' at');
};

export const getSuccessSummaryItems = (provider: PaybillProvider | null, payload: PaybillPayload | null) => {
  if (!provider || !payload) return [];

  return [
    {
      label: 'Transaction ID',
      value: `TXN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    {
      label: 'Service',
      value: provider.serviceName || provider.name || '',
    },
    {
      label: 'Amount Paid',
      value: `${payload.amount} GEL`,
    },
    {
      label: 'Date & Time',
      value: formatPaymentDate(new Date()),
    },
  ];
};