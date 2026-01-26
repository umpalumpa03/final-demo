import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter, Router, NavigationEnd, Event } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillActions } from '../store/paybill.actions';
import * as fromSelectors from '../store/paybill.selectors';
import { Subject } from 'rxjs';
import { PaybillCategory, PaybillProvider } from '../models/paybill.model';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;
  let store: MockStore;
  let router: Router;
  const routerEvents = new Subject<Event>();

  const mockCategory: PaybillCategory = {
    id: 'c1',
    label: 'Utilities',
    icon: 'icon-path',
    providers: [{ id: 'p1', name: 'Water Co' }],
  };

  const mockProvider: PaybillProvider = {
    id: 'p1',
    name: 'Water Co',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillContainer],
      providers: [provideMockStore(), provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);

    Object.defineProperty(router, 'events', {
      value: routerEvents.asObservable(),
    });
    Object.defineProperty(router, 'url', {
      value: '/bank/paybill',
      writable: true,
    });

    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;
  });

  it('should dispatch loadCategories on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(PaybillActions.loadCategories());
  });

  describe('Breadcrumbs Branch Coverage', () => {
    it('should show category and provider breadcrumbs when both are selected', () => {
      store.overrideSelector(fromSelectors.selectActiveCategory, mockCategory);
      store.overrideSelector(fromSelectors.selectActiveProvider, mockProvider);
      store.refreshState();

      fixture.detectChanges();
      const crumbs = component.breadcrumbs();

      expect(crumbs.length).toBe(3);
      expect(crumbs[1].label).toBe('Utilities');
      expect(crumbs[2].label).toBe('Water Co');
    });

    it('should show only category breadcrumb when no provider is selected', () => {
      store.overrideSelector(fromSelectors.selectActiveCategory, mockCategory);
      store.overrideSelector(fromSelectors.selectActiveProvider, null);
      store.refreshState();

      fixture.detectChanges();
      const crumbs = component.breadcrumbs();

      expect(crumbs.length).toBe(2);
      expect(crumbs[1].label).toBe('Utilities');
    });
  });

  describe('User Interaction Methods', () => {
    it('should dispatch selectCategory action on handleCategorySelect', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleCategorySelect(mockCategory);
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'c1' }),
      );
    });

    it('should dispatch selectProvider action on handleProviderSelect', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.handleProviderSelect(mockProvider);
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'p1' }),
      );
    });

    it('should dispatch clearSelection action on navigateBack', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.navigateBack();
      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });

  it('should react to route changes for template breadcrumbs', () => {
    (router as { url: string }).url = '/bank/paybill/templates';
    routerEvents.next(
      new NavigationEnd(
        1,
        '/bank/paybill/templates',
        '/bank/paybill/templates',
      ),
    );

    fixture.detectChanges();
    const crumbs = component.breadcrumbs();
    expect(crumbs.some((c) => c.label === 'Templates')).toBe(true);
  });
});
