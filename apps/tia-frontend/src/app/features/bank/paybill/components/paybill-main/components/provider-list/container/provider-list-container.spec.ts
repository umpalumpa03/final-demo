import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Output, Input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProviderListContainer } from './provider-list-container';
import { ProviderList } from '../components/provider-list-items/provider-list';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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

  beforeEach(async () => {
    mockFacade = {
      isFormView: signal(false),
      activeCategory: signal({
        description: 'Test Category',
        providers: [
          { id: '1', name: 'Final Provider', isFinal: true },
          { id: '2', name: 'Parent Provider', isFinal: false },
        ],
      }),
      activeCategoryUI: signal({ iconBgColor: '#fff', iconBgPath: 'icon.svg' }),
      providerListHeader: signal('Select Provider'),
      filteredProviders: signal([]),
      isRootProviderView: signal(true),
      isLoading: signal(false),
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
      providers: [{ provide: PaybillMainFacade, useValue: mockFacade }],
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
});
