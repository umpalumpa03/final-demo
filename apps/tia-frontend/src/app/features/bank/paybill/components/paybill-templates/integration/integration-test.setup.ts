import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { paybillReducer } from '../../../store/paybill.reducer';
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

export function setupIntegrationStore(): Store {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [StoreModule.forRoot({ paybill: paybillReducer })],
  });

  return TestBed.inject(Store);
}
