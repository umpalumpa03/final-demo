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
import { catchError, EMPTY, finalize, merge, tap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../../services/auth.service';
import { Routes } from '../../../models/tokens.model';
import { AuthHeader } from '../../../shared/auth-header/auth-header';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-forgot-password-email',
  imports: [
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    AuthHeader,
    RouteLoader,
  ],
  templateUrl: './forgot-password-email.html',
  styleUrl: './forgot-password-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordEmail {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public readonly title = 'auth.forgot-password.title';
  public readonly subtitle = 'auth.forgot-password.subtitle';

  public readonly isSubmitting = computed(() => this.authService.isLoginLoading());
  public readonly submitError = signal<string | null>(null);

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
      label: 'Email',
      required: true,
      placeholder: 'your.email@example.com',
      errorMessage: hasError ? 'Enter valid email' : undefined,
    };
  });

  public submit(): void {
    this.submitError.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.authService.isLoginLoading.set(true);
    const { email } = this.form.getRawValue();
    this.authService
      .forgotPasswordRequest(email)
      .pipe(
        tap((response) => {
          this.authService.setChellangeId(response.challengeId);
          this.router.navigate([Routes.OTP_FORGOT_PASSWORD]);
        }),
        catchError((error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 404) {
            this.submitError.set(httpError.error?.message || 'User not found');
          } else if (httpError?.status === 400) {
            const message = httpError.error?.message;
            this.submitError.set(
              Array.isArray(message) ? message[0] : message || 'Invalid email',
            );
          } else {
            this.submitError.set(
              'Unable to send reset code. Please try again.',
            );
          }
          return EMPTY;
        }),
        finalize(() => this.authService.isLoginLoading.set(false))
      )
      .subscribe();
  }
}
