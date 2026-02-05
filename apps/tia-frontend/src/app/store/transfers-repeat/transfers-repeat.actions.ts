import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

export const TransfersRepeatActions = createActionGroup({
  source: 'Transfers Operations',
  events: {
    'Set Transaction To Repeat': props<{ transaction: ITransactions }>(),
    'Clear Transaction To Repeat': emptyProps(),
  },
});
