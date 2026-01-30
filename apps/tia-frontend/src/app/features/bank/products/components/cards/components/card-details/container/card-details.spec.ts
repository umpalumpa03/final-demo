import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CardDetails } from './card-details';
import { loadCardDetails, loadCardAccounts } from '../../../../../../../../store/products/cards/cards.actions';
import {
  selectCardDetails,
  selectCardImages,
  selectCardDetailsLoading,
  selectCardDetailsError,
} from '../../../../../../../../store/products/cards/cards.selectors';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';

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

  const mockAccount: CardAccount = {
    id: 'acc1',
    iban: 'GE29TIA7890123456789012',
    name: 'Main GEL Account',
    balance: 4500000,
    currency: 'GEL',
    status: 'active',
    cardIds: ['card1'],
    openedAt: '2026-01-18T01:10:50.948Z',
  };

  const setupStore = (
    details: Record<string, CardDetail> = { card1: mockCardDetail },
    images: Record<string, string> = { card1: 'data:image/svg+xml;base64,test1' },
    loading = false,
    error: string | null = null,
    account: CardAccount | undefined = mockAccount
  ) => {
    mockStore.select.mockImplementation((selector: unknown) => {
      if (selector === selectCardDetails) return of(details);
      if (selector === selectCardImages) return of(images);
      if (selector === selectCardDetailsLoading) return of(loading);
      if (selector === selectCardDetailsError) return of(error);
      if (typeof selector === 'function') return of(account);
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
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
      ],
    }).compileComponents();

    setupStore();
    fixture = TestBed.createComponent(CardDetails);
    component = fixture.componentInstance;
  });

  it('should create and dispatch actions on init', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardAccounts());
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadCardDetails({ cardId: mockCardId }));
  });

  it('should update signals from store', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['cardDetails']()).toEqual({ card1: mockCardDetail });
    expect(component['cardImages']()).toEqual({ card1: 'data:image/svg+xml;base64,test1' });
    expect(component['account']()).toEqual(mockAccount);
  });

  describe('computed signals', () => {
    it('should compute cardData correctly', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const cardData = component['cardData']();
      expect(cardData?.cardId).toBe(mockCardId);
      expect(cardData?.details).toEqual(mockCardDetail);
      expect(cardData?.account).toEqual(mockAccount);
    });

    it('should return null cardData when details missing', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({}, { card1: 'image' });
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance['cardData']()).toBeNull();
    });

    it('should return null cardData when image missing', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: mockCardDetail }, {});
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance['cardData']()).toBeNull();
    });

    it('should compute currency', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component['currency']()).toBe('GEL');
    });
it('should return N/A for currency when no account', async () => {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [CardDetails],
    providers: [
      { provide: Store, useValue: mockStore },
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
    ],
  }).compileComponents();

  setupStore({ card1: mockCardDetail }, { card1: 'image' }, false, null, undefined);
  fixture = TestBed.createComponent(CardDetails);
  component = fixture.componentInstance;
  
  component['account'].set(undefined);
  
  fixture.detectChanges();
  await fixture.whenStable();
  expect(component['currency']()).toBe('N/A');
});


    it('should compute formattedBalance', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component['formattedBalance']()).toBe('GEL 4,500,000');
    });

 it('should return N/A for formattedBalance when no account', async () => {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [CardDetails],
    providers: [
      { provide: Store, useValue: mockStore },
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
    ],
  }).compileComponents();

  setupStore({ card1: mockCardDetail }, { card1: 'image' }, false, null, undefined);
  fixture = TestBed.createComponent(CardDetails);
  component = fixture.componentInstance;
  
  component['account'].set(undefined);
  
  fixture.detectChanges();
  await fixture.whenStable();
  expect(component['formattedBalance']()).toBe('N/A');
});

    it('should compute formattedCreditLimit for credit card', async () => {
      const creditCard: CardDetail = { ...mockCardDetail, type: 'CREDIT', creditLimit: 10000 };
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: creditCard }, { card1: 'image' });
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance['formattedCreditLimit']()).toBe('GEL 10,000');
    });

   it('should return N/A for formattedCreditLimit when no account', async () => {
  const creditCard: CardDetail = { ...mockCardDetail, type: 'CREDIT', creditLimit: 10000 };
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [CardDetails],
    providers: [
      { provide: Store, useValue: mockStore },
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
    ],
  }).compileComponents();

  setupStore({ card1: creditCard }, { card1: 'image' }, false, null, undefined);
  fixture = TestBed.createComponent(CardDetails);
  component = fixture.componentInstance;
  
  component['account'].set(undefined);
  
  fixture.detectChanges();
  await fixture.whenStable();
  expect(component['formattedCreditLimit']()).toBe('N/A');
});

    it('should return N/A for formattedCreditLimit when no credit limit', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component['formattedCreditLimit']()).toBe('N/A');
    });

    it('should compute shouldShowCreditLimit as true for credit card', async () => {
      const creditCard: CardDetail = { ...mockCardDetail, type: 'CREDIT', creditLimit: 10000 };
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: creditCard }, { card1: 'image' });
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance['shouldShowCreditLimit']()).toBe(true);
    });

    it('should compute shouldShowCreditLimit as false for debit card', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component['shouldShowCreditLimit']()).toBe(false);
    });

    it('should compute isActiveStatus as true for ACTIVE status', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component['isActiveStatus']()).toBe(true);
    });

    it('should compute isActiveStatus as false for non-ACTIVE status', async () => {
      const blockedCard: CardDetail = { ...mockCardDetail, status: 'BLOCKED' };
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: blockedCard }, { card1: 'image' });
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.componentInstance['isActiveStatus']()).toBe(false);
    });
  });

  describe('navigation methods', () => {
    it('should navigate back', () => {
      component['handleBack']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards']);
    });

    it('should navigate to internal transfers', () => {
      component['handleTransferOwn']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/internal']);
    });

    it('should navigate to external transfers', () => {
      component['handleTransferExternal']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/transfers/external']);
    });

    it('should navigate to paybill', () => {
      component['handlePaybill']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill']);
    });

    it('should navigate to transactions', () => {
      component['handleViewTransactions']();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/cards/transactions', mockCardId]);
    });
  });

  describe('template', () => {
    it('should display loading state', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: mockCardDetail }, { card1: 'image' }, true);
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('.card-details__loading')).toBeTruthy();
    });

    it('should display error state', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [CardDetails],
        providers: [
          { provide: Store, useValue: mockStore },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: vi.fn().mockReturnValue(mockCardId) } } } },
        ],
      }).compileComponents();

      setupStore({ card1: mockCardDetail }, { card1: 'image' }, false, 'Failed');
      fixture = TestBed.createComponent(CardDetails);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fixture.nativeElement.textContent).toContain('Failed');
    });

    it('should display card details', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Main Visa');
      expect(text).toContain('DEBIT');
      expect(text).toContain('GEL');
    });

    it('should call navigation methods on button clicks', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const backSpy = vi.spyOn(component as any, 'handleBack');
      const transferOwnSpy = vi.spyOn(component as any, 'handleTransferOwn');
      
      fixture.nativeElement.querySelector('.card-details__back-button')?.click();
      expect(backSpy).toHaveBeenCalled();

      const buttons = fixture.nativeElement.querySelectorAll('.card-details__action-button');
      buttons[0]?.click();
      expect(transferOwnSpy).toHaveBeenCalled();
    });
  });
});