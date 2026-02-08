import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './text-input';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TextInput', () => {
  let component: TextInput;
  let fixture: ComponentFixture<TextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput, ReactiveFormsModule],
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
});
