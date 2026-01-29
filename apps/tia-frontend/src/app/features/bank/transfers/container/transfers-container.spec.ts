import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TransfersContainer } from './transfers-container';
import { TranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('TransfersContainer', () => {
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransfersContainer],
      providers: [
        provideRouter([]),
        {
          provide: TranslateService,
          useValue: { instant: vi.fn((key: string) => key) },
        },
      ],
    });
    translateService = TestBed.inject(TranslateService);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TransfersContainer);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize transferTabs signal with tabs from config', () => {
    const fixture = TestBed.createComponent(TransfersContainer);
    const tabs = fixture.componentInstance.transferTabs();

    expect(Array.isArray(tabs)).toBe(true);
    expect(tabs.length).toBeGreaterThan(0);
  });

  it('should inject TranslateService and use it for tabs', () => {
    TestBed.createComponent(TransfersContainer);
    expect(translateService.instant).toHaveBeenCalled();
  });

  it('should have transferTabs as readonly signal', () => {
    const fixture = TestBed.createComponent(TransfersContainer);
    const tabs = fixture.componentInstance.transferTabs;

    expect(typeof tabs).toBe('function');
    expect(tabs()).toBeDefined();
  });
});
