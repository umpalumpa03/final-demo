import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAmount } from './external-amount';
import { TransfersApiService } from '../../../../services/transfersApi.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

describe('ExternalAmount (vitest)', () => {
  let component: ExternalAmount;
  let fixture: ComponentFixture<ExternalAmount>;
  let transfersApiMock: any;

  beforeEach(async () => {
    transfersApiMock = {
      getFee: vi.fn().mockReturnValue(of({ fee: 0 })),
    };

    await TestBed.configureTestingModule({
      imports: [ExternalAmount],
      providers: [{ provide: TransfersApiService, useValue: transfersApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAmount);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getFee on ngOnInit with hardcoded values', () => {
    const testAccountId = 'a1000001-0001-4000-8000-000000000001';
    const testAmount = 100;

    fixture.detectChanges();

    expect(transfersApiMock.getFee).toHaveBeenCalledWith(
      testAccountId,
      testAmount,
    );
  });

  it('should handle getFee success response', () => {
    const response = { fee: 5 };
    transfersApiMock.getFee.mockReturnValue(of(response));

    fixture.detectChanges();

    expect(transfersApiMock.getFee).toHaveBeenCalled();
  });

  it('should handle getFee error response', () => {
    transfersApiMock.getFee.mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    fixture.detectChanges();

    expect(transfersApiMock.getFee).toHaveBeenCalled();
  });
});
