import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

import { InternalAmount } from '../components/internal-amount/internal-amount';
import { TransferStore } from '../../../store/transfers.store';
import { TransferInternalService } from '../services/transfer.internal.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { AlertService } from 'apps/tia-frontend/src/app/core/services/alert/alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountType } from 'apps/tia-frontend/src/app/shared/models/accounts/accounts.model';

const mockSender: Account = {
  id: 'acc-1',
  userId: 'u1',
  permission: 1,
  type: AccountType.current,
  iban: 'GE00XX0000000000000001',
  friendlyName: 'Main',
  name: 'Current Account',
  status: 'active',
  balance: 1000,
  currency: 'GEL',
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: true,
  isHidden: false,
};

const mockRecipient: Account = {
  id: 'acc-2',
  userId: 'u1',
  permission: 1,
  type: AccountType.saving,
  iban: 'GE00XX0000000000000002',
  friendlyName: 'Saving',
  name: 'Saving Account',
  status: 'active',
  balance: 500,
  currency: 'GEL',
  createdAt: '2024-01-01',
  openedAt: '2024-01-01',
  closedAt: '',
  isFavorite: false,
  isHidden: false,
};

describe('InternalAmount Integration', () => {
  let component: InternalAmount;
  let fixture: ComponentFixture<InternalAmount>;
  let transferStore: InstanceType<typeof TransferStore>;
  let router: Router;
  let transfersApi: {
    transferToOwn: ReturnType<typeof vi.fn>;
    getConversionRate: ReturnType<typeof vi.fn>;
  };
  let alertService: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    transfersApi = {
      transferToOwn: vi.fn().mockReturnValue(
        of({
          verify: null,
          success: true,
        }),
      ),
      getConversionRate: vi.fn().mockReturnValue(of({ success: true, rate: 1 })),
    };
    alertService = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [InternalAmount, TranslateModule.forRoot()],
      providers: [
        provideMockStore(),
        TransferStore,
        TransferInternalService,
        {
          provide: Router,
          useValue: { navigate: vi.fn(), events: of() },
        },
        {
          provide: BreakpointService,
          useValue: { isMobile: signal(false) },
        },
        { provide: TransfersApiService, useValue: transfersApi },
        { provide: AlertService, useValue: alertService },
      ],
    }).compileComponents();

    transferStore = TestBed.inject(TransferStore);
    router = TestBed.inject(Router);
    transferStore.setSenderAccount(mockSender);
    transferStore.setReceiverOwnAccount(mockRecipient);
    transferStore.setInsufficientBalance(false);

    fixture = TestBed.createComponent(InternalAmount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and transfer summary', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.amount.title',
    );
    expect(fixture.debugElement.query(By.css('app-transfer-summary'))).toBeTruthy();
  });

  it('should show available balance from sender account', () => {
    expect(component.availableBalance()).toBe(1000);
    expect(fixture.nativeElement.textContent).toContain('1,000.00');
  });

  it('should have transfer button disabled when amount invalid', () => {
    expect(component.isTransferDisabled()).toBe(true);
    const transferBtn = fixture.debugElement.query(
      By.css('.internal-amount__footer app-button[variant="default"]'),
    );
    expect(transferBtn).toBeTruthy();
  });

  it('should enable transfer when valid amount entered', () => {
    component.amountInput.setValue(100);
    component.amountInput.markAsTouched();
    fixture.detectChanges();
    expect(component.isTransferDisabled()).toBe(false);
  });

  it('should navigate back to to-account on go back', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.amountInput.setValue(50);
    component.onGoBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/bank/transfers/internal/to-account']);
    expect(transferStore.amount()).toBe(50);
  });

  it('should call success toast on init', () => {
    component.ngOnInit();
    expect(alertService.success).toHaveBeenCalled();
  });

  it('should show insufficient balance error when amount exceeds balance', () => {
    component.amountInput.setValue(2000);
    component.amountInput.markAsTouched();
    fixture.detectChanges();
    expect(transferStore.hasInsufficientBalance()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.amount.insufficientBalance',
    );
  });

  it('should render back button and transfer button in footer', () => {
    expect(fixture.nativeElement.textContent).toContain('common.buttons.back');
    expect(fixture.nativeElement.textContent).toContain(
      'transfers.internal.amount.transferButton',
    );
  });
});
