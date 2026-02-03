import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  of,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { RegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/registration-form/registration-form';
import { TokenService } from '../../services/token.service';
import { IRegistrationForm } from 'apps/tia-frontend/src/app/features/storybook/components/forms/models/contact-forms.model';
import { AuthService } from '../../services/auth.service';
import { Routes } from '../../models/tokens.model';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthHeader } from '../../shared/auth-header/auth-header';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-sign-up',
  imports: [
    RouterLink,
    RegistrationForm,
    AlertTypesWithIcons,
    TranslatePipe,
    AuthHeader,
    RouteLoader,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  providers: [TokenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp implements OnInit {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private destroyRef = inject(DestroyRef);

  public loadingState = signal<boolean>(true);
  public errorMessage = signal<string>('');

  @HostListener('window:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSignUp(this.partialData());
    }
  }

  private partialData = signal<IRegistrationForm>({} as IRegistrationForm);

  public emailAvailability = signal<boolean | null>(null);
  public usernameAvailability = signal<boolean | null>(null);

  public currentEmail = signal<string | null>(null);
  public currentUsername = signal<string | null>(null);

  private usernameSource$ = new Subject<string>();
  private emailSource$ = new Subject<string>();

 constructor() {
  this.usernameSource$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(name => this.authService.isUsernameAvailable(name).pipe(
      catchError(() => of({ available: false }))
    )),
    tap(res => this.usernameAvailability.set(res.available)),
    takeUntilDestroyed()
  ).subscribe();

  this.emailSource$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(email => this.authService.isEmailAvailable(email).pipe(
      catchError(() => of({ available: false }))
    )),
    tap(res => this.emailAvailability.set(res.available)),
    takeUntilDestroyed()
  ).subscribe();
}

  public handleCurrentUsername(username: string) {
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

  ngOnInit(): void {
    this.loadingState.set(false);
  }

  public onSignUp(signUpData: IRegistrationForm): void {
    this.loadingState.set(true);

    this.authService
      .signUpUser(signUpData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          if (res) this.tokenService.setSignUpToken(res.signup_token);

          this.loadingState.set(false);
          this.errorMessage.set('');

          this.router.navigate([Routes.PHONE]);
        }),

        catchError((err) => {
          const messages = err.error?.message;
          this.loadingState.set(false);

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
