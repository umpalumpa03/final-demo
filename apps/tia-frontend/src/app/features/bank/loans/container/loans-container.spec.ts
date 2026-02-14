import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansContainer } from './loans-container';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../store/loans.store';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Component, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AlertService } from '@tia/core/services/alert/alert.service';

@Component({ selector: 'app-request-modal', template: '', standalone: true })
class MockRequestModal {}

describe('LoansContainer', () => {
  let component: LoansContainer;
  let fixture: ComponentFixture<LoansContainer>;
  let globalStore: MockStore;
  let loansStoreMock: any;

  beforeEach(async () => {
    loansStoreMock = {
      loading: signal(false),
      alert: signal(null),
      reset: vi.fn(),
      setSearchQuery: vi.fn(),
      loanCounts: signal({ all: 0, approved: 0, pending: 0, declined: 0 }),
      loanMonthsOptions: signal([]),
      setAccountFilter: vi.fn(),
      activeAccountName: signal('Mock Account'),
      purposeOptions: signal([]),
      isDetailsOpen: signal(false),
      isPrepaymentOpen: signal(false),
      activePrepaymentLoan: signal(null),
      selectedLoanDetails: signal(null),
      detailsLoading: signal(false),
      closeModals: vi.fn(),
      navigateDetails: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoansContainer, TranslateModule.forRoot(), MockRequestModal],
      providers: [
        provideRouter([]),
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
        { provide: AlertService, useValue: { showAlert: vi.fn() } },
      ],
    })
      .overrideComponent(LoansContainer, { set: { animations: [] } })
      .compileComponents();

    globalStore = TestBed.inject(MockStore);
    vi.spyOn(globalStore, 'dispatch');

    fixture = TestBed.createComponent(LoansContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data loading on init', () => {
    expect(globalStore.dispatch).toHaveBeenCalledWith(
      AccountsActions.loadAccounts({}),
    );
  });
});
