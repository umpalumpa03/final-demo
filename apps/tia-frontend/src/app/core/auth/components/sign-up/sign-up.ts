import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { TokenService } from '../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader } from '../../shared/auth-header/auth-header';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    RegistrationForm,
    TranslatePipe,
    AuthHeader,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  providers: [TokenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private errorMessageSignal = signal<string>('');

  @HostListener('window:keydown.enter', ['$event'])
  public handleKeyboardEvent(event: Event): void {
    event.preventDefault();
    this.onSignUp(this.partialData());
  }

  private partialData = signal<IRegistrationForm>({} as IRegistrationForm);

  public emailAvailability = signal<boolean | null>(null);
  public usernameAvailability = signal<boolean | null>(null);

  public currentEmail = signal<string | null>(null);
  public currentUsername = signal<string | null>(null);

  private usernameSource$ = new Subject<string>();
  private emailSource$ = new Subject<string>();

  constructor() {
    this.usernameSource$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((name) =>
          this.authService
            .isUsernameAvailable(name)
            .pipe(catchError(() => of({ available: false }))),
        ),
        tap((res) => this.usernameAvailability.set(res.available)),
        takeUntilDestroyed(),
      )
      .subscribe();

    this.emailSource$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((email) =>
          this.authService
            .isEmailAvailable(email)
            .pipe(catchError(() => of({ available: false }))),
        ),
        tap((res) => this.emailAvailability.set(res.available)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public handleCurrentUsername(username: string): void {
    if (username.length > 2) {
      this.usernameSource$.next(username);
    }
  }

  public handleCurrentEmail(email: string): void {
    if (email.includes('@') && email.includes('.')) {
      this.emailSource$.next(email);
    }
  }

  public listenInputedData(event: IRegistrationForm): void {
    this.partialData.set(event);
  }

  public onSignUp(signUpData: IRegistrationForm): void {
    this.authService.isLoginLoading.set(true);
    this.errorMessageSignal.set('');
    this.authService.signUpUser(signUpData).subscribe({
      next: (res: any) => {
        if (res && res.signup_token) {
          this.tokenService.setSignUpToken(res.signup_token);
          this.router.navigate(['/auth/phone']);
        }
        this.errorMessageSignal.set('');
        this.authService.isLoginLoading.set(false);
      },
      error: (err: any) => {
        let msg = 'An unexpected error occurred';
        if (err && err.error && err.error.message) {
          if (Array.isArray(err.error.message)) {
            if (err.error.message[0] === 'email must be an email') {
              msg = 'Invalid Email';
            } else {
              msg = err.error.message[0];
            }
          } else if (typeof err.error.message === 'string') {
            msg = err.error.message || msg;
          }
        }
        this.errorMessageSignal.set(msg);
        this.authService.isLoginLoading.set(false);
      },
    });
  }

  public errorMessage(): string {
    return this.errorMessageSignal();
  }
}
