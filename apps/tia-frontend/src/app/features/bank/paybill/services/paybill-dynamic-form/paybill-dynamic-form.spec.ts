import { TestBed } from '@angular/core/testing';

import { PaybillDynamicForm } from './paybill-dynamic-form';

describe('PaybillDynamicForm', () => {
  let service: PaybillDynamicForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaybillDynamicForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
