import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExternalAccounts } from './external-accounts';
import { Location } from '@angular/common';
import { TransferStore } from '../../../../store/transfers.store';
import { TransferExternalService } from '../../../../services/transfer.external.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('ExternalAccounts', () => {
  let component: ExternalAccounts;
  let fixture: ComponentFixture<ExternalAccounts>;

  const mockStore = {
    isLoading: signal(false),
    error: signal<string | null>(null),
    recipientInfo: signal<any>({ accounts: [] }),
    recipientInput: signal(''),
    recipientType: signal<string | null>(null),
    senderAccount: signal<any>(null),
    selectedRecipientAccount: signal<any>(null),
    setSelectedRecipientAccount: vi.fn(),
  };

  const mockExternalService = {
    isRecipientAccountDisabled: vi.fn().mockReturnValue(false),
    isSenderAccountDisabled: vi.fn().mockReturnValue(false),
    handleRecipientAccountSelect: vi.fn(),
    handleSenderAccountSelect: vi.fn(),
    handleContinue: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalAccounts, TranslateModule.forRoot()],
      providers: [
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: TransferStore, useValue: mockStore },
        provideMockStore({
          initialState: {
            products: {
              accounts: { accounts: [], isLoading: false, error: null },
            },
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ExternalAccounts, {
        set: {
          providers: [
            { provide: TransferExternalService, useValue: mockExternalService },
          ],
        },
      })
      .compileComponents();

    const translate = TestBed.inject(TranslateService);
    vi.spyOn(translate, 'get').mockReturnValue(of(''));
    vi.spyOn(translate, 'instant').mockReturnValue('');

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute accounts correctly', () => {
    mockStore.recipientInfo.set({ accounts: [{ id: '1' }] });
    fixture.detectChanges();
    expect(component.recipientAccounts().length).toBe(1);
  });

  it('should handle navigation back', () => {
    component.onGoBack();
    const loc = TestBed.inject(Location);
    expect(loc.back).toHaveBeenCalled();
  });
  it('should handle recipient account selection toggle', () => {
    const account = { id: '1' } as any;
    component.onRecipientAccountSelect(account);
    expect(mockExternalService.handleRecipientAccountSelect).toHaveBeenCalled();
  });

  it('should handle sender account selection', () => {
    const account = { id: 'sender-1' } as any;
    component.onSenderAccountSelect(account);
    expect(mockExternalService.handleSenderAccountSelect).toHaveBeenCalled();
  });

  it('should call handleContinue on service when continue is clicked', () => {
    component.onContinue();
    expect(mockExternalService.handleContinue).toHaveBeenCalled();
  });


  it('should show error state when store has error', () => {
    mockStore.error.set('Failed to load');
    fixture.detectChanges();
    expect(component.error()).toBe('Failed to load');
  });
});
