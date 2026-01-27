import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { loadCategories } from './paybill.effects';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';

describe('PaybillEffects', () => {
  let actions$: Observable<Action>;
  let serviceMock: { getCategories: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    serviceMock = {
      getCategories: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        { provide: PaybillService, useValue: serviceMock },
      ],
    });
  });

  it('should dispatch loadCategoriesSuccess on successful API call', () => {
    TestBed.runInInjectionContext(() => {
      const categories = [{ id: '1', name: 'Test', icon: '', providers: [] }];
      serviceMock.getCategories.mockReturnValue(of(categories));

      actions$ = of(PaybillActions.loadCategories());

      loadCategories().subscribe((action: Action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesSuccess({ categories }),
        );
        expect(serviceMock.getCategories).toHaveBeenCalled();
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
