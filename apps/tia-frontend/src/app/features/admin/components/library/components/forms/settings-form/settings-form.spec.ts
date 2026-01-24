import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsForm } from './settings-form';
import { vi } from 'vitest';
import { Router } from '@angular/router';

describe('SettingsForm', () => {
  let component: SettingsForm;
  let fixture: ComponentFixture<SettingsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsForm],
      providers: [{ provide: Router, useValue: { navigate: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getters should return boolean values', () => {
    component.settingControl.setValue({
      plan: component.planOptions[0].value,
      email: true,
      push: false,
      sms: true,
    });

    expect(component.email).toBe(true);
    expect(component.push).toBe(false);
    expect(component.sms).toBe(true);
  });

  it('saveChange does not emit when invalid and marks touched', () => {
    const spy = vi.spyOn(component.twoColumnLayoutForm, 'emit');

    component.settingControl.setValue({ plan: null as any, email: true, push: false, sms: false });
    component.saveChange();

    expect(spy).not.toHaveBeenCalled();
    expect(component.settingControl.invalid).toBe(true);
  });

  it('getters return false when controls are missing', () => {
    (component.settingControl as any).removeControl('email');
    (component.settingControl as any).removeControl('push');
    (component.settingControl as any).removeControl('sms');

    expect(component.email).toBe(false);
    expect(component.push).toBe(false);
    expect(component.sms).toBe(false);
  });
});
