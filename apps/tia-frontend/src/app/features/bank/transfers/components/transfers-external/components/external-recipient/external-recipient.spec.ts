import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExternalRecipient } from './external-recipient';
import { TranslateService } from '@ngx-translate/core';

describe('ExternalRecipient', () => {
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExternalRecipient],
      providers: [
        {
          provide: TranslateService,
          useValue: { instant: vi.fn((key: string) => key) },
        },
      ],
    });
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ExternalRecipient);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize recipientInputConfig from config function', () => {
    const fixture = TestBed.createComponent(ExternalRecipient);
    expect(fixture.componentInstance.recipientInputConfig).toBeDefined();
  });

  it('should inject TranslateService and use it for config', () => {
    TestBed.createComponent(ExternalRecipient);
    expect(translateService.instant).toHaveBeenCalled();
  });
});
