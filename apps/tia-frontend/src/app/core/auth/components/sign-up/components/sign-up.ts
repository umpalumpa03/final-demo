import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { SignUpService } from '../services/sign-up.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { TokenService } from '../../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, RegistrationForm],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private signUpService = inject(SignUpService);
  private tokenService = inject(TokenService);
  private router = inject(Router)
  
  private destroyRef = inject(DestroyRef);

  // Loading State
  public apiResult = signal<string>('Idle');


  public onSignUp(signUpData: IRegistrationForm): void {
    this.apiResult.set('Checking...');

    this.signUpService
      .signUpUser(signUpData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.apiResult.set('Complete');
          if (res)
            // 
            this.tokenService.setSignUpToken(res.signup_token)

            this.apiResult.set('Complete');

            // 🚀
            this.router.navigate(['/auth/sign-up/otp']);
        }),

        catchError((err) => {
          const messages = err.error?.message;

          if (Array.isArray(messages)) {
            // 🚩🚩 
            const invalidEmailError = "email must be an email"

            if(messages[0] === invalidEmailError) {
              this.apiResult.set('Invalid Email');
            } else {
              this.apiResult.set(messages[0]);
            }
          } else if (typeof messages === 'string') {
            this.apiResult.set(messages);
          } else {
            this.apiResult.set('An unexpected error occurred');
          }

          // --
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
