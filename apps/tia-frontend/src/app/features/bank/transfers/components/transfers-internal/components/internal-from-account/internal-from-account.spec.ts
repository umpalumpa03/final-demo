import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalFromAccount } from './internal-from-account';
import { TransferInternalService } from '../../../../services/transfer.internal.service';
import { TransferStore } from '../../../../store/transfers.store';
import { BreakpointService } from '../../../../../../../core/services/breakpoints/breakpoint.service';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AccountsActions } from '../../../../../../../store/products/accounts/accounts.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('InternalFromAccount', () => {
  let component: InternalFromAccount;
  let fixture: ComponentFixture<InternalFromAccount>;
  let mockStore: any;
  let mockTransferStore: any;
  let mockLocation: any;
  let mockRouter: any;
  let mockBreakpointService: any;
  let mockTransferInternalService: any;

  const mockAccounts = [
    { id: 'acc1', name: 'Account 1', balance: 1000 },
    { id: 'acc2', name: 'Account 2', balance: 2000 },
  ];

  beforeEach(async () => {
    mockStore = {
      select: vi.fn()
        .mockReturnValueOnce(of(mockAccounts))
        .mockReturnValueOnce(of(false))
        .mockReturnValueOnce(of(null)),
      dispatch: vi.fn(),
    };

    mockTransferStore = {
      senderAccount: signal(null),
    };

    mockLocation = {
      back: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockBreakpointService = {
      isMobile: signal(false),
    };

    mockTransferInternalService = {
      handleFromAccountSelect: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InternalFromAccount, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: TransferStore, useValue: mockTransferStore },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: TransferInternalService, useValue: mockTransferInternalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalFromAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch loadAccounts action', () => {
      component.ngOnInit();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({})
      );
    });
  });

  describe('onAccountSelect', () => {
    it('should call transferInternalService.handleFromAccountSelect', () => {
      const account = mockAccounts[0];
      component.onAccountSelect(account as any);

      expect(mockTransferInternalService.handleFromAccountSelect).toHaveBeenCalled();
    });
  });

  describe('onRetry', () => {
    it('should dispatch loadAccounts action', () => {
      mockStore.dispatch.mockClear();
      component.onRetry();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({})
      );
    });
  });

  describe('onGoBack', () => {
    it('should call location.back()', () => {
      component.onGoBack();
      expect(mockLocation.back).toHaveBeenCalled();
    });
  });

  describe('onContinue', () => {
    it('should navigate to to-account page', () => {
      component.onContinue();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/internal/to-account']);
    });
  });

  describe('isContinueDisabled', () => {
    it('should return true when no account selected', () => {
      expect(component.isContinueDisabled()).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should have accounts signal', () => {
      expect(component.accounts()).toBeTruthy();
    });

    it('should have isLoading signal', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have error signal', () => {
      expect(component.error()).toBe(null);
    });

    it('should have isFullWidth based on breakpoint', () => {
      expect(component.isFullWidth()).toBe(false);
    });

    it('should have showSuccess initialized to false', () => {
      expect(component.showSuccess()).toBe(false);
    });
  });
});
