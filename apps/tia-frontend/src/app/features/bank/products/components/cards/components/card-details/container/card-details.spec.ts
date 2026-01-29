import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CardDetails } from './card-details';
import { loadCardDetails } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';

describe('CardDetails', () => {
  let component: CardDetails;
  let fixture: ComponentFixture<CardDetails>;
  let mockStore: { select: ReturnType<typeof vi.fn>; dispatch: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  const mockCardId = 'card1';
  const mockCardDetail: CardDetail = {
    id: 'card1',
    accountId: 'acc1',
    type: 'DEBIT',
    network: 'VISA',
    design: 'MIDNIGHT_GRADIENT',
    cardName: 'Main Visa',
    status: 'ACTIVE',
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockCardDetails: Record<string, CardDetail> = { card1: mockCardDetail };
  const mockCardImages: Record<string, string> = { card1: 'data:image/svg+xml;base64,test1' };

  const setupStore = (
    details = mockCardDetails,
    images = mockCardImages,
    loading = false,
    error: string | null = null
  ) => {
    mockStore.select.mockImplementation((selector: unknown) => {
      if (selector === selectCardDetails) return of(details);
      if (selector === selectCardImages) return of(images);
      if (selector === selectCardDetailsLoading) return of(loading);
      if (selector === selectCardDetailsError) return of(error);
      return of(null);
    });
  };

  beforeEach(async () => {
    mockStore = { select: vi.fn(), dispatch: vi.fn() };
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CardDetails],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } },
        },
      ],
    }).compileComponents();

    setupStore();
    fixture = TestBed.createComponent(CardDetails);
    component = fixture.componentInstance;
  });

  it('should create and dispatch loadCardDetails', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: mockCardId }));
  });

  it('should set signals correctly', async () => {
    setupStore(mockCardDetails, mockCardImages, true, 'Error');
    fixture = TestBed.createComponent(CardDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['loading']()).toBe(true);
    expect(component['error']()).toBe('Error');
  });

  it('should compute cardData with details and image', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const cardData = component['cardData']();
    expect(cardData?.cardId).toBe(mockCardId);
    expect(cardData?.details).toEqual(mockCardDetail);
    expect(cardData?.imageBase64).toBe(mockCardImages['card1']);
  });

  it('should return null cardData when details or image missing', async () => {
    setupStore({}, mockCardImages);
    fixture = TestBed.createComponent(CardDetails);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance['cardData']()).toBeNull();

    setupStore(mockCardDetails, {});
    fixture = TestBed.createComponent(CardDetails);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance['cardData']()).toBeNull();
  });

  it('should navigate back on handleBack', () => {
    component['handleBack']();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards']);
  });

  describe('template', () => {
    const getElement = (selector: string) => fixture.nativeElement.querySelector(selector);

    it('should display loading and error states', async () => {
      setupStore(mockCardDetails, mockCardImages, true);
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getElement('.card-details__loading')?.textContent).toContain('Loading');

      setupStore(mockCardDetails, mockCardImages, false, 'Failed');
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(getElement('.card-details__error')?.textContent).toContain('Failed');
    });

    it('should display card data and actions', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(getElement('.card-details__image')?.getAttribute('src')).toBe(mockCardImages['card1']);
      expect(fixture.nativeElement.textContent).toContain(mockCardDetail.cardName);
      expect(fixture.nativeElement.textContent).toContain(mockCardDetail.type);
      expect(fixture.nativeElement.querySelectorAll('.card-details__action-button').length).toBe(5);
    });

    it('should display credit limit for credit cards', async () => {
      const creditCard: CardDetail = { ...mockCardDetail, type: 'CREDIT', creditLimit: 10000 };
      setupStore({ card1: creditCard }, mockCardImages);
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Credit Limit');
    });

    it('should trigger handleBack on back button click', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      
      const spy = vi.spyOn(component as any, 'handleBack');
      getElement('.card-details__back-button')?.click();
      expect(spy).toHaveBeenCalled();
    });
  });
});