import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { TokenService } from '../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, RegistrationForm, Spinner],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  providers: [TokenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp implements OnInit {
  private signUpService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private destroyRef = inject(DestroyRef);

  public loadingState = signal<boolean>(true);
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadingState.set(false);
  }

  public onSignUp(signUpData: IRegistrationForm): void {
    this.loadingState.set(true);

    this.signUpService
      .signUpUser(signUpData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) this.tokenService.setSignUpToken(res.signup_token);

          this.loadingState.set(false);
          this.errorMessage.set('');

          this.router.navigate(['/auth/sign-up/otp']);
        }),

        catchError((err) => {
          const messages = err.error?.message;

          if (Array.isArray(messages)) {
            const invalidEmailError = 'email must be an email';

            if (messages[0] === invalidEmailError) {
              this.errorMessage.set('Invalid Email');
            } else {
              this.errorMessage.set(messages[0]);
            }
          } else if (typeof messages === 'string') {
            this.errorMessage.set(messages);
          } else {
            this.errorMessage.set('An unexpected error occurred');
          }

          return EMPTY;
        }),
      )
      .subscribe();
  }
}
