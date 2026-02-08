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

  const mockCategory = { id: 'UTIL', name: 'Utilities' };
  const mockProvider = { id: 'P1', name: 'Electric Co' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: { paybill: initialPaybillState },
        }),
        provideRouter([]),
        {
          provide: BreadcrumbService,

          useValue: { breadcrumbs$: signal([]) },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(fromSelectors.selectCategories, [mockCategory]);
    store.overrideSelector(fromSelectors.selectActiveCategory, null);
    store.overrideSelector(fromSelectors.selectActiveProvider, null);
    store.overrideSelector(fromSelectors.selectNotifications, []);

    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Alert and Notification Logic', () => {
    it('should dispatch dismissNotification when an alert is closed', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleDismiss('alert-id-123');

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.dismissNotification({ id: 'alert-id-123' }),
      );
    });
  });

  describe('Selection Management', () => {
    it('should dispatch selectCategory when handleCategorySelect is called', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleCategorySelect(mockCategory as any);

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'UTIL' }),
      );
    });

    it('should dispatch selectProvider when handleProviderSelect is called', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleProviderSelect(mockProvider as any);

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'P1' }),
      );
    });

    it('should dispatch clearSelection when navigateBack is called', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.navigateBack();

      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });

  describe('handleNativeClick (Breadcrumb/Navigation Logic)', () => {
    it('should reset the flow when clicking the "Paybill" text', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = { target: { textContent: 'Paybill' } } as any;

      component.handleNativeClick(mockEvent);

      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });

    it('should trigger category re-selection when clicking the category name while a provider is active', () => {
      store.overrideSelector(
        fromSelectors.selectActiveCategory,
        mockCategory as any,
      );
      store.overrideSelector(
        fromSelectors.selectActiveProvider,
        mockProvider as any,
      );
      store.refreshState();

      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = { target: { textContent: 'Utilities' } } as any;

      component.handleNativeClick(mockEvent);

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'UTIL' }),
      );
    });

    it('should not dispatch if the text matches category name but no provider is selected', () => {
      store.overrideSelector(
        fromSelectors.selectActiveCategory,
        mockCategory as any,
      );
      store.overrideSelector(fromSelectors.selectActiveProvider, null);
      store.refreshState();

      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = { target: { textContent: 'Utilities' } } as any;

      component.handleNativeClick(mockEvent);
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
