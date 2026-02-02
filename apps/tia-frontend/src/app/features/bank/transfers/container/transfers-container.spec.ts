import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TransfersContainer } from './transfers-container';
import { TranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { TransferStore } from '../store/transfers.store';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('TransfersContainer', () => {
  let component: TransfersContainer;
  let fixture: ComponentFixture<TransfersContainer>;
  let mockTransferStore: any;

  beforeEach(() => {
    mockTransferStore = {
      reset: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TransfersContainer],
      providers: [
        provideRouter([]),
        {
          provide: TranslateService,
          useValue: {
            instant: vi.fn((key: string) => key),
            get: vi.fn().mockReturnValue(signal('')),
          },
        },
        { provide: TransferStore, useValue: mockTransferStore },
      ],
    });

    fixture = TestBed.createComponent(TransfersContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the TransferStore on destroy (Hits ngOnDestroy branch)', () => {
    fixture.destroy();

    expect(mockTransferStore.reset).toHaveBeenCalled();
  });
});
