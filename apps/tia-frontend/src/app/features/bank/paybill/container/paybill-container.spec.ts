import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillActions } from '../store/paybill.actions';
import * as fromSelectors from '../store/paybill.selectors';
import { TranslateModule } from '@ngx-translate/core';
import { initialPaybillState } from '../store/paybill.state';
import { BreadcrumbService } from '../services/breadcrumb/breadcrumb';
import { signal } from '@angular/core';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;
  let store: MockStore;

  // Simple mock data
  const mockCategory = { id: 'UTIL', name: 'Utilities' };
  const mockProvider = { id: 'P1', name: 'Electric Co' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: { paybill: initialPaybillState },
          selectors: [
            { selector: fromSelectors.selectCategories, value: [mockCategory] },
            { selector: fromSelectors.selectActiveCategory, value: null },
            { selector: fromSelectors.selectActiveProvider, value: null },
            { selector: fromSelectors.selectNotifications, value: [] },
          ],
        }),
        provideRouter([]),
        {
          provide: BreadcrumbService,
          useValue: { breadcrumbs$: signal([]) },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load categories on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(PaybillActions.loadCategories());
  });

  it('should dispatch selectCategory when a category is selected', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.handleCategorySelect(mockCategory as any);
    expect(spy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: mockCategory.id }),
    );
  });

  it('should dispatch selectProvider when a provider is selected', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.handleProviderSelect(mockProvider as any);
    expect(spy).toHaveBeenCalledWith(
      PaybillActions.selectProvider({ providerId: mockProvider.id }),
    );
  });

  it('should dispatch dismissNotification when alert is closed', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.handleDismiss('alert-123');
    expect(spy).toHaveBeenCalledWith(
      PaybillActions.dismissNotification({ id: 'alert-123' }),
    );
  });

  describe('handleNativeClick', () => {
    it('should clear selection when clicking "Paybill" text', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = {
        target: { textContent: 'Paybill' },
      } as unknown as Event;

      component.handleNativeClick(mockEvent);
      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });
});
