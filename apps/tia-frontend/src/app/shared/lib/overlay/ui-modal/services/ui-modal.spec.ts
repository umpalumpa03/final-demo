import { TestBed } from '@angular/core/testing';

import { UiModal } from './ui-modal';

describe('UiModal', () => {
  let service: UiModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
