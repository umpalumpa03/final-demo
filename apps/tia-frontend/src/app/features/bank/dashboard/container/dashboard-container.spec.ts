import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardContainer } from './dashboard-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach } from 'vitest';

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
      imports: [DashboardContainer],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DashboardContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledTimes(3);
  });
});
