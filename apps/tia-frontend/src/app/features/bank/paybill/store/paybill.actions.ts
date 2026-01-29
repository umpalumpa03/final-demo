import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  BillDetails,
  PaybillCategory,
  PaybillProvider,
} from '../models/paybill.model';

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
    'Check Bill': props<{ serviceId: string; accountNumber: string }>(),
    'Check Bill Success': props<{ details: BillDetails }>(),
    'Check Bill Failure': props<{ error: string }>(),
    'Clear Selection': emptyProps(),
    'Set Payment Step': props<{ step: string }>(),
    'Set Payment Payload': props<{ data: any }>(),
  },
});
