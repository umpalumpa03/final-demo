import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { TokenService } from '../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { AuthService } from '../../services/auth.service';
import { Routes } from '../../models/tokens.model';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader } from "../../shared/auth-header/auth-header";


@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, RegistrationForm, AlertTypesWithIcons, TranslatePipe, AuthHeader],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  providers: [TokenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private signUpService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  public errorMessage = signal<string>('');

  public onSignUp(signUpData: IRegistrationForm): void {    
    this.signUpService.isLoginLoading.set(true)
    this.signUpService
      .signUpUser(signUpData)
      .pipe(
        tap((res) => {
          if (res) this.tokenService.setSignUpToken(res.signup_token);

          this.errorMessage.set('');

          this.router.navigate([Routes.PHONE]);
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
        finalize(() => this.signUpService.isLoginLoading.set(false))
      )
    .subscribe();
  }
}
