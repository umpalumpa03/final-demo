import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersInternal } from './transfers-internal';
import { Router } from '@angular/router';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TransfersInternal', () => {
  let component: TransfersInternal;
  let fixture: ComponentFixture<TransfersInternal>;
  let mockRouter: any;
  let transferStore: any;
  let transfersApiMock: any;

  beforeEach(async () => {
    mockRouter = {
      url: '/bank/transfers/internal/from-account',
      events: of(),
    };

    transfersApiMock = {
      lookupByPhone: vi.fn(),
      lookupByIban: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TransfersInternal, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        TransferStore,
        { provide: TransfersApiService, useValue: transfersApiMock },
      ],
    }).compileComponents();

    transferStore = TestBed.inject(TransferStore);

    fixture = TestBed.createComponent(TransfersInternal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('steps', () => {
    it('should have correct steps configuration', () => {
      const steps = component.steps();
      expect(steps).toHaveLength(3);
      expect(steps[0].key).toBe('from-account');
      expect(steps[1].key).toBe('to-account');
      expect(steps[2].key).toBe('amount');
    });

    it('should have 3 steps', () => {
      expect(component.steps().length).toBe(3);
    });
  });

  describe('currentStep', () => {
    it('should return 1 for from-account route', () => {
      mockRouter.url = '/bank/transfers/internal/from-account';
      expect(component.currentStep).toBe(1);
    });

    it('should return 2 for to-account route', () => {
      mockRouter.url = '/bank/transfers/internal/to-account';
      expect(component.currentStep).toBe(2);
    });

    it('should return 3 for amount route', () => {
      mockRouter.url = '/bank/transfers/internal/amount';
      expect(component.currentStep).toBe(3);
    });

    it('should return 1 as default for unknown route', () => {
      mockRouter.url = '/bank/transfers/internal';
      expect(component.currentStep).toBe(1);
    });

    it('should return 1 for completely different route', () => {
      mockRouter.url = '/some/other/route';
      expect(component.currentStep).toBe(1);
    });

    it('should handle route with from-account in path', () => {
      mockRouter.url = '/bank/transfers/internal/from-account/details';
      expect(component.currentStep).toBe(1);
    });

    it('should handle route with to-account in path', () => {
      mockRouter.url = '/bank/transfers/internal/to-account/select';
      expect(component.currentStep).toBe(2);
    });

    it('should handle route with amount in path', () => {
      mockRouter.url = '/bank/transfers/internal/amount/confirm';
      expect(component.currentStep).toBe(3);
    });
  });
});
