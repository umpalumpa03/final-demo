import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Data, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthLayout } from '../auth-layout/auth-layout';
import { AuthService } from '../../../services/auth.service';
import { ForgotPasswordService } from '../../../services/forgot-password.service';

type OtpContext = 'sign-in' | 'sign-up' | 'forgot-password';

interface OtpSideItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface OtpLinkAction {
  label: string;
  route: string;
}

interface OtpViewData {
  title: string;
  subtitlePrefix: string;
  contactFallback: string;
  otpLabel: string;
  otpLength: number;
  primaryCta: string;
  showResend: boolean;
  backLink?: OtpLinkAction;
  secondaryAction?: OtpLinkAction;
  sideTitle: string;
  sideSubtitle: string;
  sideItems: OtpSideItem[];
}

const OTP_VIEW_DATA: Record<OtpContext, OtpViewData> = {
  'sign-in': {
    title: 'OTP Verification',
    subtitlePrefix: "We've sent a 6-digit code to",
    contactFallback: 'your email',
    otpLabel: 'Enter OTP Code',
    otpLength: 6,
    primaryCta: 'Verify OTP',
    showResend: true,
    secondaryAction: { label: 'Back to Sign In', route: '/auth/sign-in' },
    sideTitle: 'Almost There!',
    sideSubtitle: 'Enter the verification code to complete your sign in.',
    sideItems: [
      {
        icon: 'S',
        title: 'Two-Factor Security',
        subtitle: 'Extra layer of protection for your account',
      },
      {
        icon: 'M',
        title: 'Check Your Email',
        subtitle: 'Code sent to your registered email',
      },
    ],
  },
  'sign-up': {
    title: 'Enter Verification Code',
    subtitlePrefix: "We've sent a 6-digit code to",
    contactFallback: 'your phone number',
    otpLabel: 'Verification Code',
    otpLength: 6,
    primaryCta: 'Verify & Create Account',
    showResend: true,
    secondaryAction: { label: 'Change Phone Number', route: '/auth/sign-up' },
    sideTitle: 'Almost Done!',
    sideSubtitle: 'Enter the code to complete your registration.',
    sideItems: [
      {
        icon: 'S',
        title: 'Secure Verification',
        subtitle: 'Confirm your phone number',
      },
      {
        icon: 'F',
        title: 'Final Step',
        subtitle: "You're almost ready to get started",
      },
    ],
  },
  'forgot-password': {
    title: 'OTP Verification',
    subtitlePrefix: "We've sent a 4-digit code to",
    contactFallback: 'your email',
    otpLabel: 'Enter OTP Code',
    otpLength: 4,
    primaryCta: 'Verify OTP',
    showResend: true,
    backLink: { label: 'Back to Sign In', route: '/auth/sign-in' },
    sideTitle: 'Almost There!',
    sideSubtitle: 'Enter the verification code to complete your sign in.',
    sideItems: [
      {
        icon: 'S',
        title: 'Two-Factor Security',
        subtitle: 'Extra layer of protection for your account',
      },
      {
        icon: 'M',
        title: 'Check Your Email',
        subtitle: 'Code sent to your registered email',
      },
    ],
  },
};

