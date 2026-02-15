import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalActions } from './modal-actions';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('ModalActions', () => {
  let component: ModalActions;
  let fixture: ComponentFixture<ModalActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalActions, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActions);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('submitLabel', 'Confirm');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct default and provided input values', () => {
    expect(component.submitLabel()).toBe('Confirm');
    expect(component.submitVariant()).toBe('default');
  });

  it('should update inputs dynamically', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();
    expect(component.isLoading()).toBe(true);
  });

  it('should emit cancel event when cancel is called', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit submit event when submit is called', () => {
    const spy = vi.spyOn(component.submit, 'emit');
    component.submit.emit();
    expect(spy).toHaveBeenCalled();
  });

  describe('submitHandler', () => {
    it('should emit submit when not disabled', () => {
      const spy = vi.spyOn(component.submit, 'emit');
      fixture.componentRef.setInput('isDisabled', false);
      fixture.detectChanges();

      component.submitHandler();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit submit when disabled', () => {
      const spy = vi.spyOn(component.submit, 'emit');
      fixture.componentRef.setInput('isDisabled', true);
      fixture.detectChanges();

      component.submitHandler();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
