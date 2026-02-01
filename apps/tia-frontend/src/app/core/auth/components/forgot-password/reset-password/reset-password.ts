import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
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
  private readonly tokenService = inject(TokenService);

  public readonly isSubmitting = signal(false);
  public readonly submitError = signal<string | null>(null);
  public readonly buttonText = 'auth.reset-password.submit';
  public readonly title = 'auth.reset-password.title';
  public readonly subtitle = 'auth.reset-password.subtitle';

  ngOnInit(): void {
    if (!this.tokenService.accessToken) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.otp]);
    }
  }

  submit(formValue: IRegistrationForm): void {
    this.submitError.set(null);
    this.isSubmitting.set(true);
    const password = formValue.password;
    this.authService
      .createNewPassword(password)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        tap(() => this.router.navigate(['/auth', ...forgotPasswordSegments.success])),
        catchError((error) => {
          const httpError = error as HttpErrorResponse;
          this.submitError.set(
            httpError?.status === 400
              ? 'Unable to reset password. Please try again.'
              : 'Something went wrong. Please try again.',
          );
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
