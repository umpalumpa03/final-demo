import { TestBed } from '@angular/core/testing';

import { ApproveAccountsApiService } from './approve-accounts.api.service';

describe('ApproveAccountsApiService', () => {
  let service: ApproveAccountsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveAccountsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
