import {
  BillDetails,
  PaybillCategory,
  PaybillPayload,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';
import { TemplateGroups } from '../components/paybill-templates/models/paybill-templates.model';

export interface PaybillState {
  categories: PaybillCategory[];
  providers: PaybillProvider[];
  selectedCategoryId: string | null;
  selectedProviderId: string | null;
  loading: boolean;
  error: string | null;
  selectedProvider: PaybillProvider | null;
  verifiedDetails: BillDetails | null;
  currentStep: string;
  paymentPayload: PaybillPayload | null;
  challengeId: string | null;
  templateGroups: TemplateGroups[];
}

export const initialPaybillState: PaybillState = {
  categories: [],
  selectedCategoryId: null,
  selectedProviderId: null,
  selectedProvider: null,
  loading: false,
  providers: [],
  error: null,
  verifiedDetails: null,
  currentStep: 'DETAILS',
  paymentPayload: null,
  challengeId: null,
  templateGroups: [],
};
