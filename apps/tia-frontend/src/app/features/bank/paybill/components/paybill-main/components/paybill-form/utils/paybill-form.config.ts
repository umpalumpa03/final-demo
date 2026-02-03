import { BillDetails } from '../../../shared/models/paybill.model';
import { SummaryField } from '../../../shared/models/summary.model';

export const mapBillSummaryFields = (
  details: BillDetails | null,
): SummaryField[] => {
  if (!details) return [];

  return [
    {
      label: 'paybill.main.summary.customer_name',
      value: details.accountHolder ?? 'paybill.main.summary.na',
      canTranslate:true
    },
    {
      label: 'paybill.main.summary.bill_period',
      value: details.billPeriod ?? 'paybill.main.summary.default_period',
      canTranslate:true
    },
    {
      label: 'paybill.main.summary.due_date',
      value: details.dueDate
        ? String(details.dueDate)
        : 'paybill.main.summary.na',
        canTranslate:false
    },
  ];
};
