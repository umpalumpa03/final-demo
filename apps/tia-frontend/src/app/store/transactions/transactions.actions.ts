import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaginatedResponse, TransactionFilter, TransactionInterface } from '../../features/bank/transactions/models/transactions.models';


export const TransactionActions = createActionGroup({
  source: 'Transactions Page',
  events: {
    Enter: emptyProps(),

    'Update Filters': props<{ filters: Partial<TransactionFilter> }>(),
    'Load Transactions': emptyProps(),
    'Load More': emptyProps(),
    'Load Success': props<{
      response: PaginatedResponse<TransactionInterface>;
    }>(),
    'Load Failure': props<{ error: unknown }>(),
  },
});
