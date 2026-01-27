import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { loadCategories, loadProviders } from './paybill.effects';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';

describe('PaybillEffects', () => {
  let actions$: Observable<Action>;
  let serviceMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getProviders: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    serviceMock = {
      getCategories: vi.fn(),
      getProviders: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: PaybillService, useValue: serviceMock },
      ],
    });
  });

  describe('loadCategories', () => {
    it('should dispatch loadCategoriesSuccess on successful API call', () => {
      TestBed.runInInjectionContext(() => {
        const categories = [
          {
            id: '1',
            name: 'Test',
            icon: '',
            description: 'Test description',
            providers: [],
            servicesQuantity: 0,
          },
        ];
        serviceMock.getCategories.mockReturnValue(of(categories));

        actions$ = of(PaybillActions.loadCategories());

        loadCategories().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadCategoriesSuccess({ categories }),
          );
        });
      });
    });

    it('should dispatch loadCategoriesFailure on API error', () => {
      TestBed.runInInjectionContext(() => {
        const errorResponse = new Error('Unauthorized');
        serviceMock.getCategories.mockReturnValue(
          throwError(() => errorResponse),
        );

        actions$ = of(PaybillActions.loadCategories());

        loadCategories().subscribe((action: Action) => {
          expect(action).toEqual(
            PaybillActions.loadCategoriesFailure({ error: 'Unauthorized' }),
          );
        });
      });
    });
  });

  describe('loadProviders', () => {
    it('should dispatch loadProvidersSuccess on successful API call', () => {
      TestBed.runInInjectionContext(() => {
        const providers = [
          { serviceId: 'p1', serviceName: 'P1', category: 'utilities' },
        ];

        serviceMock.getProviders.mockReturnValue(of(providers));

        actions$ = of(
          PaybillActions.selectCategory({ categoryId: 'utilities' }),
        );

        loadProviders().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadProvidersSuccess({ providers }),
          );
          expect(serviceMock.getProviders).toHaveBeenCalledWith('utilities');
        });
      });
    });

    it('should dispatch loadProvidersFailure on API error', () => {
      TestBed.runInInjectionContext(() => {
        const errorResponse = new Error('Network Error');
        serviceMock.getProviders.mockReturnValue(
          throwError(() => errorResponse),
        );

        actions$ = of(
          PaybillActions.selectCategory({ categoryId: 'utilities' }),
        );

        loadProviders().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadProvidersFailure({ error: 'Network Error' }),
          );
        });
      });
    });
  });
});
