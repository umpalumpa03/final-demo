import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProviderListContainer } from './provider-list-container';
import { ProviderList } from '../components/provider-list-items/provider-list';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Store } from '@ngrx/store';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-provider-list',
  template: '',
  standalone: true,
  inputs: [
    'headerTitle',
    'providers',
    'iconBgColor',
    'iconBgPath',
    'subtitle',
    'isRoot',
    'isLoading',
  ],
})
class MockProviderListComponent {
  @Output() selected = new EventEmitter<string>();
}

@Component({
  selector: 'router-outlet',
  template: '',
  standalone: true,
})
class MockRouterOutlet {}

describe('ProviderListContainer', () => {
  let component: ProviderListContainer;
  let fixture: ComponentFixture<ProviderListContainer>;
  let mockFacade: any;
  let mockStore: { dispatch: any };
  let mockRouter: any;

  beforeEach(async () => {
    mockStore = {
      dispatch: vi.fn(),
    };

    mockRouter = {
      navigateByUrl: vi.fn(),
      url: '/bank/paybill/pay',
      events: new Subject(),
    };

    mockFacade = {
      searchQuery: signal(''),
      selectedParentId: signal(null),
      activeCategory: signal({
        name: 'Test Category',
        id: 'util',
        providers: [
          { id: '1', name: 'Final Provider', isFinal: true },
          { id: '2', name: 'Parent Provider', isFinal: false },
        ],
      }),

      isFormView: signal(false),
      activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: 'icon.svg' }),
      isLoading: signal(false),
      isRootProviderView: signal(true),
      activeProvider: signal(null),
      verifiedDetails: signal(null),

      resetPaymentForm: vi.fn(),
      selectProvider: vi.fn(),
      selectParentId: vi.fn(),
      verifyAccount: vi.fn(),
      proceedToPayment: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProviderListContainer],
      providers: [
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    })
      .overrideComponent(ProviderListContainer, {
        remove: { imports: [ProviderList, RouterOutlet] },
        add: { imports: [MockProviderListComponent, MockRouterOutlet] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProviderListContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Internal Computed Signals', () => {
    it('should filter providers when searching', () => {
      mockFacade.searchQuery.set('final');
      fixture.detectChanges();

      const filtered = component.filteredProviders();
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered[0].name).toBe('Final Provider');
    });

    it('should resolve providerListHeader via internal computed', () => {
      expect(component.providerListHeader()).toBeDefined();
    });
  });

  describe('Provider Selection Logic', () => {
    it('should select provider and load details for FINAL providers', () => {
      component.onProviderSelected('1');

      expect(mockFacade.resetPaymentForm).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: '1' }),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.loadPaymentDetails({ serviceId: '1' }),
      );
    });

    it('should navigate to child level for GROUP providers', () => {
      component.onProviderSelected('2');

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        '/bank/paybill/pay/2',
      );
    });

    it('should return early if provider is not found', () => {
      component.onProviderSelected('unknown');
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });
});
