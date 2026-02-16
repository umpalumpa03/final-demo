import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, delay, EMPTY, finalize, merge, tap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Routes } from '../../../models/tokens.model';
import { AuthHeader } from '../../../shared/auth-header/auth-header';

@Component({
  selector: 'app-forgot-password-email',
  imports: [
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    AuthHeader,
  ],
  templateUrl: './forgot-password-email.html',
  styleUrl: './forgot-password-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordEmail {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  public readonly title = 'auth.forgot-password.title';
  public readonly subtitle = 'auth.forgot-password.subtitle';

  public readonly isSubmitting = computed(() =>
    this.authService.isLoginLoading(),
  );

  public readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  private readonly formVersion = signal(0);

  constructor() {
    merge(this.form.valueChanges, this.form.statusChanges)
      .pipe(
        tap(() => this.formVersion.update((v) => v + 1)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public readonly emailConfig = computed(() => {
    this.formVersion();
    const control = this.form.controls.email;
    const hasError = control.hasError('required') || control.hasError('email');

    return {
      label: this.translate.instant('auth.forgot-password.emailInputLabel'),
      required: true,
      placeholder: this.translate.instant('auth.forgot-password.emailPlaceholder'),
      errorMessage: hasError ? this.translate.instant('auth.forgot-password.emailError') : undefined,
    };
  });

  public submit(): void {
    this.alertService.clearAlert();
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.authService.isLoginLoading.set(true);
    const { email } = this.form.getRawValue();
    this.authService
      .forgotPasswordRequest(email)
      .pipe(
        tap((response) => {
          this.authService.setChellangeId(response.challengeId);
          this.alertService.success(this.translate.instant('auth.forgot-password.alerts.resetCodeSent'), {
            variant: 'dismissible',
            title: this.translate.instant('auth.forgot-password.alerts.successTitle'),
          });
        }),
        delay(1500),
        tap(() => this.router.navigate([Routes.OTP_FORGOT_PASSWORD])),
        catchError((error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 404) {
            this.alertService.error(
              httpError.error?.message || this.translate.instant('auth.forgot-password.alerts.userNotFound'),
              { variant: 'dismissible', title: this.translate.instant('auth.forgot-password.alerts.errorTitle') },
            );
          } else if (httpError?.status === 400) {
            const message = httpError.error?.message;
            this.alertService.error(
              Array.isArray(message) ? message[0] : message || this.translate.instant('auth.forgot-password.alerts.invalidEmail'),
              { variant: 'dismissible', title: this.translate.instant('auth.forgot-password.alerts.errorTitle') },
            );
          } else {
            this.alertService.warning(
              this.translate.instant('auth.forgot-password.alerts.unableToSendCode'),
              { variant: 'dismissible', title: this.translate.instant('auth.forgot-password.alerts.warningTitle') },
            );
          }
          return EMPTY;
        }),
        finalize(() => this.authService.isLoginLoading.set(false)),
      )
      .subscribe();
  }
}
