import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorizeModal } from './categorize-modal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CategorizeModal', () => {
  let component: CategorizeModal;
  let fixture: ComponentFixture<CategorizeModal>;
  let alertService: AlertService;
  let translateService: TranslateService;

  const mockAlertService = {
    success: vi.fn(),
  };

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [CategorizeModal, TranslateModule.forRoot()],
      providers: [
        { provide: AlertService, useValue: mockAlertService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorizeModal);
    component = fixture.componentInstance;
    
    alertService = TestBed.inject(AlertService);
    translateService = TestBed.inject(TranslateService); 
    vi.spyOn(translateService, 'instant').mockImplementation((key: string | string[], params?: any) => {
      if (key === 'transactions.categorize_modal.messages.success_added') {
        return `Category ${params?.name} added`;
      }
      return key as string;
    });

    fixture.componentRef.setInput('selectCategoryOptions', [
      { label: 'Food', value: '1' },
    ]);

    fixture.componentRef.setInput('transaction', { id: 'tx-1' } as any);

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save event only if form is valid', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.form.patchValue({ categoryId: null });
    component.onSave();
    expect(emitSpy).not.toHaveBeenCalled();

    component.form.patchValue({ categoryId: '1' });
    component.onSave();

    expect(emitSpy).toHaveBeenCalledWith({
      transactionId: 'tx-1',
      categoryId: '1',
    });
  });

  it('should emit cancel event', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle category creation flow', () => {
    const emitSpy = vi.spyOn(component.createCategory, 'emit');
    const name = 'Gym';

    component.form.controls.newCategoryName.setValue(name);

    component.onCategoryCreate();

    expect(emitSpy).toHaveBeenCalledWith(name);

    expect(component.form.controls.newCategoryName.value).toBe(null);

    expect(mockAlertService.success).toHaveBeenCalledWith(
      expect.stringContaining(name),
      expect.any(Object),
    );
  });
});