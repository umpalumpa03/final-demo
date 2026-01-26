import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import { PaybillEffects } from './paybill.effects';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';
import { PaybillCategory } from '../models/paybill.model';

describe('PaybillEffects', () => {
  let actions$: Observable<Action>;
  let effects: PaybillEffects;
  let serviceMock: { getCategories: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    serviceMock = {
      getCategories: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PaybillEffects,
        provideMockActions(() => actions$),
        { provide: PaybillService, useValue: serviceMock },
      ],
    });

    effects = TestBed.inject(PaybillEffects);
  });

  it('should dispatch loadCategoriesSuccess on successful API call', () => {
    const categories: PaybillCategory[] = [
      { id: '1', label: 'Test', icon: '', providers: [] },
    ];
    serviceMock.getCategories.mockReturnValue(of(categories));

    actions$ = of(PaybillActions.loadCategories());

    effects.loadCategories$.subscribe((action) => {
      expect(action).toEqual(
        PaybillActions.loadCategoriesSuccess({ categories }),
      );
    });
  });

  it('should dispatch loadCategoriesFailure on API error', () => {
    const errorResponse = new Error('Unauthorized');
    serviceMock.getCategories.mockReturnValue(throwError(() => errorResponse));

    actions$ = of(PaybillActions.loadCategories());

    effects.loadCategories$.subscribe((action) => {
      expect(action).toEqual(
        PaybillActions.loadCategoriesFailure({ error: 'Unauthorized' }),
      );
    });
  });
});
