import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeButton } from './customize-button';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CustomizeButton', () => {
  let component: CustomizeButton;
  let fixture: ComponentFixture<CustomizeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizeButton, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeButton);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Test Label');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked output when clicked', () => {
    const spy = vi.spyOn(component.clicked, 'emit');

    const button = fixture.nativeElement.querySelector('div');
    button?.click();

    component.clicked.emit();
    expect(spy).toHaveBeenCalled();
  });
});
