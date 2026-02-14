import { TestBed } from '@angular/core/testing';

import { ClearSignalStore } from './clear-signal-store';

describe('ClearSignalStore', () => {
  let service: ClearSignalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearSignalStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
