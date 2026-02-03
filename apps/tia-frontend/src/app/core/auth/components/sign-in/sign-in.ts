import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Routes } from '../../models/tokens.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import {
  ALERTS_DISMISSIBLE_DATA,
  SIGN_IN_FORM,
} from '../../config/inputs.config';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { AuthHeader } from '../../shared/auth-header/auth-header';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-sign-in',
  imports: [
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    RouterLink,
    SimpleAlerts,
    TranslatePipe,
    AuthHeader,
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  public signUpRoute = Routes.SIGN_UP;
  public forgotPasswordRoute = Routes.ROTGOT_PASSWORD;
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  public alertTypes = ALERTS_DISMISSIBLE_DATA;
  public isRouteLoading = signal(false);
  public errorMessage = computed(() => {
    this.alertTypes.error.message = 'Incorrect Credentials';
    return this.authService.errorMessage();
  });

  @HostListener('window:keydown.enter', ['$event'])
  public handleKeydownEvent(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  public signInConfig = toSignal(
    this.translate.onLangChange.pipe(
      startWith({
        lang: this.translate.getCurrentLang(),
        translation: null,
      }),
      map(() => {
        return translateConfig(SIGN_IN_FORM, (key) =>
          this.translate.instant(key),
        );
      }),
    ),
    {
      initialValue: translateConfig(SIGN_IN_FORM, (key) =>
        this.translate.instant(key),
      ),
    },
  );

  public loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
    password: ['', Validators.required],
  });

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.loginPostRequest(this.loginForm.getRawValue()).subscribe();
  }

  public navigateToSignUp(event: Event): void {
    event.preventDefault();

    if (this.isRouteLoading()) {
      return;
    }

    this.isRouteLoading.set(true);
    this.router
      .navigateByUrl(this.signUpRoute)
      .finally(() => this.isRouteLoading.set(false));
  }
}
