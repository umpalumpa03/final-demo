import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsForm } from './settings-form';
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';
import { Router } from '@angular/router';

describe('SettingsForm', () => {
  let component: SettingsForm;
  let fixture: ComponentFixture<SettingsForm>;

  beforeEach(async () => {
    const mockFormsDemo = {
      planOptions: () => ([]),
      validationForm: () => ({}),
      titles: () => ({
        contact: 'Contact',
        registration: 'Registration',
        settings: 'Settings',
        inline: 'Inline',
        validation: 'Validation',
        multiStep: 'MultiStep',
        layout: 'Layout',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsForm, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
