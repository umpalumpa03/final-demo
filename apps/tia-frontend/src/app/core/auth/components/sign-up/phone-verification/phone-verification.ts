import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Routes } from '../../../models/tokens.model';
import { Timer } from '../../../shared/timer/timer';


@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule, TextInput, ButtonComponent, Timer],
  templateUrl: './phone-verification.html',
  styleUrl: './phone-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerification {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public setPhoneNumberForm = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
  });

  public errorMessage = signal<string>('');

  public submit(): void {
    let telNumber = this.setPhoneNumberForm.getRawValue().phoneNumber;
    this.authService
      .sendPhoneVerificationCode(telNumber)
      .pipe(
        tap((res) => {
          this.errorMessage.set('');
          this.authService.setChellangeId(res.challengeId);
          this.router.navigate([Routes.OTP_SIGN_UP]);
        }),
        catchError((err) => {
          const messages = err.error?.message;
          this.errorMessage.set(messages);

          return EMPTY;
        }),
      )
      .subscribe();
  }
}