import { Action } from '@ngrx/store';
import { paybillReducer } from '../../../store/paybill.reducer';
import {
  initialPaybillState,
  PaybillState,
} from '../../../store/paybill.state';
import {
  selectPaybillState,
  selectTemplates,
  selectTemplatesAsTreeItems,
  selectTemplatesGroup,
  selectTemplatesGroupWithConfigs,
  selectSelectedTemplates,
  selectLoading,
  selectError,
  selectChallengeId,
  selectDistributedAmount,
  selectTotalAmount,
  selectFormPayload,
  selectIsFormValid,
  selectSelectedSenderAccountId,
  selectTemplatesLoaded,
  selectTemplateGroupsLoaded,
  selectCategories,
  selectSelectedCategoryId,
  selectSelectedProviderId,
  selectProviders,
  selectActiveCategory,
  selectProvidersDropdown,
  selectFilteredProviders,
  selectActiveProvider,
  selectVerifiedDetails,
  selectPaymentPayload,
  selectNotifications,
  selectPaymentFields,
  selectServiceId,
  selectCategoriesLoaded,
} from '../../../store/paybill.selectors';
import { Templates, TemplateGroups } from '../models/paybill-templates.model';

export const mockTemplates: Templates[] = [
  {
    id: 't1',
    nickname: 'Internet Bill',
    serviceId: 'svc-internet',
    identification: { accountNumber: '111' },
    amountDue: 50,
    groupId: 'g1',
  },
  {
    id: 't2',
    nickname: 'Water Bill',
    serviceId: 'svc-water',
    identification: { accountNumber: '222' },
    amountDue: 30,
    groupId: null,
  },
  {
    id: 't3',
    nickname: 'Electricity',
    serviceId: 'svc-elec',
    identification: { accountNumber: '333' },
    amountDue: 100,
    groupId: 'g1',
  },
];

export const mockGroups: TemplateGroups[] = [
  { id: 'g1', groupName: 'Utilities', templateCount: 2 },
  { id: 'g2', groupName: 'Subscriptions', templateCount: 0 },
];

export interface RootState {
  paybill: PaybillState;
}

const allSelectors = [
  selectPaybillState,
  selectTemplates,
  selectTemplatesAsTreeItems,
  selectTemplatesGroup,
  selectTemplatesGroupWithConfigs,
  selectSelectedTemplates,
  selectLoading,
  selectError,
  selectChallengeId,
  selectDistributedAmount,
  selectTotalAmount,
  selectFormPayload,
  selectIsFormValid,
  selectSelectedSenderAccountId,
  selectTemplatesLoaded,
  selectTemplateGroupsLoaded,
  selectCategories,
  selectSelectedCategoryId,
  selectSelectedProviderId,
  selectProviders,
  selectActiveCategory,
  selectProvidersDropdown,
  selectFilteredProviders,
  selectActiveProvider,
  selectVerifiedDetails,
  selectPaymentPayload,
  selectNotifications,
  selectPaymentFields,
  selectServiceId,
  selectCategoriesLoaded,
];

export function createStore() {
  allSelectors.forEach((selector) => selector.release());

  let state: PaybillState = { ...initialPaybillState };

  return {
    dispatch(action: Action) {
      state = paybillReducer(state, action);
    },
    select<T>(selector: (state: RootState) => T): T {
      return selector({ paybill: state } as RootState);
    },
    getState(): PaybillState {
      return state;
    },
  };
}
