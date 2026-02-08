import {
  BillDetails,
  PaybillCategory,
  PaybillPayload,
  PaybillPaymentDetails,
  PaybillProvider,
} from '../components/paybill-main/shared/models/paybill.model';
import {
  TemplateGroups,
  Templates,
} from '../components/paybill-templates/models/paybill-templates.model';

export interface PaybillNotification {
  id?: string;
  notificationType: 'success' | 'warning' | 'information';
  message: string;
}

export interface PaybillErrorPayload {
  message?: string;
  error?: string;
  valid?: boolean;
}

export interface PaybillState {
  categories: PaybillCategory[];
  providers: PaybillProvider[];
  filteredProviders?: PaybillProvider[][];
  selectedCategoryId: string | null;
  selectedProviderId: string | null;
  loading: boolean;
  error: string | null;
  selectedProvider: PaybillProvider | null;
  verifiedDetails: BillDetails | null;
  paymentPayload: PaybillPayload | null;
  challengeId: string | null;
  templateGroups: TemplateGroups[];
  templates: Templates[];
  notifications: PaybillNotification[];
  paymentDetails: PaybillPaymentDetails | null;
  currentLevel: number;
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
  paymentPayload: null,
  challengeId: null,
  templateGroups: [],
  templates: [],
  notifications: [],
  paymentDetails: null,
  filteredProviders: [],
  currentLevel: 0,
};
