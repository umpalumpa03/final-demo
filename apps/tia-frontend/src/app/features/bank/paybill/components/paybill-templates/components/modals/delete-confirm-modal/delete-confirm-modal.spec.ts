import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteConfirmModal } from './delete-confirm-modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteConfirmModal', () => {
  let component: DeleteConfirmModal;
  let fixture: ComponentFixture<DeleteConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmModal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('itemIdentifier', 'test-item-123');
    fixture.componentRef.setInput('submitVariant', 'primary');
    fixture.componentRef.setInput('submitLabel', 'Confirm');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct input values', () => {
    expect(component.itemIdentifier()).toBe('test-item-123');
    expect(component.submitVariant()).toBe('primary');
    expect(component.isLoading()).toBe(false);
  });

  it('should emit cancel when cancel is triggered', () => {
    const emitSpy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit submit when submit is triggered', () => {
    const emitSpy = vi.spyOn(component.submit, 'emit');
    component.submit.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should update state when isLoading changes', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });
});
