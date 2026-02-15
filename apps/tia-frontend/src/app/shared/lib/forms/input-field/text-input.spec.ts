import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './text-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('TextInput', () => {
  let component: TextInput;
  let fixture: ComponentFixture<TextInput>;

  const simulateInput = (value: string) => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    return input;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(TextInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute configs and icons correctly', () => {
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
  });

  it('should format display values correctly', () => {
    component['value'].set('hello');
    expect(component['getDisplayValue']()).toBe('hello');

    fixture.componentRef.setInput('type', 'date');
    component['value'].set('2025-05-10');
    expect(component['getDisplayValue']()).toBe('10/05/2025');

    fixture.componentRef.setInput('type', 'number');
    component['value'].set(123456789.99);
    expect(component['getDisplayValue']()).toBe('123456789.99');

    fixture.componentRef.setInput('type', 'file');
    expect(component['getDisplayValue']()).toBe('');
  });

  describe('Number Input Handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('type', 'number');
      fixture.detectChanges();
    });

    it('should force input type to "text" even if type is "number"', () => {
      expect(component['inputType']()).toBe('text');
    });

    it('should prevent invalid keys via keydown', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'e',
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');

      component['handleKeydown'](event);
      expect(preventSpy).toHaveBeenCalled();
    });

    it('should allow navigation keys', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'Backspace',
        cancelable: true,
      });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      component['handleKeydown'](event);
      expect(preventSpy).not.toHaveBeenCalled();
    });
  });

  describe('Date Input Handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('type', 'date');
      fixture.detectChanges();
    });

    it('should format simple input to dd/mm/yyyy', () => {
      const input = document.createElement('input');
      input.value = '01012023';
      const evt = { target: input, preventDefault: () => {} } as any;
      component['handleInput'](evt);

      expect(input.value).toBe('01/01/2023');
      expect(component['value']()).toBe('2023-01-01');
    });

    it('should clamp invalid day and month values', () => {
      const input = document.createElement('input');
      input.value = '35152023';
      const evt = { target: input } as any;
      component['handleInput'](evt);

      expect(input.value).toBe('31/12/2023');
      expect(component['value']()).toBe('2023-12-31');
    });

    it('should handle date selection from picker', () => {
      const spy = vi.spyOn(component.valueChange, 'emit');
      component['handleDateSelected']('2023-10-10');

      expect(component['value']()).toBe('2023-10-10');
      expect(spy).toHaveBeenCalledWith('2023-10-10');
      expect(component['isDatePickerOpen']()).toBe(false);
    });

    it('should toggle date picker visibility', () => {
      expect(component['isDatePickerOpen']()).toBe(false);

      component['toggleDatePicker']();
      expect(component['isDatePickerOpen']()).toBe(true);

      component['closeDatePicker']();
      expect(component['isDatePickerOpen']()).toBe(false);
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
  });

  it('should toggle password visibility', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component['inputType']()).toBe('password');

    component['togglePasswordVisibility']();
    expect(component['inputType']()).toBe('text');
    expect(component['showPasswordVisibility']()).toBe(true);
  });
});
