import { TestBed } from '@angular/core/testing';

import { PaybillMainFacade } from './paybill-main-facade';

describe('PaybillMainFacade', () => {
  let service: PaybillMainFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybillMainFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
