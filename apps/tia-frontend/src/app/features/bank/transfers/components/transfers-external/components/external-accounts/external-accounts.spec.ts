import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAccounts } from './external-accounts';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TransferStore } from '../../../../store/transfers.store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExternalAccounts (vitest)', () => {
  let component: ExternalAccounts;
  let fixture: ComponentFixture<ExternalAccounts>;

  const mockStore = {
    isLoading: signal(false),
    error: signal<any>(null),
    recipientInfo: signal<any>(null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalAccounts, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: TransferStore, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should compute recipientName from store', () => {
    mockStore.recipientInfo.set({ fullName: 'John Doe', accounts: [] });
    fixture.detectChanges();
    expect(component.recipientName()).toBe('John Doe');
  });

  it('should navigate on continue if account is selected', () => {
    const router = TestBed.inject(Router);
    component.selectedAccountId.set('123');
    component.onContinue();
    expect(router.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });
});
