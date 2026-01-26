import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter, Router, NavigationEnd, Event } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillActions } from '../store/paybill.actions';
import { Subject } from 'rxjs';
import { PaybillCategory } from '../models/paybill.model';

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
    providers: [],
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

  it('should update active breadcrumbs based on route', () => {
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

  it('should dispatch selectCategory action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleCategorySelect(mockCategory);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaybillActions.selectCategory({ categoryId: mockCategory.id }),
    );
  });
});
