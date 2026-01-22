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

  it('should override default config with user provided config', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.componentRef.setInput('config', {
      label: 'Custom Label',
      placeholder: 'Custom Placeholder',
    });
    fixture.detectChanges();

    const merged = component['mergedConfig']();
    expect(merged.label).toBe('Custom Label');
    expect(merged.placeholder).toBe('Custom Placeholder');
  });
});
