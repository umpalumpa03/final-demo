import { TestBed } from '@angular/core/testing';

import { WidgetsApiService } from './widgets-service.api';

describe('WidgetsService', () => {
  let service: WidgetsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
