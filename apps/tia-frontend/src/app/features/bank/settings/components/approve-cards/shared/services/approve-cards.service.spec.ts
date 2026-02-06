import { TestBed } from '@angular/core/testing';

import { ApproveCardsService } from './approve-cards.service';

describe('ApproveCards', () => {
  let service: ApproveCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproveCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
