import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountCards } from './account-cards';
import { loadAccountCardsPage } from '../../../../../../../../store/products/cards/cards.actions';
import { TranslateModule } from '@ngx-translate/core';

describe('AccountCards', () => {
  let component: AccountCards;
  let store: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    store = {
      select: vi.fn(() => of([])),
      dispatch: vi.fn(),
    };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AccountCards, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: store },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => 'acc-1' } } },
        },
      ],
    });

    const fixture = TestBed.createComponent(AccountCards);
    component = fixture.componentInstance;
  });

  it('should dispatch loadAccountCardsPage on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadAccountCardsPage({ accountId: 'acc-1' }));
  });

  it('should navigate to card details', () => {
    component.handleCardClick('card-1');
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/details', 'card-1']);
  });

  it('should navigate back to list', () => {
    component.handleBackClick();
    expect(router.navigate).toHaveBeenCalledWith(['/bank/products/cards/list']);
  });

  it('should retry loading on error', () => {
    component.handleRetry();
    expect(store.dispatch).toHaveBeenCalledWith(loadAccountCardsPage({ accountId: 'acc-1' }));
  });
});