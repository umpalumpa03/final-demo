import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Otp } from './otp';
import { TranslateModule } from '@ngx-translate/core';

describe('Otp', () => {
  let component: Otp;
  let fixture: ComponentFixture<Otp>;

  const getInputs = () => fixture.debugElement.queryAll(By.css('input'));
  const getInputNative = (index: number) => getInputs()[index].nativeElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otp, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Otp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle numeric input, filter non-digits, and move focus', () => {
    fixture.componentRef.setInput('config', { length: 6, inputType: 'number' });
    fixture.detectChanges();

    const firstInput = getInputNative(0);
    const secondInput = getInputNative(1);

    const focusSpy = vi.spyOn(secondInput, 'focus');

    firstInput.value = 'a';
    firstInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value().trim()).toBe('');

    firstInput.value = '5';
    firstInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value().trim()).toBe('5');
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should handle keyboard navigation (Arrows & Backspace)', () => {
    fixture.componentRef.setInput('value', '12');
    fixture.detectChanges();

    const inputs = getInputs();
    const input0 = inputs[0].nativeElement;
    const input1 = inputs[1].nativeElement;
    const input2 = inputs[2].nativeElement;

    const spy0 = vi.spyOn(input0, 'focus');
    const spy1 = vi.spyOn(input1, 'focus');

    inputs[0].triggerEventHandler('keydown', {
      key: 'ArrowRight',
      target: input0,
      preventDefault: () => {},
    });
    expect(spy1).toHaveBeenCalled();

    inputs[1].triggerEventHandler('keydown', {
      key: 'ArrowLeft',
      target: input1,
      preventDefault: () => {},
    });
    expect(spy0).toHaveBeenCalled();

    inputs[2].triggerEventHandler('keydown', {
      key: 'Backspace',
      target: input2,
      preventDefault: () => {},
    });

    expect(component.value().trim()).toBe('1');
    expect(spy1).toHaveBeenCalledTimes(2);
  });

  it('should handle pasting data', async () => {
    const firstInput = getInputs()[0];
    const mockPreventDefault = vi.fn();

    const mockClipboardEvent = {
      preventDefault: mockPreventDefault,
      clipboardData: {
        getData: () => '123456',
      },
    };

    firstInput.triggerEventHandler('paste', mockClipboardEvent);
    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.value().trim()).toBe('123456');
    expect(mockPreventDefault).toHaveBeenCalled();
  });
});
