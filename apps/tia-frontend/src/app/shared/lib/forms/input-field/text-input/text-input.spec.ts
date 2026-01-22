import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInput } from './text-input';
import { By } from '@angular/platform-browser';
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

  it('should render correct input type', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.type).toBe('email');
  });

  it('should toggle password visibility', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component['showPasswordVisibility']()).toBe(false);
    component.togglePasswordVisibility();
    expect(component['showPasswordVisibility']()).toBe(true);
  });

  it('should display label and required star', () => {
    fixture.componentRef.setInput('config', { label: 'Test', required: true });
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.text-input__label'));
    expect(label.nativeElement.textContent).toContain('Test');
  });

  it('should disable input when state is disabled', () => {
    fixture.componentRef.setInput('state', 'disabled');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBe(true);
  });

  it('should handle input events', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component['value']()).toBe('test');
  });

  it('should merge default config with custom config', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.componentRef.setInput('config', { label: 'Custom' });
    fixture.detectChanges();

    const merged = component['mergedConfig']();
    expect(merged.label).toBe('Custom');
  });

  it('should show password toggle button', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const toggleBtn = fixture.debugElement.query(
      By.css('.text-input__icon--suffix'),
    );
    expect(toggleBtn).toBeTruthy();
  });

  it('should set aria-invalid when in error state', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes['aria-invalid']).toBe('true');
  });

  it('should link input to helper text via aria-describedby', () => {
    fixture.componentRef.setInput('config', { helperText: 'Help me' });
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    const message = fixture.debugElement.query(By.css('.text-input__message'));

    const describedBy = input.attributes['aria-describedby'];
    const messageId = message.attributes['id'];

    expect(describedBy).toBeTruthy();
    expect(describedBy).toBe(messageId);
  });
});

describe('TextInput Configuration Coverage', () => {
  let component: TextInput;
  let fixture: ComponentFixture<TextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInput, ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(TextInput);
    component = fixture.componentInstance;
  });

  it('should cover type-to-config mapping for all types', () => {
    const types: any[] = ['email', 'password', 'search', 'tel', 'url', 'date'];

    types.forEach((type) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();
      const config = component['mergedConfig']();
      expect(config.icon || config.placeholder).toBeTruthy();
    });
  });

  it('should cover password visibility toggle logic', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    expect(component['inputType']()).toBe('password');
    component.togglePasswordVisibility();
    expect(component['inputType']()).toBe('text');
    component.togglePasswordVisibility();
    expect(component['inputType']()).toBe('password');
  });

  it('should use empty object when type config does not exist', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.componentRef.setInput('config', { label: 'Test' });
    fixture.detectChanges();

    const merged = component['mergedConfig']();
    expect(merged.label).toBe('Test');
  });

  it('should compute inputType for non-password types', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();

    expect(component['inputType']()).toBe('email');
  });
});
