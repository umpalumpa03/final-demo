import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CardOtpModal } from './card-otp-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  requestCardOtp,
  verifyCardOtp,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import * as CardsSelectors from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('CardOtpModal', () => {
  let component: CardOtpModal;
  let fixture: ComponentFixture<CardOtpModal>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOtpModal, TranslateModule.forRoot()],
      providers: [provideRouter([]), provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    store.overrideSelector(CardsSelectors.selectChallengeId, 'ch-123');
    store.overrideSelector(CardsSelectors.selectOtpLoading, false);
    store.overrideSelector(CardsSelectors.selectOtpError, null);
    store.overrideSelector(CardsSelectors.selectOtpRemainingAttempts, 3);

    fixture = TestBed.createComponent(CardOtpModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('cardId', 'card-1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed event', () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.handleClose();
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch verifyCardOtp action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleVerifyOtp('1111');

    expect(dispatchSpy).toHaveBeenCalledWith(
      verifyCardOtp({ challengeId: 'ch-123', code: '1111', cardId: 'card-1' }),
    );
  });

  it('should dispatch requestCardOtp on handleResendOtp', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleResendOtp();
    expect(dispatchSpy).toHaveBeenCalledWith(
      requestCardOtp({ cardId: 'card-1' }),
    );
  });

  it('should dispatch requestCardOtp on handleRequestOtp', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.handleRequestOtp();
    expect(dispatchSpy).toHaveBeenCalledWith(
      requestCardOtp({ cardId: 'card-1' }),
    );
  });
});
