import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  PaginatedResponse,
  ITransactions,
  ITransactionFilter,
  ICategoryPostResponse,
} from '../../shared/models/transactions/transactions.models.js';
import { ITransactionsCategory } from '@tia/shared/models/transactions/transactions-category.models.js';

export const TransactionActions = createActionGroup({
  source: 'Transactions Page',
  events: {
    Enter: emptyProps(),

    'Update Filters': props<{ filters: Partial<ITransactionFilter> }>(),
    'Load Transactions': emptyProps(),
    'Load More': emptyProps(),
    'Load Success': props<{
      response: PaginatedResponse<ITransactions>;
    }>(),
    'Load Total Success': props<{ total: number }>(),
    'Load Failure': props<{ error: unknown }>(),

    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: ITransactionsCategory[] }>(),
    'Load Categories Failure': props<{ error: unknown }>(),

    'Create Category': props<{ name: string }>(),
    'Create Category Success': props<{ response: ICategoryPostResponse }>(),
    'Create Category Failure': props<{ error: string }>(),

    'Assign Category': props<{ transactionId: string; categoryId: string }>(),
    'Assign Category Success': props<{ transactionId: string; categoryId: string}>(),
    'Assign Category Failure': props<{ error: string }>(),
  },
});
