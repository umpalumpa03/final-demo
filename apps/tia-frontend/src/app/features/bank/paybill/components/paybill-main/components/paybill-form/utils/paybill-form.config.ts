import { BillDetails } from "../../../shared/models/paybill.model";
import { SummaryField } from "../../../shared/models/summary.model";

export const mapBillSummaryFields = (details: BillDetails | null): SummaryField[] => {
  if (!details) return [];
  return [
    {
      label: 'Customer Name:',
      value: details.accountHolder ?? 'N/A',
    },
    {
      label: 'Bill Period:',
      value: details.billPeriod ?? 'Current Month',
    },
    {
      label: 'Due Date:',
      value: details.dueDate ? String(details.dueDate) : 'N/A',
    },
  ];
};