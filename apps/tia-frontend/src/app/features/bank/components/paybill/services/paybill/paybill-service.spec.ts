import { TestBed } from '@angular/core/testing';

import { PaybillService } from './paybill-service';

describe('PaybillService', () => {
  let service: PaybillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
