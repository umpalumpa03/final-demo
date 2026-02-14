import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TransfersExternal } from './transfers-external';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, Pipe, PipeTransform } from '@angular/core';
import { StepperHeader } from 'apps/tia-frontend/src/app/features/storybook/components/forms/multistep-form/stepper-header/stepper-header';
import { TransferStore } from '../../../store/transfers.store';

@Component({
  selector: 'app-stepper-header',
  template: '',
  standalone: true,
})
class MockStepperHeader {}

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('TransfersExternal', () => {
  let mockRouter: { url: string };
  let mockTranslateService: any;
  let mockTransferStore: any;

  beforeEach(() => {
    mockRouter = { url: '/' };
    mockTranslateService = {
      instant: vi.fn((key: string) => key),
    };
    mockTransferStore = {
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TransfersExternal],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: TransferStore, useValue: mockTransferStore },
      ],
    }).overrideComponent(TransfersExternal, {
      remove: { imports: [StepperHeader, TranslatePipe] },
      add: { imports: [MockStepperHeader, MockTranslatePipe] },
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TransfersExternal);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have steps array with 3 steps using translated labels', () => {
    const fixture = TestBed.createComponent(TransfersExternal);
    const steps = fixture.componentInstance.steps();

    expect(steps.length).toBe(3);
    expect(steps[0].key).toBe('recipient');
    expect(mockTranslateService.instant).toHaveBeenCalledWith(
      'transfers.external.stepper.recipient',
    );
  });

  it('should return step 1 when url includes recipient', () => {
    mockRouter.url = '/transfers/external/recipient';
    const fixture = TestBed.createComponent(TransfersExternal);
    expect(fixture.componentInstance.currentStep).toBe(1);
  });

  it('should return step 2 when url includes accounts', () => {
    mockRouter.url = '/transfers/external/accounts';
    const fixture = TestBed.createComponent(TransfersExternal);
    expect(fixture.componentInstance.currentStep).toBe(2);
  });

  it('should return step 3 when url includes amount', () => {
    mockRouter.url = '/transfers/external/amount';
    const fixture = TestBed.createComponent(TransfersExternal);
    expect(fixture.componentInstance.currentStep).toBe(3);
  });

  it('should return step 1 as default when url has no matching segment', () => {
    mockRouter.url = '/transfers/external';
    const fixture = TestBed.createComponent(TransfersExternal);
    expect(fixture.componentInstance.currentStep).toBe(1);
  });

  it('should call transferStore.reset on destroy', () => {
    const fixture = TestBed.createComponent(TransfersExternal);
    fixture.destroy();
    expect(mockTransferStore.reset).toHaveBeenCalled();
  });
});
