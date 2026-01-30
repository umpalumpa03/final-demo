import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { SecurityComponent } from '../components/security.component';
import { SecurityActions } from '../store/security.actions';
import * as SecuritySelectors from '../store/security.selectors';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { AlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { TranslateService } from '@ngx-translate/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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
  imports: [SecurityComponent, AlertTypesWithIcons],
  templateUrl: './security-container.html',
  styleUrl: './security-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityContainer {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);


  public readonly isLoading = this.store.selectSignal(SecuritySelectors.selectSecurityLoading);
  public readonly error = this.store.selectSignal(SecuritySelectors.selectSecurityError);
  public readonly success = this.store.selectSignal(SecuritySelectors.selectSecuritySuccess);

  public readonly changePasswordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

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
}
