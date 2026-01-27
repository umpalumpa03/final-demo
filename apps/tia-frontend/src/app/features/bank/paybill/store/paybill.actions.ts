import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PaybillCategory, PaybillProvider } from '../models/paybill.model';

export const PaybillActions = createActionGroup({
  source: 'Paybill API',
  events: {
    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: PaybillCategory[] }>(),
    'Load Categories Failure': props<{ error: string }>(),
    'Select Category': props<{ categoryId: string }>(),
    'Load Providers Success': props<{ providers: PaybillProvider[] }>(),
    'Load Providers Failure': props<{ error: string }>(),
    'Select Provider': props<{ providerId: string }>(),
    'Clear Selection': emptyProps(),
  },
});
