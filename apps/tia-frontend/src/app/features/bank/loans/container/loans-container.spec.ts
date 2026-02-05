import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansContainer } from './loans-container';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoansStore } from '../store/loans.store';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { Component, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  selector: 'app-request-modal',
  template: '',
  standalone: true,
})
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
      loadCounts: vi.fn(),
      loanCounts: signal({ all: 0, approved: 0, pending: 0, declined: 0 }),
      loanMonthsOptions: signal([]),
      purposeOptions: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [LoansContainer, TranslateModule.forRoot(), MockRequestModal],
      providers: [
        provideRouter([]),
        provideMockStore(),
        { provide: LoansStore, useValue: loansStoreMock },
      ],
    })
      .overrideComponent(LoansContainer, {
        set: { animations: [] },
      })
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
    expect(loansStoreMock.loadCounts).toHaveBeenCalled();
  });
});
