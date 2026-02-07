import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderListContainer } from './provider-list-container';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProviderListContainer', () => {
  let component: ProviderListContainer;
  let fixture: ComponentFixture<ProviderListContainer>;
  let store: MockStore;
  let router: Router;

  const mockFacade = {
    searchQuery: signal(''),
    selectedParentId: signal<string | null>(null),
    activeCategory: signal({
      name: 'Utilities',
      id: 'util',
      providers: [
        { id: '1', name: 'Gas Provider', isFinal: true, parentId: null },
        { id: '2', name: 'Water Group', isFinal: false, parentId: null },
        { id: '3', name: 'Sub Water', isFinal: true, parentId: '2' },
      ],
    }),
    isLoading: signal(false),
    isFormView: signal(false),
    showSearch: signal(true),
    activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: 'icon.svg' }),
    isRootProviderView: signal(true),
    resetPaymentForm: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderListContainer],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
            navigateByUrl: vi.fn(),
            url: '/bank/paybill/pay/util',
          },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {} },
        },
        provideMockStore(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProviderListContainer);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Computed Signal Reactivity', () => {
    it('should filter providers based on search query', () => {
      mockFacade.searchQuery.set('gas');

      const filtered = component.filteredProviders();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Gas Provider');
    });

    it('should resolve providerListHeader title dynamically', () => {
      const header = component.providerListHeader();
      expect(header).toBeDefined();
    });
  });

  describe('Navigation and Actions', () => {
    it('should handle FINAL provider: reset form, dispatch actions, and navigate relatively', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      component.onProviderSelected('1');

      expect(mockFacade.resetPaymentForm).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: '1' }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.loadPaymentDetails({ serviceId: '1' }),
      );

      expect(router.navigate).toHaveBeenCalledWith(
        ['1'],
        expect.objectContaining({ relativeTo: expect.anything() }),
      );
    });

    it('should handle GROUP provider: navigateByUrl to hierarchical path', () => {
      component.onProviderSelected('2');

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/bank/paybill/pay/util/2',
      );
    });

    it('should return early if the provider ID is invalid', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      component.onProviderSelected('ghost-id');
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Internal Utilities', () => {
    it('selectParentId should strip query parameters from the base URL', () => {
      (router as any).url = '/bank/paybill/pay/util?search=gas';

      component.selectParentId('99');

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        '/bank/paybill/pay/util/99',
      );
    });
  });
});
