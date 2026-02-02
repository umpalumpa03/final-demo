import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verify } from './verify';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('Verify', () => {
  let component: Verify;
  let fixture: ComponentFixture<Verify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Verify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit verify with code when form is valid', () => {
    const spy = vi.spyOn(component.verify, 'emit');
    component.form.controls.otp.setValue('123456');
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith('123456');
  });

  it('should emit cancel', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });
});
