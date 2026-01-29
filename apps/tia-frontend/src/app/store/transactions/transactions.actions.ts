import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  PaginatedResponse,
  TransactionFilter,
  ITransactions,
} from '../../shared/models/transactions/transactions.models.js';

export const TransactionActions = createActionGroup({
  source: 'Transactions Page',
  events: {
    Enter: emptyProps(),

    'Update Filters': props<{ filters: Partial<TransactionFilter> }>(),
    'Load Transactions': emptyProps(),
    'Load More': emptyProps(),
    'Load Success': props<{
      response: PaginatedResponse<ITransactions>;
    }>(),
    'Load Total Success': props<{ total: number }>(),
    'Load Failure': props<{ error: unknown }>(),
  },
});