@Component({
  selector: 'app-otp-verification',
  imports: [AuthLayout, Otp, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly forgotPasswordService = inject(ForgotPasswordService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly routeData = toSignal<Data | null>(this.route.data, {
    initialValue: null,
  });
  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly context = computed<OtpContext>(() => {
    const data = this.routeData() ?? this.route.snapshot.data ?? {};
    const raw = data['otpContext'];
    return (raw ?? 'sign-in') as OtpContext;
  });

  readonly viewData = computed(() => OTP_VIEW_DATA[this.context()]);

  readonly otpControl = this.fb.nonNullable.control('');
  readonly form = this.fb.nonNullable.group({
    otp: this.otpControl,
  });

  readonly isSubmitting = signal(false);
  readonly resendMessage = signal<string | null>(null);
  readonly resendStatus = signal<'success' | 'error' | null>(null);
  readonly otpError = signal<string | null>(null);

  readonly contactValue = computed(() => {
    const view = this.viewData();
    if (this.context() === 'forgot-password') {
      return this.forgotPasswordService.email() || view.contactFallback;
    }
    const params = this.queryParams();
    return (
      params.get('contact') ||
      params.get('email') ||
      params.get('username') ||
      view.contactFallback
    );
  });

  readonly otpLength = computed(() => this.viewData().otpLength);
  readonly otpConfig = computed<OtpConfig>(() => ({
    length: this.otpLength(),
    inputType: 'number',
  }));

  readonly otpErrorMessage = computed(() => this.otpError());

  constructor() {
    effect(() => {
      const length = this.otpLength();
      this.otpControl.setValidators([
        Validators.required,
        Validators.pattern(new RegExp(`^\\d{${length}}$`)),
      ]);
      this.otpControl.updateValueAndValidity({ emitEvent: false });
    });

    this.otpControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.otpError()) {
          this.otpError.set(null);
        }
      });
  }

  async ngOnInit(): Promise<void> {
    if (
      this.context() === 'forgot-password' &&
      !this.forgotPasswordService.challengeId()
    ) {
      await this.router.navigate(['/auth/forgot-password']);
      return;
    }

    if (this.context() === 'sign-in' && !this.authService.getChallengeId()) {
      await this.router.navigate(['/auth/sign-in']);
    }
  }

  async submit(): Promise<void> {
    this.otpError.set(null);
    this.form.markAllAsTouched();

    const otpValue = this.otpControl.value.trim();
    if (!otpValue) {
      this.otpError.set('OTP is required');
      return;
    }

    if (otpValue.length < this.otpLength()) {
      this.otpError.set(`OTP must be ${this.otpLength()} digits`);
      return;
    }

    if (this.form.invalid) {
      this.otpError.set(`OTP must be ${this.otpLength()} digits`);
      return;
    }

    this.isSubmitting.set(true);
    try {
      if (this.context() === 'forgot-password') {
        if (!this.forgotPasswordService.challengeId()) {
          await this.router.navigate(['/auth/forgot-password']);
          return;
        }

        const response = (await firstValueFrom(
          this.forgotPasswordService.verifyOtp(otpValue),
        )) as { access_token: string };

        this.forgotPasswordService.setAccessToken(response.access_token);
        await this.router.navigate(['/auth/forgot-password/reset']);
        return;
      }

      if (this.context() === 'sign-in') {
        if (!this.authService.getChallengeId()) {
          await this.router.navigate(['/auth/sign-in']);
          return;
        }

        const response = await firstValueFrom(this.authService.verifyMfa(otpValue));
        const accessToken =
          response?.access_token || response?.accessToken || response?.tokens?.access;
        const refreshToken =
          response?.refresh_token || response?.refreshToken || response?.tokens?.refresh;

        if (accessToken && refreshToken) {
          this.authService.setTokens(accessToken, refreshToken);
        }

        await this.router.navigate(['/bank']);
        return;
      }

      await this.router.navigate(['/auth/sign-in']);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 400) {
        this.otpError.set('Invalid OTP code');
      } else {
        this.otpError.set('Unable to verify OTP. Please try again.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async resendOtp(): Promise<void> {
    this.resendMessage.set(null);
    this.resendStatus.set(null);

    if (this.context() !== 'forgot-password') {
      this.resendMessage.set('Unable to resend OTP. Please try again.');
      this.resendStatus.set('error');
      return;
    }

    try {
      await firstValueFrom(this.forgotPasswordService.resendOtp());
      this.resendMessage.set('OTP code resent successfully.');
      this.resendStatus.set('success');
    } catch {
      this.resendMessage.set('Unable to resend OTP. Please try again.');
      this.resendStatus.set('error');
    }
  }
}
