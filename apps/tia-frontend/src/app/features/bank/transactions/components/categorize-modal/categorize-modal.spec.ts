import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorizeModal } from './categorize-modal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CATEGORIZE_MODAL_CONFIG } from '../../config/categorize-modal.config';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('CategorizeModal', () => {
  let component: CategorizeModal;
  let fixture: ComponentFixture<CategorizeModal>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [
        CategorizeModal,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategorizeModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('selectCategoryOptions', [
      { label: 'Food', value: '1' },
    ]);

    fixture.componentRef.setInput('transaction', { id: 'tx-1' } as any);

    fixture.detectChanges();
  });

  afterEach(() => {
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
    expect(component.successMessage()).toBeTruthy();

    fixture.detectChanges();
    vi.advanceTimersByTime(CATEGORIZE_MODAL_CONFIG.successMessageDuration);
    fixture.detectChanges();

    expect(component.successMessage()).toBeNull();
  });
});
