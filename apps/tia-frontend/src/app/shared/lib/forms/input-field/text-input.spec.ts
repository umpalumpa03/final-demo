import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './text-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TextInput', () => {
  let component: TextInput;
  let fixture: ComponentFixture<TextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default configuration based on type', () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.detectChanges();

    const config = component['mergedConfig']();
    expect(config).toBeDefined();
  });

  it('should manage Caps Lock state correctly', () => {
    const capsOnEvent = new KeyboardEvent('keydown');
    vi.spyOn(capsOnEvent, 'getModifierState').mockImplementation(
      (key) => key === 'CapsLock',
    );

    (component as any).checkCapsLock(capsOnEvent);
    expect((component as any).isCapsLockOn()).toBe(true);

    const capsOffEvent = new KeyboardEvent('keydown');
    vi.spyOn(capsOffEvent, 'getModifierState').mockReturnValue(false);

    (component as any).checkCapsLock(capsOffEvent);
    expect((component as any).isCapsLockOn()).toBe(false);

    (component as any).isCapsLockOn.set(true);
    const blurEvent = new FocusEvent('blur');

    (component as any).handleBlur(blurEvent);

    expect((component as any).isCapsLockOn()).toBe(false);
  });

  describe('Date Validation', () => {
    it('should validate min date constraint', () => {
      fixture.componentRef.setInput('type', 'date');
      fixture.componentRef.setInput('config', { min: '2023-01-01' });
      fixture.detectChanges();

      const event = { target: { value: '2022-12-31', type: 'date' } } as any;

      component['handleInput'](event);

      const errors = component['internalValidationErrors']();
      expect(errors.length).toBe(1);
      expect(errors[0].type).toBe('min');
    });

    it('should validate max date constraint', () => {
      fixture.componentRef.setInput('type', 'date');
      fixture.componentRef.setInput('config', { max: '2023-12-31' });
      fixture.detectChanges();

      const event = { target: { value: '2024-01-01', type: 'date' } } as any;
      component['handleInput'](event);

      const errors = component['internalValidationErrors']();
      expect(errors.length).toBe(1);
      expect(errors[0].type).toBe('max');
    });

    it('should clear errors when input becomes valid or empty', () => {
      fixture.componentRef.setInput('type', 'date');
      fixture.componentRef.setInput('config', { min: '2023-01-01' });
      fixture.detectChanges();

      let event = { target: { value: '2020-01-01', type: 'date' } } as any;
      component['handleInput'](event);
      expect(component['internalValidationErrors']().length).toBe(1);

      event = { target: { value: '', type: 'date' } } as any;
      component['handleInput'](event);
      expect(component['internalValidationErrors']().length).toBe(0);
    });
  });
});
