import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { forgotPasswordSegments } from '../forgot-password.routes';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';

@Component({
  selector: 'app-reset-password',
  imports: [RegistrationForm, RouterLink],
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
  public readonly buttonText = 'Reset Password';

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
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/auth', ...forgotPasswordSegments.success]);
        },
        error: (error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 400) {
            this.submitError.set('Unable to reset password. Please try again.');
          } else {
            this.submitError.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
