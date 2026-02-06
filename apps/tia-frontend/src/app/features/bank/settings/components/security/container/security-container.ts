import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SecurityComponent } from '../components/security.component';
import { SecurityActions } from '../store/security.actions';
import * as SecuritySelectors from '../store/security.selectors';
import { DismissibleAlerts } from '@tia/shared/lib/alerts/components/dismissible-alerts/dismissible-alerts';
import { AlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SECURITY_FORM_CONFIG } from '../shared/config/security.config';


const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const form = control as FormGroup;
  const newPassword = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }

  return null;
};

@Component({
  selector: 'app-security-container',
  imports: [SecurityComponent, DismissibleAlerts],
  templateUrl: './security-container.html',
  styleUrl: './security-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityContainer implements OnDestroy {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);

  private alertTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public readonly isLoading = this.store.selectSignal(SecuritySelectors.selectSecurityLoading);
  public readonly error = this.store.selectSignal(SecuritySelectors.selectSecurityError);
  public readonly success = this.store.selectSignal(SecuritySelectors.selectSecuritySuccess);

  public constructor() {
    effect(() => {
      const error = this.error();
      const success = this.success();

      if (error || success) {
        if (this.alertTimeoutId) {
          clearTimeout(this.alertTimeoutId);
          this.alertTimeoutId = null;
        }

        this.alertTimeoutId = setTimeout(() => {
          if (error) {
            this.store.dispatch(SecurityActions.clearError());
          }
          if (success) {
            this.store.dispatch(SecurityActions.clearSuccess());
          }
          this.alertTimeoutId = null;
        }, 4000);
      }
    });
  }

  public readonly changePasswordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

  readonly currentPasswordConfig = computed(() => ({
    label: this.translate.instant(SECURITY_FORM_CONFIG.currentPassword.labelKey),
    placeholder: this.translate.instant(SECURITY_FORM_CONFIG.currentPassword.placeholderKey),
    required: true,
  }));

  readonly newPasswordConfig = computed(() => ({
    label: this.translate.instant(SECURITY_FORM_CONFIG.newPassword.labelKey),
    placeholder: this.translate.instant(SECURITY_FORM_CONFIG.newPassword.placeholderKey),
    required: true,
  }));

  readonly confirmPasswordConfig = computed(() => ({
    label: this.translate.instant(SECURITY_FORM_CONFIG.confirmPassword.labelKey),
    placeholder: this.translate.instant(SECURITY_FORM_CONFIG.confirmPassword.placeholderKey),
    required: true,
  }));

  public readonly alertType = computed<AlertType | null>(() => {
    if (this.error()) {
      return 'error';
    }

    if (this.success()) {
      return 'success';
    }

    return null;
  });

  public readonly alertMessage = computed<string>(() => {
    if (this.error()) {
      return this.error() ?? '';
    }

    if (this.success()) {
      return this.translate.instant('Password changed successfully');
    }

    return '';
  });

  public onChangePassword(event: { currentPassword: string; newPassword: string }): void {
    this.store.dispatch(
      SecurityActions.changePassword({
        currentPassword: event.currentPassword,
        newPassword: event.newPassword,
      })
    );
  }

  public ngOnDestroy(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
  }

  public onAlertClose(): void {
    if (this.alertTimeoutId) {
      clearTimeout(this.alertTimeoutId);
      this.alertTimeoutId = null;
    }
    this.store.dispatch(SecurityActions.clearError());
    this.store.dispatch(SecurityActions.clearSuccess());
  }
}
