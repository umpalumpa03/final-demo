import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  provideRouter,
  Router,
  NavigationEnd,
  Event as RouterEvent,
} from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillActions } from '../store/paybill.actions';
import * as fromSelectors from '../store/paybill.selectors';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { initialPaybillState } from '../store/paybill.state';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;
  let store: MockStore;
  let router: Router;
  let routerEventsSubject: Subject<RouterEvent>;

  beforeEach(async () => {
    routerEventsSubject = new Subject<RouterEvent>();

    await TestBed.configureTestingModule({
      imports: [PaybillContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          initialState: { paybill: initialPaybillState },
          selectors: [
            { selector: fromSelectors.selectPaybillBreadcrumbs, value: [] },
            {
              selector: fromSelectors.selectCategories,
              value: [{ id: 'WATER', name: 'Water' }],
            },
          ],
        }),
        provideRouter([]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    vi.spyOn(router, 'events', 'get').mockReturnValue(routerEventsSubject);
    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;
  });

  describe('handleNativeClick Logic', () => {
    it('should dispatch clearSelection when clicking "Paybill" text', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const mockEvent = {
        target: { textContent: '  Paybill  ' },
      } as unknown as MouseEvent;
      component.handleNativeClick(mockEvent);
      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });

  });

  describe('Route Signal Sync', () => {
    it('should dispatch TEMPLATES selection on template route', () => {
      const spy = vi.spyOn(store, 'dispatch');
      vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/paybill/templates');

      routerEventsSubject.next(
        new NavigationEnd(
          1,
          '/bank/paybill/templates',
          '/bank/paybill/templates',
        ),
      );
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'TEMPLATES' }),
      );
    });

    it('should clear selection on base pay route', () => {
      const spy = vi.spyOn(store, 'dispatch');
      vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/paybill/pay');

      routerEventsSubject.next(
        new NavigationEnd(1, '/bank/paybill/pay', '/bank/paybill/pay'),
      );
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
    });
  });

  it('should dispatch loadCategories on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(PaybillActions.loadCategories());
  });

  it('should dispatch actions for provider select and back navigation', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.handleProviderSelect({ id: 'P1' } as any);
    expect(spy).toHaveBeenCalledWith(
      PaybillActions.selectProvider({ providerId: 'P1' }),
    );

    component.navigateBack();
    expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
  });
});
