import {
  BillDetails,
  PaybillPayload,
} from '../../../shared/models/paybill.model';
import { SummaryField } from '../../../shared/models/summary.model';

export const mapConfirmSummaryFields = (
  summary: PaybillPayload,
  details: BillDetails,
): SummaryField[] => [
  {
    label: 'Account Number:',
    value: summary.accountNumber ?? 'N/A',
  },
  {
    label: 'Customer Name:',
    value: details.accountHolder ?? 'N/A',
  },
  {
    label: 'Due Date:',
    value: details.dueDate ?? 'N/A',
  },
  {
    label: 'Amount to Pay:',
    value: `${summary.amount} GEL`,
    isTotal: true,
  },
];
