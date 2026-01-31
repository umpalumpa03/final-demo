import { TestBed } from '@angular/core/testing';

import { PaybillTemplates } from './paybill-templates';

describe('PaybillTemplates', () => {
  let service: PaybillTemplates;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybillTemplates);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
