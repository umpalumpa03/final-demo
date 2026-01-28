import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';

@Component({
  selector: 'app-otp-verification',
  imports: [
    ButtonComponent,
    TextInput,
    ReactiveFormsModule,
    ButtonComponent,
    Spinner,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  //ამაზე კომპონენტზე რივიუ არ მიიღებაა დასამთავრებელია დდ
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public errorMessage = signal<string>('');

  private registerVerifyLogic = signal<boolean>(true);

  ///ბექააა
  public isLoading = computed(() => this.authService.isLoginLoading());

  public otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern('^\\d*$')]],
  });

  public verifyOtp(): void {
    this.authService
      .verifyMfa({
        ...this.otpForm.getRawValue(),
        challengeId: this.authService.getChallengeId(),
      })
      .subscribe();
  }
  /////////

  // Mock Version got code length:4, In task: 6
  public smsCodeVerificationForm = this.fb.nonNullable.group({
    verificationCode: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  public ngOnInit(): void {
    const path = this.route.snapshot.url[0].path;
    if (path === 'sign-in') {
      this.registerVerifyLogic.set(false);
    } else if (path === 'sign-up') {
      this.registerVerifyLogic.set(true);
    }
  }

  public submit(): void {
    if (this.registerVerifyLogic()) {
      this.registerVerification();
    }
  }

  private registerVerification(): void {
    if (this.smsCodeVerificationForm.invalid) {
      this.smsCodeVerificationForm.markAllAsTouched();
      return;
    }

    const { verificationCode } = this.smsCodeVerificationForm.getRawValue();

    this.authService
      .verifyOtpCode(verificationCode)
      .pipe(
        tap((res) => {
          this.router.navigate(['/auth/success']);
        }),
        catchError((err) => {
          const messages = err.error?.message;
          this.errorMessage.set(messages);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public resendVerification():void {
    this.authService
      .resendVerificationCode()
      .pipe(
        take(1),
        tap((res) => console.log(res)),
      )
      .subscribe();
  }

  public goBack(): void {
    this.router.navigate(['auth/sign-up/phone']);
  }
}
