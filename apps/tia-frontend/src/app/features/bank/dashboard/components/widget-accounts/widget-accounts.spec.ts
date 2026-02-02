import { beforeEach, describe, expect, it } from 'vitest';
import { DashboardContainer } from 'apps/tia-frontend/src/app/features/bank/dashboard/container/dashboard-container';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let fixture: ComponentFixture<DashboardContainer>;
  let store: MockStore;

  const initialState = {
    accounts: {
      accounts: [],
      isLoading: false,
      error: null
    },
    transactions: {
      items: []
    },
    ExchangeRates: {
      ExchangeRates: [],
      loading: false,
      error: false
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardContainer,
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
