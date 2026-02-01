import { TestBed } from '@angular/core/testing';

import { PaybillTemplatesService } from './paybill-templates-service';

describe('PaybillTemplatesService', () => {
  let service: PaybillTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybillTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
