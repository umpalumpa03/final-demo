import { TestBed } from '@angular/core/testing';

import { DynamicInputs } from './dynamic-inputs';

describe('DynamicInputs', () => {
  let service: DynamicInputs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicInputs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
