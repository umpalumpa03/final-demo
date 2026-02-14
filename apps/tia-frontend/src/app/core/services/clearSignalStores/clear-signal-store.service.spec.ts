import { TestBed } from '@angular/core/testing';

import { ClearSignalStoreService } from './clear-signal-store.service';

describe('ClearSignalStore', () => {
  let service: ClearSignalStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearSignalStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
