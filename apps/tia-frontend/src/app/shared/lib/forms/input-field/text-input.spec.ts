import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './text-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { INPUT_ICONS } from '../config/text-input.icons';

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

  it('should compute configs, icons, and display values', () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.componentRef.setInput('config', {
      prefixIcon: 'p.svg',
      labelIconUrl: 'l.svg',
      id: 'my-id',
    });
    fixture.detectChanges();

    expect(component['mergedConfig']().id).toBe('my-id');
    expect(component['prefixIconUrl']()).toContain('p.svg');
    expect(component['labelIconUrl']()).toContain('l.svg');
    expect(component['messageId']()).toBe('my-id-msg');

    component['value'].set('hello');
    expect(component['getDisplayValue']()).toBe('hello');

    fixture.componentRef.setInput('type', 'date');
    component['value'].set('2025-05-10');
    expect(component['getDisplayValue']()).toBe('10/05/2025');

    component['value'].set('invalid-date');
    expect(component['getDisplayValue']()).toBe('invalid-date');

    fixture.componentRef.setInput('type', 'file');
    expect(component['getDisplayValue']()).toBe('');
  });

  it('should handle password toggles and caps lock', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component['inputType']()).toBe('password');
    component['togglePasswordVisibility']();
    expect(component['inputType']()).toBe('text');
    expect(component['suffixIconUrl']()).toContain(INPUT_ICONS.EYE_OFF);

    const keyEvent = new KeyboardEvent('keydown');
    vi.spyOn(keyEvent, 'getModifierState').mockReturnValue(true);
    component['checkCapsLock'](keyEvent);
    expect(component['isCapsLockOn']()).toBe(true);

    component['handleBlur'](new FocusEvent('blur'));
    expect(component['isCapsLockOn']()).toBe(false);
  });

  it('should handle date picker state and selection', () => {
    fixture.componentRef.setInput('type', 'date');
    expect(component['isDateType']()).toBe(true);

    component['toggleDatePicker']();
    expect(component['isDatePickerOpen']()).toBe(true);

    component['closeDatePicker']();
    expect(component['isDatePickerOpen']()).toBe(false);

    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    component['handleDateSelected']('2025-01-01');
    expect(component['value']()).toBe('2025-01-01');
    expect(emitSpy).toHaveBeenCalledWith('2025-01-01');
    expect(component['getDateValue']()).toBe('2025-01-01');
  });

  describe('Date Masking', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('type', 'date');
      fixture.detectChanges();
    });

    it('should format simple digits into DD/MM/YYYY', () => {
      const input = document.createElement('input');
      input.value = '01052025';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(input.value).toBe('01/05/2025');
      expect(component['value']()).toBe('2025-05-01');
    });

    it('should handle manual slash entry', () => {
      const input = document.createElement('input');
      input.value = '01/05/2025';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(input.value).toBe('01/05/2025');
      expect(component['value']()).toBe('2025-05-01');
    });

    it('should clamp day > 31', () => {
      const input = document.createElement('input');
      input.value = '35';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(input.value).toBe('31');
    });

    it('should clamp month > 12', () => {
      const input = document.createElement('input');
      input.value = '0115';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(input.value).toBe('01/12');
    });

    it('should clear model on empty input', () => {
      component['value'].set('2025-01-01');

      const input = document.createElement('input');
      input.value = '';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(component['value']()).toBe(null);
    });

    it('should handle slash input logic robustly', () => {
      const input = document.createElement('input');
      input.value = '35/15/2025';
      const event = { target: input } as any;

      component['handleInput'](event);

      expect(input.value).toBe('31/12/2025');
      expect(component['value']()).toBe('2025-12-31');
    });
  });

  it('should validate min/max dates', () => {
    fixture.componentRef.setInput('type', 'date');
    fixture.componentRef.setInput('config', {
      min: '2025-01-10',
      max: '2025-01-20',
    });
    fixture.detectChanges();

    component['value'].set('2025-01-01');
    component['validateDateInput']();
    expect(component['internalValidationErrors']()[0].type).toBe('min');

    component['value'].set('2025-01-25');
    component['validateDateInput']();
    expect(component['internalValidationErrors']()[0].type).toBe('max');

    component['value'].set('2025-01-15');
    component['validateDateInput']();
    expect(component['internalValidationErrors']().length).toBe(0);

    fixture.componentRef.setInput('type', 'text');
    component['setValidationErrors']([{ type: 'err', message: '' }]);
    component['validateDateInput']();
    expect(component['internalValidationErrors']().length).toBe(0);
  });
});
