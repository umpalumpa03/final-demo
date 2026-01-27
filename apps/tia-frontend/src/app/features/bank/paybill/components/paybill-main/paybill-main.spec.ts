import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillMain } from './paybill-main';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillActions } from '../../store/paybill.actions';
import * as PAYBILL_SELECTORS from '../../store/paybill.selectors';
import { PaybillCategory } from '../../models/paybill.model';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let store: MockStore;

  const initialState = {
    paybill: {
      categories: [],
      selectedCategoryId: null,
      selectedProviderId: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillMain],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: PAYBILL_SELECTORS.selectCategories, value: [] },
            { selector: PAYBILL_SELECTORS.selectActiveCategory, value: null },
            { selector: PAYBILL_SELECTORS.selectActiveProvider, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch selectCategory action when selectCategory is called', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const testId = 'cat-123';

    component.selectCategory(testId);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: testId }),
    );
  });

  it('should format categories correctly through the computed signal', () => {
    const mockRawCategories: PaybillCategory[] = [
      {
        id: 'phone',
        name: 'Phone',
        icon: 'icon.svg',
        providers: [
          { id: 'p1', name: 'Provider 1' },
          { id: 'p2', name: 'Provider 2' },
        ],
      },
    ];

    store.overrideSelector(
      PAYBILL_SELECTORS.selectCategories,
      mockRawCategories,
    );
    store.refreshState();
    fixture.detectChanges();

    const formatted = component.formattedCategories();

    expect(formatted.length).toBe(1);
    expect(formatted[0].subtitle).toBe('Mobile & Data');
    expect(formatted[0].count).toBe(2);
  });
});
