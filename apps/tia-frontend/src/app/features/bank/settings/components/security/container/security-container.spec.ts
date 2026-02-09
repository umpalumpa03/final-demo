import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityContainer } from './security-container';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { vi } from 'vitest';
import * as SecuritySelectors from '../store/security.selectors';
import { SecurityActions } from '../store/security.actions';
import { AlertService } from '@tia/core/services/alert/alert.service';

describe('SecurityContainer', () => {
  let component: SecurityContainer;
  let fixture: ComponentFixture<SecurityContainer>;
  let store: MockStore;
  let translate: TranslateService;
  let mockAlertService: any;

  const refresh = () => (store.refreshState(), fixture.detectChanges());

  beforeEach(async () => {
    mockAlertService = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SecurityContainer, TranslateModule.forRoot()],
      providers: [
        provideMockStore({
          selectors: [
            { selector: SecuritySelectors.selectSecurityLoading, value: false },
            { selector: SecuritySelectors.selectSecurityError, value: null },
            { selector: SecuritySelectors.selectSecuritySuccess, value: false },
          ],
        }),
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(SecurityContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create + passwordMismatch validator works', () => {
    expect(component).toBeTruthy();

    const f = component.changePasswordForm;
    f.patchValue({ currentPassword: 'a', newPassword: 'newPassword123', confirmPassword: 'x' });
    f.updateValueAndValidity();
    expect(f.hasError('passwordMismatch')).toBe(true);

    f.patchValue({ confirmPassword: 'newPassword123' });
    f.updateValueAndValidity();
    expect(f.hasError('passwordMismatch')).toBe(false);
  });



  it('dispatches changePassword action', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.onChangePassword({ currentPassword: 'c', newPassword: 'n' });

    expect(spy).toHaveBeenCalledWith(
      SecurityActions.changePassword({ currentPassword: 'c', newPassword: 'n' }),
    );
  });

  it('should compute alertType as error when error exists', () => {
    store.overrideSelector(SecuritySelectors.selectSecurityError, 'Test error');
    store.overrideSelector(SecuritySelectors.selectSecuritySuccess, false);
    refresh();

    expect(mockAlertService.error).toHaveBeenCalledWith(
      'Test error',
      { variant: 'dismissible', title: 'Oops!' },
    );
  });

  it('should compute alertMessage from error when error exists', () => {
    store.overrideSelector(
      SecuritySelectors.selectSecurityError,
      'Test error message',
    );
    store.overrideSelector(SecuritySelectors.selectSecuritySuccess, false);
    refresh();

    expect(mockAlertService.error).toHaveBeenCalledWith(
      'Test error message',
      { variant: 'dismissible', title: 'Oops!' },
    );
  });

  it('should show success alert when success is true', () => {
    const translateSpy = vi
      .spyOn(translate, 'instant')
      .mockReturnValue('Password changed successfully');

    store.overrideSelector(SecuritySelectors.selectSecurityError, null);
    store.overrideSelector(SecuritySelectors.selectSecuritySuccess, true);
    refresh();

    expect(translateSpy).toHaveBeenCalledWith(
      'settings.security.passwordChangedSuccessfully',
    );
    expect(mockAlertService.success).toHaveBeenCalledWith(
      'Password changed successfully',
      { variant: 'dismissible', title: 'Success!' },
    );
  });
});
