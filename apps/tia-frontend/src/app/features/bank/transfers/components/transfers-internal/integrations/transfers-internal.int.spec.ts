import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { TransfersInternal } from '../container/transfers-internal';
import { TransferStore } from '../../../store/transfers.store';
import { TransfersApiService } from '../../../services/transfersApi.service';
import { TranslateModule } from '@ngx-translate/core';

describe('TransfersInternal Integration', () => {
  let component: TransfersInternal;
  let fixture: ComponentFixture<TransfersInternal>;
  let mockRouter: { url: string; navigate: ReturnType<typeof vi.fn>; events: ReturnType<typeof of> };
  let transferStore: InstanceType<typeof TransferStore>;

  beforeEach(async () => {
    mockRouter = {
      url: '/bank/transfers/internal/from-account',
      navigate: vi.fn(),
      events: of(),
    };

    await TestBed.configureTestingModule({
      imports: [TransfersInternal, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        TransferStore,
        {
          provide: TransfersApiService,
          useValue: { lookupByPhone: vi.fn(), lookupByIban: vi.fn() },
        },
      ],
    }).compileComponents();

    transferStore = TestBed.inject(TransferStore);
    fixture = TestBed.createComponent(TransfersInternal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with title and description', () => {
    const header = fixture.debugElement.query(By.css('.internal-transfer__header'));
    expect(header).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('transfers.internal.intTitle');
    expect(fixture.nativeElement.textContent).toContain('transfers.internal.intDescription');
  });

  it('should render stepper with 3 steps', () => {
    const steps = component.steps();
    expect(steps).toHaveLength(3);
    expect(steps[0].key).toBe('from-account');
    expect(steps[1].key).toBe('to-account');
    expect(steps[2].key).toBe('amount');
  });

  it('should resolve currentStep from router url', () => {
    expect(component.currentStep).toBe(1);

    mockRouter.url = '/bank/transfers/internal/to-account';
    expect(component.currentStep).toBe(2);

    mockRouter.url = '/bank/transfers/internal/amount';
    expect(component.currentStep).toBe(3);

    mockRouter.url = '/bank/transfers/internal';
    expect(component.currentStep).toBe(1);
  });

  it('should render router-outlet for step content', () => {
    expect(fixture.debugElement.query(By.css('router-outlet'))).toBeTruthy();
  });

  it('should call transferStore.reset on ngOnDestroy', () => {
    const resetSpy = vi.spyOn(transferStore, 'reset');
    fixture.destroy();
    expect(resetSpy).toHaveBeenCalled();
  });
});
