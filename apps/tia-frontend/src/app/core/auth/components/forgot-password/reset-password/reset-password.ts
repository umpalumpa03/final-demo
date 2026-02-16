import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, delay, EMPTY, finalize, tap } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { forgotPasswordSegments } from '../forgot-password.routes';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';

@Component({
  selector: 'app-reset-password',
  imports: [RegistrationForm, RouterLink, LibraryTitle, TranslatePipe],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly tokenService = inject(TokenService);
  private readonly translate = inject(TranslateService);

  public readonly isSubmitting = signal(false);
  public readonly buttonText = 'auth.reset-password.submit';
  public readonly title = 'auth.reset-password.title';
  public readonly subtitle = 'auth.reset-password.subtitle';

  ngOnInit(): void {
    if (!this.tokenService.resetPasswordToken) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.otp]);
    }
  }

  submit(formValue: IRegistrationForm): void {
    this.alertService.clearAlert();
    this.isSubmitting.set(true);
    const password = formValue.password;
    this.authService
      .createNewPassword(password)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        tap(() => {
          this.alertService.success(this.translate.instant('auth.reset-password.alerts.passwordUpdated'), {
            variant: 'dismissible',
            title: this.translate.instant('auth.reset-password.alerts.successTitle'),
          });
        }),
        delay(1500),
        tap(() => this.router.navigate(['/auth', ...forgotPasswordSegments.success])),
        catchError((error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 400) {
            this.alertService.error(
              this.translate.instant('auth.reset-password.alerts.unableToReset'),
              { variant: 'dismissible', title: this.translate.instant('auth.reset-password.alerts.errorTitle') },
            );
          } else {
            this.alertService.warning(
              this.translate.instant('auth.reset-password.alerts.somethingWentWrong'),
              { variant: 'dismissible', title: this.translate.instant('auth.reset-password.alerts.warningTitle') },
            );
          }
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
